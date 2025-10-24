import type {
  DailyProductivityData,
  Employee,
  EmployeeBreak,
  EmployeeDailyBreak,
  EmployeeInternalTaskTimeSheet,
  EmployeeWorkPackageTimeSheet,
  InternalTask,
  ProductivityData,
  Project,
  User,
  WorkPackage,
} from "../types/user";
import type { Leave, LeaveType, CreateLeaveRequest } from "../types/leave";
import { ENV_API_BASE_URL } from "./base-url";
import API from "./axios-client";
import type { LoginRequest, LoginResponse } from "../types/authentication";
import { AxiosError } from "axios";
import type { KPIProject } from "../types/finance";
import type { ProjectIdWithColor } from "../utils/projectColorConfigs";

const API_BASE_URL = `${ENV_API_BASE_URL}/api`;

export const loginMutationFn = async (
  data: LoginRequest
): Promise<LoginResponse> => {
  const response = await API.post("/auth/login", data);
  return response.data;
};

export const getCurrentUserQueryFn = async (): Promise<User> => {
  const response = await API.get(`${API_BASE_URL}/users/current`);
  return response.data;
};

export const getEmployeesQueryFn = async (): Promise<Employee[]> => {
  const response = await API.get(`${API_BASE_URL}/employees`);
  return response.data;
};

export const getCombinedActiveSessionsQueryFn = async () => {
  const response = await API.get(
    `${API_BASE_URL}/admin-service/timesheets/combined-active-sessions`
  );
  return response.data;
};

export const getLastMonthsQuoteAnalyticsQueryFn = async (months: number) => {
  const response = await API.get(
    `${API_BASE_URL}/admin-service/quotes/analytics/last-months/${months}`
  );
  return response.data;
};

export const getLastMonthsInvoiceAnalyticsQueryFn = async (months: number) => {
  const response = await API.get(
    `${API_BASE_URL}/admin-service/invoices/analytics/last-months/${months}`
  );
  return response.data;
};

export const getInternalTasksQueryFn = async (): Promise<InternalTask[]> => {
  const response = await API.get(`${API_BASE_URL}/internal-tasks`);
  return response.data;
};

export const getProjectsQueryFn = async (): Promise<Project[]> => {
  const response = await API.get(`${API_BASE_URL}/factory-service/projects`);
  return response.data;
};

export const getProjectByIdQueryFn = async (id: number): Promise<Project> => {
  const response = await API.get(
    `${API_BASE_URL}/factory-service/projects/${id}`
  );
  return response.data;
};

export const getWorkPackagesQueryFn = async (
  projectId: number
): Promise<WorkPackage[]> => {
  const response = await API.get(
    `${API_BASE_URL}/factory-service/projects/${projectId}/packages`
  );
  // Filter out work packages with estimated time in hours of 0 as those are just items
  return response.data.filter(
    (workPackage: WorkPackage) => workPackage.estimated_time_in_hours !== 0
  );
};

export const getWorkPackageByIdQueryFn = async (
  projectId: number,
  workPackageId: number,
  employeeId?: number,
  includeTrackedTime?: boolean
): Promise<WorkPackage> => {
  const url = `${API_BASE_URL}/factory-service/projects/${projectId}/packages/${workPackageId}`;
  const response = await API.get(url, {
    params: {
      employee_id: employeeId,
      includeTrackedTime: includeTrackedTime,
    },
  });
  return response.data;
};

export const getEmployeeWorkPackageTimeSheetQueryFn = async (
  projectId: number,
  workPackageId: number,
  employeeId: number,
  status?: string
): Promise<EmployeeWorkPackageTimeSheet> => {
  const response = await API.get(
    `${API_BASE_URL}/factory-service/projects/${projectId}/packages/${workPackageId}/time-sheets`,
    {
      params: { employee_id: employeeId, status },
    }
  );
  return response.data;
};

