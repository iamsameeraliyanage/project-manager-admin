import { useQuery } from "@tanstack/react-query";
import axiosClient from "../../services/axios-client";

export interface WorkSchedule {
  id: number;
  employeeId: number;
  standardWeeklyHours: number;
  effectiveFrom: string;
  effectiveTo?: string;
  isActive: boolean;
  workDays: WorkDay[];
}

export interface WorkDay {
  id: number;
  dayOfWeek: string;
  workType: 'full_day' | 'first_half' | 'second_half' | 'off';
}

export interface EmployeeWorkScheduleData {
  employeeId: number;
  workSchedules: WorkSchedule[];
  hasWorkSchedule: boolean;
}

export const useWorkSchedules = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ["work-schedules", startDate, endDate],
    queryFn: async (): Promise<EmployeeWorkScheduleData[]> => {
      const response = await axiosClient.get(`/work-schedule-calendar`, {
        params: { startDate, endDate },
      });
      return response.data;
    },
    enabled: !!startDate && !!endDate, // Only run query if both dates are provided
  });
};