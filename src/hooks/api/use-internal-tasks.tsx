import { useQuery } from "@tanstack/react-query";
import { getInternalTasksQueryFn } from "../../services/api";
import type { InternalTask } from "../../types/user";

const useInternalTasks = (options = {}) => {
  const query = useQuery<InternalTask[]>({
    queryKey: ["internalTasks"],
    queryFn: getInternalTasksQueryFn,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    ...options,
  });

  return query;
};

export default useInternalTasks;
