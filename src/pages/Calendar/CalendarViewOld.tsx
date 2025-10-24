import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { IoArrowBack } from "react-icons/io5";
import useAuthUser from "../../hooks/api/use-auth-user";
import { useGetWorkpackagePlanning } from "../../hooks/api/use-workpackage-planning";
import WorkPackageTimelineCalendar from "../../components/WorkPackageTimelineCalendar/WorkPackageTimelineCalendar";
import {
  createWorkPackageTimelineGroups,
  createWorkPackageTimelineItems,
} from "../../components/WorkPackageTimelineCalendar/workPackageTimelineUtils";
import type { WorkPackageTimelineView } from "../../components/WorkPackageTimelineCalendar/WorkPackageTimelineViewSwitcher";

const CalendarView = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data: user } = useAuthUser();

  // State for date range - will be updated by calendar view changes
  const [dateRange, setDateRange] = useState(() => ({
    startTime: dayjs().subtract(1, "month").valueOf(),
    endTime: dayjs().add(2, "months").valueOf(),
  }));

  const {
    data: workPackagePlans,
    isLoading,
    error,
  } = useGetWorkpackagePlanning({
    employeeId: userId,
    startTime: dateRange.startTime,
    endTime: dateRange.endTime,
  });

  // Debug logging
  console.log("Work package plans data:", workPackagePlans);
  console.log("Date range:", {
    startTime: dateRange.startTime,
    endTime: dateRange.endTime,
  });
  console.log("Employee ID:", userId);

  const handleBack = () => {
    navigate(`/${userId}/calendar`);
  };

  const handleDateRangeChange = (
    startDate: dayjs.Dayjs,
    endDate: dayjs.Dayjs,
    view: WorkPackageTimelineView
  ) => {
    console.log("Date range changed:", {
      startDate: startDate.format("YYYY-MM-DD"),
      endDate: endDate.format("YYYY-MM-DD"),
      view: view,
    });

    setDateRange({
      startTime: startDate.valueOf(),
      endTime: endDate.valueOf(),
    });
  };

  const groups = useMemo(() => {
    if (!user) return [];
    const employeeName =
      `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Employee";
    return createWorkPackageTimelineGroups(employeeName);
  }, [user]);

  const items = useMemo(() => {
    if (!workPackagePlans) {
      console.log("No work package plans available");
      return [];
    }
    console.log("All work package plans:", workPackagePlans);

    // Filter by current user if we got all data
    const userPlans = userId
      ? workPackagePlans.filter((plan) => plan.employeeId === userId)
      : workPackagePlans;

    console.log("Filtered plans for user:", userId, userPlans);
    const items = createWorkPackageTimelineItems(userPlans);
    console.log("Created timeline items:", items);
    return items;
  }, [workPackagePlans, userId]);

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        width: "100%",
      }}
    >
      <Box sx={{ py: 2, px: 3, borderBottom: 1, borderColor: "divider" }}>
        <Button startIcon={<IoArrowBack />} onClick={handleBack} sx={{ mb: 1 }}>
          {t("back", "Back")}
        </Button>

        <Box sx={{ mb: 1 }}>
          <Typography variant="h5" component="h1" gutterBottom>
            {t("workPackagePlanning", "Work Package Planning")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t(
              "workPackagePlanningDescription",
              "View your assigned work packages and internal tasks"
            )}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ flex: 1, minHeight: 0, width: "100%", p: 2 }}>
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ m: 2 }}>
            {t("errorLoadingWorkPackages", "Error loading work packages")}:{" "}
            {error.message}
          </Alert>
        ) : (
          <Box sx={{ height: "100%", width: "100%", overflow: "hidden" }}>
            <WorkPackageTimelineCalendar
              groups={groups}
              items={items}
              onDateRangeChange={handleDateRangeChange}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CalendarView;
