import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getEmployeeDailyBreaksQueryFn,
  getEmployeeLastBreakQueryFn,
  createEmployeeBreakQueryFn,
  checkOutEmployeeBreakQueryFn,
  getEmployeeTodayBreakQueryFn,
  getDailyEmployeeBreaksQueryFn,
} from "../../services/api";
import type { EmployeeBreak, EmployeeDailyBreak } from "../../types/user";

export const useEmployeeDailyBreaks = (employeeId: number, options = {}) => {
  return useQuery<EmployeeDailyBreak[]>({
    queryKey: ["employeeDailyBreaks", employeeId],
    queryFn: () => getEmployeeDailyBreaksQueryFn(employeeId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useEmployeeLastBreak = (employeeId: number, options = {}) => {
  return useQuery<EmployeeBreak>({
    queryKey: ["employeeLastBreak", employeeId],
    queryFn: () => getEmployeeLastBreakQueryFn(employeeId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useEmployeeTodayBreak = (employeeId: number, options = {}) => {
  return useQuery<number>({
    queryKey: ["employeeTodayBreak", employeeId],
    queryFn: () => getEmployeeTodayBreakQueryFn(employeeId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useCreateEmployeeBreak = (employeeId: number, options = {}) => {
  return useMutation({
    mutationFn: () => createEmployeeBreakQueryFn(employeeId),
    ...options,
  });
};

export const useCheckOutEmployeeBreak = (employeeId: number, options = {}) => {
  return useMutation({
    mutationFn: () => checkOutEmployeeBreakQueryFn(employeeId),
    ...options,
  });
};

export const useDailyEmployeeBreaks = (
  employeeId: number,
  startDate: string,
  endDate: string,
  options = {}
) => {
  return useQuery<EmployeeDailyBreak[]>({
    queryKey: ["dailyEmployeeBreaks", employeeId, startDate, endDate],
    queryFn: () =>
      getDailyEmployeeBreaksQueryFn(employeeId, startDate, endDate),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    ...options,
  });
};
