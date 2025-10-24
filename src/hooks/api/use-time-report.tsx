import { useQuery } from "@tanstack/react-query";
import {
  getEmployeeTimeReportQueryFn,
  getEmployeeLast30DaysReportQueryFn,
  type EmployeeTimeReportData,
  type Last30DaysTimeReportData,
} from "../../services/api";

export const useEmployeeTimeReport = (employeeId: number, year?: number) => {
  return useQuery<EmployeeTimeReportData>({
    queryKey: ["employee-time-report", employeeId, year],
    queryFn: () => getEmployeeTimeReportQueryFn(employeeId, year),
    enabled: !!employeeId,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });
};

export const useEmployeeLast30DaysReport = (employeeId: number) => {
  return useQuery<Last30DaysTimeReportData>({
    queryKey: ["employee-last-30-days-report", employeeId],
    queryFn: () => getEmployeeLast30DaysReportQueryFn(employeeId),
    enabled: !!employeeId,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });
};
