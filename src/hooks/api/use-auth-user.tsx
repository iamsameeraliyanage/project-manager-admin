import { useQuery } from "@tanstack/react-query";
import { getCurrentUserQueryFn } from "../../services/api";

const useAuthUser = () => {
  const query = useQuery({
    queryKey: ["authUser"],
    queryFn: getCurrentUserQueryFn,
    staleTime: 0,
    retry: 2,
  });
  return query;
};

export default useAuthUser;
