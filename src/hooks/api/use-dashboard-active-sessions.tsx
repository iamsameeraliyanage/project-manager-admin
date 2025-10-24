import { useQuery } from "@tanstack/react-query";
import { getCombinedActiveSessionsQueryFn } from "../../services/api";

export interface DashboardActiveSession {
  id: number;
  type: "project" | "internal";
  employeeId: number;
  startTime: Date;
  endTime: Date | null;
  employee?: {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    user?: {
      name: string;
    };
  };
  // Project fields
  projectId?: number;
  projectName?: string;
  packageName?: string;
  packageId?: number;
  progress?: string | null;
  status?: string | null;
  // Internal task fields
  internalTaskId?: number;
  internalTaskName?: string;
  comment?: string;
  // Break information (when user is on break during task)
  isOnBreak?: boolean;
  breakStartTime?: Date;
  breakId?: number;
}

export const useDashboardActiveSessions = () => {
  return useQuery<DashboardActiveSession[]>({
    queryKey: ["dashboard", "active-work-sessions"],
    queryFn: getCombinedActiveSessionsQueryFn,
    staleTime: 30 * 1000, // 30 seconds - shorter stale time for real-time data
    refetchInterval: 60 * 1000, // Refresh every 60 seconds
    refetchOnWindowFocus: true,
  });
};