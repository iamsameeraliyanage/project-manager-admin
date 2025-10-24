import { Button, ButtonGroup } from "@mui/material";
import type { TimelineView } from "./leaveTimelineUtils";

const LeaveTimelineViewSwitcher = ({
  currentView,
  handleViewChange,
}: {
  currentView: TimelineView;
  handleViewChange: (view: "week" | "month") => void;
}) => {
  return (
    <ButtonGroup variant="contained">
      <Button
        onClick={() => handleViewChange("week")}
        color={currentView === "week" ? "primary" : "secondary"}
      >
        Week
      </Button>
      <Button
        onClick={() => handleViewChange("month")}
        color={currentView === "month" ? "primary" : "secondary"}
      >
        Month
      </Button>
    </ButtonGroup>
  );
};

export default LeaveTimelineViewSwitcher;
