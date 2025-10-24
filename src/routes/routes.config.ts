export const ROUTES = {
  // Authentication
  AUTH: {
    SIGN_IN: `signin`,
  },

  // Main Routes
  MAIN: {
    ROOT: "/",
  },
} as const;

export type Routes = typeof ROUTES;
