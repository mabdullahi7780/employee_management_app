import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // if you plan to add filters or form inputs
import { RouterModule } from '@angular/router';
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
  adminName = localStorage.getItem('emp_name');
  adminEmail = localStorage.getItem('emp_email');
  adminImage = localStorage.getItem('emp_image');
  employee_id = localStorage.getItem('emp_id');

  req_list: any[] = []; // ✅ declare but don't initialize with leaves yet

  constructor(public leaves: Leaves) {}

  ngOnInit() {
    const empId = this.employee_id ?? 'default_emp_id';
    this.leaves.initializeLeave(empId);
    console.log(this.leaves.getRemainingLeaves(empId));

    this.req_list = this.leaves.getAllRequests(); // ✅ initialize here
  }

  approve(index: number) {
    this.leaves.approveRequest(index);
    this.req_list = this.leaves.getAllRequests();
  }

  reject(index: number) {
    this.leaves.rejectRequest(index);
    this.req_list = this.leaves.getAllRequests();
  }
}

