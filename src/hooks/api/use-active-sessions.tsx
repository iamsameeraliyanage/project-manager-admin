import { useMemo } from "react";
import { useEmployeeLastBreak } from "./use-employee-break";

export interface ActiveSession {
  type: "break" | "customer_project" | "internal_task";
  id?: number;
  projectId?: number;
  workPackageId?: number;
  internalTaskId?: number;
  startTime: string;
  description: string;
}

export interface UseActiveSessionsProps {
  employeeId: number;
  currentProjectId?: number;
  currentWorkPackageId?: number;
  currentInternalTaskId?: number;
}

export const useActiveSessions = ({
  employeeId,
  currentProjectId,
  currentWorkPackageId,
  currentInternalTaskId,
}: UseActiveSessionsProps) => {
  // Check for active break
  const { data: lastBreak } = useEmployeeLastBreak(employeeId, {
    staleTime: 0,
    gcTime: 0,
  });

  const activeSessions = useMemo(() => {
    const sessions: ActiveSession[] = [];

    // Since backend ensures only one session at a time via endActiveTimeSheets(),
    // we only need to check for active break sessions here
    // The actual session conflict detection will happen at the backend level
    if (lastBreak && !lastBreak.endTime) {
      sessions.push({
        type: "break",
        startTime: lastBreak.startTime,
        description: "Active break session",
      });
    }

    return sessions;
  }, [lastBreak]);

  const hasActiveSession = activeSessions.length > 0;
  const activeSessionsExcludingCurrent = activeSessions.filter((session) => {
    // Exclude current session based on context
    if (
      currentProjectId &&
      currentWorkPackageId &&
      session.type === "customer_project" &&
      session.projectId === currentProjectId &&
      session.workPackageId === currentWorkPackageId
    ) {
      return false;
    }
    if (
      currentInternalTaskId &&
      session.type === "internal_task" &&
      session.internalTaskId === currentInternalTaskId
    ) {
      return false;
    }
    return true;
  });

  return {
    activeSessions,
    hasActiveSession,
    activeSessionsExcludingCurrent,
    hasConflictingSession: activeSessionsExcludingCurrent.length > 0,
  };
};
