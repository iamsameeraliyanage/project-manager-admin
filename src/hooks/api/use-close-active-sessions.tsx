import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ActiveSession } from "./use-active-sessions";
import {
  checkOutEmployeeBreakQueryFn,
  checkOutEmployeeWorkPackageTimeSheetQueryFn,
  checkOutEmployeeInternalTaskTimeSheetQueryFn,
} from "../../services/api";

export const useCloseActiveSessions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      sessions,
      employeeId,
    }: {
      sessions: ActiveSession[];
      employeeId: number;
    }) => {
      const closePromises = sessions.map(async (session) => {
        switch (session.type) {
          case "break":
            return checkOutEmployeeBreakQueryFn(employeeId);

          case "customer_project":
            if (session.projectId && session.workPackageId) {
              return checkOutEmployeeWorkPackageTimeSheetQueryFn({
                projectId: session.projectId,
                workPackageId: session.workPackageId,
                employeeId,
              });
            }
            break;

          case "internal_task":
            if (session.internalTaskId) {
              return checkOutEmployeeInternalTaskTimeSheetQueryFn({
                internalTaskId: session.internalTaskId,
                employeeId,
              });
            }
            break;
        }
      });

      // Wait for all sessions to be closed
      await Promise.all(closePromises.filter(Boolean));
    },
    onSuccess: () => {
      // Invalidate all relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["employeeLastBreak"] });
      queryClient.invalidateQueries({
        queryKey: ["employeeWorkPackageTimeSheet"],
      });
      queryClient.invalidateQueries({
        queryKey: ["employeeInternalTaskTimeSheet"],
      });
      queryClient.invalidateQueries({ queryKey: ["employeeProductivity"] });
      queryClient.invalidateQueries({
        queryKey: ["employeeCumulativeProductivity"],
      });
    },
  });
};
