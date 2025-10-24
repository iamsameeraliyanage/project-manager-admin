import dayjs from "../../utils/dayjs"; // Use configured dayjs
import { useEffect, useMemo, useRef, useState } from "react";
import Timeline, {
  CursorMarker,
  TimelineMarkers,
  TodayMarker,
  type Id,
} from "react-calendar-timeline";
import "react-calendar-timeline/style.css";
import "./LeaveTimelineCalendar.css";

import { AppBar, Box, Stack, Typography, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import {
  groupRenderer,
  handleTimeChange,
  itemRenderer,
  verticalLineClassNamesForTime,
  type LeaveTimelineDataItem,
  type LeaveTimelineGroup,
  type TimelineView,
} from "./leaveTimelineUtils";
import LeaveTimelineViewSwitcher from "./LeaveTimelineViewSwitcher";
import FullPageLoader from "../../widgets/FullPageLoader/FullPageLoader";
import { useTranslation } from "react-i18next";

interface LeaveTimelineProps {
  groups: LeaveTimelineGroup[];
  items: LeaveTimelineDataItem[];
  holidays: dayjs.Dayjs[];
  onItemClick?: (itemId: Id, e: React.SyntheticEvent, time: number) => void;
  onItemSelect?: (itemId: Id, e: React.SyntheticEvent, time: number) => void;
  onCanvasClick?: (groupId: Id, time: number, e: React.SyntheticEvent) => void;
  onCanvasDoubleClick?: (
    groupId: Id,
    time: number,
    e: React.SyntheticEvent
  ) => void;
  onItemDoubleClick?: (
    itemId: Id,
    e: React.SyntheticEvent,
    time: number
  ) => void;
  onDateRangeChange?: (
    startDate: dayjs.Dayjs,
    endDate: dayjs.Dayjs,
    view: TimelineView
  ) => void;
  onVisibleTimeChange?: (
    visibleTimeStart: number,
    visibleTimeEnd: number
  ) => void;
}

const LeaveTimelineCalendar = ({
  groups,
  items,
  holidays,
  onItemClick,
  onItemSelect,
  onCanvasClick,
  onItemDoubleClick,
  onCanvasDoubleClick,
  onDateRangeChange,
  onVisibleTimeChange,
}: LeaveTimelineProps) => {
  const [init, setInit] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<TimelineView>("week");
  const [currentDate, setCurrentDate] = useState<dayjs.Dayjs>(dayjs());
  const { t } = useTranslation();
  const start = useMemo(() => {
    if (currentView === "week") {
      // For week view, ensure we start on Monday
      return currentDate.startOf("isoWeek").valueOf();
    }
    return currentDate.startOf(currentView).valueOf();
  }, [currentDate, currentView]);

  const end = useMemo(() => {
    if (currentView === "week") {
      // For week view, ensure we end on Sunday
      return currentDate.endOf("isoWeek").valueOf();
    }
    return currentDate.endOf(currentView).valueOf();
  }, [currentDate, currentView]);

  const timelineRef =
    useRef<Timeline<LeaveTimelineDataItem, LeaveTimelineGroup>>(null);

  const handleViewChange = (view: TimelineView) => {
    setCurrentView(view);

    const newStart =
      view === "week"
        ? currentDate.startOf("isoWeek")
        : currentDate.startOf(view);
    const newEnd =
      view === "week" ? currentDate.endOf("isoWeek") : currentDate.endOf(view);

    if (timelineRef.current) {
      timelineRef.current.updateScrollCanvas(
        newStart.valueOf(),
        newEnd.valueOf()
      );
    }

    // Trigger API call for new date range
    if (onDateRangeChange) {
      onDateRangeChange(newStart, newEnd, view);
    }
  };

  const handlePrevious = () => {
    const newDate =
      currentView === "week"
        ? currentDate.subtract(1, "week")
        : currentDate.subtract(1, "month");

    setCurrentDate(newDate);

    const newStart =
      currentView === "week"
        ? newDate.startOf("isoWeek")
        : newDate.startOf(currentView);
    const newEnd =
      currentView === "week"
        ? newDate.endOf("isoWeek")
        : newDate.endOf(currentView);

    if (timelineRef.current) {
      timelineRef.current.updateScrollCanvas(
        newStart.valueOf(),
        newEnd.valueOf()
      );
    }

    // Trigger API call for new date range
    if (onDateRangeChange) {
      onDateRangeChange(newStart, newEnd, currentView);
    }
  };

  const handleNext = () => {
    const newDate =
      currentView === "week"
        ? currentDate.add(1, "week")
        : currentDate.add(1, "month");

    setCurrentDate(newDate);

    const newStart =
      currentView === "week"
        ? newDate.startOf("isoWeek")
        : newDate.startOf(currentView);
    const newEnd =
      currentView === "week"
        ? newDate.endOf("isoWeek")
        : newDate.endOf(currentView);

    if (timelineRef.current) {
      timelineRef.current.updateScrollCanvas(
        newStart.valueOf(),
        newEnd.valueOf()
      );
    }

    // Trigger API call for new date range
    if (onDateRangeChange) {
      onDateRangeChange(newStart, newEnd, currentView);
    }
  };

  const getDateRangeText = () => {
    if (currentView === "week") {
      const startOfWeek = currentDate.startOf("isoWeek");
      const endOfWeek = currentDate.endOf("isoWeek");
      return `${startOfWeek.format("MMM D")} - ${endOfWeek.format(
        "MMM D, YYYY"
      )}`;
    } else {
      return currentDate.format("MMMM YYYY");
    }
  };

  useEffect(() => {
    setInit(true);
  }, []);

  useEffect(() => {
    if (onVisibleTimeChange) {
      onVisibleTimeChange(start, end);
    }
  }, [start, end, onVisibleTimeChange]);

  return init ? (
    <Stack
      sx={{
        minHeight: "500px",
        height: "auto",
        overflow: "visible",
      }}
    >
      <AppBar
        color="primary"
        variant="outlined"
        position="relative"
        sx={{
          borderTopLeftRadius: "8px",
          borderTopRightRadius: "8px",
          borderBottom: "none",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: 1.5,
            px: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="h5">{t("leave_calendar")}</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton onClick={handlePrevious} size="small" color="inherit">
                <ChevronLeft />
              </IconButton>
              <Typography
                variant="body1"
                sx={{ minWidth: "150px", textAlign: "center" }}
              >
                {getDateRangeText()}
              </Typography>
              <IconButton onClick={handleNext} size="small" color="inherit">
                <ChevronRight />
              </IconButton>
            </Box>
          </Box>
          <LeaveTimelineViewSwitcher
            currentView={currentView}
            handleViewChange={handleViewChange}
          />
        </Box>
      </AppBar>

      <Box
        sx={{
          display: "flex",
          minHeight: "400px",
          height: "auto",
          width: "100%",
          background: (theme) => theme.palette.common.white,
        }}
      >
        <Box
          sx={{
            flex: "1",
            minHeight: "400px",
            height: "auto",
            overflow: "auto",
          }}
        >
          <Timeline
            ref={timelineRef}
            groups={groups}
            items={items}
            sidebarWidth={180}
            canSelect={false}
            defaultTimeStart={start}
            defaultTimeEnd={end}
            itemTouchSendsClick={false}
            buffer={1}
            minZoom={12 * 60 * 60 * 1000}
            maxZoom={90 * 24 * 60 * 60 * 1000}
            stackItems
            itemHeightRatio={0.8}
            lineHeight={50}
            itemRenderer={itemRenderer}
            groupRenderer={groupRenderer}
            onTimeChange={handleTimeChange}
            verticalLineClassNamesForTime={(start: number, end: number) =>
              verticalLineClassNamesForTime(holidays, start, end)
            }
            onItemClick={onItemClick}
            onCanvasClick={onCanvasClick}
            onCanvasDoubleClick={onCanvasDoubleClick}
            onItemSelect={onItemSelect}
            onItemDoubleClick={onItemDoubleClick}
            sidebarContent="employee"
          >
            <TimelineMarkers>
              <TodayMarker />
              <CursorMarker />
            </TimelineMarkers>
          </Timeline>
        </Box>
      </Box>
    </Stack>
  ) : (
    <FullPageLoader />
  );
};

export default LeaveTimelineCalendar;
