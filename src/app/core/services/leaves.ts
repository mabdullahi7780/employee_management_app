import { Injectable } from '@angular/core';
import { LeaveRequest } from '../models/leave-req';

@Injectable({
  providedIn: 'root'
})
export class Leaves {
  private maxLeaves = 30;
  private leaveBalances: { [employeeId: string]: number } = {};
  private leaveRequests: LeaveRequest[] = [];

  constructor() {
    this.loadRequests();
    this.loadBalances();
  }

  private loadRequests() {
    const data = localStorage.getItem('leave_requests');
    this.leaveRequests = data ? JSON.parse(data) : [];
  }

  private saveRequests() {
    localStorage.setItem('leave_requests', JSON.stringify(this.leaveRequests));
  }

  private loadBalances() {
    const data = localStorage.getItem('leave_balances');
    this.leaveBalances = data ? JSON.parse(data) : {};
  }

  private saveBalances() {
    localStorage.setItem('leave_balances', JSON.stringify(this.leaveBalances));
  }

  initializeLeave(employeeId: string): void {
    if (!(employeeId in this.leaveBalances)) {
      this.leaveBalances[employeeId] = this.maxLeaves;
      this.saveBalances();
    }
  }

  getRemainingLeaves(employeeId: string): number {
    return this.leaveBalances[employeeId] ?? this.maxLeaves;
  }

  getMaxLeaves(): number {
    return this.maxLeaves;
  }

  getAllRequests(): LeaveRequest[] {
    this.loadRequests();
    return [...this.leaveRequests]; // Return a copy to avoid direct mutation
  }

  submitLeaveRequest(request: LeaveRequest) {
    const reqWithDate = {
      ...request,
      status: 'Pending' as const,
      submittedOn: new Date().toISOString()
    };
    this.leaveRequests.push(reqWithDate);
    this.saveRequests();
    console.log('Leave request submitted:', reqWithDate);
  }

  approveRequest(index: number) {
    this.loadRequests(); // Ensure we have the latest data
    
    if (index >= 0 && index < this.leaveRequests.length) {
      const req = this.leaveRequests[index];
      console.log('Approving request:', req);
      
      if (req.status === 'Pending') {
        // Initialize employee leave balance if not exists
        this.initializeLeave(req.empId);
        
        // Check if employee has enough leave balance
        if (this.leaveBalances[req.empId] >= req.days) {
          // Deduct leave days from balance
          this.leaveBalances[req.empId] -= req.days;
          req.status = 'Approved';
          
          // Save both requests and balances
          this.saveRequests();
          this.saveBalances();
          
          console.log(`Request approved. Remaining balance for ${req.empId}: ${this.leaveBalances[req.empId]}`);
        } else {
          alert(`Insufficient leave balance. Employee ${req.empId} has only ${this.leaveBalances[req.empId]} days remaining.`);
        }
      } else {
        console.log('Request is not in pending status:', req.status);
      }
    } else {
      console.error('Invalid request index:', index);
    }
  }

  rejectRequest(index: number) {
    this.loadRequests(); // Ensure we have the latest data
    
    if (index >= 0 && index < this.leaveRequests.length) {
      const req = this.leaveRequests[index];
      console.log('Rejecting request:', req);
      
      if (req.status === 'Pending') {
        req.status = 'Rejected';
        this.saveRequests();
        console.log('Request rejected successfully');
      } else {
        console.log('Request is not in pending status:', req.status);
      }
    } else {
      console.error('Invalid request index:', index);
    }
  }

  getAllBalances(): { [employeeId: string]: number } {
    this.loadBalances();
    return { ...this.leaveBalances }; // Return a copy
  }

  // Method to get employee's leave requests
  getEmployeeRequests(employeeId: string): LeaveRequest[] {
    this.loadRequests();
    return this.leaveRequests.filter(req => req.empId === employeeId);
  }
}