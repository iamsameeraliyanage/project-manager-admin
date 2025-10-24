import { useQuery } from "@tanstack/react-query";
import { getEmployeeDailyProductivityQueryFn } from "../../services/api";
import type { DailyProductivityData } from "../../types/user";

interface UseDailyProductivityParams {
  employeeId: number;
  startDate: string;
  endDate: string;
}

export const useEmployeeDailyProductivity = (
  { employeeId, startDate, endDate }: UseDailyProductivityParams,
  options = {}
) => {
  return useQuery<DailyProductivityData[]>({
    queryKey: ["employeeDailyProductivity", employeeId, startDate, endDate],
    queryFn: () =>
      getEmployeeDailyProductivityQueryFn(employeeId, startDate, endDate),
    enabled: !!employeeId && !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    ...options,
  });
};
