import {
  Box,
  Container,
  Stack,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Chip,
  Alert,
  Grid,
} from "@mui/material";
import { useMainLayout } from "../../context/main-layout-provider";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { RiFullscreenExitLine, RiFullscreenFill } from "react-icons/ri";
import ProjectProgressChart from "../../components/Dashboard/ProjectProgressChart";
import EmployeeProductivitySummary from "../../components/Dashboard/EmployeeProductivitySummary";
import ActiveWorkSessions from "../../components/Dashboard/ActiveWorkSessions";
import QuotesInvoicesSummary from "../../components/Dashboard/QuotesInvoicesSummary";

export default function Dashboard() {
  const { setMainTitle } = useMainLayout();
  const { t } = useTranslation();
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  useEffect(() => {
    setMainTitle(t("dashboard", "Dashboard"));
  }, [setMainTitle, t]);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  // Handle escape key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsFullScreen(false);
      }
    };
    if (isFullScreen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullScreen]);

  // Handle body scroll and styles when in fullscreen
  useEffect(() => {
    if (isFullScreen) {
      // Prevent body scroll and ensure fullscreen takes entire viewport
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.height = "100%";
      document.body.style.top = "0";
      document.body.style.left = "0";

      // Also hide any potential scrollbars
      document.documentElement.style.overflow = "hidden";
    } else {
      // Restore body scroll and styles
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.height = "";
      document.body.style.top = "";
      document.body.style.left = "";

      document.documentElement.style.overflow = "";
    }

    return () => {
      // Cleanup on unmount
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.height = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.documentElement.style.overflow = "";
    };
  }, [isFullScreen]);

  return (
    <Stack
      sx={{
        height: "100%",
        ...(isFullScreen && {
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pb: 4,
          zIndex: 2000, // Higher z-index to cover left navigation (MUI Drawer is ~1300)
          bgcolor: "#eaeff1",
          overflow: "auto",
          transition: "all 0.3s ease-in-out", // Smooth transition
        }),
      }}
    >
      {isFullScreen && (
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: "primary.main",
            zIndex: 2001, // Ensure AppBar is above the main content
            py: 2,
          }}
        >
          <Toolbar>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "64px",
                maxWidth: "56px",
                mr: 2,
              }}
            >
              <img src="/logo-icon.svg" alt="logo" className="img-fluid" />
            </Box>
            <Typography variant="h1" component="div" sx={{ flexGrow: 1 }}>
              {t("dashboard", "Dashboard")} -{" "}
              {t(
                "activeProjectsAndProductivity",
                "Active Projects & Employee Productivity"
              )}
            </Typography>
            <IconButton
              color="inherit"
              size="medium"
              onClick={toggleFullScreen}
            >
              <RiFullscreenExitLine />
            </IconButton>
          </Toolbar>
        </AppBar>
      )}

      <Stack
        p={4}
        sx={{
          height: "100%",
          ...(isFullScreen && {
            overflow: "auto",
          }),
        }}
      >
        {/* Dashboard Title - Hidden in fullscreen mode */}
        {!isFullScreen && (
          <Container maxWidth={false}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="flex-start"
            >
              <Box>
                <Box display="flex" alignItems="center" gap={2} mb={1}>
                  <Typography variant="h4" component="h1">
                    {t("dashboard", "Dashboard")}
                  </Typography>
                  <Chip
                    label={t("betaPreview", "Beta Preview")}
                    color="warning"
                    size="small"
                    variant="outlined"
                  />
                </Box>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {t(
                    "dashboardOverview",
                    "Overview of active project progress and employee productivity"
                  )}
                </Typography>
                <Alert severity="info" sx={{ mb: 3 }} variant="outlined">
                  <Typography variant="body2">
                    {t(
                      "betaNotice",
                      "This dashboard is currently in beta preview. Features and data visualization are being refined and may change."
                    )}
                  </Typography>
                </Alert>
              </Box>
              <IconButton
                color="primary"
                size="small"
                onClick={toggleFullScreen}
                sx={{ mt: 1 }}
              >
                <RiFullscreenFill />
              </IconButton>
            </Box>
          </Container>
        )}

        {/* First Row: Project Progress & Employee Productivity */}
        <Container
          maxWidth={false}
          sx={{
            maxWidth: isFullScreen ? "100%" : undefined,
            ...(isFullScreen && {
              height: "100%",
            }),
          }}
        >
          <Stack
            pt={2}
            pb={3}
            sx={{
              ...(isFullScreen && {
                height: "100%",
              }),
            }}
          >
            <Grid
              container
              spacing={3}
              sx={{
                ...(isFullScreen && {
                  height: "100%",
                }),
              }}
            >
              <Grid size={{ xs: 6, md: 6 }}>
                <ActiveWorkSessions />
              </Grid>
              <Grid size={{ xs: 6, md: 6 }}>
                <QuotesInvoicesSummary />
              </Grid>

              <Grid size={{ xs: 6, md: 6 }}>
                <ProjectProgressChart />
              </Grid>
              <Grid size={{ xs: 6, md: 6 }}>
                <EmployeeProductivitySummary />
              </Grid>
            </Grid>
          </Stack>
        </Container>
      </Stack>
    </Stack>
  );
}
