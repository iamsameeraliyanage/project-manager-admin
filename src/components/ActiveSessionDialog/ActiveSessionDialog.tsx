import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
  Box,
  Divider,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import type { ActiveSession } from "../../hooks/api/use-active-sessions";

interface ActiveSessionDialogProps {
  open: boolean;
  onClose: () => void;
  onContinue: () => void;
  activeSessions: ActiveSession[];
  newTaskDescription: string;
}

const ActiveSessionDialog = ({
  open,
  onClose,
  onContinue,
  activeSessions,
  newTaskDescription,
}: ActiveSessionDialogProps) => {
  const { t } = useTranslation();

  const formatDuration = (startTime: string) => {
    const start = new Date(startTime).getTime();
    const now = Date.now();
    const durationSeconds = Math.floor((now - start) / 1000);

    const hours = Math.floor(durationSeconds / 3600);
    const minutes = Math.floor((durationSeconds % 3600) / 60);
    const seconds = durationSeconds % 60;

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const getSessionTypeLabel = (type: ActiveSession["type"]) => {
    switch (type) {
      case "break":
        return t("break", "Break");
      case "customer_project":
        return t("customerProject", "Customer Project");
      case "internal_task":
        return t("internalTask", "Internal Task");
      default:
        return type;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {t("activeSessionWarning", "Active Session Warning")}
      </DialogTitle>

      <DialogContent>
        <Alert severity="warning" sx={{ mb: 2 }}>
          {t(
            "activeSessionMessage",
            "You have active sessions running. Starting a new task will automatically close the following sessions:"
          )}
        </Alert>

        <Box sx={{ mb: 2 }}>
          {activeSessions.map((session, index) => (
            <Box key={index} sx={{ mb: 1 }}>
              <Typography variant="subtitle2" color="text.primary">
                {getSessionTypeLabel(session.type)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("duration", "Duration")}: {formatDuration(session.startTime)}
              </Typography>
              {index < activeSessions.length - 1 && <Divider sx={{ my: 1 }} />}
            </Box>
          ))}
        </Box>

        <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
          <Typography variant="subtitle2" color="primary">
            {t("newTask", "New Task")}:
          </Typography>
          <Typography variant="body2">{newTaskDescription}</Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          {t("cancel", "Cancel")}
        </Button>
        <Button onClick={onContinue} variant="contained" color="primary">
          {t("continueAndCloseActive", "Continue & Close Active Sessions")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ActiveSessionDialog;
