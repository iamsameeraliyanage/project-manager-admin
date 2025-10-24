import {
  Container,
  Stack,
  Button,
  Typography,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  TextField,
  FormControl,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useMainLayout } from "../../context/main-layout-provider";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import useEmployee from "../../hooks/api/use-employee";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEmployeeTodayInternalTaskTimeSheets } from "../../hooks/api/use-internal-task-timesheets";
import {
  bulkUpdateTimeSheetsQueryFn,
  bulkUpdateInternalTaskTimeSheetsQueryFn,
} from "../../services/api";
import { useGetTodayTimeSheets } from "../../hooks/api/use-timesheet-updates";
import { useCloseEmployeeTimeSheet } from "../../hooks/api/use-timesheets";

const STATUS_OPTIONS = [
  "taskStatus.onTrack",
  "taskStatus.atRisk",
  "taskStatus.needHelp",
];

const PROGRESS_OPTIONS = [
  "taskProgress.0to10",
  "taskProgress.11to20",
  "taskProgress.21to30",
  "taskProgress.31to40",
  "taskProgress.41to50",
  "taskProgress.51to60",
  "taskProgress.61to70",
  "taskProgress.71to80",
  "taskProgress.81to90",
  "taskProgress.91to100",
];

const SignOff = () => {
  const { setMainTitle } = useMainLayout();
  const { t } = useTranslation();
  const { userId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: users } = useEmployee();
  const user = users?.find((u) => u.id === Number(userId));

  // Get today's date in ISO format for the API
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data: internalTimeSheets } = useEmployeeTodayInternalTaskTimeSheets(
    Number(userId)
  );

  const { data: customerTimeSheets } = useGetTodayTimeSheets(Number(userId));

  const [timeSheetUpdates, setTimeSheetUpdates] = useState<{
    [key: number]: {
      status?: string;
      progress?: string;
      comment?: string;
      attentionNeeded?: boolean;
      hasAttended?: boolean;
      remarks?: string;
    };
  }>({});

  const { mutate: bulkUpdateTimeSheets } = useMutation({
    mutationFn: bulkUpdateTimeSheetsQueryFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employeeTimeSheets"] });
      queryClient.invalidateQueries({ queryKey: ["todayTimeSheets"] });
    },
  });

  const { mutate: bulkUpdateInternalTaskTimeSheets } = useMutation({
    mutationFn: bulkUpdateInternalTaskTimeSheetsQueryFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["employeeInternalTaskTimeSheets"],
      });
    },
  });

  const { mutate: closeEmployeeTimeSheet } = useCloseEmployeeTimeSheet(
    Number(userId)
  );
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    [key: number]: string[];
  }>({});
  const [successSnackbar, setSuccessSnackbar] = useState(false);

  const handleCloseSnackbar = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  useEffect(() => {
    if (user) {
      setMainTitle(
        `${user.firstname} ${user.lastname} - ${t("signOff", "Sign Off")}`
      );
    } else {
      setMainTitle(t("signOff", "Sign Off"));
    }

    return () => {
      setMainTitle("");
    };
  }, [setMainTitle, t, user]);

  const handleBack = () => {
    navigate(`/`);
  };

  const handleUpdateField = (
    timeSheetId: number,
    field: string,
    value: string
  ) => {
    setTimeSheetUpdates((prev) => {
      const updates = {
        ...prev,
        [timeSheetId]: {
          ...prev[timeSheetId],
          [field]: value,
        },
      };

      // If updating status field and it's yellow or red light
      if (
        field === "status" &&
        (value === "taskStatus.atRisk" || value === "taskStatus.needHelp")
      ) {
        updates[timeSheetId].attentionNeeded = true;
      } else if (field === "status" && value === "taskStatus.onTrack") {
        updates[timeSheetId].attentionNeeded = false;
      }

      return updates;
    });
  };

  const handleSubmit = () => {
    setValidationErrors({});
    let hasValidationError = false;
    const newValidationErrors: { [key: number]: string[] } = {};

    customerTimeSheets?.forEach((timeSheet) => {
      const updates = timeSheetUpdates[timeSheet.id] || {};
      const currentProgress = updates.progress || timeSheet.progress;
      const currentStatus = updates.status || timeSheet.status;
      newValidationErrors[timeSheet.id] = [];

      if (!currentProgress) {
        newValidationErrors[timeSheet.id].push("progress");
        hasValidationError = true;
      }
      if (!currentStatus) {
        newValidationErrors[timeSheet.id].push("status");
        hasValidationError = true;
      }
    });

    internalTimeSheets?.forEach((timeSheet) => {
      const updates = timeSheetUpdates[timeSheet.id] || {};
      const currentComment = updates.comment || timeSheet.comment;
      newValidationErrors[timeSheet.id] = [];

      if (!currentComment) {
        newValidationErrors[timeSheet.id].push("comment");
        hasValidationError = true;
      }
    });

    if (hasValidationError) {
      setValidationErrors(newValidationErrors);
      setOpenSnackbar(true);
      return;
    }

    const customerUpdates: Array<{
      timeSheetId: number;
      progress?: string;
      status?: string;
      attentionNeeded?: boolean;
      hasAttended?: boolean;
      remarks?: string;
    }> = [];

    const internalUpdates: Array<{
      timeSheetId: number;
      comment?: string;
      isFinalized?: boolean;
    }> = [];

    Object.entries(timeSheetUpdates).forEach(([timeSheetId, updates]) => {
      const id = Number(timeSheetId);

      const isCustomerTimeSheet = customerTimeSheets?.some(
        (ts) => ts.id === id
      );

      if (isCustomerTimeSheet) {
        if (updates.progress || updates.status || updates.remarks) {
          customerUpdates.push({
            timeSheetId: id,
            progress: updates.progress,
            status: updates.status,
            attentionNeeded: updates.attentionNeeded,
            hasAttended: updates.hasAttended,
            remarks: updates.remarks,
          });
        }
      } else {
        if (updates.comment) {
          internalUpdates.push({
            timeSheetId: id,
            comment: updates.comment,
            isFinalized: true,
          });
        }
      }
    });

    const updatePromises = [];

    // Update customer time sheets
    if (customerUpdates.length > 0) {
      updatePromises.push(bulkUpdateTimeSheets(customerUpdates));
    }

    // Update internal task time sheets
    if (internalUpdates.length > 0) {
      updatePromises.push(bulkUpdateInternalTaskTimeSheets(internalUpdates));
    }

    // First execute all updates
    Promise.all(updatePromises)
      .then(() => {
        // After updates are complete, close any active sessions
        return closeEmployeeTimeSheet();
      })
      .then(() => {
        setSuccessSnackbar(true);
        // Navigate after a short delay to show the success message
        setTimeout(() => {
          navigate(`/${userId}`);
        }, 1500);
      });
  };

  return (
    <Stack py={3} spacing={2}>
      <Container maxWidth="xl">
        <Button startIcon={<IoArrowBack />} onClick={handleBack} sx={{ mb: 2 }}>
          {t("back", "Back")}
        </Button>
      </Container>

      <Stack py={1}>
        <Container maxWidth="xl">
          <Card variant="outlined">
            <Stack p={3} spacing={3}>
              {!customerTimeSheets?.length && !internalTimeSheets?.length ? (
                <Typography variant="h6" align="center" color="text.secondary">
                  {t("noTimeLogged", "No time has been logged today")}
                </Typography>
              ) : (
                <>
                  {customerTimeSheets && customerTimeSheets.length > 0 && (
                    <>
                      <Typography variant="h6">
                        {t("customerProjects", "Customer Projects")}
                      </Typography>

                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell width="30%">
                                {t("projectDetails", "Project Details")}
                              </TableCell>
                              <TableCell width="10%">
                                {t("spentTime", "Spent Time")}
                              </TableCell>
                              <TableCell width="15%">
                                {t("progress", "Progress")}
                              </TableCell>
                              <TableCell width="15%">
                                {t("status", "Status")}
                              </TableCell>
                              <TableCell width="30%">
                                {t("remarks", "Remarks")}
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {(() => {
                              // Group time sheets by project and package combination
                              const grouped =
                                customerTimeSheets?.reduce(
                                  (acc, timeSheet) => {
                                    const key = `${timeSheet.projectId}-${timeSheet.packageId}`;
                                    if (!acc[key]) {
                                      acc[key] = {
                                        ...timeSheet,
                                        timeSheets: [timeSheet],
                                      };
                                    } else {
                                      acc[key].timeSheets.push(timeSheet);
                                    }
                                    return acc;
                                  },
                                  {} as Record<string, any>
                                ) || {};

                              return Object.values(grouped).map(
                                (groupedEntry: any) => {
                                  const timeSheets = groupedEntry.timeSheets;

                                  const totalSpentMinutes = timeSheets.reduce(
                                    (total: number, ts: any) => {
                                      if (ts.startTime) {
                                        const endTime = ts.endTime
                                          ? new Date(ts.endTime)
                                          : new Date();
                                        return (
                                          total +
                                          Math.round(
                                            (endTime.getTime() -
                                              new Date(
                                                ts.startTime
                                              ).getTime()) /
                                              (1000 * 60)
                                          )
                                        );
                                      }
                                      return total;
                                    },
                                    0
                                  );
                                  const spentHours =
                                    Math.round((totalSpentMinutes / 60) * 10) /
                                    10;
                                  const remainingHours =
                                    Math.round(
                                      (groupedEntry.estimatedTimeInHours! -
                                        groupedEntry.packageTotalMinutes! /
                                          60) *
                                        10
                                    ) / 10;

                                  // Use the first time sheet's ID as the key for form handling
                                  const mainTimeSheet = timeSheets[0];

                                  const allTimeSheetIds = timeSheets.map(
                                    (ts: any) => ts.id
                                  );

                                  // Custom handler to update all grouped time sheets
                                  const handleGroupedUpdateField = (
                                    field: string,
                                    value: string
                                  ) => {
                                    allTimeSheetIds.forEach((id: number) => {
                                      handleUpdateField(id, field, value);
                                    });
                                  };

                                  // Check if any of the grouped time sheets have validation errors
                                  const hasProgressError = allTimeSheetIds.some(
                                    (id: number) =>
                                      validationErrors[id]?.includes("progress")
                                  );
                                  const hasStatusError = allTimeSheetIds.some(
                                    (id: number) =>
                                      validationErrors[id]?.includes("status")
                                  );
                                  return (
                                    <TableRow
                                      key={mainTimeSheet.id}
                                      sx={{
                                        "&:hover": {
                                          backgroundColor:
                                            "rgba(0, 0, 0, 0.04)",
                                        },
                                        borderRadius: 1,
                                        "& > td": { padding: 2 },
                                      }}
                                    >
                                      <TableCell>
                                        <Card variant="outlined" sx={{ p: 2 }}>
                                          <Stack spacing={1.5}>
                                            <Box>
                                              <Typography
                                                variant="subtitle1"
                                                fontWeight="bold"
                                              >
                                                Project Name:{" "}
                                                {groupedEntry.projectName}
                                              </Typography>
                                              <Typography
                                                variant="body2"
                                                color="text.secondary"
                                              >
                                                Package Name:{" "}
                                                {groupedEntry.packageName}
                                              </Typography>
                                            </Box>
                                            <Stack
                                              direction="row"
                                              spacing={2}
                                              alignItems="center"
                                            >
                                              <Typography
                                                variant="caption"
                                                color="text.secondary"
                                              >
                                                {t("plannedTime", "Planned")}:{" "}
                                                {
                                                  groupedEntry.estimatedTimeInHours
                                                }
                                                h
                                              </Typography>
                                              <Typography
                                                variant="caption"
                                                color={
                                                  remainingHours < 0
                                                    ? "error.main"
                                                    : "success.main"
                                                }
                                                fontWeight="medium"
                                              >
                                                {t(
                                                  "remainingTime",
                                                  "Remaining"
                                                )}
                                                : {remainingHours}h
                                              </Typography>
                                            </Stack>
                                          </Stack>
                                        </Card>
                                      </TableCell>
                                      <TableCell align="center">
                                        <Typography
                                          variant="body1"
                                          fontWeight="medium"
                                        >
                                          {spentHours}h
                                        </Typography>
                                      </TableCell>
                                      <TableCell>
                                        <FormControl
                                          fullWidth
                                          size="small"
                                          error={hasProgressError}
                                        >
                                          <Select
                                            value={
                                              timeSheetUpdates[mainTimeSheet.id]
                                                ?.progress ||
                                              mainTimeSheet.progress?.toString() ||
                                              ""
                                            }
                                            onChange={(e) =>
                                              handleGroupedUpdateField(
                                                "progress",
                                                e.target.value
                                              )
                                            }
                                          >
                                            {PROGRESS_OPTIONS.map(
                                              (progress) => (
                                                <MenuItem
                                                  key={progress}
                                                  value={progress}
                                                >
                                                  {t(progress)}
                                                </MenuItem>
                                              )
                                            )}
                                          </Select>
                                        </FormControl>
                                      </TableCell>
                                      <TableCell>
                                        <FormControl
                                          fullWidth
                                          size="small"
                                          error={hasStatusError}
                                        >
                                          <Select
                                            value={
                                              timeSheetUpdates[mainTimeSheet.id]
                                                ?.status ||
                                              mainTimeSheet.status ||
                                              ""
                                            }
                                            onChange={(e) =>
                                              handleGroupedUpdateField(
                                                "status",
                                                e.target.value
                                              )
                                            }
                                          >
                                            {STATUS_OPTIONS.map((status) => (
                                              <MenuItem
                                                key={status}
                                                value={status}
                                              >
                                                {t(status)}
                                              </MenuItem>
                                            ))}
                                          </Select>
                                        </FormControl>
                                      </TableCell>
                                      <TableCell>
                                        <TextField
                                          fullWidth
                                          size="small"
                                          multiline
                                          rows={2}
                                          placeholder={t(
                                            "addRemarks",
                                            "Add remarks..."
                                          )}
                                          value={
                                            timeSheetUpdates[mainTimeSheet.id]
                                              ?.remarks || ""
                                          }
                                          onChange={(e) =>
                                            handleGroupedUpdateField(
                                              "remarks",
                                              e.target.value
                                            )
                                          }
                                        />
                                      </TableCell>
                                    </TableRow>
                                  );
                                }
                              );
                            })()}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </>
                  )}

                  {internalTimeSheets && internalTimeSheets.length > 0 && (
                    <>
                      <Typography variant="h6" sx={{ mt: 4 }}>
                        {t("internalTasks", "Internal Tasks")}
                      </Typography>

                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell width="40%">
                                {t("task", "Task")}
                              </TableCell>
                              <TableCell width="20%">
                                {t("spentTime", "Spent Time")}
                              </TableCell>
                              <TableCell width="40%">
                                {t("comment", "Comment")}
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {internalTimeSheets?.map((timeSheet) => {
                              const spentMinutes = timeSheet.startTime
                                ? Math.round(
                                    ((timeSheet.endTime
                                      ? new Date(timeSheet.endTime)
                                      : new Date()
                                    ).getTime() -
                                      new Date(timeSheet.startTime).getTime()) /
                                      (1000 * 60)
                                  )
                                : 0;
                              const spentHours =
                                Math.round((spentMinutes / 60) * 10) / 10;

                              return (
                                <TableRow key={timeSheet.id}>
                                  <TableCell>
                                    {timeSheet.internalTask.name}
                                  </TableCell>
                                  <TableCell align="center">
                                    <Typography
                                      variant="body1"
                                      fontWeight="medium"
                                    >
                                      {spentHours}h
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <TextField
                                      fullWidth
                                      size="small"
                                      error={validationErrors[
                                        timeSheet.id
                                      ]?.includes("comment")}
                                      value={
                                        timeSheetUpdates[timeSheet.id]
                                          ?.comment ??
                                        timeSheet.comment ??
                                        ""
                                      }
                                      onChange={(e) =>
                                        handleUpdateField(
                                          timeSheet.id,
                                          "comment",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </>
                  )}

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    sx={{ mt: 2 }}
                  >
                    {t("submit", "Submit")}
                  </Button>
                </>
              )}
            </Stack>
          </Card>
        </Container>
      </Stack>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          {t(
            "pleaseCompleteAllFields",
            "Please complete all required fields before submitting"
          )}
        </Alert>
      </Snackbar>
      <Snackbar
        open={successSnackbar}
        autoHideDuration={1500}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          {t("thankYouMessage", "Thank you for your hard work today!")}
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export default SignOff;
