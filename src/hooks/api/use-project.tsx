import { useQuery } from "@tanstack/react-query";
import {
  getProjectsQueryFn,
  getProjectByIdQueryFn,
  getWorkPackagesQueryFn,
  getWorkPackageByIdQueryFn,
  getEmployeeWorkPackageTimeSheetsQueryFn,
} from "../../services/api";
import type {
  EmployeeWorkPackageTimeSheet,
  Project,
  WorkPackage,
} from "../../types/user";

export const useProjects = (options = {}) => {
  const query = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: getProjectsQueryFn,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    ...options,
  });

  return query;
};

export const useProjectById = (id: number, options = {}) => {
  const query = useQuery<Project>({
    queryKey: ["project", id],
    queryFn: () => getProjectByIdQueryFn(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    ...options,
  });

  return query;
};

export const useWorkPackages = (projectId: number, options = {}) => {
  const query = useQuery<WorkPackage[]>({
    queryKey: ["workPackages", projectId],
    queryFn: () => getWorkPackagesQueryFn(projectId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    ...options,
  });

  return query;
};

export const useWorkPackageById = (
  projectId: number,
  workPackageId: number,
  employeeId?: number,
  includeTrackedTime?: boolean,
  options = {}
) => {
  const query = useQuery<WorkPackage>({
    queryKey: [
      "workPackage",
      projectId,
      workPackageId,
      employeeId,
      includeTrackedTime,
    ],
    queryFn: () =>
      getWorkPackageByIdQueryFn(
        projectId,
        workPackageId,
        employeeId,
        includeTrackedTime
      ),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    ...options,
  });

  return query;
};

export const useEmployeeWorkPackageTimeSheets = (
  employeeId: number,
  startDate: string,
  endDate: string,
  options = {}
) => {
  const query = useQuery<EmployeeWorkPackageTimeSheet[]>({
    queryKey: ["employeeWorkPackageTimeSheets", employeeId, startDate, endDate],
    queryFn: () =>
      getEmployeeWorkPackageTimeSheetsQueryFn(employeeId, startDate, endDate),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    ...options,
  });

  return query;
};
