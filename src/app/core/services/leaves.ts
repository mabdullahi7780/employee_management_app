import { Injectable } from '@angular/core';
import { LeaveRequest } from '../models/leave-req';

@Injectable({
  providedIn: 'root'
})
export class Leaves {
  private maxLeaves = 30;
  private leaveBalances: { [employeeId: string]: number } = {};
  private leaveRequests: LeaveRequest[] = [];
  constructor() {}

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
    return this.leaveRequests;
  }
   submitLeaveRequest(request: LeaveRequest) {
    this.leaveRequests.push({ ...request, status: 'Pending' });
  }
  approveRequest(index: number) {
    const req = this.leaveRequests[index];
    if (req.status === 'Pending' && this.leaveBalances[req.empId] >= req.days) {
      this.leaveBalances[req.empId] -= req.days;
      req.status = 'Approved';
    }
  }

  rejectRequest(index: number) {
    this.leaveRequests[index].status = 'Rejected';
  }

  getAllBalances(): { [employeeId: string]: number } {
    return this.leaveBalances;
  }
  
}
