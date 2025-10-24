import { useMutation, useQuery } from "@tanstack/react-query";
import {
  checkOutEmployeeInternalTaskTimeSheetQueryFn,
  createEmployeeInternalTaskTimeSheetQueryFn,
  getEmployeeInternalTaskTimeSheetQueryFn,
  getEmployeeInternalTaskTimeSheetsQueryFn,
} from "../../services/api";
import type {
  EmployeeInternalTaskTimeSheet,
  EmployeeWorkPackageTimeSheet,
} from "../../types/user";

export const useEmployeeInternalTaskTimeSheet = (
  internalTaskId: number,
  employeeId: number,
  status?: string,
  options = {}
) => {
  return useQuery<EmployeeWorkPackageTimeSheet[]>({
    queryKey: [
      "employeeInternalTaskTimeSheet",
      internalTaskId,
      employeeId,
      status,
    ],
    queryFn: () =>
      getEmployeeInternalTaskTimeSheetQueryFn(
        internalTaskId,
        employeeId,
        status
      ),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useCreateEmployeeInternalTaskTimeSheet = (
  internalTaskId: number,
  employeeId: number,
  options = {}
) => {
  return useMutation({
    mutationFn: () =>
      createEmployeeInternalTaskTimeSheetQueryFn({
        internalTaskId,
        employeeId,
      }),
    ...options,
  });
};

export const useCheckOutEmployeeInternalTaskTimeSheet = (
  internalTaskId: number,
  employeeId: number,
  options = {}
) => {
  return useMutation({
    mutationFn: () =>
      checkOutEmployeeInternalTaskTimeSheetQueryFn({
        internalTaskId,
        employeeId,
      }),
    ...options,
  });
};

export const useEmployeeInternalTaskTimeSheets = (
  employeeId: number,
  startDate: string,
  endDate: string,
  options = {}
) => {
  return useQuery<EmployeeInternalTaskTimeSheet[]>({
    queryKey: [
      "employeeInternalTaskTimeSheets",
      employeeId,
      startDate,
      endDate,
    ],
    queryFn: () =>
      getEmployeeInternalTaskTimeSheetsQueryFn({
        employeeId,
        startDate,
        endDate,
      }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useEmployeeTodayInternalTaskTimeSheets = (
  employeeId: number,
  date?: string,
  options = {}
) => {
  return useQuery<EmployeeInternalTaskTimeSheet[]>({
    queryKey: ["employeeInternalTaskTimeSheets", employeeId, date || "today"],
    queryFn: () =>
      getEmployeeInternalTaskTimeSheetsQueryFn({
        employeeId,
        date,
        today: !date,
      }),
    staleTime: 0,
    refetchOnWindowFocus: false,
    ...options,
  });
};
