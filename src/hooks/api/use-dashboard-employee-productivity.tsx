import { useQuery } from "@tanstack/react-query";
import { getEmployeesQueryFn, getEmployeeCumulativeProductivityQueryFn } from "../../services/api";
import { useMemo } from "react";
import dayjs from "dayjs";
import type { Employee } from "../../types/user";

export interface DashboardEmployeeProductivity {
  id: number;
  name: string;
  productivity: number;
  totalWorkedHours?: number;
  totalPlannedHours?: number;
}

export const useDashboardEmployeeProductivity = () => {
  // Calculate last 30 days date range
  const { startDate, endDate } = useMemo(() => {
    const endDate = dayjs();
    const startDate = dayjs().subtract(29, "days"); // 30 days including today
    return {
      startDate: startDate.format("YYYY-MM-DD"),
      endDate: endDate.format("YYYY-MM-DD"),
    };
  }, []);

  // Fetch all employees
  const { data: employees, isLoading: loadingEmployees, error: employeesError } = useQuery({
    queryKey: ["employees"],
    queryFn: getEmployeesQueryFn,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Create a fixed number of hooks to avoid the "more hooks than previous render" error
  const maxEmployees = 30;
  
  // Create padded employees array with null values to maintain consistent hook count
  // Filter out local admins first
  const paddedEmployees = useMemo(() => {
    if (!employees) return Array(maxEmployees).fill(null) as (Employee | null)[];
    
    const filteredEmployees = employees.filter(emp => !emp.isLocalAdmin);
    const padded: (Employee | null)[] = [...filteredEmployees.slice(0, maxEmployees)];
    while (padded.length < maxEmployees) {
      padded.push(null);
    }
    return padded;
  }, [employees]);

  // Execute all productivity queries with fixed number of hooks
  const productivityResults = Array(maxEmployees)
    .fill(null)
    .map((_, index) => {
      const employee = paddedEmployees[index];
      const employeeId = employee ? employee.id : null;
      
      return useQuery({
        queryKey: ["employee-cumulative-productivity", employeeId, startDate, endDate],
        queryFn: () => getEmployeeCumulativeProductivityQueryFn(employeeId!, startDate, endDate),
        enabled: !!employeeId && !!startDate && !!endDate,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
      });
    });

  // Combine the results
  const combinedResults = useMemo(() => {
    if (!employees || employees.length === 0) {
      return {
        data: [],
        isLoading: loadingEmployees,
        error: employeesError,
      };
    }

    const isLoading = loadingEmployees || productivityResults.some(result => result.isLoading);
    const hasError = employeesError || productivityResults.some(result => result.error);

    if (isLoading) {
      return {
        data: [],
        isLoading: true,
        error: null,
      };
    }

    if (hasError) {
      return {
        data: [],
        isLoading: false,
        error: hasError,
      };
    }

    // Transform the data (only for actual employees, excluding local admins)
    const filteredEmployees = employees.filter(emp => !emp.isLocalAdmin);
    const transformedData: DashboardEmployeeProductivity[] = filteredEmployees
      .slice(0, 30)
      .map((employee, index) => {
        const productivityResult = productivityResults[index];
        const productivity = productivityResult?.data;
        
        // Skip employees with no productivity data or errors
        if (productivity === undefined || productivity === null || productivityResult?.error) {
          return null;
        }

        const getEmployeeName = (emp: any) => {
          if (emp.firstname && emp.lastname) {
            return `${emp.firstname} ${emp.lastname}`;
          }
          if (emp.name_1 && emp.name_2) {
            return `${emp.name_1} ${emp.name_2}`;
          }
          return emp.name || emp.email || `Employee ${emp.id}`;
        };

        return {
          id: employee.id,
          name: getEmployeeName(employee),
          productivity: Math.min(Math.max(productivity * 100, 0), 100), // Convert to percentage and clamp
          totalWorkedHours: 0, // Could be calculated from timesheets if needed
          totalPlannedHours: 0, // Could be calculated from planning if needed
        };
      })
      .filter(Boolean) as DashboardEmployeeProductivity[];

    // Sort by productivity descending
    transformedData.sort((a, b) => b.productivity - a.productivity);

    return {
      data: transformedData,
      isLoading: false,
      error: null,
    };
  }, [employees, productivityResults, loadingEmployees, employeesError]);

  return combinedResults;
};