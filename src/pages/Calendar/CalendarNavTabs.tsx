import {
  Stack,
  Card,
  Typography,
  Box,
  Grid,
  CardActionArea,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MdBeachAccess } from "react-icons/md";
import { BiTime } from "react-icons/bi";
import { FaRegCalendarAlt } from "react-icons/fa";

const CalendarTabCard = ({
  title,
  description,
  icon,
  color,
  onClick,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
}) => {
  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
      }}
    >
      <CardActionArea
        onClick={onClick}
        sx={{
          height: "100%",
        }}
      >
        <Box
          sx={{
            mb: 3,
            color,
            fontSize: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </Box>
        <Typography variant="h4" align="center" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary">
          {description}
        </Typography>
      </CardActionArea>
    </Card>
  );
};

const CalendarNavTabs = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleCalendarView = () => {
    navigate(`/${userId}/calendar/view`);
  };

  const handleVacationRequest = () => {
    navigate(`/${userId}/calendar/vacation-request`);
  };

  const handleTimeReport = () => {
    navigate(`/${userId}/calendar/time-report`);
  };

  return (
    <Stack py={3} spacing={2} sx={{ flex: 1, overflow: "auto" }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 6, md: 4 }}>
          <CalendarTabCard
            title={t("calendarView", "Calendar View")}
            description={t(
              "calendarViewDescription",
              "View your schedule and upcoming events"
            )}
            icon={<FaRegCalendarAlt />}
            color="#009cc8"
            onClick={handleCalendarView}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 4 }}>
          <CalendarTabCard
            title={t("vacationRequest", "Vacation Request")}
            description={t(
              "vacationRequestDescription",
              "Submit and view vacation requests"
            )}
            icon={<MdBeachAccess />}
            color="#10b981"
            onClick={handleVacationRequest}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 4 }}>
          <CalendarTabCard
            title={t("timeReport", "Time Report")}
            description={t(
              "timeReportDescription",
              "View your time tracking reports"
            )}
            icon={<BiTime />}
            color="#f59e0b"
            onClick={handleTimeReport}
          />
        </Grid>
      </Grid>
    </Stack>
  );
};

export default CalendarNavTabs;