export const getEmployeeTimeSheetsQueryFn = async (
  employeeId: number,
  numberOfSheets: number
): Promise<EmployeeWorkPackageTimeSheet[]> => {
  const response = await API.get(
    `${API_BASE_URL}/factory-service/project-time-sheets/${employeeId}`,
    {
      params: { numberOfTimeSheets: numberOfSheets },
    }
  );
  return response.data;
};

export const getCombinedTimeSheetsQueryFn = async (
  employeeId: number,
  numberOfSheets: number
): Promise<any[]> => {
  const response = await API.get(
    `${API_BASE_URL}/factory-service/combined-time-sheets/${employeeId}`,
    {
      params: { numberOfTimeSheets: numberOfSheets },
    }
  );
  return response.data;
};

export const createInternalTaskTimeSheetQueryFn = async ({
  internalTaskId,
  employeeId,
}: {
  internalTaskId: number;
  employeeId: number;
}): Promise<any> => {
  const response = await API.post(
    `${API_BASE_URL}/factory-service/internal-tasks/${internalTaskId}/time-sheets`,
    {},
    { params: { employee_id: employeeId } }
  );
  return response.data;
};

export const checkOutInternalTaskTimeSheetQueryFn = async ({
  internalTaskId,
  employeeId,
}: {
  internalTaskId: number;
  employeeId: number;
}): Promise<any> => {
  const response = await API.post(
    `${API_BASE_URL}/factory-service/internal-tasks/${internalTaskId}/time-sheets/checkout`,
    {},
    { params: { employee_id: employeeId } }
  );
  return response.data;
};

export const createEmployeeWorkPackageTimeSheetQueryFn = async ({
  projectId,
  workPackageId,
  employeeId,
}: {
  projectId: number;
  workPackageId: number;
  employeeId: number;
}): Promise<EmployeeWorkPackageTimeSheet> => {
  const response = await API.post(
    `${API_BASE_URL}/factory-service/projects/${projectId}/packages/${workPackageId}/time-sheets`,
    {},
    {
      params: { employee_id: employeeId },
    }
  );
  return response.data;
};

export const checkOutEmployeeWorkPackageTimeSheetQueryFn = async ({
  projectId,
  workPackageId,
  employeeId,
}: {
  projectId: number;
  workPackageId: number;
  employeeId: number;
}): Promise<EmployeeWorkPackageTimeSheet> => {
  const response = await API.post(
    `${API_BASE_URL}/factory-service/projects/${projectId}/packages/${workPackageId}/time-sheets/checkout`,
    {},
    {
      params: { employee_id: employeeId },
    }
  );
  return response.data;
};

export const getEmployeeInternalTaskTimeSheetQueryFn = async (
  internalTaskId: number,
  employeeId: number,
  status?: string
): Promise<EmployeeWorkPackageTimeSheet[]> => {
  const response = await API.get(
    `${API_BASE_URL}/factory-service/internal-tasks/${internalTaskId}/time-sheets`,
    {
      params: { employee_id: employeeId, status },
    }
  );
  return response.data;
};

export const createEmployeeInternalTaskTimeSheetQueryFn = async ({
  internalTaskId,
  employeeId,
}: {
  internalTaskId: number;
  employeeId: number;
}): Promise<EmployeeWorkPackageTimeSheet> => {
  const response = await API.post(
    `${API_BASE_URL}/factory-service/internal-tasks/${internalTaskId}/time-sheets`,
    {},
    {
      params: { employee_id: employeeId },
    }
  );
  return response.data;
};

export const checkOutEmployeeInternalTaskTimeSheetQueryFn = async ({
  internalTaskId,
  employeeId,
}: {
  internalTaskId: number;
  employeeId: number;
}): Promise<EmployeeWorkPackageTimeSheet> => {
  const response = await API.post(
    `${API_BASE_URL}/factory-service/internal-tasks/${internalTaskId}/time-sheets/checkout`,
    {},
    {
      params: { employee_id: employeeId },
    }
  );
  return response.data;
};

