import { Stack, Card, Button, Typography, CardContent } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useActiveSessions } from "../../hooks/api/use-active-sessions";
import { useCloseActiveSessions } from "../../hooks/api/use-close-active-sessions";
import ActiveSessionDialog from "../../components/ActiveSessionDialog/ActiveSessionDialog";
import { TimeLoggingRequestButton } from "../../components/TimeLoggingRequest/TimeLoggingRequestButton";
import { TimeLoggingRequestType } from "../../types/time-logging-request";
import {
  createEmployeeInternalTaskTimeSheetQueryFn,
  checkOutEmployeeInternalTaskTimeSheetQueryFn,
} from "../../services/api";
import { useEmployeeInternalTaskTimeSheet } from "../../hooks/api/use-internal-task-timesheets";
import useInternalTasks from "../../hooks/api/use-internal-tasks";

interface TimeLoggerProps {
  userId: string;
}

const TimeLogger = ({ userId }: TimeLoggerProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { taskId } = useParams();
  const { data: internalTasks } = useInternalTasks({
    staleTime: 0,
    gcTime: 0,
  });
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showActiveSessionDialog, setShowActiveSessionDialog] = useState(false);

  // Check for active sessions
  const { activeSessionsExcludingCurrent, hasConflictingSession } =
    useActiveSessions({
      employeeId: Number(userId),
      currentInternalTaskId: Number(taskId),
    });

  const { mutate: closeActiveSessions, isPending: isClosingActiveSessions } =
    useCloseActiveSessions();

  const selectedTask = internalTasks?.find(
    (task) => task.id === Number(taskId)
  );

  const {
    data: timeSheet,
    refetch: refetchTimeSheet,
    isLoading: isLoadingTimeSheet,
  } = useEmployeeInternalTaskTimeSheet(
    Number(taskId),
    Number(userId),
    "in_progress",
    {
      enabled: Boolean(taskId && userId),
      staleTime: 0,
      gcTime: 0,
    }
  );

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    if (timeSheet?.[0]?.startTime) {
      const calculateElapsedTime = () => {
        const startTime = new Date(timeSheet[0].startTime).getTime();
        const currentElapsed = Math.floor((Date.now() - startTime) / 1000);
        setElapsedTime(currentElapsed);
      };

      // Calculate initial time
      calculateElapsedTime();

      // Update every second (1000 milliseconds) for smoother updates
      intervalId = setInterval(calculateElapsedTime, 1000);
    } else {
      setElapsedTime(0);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [timeSheet]);

  const {
    mutate: createTimeSheet,
    isPending: isCreatingTimeSheet,
    error: createError,
  } = useMutation({
    mutationFn: createEmployeeInternalTaskTimeSheetQueryFn,
    onSuccess: () => {
      refetchTimeSheet();
      queryClient.invalidateQueries({
        queryKey: ["employeeProductivity"],
        refetchType: "active",
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["employeeCumulativeProductivity"],
        refetchType: "active",
        exact: false,
      });
    },
    onError: (error) => {
      console.error("Failed to create time sheet:", error);
    },
  });

  const {
    mutate: checkOutTimeSheet,
    isPending: isCheckingOutTimeSheet,
    error: checkOutError,
  } = useMutation({
    mutationFn: checkOutEmployeeInternalTaskTimeSheetQueryFn,
    onSuccess: () => {
      refetchTimeSheet();
      // Invalidate productivity queries to refresh cards
      queryClient.invalidateQueries({
        queryKey: ["employeeCumulativeProductivity"],
      });
    },
    onError: (error) => {
      console.error("Failed to check out:", error);
    },
  });

  // Extract time formatting to a utility function
  const formatTime = (seconds: number): string => {
    if (seconds < 0) return "0h 0m 0s";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  };

  const handleTimeSheetAction = () => {
    if (!taskId || !userId) {
      console.error("Missing taskId or userId");
      return;
    }

    if (timeSheet && timeSheet.length === 0) {
      // Check for conflicting sessions before checking in
      if (hasConflictingSession) {
        setShowActiveSessionDialog(true);
      } else {
        createTimeSheet({
          internalTaskId: Number(taskId),
          employeeId: Number(userId),
        });
      }
    } else {
      checkOutTimeSheet({
        internalTaskId: Number(taskId),
        employeeId: Number(userId),
      });
    }
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6" gutterBottom>
            {t("timeLogger", "Time Logger")}
          </Typography>

          {selectedTask && (
            <Typography variant="subtitle1" color="text.secondary">
              {t("currentTask", "Current Task")}: {selectedTask.name}
            </Typography>
          )}

          {isLoadingTimeSheet ? (
            <Typography>Loading...</Typography>
          ) : (
            timeSheet &&
            timeSheet.length > 0 && (
              <Typography variant="body1" color="primary">
                {t("workingTime", "Working Time")}: {formatTime(elapsedTime)}
              </Typography>
            )
          )}

          {(createError || checkOutError) && (
            <Typography color="error">
              {t("errorOccurred", "An error occurred. Please try again.")}
            </Typography>
          )}

          <Button
            variant="contained"
            color="primary"
            fullWidth
            disabled={
              isCreatingTimeSheet ||
              isCheckingOutTimeSheet ||
              isLoadingTimeSheet ||
              isClosingActiveSessions ||
              !taskId ||
              !userId
            }
            onClick={handleTimeSheetAction}
          >
            {timeSheet && timeSheet.length > 0
              ? t("checkOut", "Check Out")
              : t("check_in", "Check In")}
          </Button>

          {selectedTask && (
            <TimeLoggingRequestButton
              requestType={TimeLoggingRequestType.INTERNAL_TASK}
              internalTaskId={Number(taskId)}
              internalTaskName={selectedTask.name}
              employeeId={Number(userId)}
              variant="outlined"
              fullWidth
            />
          )}

          <ActiveSessionDialog
            open={showActiveSessionDialog}
            onClose={() => setShowActiveSessionDialog(false)}
            onContinue={() => {
              // Close active sessions and then create new time sheet
              closeActiveSessions(
                {
                  sessions: activeSessionsExcludingCurrent,
                  employeeId: Number(userId),
                },
                {
                  onSuccess: () => {
                    setShowActiveSessionDialog(false);
                    createTimeSheet({
                      internalTaskId: Number(taskId),
                      employeeId: Number(userId),
                    });
                  },
                }
              );
            }}
            activeSessions={activeSessionsExcludingCurrent}
            newTaskDescription={
              selectedTask?.name || t("internalTask", "Internal Task")
            }
          />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default TimeLogger;
