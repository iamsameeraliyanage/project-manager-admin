export const ROUTES = {
  // Authentication
  AUTH: {
    SIGN_IN: `signin`,
  },

  // Main Routes
  MAIN: {
    ROOT: "/",
    GALLERY: "gallery",
    DASHBOARD: "dashboard",
  },

  // User Routes
  USER: {
    USER_ID: ":userId",
    TIME_LOGGER: "time-logger",
    CUSTOMER_PROJECTS: "customer-projects",
    INTERNAL_PROJECTS: "internal-projects",
    BREAK: "break",
    SIGN_OFF: "sign-off",
    CALENDAR: "calendar",
    CALENDAR_VIEW: "view",
    CALENDAR_VACATION_REQUEST: "vacation-request",
    CALENDAR_VACATION_REQUEST_CREATE: "create",
    CALENDAR_TIME_REPORT: "time-report",
    TASK_ID: ":taskId",
  },
  PARAMS: {
    PROJECT: "project",
    WORKPACKAGE: "workpackage",
  },
} as const;

export type Routes = typeof ROUTES;
