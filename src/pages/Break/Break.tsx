import { Container, Stack, Snackbar, Alert, Grid, Box } from "@mui/material";
import { useEffect, useState, useCallback } from "react";
import { useMainLayout } from "../../context/main-layout-provider";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import useEmployee from "../../hooks/api/use-employee";
import {
  useEmployeeLastBreak,
  useEmployeeTodayBreak,
} from "../../hooks/api/use-employee-break";
import { useMutation } from "@tanstack/react-query";
import {
  checkOutEmployeeBreakQueryFn,
  createEmployeeBreakQueryFn,
  autoEndEmployeeBreakQueryFn,
} from "../../services/api";
import { useQuery } from "@tanstack/react-query";
import API from "../../services/axios-client";
import BreakHistoryGraph from "../../components/BreakHistoryGraph/BreakHistoryGraph";
import BreakStatus from "../../components/BreakStatus/BreakStatus";

const Break = () => {
  const { setMainTitle, setBackLink } = useMainLayout();
  const { t } = useTranslation();
  const { userId } = useParams();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<"week" | "month">("week");

  const { data: users } = useEmployee();
  const user = users?.find((u) => u.id === Number(userId));

  const { data: lastBreak, refetch: refetchLastBreak } = useEmployeeLastBreak(
    Number(userId)
  );
  const { data: todayBreakMinutes, refetch: refetchTodayBreakMinutes } =
    useEmployeeTodayBreak(Number(userId));

  const [currentTime, setCurrentTime] = useState(Date.now());

  const ongoingBreakSeconds =
    lastBreak && !lastBreak.endTime
      ? Math.floor(
          (currentTime - new Date(lastBreak.startTime).getTime()) / 1000
        )
      : 0;

  const remainingBreakSeconds = Math.max(
    0,
    30 * 60 - ((todayBreakMinutes || 0) * 60 + ongoingBreakSeconds)
  );

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "warning"
  >("success");

  // Check for active project or internal task
  const { data: activeTaskData } = useQuery({
    queryKey: ["activeTask", userId],
    queryFn: async () => {
      try {
        // Check for active project task
        const projectResponse = await API.get(
          `/factory-service/project-time-sheets/${userId}`,
          {
            params: { numberOfTimeSheets: 1 },
          }
        );
        const activeProjectTask =
          projectResponse.data?.[0]?.endTime === null
            ? projectResponse.data[0]
            : null;

        // Check for active internal task
        const internalResponse = await API.get(
          `/factory-service/internal-task-time-sheets/${userId}`,
          {
            params: { date: new Date().toISOString().split("T")[0] },
          }
        );
        const activeInternalTask = internalResponse.data?.find(
          (task: any) => !task.endTime
        );

        return {
          hasActiveTask: !!(activeProjectTask || activeInternalTask),
          activeProjectTask,
          activeInternalTask,
        };
      } catch {
        return {
          hasActiveTask: false,
          activeProjectTask: null,
          activeInternalTask: null,
        };
      }
    },
    refetchInterval: 5000, // Check every 5 seconds
  });

  const { mutate: createBreak, isPending: isCreatingBreak } = useMutation({
    mutationFn: () => createEmployeeBreakQueryFn(Number(userId)),
    onSuccess: () => {
      refetchLastBreak();
      setSnackbarMessage(t("haveANiceBreak", "Have a nice break"));
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        t(
          "breakRequiresActiveTask",
          "You must be logged into a project or internal task to take a break"
        );
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    },
  });

  const { mutate: checkOutBreak, isPending: isCheckingOutBreak } = useMutation({
    mutationFn: () => checkOutEmployeeBreakQueryFn(Number(userId)),
    onSuccess: () => {
      refetchLastBreak();
      refetchTodayBreakMinutes();
      setSnackbarMessage(t("backToWork", "Back to work, have fun!"));
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    },
  });

  const { mutate: autoEndBreak } = useMutation({
    mutationFn: () => autoEndEmployeeBreakQueryFn(Number(userId)),
    onSuccess: (result) => {
      if (result.autoEnded) {
        refetchLastBreak();
        refetchTodayBreakMinutes();
        setSnackbarMessage(
          t(
            "breakLimitReached",
            "Break limit reached (30 minutes). You have been automatically logged out from your task."
          )
        );
        setSnackbarSeverity("warning");
        setOpenSnackbar(true);
      }
    },
  });

  const [lastActivity, setLastActivity] = useState(Date.now());

  const updateActivity = useCallback(() => {
    setLastActivity(Date.now());
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", updateActivity);
    window.addEventListener("mousedown", updateActivity);
    window.addEventListener("keypress", updateActivity);
    window.addEventListener("touchmove", updateActivity);
    window.addEventListener("scroll", updateActivity);

    return () => {
      window.removeEventListener("mousemove", updateActivity);
      window.removeEventListener("mousedown", updateActivity);
      window.removeEventListener("keypress", updateActivity);
      window.removeEventListener("touchmove", updateActivity);
      window.removeEventListener("scroll", updateActivity);
    };
  }, [updateActivity]);

  useEffect(() => {
    const inactivityTimer = setInterval(() => {
      const currentTime = Date.now();
      const inactiveTime = currentTime - lastActivity;

      if (inactiveTime > 20000) {
        navigate(`/`);
      }
    }, 1000);

    return () => {
      clearInterval(inactivityTimer);
    };
  }, [lastActivity, navigate, userId]);

  useEffect(() => {
    if (user) {
      setMainTitle(
        `${user.firstname} ${user.lastname} - ${t("break", "Break")}`
      );
    } else {
      setMainTitle(t("break", "Break"));
    }
    setBackLink(`/${userId}`);
    return () => {
      setMainTitle("");
      setBackLink(null);
    };
  }, [setMainTitle, t, user]);

  useEffect(() => {
    if (lastBreak && !lastBreak.endTime) {
      const interval = setInterval(() => {
        setCurrentTime(Date.now());
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [lastBreak]);

  // Periodically check for auto-logout when user is on break
  useEffect(() => {
    if (lastBreak && !lastBreak.endTime) {
      const autoEndInterval = setInterval(() => {
        autoEndBreak();
      }, 10000); // Check every 10 seconds

      return () => clearInterval(autoEndInterval);
    }
  }, [lastBreak, autoEndBreak]);

  const handleCloseSnackbar = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Stack pt={5} pb={3} spacing={2}>
      <Box>
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 5 }}>
              <BreakStatus
                todayBreakMinutes={todayBreakMinutes}
                ongoingBreakSeconds={ongoingBreakSeconds}
                remainingBreakSeconds={remainingBreakSeconds}
                lastBreak={lastBreak || null}
                isCreatingBreak={isCreatingBreak}
                isCheckingOutBreak={isCheckingOutBreak}
                hasActiveTask={activeTaskData?.hasActiveTask || false}
                activeTaskDescription={
                  activeTaskData?.activeProjectTask
                    ? `${activeTaskData.activeProjectTask.projectName} - ${activeTaskData.activeProjectTask.packageName}`
                    : activeTaskData?.activeInternalTask
                      ? activeTaskData.activeInternalTask.internalTask?.name ||
                        t("internalTask", "Internal Task")
                      : null
                }
                onStartBreak={() => createBreak()}
                onEndBreak={() => checkOutBreak()}
                userId={Number(userId)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 7 }}>
              <BreakHistoryGraph
                userId={Number(userId)}
                timeRange={timeRange}
                onTimeRangeChange={setTimeRange}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export default Break;
