import dayjs from "../../utils/dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import type {
  OnTimeChange,
  ReactCalendarTimelineProps,
  TimelineGroupBase,
  TimelineItemBase,
} from "react-calendar-timeline";
import type { HTMLProps } from "react";
import { Tooltip } from "@mui/material";
import type { Employee } from "../../types/user";
import type { Leave } from "../../types/leave";

// Configure dayjs plugins
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

export const minCalendarTime = dayjs().add(-2, "months").valueOf();
export const maxCalendarTime = dayjs().add(2, "months").valueOf();

export type LeaveTimelineGroup = TimelineGroupBase & {
  id: string;
  label?: string;
  bgColor?: string;
};

export type LeaveTimelineDataItem = TimelineItemBase<number> & {
  id: string;
  group: string;
  title: string;
  start_time: number;
  end_time: number;
  className?: string;
  bgColor?: string;
  selectedBgColor?: string;
  color?: string;
  status: "approved" | "pending";
  isHalfDay?: boolean;
  itemProps?: HTMLProps<HTMLDivElement>;
};

export type TimelineView = "week" | "month";

export type LeaveTimelineProps = ReactCalendarTimelineProps<
  LeaveTimelineDataItem,
  LeaveTimelineGroup
>;

export const getMinutesOfDay = (date: dayjs.Dayjs) => {
  return date.hour() * 60 + date.minute();
};

export const verticalLineClassNamesForTime = (
  holidays: dayjs.Dayjs[],
  timeStart: number,
  timeEnd: number
) => {
  const currentTimeStart = dayjs(timeStart);
  const currentTimeEnd = dayjs(timeEnd);

  const classes = [];

  for (const holiday of holidays) {
    if (
      holiday.isSame(currentTimeStart, "day") &&
      holiday.isSame(currentTimeEnd, "day")
    ) {
      classes.push("holiday");
    }
  }

  return classes;
};

export const handleTimeChange: OnTimeChange<
  LeaveTimelineDataItem,
  LeaveTimelineGroup
> = (visibleTimeStart, visibleTimeEnd, updateScrollCanvas) => {
  if (visibleTimeStart < minCalendarTime && visibleTimeEnd > maxCalendarTime) {
    updateScrollCanvas(minCalendarTime, maxCalendarTime);
  } else if (visibleTimeStart < minCalendarTime) {
    updateScrollCanvas(
      minCalendarTime,
      minCalendarTime + (visibleTimeEnd - visibleTimeStart)
    );
  } else if (visibleTimeEnd > maxCalendarTime) {
    updateScrollCanvas(
      maxCalendarTime - (visibleTimeEnd - visibleTimeStart),
      maxCalendarTime
    );
  } else {
    updateScrollCanvas(visibleTimeStart, visibleTimeEnd);
  }
};

export const itemRenderer: LeaveTimelineProps["itemRenderer"] = (props) => {
  const { item, itemContext, getItemProps, getResizeProps } = props;
  const { left: leftResizeProps, right: rightResizeProps } = getResizeProps();

  const getBackgroundColor = () => {
    // Check if this is a non-working day item first - use yellow
    if (item.id.startsWith("non-working-") || item.className === "non-working-day") {
      return "#ffeb3b"; // Yellow for off days
    }
    // Check if bgColor is explicitly set
    if (item.bgColor) {
      return item.bgColor;
    }
    // Otherwise use status colors for leaves
    if (item.status === "approved") {
      return "#008d33"; // Green for approved leaves
    } else if (item.status === "pending") {
      return "#9ca3af"; // Grey for pending
    }
    return "#ffffff";
  };

  const getBorderColor = () => {
    // Check if this is a non-working day item first - use darker yellow
    if (item.id.startsWith("non-working-") || item.className === "non-working-day") {
      return "#f57f17"; // Darker yellow border for off days
    }
    // Check if color is explicitly set
    if (item.color) {
      return item.color;
    }
    // Otherwise use status colors for leaves
    if (item.status === "approved") {
      return "#22c55e"; // Darker green border for approved leaves
    } else if (item.status === "pending") {
      return "#6b7280"; // Darker grey border
    }
    return "#000000";
  };

  const backgroundColor = itemContext.selected
    ? itemContext.dragging
      ? "red"
      : getBackgroundColor()
    : getBackgroundColor();

  const borderColor = itemContext.resizing ? "red" : getBorderColor();

  return (
    <div
      {...getItemProps({
        style: {
          backgroundColor,
          color: "#ffffff",
          borderColor,
          borderStyle: item.isHalfDay ? "dashed" : "solid",
          borderWidth: 1,
          borderRadius: 4,
          opacity: item.isHalfDay ? 0.7 : 1,
        },
        className: `leave-item ${item.className || ""} ${item.status} ${
          item.isHalfDay ? "half-day" : ""
        }`,
      })}
      key={item.id}
    >
      {itemContext.useResizeHandle ? <div {...leftResizeProps} /> : null}

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

      {itemContext.useResizeHandle ? <div {...rightResizeProps} /> : null}
    </div>
  );
};

