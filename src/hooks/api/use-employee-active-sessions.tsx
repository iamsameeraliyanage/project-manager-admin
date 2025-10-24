import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useEmployeeLastBreak } from "./use-employee-break";
import API from "../../services/axios-client";
import { ENV_API_BASE_URL } from "../../services/base-url";

const API_BASE_URL = `${ENV_API_BASE_URL}/api`;

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

export interface UseEmployeeActiveSessionsProps {
  employeeId: number;
  currentProjectId?: number;
  currentWorkPackageId?: number;
  currentInternalTaskId?: number;
}

export const useEmployeeActiveSessions = ({
  employeeId,
  currentProjectId,
  currentWorkPackageId,
  currentInternalTaskId,
}: UseEmployeeActiveSessionsProps) => {
  // Check for active break
  const { data: lastBreak } = useEmployeeLastBreak(employeeId, {
    staleTime: 0,
    gcTime: 0,
  });

  // Check for ANY active work package time sheet for this employee
  const { data: activeWorkPackageSessions } = useQuery({
    queryKey: ["activeWorkPackageSessions", employeeId],
    queryFn: async () => {
      try {
        // Search through all projects and work packages for active sessions
        const response = await API.get(
          `${API_BASE_URL}/factory-service/employees/${employeeId}/time-sheets/active`
        );
        return response.data;
      } catch {
        console.log("Active work package sessions endpoint not available");
        return [];
      }
    },
    staleTime: 0,
    gcTime: 0,
  });

  const { data: activeInternalTaskSessions } = useQuery({
    queryKey: ["activeInternalTaskSessions", employeeId],
    queryFn: async () => {
      try {
        const response = await API.get(
          `${API_BASE_URL}/internal-tasks/employees/${employeeId}/time-sheets/active`
        );
        return response.data;
      } catch {
        console.log("Active internal task sessions endpoint not available");
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

    if (activeWorkPackageSessions && Array.isArray(activeWorkPackageSessions)) {
      activeWorkPackageSessions.forEach((session: any) => {
        sessions.push({
          type: "customer_project",
          projectId: session.projectId,
          workPackageId: session.workPackageId,
          startTime: session.startTime,
          description: `${session.projectName || "Customer Project"} - ${session.workPackageName || "Work Package"}`,
          projectName: session.projectName,
          workPackageName: session.workPackageName,
        });
      });
    }

    // Add active internal task sessions
    if (
      activeInternalTaskSessions &&
      Array.isArray(activeInternalTaskSessions)
    ) {
      activeInternalTaskSessions.forEach((session: any) => {
        sessions.push({
          type: "internal_task",
          internalTaskId: session.internalTaskId,
          startTime: session.startTime,
          description: session.internalTaskName || "Internal Task",
          internalTaskName: session.internalTaskName,
        });
      });
    }

    return sessions;
  }, [lastBreak, activeWorkPackageSessions, activeInternalTaskSessions]);

  const activeSessionsExcludingCurrent = useMemo(() => {
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
      // Never exclude breaks from conflicts - they should always be shown as conflicting
      return true;
    });
  }, [
    activeSessions,
    currentProjectId,
    currentWorkPackageId,
    currentInternalTaskId,
  ]);

  return {
    activeSessions,
    hasActiveSession: activeSessions.length > 0,
    activeSessionsExcludingCurrent,
    hasConflictingSession: activeSessionsExcludingCurrent.length > 0,
    isLoading: false, // Add loading state if needed
  };
};
