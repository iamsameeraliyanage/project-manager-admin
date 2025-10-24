import { useQuery } from "@tanstack/react-query";
import API from "../../services/axios-client";

export interface WorkPackagePlan {
  id: string;
  title: string;
  employeeId: string;
  project?: {
    id: number;
    name: string;
    work_package_id: number;
    work_package_name: string;
  };
  internal_task?: {
    id: string;
    name: string;
  };
  start_time: number;
  end_time: number;
  timeInMinutes: number;
  createdAt: string;
  updatedAt: string;
}

export interface GetWorkPackagePlanningParams {
  employeeId?: string;
  startTime?: number;
  endTime?: number;
}

const useGetWorkpackagePlanning = (
  params: GetWorkPackagePlanningParams = {}
) => {
  const queryParams = new URLSearchParams();

  if (params.employeeId) {
    queryParams.append("employeeId", params.employeeId);
  }

  if (params.startTime) {
    queryParams.append("startTime", params.startTime.toString());
  }

  if (params.endTime) {
    queryParams.append("endTime", params.endTime.toString());
  }

  const query = useQuery({
    queryKey: ["workpackage-planning", params],
    queryFn: async (): Promise<WorkPackagePlan[]> => {
      const url = `/admin-service/workpackage-planning${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;
      const response = await API.get(url);
      return response.data;
    },
    staleTime: 30000, // 30 seconds
    retry: 2,
  });

  return query;
};

export { useGetWorkpackagePlanning };
