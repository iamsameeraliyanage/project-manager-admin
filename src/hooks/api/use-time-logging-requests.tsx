import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMyTimeLoggingRequestsQueryFn,
  createTimeLoggingRequestMutationFn,
  updateTimeLoggingRequestMutationFn,
  deleteTimeLoggingRequestMutationFn,
} from "../../services/api";
import { apiQueryKeys } from "./apiQueryKeys";

// Query keys
export const timeLoggingRequestKeys = {
  all: ['timeLoggingRequests'] as const,
  myRequests: (employeeId: number) => [...timeLoggingRequestKeys.all, 'my', employeeId] as const,
};

// Queries
export const useMyTimeLoggingRequests = (employeeId: number) => {
  return useQuery({
    queryKey: timeLoggingRequestKeys.myRequests(employeeId),
    queryFn: () => getMyTimeLoggingRequestsQueryFn(employeeId),
    enabled: !!employeeId,
  });
};

// Mutations
export const useCreateTimeLoggingRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTimeLoggingRequestMutationFn,
    onSuccess: () => {
      // Invalidate my requests queries
      queryClient.invalidateQueries({ queryKey: timeLoggingRequestKeys.all });
      // Also invalidate timesheet queries as this might affect them
      queryClient.invalidateQueries({ queryKey: apiQueryKeys.timeSheet });
    },
  });
};

export const useUpdateTimeLoggingRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTimeLoggingRequestMutationFn,
    onSuccess: () => {
      // Invalidate my requests queries
      queryClient.invalidateQueries({ queryKey: timeLoggingRequestKeys.all });
      // Also invalidate timesheet queries as this might affect them
      queryClient.invalidateQueries({ queryKey: apiQueryKeys.timeSheet });
    },
  });
};

export const useDeleteTimeLoggingRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTimeLoggingRequestMutationFn,
    onSuccess: () => {
      // Invalidate my requests queries
      queryClient.invalidateQueries({ queryKey: timeLoggingRequestKeys.all });
      // Also invalidate timesheet queries as this might affect them
      queryClient.invalidateQueries({ queryKey: apiQueryKeys.timeSheet });
    },
  });
};