export const getEmployeeDailyBreaksQueryFn = async (
  employeeId: number
): Promise<EmployeeDailyBreak[]> => {
  const response = await API.get(
    `${API_BASE_URL}/factory-service/employee-breaks/${employeeId}`
  );
  return response.data;
};

export const getDailyEmployeeBreaksQueryFn = async (
  employeeId: number,
  startDate: string,
  endDate: string
): Promise<EmployeeDailyBreak[]> => {
  const response = await API.get(
    `${API_BASE_URL}/factory-service/daily-breaks/${employeeId}`,
    {
      params: { start_date: startDate, end_date: endDate },
    }
  );
  return response.data;
};

export const getEmployeeLastBreakQueryFn = async (
  employeeId: number
): Promise<EmployeeBreak> => {
  const response = await API.get(
    `${API_BASE_URL}/factory-service/employee-breaks/${employeeId}/last`
  );
  return response.data;
};

export const createEmployeeBreakQueryFn = async (
  employeeId: number
): Promise<EmployeeBreak> => {
  const response = await API.post(
    `${API_BASE_URL}/factory-service/employee-breaks/${employeeId}`,
    {}
  );
  return response.data;
};

export const checkOutEmployeeBreakQueryFn = async (
  employeeId: number
): Promise<EmployeeBreak> => {
  const response = await API.post(
    `${API_BASE_URL}/factory-service/employee-breaks/${employeeId}/checkout`,
    {}
  );
  return response.data;
};

export const autoEndEmployeeBreakQueryFn = async (
  employeeId: number
): Promise<{ autoEnded: boolean }> => {
  const response = await API.post(
    `${API_BASE_URL}/factory-service/employee-breaks/${employeeId}/auto-end`,
    {}
  );
  return response.data;
};

export const getEmployeeTodayBreakQueryFn = async (
  employeeId: number
): Promise<number> => {
  const response = await API.get(
    `${API_BASE_URL}/factory-service/employee-breaks/${employeeId}/today`
  );
  return response.data;
};

export const getEmployeeProductivityQueryFn = async (
  employeeId: number,
  startDate: string,
  endDate: string
): Promise<ProductivityData[]> => {
  const response = await API.get(
    `${API_BASE_URL}/factory-service/productivity/${employeeId}`,
    {
      params: { start_date: startDate, end_date: endDate },
    }
  );
  return response.data;
};

export const getEmployeeDailyProductivityQueryFn = async (
  employeeId: number,
  startDate: string,
  endDate: string
): Promise<DailyProductivityData[]> => {
  const response = await API.get(
    `${API_BASE_URL}/factory-service/daily-productivity/${employeeId}`,
    {
      params: { start_date: startDate, end_date: endDate },
    }
  );
  return response.data;
};

export const getEmployeeCumulativeProductivityQueryFn = async (
  employeeId: number,
  startDate: string,
  endDate: string
): Promise<number> => {
  const response = await API.get(
    `${API_BASE_URL}/factory-service/cumulative-productivity/${employeeId}`,
    {
      params: { start_date: startDate, end_date: endDate },
    }
  );
  return response.data;
};

export const getEmployeeInternalTaskTimeSheetsQueryFn = async ({
  employeeId,
  startDate,
  endDate,
  today,
  date,
}: {
  employeeId: number;
  startDate?: string;
  endDate?: string;
  today?: boolean;
  date?: string;
}): Promise<EmployeeInternalTaskTimeSheet[]> => {
  const response = await API.get(
    `${API_BASE_URL}/factory-service/internal-task-time-sheets/${employeeId}`,
    {
      params: { start_date: startDate, end_date: endDate, today, date },
    }
  );
  return response.data;
};

export const getEmployeeWorkPackageTimeSheetsQueryFn = async (
  employeeId: number,
  startDate: string,
  endDate: string
): Promise<EmployeeWorkPackageTimeSheet[]> => {
  const response = await API.get(
    `${API_BASE_URL}/factory-service/project-time-sheets/${employeeId}`,
    {
      params: { start_date: startDate, end_date: endDate },
    }
  );
  return response.data;
};

