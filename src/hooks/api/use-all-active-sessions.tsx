import { useMemo } from "react";
import { useEmployeeLastBreak } from "./use-employee-break";
import { useQuery } from "@tanstack/react-query";

export interface ActiveSession {
  type: "break" | "customer_project" | "internal_task";
  id?: number;
  projectId?: number;
  workPackageId?: number;
  internalTaskId?: number;
  startTime: string;
  description: string;
  projectName?: string;
  workPackageName?: string;
  internalTaskName?: string;
}

export interface UseAllActiveSessionsProps {
  employeeId: number;
  currentProjectId?: number;
  currentWorkPackageId?: number;
  currentInternalTaskId?: number;
  excludeCurrentSession?: boolean;
}

export const useAllActiveSessions = ({
  employeeId,
  currentProjectId,
  currentWorkPackageId,
  currentInternalTaskId,
  excludeCurrentSession = true,
}: UseAllActiveSessionsProps) => {
  // Check for active break
  const { data: lastBreak } = useEmployeeLastBreak(employeeId, {
    staleTime: 0,
    gcTime: 0,
  });

  // Check for ALL active work package time sheets
  const { data: allActiveWorkPackageSessions } = useQuery({
    queryKey: ["allActiveWorkPackageSessions", employeeId],
    queryFn: async () => {
      try {
        // This would need a backend endpoint to get all active sessions for an employee
        // For now, we'll use the existing endpoint but we need to modify the backend
        const response = await fetch(
          `/api/factory-service/employees/${employeeId}/active-sessions`
        );
        if (!response.ok) return [];
        return await response.json();
      } catch (error) {
        console.error("Failed to fetch active sessions:", error);
        return [];
      }
    },
    staleTime: 0,
    gcTime: 0,
  });

  // Check for ALL active internal task sessions
  const { data: allActiveInternalTaskSessions } = useQuery({
    queryKey: ["allActiveInternalTaskSessions", employeeId],
    queryFn: async () => {
      try {
        const response = await fetch(
          `/api/factory-service/employees/${employeeId}/internal-tasks/active-sessions`
        );
        if (!response.ok) return [];
        return await response.json();
      } catch (error) {
        console.error("Failed to fetch active internal task sessions:", error);
        return [];
      }
    },
    staleTime: 0,
    gcTime: 0,
  });

  const activeSessions = useMemo(() => {
    const sessions: ActiveSession[] = [];

    // Check active break
    if (lastBreak && !lastBreak.endTime) {
      sessions.push({
        type: "break",
        startTime: lastBreak.startTime,
        description: "Active break session",
      });
    }

    // Add all active work package sessions
    if (allActiveWorkPackageSessions) {
      allActiveWorkPackageSessions.forEach((session: any) => {
        sessions.push({
          type: "customer_project",
          projectId: session.projectId,
          workPackageId: session.workPackageId,
          startTime: session.startTime,
          description: `${session.projectName} - ${session.workPackageName}`,
          projectName: session.projectName,
          workPackageName: session.workPackageName,
        });
      });
    }

    // Add all active internal task sessions
    if (allActiveInternalTaskSessions) {
      allActiveInternalTaskSessions.forEach((session: any) => {
        sessions.push({
          type: "internal_task",
          internalTaskId: session.internalTaskId,
          startTime: session.startTime,
          description: session.internalTaskName,
          internalTaskName: session.internalTaskName,
        });
      });
    }

    return sessions;
  }, [lastBreak, allActiveWorkPackageSessions, allActiveInternalTaskSessions]);

  const activeSessionsExcludingCurrent = useMemo(() => {
    if (!excludeCurrentSession) return activeSessions;

    return activeSessions.filter((session) => {
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
  }, [
    activeSessions,
    currentProjectId,
    currentWorkPackageId,
    currentInternalTaskId,
    excludeCurrentSession,
  ]);

  return {
    activeSessions,
    hasActiveSession: activeSessions.length > 0,
    activeSessionsExcludingCurrent,
    hasConflictingSession: activeSessionsExcludingCurrent.length > 0,
  };
};
