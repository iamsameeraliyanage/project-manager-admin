import { useQuery } from "@tanstack/react-query";
import axiosClient from "../../services/axios-client";

export interface Holiday {
  id: number;
  date: string;
  isHoliday: boolean;
  holidayName?: string;
  dayOfWeek: string;
}

export const useHolidays = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ["holidays", startDate, endDate],
    queryFn: async (): Promise<Holiday[]> => {
      const response = await axiosClient.get(`/calendars/holidays`, {
        params: { startDate, endDate },
      });
      return response.data;
    },
    enabled: !!startDate && !!endDate, // Only run query if both dates are provided
  });
};