export const updateTimeSheetQueryFn = async (
  timeSheetId: number,
  updateData: {
    progress?: string;
    status?: string;
    attentionNeeded?: boolean;
    hasAttended?: boolean;
  }
): Promise<EmployeeWorkPackageTimeSheet> => {
  const response = await API.post(
    `${API_BASE_URL}/factory-service/project-time-sheets/${timeSheetId}/update`,
    updateData
  );
  return response.data;
};

export const getTodayTimeSheets = async (
  employeeId: number,
  date?: string
): Promise<EmployeeWorkPackageTimeSheet[]> => {
  const response = await API.get(
    `${API_BASE_URL}/factory-service/project-time-sheets/${employeeId}`,
    {
      params: date ? { date } : { today: true },
    }
  );
  return response.data;
};

export const bulkUpdateTimeSheetsQueryFn = async (
  updates: Array<{
    timeSheetId: number;
    progress?: string;
    status?: string;
    attentionNeeded?: boolean;
    hasAttended?: boolean;
    remarks?: string;
  }>
): Promise<EmployeeWorkPackageTimeSheet[]> => {
  const response = await API.post(
    `${API_BASE_URL}/factory-service/project-time-sheets/bulk-update`,
    { updates }
  );
  return response.data;
};

export const bulkUpdateInternalTaskTimeSheetsQueryFn = async (
  updates: Array<{
    timeSheetId: number;
    comment?: string;
    isFinalized?: boolean;
  }>
): Promise<EmployeeInternalTaskTimeSheet[]> => {
  const response = await API.post(
    `${API_BASE_URL}/factory-service/internal-task-time-sheets/bulk-update`,
    { updates }
  );
  return response.data;
};

export const closeEmployeeTimeSheetQueryFn = async (
  timeSheetId: number
): Promise<string> => {
  const response = await API.post(
    `${API_BASE_URL}/factory-service/employee-time-sheets/${timeSheetId}`,
    {}
  );
  return response.data;
};

// Leave Management API Functions
export const getAllLeavesQueryFn = async (): Promise<Leave[]> => {
  const response = await API.get(`${API_BASE_URL}/leaves`);
  return response.data;
};

export const getLeavesByEmployeeQueryFn = async (
  employeeId: number
): Promise<Leave[]> => {
  const response = await API.get(
    `${API_BASE_URL}/leaves/employee/${employeeId}`
  );
  return response.data;
};

export const getVisibleLeavesByEmployeeQueryFn = async (
  employeeId: number
): Promise<Leave[]> => {
  const response = await API.get(
    `${API_BASE_URL}/leaves/employee/${employeeId}/visible`
  );
  return response.data;
};

export const getMyLeavesQueryFn = async (): Promise<Leave[]> => {
  const response = await API.get(`${API_BASE_URL}/leaves/my-leaves`);
  return response.data;
};

export const getPendingLeavesQueryFn = async (): Promise<Leave[]> => {
  const response = await API.get(`${API_BASE_URL}/leaves/pending`);
  return response.data;
};

export const getLeaveByIdQueryFn = async (id: number): Promise<Leave> => {
  const response = await API.get(`${API_BASE_URL}/leaves/${id}`);
  return response.data;
};

export const createLeaveQueryFn = async (
  data: CreateLeaveRequest
): Promise<Leave> => {
  const response = await API.post(`${API_BASE_URL}/leaves`, data);
  return response.data;
};

export const createLeaveForEmployeeQueryFn = async (
  data: CreateLeaveRequest
): Promise<Leave> => {
  const response = await API.post(
    `${API_BASE_URL}/leaves/create-for-employee`,
    data
  );
  return response.data;
};

export const updateLeaveStatusQueryFn = async (
  id: number,
  data: { status: string; rejectionReason?: string }
): Promise<Leave> => {
  const response = await API.put(`${API_BASE_URL}/leaves/${id}/status`, data);
  return response.data;
};

