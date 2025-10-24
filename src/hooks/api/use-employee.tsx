import { useQuery } from "@tanstack/react-query";
import { getEmployeesQueryFn } from "../../services/api";
import type { Employee } from "../../types/user";

/**
 * Custom hook to fetch employee data
 * @param options Optional query configuration options
 * @returns Query result containing employee data
 */
const useEmployee = (options = {}) => {
  const query = useQuery<Employee[]>({
    queryKey: ["employees"],
    queryFn: getEmployeesQueryFn,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    ...options,
  });

  return query;
};

export default useEmployee;
