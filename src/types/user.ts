export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface Employee {
  id: number;
  salutation_type: string;
  firstname: string;
  lastname: string;
  email: string;
  is_superadmin: boolean;
  is_accountant: boolean;
  isLocalAdmin: boolean;
}

export interface InternalTask {
  id: number;
  name: string;
  isActive: boolean;
}

export interface Project {
  id: number;
  nr: string;
  name: string;
  contact_id: number;
  contact_sub_id: number | null;
  user_id: number;
  currency_id: number;
  estimated_hours: number;
  start_date: string;
  end_date: string | null;
  type: "internal" | "external";
  state: "active" | "inactive";
  comment: string | null;
  metadata?: ProjectMetadata;
}

export interface ProjectMetadata {
  id: number;
  bexioProjectId: number;
  searchKeywords?: Record<string, any>;
  priority: "low" | "medium" | "high" | string;
  department?: string;
  color?: string;
}

export interface WorkPackage {
  id: number;
  name: string;
  estimated_time_in_hours: number;
  spentMinutes: number;
  packageTimeSheet?: PackageTimeSheet;
}

export interface PackageTimeSheet {
  id: number;
  projectId: number;
  workPackageId: number;
}

export interface EmployeeWorkPackageTimeSheet {
  id: number;
  projectId: number;
  projectName: string;
  packageId: number;
  packageName: string;
  employeeId: number;
  startTime: string;
  endTime: string | null;
  progress: number | null;
  status: string | null;
  isFinalized: boolean;
  attentionNeeded: boolean;
  hasAttended: boolean;
  hasCreatedInBexio: boolean;
  estimatedTimeInHours?: number;
  packageTotalMinutes?: number;
}

export interface EmployeeInternalTaskTimeSheet {
  id: number;
  internalTask: {
    id: number;
    name: string;
  };
  employeeId: number;
  startTime: string;
  endTime: string | null;
  comment: string | null;
}

export interface EmployeeDailyBreak {
  breakDate: string;
  totalDurationMinutes: number;
}

export interface EmployeeBreak {
  id: number;
  employeeId: number;
  breakDate: string;
  startTime: string;
  endTime: string | null;
  durationMinutes: number | null;
  autoClosed: boolean;
  packageTimeSheetId?: number;
  internalTaskTimeSheetId?: number;
}

export interface ProductivityData {
  date: Date;
  productivity: number | null;
}

export interface DailyProductivityData {
  date: Date;
  productiveMinutes: number;
  unproductiveMinutes: number;
}
