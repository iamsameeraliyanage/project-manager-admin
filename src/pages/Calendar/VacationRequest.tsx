import { Box, Typography, Fab } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import LeaveTimelineCalendar from "../../components/LeaveTimelineCalendar/LeaveTimelineCalendar";
import { LeaveSummary } from "../../components/LeaveSummary/LeaveSummary";
import {
  createLeaveTimelineGroups,
  createLeaveTimelineItems,
  createLeaveNonWorkingDayItems,
  type TimelineView,
} from "../../components/LeaveTimelineCalendar/leaveTimelineUtils";
import useEmployee from "../../hooks/api/use-employee";
import { useAllLeaves } from "../../hooks/api/use-leaves";
import { useHolidays } from "../../hooks/api/use-holidays";
import { useWorkSchedules } from "../../hooks/api/use-work-schedules";
import { useMainLayout } from "../../context/main-layout-provider";
import { useEffect, useMemo, useState } from "react";
import { ROUTES } from "../../routes/routes.config";

const VacationRequest = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { setMainTitle, setBackLink } = useMainLayout();

  const { data: users } = useEmployee();
  const user = users?.find((u) => u.id === Number(userId));

  // Fetch employees and leaves from API
  const {
    data: employees = [],
    isLoading: employeesLoading,
    error: employeesError,
  } = useEmployee();
  const {
    data: leaves = [],
    isLoading: leavesLoading,
    error: leavesError,
  } = useAllLeaves();

  // Fetch holidays and work schedules with a 3-year window
  const currentYear = dayjs().year();
  const holidaysStartDate = `${currentYear - 1}-01-01`;
  const holidaysEndDate = `${currentYear + 1}-12-31`;
  const { data: holidaysData = [] } = useHolidays(holidaysStartDate, holidaysEndDate);
  const { data: workSchedules = [] } = useWorkSchedules(holidaysStartDate, holidaysEndDate);

  // State to track visible time range for non-working day items
  const [visibleTimeStart, setVisibleTimeStart] = useState<number>();
  const [visibleTimeEnd, setVisibleTimeEnd] = useState<number>();

  // Create timeline data from API data
  const groups = createLeaveTimelineGroups(employees);
  
  // Convert holidays to dayjs objects for the utils function
  const holidayDates = useMemo(() => {
    return holidaysData.map((holiday) => dayjs(holiday.date));
  }, [holidaysData]);

  const items = useMemo(() => {
    const leaveItems = createLeaveTimelineItems(
      leaves, 
      undefined, // No highlighted leave ID in portal
      holidayDates,
      workSchedules
    );

    const nonWorkingDayItems = createLeaveNonWorkingDayItems(
      employees,
      workSchedules,
      visibleTimeStart,
      visibleTimeEnd
    );

    return [...leaveItems, ...nonWorkingDayItems];
  }, [leaves, holidayDates, workSchedules, employees, visibleTimeStart, visibleTimeEnd]);

  const isLoading = employeesLoading || leavesLoading;
  const hasError = employeesError || leavesError;

  // Find current user
  const currentUser = employees.find((emp) => emp.id === Number(userId));

  const handleItemClick = (
    itemId: any,
    e: React.SyntheticEvent,
    time: number
  ) => {
    console.log("Item clicked:", itemId, time, e);
  };

  const handleItemSelect = (
    itemId: any,
    e: React.SyntheticEvent,
    time: number
  ) => {
    console.log("Item selected:", itemId, time, e);
  };

  const handleCanvasClick = (
    groupId: any,
    time: number,
    e: React.SyntheticEvent
  ) => {
    console.log("Canvas clicked:", groupId, time, e);
  };

  const handleCanvasDoubleClick = (
    groupId: any,
    time: number,
    e: React.SyntheticEvent
  ) => {
    console.log("Canvas double clicked:", groupId, time, e);
  };

  const handleItemDoubleClick = (
    itemId: any,
    e: React.SyntheticEvent,
    time: number
  ) => {
    console.log("Item double clicked:", itemId, time, e);
  };

  const handleDateRangeChange = (
    startDate: dayjs.Dayjs,
    endDate: dayjs.Dayjs,
    view: TimelineView
  ) => {
    console.log("Date range changed:", {
      startDate: startDate.format("YYYY-MM-DD"),
      endDate: endDate.format("YYYY-MM-DD"),
      view: view,
    });

    // TODO: Make API call to fetch vacation data for the new date range
    // Example API call:
    // fetchVacationData({
    //   startDate: startDate.format("YYYY-MM-DD"),
    //   endDate: endDate.format("YYYY-MM-DD"),
    //   view: view
    // });
  };

  const handleVisibleTimeChange = (
    visibleTimeStart: number,
    visibleTimeEnd: number
  ) => {
    setVisibleTimeStart(visibleTimeStart);
    setVisibleTimeEnd(visibleTimeEnd);
  };

  const handleRequestLeave = () => {
    // Navigate to leave request form with employee ID
    navigate(`/${userId}/calendar/vacation-request/create`);
  };

  useEffect(() => {
    if (user) {
      setMainTitle(
        `${user.firstname} ${user.lastname} - ${t(
          "vacationRequest",
          "Vacation Request"
        )}`
      );
    } else {
      setMainTitle(t("vacationRequest", "Vacation Request"));
    }
    setBackLink(`/${userId}/${ROUTES.USER.CALENDAR}`);
    return () => {
      setMainTitle("");
      setBackLink(null);
    };
  }, [setMainTitle, t, user]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        width: "100%",
      }}
    >
      <Box sx={{ flex: 1, width: "100%", p: 3 }}>
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <Typography variant="h6" color="text.secondary">
              {t("loading", "Loading...")}
            </Typography>
          </Box>
        ) : hasError ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <Typography variant="h6" color="error">
              {t("errorLoadingData", "Error loading data")}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Leave Summary for the selected employee */}
            {userId && (
              <LeaveSummary employeeId={parseInt(userId)} user={currentUser} />
            )}

              {/* Timeline Calendar */}
              <Box sx={{ minHeight: 600, height: "auto" }}>
                <LeaveTimelineCalendar
                  groups={groups}
                  items={items}
                  holidays={holidayDates}
                  onItemClick={handleItemClick}
                  onItemSelect={handleItemSelect}
                  onCanvasClick={handleCanvasClick}
                  onCanvasDoubleClick={handleCanvasDoubleClick}
                  onItemDoubleClick={handleItemDoubleClick}
                  onDateRangeChange={handleDateRangeChange}
                  onVisibleTimeChange={handleVisibleTimeChange}
                />
              </Box>
            </Box>
        )}
      </Box>

      {/* Floating Action Button for Request Leave */}
      <Fab
        color="primary"
        aria-label="request leave"
        onClick={handleRequestLeave}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default VacationRequest;
