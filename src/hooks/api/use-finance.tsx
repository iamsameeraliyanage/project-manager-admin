import { useQuery } from "@tanstack/react-query";
import { apiQueryKeys } from "./apiQueryKeys";
import { getKPIDataQueryFn } from "../../services/api";

export const useKPIData = () => {
  return useQuery({
    queryKey: apiQueryKeys.kpiData(),
    queryFn: getKPIDataQueryFn,
  });
};
