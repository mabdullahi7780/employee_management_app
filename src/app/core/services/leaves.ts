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
  }

  private loadRequests() {
    const data = localStorage.getItem('leave_requests');
    this.leaveRequests = data ? JSON.parse(data) : [];
  }

  private saveRequests() {
    localStorage.setItem('leave_requests', JSON.stringify(this.leaveRequests));
  }

  initializeLeave(employeeId: string): void {
    if (!(employeeId in this.leaveBalances)) {
      this.leaveBalances[employeeId] = this.maxLeaves;
    }
  }

  getRemainingLeaves(employeeId: string): number {
    return this.leaveBalances[employeeId] ?? this.maxLeaves;
  }
  getMaxLeaves():number{
    return this.maxLeaves;
  }
   getAllRequests(): LeaveRequest[] {
    this.loadRequests();
    return this.leaveRequests;
  }
   submitLeaveRequest(request: LeaveRequest) {
    const reqWithDate = {
      ...request,
      status: 'Pending' as const,
      submittedOn: new Date().toISOString()
    };
    this.leaveRequests.push(reqWithDate);
    this.saveRequests();
  }
  approveRequest(index: number) {
    this.loadRequests();
    const req = this.leaveRequests[index];
    if (req.status === 'Pending' && this.leaveBalances[req.empId] >= req.days) {
      this.leaveBalances[req.empId] -= req.days;
      req.status = 'Approved';
      this.saveRequests();
    }
  }

  rejectRequest(index: number) {
    this.loadRequests();
    this.leaveRequests[index].status = 'Rejected';
    this.saveRequests();
  }

  getAllBalances(): { [employeeId: string]: number } {
    return this.leaveBalances;
  }
  
}
