import { useQuery } from "@tanstack/react-query";
import {
  getAllLeaveTypesQueryFn,
  getEmployeeVisibleLeaveTypesQueryFn,
  getLeaveTypeByIdQueryFn,
} from "../../services/api";
import type { LeaveType } from "../../types/leave";

/**
 * Custom hook to fetch all leave types
 */
export const useAllLeaveTypes = (options = {}) => {
  return useQuery<LeaveType[]>({
    queryKey: ["leaveTypes", "all"],
    queryFn: getAllLeaveTypesQueryFn,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    ...options,
  });
};

/**
 * Custom hook to fetch employee-visible leave types (for employee portal)
 */
export const useEmployeeVisibleLeaveTypes = (options = {}) => {
  return useQuery<LeaveType[]>({
    queryKey: ["leaveTypes", "employee-visible"],
    queryFn: getEmployeeVisibleLeaveTypesQueryFn,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    ...options,
  });
};

/**
 * Custom hook to fetch leave type by ID
 */
export const useLeaveTypeById = (id: number, options = {}) => {
  return useQuery<LeaveType>({
    queryKey: ["leaveTypes", id],
    queryFn: () => getLeaveTypeByIdQueryFn(id),
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    enabled: !!id,
    ...options,
  });
};
