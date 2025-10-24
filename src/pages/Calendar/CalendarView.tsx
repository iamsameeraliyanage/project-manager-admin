import { Alert, Container, Stack } from "@mui/material";
import WorkPackageTimelineCalendar from "../../modules/WorkPackageTimelineCalendar/WorkPackageTimelineCalendar";
import { useParams } from "react-router-dom";
import useEmployee from "../../hooks/api/use-employee";
import FullPageLoader from "../../widgets/FullPageLoader/FullPageLoader";
import { useMainLayout } from "../../context/main-layout-provider";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useGetWorkpackagePlanning } from "../../hooks/api/use-workpackage-planning";
import { useAllLeaves } from "../../hooks/api/use-leaves";
import { useHolidays } from "../../hooks/api/use-holidays";
import { useWorkSchedules } from "../../hooks/api/use-work-schedules";
import dayjs from "dayjs";

const CalendarView = () => {
  const { setMainTitle } = useMainLayout();
  const { t } = useTranslation();
  const { userId } = useParams();
  const { data: users, isLoading: isLoadingUsers } = useEmployee();
  const { data: workPackagePlans, isLoading: isWprkpackagePlanningLoading } =
    useGetWorkpackagePlanning({
      employeeId: userId,
    });

  const currentUserDetails = users?.find((u) => u.id === Number(userId));

  // Fetch leaves, holidays, and work schedules
  const { data: leaves = [], isLoading: leavesLoading } = useAllLeaves();
  
  // Fetch holidays and work schedules with a 3-year window
  const currentYear = dayjs().year();
  const holidaysStartDate = `${currentYear - 1}-01-01`;
  const holidaysEndDate = `${currentYear + 1}-12-31`;
  const { data: holidaysData = [], isLoading: holidaysLoading } = useHolidays(holidaysStartDate, holidaysEndDate);
  const { data: workSchedules = [], isLoading: workSchedulesLoading } = useWorkSchedules(holidaysStartDate, holidaysEndDate);

  useEffect(() => {
    if (currentUserDetails) {
      setMainTitle(
        `${currentUserDetails.firstname} ${currentUserDetails.lastname} - ${t(
          "calendar",
          "Calendar"
        )}`
      );
    }
    return () => {
      setMainTitle("");
    };
  }, [setMainTitle, currentUserDetails]);

  if (isWprkpackagePlanningLoading || isLoadingUsers || leavesLoading || holidaysLoading || workSchedulesLoading) {
    return <FullPageLoader />;
  }
  if (!workPackagePlans || workPackagePlans.length === 0) {
    return (
      <Stack py={3}>
        <Container maxWidth="xl">
          <Alert severity="info" variant="outlined">
            {t("noWorkPackagePlanning", "No work package plans available")}
          </Alert>
        </Container>
      </Stack>
    );
  }
  return (
    <Stack py={3} sx={{ height: "100%" }}>
      <Container maxWidth="xl" sx={{ height: "100%" }}>
        <WorkPackageTimelineCalendar 
          workPackagePlans={workPackagePlans}
          leaves={leaves}
          holidays={holidaysData}
          workSchedules={workSchedules}
          currentUserId={Number(userId)}
        />
      </Container>
    </Stack>
  );
};

export default CalendarView;
