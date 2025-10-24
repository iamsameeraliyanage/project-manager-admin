export interface Leave {
  id: number;
  employeeId: number;
  employee: {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
  };
  leaveTypeId?: number;
  leaveType?: LeaveType;
  leaveName: string;
  startDate: string;
  endDate: string;
  numberOfDays: number;
  status: LeaveStatus;
  requestType: LeaveRequestType;
  reason?: string;
  rejectionReason?: string;
  approvedById?: number;
  approvedBy?: {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
  };
  approvedAt?: string;
  createdById: number;
  createdBy: {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
  };
  isAddedForQuota: boolean;
  visibleToEmployee: boolean;
  isHalfDay: boolean;
  halfDayPeriod?: HalfDayPeriod;
  createdAt: string;
  updatedAt: string;
}

export interface LeaveType {
  id: number;
  name: string;
  description: string;
  maxDaysPerYear?: number;
  eligibleForYearQuota: boolean;
  isVisibleForEmployee: boolean;
  requiresApproval: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum LeaveStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  CANCELLED = "cancelled",
}

export enum LeaveRequestType {
  EMPLOYEE_REQUEST = "employee_request",
  MANAGER_ADDED = "manager_added",
}

export enum HalfDayPeriod {
  MORNING = "morning",
  AFTERNOON = "afternoon",
}

export interface CreateLeaveRequest {
  employeeId?: number;
  leaveTypeId?: number;
  leaveName: string;
  startDate: string;
  endDate: string;
  numberOfDays: number;
  reason?: string;
  requestType?: LeaveRequestType;
  isAddedForQuota?: boolean;
  visibleToEmployee?: boolean;
  isHalfDay?: boolean;
  halfDayPeriod?: HalfDayPeriod;
}

export interface UpdateLeaveStatusRequest {
  status: LeaveStatus;
  rejectionReason?: string;
  approvedById?: number;
}