export const groupRenderer: LeaveTimelineProps["groupRenderer"] = (props) => {
  const { group } = props;
  return (
    <div
      style={{
        backgroundColor: group.bgColor,
      }}
    >
      <Tooltip title={group.label} placement="top">
        <div>
          {group.title} {group.rightTitle}{" "}
        </div>
      </Tooltip>
    </div>
  );
};

// Real data functions for leave management

// Create non-working day timeline items for leave calendar
export const createLeaveNonWorkingDayItems = (
  employees: Employee[],
  workSchedules?: {
    employeeId: number;
    workSchedules: any[];
    hasWorkSchedule: boolean;
  }[],
  visibleTimeStart?: number,
  visibleTimeEnd?: number
): LeaveTimelineDataItem[] => {
  if (!workSchedules || !employees || workSchedules.length === 0 || !visibleTimeStart || !visibleTimeEnd) {
    return [];
  }

  const nonWorkingItems: LeaveTimelineDataItem[] = [];
  const startDate = dayjs(visibleTimeStart);
  const endDate = dayjs(visibleTimeEnd);
  
  workSchedules.forEach(employeeSchedule => {
    const { employeeId, workSchedules: schedules } = employeeSchedule;
    
    // Find employee by ID (portal uses direct ID, not bexioId)
    const employee = employees.find(emp => emp.id === employeeId);
    if (!employee) {
      return;
    }

    const groupId = employee.id.toString();

    schedules.forEach(schedule => {
      const effectiveFrom = dayjs(schedule.effectiveFrom);
      const effectiveTo = schedule.effectiveTo ? dayjs(schedule.effectiveTo) : null;
      
      // Get non-working days for this schedule
      const nonWorkingDays = schedule.workDays?.filter((workDay: any) => 
        workDay.workType === 'off' || workDay.workType === 'first_half' || workDay.workType === 'second_half'
      ) || [];

      if (nonWorkingDays.length === 0) return;

      // Generate non-working day items for the visible time range
      let currentDate = effectiveFrom.isAfter(startDate) ? effectiveFrom : startDate;
      const scheduleEndDate = effectiveTo ? (effectiveTo.isBefore(endDate) ? effectiveTo : endDate) : endDate;

      while (currentDate.isBefore(scheduleEndDate) || currentDate.isSame(scheduleEndDate, 'day')) {
        const dayOfWeek = currentDate.format('dddd').toLowerCase();
        const nonWorkingDay = nonWorkingDays.find((wd: any) => wd.dayOfWeek.toLowerCase() === dayOfWeek);
        
        if (nonWorkingDay) {
          const dayStart = currentDate.startOf('day');
          const dayEnd = currentDate.endOf('day');
          
          nonWorkingItems.push({
            id: `non-working-${employeeId}-${currentDate.format('YYYY-MM-DD')}`,
            group: groupId,
            title: nonWorkingDay.workType === 'off' ? 'Off' : 
                   nonWorkingDay.workType === 'first_half' ? 'Morning Off' :
                   nonWorkingDay.workType === 'second_half' ? 'Afternoon Off' : 'Non-working',
            start_time: nonWorkingDay.workType === 'first_half' ? dayStart.valueOf() : 
                       nonWorkingDay.workType === 'second_half' ? dayStart.hour(12).valueOf() :
                       dayStart.valueOf(),
            end_time: nonWorkingDay.workType === 'first_half' ? dayStart.hour(12).valueOf() : 
                     nonWorkingDay.workType === 'second_half' ? dayEnd.valueOf() :
                     dayEnd.valueOf(),
            bgColor: '#ffeb3b',
            color: '#f57f17',
            className: 'non-working-day',
            status: 'pending' as const,
            isHalfDay: nonWorkingDay.workType === 'first_half' || nonWorkingDay.workType === 'second_half',
          });
        }
        
        currentDate = currentDate.add(1, 'day');
      }
    });
  });

  return nonWorkingItems;
};

