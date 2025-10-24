import { Button, ButtonGroup } from "@mui/material";

export type WorkPackageTimelineView = "day" | "week" | "month";

interface WorkPackageTimelineViewSwitcherProps {
  currentView: WorkPackageTimelineView;
  handleViewChange: (view: WorkPackageTimelineView) => void;
}

const WorkPackageTimelineViewSwitcher: React.FC<
  WorkPackageTimelineViewSwitcherProps
> = ({ currentView, handleViewChange }) => {
  return (
    <ButtonGroup variant="contained">
      <Button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleViewChange("day");
        }}
        color={currentView === "day" ? "primary" : "secondary"}
        type="button"
      >
        Day
      </Button>
      <Button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleViewChange("week");
        }}
        color={currentView === "week" ? "primary" : "secondary"}
        type="button"
      >
        Week
      </Button>
      <Button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleViewChange("month");
        }}
        color={currentView === "month" ? "primary" : "secondary"}
        type="button"
      >
        Month
      </Button>
    </ButtonGroup>
  );
};

export default WorkPackageTimelineViewSwitcher;
