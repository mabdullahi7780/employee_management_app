import { Router } from "@angular/router";
import { Leaves } from "../services/leaves";

export interface LeaveRequest {
  empId: string;
  reason: string;
  days: number;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export class LeaveReqComponent {
  constructor(private leaves: Leaves, private router: Router) {}

  numberOfDays = 1;
  reason = '';
  employeeId = `${localStorage.getItem('emp_id')!}`;

  submitRequest() {
    this.leaves.submitLeaveRequest({
      empId: this.employeeId,
      reason: this.reason,
      days: this.numberOfDays,
      status: 'Pending' as const
    });
    
    alert('Leave request submitted successfully!');
    this.router.navigate(['/employee_dashboard']);
  }
}
