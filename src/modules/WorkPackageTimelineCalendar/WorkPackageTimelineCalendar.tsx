import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import {
  Calendar,
  dateFnsLocalizer,
  Views,
  type Event,
  type View,
} from "react-big-calendar";
import { format } from "date-fns/format";
import { parse } from "date-fns/parse";
import { startOfWeek } from "date-fns/startOfWeek";
import { getDay } from "date-fns/getDay";
import { enUS } from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./WorkPackageTimelineCalendar.css";
import type { WorkPackagePlan } from "../../hooks/api/use-workpackage-planning";
import { useCallback, useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "../../routes/routes.config";
import { useTranslation } from "react-i18next";
import { FiPrinter } from "react-icons/fi";
import { useMainLayout } from "../../context/main-layout-provider";
import type { Leave } from "../../types/leave";
import dayjs from "dayjs";

const locales = {
  "en-US": enUS,
};

// Custom startOfWeek function to start on Monday (1) instead of Sunday (0)
const startOfWeekMonday = (date: Date) => {
  return startOfWeek(date, { weekStartsOn: 1 });
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: startOfWeekMonday,
  getDay,
  locales,
});

interface WorkPackageTimelineCalendarProps {
  workPackagePlans: WorkPackagePlan[];
  leaves?: Leave[];
  holidays?: any[];
  workSchedules?: any[];
  currentUserId?: number;
}