export const cancelLeaveQueryFn = async (id: number): Promise<Leave> => {
  const response = await API.put(`${API_BASE_URL}/leaves/${id}/cancel`);
  return response.data;
};

// Calculate leave days with breakdown
export const calculateLeaveDaysWithBreakdownQueryFn = async (
  employeeId: number,
  startDate: string,
  endDate: string,
  isHalfDay?: boolean
): Promise<{
  totalCalendarDays: number;
  weekendDays: number;
  offDaysFromSchedule: number;
  adjustedWorkingDays: number;
}> => {
  try {
    const params: any = { startDate, endDate };
    if (isHalfDay !== undefined) {
      params.isHalfDay = isHalfDay;
    }

    const response = await API.get(
      `${API_BASE_URL}/leaves/calculate-days/${employeeId}`,
      { params }
    );
    return response.data;
  } catch (error) {
    console.error("Error calculating leave days breakdown:", error);
    throw error;
  }
};

export const getLeaveBalanceQueryFn = async (
  employeeId: number,
  leaveTypeId: number
): Promise<number> => {
  const response = await API.get(
    `${API_BASE_URL}/leaves/balance/${employeeId}/${leaveTypeId}`
  );
  return response.data;
};

// Leave Types API Functions
export const getAllLeaveTypesQueryFn = async (): Promise<LeaveType[]> => {
  const response = await API.get(`${API_BASE_URL}/leaves/types/all`);
  return response.data;
};

export const getEmployeeVisibleLeaveTypesQueryFn = async (): Promise<
  LeaveType[]
> => {
  const response = await API.get(
    `${API_BASE_URL}/leaves/types/employee-visible`
  );
  return response.data;
};

export const getLeaveTypeByIdQueryFn = async (
  id: number
): Promise<LeaveType> => {
  const response = await API.get(`${API_BASE_URL}/leaves/types/${id}`);
  return response.data;
};

export const safeDeleteLeaveTypeMutationFn = async (
  id: number
): Promise<unknown> => {
  const response = await API.delete(`${API_BASE_URL}/leaves/types/${id}/safe`);
  return response.data;
};

export interface EmployeeAnnualLeaveSummary {
  employeeId: number;
  year: number;
  annualQuota: number;
  takenLeaves: number;
  pendingLeaves: number;
  pendingApprovalLeaves: number;
  remainingLeaves: number;
  leaveBreakdown: {
    approved: number;
    pending: number;
    rejected: number;
    cancelled: number;
  };
}

