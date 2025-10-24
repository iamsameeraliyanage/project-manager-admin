import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import utc from "dayjs/plugin/utc";

dayjs.extend(isoWeek);
dayjs.extend(utc);
import type { OnTimeChange } from "react-calendar-timeline";
import type {
  WorkPackageTimelineGroup,
  WorkPackageTimelineItem,
} from "./WorkPackageTimelineCalendar";
import type { WorkPackagePlan } from "../../hooks/api/use-workpackage-planning";

export const minCalendarTime = dayjs().add(-2, "months").valueOf();
export const maxCalendarTime = dayjs().add(2, "months").valueOf();

export const handleTimeChange: OnTimeChange<
  WorkPackageTimelineItem,
  WorkPackageTimelineGroup
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

export const createWorkPackageTimelineGroups = (
  employeeName: string
): WorkPackageTimelineGroup[] => {
  return [
    {
      id: "employee",
      title: employeeName,
      height: 50,
    },
  ];
};

export const createWorkPackageTimelineItems = (
  workPackagePlans: WorkPackagePlan[]
): WorkPackageTimelineItem[] => {
  return workPackagePlans.map((plan) => {
    const isProject = !!plan.project;
    const title = isProject
      ? `${plan.project?.name} - ${plan.project?.work_package_name}`
      : plan.internal_task?.name || "Unknown Task";

    // Match admin portal colors exactly
    const bgColor = isProject ? "#edef7a" : "#e0adf3"; // Yellow for projects, purple for internal tasks
    const color = "#000000";

    return {
      id: plan.id,
      group: "employee",
      title,
      start_time: plan.start_time,
      end_time: plan.end_time,
      bgColor,
      color,
    };
  });
};
