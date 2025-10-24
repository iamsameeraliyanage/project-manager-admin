import { useQuery } from "@tanstack/react-query";
import { apiQueryKeys } from "./apiQueryKeys";
import { getEmployeeAnnualLeaveSummaryQueryFn } from "../../services/api";
import type { EmployeeAnnualLeaveSummary } from "../../services/api";

export const useLeaveSummary = (employeeId: number, year?: number) => {
  return useQuery<EmployeeAnnualLeaveSummary>({
    queryKey: apiQueryKeys.leaveSummary(employeeId, year),
    queryFn: () => getEmployeeAnnualLeaveSummaryQueryFn(employeeId, year),
    enabled: !!employeeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