export const getEmployeeAnnualLeaveSummaryQueryFn = async (
  employeeId: number,
  year?: number
): Promise<EmployeeAnnualLeaveSummary> => {
  try {
    const currentYear = year || new Date().getFullYear();
    const response = await API.get(
      `${API_BASE_URL}/leaves/employee/${employeeId}/annual-summary`,
      {
        params: { year: currentYear },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching employee annual leave summary:", error);
    throw error;
  }
};

// Time Report API Functions
export interface EmployeeTimeReportData {
  employeeId: number;
  year: number;
  totalHoursWorked: number;
  vacationTaken: number; // in days (includes migration data)
  vacationLeft: number; // in days
  plannedVacation: number; // in days
  workingDaysInYear: number;
  expectedWorkingHours: number;
  productivityPercentage: number;
  monthlyHours: { month: number; hours: number }[]; // Monthly breakdown of worked hours
  sickDays: number; // Total sick days taken (includes migration data)
  // Overtime/Undertime calculation (real-time up to current date)
  overtimeUndertimeHours: number; // Positive = overtime, Negative = undertime
  expectedHoursToDate: number; // Expected hours up to current date
  actualHoursToDate: number; // Actual hours (worked + leave hours) up to current date
  workingDaysToDate: number; // Working days from year start to current date
  // Migration data
  hasMigration: boolean;
  migrationData?: {
    migrationDate: string;
    vacationDaysMigrated: number;
    sickLeaveDaysMigrated: number;
    otherLeaveDaysMigrated: number;
    overtimeUndertimeHours: number;
    migrationHours: number;
    notes?: string;
  };
}

export const getEmployeeTimeReportQueryFn = async (
  employeeId: number,
  year?: number
): Promise<EmployeeTimeReportData> => {
  try {
    const currentYear = year || new Date().getFullYear();
    const response = await API.get(
      `${API_BASE_URL}/admin-service/reports/employee/${employeeId}/time-report`,
      {
        params: { year: currentYear },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching employee time report:", error);
    throw error;
  }
};

export interface Last30DaysTimeReportData {
  dailyBreakdown: {
    date: string;
    hoursWorked: number;
    overtime: number;
    undertime: number;
    isWeekend: boolean;
    isHoliday: boolean;
    leaveType?: string;
  }[];
  totalHours: number;
  averageHoursPerDay: number;
  workingDays: number;
  weekendDays: number;
  holidays: number;
  leaveDays: number;
  overtimeHours: number;
  undertimeHours: number;
}

export const getEmployeeLast30DaysReportQueryFn = async (
  employeeId: number
): Promise<Last30DaysTimeReportData> => {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const response = await API.get(
      `${API_BASE_URL}/admin-service/reports/employee/${employeeId}/time-report/last-30-days`,
      {
        params: {
          startDate: startDate.toISOString().split("T")[0],
          endDate: endDate.toISOString().split("T")[0],
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching last 30 days time report:", error);
    throw error;
  }
};

// ====== TIME LOGGING REQUEST API FUNCTIONS ======

export const getMyTimeLoggingRequestsQueryFn = async (
  employeeId: number
): Promise<any[]> => {
  const response = await API.get(
    `${API_BASE_URL}/admin-service/time-logging-requests/employee/${employeeId}`
  );
  return response.data.requests || [];
};

export const createTimeLoggingRequestMutationFn = async (
  data: any
): Promise<any> => {
  try {
    const response = await API.post(
      `${API_BASE_URL}/admin-service/time-logging-requests`,
      data
    );
    console.log("Time logging request API response:", response.data);

    // Backend returns { success: true, request: {...} } on success
    if (response.data && response.data.success && response.data.request) {
      return response.data.request;
    } else if (response.data && response.data.request) {
      // Fallback for older structure
      return response.data.request;
    } else if (response.data) {
      // Fallback for direct data
      return response.data;
    } else {
      throw new Error("Unexpected API response structure");
    }
  } catch (error) {
    console.error("Time logging request API error:", error);

    // Check if it's an axios error with response data
    if (error instanceof AxiosError && error.response && error.response.data) {
      console.error("Error response data:", error.response.data);
      // Re-throw with more specific error information
      const errorMessage =
        error.response.data.message ||
        error.response.data.error ||
        error.message;
      throw new Error(`API Error: ${errorMessage}`);
    }

    throw error;
  }
};

export const updateTimeLoggingRequestMutationFn = async ({
  id,
  ...data
}: { id: number } & any): Promise<any> => {
  const response = await API.put(
    `${API_BASE_URL}/admin-service/time-logging-requests/${id}`,
    data
  );
  // Handle different response structures gracefully
  return response.data.request || response.data;
};

export const deleteTimeLoggingRequestMutationFn = async (
  id: number
): Promise<any> => {
  const response = await API.delete(
    `${API_BASE_URL}/admin-service/time-logging-requests/${id}`
  );
  return response.data;
};

export const getKPIDataQueryFn = async (): Promise<KPIProject[]> => {
  try {
    const response = await API.get(`/finance/kpi`);
    return response.data;
  } catch (error) {
    console.error("Error fetching KPI data:", error);
    throw error;
  }
};

export const updateProjectWithColor = async (
  data: ProjectIdWithColor[]
): Promise<any> => {
  try {
    const response = await API.put(`/admin-service/projects/colors`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating project with colors:", error);
    throw error;
  }
};
