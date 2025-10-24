import {
  Stack,
  Card,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  type SelectChangeEvent,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useProjects, useWorkPackages } from "../../hooks/api/use-project";
import { useGetEmployeeWorkPackageTimeSheet } from "../../hooks/api/use-timesheets";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  checkOutEmployeeWorkPackageTimeSheetQueryFn,
  createEmployeeWorkPackageTimeSheetQueryFn,
} from "../../services/api";
import { useState, useEffect } from "react";
import { useActiveSessions } from "../../hooks/api/use-active-sessions";
import { useCloseActiveSessions } from "../../hooks/api/use-close-active-sessions";
import ActiveSessionDialog from "../../components/ActiveSessionDialog/ActiveSessionDialog";
import { TimeLoggingRequestButton } from "../../components/TimeLoggingRequest/TimeLoggingRequestButton";
import { TimeLoggingRequestType } from "../../types/time-logging-request";

interface TimeLoggerProps {
  userId: string;
  selectedProject: string;
  selectedWorkPackage: string;
  onProjectChange: (e: SelectChangeEvent<string>) => void;
  onWorkPackageChange: (e: SelectChangeEvent<string>) => void;
}

const TimeLogger = ({
  userId,
  selectedProject,
  selectedWorkPackage,
  onProjectChange,
  onWorkPackageChange,
}: TimeLoggerProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showActiveSessionDialog, setShowActiveSessionDialog] = useState(false);

  // Check for active sessions
  const { activeSessionsExcludingCurrent, hasConflictingSession } =
    useActiveSessions({
      employeeId: Number(userId),
      currentProjectId: Number(selectedProject),
      currentWorkPackageId: Number(selectedWorkPackage),
    });

  const { mutate: closeActiveSessions, isPending: isClosingActiveSessions } =
    useCloseActiveSessions();
  const { data: projects } = useProjects();
  const { data: workPackages } = useWorkPackages(Number(selectedProject), {
    enabled: Boolean(selectedProject),
    staleTime: 0,
    gcTime: 0,
  });

  const { data: timeSheet, refetch: refetchTimeSheet } =
    useGetEmployeeWorkPackageTimeSheet(
      Number(selectedProject),
      Number(selectedWorkPackage),
      Number(userId),
      "in_progress",
      {
        enabled: Boolean(selectedProject && selectedWorkPackage && userId),
      }
    );

  const { mutate: createTimeSheet, isPending: isCreatingTimeSheet } =
    useMutation({
      mutationFn: createEmployeeWorkPackageTimeSheetQueryFn,
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
    });

  const { mutate: checkOutTimeSheet, isPending: isCheckingOutTimeSheet } =
    useMutation({
      mutationFn: checkOutEmployeeWorkPackageTimeSheetQueryFn,
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
    });

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    if (timeSheet?.startTime) {
      // Calculate initial elapsed time
      const startTime = new Date(timeSheet.startTime).getTime();
      const initialElapsed = Math.floor((Date.now() - startTime) / 1000);
      setElapsedTime(initialElapsed);

      // Update elapsed time every second
      intervalId = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else {
      setElapsedTime(0);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [timeSheet]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  };

  return (
    <Card variant="outlined">
      <Stack p={2} spacing={2}>
        <Typography variant="h6" gutterBottom>
          {t("timeLogger", "Time Logger")}
        </Typography>

        <FormControl fullWidth>
          <InputLabel>{t("projects", "Projects")}</InputLabel>
          <Select
            value={selectedProject}
            label={t("projects", "Projects")}
            onChange={onProjectChange}
          >
            {projects?.map((project) => (
              <MenuItem key={project.id} value={project.id}>
                {project.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>{t("workPackages", "Work Packages")}</InputLabel>
          <Select
            value={selectedWorkPackage}
            label={t("workPackages", "Work Packages")}
            onChange={onWorkPackageChange}
            disabled={!selectedProject}
          >
            {workPackages?.map((wp) => (
              <MenuItem key={wp.id} value={wp.id}>
                {wp.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {timeSheet && (
          <Typography variant="subtitle1" color="text.secondary" align="center">
            {t("workingTime", "Working Time")}: {formatTime(elapsedTime)}
          </Typography>
        )}

        <Button
          variant="contained"
          color="primary"
          fullWidth
          disabled={
            !selectedProject ||
            !selectedWorkPackage ||
            isCreatingTimeSheet ||
            isCheckingOutTimeSheet ||
            isClosingActiveSessions
          }
          onClick={() => {
            if (!timeSheet) {
              // Check for conflicting sessions before checking in
              if (hasConflictingSession) {
                setShowActiveSessionDialog(true);
              } else {
                createTimeSheet({
                  projectId: Number(selectedProject),
                  workPackageId: Number(selectedWorkPackage),
                  employeeId: Number(userId),
                });
              }
            } else {
              checkOutTimeSheet({
                projectId: Number(selectedProject),
                workPackageId: Number(selectedWorkPackage),
                employeeId: Number(userId),
              });
            }
          }}
        >
          {timeSheet ? t("checkOut", "Check Out") : t("check_in", "Check In")}
        </Button>

        {selectedProject && selectedWorkPackage && (
          <TimeLoggingRequestButton
            requestType={TimeLoggingRequestType.PROJECT_WORKPACKAGE}
            projectId={Number(selectedProject)}
            projectName={projects?.find(p => p.id === Number(selectedProject))?.name}
            workPackageId={Number(selectedWorkPackage)}
            workPackageName={workPackages?.find(wp => wp.id === Number(selectedWorkPackage))?.name}
            employeeId={Number(userId)}
            variant="outlined"
            fullWidth
          />
        )}

        <ActiveSessionDialog
          open={showActiveSessionDialog}
          onClose={() => setShowActiveSessionDialog(false)}
          onContinue={() => {
            closeActiveSessions(
              {
                sessions: activeSessionsExcludingCurrent,
                employeeId: Number(userId),
              },
              {
                onSuccess: () => {
                  setShowActiveSessionDialog(false);
                  createTimeSheet({
                    projectId: Number(selectedProject),
                    workPackageId: Number(selectedWorkPackage),
                    employeeId: Number(userId),
                  });
                },
              }
            );
          }}
          activeSessions={activeSessionsExcludingCurrent}
          newTaskDescription={`${
            projects?.find((p) => p.id === Number(selectedProject))?.name
          } - ${
            workPackages?.find((wp) => wp.id === Number(selectedWorkPackage))
              ?.name
          }`}
        />
      </Stack>
    </Card>
  );
};

export default TimeLogger;