const WorkPackageTimelineCalendar = ({
  workPackagePlans,
  leaves = [],
  holidays = [],
  workSchedules = [],
  currentUserId,
}: WorkPackageTimelineCalendarProps) => {
  const { t } = useTranslation();

  const { setBackLink } = useMainLayout();

  const [view, setView] = useState<View>("week");
  const [date, setDate] = useState<Date>(new Date());
  const onView = useCallback((view: View) => {
    setView(view);
  }, []);

  const navigate = useNavigate();
  const { userId } = useParams();

  const onNavigate = useCallback((date: Date) => {
    setDate(date);
  }, []);

  const convertToCalendarEvents = (plans: WorkPackagePlan[]): Event[] => {
    return plans.map((plan) => {
      const isProject = !!plan.project;
      
      // Use dayjs to handle dates properly
      const startDate = dayjs(plan.start_time).toDate();
      const endDate = dayjs(plan.end_time).toDate();

      return {
        title: plan.title,
        start: startDate,
        end: endDate,
        resource: {
          type: isProject ? "project" : "internal_task",
          projectId: plan.project?.id,
          workPackageId: plan.project?.work_package_id,
          internalTaskId: plan.internal_task?.id,
          eventType: "work",
          id: plan.id,
        },
      };
    });
  };

  const convertLeavesToEvents = (): Event[] => {
    // Filter leaves for current user only
    const userLeaves = currentUserId 
      ? leaves.filter(leave => leave.employeeId === currentUserId && 
          (leave.status === "approved" || leave.status === "pending"))
      : [];

    return userLeaves.map((leave) => {
      // Create dates without timezone conversion
      const startDate = dayjs(leave.startDate).toDate();
      // For all-day events, we need to add 1 day to end date to include the last day
      const endDate = dayjs(leave.endDate).add(1, 'day').toDate();
      
      return {
        title: `${leave.leaveName} (${leave.status === "approved" ? "Approved" : "Pending"})`,
        start: startDate,
        end: endDate,
        allDay: true, // Make leaves all-day events to avoid timezone issues
        resource: {
          type: "leave",
          eventType: "leave",
          status: leave.status,
          id: `leave-${leave.id}`,
        },
      };
    });
  };

  const convertHolidaysToEvents = (): Event[] => {
    return holidays.map((holiday) => {
      // Create date without timezone conversion
      const holidayStart = dayjs(holiday.date).toDate();
      // For all-day events, add 1 day to end date to ensure proper display
      const holidayEnd = dayjs(holiday.date).add(1, 'day').toDate();
      
      return {
        title: holiday.name,
        start: holidayStart,
        end: holidayEnd,
        allDay: true,
        resource: {
          type: "holiday",
          eventType: "holiday",
          id: `holiday-${holiday.id}`,
        },
      };
    });
  };

  const getOffDaysEvents = (): Event[] => {
    const offDayEvents: Event[] = [];
    
    if (!currentUserId || !workSchedules || workSchedules.length === 0) {
      return offDayEvents;
    }

    // Find work schedule for current user
    const userSchedule = workSchedules.find(ws => ws.employeeId === currentUserId);
    if (!userSchedule || !userSchedule.workSchedules) {
      return offDayEvents;
    }

    // Get current year range
    const startDate = dayjs().startOf('year');
    const endDate = dayjs().endOf('year');
    
    userSchedule.workSchedules.forEach((schedule: any) => {
      const effectiveFrom = dayjs(schedule.effectiveFrom);
      const effectiveTo = schedule.effectiveTo ? dayjs(schedule.effectiveTo) : endDate;
      
      // Get off days from work schedule
      const offDays = schedule.workDays?.filter((wd: any) => 
        wd.workType === 'off'
      ) || [];
      
      if (offDays.length === 0) return;
      
      // Generate off day events for the year
      let currentDate = effectiveFrom.isAfter(startDate) ? effectiveFrom : startDate;
      const scheduleEndDate = effectiveTo.isBefore(endDate) ? effectiveTo : endDate;
      
      while (currentDate.isBefore(scheduleEndDate) || currentDate.isSame(scheduleEndDate, 'day')) {
        const dayOfWeek = currentDate.format('dddd').toLowerCase();
        const isOffDay = offDays.some((wd: any) => wd.dayOfWeek.toLowerCase() === dayOfWeek);
        
        if (isOffDay) {
          // Create date without timezone conversion
          const offDayStart = currentDate.toDate();
          // For all-day events, add 1 day to end date to ensure proper display
          const offDayEnd = currentDate.add(1, 'day').toDate();
          
          offDayEvents.push({
            title: 'Off Day',
            start: offDayStart,
            end: offDayEnd,
            allDay: true,
            resource: {
              type: "offDay",
              eventType: "offDay",
              id: `off-${currentDate.format('YYYY-MM-DD')}`,
            },
          });
        }
        
        currentDate = currentDate.add(1, 'day');
      }
    });
    
    return offDayEvents;
  };

  const convertedEventList = useMemo(() => {
    const workEvents = convertToCalendarEvents(workPackagePlans);
    const leaveEvents = convertLeavesToEvents();
    const holidayEvents = convertHolidaysToEvents();
    const offDayEvents = getOffDaysEvents();
    
    return [...workEvents, ...leaveEvents, ...holidayEvents, ...offDayEvents];
  }, [workPackagePlans, leaves, holidays, workSchedules, currentUserId]);

  const handleCalenderItemDoubleClick = (
    type: string,
    projectId?: string,
    workPackageId?: string,
    internalTaskId?: string
  ) => {
    if (userId) {
      if (type === "project") {
        navigate(
          `/${userId}/${ROUTES.USER.CUSTOMER_PROJECTS}?${ROUTES.PARAMS.PROJECT}=${projectId}&${ROUTES.PARAMS.WORKPACKAGE}=${workPackageId}`
        );
      } else {
        navigate(
          `/${userId}/${ROUTES.USER.INTERNAL_PROJECTS}/${internalTaskId}`
        );
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Custom event style based on event type
  const eventStyleGetter = (event: Event) => {
    const eventType = event.resource?.eventType;
    let backgroundColor = '#3174ad'; // Default color
    let color = 'white';
    let border = '1px solid #2563eb';
    let fontWeight = '500';

    switch (eventType) {
      case 'work':
        backgroundColor = '#3174ad'; // Blue for work packages
        border = '1px solid #2563eb';
        break;
      case 'leave':
        backgroundColor = event.resource?.status === 'approved' ? '#4caf50' : '#9e9e9e'; // Green for approved, grey for pending
        border = event.resource?.status === 'approved' ? '1px solid #388e3c' : '1px solid #757575';
        break;
      case 'holiday':
        backgroundColor = '#f44336'; // Red for holidays
        border = '1px solid #d32f2f';
        fontWeight = '600';
        break;
      case 'offDay':
        backgroundColor = '#ffeb3b'; // Yellow for off days
        color = '#333';
        border = '1px solid #f57f17';
        break;
    }

    return {
      style: {
        backgroundColor,
        color,
        border,
        borderRadius: '4px',
        fontWeight,
        fontSize: '12px',
        padding: '2px 4px',
        overflow: 'visible',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
    };
  };

  useEffect(() => {
    setBackLink(`/${userId}/calendar`);
    return () => {
      setBackLink(null);
    };
  }, []);
  return (
    <Stack
      sx={{
        height: "100%",
      }}
    >
      <Box sx={{ py: 2, display: "flex", alignItems: "flex-start", gap: 4 }}>
        <Box>
          <Typography variant="h5" component="h1" gutterBottom>
            {t("work_package_planning", "Work Package Planning")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t(
              "view_assigned_work_packages",
              "View your assigned work packages and internal tasks"
            )}
          </Typography>
        </Box>
        <Box marginLeft={"auto"}>
          <Button
            startIcon={<FiPrinter />}
            onClick={handlePrint}
            variant="contained"
          >
            {t("button_text.print", "Print")}
          </Button>
        </Box>
      </Box>

      <Card
        variant="outlined"
        sx={{
          flexGrow: 1,
        }}
        id="section-to-print"
      >
        <CardContent sx={{ height: "100%" }}>
          <Calendar
            localizer={localizer}
            events={convertedEventList}
            startAccessor="start"
            endAccessor="end"
            defaultView={Views.MONTH}
            defaultDate={new Date()}
            views={[Views.DAY, Views.WEEK, Views.MONTH]}
            step={60}
            style={{ height: "100%" }}
            view={view}
            onView={onView}
            onNavigate={onNavigate}
            date={date}
            eventPropGetter={eventStyleGetter}
            onDoubleClickEvent={(event) => {
              // Only handle double click for work packages and internal tasks
              if (event.resource?.eventType === 'work') {
                handleCalenderItemDoubleClick(
                  event.resource.type,
                  event.resource.projectId,
                  event.resource.workPackageId,
                  event.resource.internalTaskId
                );
              }
            }}
          />
        </CardContent>
      </Card>
    </Stack>
  );
};

export default WorkPackageTimelineCalendar;
