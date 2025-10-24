import {
  Card,
  Container,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  CardContent,
  Box,
  Paper,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  useGetCombinedTimeSheets,
  useCreateInternalTaskTimeSheet,
  useCheckOutInternalTaskTimeSheet,
} from "../../hooks/api/use-timesheets";
import { format, differenceInSeconds } from "date-fns";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createEmployeeWorkPackageTimeSheetQueryFn,
  checkOutEmployeeWorkPackageTimeSheetQueryFn,
} from "../../services/api";
import FullPageLoader from "../../widgets/FullPageLoader/FullPageLoader";
import { ROUTES } from "../../routes/routes.config";
import { useEmployeeLastBreak } from "../../hooks/api/use-employee-break";
import { Chip } from "@mui/material";
import { FiCoffee } from "react-icons/fi";

interface TimeSheetHistoryProps {
  userId: string;
}

const TimeSheetHistory = ({ userId }: TimeSheetHistoryProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: timeSheets, isLoading } = useGetCombinedTimeSheets(
    Number(userId),
    10
  );
  const { data: lastBreak } = useEmployeeLastBreak(Number(userId));
  const [currentTime, setCurrentTime] = useState(new Date());

  const { mutate: createTimeSheet } = useMutation({
    mutationFn: createEmployeeWorkPackageTimeSheetQueryFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employeeTimeSheets"] });
      queryClient.invalidateQueries({ queryKey: ["combinedTimeSheets"] });
    },
  });

  const { mutate: checkOutTimeSheet } = useMutation({
    mutationFn: checkOutEmployeeWorkPackageTimeSheetQueryFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employeeTimeSheets"] });
      queryClient.invalidateQueries({ queryKey: ["combinedTimeSheets"] });
    },
  });

  const { mutate: createInternalTaskTimeSheet } =
    useCreateInternalTaskTimeSheet({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["combinedTimeSheets"] });
      },
    });

  const { mutate: checkOutInternalTaskTimeSheet } =
    useCheckOutInternalTaskTimeSheet({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["combinedTimeSheets"] });
      },
    });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDuration = (startTime: string, endTime: string | null) => {
    if (!endTime) {
      const seconds = differenceInSeconds(currentTime, new Date(startTime));
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = seconds % 60;
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    }
    const seconds = differenceInSeconds(new Date(endTime), new Date(startTime));
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  };

  const isTimeSheetOnBreak = (timeSheet: any) => {
    if (!lastBreak || lastBreak.endTime) return false;

    // Check if this time sheet is currently active and has the break
    const isActiveTimeSheet = !timeSheet.endTime;
    if (!isActiveTimeSheet) return false;

    // For project time sheets, check if break is linked to this project task
    if (
      timeSheet.type === "project" &&
      lastBreak.packageTimeSheetId === timeSheet.id
    ) {
      return true;
    }

    // For internal time sheets, check if break is linked to this internal task
    if (
      timeSheet.type === "internal" &&
      lastBreak.internalTaskTimeSheetId === timeSheet.id
    ) {
      return true;
    }

    return false;
  };

  const handleRowClick = (timeSheet: any) => {
    if (timeSheet.type === "project") {
      navigate(
        `/${userId}/${ROUTES.USER.CUSTOMER_PROJECTS}?${ROUTES.PARAMS.PROJECT}=${timeSheet.projectId}&${ROUTES.PARAMS.PROJECT}=${timeSheet.packageId}`
      );
    } else if (timeSheet.type === "internal") {
      navigate(`/${userId}/${ROUTES.USER.INTERNAL_PROJECTS}`);
    }
  };

  const handleTimeSheetAction = (timeSheet: any) => {
    if (timeSheet.type === "project") {
      if (timeSheet.endTime) {
        // Check in to project
        createTimeSheet({
          projectId: timeSheet.projectId,
          workPackageId: timeSheet.packageId,
          employeeId: Number(userId),
        });
      } else {
        // Check out from project
        checkOutTimeSheet({
          projectId: timeSheet.projectId,
          workPackageId: timeSheet.packageId,
          employeeId: Number(userId),
        });
      }
    } else if (timeSheet.type === "internal") {
      if (timeSheet.endTime) {
        // Check in to internal task
        createInternalTaskTimeSheet({
          internalTaskId: timeSheet.internalTaskId,
          employeeId: Number(userId),
        });
      } else {
        // Check out from internal task
        checkOutInternalTaskTimeSheet({
          internalTaskId: timeSheet.internalTaskId,
          employeeId: Number(userId),
        });
      }
    }
  };

  if (isLoading) {
    return <FullPageLoader />;
  }

  return (
    <Stack>
      <Container maxWidth="xl">
        <Card sx={{ mt: 2 }} variant="outlined">
          <CardContent>
            <Box
              sx={{
                borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                pb: 2,
                mb: 3,
              }}
            >
              <Typography variant="h4">
                {t("lastTimeSheets", "Last 10 Time Sheets")}
              </Typography>
            </Box>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        py: 1.5,
                      }}
                    >
                      {t("project", "Project")}
                    </TableCell>
                    <TableCell
                      sx={{
                        py: 1.5,
                      }}
                    >
                      {t("task", "Task")}/{t("package", "Package")}
                    </TableCell>
                    <TableCell
                      sx={{
                        py: 1.5,
                      }}
                    >
                      {t("startTime", "Start Time")}
                    </TableCell>
                    <TableCell
                      sx={{
                        py: 1.5,
                      }}
                    >
                      {t("endTime", "End Time")}
                    </TableCell>
                    <TableCell
                      sx={{
                        py: 1.5,
                      }}
                    >
                      {t("duration", "Duration")}
                    </TableCell>
                    <TableCell
                      sx={{
                        py: 1.5,
                      }}
                    >
                      {t("status", "Status")}
                    </TableCell>
                    <TableCell
                      sx={{
                        py: 1.5,
                      }}
                    >
                      {t("actions", "Actions")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {timeSheets?.map((timeSheet) => (
                    <TableRow
                      key={`${timeSheet.type}-${timeSheet.id}`}
                      sx={{
                        "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
                      }}
                    >
                      <TableCell
                        onClick={() => handleRowClick(timeSheet)}
                        sx={{ cursor: "pointer" }}
                      >
                        {timeSheet.type === "project"
                          ? timeSheet.projectName
                          : t("internalTask", "Internal Task")}
                      </TableCell>
                      <TableCell
                        onClick={() => handleRowClick(timeSheet)}
                        sx={{ cursor: "pointer" }}
                      >
                        {timeSheet.type === "project"
                          ? timeSheet.packageName
                          : timeSheet.internalTaskName}
                      </TableCell>
                      <TableCell
                        onClick={() => handleRowClick(timeSheet)}
                        sx={{ cursor: "pointer" }}
                      >
                        {format(
                          new Date(timeSheet.startTime),
                          "yyyy-MM-dd HH:mm"
                        )}
                      </TableCell>
                      <TableCell
                        onClick={() => handleRowClick(timeSheet)}
                        sx={{ cursor: "pointer" }}
                      >
                        {timeSheet.endTime
                          ? format(
                              new Date(timeSheet.endTime),
                              "yyyy-MM-dd HH:mm"
                            )
                          : t("ongoing", "Ongoing")}
                      </TableCell>
                      <TableCell
                        onClick={() => handleRowClick(timeSheet)}
                        sx={{ cursor: "pointer" }}
                      >
                        {formatDuration(timeSheet.startTime, timeSheet.endTime)}
                      </TableCell>
                      <TableCell>
                        {isTimeSheetOnBreak(timeSheet) && (
                          <Chip
                            icon={<FiCoffee size={12} />}
                            label={t("onBreak", "On Break")}
                            size="small"
                            color="warning"
                            variant="outlined"
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color={timeSheet.endTime ? "primary" : "error"}
                          size="small"
                          onClick={() => handleTimeSheetAction(timeSheet)}
                        >
                          {timeSheet.endTime
                            ? t("check_in", "Check In")
                            : t("checkOut", "Check Out")}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Container>
    </Stack>
  );
};

export default TimeSheetHistory;
