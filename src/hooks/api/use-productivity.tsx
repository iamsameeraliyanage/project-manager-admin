import { useQuery } from "@tanstack/react-query";
import {
  getEmployeeProductivityQueryFn,
  getEmployeeCumulativeProductivityQueryFn,
} from "../../services/api";
import type { ProductivityData } from "../../types/user";

interface UseEmployeeProductivityParams {
  employeeId: number;
  startDate: string;
  endDate: string;
}

export const useEmployeeProductivity = (
  { employeeId, startDate, endDate }: UseEmployeeProductivityParams,
  options = {}
) => {
  return useQuery<ProductivityData[]>({
    queryKey: ["employeeProductivity", employeeId, startDate, endDate],
    queryFn: () =>
      getEmployeeProductivityQueryFn(employeeId, startDate, endDate),
    enabled: !!employeeId && !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useEmployeeCumulativeProductivity = (
  employeeId: number,
  startDate: string,
  endDate: string,
  options = {}
) => {
  return useQuery<number, Error>({
    queryKey: [
      "employeeCumulativeProductivity",
      employeeId,
      startDate,
      endDate,
    ],
    queryFn: () =>
      getEmployeeCumulativeProductivityQueryFn(employeeId, startDate, endDate),
    enabled: !!employeeId && !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    ...options,
  });
};
