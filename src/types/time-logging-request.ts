export enum TimeLoggingRequestType {
  PROJECT_WORKPACKAGE = 'project_workpackage',
  INTERNAL_TASK = 'internal_task'
}

export enum TimeLoggingRequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  ADJUSTED_AND_APPROVED = 'adjusted_and_approved'
}

export interface Employee {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  bexioId?: number;
}

export interface Manager {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface TimeLoggingRequest {
  id: number;
  employeeId: number;
  employee?: Employee;
  requestType: TimeLoggingRequestType;
  
  // Project/WorkPackage details (for project requests)
  projectId?: number;
  projectName?: string;
  workPackageId?: number;
  workPackageName?: string;
  
  // Internal task details (for internal task requests)
  internalTaskId?: number;
  internalTaskName?: string;
  
  // Requested time details
  requestedDate: string;
  requestedStartTime: string;
  requestedEndTime: string;
  breakMinutes?: number;
  
  // Request details
  reason: string;
  description?: string;
  
  // Status tracking
  status: TimeLoggingRequestStatus;
  
  // Manager response (when approved/rejected)
  managerId?: number;
  manager?: Manager;
  
  // Adjusted time details (if manager adjusts)
  adjustedDate?: string;
  adjustedStartTime?: string;
  adjustedEndTime?: string;
  adjustedBreakMinutes?: number;
  
  // Manager response details
  managerNotes?: string;
  reviewedAt?: string;
  
  // Generated time sheet entry ID (if approved)
  generatedTimeSheetId?: number;
  
  // System fields
  createdAt: string;
  updatedAt: string;
}

export interface CreateTimeLoggingRequest {
  employeeId: number;
  requestType: TimeLoggingRequestType;
  // Project/WorkPackage fields (for project requests)
  projectId?: number;
  projectName?: string;
  workPackageId?: number;
  workPackageName?: string;
  // Internal task fields (for internal task requests)
  internalTaskId?: number;
  internalTaskName?: string;
  // Time details
  requestedDate: string;
  requestedStartTime: string;
  requestedEndTime: string;
  breakMinutes?: number;
  // Request details
  reason: string;
  description?: string;
}

export interface UpdateTimeLoggingRequest {
  requestType?: TimeLoggingRequestType;
  projectId?: number;
  projectName?: string;
  workPackageId?: number;
  workPackageName?: string;
  internalTaskId?: number;
  internalTaskName?: string;
  requestedDate?: string;
  requestedStartTime?: string;
  requestedEndTime?: string;
  breakMinutes?: number;
  reason?: string;
  description?: string;
}

export interface TimeLoggingRequestFilters {
  employeeId?: number;
  managerId?: number;
  status?: TimeLoggingRequestStatus;
  requestType?: TimeLoggingRequestType;
  startDate?: string;
  endDate?: string;
}