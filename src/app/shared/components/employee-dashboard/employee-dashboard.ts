import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Leaves } from '../../../core/services/leaves';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router'; 
import { FormsModule } from '@angular/forms';

// ✅ Declare bootstrap globally for TypeScript to recognize it
declare var bootstrap: any;

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [
    CommonModule,  
    RouterModule,
    FormsModule
  ],
  templateUrl: './employee-dashboard.html',
  styleUrls: ['./employee-dashboard.css']
})
export class EmployeeDashboard implements OnInit {
  fullName = localStorage.getItem('user_name');
  employee_id = localStorage.getItem('emp_id');
  department = localStorage.getItem('department');
  title = localStorage.getItem('emp_title');
  email = localStorage.getItem('emp_email');
  image = localStorage.getItem('emp_image');
  employee_role = localStorage.getItem('emp_role') ?? '';

  router = inject(Router);

  // Form fields
  leaveDays: number = 0;
  leaveReason: string = '';
  leaveEmpId: string = this.employee_id ?? '';
  lastLeaveRequest: any = null;
  showDropdown = false;

  constructor(public leaves: Leaves) {}

  ngOnInit() {
    const empId = this.employee_id ?? 'emp_101';
    this.leaves.initializeLeave(empId);
    console.log(this.leaves.getRemainingLeaves(empId));
    this.updateLastLeaveRequest();
  }

  submitRequest() {
    const leaveRequest = {
      empId: this.leaveEmpId,
      days: this.leaveDays,
      reason: this.leaveReason,
      status: "Pending" as const
    };

    this.leaves.submitLeaveRequest(leaveRequest);
    console.log('Leave Request Submitted:', leaveRequest);

    this.leaveDays = 0;
    this.leaveReason = '';

    // Blur focused button to avoid aria-hidden focus warning
    (document.activeElement as HTMLElement)?.blur();

    // Simulate click on modal close button
    const closeBtn = document.querySelector('#leaveRequestModal .btn-close') as HTMLElement;
    closeBtn?.click();

    this.updateLastLeaveRequest();
  }

  updateLastLeaveRequest() {
    const allRequests = this.leaves.getAllRequests();
    const empRequests = allRequests
      .filter(req => req.empId === this.employee_id)
      .sort((a, b) => (b.submittedOn || '').localeCompare(a.submittedOn || ''));
    this.lastLeaveRequest = empRequests.length > 0 ? empRequests[0] : null;
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  closeDropdown() {
    this.showDropdown = false;
  }

  logout() {
    // Clear all user data from localStorage
    localStorage.removeItem('login_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_name');
    localStorage.removeItem('emp_id');
    localStorage.removeItem('department');
    localStorage.removeItem('emp_title');
    localStorage.removeItem('emp_email');
    localStorage.removeItem('emp_image');
    
    // Navigate to login page
    this.router.navigateByUrl('/login');
  }

  adminDashboard() {
    this.router.navigateByUrl('/admin_dashboard');
  }

  // Method to refresh leave balance after approval/rejection
  refreshData() {
    this.updateLastLeaveRequest();
    // Force re-initialization to get updated balance
    const empId = this.employee_id ?? 'emp_101';
    this.leaves.initializeLeave(empId);
  }
}