export const createLeaveTimelineGroups = (
  employees: Employee[]
): LeaveTimelineGroup[] => {
  return employees.map((employee) => ({
    id: employee.id.toString(),
    label: employee.email,
    title: `${employee.firstname} ${employee.lastname}`,
  }));
};

export const createLeaveTimelineItems = (
  leaves: Leave[],
  highlightedLeaveId?: number,
  holidays?: dayjs.Dayjs[],
  workSchedules?: {
    employeeId: number;
    workSchedules: any[];
    hasWorkSchedule: boolean;
  }[]
): LeaveTimelineDataItem[] => {
  // Helper function to check if a date is a holiday
  const isHoliday = (date: dayjs.Dayjs): boolean => {
    if (!holidays) return false;
    return holidays.some(holiday => 
      holiday.format("YYYY-MM-DD") === date.format("YYYY-MM-DD")
    );
  };

  // Helper function to check if a date is an off day for an employee
  const isOffDay = (date: dayjs.Dayjs, employeeId: number): boolean => {
    if (!workSchedules) return false;
    
    const employeeSchedule = workSchedules.find(ws => ws.employeeId === employeeId);
    if (!employeeSchedule || !employeeSchedule.workSchedules) return false;
    
    const dayOfWeek = date.format('dddd').toLowerCase();
    
    // Find the applicable schedule for this date
    const applicableSchedule = employeeSchedule.workSchedules.find(schedule => {
      const effectiveFrom = dayjs(schedule.effectiveFrom);
      const effectiveTo = schedule.effectiveTo ? dayjs(schedule.effectiveTo) : null;
      
      return effectiveFrom.isSameOrBefore(date, 'day') && 
             (!effectiveTo || effectiveTo.isSameOrAfter(date, 'day'));
    });
    
    if (!applicableSchedule || !applicableSchedule.workDays) return false;
    
    const workDay = applicableSchedule.workDays.find(
      (wd: any) => wd.dayOfWeek.toLowerCase() === dayOfWeek
    );
    
    return workDay && workDay.workType === 'off';
  };

  // Helper function to check if a date is a weekend
  const isWeekend = (date: dayjs.Dayjs): boolean => {
    const dayOfWeek = date.day();
    return dayOfWeek === 0 || dayOfWeek === 6; // Sunday = 0, Saturday = 6
  };

  // Helper function to split leave into segments, excluding non-working days
  const splitLeaveIntoSegments = (
    startDate: dayjs.Dayjs, 
    endDate: dayjs.Dayjs, 
    employeeId: number
  ): Array<{ start: dayjs.Dayjs; end: dayjs.Dayjs }> => {
    const segments: Array<{ start: dayjs.Dayjs; end: dayjs.Dayjs }> = [];
    
    // Ensure we're working with valid dayjs objects
    if (!startDate.isValid() || !endDate.isValid()) {
      console.warn('Invalid dates passed to splitLeaveIntoSegments');
      return segments;
    }
    
    let currentSegmentStart: dayjs.Dayjs | null = null;
    let currentDate = dayjs(startDate);
    
    // Iterate through each day in the leave period
    while (currentDate.isSameOrBefore(endDate, 'day')) {
      const isWorkingDay = !isWeekend(currentDate) && !isHoliday(currentDate) && !isOffDay(currentDate, employeeId);
      
      if (isWorkingDay) {
        // If we don't have a segment start, this is the beginning of a new segment
        if (!currentSegmentStart) {
          currentSegmentStart = dayjs(currentDate);
        }
      } else {
        // Non-working day - close current segment if one exists
        if (currentSegmentStart) {
          // End the segment at the previous day
          const segmentEnd = currentDate.subtract(1, 'day');
          segments.push({ 
            start: currentSegmentStart, 
            end: segmentEnd 
          });
          currentSegmentStart = null;
        }
      }
      
      currentDate = currentDate.add(1, 'day');
    }
    
    // Close any remaining segment
    if (currentSegmentStart) {
      segments.push({ 
        start: currentSegmentStart, 
        end: endDate 
      });
    }
    
    return segments;
  };

  return (
    leaves
      // Filter out rejected and cancelled leaves from the timeline
      .filter((leave) => leave.status !== "rejected" && leave.status !== "cancelled")
      .map((leave): LeaveTimelineDataItem[] | null => {
        // Ensure we have valid dates
        if (!leave.startDate || !leave.endDate) {
          return null;
        }
        
        // Create dayjs objects, ensuring they're valid
        const startDate = dayjs(leave.startDate);
        const endDate = dayjs(leave.endDate);
        
        // Check if dates are valid
        if (!startDate.isValid() || !endDate.isValid()) {
          console.warn('Invalid dates for leave:', leave);
          return null;
        }
        
        const isHalfDay = leave.numberOfDays < 1; // Assuming half day if less than 1 day

        // Split leave into segments, excluding non-working days
        const leaveSegments = splitLeaveIntoSegments(startDate, endDate, leave.employeeId);
        
        // If the leave has no working segments, skip it
        if (leaveSegments.length === 0) {
          return null;
        }

        // Determine if it's approved or pending
        const isApproved = leave.status === "approved";
        let status: "approved" | "pending" = isApproved ? "approved" : "pending";
        const isHighlighted = highlightedLeaveId === leave.id;

        // Create timeline items for each segment
        return leaveSegments.map((segment, index) => {
          const segmentStart = segment.start;
          const segmentEnd = segment.end;
          
          // For multi-segment leaves, add segment indicator to title
          const segmentTitle = leaveSegments.length > 1 
            ? `${leave.leaveName} (${index + 1}/${leaveSegments.length})`
            : leave.leaveName;

          return {
            id: `leave-${leave.id}-segment-${index}`,
            title: segmentTitle,
            group: leave.employeeId.toString(),
            start_time:
              isHalfDay && segmentStart.isSame(segmentEnd, "day")
                ? segmentStart.startOf("day").valueOf()
                : segmentStart.startOf("day").valueOf(),
            end_time:
              isHalfDay && segmentStart.isSame(segmentEnd, "day")
                ? segmentStart.hour(12).valueOf() // Half day ends at noon
                : segmentEnd.endOf("day").valueOf(),
            status,
            isHalfDay: isHalfDay && leaveSegments.length === 1, // Only mark as half day if it's a single segment
            bgColor: isHighlighted
              ? "#f59e0b" // Orange for highlighted
              : isApproved
                ? "#008d33" // Green for approved
                : "#9ca3af", // Grey for pending
            color: isHighlighted
              ? "#d97706" // Darker orange for highlighted
              : isApproved
                ? "#22c55e" // Darker green for approved
                : "#6b7280", // Darker grey for pending
          } as LeaveTimelineDataItem;
        });
      })
      // Filter out null values (leaves with no working days)
      .filter((item): item is LeaveTimelineDataItem[] => item !== null)
      // Flatten the array since each leave can now produce multiple segments
      .flat()
  );
};

export const holidays = [
  dayjs().add(1, "month").date(1), // First day of next month
  dayjs().add(1, "month").date(15), // Mid month holiday
];
