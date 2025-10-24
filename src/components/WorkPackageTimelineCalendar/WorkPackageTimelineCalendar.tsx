import { useMemo, useRef, useState, useEffect } from "react";
import Timeline, {
  TimelineMarkers,
  TodayMarker,
  CursorMarker,
} from "react-calendar-timeline";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(isoWeek);
dayjs.extend(utc);
dayjs.extend(timezone);
import { Box, Typography, AppBar, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import "react-calendar-timeline/style.css";
import "./WorkPackageTimelineCalendar.css";
import WorkPackageTimelineViewSwitcher, {
  type WorkPackageTimelineView,
} from "./WorkPackageTimelineViewSwitcher";
import { handleTimeChange } from "./workPackageTimelineUtils";
import FullPageLoader from "../../widgets/FullPageLoader/FullPageLoader";
import { useTranslation } from "react-i18next";

export interface WorkPackageTimelineGroup {
  id: string;
  title: string;
  height?: number;
}

export interface WorkPackageTimelineItem {
  id: string;
  group: string;
  title: string;
  start_time: number;
  end_time: number;
  bgColor?: string;
  color?: string;
  itemProps?: any;
}

interface WorkPackageTimelineCalendarProps {
  groups: WorkPackageTimelineGroup[];
  items: WorkPackageTimelineItem[];
  holidays?: dayjs.Dayjs[];
  onDateRangeChange?: (
    startDate: dayjs.Dayjs,
    endDate: dayjs.Dayjs,
    view: WorkPackageTimelineView
  ) => void;
}

const WorkPackageTimelineCalendar: React.FC<
  WorkPackageTimelineCalendarProps
> = ({ groups, items, onDateRangeChange }) => {
  const [init, setInit] = useState<boolean>(false);
  const [currentView, setCurrentView] =
    useState<WorkPackageTimelineView>("week");
  const [currentDate, setCurrentDate] = useState<dayjs.Dayjs>(dayjs());

  const { t } = useTranslation();

  const start = useMemo(() => {
    return currentView === "week"
      ? currentDate.startOf("isoWeek").valueOf()
      : currentDate.startOf(currentView).valueOf();
  }, [currentDate, currentView]);

  const end = useMemo(() => {
    return currentView === "week"
      ? currentDate.endOf("isoWeek").valueOf()
      : currentDate.endOf(currentView).valueOf();
  }, [currentDate, currentView]);

  const timelineRef =
    useRef<Timeline<WorkPackageTimelineItem, WorkPackageTimelineGroup>>(null);

  const handleViewChange = (view: WorkPackageTimelineView) => {
    setCurrentView(view);
    const now = dayjs();
    let newStart = now;
    let newEnd = now;

    switch (view) {
      case "day":
        newStart = now.startOf("day");
        newEnd = now.endOf("day");
        break;
      case "week":
        newStart = now.startOf("isoWeek");
        newEnd = now.endOf("isoWeek");
        break;
      case "month":
        newStart = now.startOf("month");
        newEnd = now.endOf("month");
        break;
    }

    setCurrentDate(now);

    if (timelineRef.current) {
      timelineRef.current.updateScrollCanvas(
        newStart.valueOf(),
        newEnd.valueOf()
      );
    }

    if (onDateRangeChange) {
      onDateRangeChange(newStart, newEnd, view);
    }
  };

  const handlePrevious = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    const newDate =
      currentView === "day"
        ? currentDate.subtract(1, "day")
        : currentView === "week"
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

    if (onDateRangeChange) {
      onDateRangeChange(newStart, newEnd, currentView);
    }
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    const newDate =
      currentView === "day"
        ? currentDate.add(1, "day")
        : currentView === "week"
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

    if (onDateRangeChange) {
      onDateRangeChange(newStart, newEnd, currentView);
    }
  };

  const getDateRangeText = () => {
    if (currentView === "day") {
      return currentDate.format("dddd, MMMM D, YYYY");
    } else if (currentView === "week") {
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

  const itemRenderer = ({ item, itemContext, getItemProps }: any) => {
    const backgroundColor = item.bgColor;
    const borderColor = item.color;

    return (
      <div
        {...getItemProps({
          style: {
            backgroundColor,
            color: item.color,
            borderColor,
            borderStyle: "solid",
            borderWidth: 1,
            borderRadius: 4,
          },
          className: "work-package-item",
        })}
      >
        <div
          style={{
            height: itemContext.dimensions.height,
            overflow: "hidden",
            paddingLeft: 3,
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {itemContext.title}
        </div>
      </div>
    );
  };

  const groupRenderer = ({ group }: any) => {
    return (
      <div style={{ padding: "8px" }}>
        <Typography variant="body2" noWrap>
          {group.title}
        </Typography>
      </div>
    );
  };

  return init ? (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <AppBar
        color="secondary"
        variant="outlined"
        position="relative"
        sx={{
          borderTopLeftRadius: "8px",
          borderTopRightRadius: "8px",
          borderBottom: "none",
          flexShrink: 0,
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
            <Typography variant="h5">{t("work_package_planning")}</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton
                onClick={(e) => handlePrevious(e)}
                size="small"
                type="button"
                aria-label="Previous period"
              >
                <ChevronLeft />
              </IconButton>
              <Typography
                variant="body1"
                sx={{ minWidth: "200px", textAlign: "center" }}
              >
                {getDateRangeText()}
              </Typography>
              <IconButton
                onClick={(e) => handleNext(e)}
                size="small"
                type="button"
                aria-label="Next period"
              >
                <ChevronRight />
              </IconButton>
            </Box>
          </Box>
          <WorkPackageTimelineViewSwitcher
            currentView={currentView}
            handleViewChange={handleViewChange}
          />
        </Box>
      </AppBar>

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          width: "100%",
          display: "flex",
          background: (theme) => theme.palette.common.white,
          "& .react-calendar-timeline": {
            height: "100% !important",
            width: "100% !important",
          },
        }}
      >
        <Timeline
          ref={timelineRef}
          groups={groups}
          items={items}
          defaultTimeStart={start}
          defaultTimeEnd={end}
          visibleTimeStart={start}
          visibleTimeEnd={end}
          itemRenderer={itemRenderer}
          groupRenderer={groupRenderer}
          lineHeight={50}
          itemHeightRatio={0.75}
          canMove={false}
          canResize={false}
          canSelect={false}
          stackItems
          traditionalZoom={true}
          sidebarWidth={200}
          itemTouchSendsClick={false}
          buffer={1}
          minZoom={60 * 60 * 1000}
          maxZoom={30 * 24 * 60 * 60 * 1000}
          sidebarContent="employee"
          onTimeChange={handleTimeChange}
        >
          <TimelineMarkers>
            <TodayMarker />
            <CursorMarker />
          </TimelineMarkers>
        </Timeline>
      </Box>
    </Box>
  ) : (
    <FullPageLoader />
  );
};

export default WorkPackageTimelineCalendar;
