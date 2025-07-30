import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Leaves } from '../../../core/services/leaves';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
  ],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboard implements OnInit {
  adminName = localStorage.getItem('user_name');
  adminEmail = localStorage.getItem('emp_email');
  adminImage = localStorage.getItem('emp_image');
  employee_id = localStorage.getItem('emp_id');
  employee_department = localStorage.getItem('department');
  employee_title = localStorage.getItem('emp_title');

  req_list: any[] = [];
  showDropdown = false;


  constructor(public leaves: Leaves, private router: Router) {}

  ngOnInit() {
    const empId = this.employee_id ?? 'default_emp_id';
    this.leaves.initializeLeave(empId);
    console.log(this.leaves.getRemainingLeaves(empId));

    this.req_list = this.leaves.getAllRequests();
  }

  approve(index: number) {
    console.log('Approving request at index:', index);
    this.leaves.approveRequest(index);
    this.req_list = this.leaves.getAllRequests();
    console.log('Updated request list:', this.req_list);
  }

  reject(index: number) {
    console.log('Rejecting request at index:', index);
    this.leaves.rejectRequest(index);
    this.req_list = this.leaves.getAllRequests();
    console.log('Updated request list:', this.req_list);
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
  employeeDashboard() {
    this.router.navigateByUrl('/employee_dashboard');
  }
}