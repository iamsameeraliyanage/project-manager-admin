import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  updateTimeSheetQueryFn,
  getTodayTimeSheets,
  bulkUpdateTimeSheetsQueryFn,
} from "../../services/api";
import type { EmployeeWorkPackageTimeSheet } from "../../types/user";

export const useUpdateTimeSheet = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      timeSheetId,
      updateData,
    }: {
      timeSheetId: number;
      updateData: {
        progress?: string;
        status?: string;
        attentionNeeded?: boolean;
        hasAttended?: boolean;
      };
    }) => updateTimeSheetQueryFn(timeSheetId, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employeeTimeSheets"] });
      queryClient.invalidateQueries({ queryKey: ["todayTimeSheets"] });
    },
    ...options,
  });
};

export const useBulkUpdateTimeSheets = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      updates: Array<{
        timeSheetId: number;
        progress?: string;
        status?: string;
        attentionNeeded?: boolean;
        hasAttended?: boolean;
      }>
    ) => bulkUpdateTimeSheetsQueryFn(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employeeTimeSheets"] });
      queryClient.invalidateQueries({ queryKey: ["todayTimeSheets"] });
    },
    ...options,
  });
};

export const useGetTodayTimeSheets = (
  employeeId: number,
  date?: string,
  options = {}
) => {
  return useQuery<EmployeeWorkPackageTimeSheet[]>({
    queryKey: ["todayTimeSheets", employeeId, date || "today"],
    queryFn: () => getTodayTimeSheets(employeeId, date),
    staleTime: 0,
    refetchOnWindowFocus: false,
    ...options,
  });
};
