import * as React from "react";
import {
  createTheme,
  ThemeProvider as MUIThemeProvider,
} from "@mui/material/styles";

export const calculatedRem = (px: number) => `${px / 16}rem`;

let theme = createTheme({
  spacing: (factor: number) => `${0.25 * factor}rem`,
  palette: {
    mode: "light",
    primary: {
      main: "#185b6b",
      light: "#255c6d",
      dark: "#0f3741",
    },
    secondary: {
      main: "#009cc8",
      light: "#03addc",
      dark: "#007498",
    },
  },
  typography: {
    fontSize: 14, // base font size in px (used for calculations only)

    h1: {
      fontSize: calculatedRem(26),
      fontWeight: 600,
      lineHeight: calculatedRem(56),
      letterSpacing: 0,
    },
    h2: {
      fontSize: calculatedRem(24),
      fontWeight: 500,
      lineHeight: calculatedRem(36),
      letterSpacing: 0,
    },
    h3: {
      fontSize: calculatedRem(22),
      fontWeight: 500,
      lineHeight: calculatedRem(24),
      letterSpacing: 0,
    },
    h4: {
      fontSize: calculatedRem(20),
      fontWeight: 500,
      lineHeight: calculatedRem(20),
      letterSpacing: 0,
    },
    h5: {
      fontSize: calculatedRem(18),
      fontWeight: 500,
      lineHeight: calculatedRem(20),
      letterSpacing: 0,
    },
    h6: {
      fontSize: calculatedRem(17),
      fontWeight: 500,
      lineHeight: calculatedRem(22),
      letterSpacing: 0,
    },
    body1: {
      fontSize: calculatedRem(16),
      lineHeight: calculatedRem(24),
      fontWeight: 400,
    },
    body2: {
      fontSize: calculatedRem(14),
      lineHeight: calculatedRem(20),
      fontWeight: 400,
    },
    button: {
      fontSize: calculatedRem(16),
      lineHeight: calculatedRem(28),
      textTransform: "none",
      fontWeight: 400,
    },
    overline: {
      fontSize: calculatedRem(11),
      lineHeight: calculatedRem(14),
      fontWeight: 400,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiTab: {
      defaultProps: {
        disableRipple: true,
      },
    },
  },
  mixins: {
    toolbar: {
      minHeight: 48,
    },
  },
});

theme = {
  ...theme,
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: theme.palette.primary.main,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 6,
          paddingLeft: 16,
          paddingRight: 16,
        },
        contained: {
          boxShadow: "none",
          "&:active": {
            boxShadow: "none",
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          marginLeft: theme.spacing(1),
        },
        indicator: {
          height: 3,
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
          backgroundColor: theme.palette.common.white,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          margin: "0 16px",
          minWidth: 0,
          padding: 0,
          [theme.breakpoints.up("md")]: {
            padding: 0,
            minWidth: 0,
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: theme.spacing(1),
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 4,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: "rgb(255,255,255,0.15)",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            color: theme.palette.secondary.main,
            backgroundColor: theme.palette.primary.dark,
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
            },
            "&:focus": {
              backgroundColor: theme.palette.primary.dark,
            },
          },
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontSize: 14,
          fontWeight: theme.typography.fontWeightMedium,
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: "inherit",
          minWidth: "auto",
          marginRight: theme.spacing(2),
          "& svg": {
            fontSize: 20,
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          width: 32,
          height: 32,
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: theme.spacing(4),
          "&:last-child": {
            paddingBottom: theme.spacing(5),
          },
        },
      },
    },
    MuiCardActionArea: {
      styleOverrides: {
        root: {
          padding: theme.spacing(4),
          "&:last-child": {
            paddingBottom: theme.spacing(5),
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        sizeSmall: {
          height: calculatedRem(20),
          fontSize: calculatedRem(12),
          paddingLeft: calculatedRem(8),
          paddingRight: calculatedRem(8),
        },
      },
    },
  },
};

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return <MUIThemeProvider theme={theme}>{children}</MUIThemeProvider>;
};

export default ThemeProvider;
