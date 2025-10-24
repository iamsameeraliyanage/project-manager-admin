import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Stack,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDashboardActiveSessions } from "../../hooks/api/use-dashboard-active-sessions";
import { FiClock } from "react-icons/fi";
import Card from "../Card/Card";
import ActiveWorkSessionSlider from "./ActiveWorkSessionSlider";

const ActiveWorkSessions = () => {
  const { t } = useTranslation();
  const { data: sessions, isLoading, error } = useDashboardActiveSessions();

  if (isLoading) {
    return (
      <Card fullHeight>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
        >
          <CircularProgress />
        </Box>
      </Card>
    );
  }

  if (error) {
    return (
      <Card fullHeight>
        <Alert severity="error">
          {t(
            "errorLoadingActiveSessions",
            "Error loading active work sessions"
          )}
        </Alert>
      </Card>
    );
  }

  if (!sessions || sessions.length === 0) {
    return (
      <Card fullHeight>
        <Stack sx={{ textAlign: "center", py: 6 }}>
          <Box sx={{ mb: 2, opacity: 0.5 }}>
            <FiClock size={48} />
          </Box>
          <Typography variant="h6" color="primary">
            {t("noActiveWorkSessions", "No Active Work Sessions")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {t(
              "noActiveWorkSessionsDesc",
              "No employees are currently working on projects or internal tasks"
            )}
          </Typography>
        </Stack>
      </Card>
    );
  }

  return (
    <Card fullHeight>
      <Stack>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h5" color="primary">
            {t("activeWorkSessions", "Active Work Sessions")}
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <Chip
              label={`${sessions.length} ${t("active", "Active")}`}
              color="success"
              size="small"
            />
          </Box>
        </Box>
        <ActiveWorkSessionSlider currentSessions={sessions} />
      </Stack>
    </Card>
  );
};

export default ActiveWorkSessions;
