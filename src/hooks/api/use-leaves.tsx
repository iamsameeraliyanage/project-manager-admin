import { useQuery } from "@tanstack/react-query";
import {
  getAllLeavesQueryFn,
  getLeavesByEmployeeQueryFn,
  getVisibleLeavesByEmployeeQueryFn,
  getMyLeavesQueryFn,
  getPendingLeavesQueryFn,
  getLeaveByIdQueryFn,
  calculateLeaveDaysWithBreakdownQueryFn,
} from "../../services/api";
import type { Leave } from "../../types/leave";

/**
 * Custom hook to fetch all leaves
 */
export const useAllLeaves = (options = {}) => {
  return useQuery<Leave[]>({
    queryKey: ["leaves", "all"],
    queryFn: getAllLeavesQueryFn,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
    ...options,
  });
};

/**
 * Custom hook to fetch leaves by employee ID
 */
export const useLeavesByEmployee = (employeeId: number, options = {}) => {
  return useQuery<Leave[]>({
    queryKey: ["leaves", "employee", employeeId],
    queryFn: () => getLeavesByEmployeeQueryFn(employeeId),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
    enabled: !!employeeId,
    ...options,
  });
};

/**
 * Custom hook to fetch visible leaves by employee ID (for employee portal)
 */
export const useVisibleLeavesByEmployee = (
  employeeId: number,
  options = {}
) => {
  return useQuery<Leave[]>({
    queryKey: ["leaves", "employee", employeeId, "visible"],
    queryFn: () => getVisibleLeavesByEmployeeQueryFn(employeeId),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
    enabled: !!employeeId,
    ...options,
  });
};

/**
 * Custom hook to fetch current user's leaves
 */
export const useMyLeaves = (options = {}) => {
  return useQuery<Leave[]>({
    queryKey: ["leaves", "my"],
    queryFn: getMyLeavesQueryFn,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
    ...options,
  });
};

/**
 * Custom hook to fetch pending leaves
 */
export const usePendingLeaves = (options = {}) => {
  return useQuery<Leave[]>({
    queryKey: ["leaves", "pending"],
    queryFn: getPendingLeavesQueryFn,
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchOnWindowFocus: false,
    ...options,
  });
};

/**
 * Custom hook to fetch leave by ID
 */
export const useLeaveById = (id: number, options = {}) => {
  return useQuery<Leave>({
    queryKey: ["leaves", id],
    queryFn: () => getLeaveByIdQueryFn(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    enabled: !!id,
    ...options,
  });
};

/**
 * Custom hook to calculate leave days with breakdown
 */
export const useCalculateLeaveDaysWithBreakdown = (
  employeeId: number,
  startDate: string,
  endDate: string,
  isHalfDay?: boolean
) => {
  return useQuery({
    queryKey: ["leaveDaysBreakdown", employeeId, startDate, endDate, isHalfDay],
    queryFn: () => calculateLeaveDaysWithBreakdownQueryFn(employeeId, startDate, endDate, isHalfDay),
    enabled: !!employeeId && !!startDate && !!endDate,
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: false,
  });
};
