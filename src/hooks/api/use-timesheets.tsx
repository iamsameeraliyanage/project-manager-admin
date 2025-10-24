import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getEmployeeWorkPackageTimeSheetQueryFn,
  getEmployeeTimeSheetsQueryFn,
  getCombinedTimeSheetsQueryFn,
  closeEmployeeTimeSheetQueryFn,
  createInternalTaskTimeSheetQueryFn,
  checkOutInternalTaskTimeSheetQueryFn,
} from "../../services/api";
import type { EmployeeWorkPackageTimeSheet } from "../../types/user";

export const useGetEmployeeWorkPackageTimeSheet = (
  projectId: number,
  workPackageId: number,
  employeeId: number,
  status?: string,
  options = {}
) => {
  const query = useQuery<EmployeeWorkPackageTimeSheet>({
    queryKey: [
      "employeeWorkPackageTimeSheet",
      projectId,
      workPackageId,
      employeeId,
    ],
    queryFn: () =>
      getEmployeeWorkPackageTimeSheetQueryFn(
        projectId,
        workPackageId,
        employeeId,
        status
      ),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    ...options,
  });

  return query;
};

export const useGetEmployeeTimeSheets = (
  employeeId: number,
  numberOfDays: number,
  options = {}
) => {
  const query = useQuery<EmployeeWorkPackageTimeSheet[]>({
    queryKey: ["employeeTimeSheets", employeeId, numberOfDays],
    queryFn: () => getEmployeeTimeSheetsQueryFn(employeeId, numberOfDays),
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: true,
    ...options,
  });

  return query;
};

export const useGetCombinedTimeSheets = (
  employeeId: number,
  numberOfSheets: number,
  options = {}
) => {
  const query = useQuery<any[]>({
    queryKey: ["combinedTimeSheets", employeeId, numberOfSheets],
    queryFn: () => getCombinedTimeSheetsQueryFn(employeeId, numberOfSheets),
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: true,
    ...options,
  });

  return query;
};

export const useCreateInternalTaskTimeSheet = (options = {}) => {
  return useMutation({
    mutationFn: createInternalTaskTimeSheetQueryFn,
    ...options,
  });
};

export const useCheckOutInternalTaskTimeSheet = (options = {}) => {
  return useMutation({
    mutationFn: checkOutInternalTaskTimeSheetQueryFn,
    ...options,
  });
};

export const useCloseEmployeeTimeSheet = (employeeId: number, options = {}) => {
  return useMutation({
    mutationFn: () => closeEmployeeTimeSheetQueryFn(employeeId),
    ...options,
  });
};
