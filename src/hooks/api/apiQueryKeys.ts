export const apiQueryKeys = {
  leaves: ["leaves"] as const,
  leaveTypes: ["leaveTypes"] as const,
  leaveSummary: (employeeId: number, year?: number) =>
    ["leaves", "summary", employeeId, year] as const,
  employee: (id: number) => ["employee", id] as const,
  employees: ["employees"] as const,
  timeSheet: ["timeSheet"] as const,
  kpiData: () => ["kpi-data"] as const,
  // Add other query keys as needed
};
