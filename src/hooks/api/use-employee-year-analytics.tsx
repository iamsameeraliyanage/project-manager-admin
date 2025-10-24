import { useQuery } from "@tanstack/react-query";
import API from "../../services/axios-client";
import { ENV_API_BASE_URL } from "../../services/base-url";

const API_BASE_URL = `${ENV_API_BASE_URL}/api`;

export interface EmployeeYearAnalytics {
  employeeId: number;
  year: number;
  employee: {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
  };
  leaveQuota: {
    annualQuota: number;
    takenLeaves: number;
    pendingLeaves: number;
    remainingLeaves: number;
    leaveBreakdown: {
      approved: number;
      pending: number;
      rejected: number;
      cancelled: number;
    };
  };
  workDays: {
    totalWorkingDays: number;
    actualWorkedDays: number;
    daysOnLeave: number;
    productivity: number;
    averageDailyHours: number;
    totalWorkedHours: number;
  };
}

const getEmployeeYearAnalyticsQueryFn = async (
  employeeId: number,
  year?: number
): Promise<EmployeeYearAnalytics> => {
  try {
    const currentYear = year || new Date().getFullYear();
    const response = await API.get(
      `${API_BASE_URL}/admin-service/employees/${employeeId}/year-analytics/${currentYear}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching employee year analytics:", error);
    throw error;
  }
};

export const useEmployeeYearAnalytics = (employeeId: number, year?: number) => {
  return useQuery<EmployeeYearAnalytics>({
    queryKey: ["employee-year-analytics", employeeId, year],
    queryFn: () => getEmployeeYearAnalyticsQueryFn(employeeId, year),
    enabled: !!employeeId,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });
};
