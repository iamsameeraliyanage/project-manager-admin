import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Stack,
  LinearProgress,
  Chip,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import {
  Work as WorkIcon,
  BeachAccess as VacationIcon,
  EventAvailable as AvailableIcon,
  EventBusy as PlannedIcon,
  TrendingUp as ProductivityIcon,
  CalendarToday as CalendarIcon,
  LocalHospital as SickIcon,
  MoveUp as MigrationIcon,
  Info as InfoIcon,
  Schedule as OvertimeIcon,
  TrendingDown as UndertimeIcon,
} from "@mui/icons-material";
import { useMainLayout } from "../../context/main-layout-provider";
import useEmployee from "../../hooks/api/use-employee";
import { ROUTES } from "../../routes/routes.config";
import { useEmployeeTimeReport, useEmployeeLast30DaysReport } from "../../hooks/api/use-time-report";
import dayjs from "../../utils/dayjs";
import MonthlyHoursChart from "../../components/TimeReport/MonthlyHoursChart";
import Last30DaysChart from "../../components/TimeReport/Last30DaysChart";

const TimeReport = () => {
  const { userId } = useParams();
  const { t } = useTranslation();
  const { setMainTitle, setBackLink } = useMainLayout();
  const [selectedYear, _] = useState(dayjs().year());

  const { data: users } = useEmployee();
  const user = users?.find((u) => u.id === Number(userId));

  // Fetch time report data
  const {
    data: timeReportData,
    isLoading,
    error,
  } = useEmployeeTimeReport(Number(userId), selectedYear);

  // Fetch last 30 days data
  const {
    data: last30DaysData,
    isLoading: isLoadingLast30Days,
    error: errorLast30Days,
  } = useEmployeeLast30DaysReport(Number(userId));

  useEffect(() => {
    if (user) {
      setMainTitle(
        `${user.firstname} ${user.lastname} - ${t("timeReport", "Time Report")}`
      );
    } else {
      setMainTitle(t("timeReport", "Time Report"));
    }
    setBackLink(`/${userId}/${ROUTES.USER.CALENDAR}`);
    return () => {
      setMainTitle("");
      setBackLink(null);
    };
  }, [setMainTitle, t, user]);

  const formatHours = (hours: number): string => {
    return `${hours.toFixed(1)}h`;
  };

  const formatDays = (days: number): string => {
    return `${days} ${days === 1 ? t("day", "day") : t("days", "days")}`;
  };

  const getProductivityColor = (percentage: number): string => {
    if (percentage >= 80) return "success";
    if (percentage >= 60) return "warning";
    return "error";
  };

  if (isLoading || isLoadingLast30Days) {
    return (
      <Box pt={5}>
        <Container maxWidth="xl">
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="400px"
          >
            <CircularProgress />
          </Box>
        </Container>
      </Box>
    );
  }

  if (error || errorLast30Days) {
    return (
      <Box pt={5}>
        <Container maxWidth="xl">
          <Alert severity="error">
            {t("errorLoadingTimeReport", "Error loading time report data")}
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box pt={5}>
      <Container maxWidth="xl">
        <Stack spacing={3}>
          {/* Year Selection Header */}
          <Card variant="outlined">
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h5" component="h1">
                  {t("timeReport", "Time Report")} - {selectedYear}
                </Typography>
                <Box display="flex" alignItems="center" gap={2}>
                  <CalendarIcon color="primary" />
                  <Typography variant="body1" color="text.secondary">
                    {t("yearlyOverview", "Yearly Overview")}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Main Statistics Cards */}
          <Grid container spacing={3}>
            {/* Total Hours Worked */}
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <WorkIcon color="primary" sx={{ fontSize: 40 }} />
                    <Box flex={1}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography
                          variant="h4"
                          fontWeight="bold"
                          color="primary"
                        >
                          {formatHours(timeReportData?.totalHoursWorked || 0)}
                        </Typography>
                        {timeReportData?.hasMigration && (
                          <Chip
                            icon={<MigrationIcon />}
                            label={t("includesMigration", "Includes Migration")}
                            size="small"
                            color="info"
                            variant="outlined"
                            sx={{ fontSize: "0.6rem", height: 20 }}
                          />
                        )}
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {t("totalHoursWorked", "Total Hours Worked")}
                      </Typography>
                    </Box>
                  </Box>
                  {timeReportData?.expectedWorkingHours && (
                    <Box mt={2}>
                      <Typography variant="caption" color="text.secondary">
                        {t("expected", "Expected")}:{" "}
                        {formatHours(timeReportData.expectedWorkingHours)}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(
                          (timeReportData.totalHoursWorked /
                            timeReportData.expectedWorkingHours) *
                            100,
                          100
                        )}
                        sx={{ mt: 1, height: 6, borderRadius: 1 }}
                      />
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Vacation Taken */}
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <VacationIcon color="secondary" sx={{ fontSize: 40 }} />
                    <Box flex={1}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography
                          variant="h4"
                          fontWeight="bold"
                          color="secondary"
                        >
                          {formatDays(timeReportData?.vacationTaken || 0)}
                        </Typography>
                        {timeReportData?.hasMigration && timeReportData.migrationData?.vacationDaysMigrated && timeReportData.migrationData.vacationDaysMigrated > 0 && (
                          <Chip
                            icon={<MigrationIcon />}
                            label={t("includesMigration", "Includes Migration")}
                            size="small"
                            color="info"
                            variant="outlined"
                            sx={{ fontSize: "0.6rem", height: 20 }}
                          />
                        )}
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {t("vacationTaken", "Vacation Taken")}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Vacation Left */}
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <AvailableIcon color="success" sx={{ fontSize: 40 }} />
                    <Box>
                      <Typography
                        variant="h4"
                        fontWeight="bold"
                        color="success.main"
                      >
                        {formatDays(timeReportData?.vacationLeft || 0)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t("vacationLeft", "Vacation Left")}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Planned Vacation */}
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <PlannedIcon color="info" sx={{ fontSize: 40 }} />
                    <Box>
                      <Typography
                        variant="h4"
                        fontWeight="bold"
                        color="info.main"
                      >
                        {formatDays(timeReportData?.plannedVacation || 0)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t("plannedVacation", "Planned Vacation")}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Sick Days */}
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <SickIcon color="error" sx={{ fontSize: 40 }} />
                    <Box flex={1}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography
                          variant="h4"
                          fontWeight="bold"
                          color="error.main"
                        >
                          {formatDays(timeReportData?.sickDays || 0)}
                        </Typography>
                        {timeReportData?.hasMigration && timeReportData.migrationData?.sickLeaveDaysMigrated && timeReportData.migrationData.sickLeaveDaysMigrated > 0 && (
                          <Chip
                            icon={<MigrationIcon />}
                            label={t("includesMigration", "Includes Migration")}
                            size="small"
                            color="info"
                            variant="outlined"
                            sx={{ fontSize: "0.6rem", height: 20 }}
                          />
                        )}
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {t("sickDays", "Sick Days")}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Overtime/Undertime */}
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Card 
                variant="outlined" 
                sx={{ 
                  height: "100%",
                  backgroundColor: timeReportData?.overtimeUndertimeHours && timeReportData.overtimeUndertimeHours >= 0 ? "success.50" : "warning.50",
                  borderColor: timeReportData?.overtimeUndertimeHours && timeReportData.overtimeUndertimeHours >= 0 ? "success.200" : "warning.200"
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    {timeReportData?.overtimeUndertimeHours && timeReportData.overtimeUndertimeHours >= 0 ? (
                      <OvertimeIcon color="success" sx={{ fontSize: 40 }} />
                    ) : (
                      <UndertimeIcon color="warning" sx={{ fontSize: 40 }} />
                    )}
                    <Box flex={1}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography
                          variant="h4"
                          fontWeight="bold"
                          color={timeReportData?.overtimeUndertimeHours && timeReportData.overtimeUndertimeHours >= 0 ? "success.main" : "warning.main"}
                        >
                          {timeReportData?.overtimeUndertimeHours && timeReportData.overtimeUndertimeHours >= 0 ? "+" : ""}
                          {formatHours(Math.abs(timeReportData?.overtimeUndertimeHours || 0))}
                        </Typography>
                        {timeReportData?.hasMigration && (
                          <Chip
                            icon={<MigrationIcon />}
                            label={t("includesMigration", "Includes Migration")}
                            size="small"
                            color="info"
                            variant="outlined"
                            sx={{ fontSize: "0.6rem", height: 20 }}
                          />
                        )}
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {timeReportData?.overtimeUndertimeHours && timeReportData.overtimeUndertimeHours >= 0 
                          ? t("overtime", "Overtime") 
                          : t("undertime", "Undertime")
                        }
                      </Typography>
                    </Box>
                  </Box>
                  <Box mt={2}>
                    <Typography variant="caption" color="text.secondary">
                      {t("asOfToday", "As of today")}: {new Date().toLocaleDateString()}
                    </Typography>
                    <Box mt={1}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        {t("actualHours", "Actual")}: {formatHours(timeReportData?.actualHoursToDate || 0)} |{" "}
                        {t("expectedHours", "Expected")}: {formatHours(timeReportData?.expectedHoursToDate || 0)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        {t("workingDaysToDate", "Working days")}: {timeReportData?.workingDaysToDate || 0}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Productivity Overview */}
          <Card variant="outlined">
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <ProductivityIcon color="primary" />
                <Typography variant="h6">
                  {t("productivityOverview", "Work Performance")}
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      {t("overallProductivity", "Overall Work Performance")}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Box flex={1}>
                        <LinearProgress
                          variant="determinate"
                          value={timeReportData?.productivityPercentage || 0}
                          sx={{
                            height: 12,
                            borderRadius: 2,
                            backgroundColor: "grey.200",
                            "& .MuiLinearProgress-bar": {
                              borderRadius: 2,
                            },
                          }}
                          color={
                            getProductivityColor(
                              timeReportData?.productivityPercentage || 0
                            ) as any
                          }
                        />
                      </Box>
                      <Chip
                        label={`${(
                          timeReportData?.productivityPercentage || 0
                        ).toFixed(1)}%`}
                        color={
                          getProductivityColor(
                            timeReportData?.productivityPercentage || 0
                          ) as any
                        }
                        size="small"
                      />
                    </Box>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Stack spacing={1}>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        {t("workingDaysInYear", "Working Days in Year")}:
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {timeReportData?.workingDaysInYear || 0}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        {t("averageHoursPerDay", "Average Hours per Day")}:
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {timeReportData?.workingDaysInYear
                          ? (
                              (timeReportData.totalHoursWorked || 0) /
                              timeReportData.workingDaysInYear
                            ).toFixed(1)
                          : "0.0"}
                        h
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Migration Information */}
          {timeReportData?.hasMigration && timeReportData.migrationData && (
            <Card variant="outlined" sx={{ backgroundColor: "info.50", borderColor: "info.200" }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <MigrationIcon color="info" />
                  <Typography variant="h6" color="info.main">
                    {t("migrationData", "Migration Data")}
                  </Typography>
                  <Chip
                    icon={<InfoIcon />}
                    label={t("dataFromPreviousSystem", "Data from Previous System")}
                    color="info"
                    size="small"
                    variant="outlined"
                  />
                </Box>

                <Alert severity="info" sx={{ mb: 3 }}>
                  <Typography variant="body2">
                    {t("migrationNote", "The following data was migrated from your previous time tracking system and is included in your total calculations.")}
                  </Typography>
                </Alert>

                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {t("migrationDate", "Migration Date")}:
                      </Typography>
                      <Typography variant="h6" fontWeight="medium">
                        {new Date(timeReportData.migrationData.migrationDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {t("migratedHours", "Migrated Hours")}:
                      </Typography>
                      <Typography variant="h6" fontWeight="medium" color="primary">
                        {formatHours(timeReportData.migrationData.migrationHours)}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {t("migratedVacationDays", "Migrated Vacation")}:
                      </Typography>
                      <Typography variant="h6" fontWeight="medium" color="secondary">
                        {formatDays(timeReportData.migrationData.vacationDaysMigrated)}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {t("migratedSickDays", "Migrated Sick Days")}:
                      </Typography>
                      <Typography variant="h6" fontWeight="medium" color="error">
                        {formatDays(timeReportData.migrationData.sickLeaveDaysMigrated)}
                      </Typography>
                    </Box>
                  </Grid>

                  {timeReportData.migrationData.otherLeaveDaysMigrated > 0 && (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {t("otherMigratedLeave", "Other Migrated Leave")}:
                        </Typography>
                        <Typography variant="h6" fontWeight="medium">
                          {formatDays(timeReportData.migrationData.otherLeaveDaysMigrated)}
                        </Typography>
                      </Box>
                    </Grid>
                  )}

                  {timeReportData.migrationData.overtimeUndertimeHours !== 0 && (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {t("overtimeUndertimeBalance", "Overtime/Undertime Balance")}:
                        </Typography>
                        <Typography 
                          variant="h6" 
                          fontWeight="medium" 
                          color={timeReportData.migrationData.overtimeUndertimeHours >= 0 ? "success.main" : "warning.main"}
                        >
                          {timeReportData.migrationData.overtimeUndertimeHours >= 0 ? "+" : ""}
                          {formatHours(timeReportData.migrationData.overtimeUndertimeHours)}
                        </Typography>
                      </Box>
                    </Grid>
                  )}

                  {timeReportData.migrationData.notes && (
                    <Grid size={12}>
                      <Box sx={{ mt: 2, p: 2, backgroundColor: "grey.50", borderRadius: 1 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {t("migrationNotes", "Migration Notes")}:
                        </Typography>
                        <Typography variant="body2">
                          {timeReportData.migrationData.notes}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          )}

          {/* Last 30 Days Chart */}
          {last30DaysData && (
            <Last30DaysChart
              data={last30DaysData.dailyBreakdown}
              totalHours={last30DaysData.totalHours}
              averageHoursPerDay={last30DaysData.averageHoursPerDay}
              overtimeHours={last30DaysData.overtimeHours}
              undertimeHours={last30DaysData.undertimeHours}
            />
          )}

          {/* Monthly Hours Chart */}
          {timeReportData?.monthlyHours && (
            <MonthlyHoursChart
              data={timeReportData.monthlyHours}
              year={selectedYear}
            />
          )}
        </Stack>
      </Container>
    </Box>
  );
};

export default TimeReport;
