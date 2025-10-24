import {
  Stack,
  Card,
  Typography,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { formatTimeMinutesSeconds } from "../../utils/time-format";
import type { EmployeeBreak } from "../../types/user";
import { AiOutlineRollback } from "react-icons/ai";
import { ROUTES } from "../../routes/routes.config";
import { useNavigate } from "react-router-dom";

interface BreakStatusProps {
  todayBreakMinutes: number | undefined;
  ongoingBreakSeconds: number;
  remainingBreakSeconds: number;
  lastBreak: EmployeeBreak | null;
  isCreatingBreak: boolean;
  isCheckingOutBreak: boolean;
  hasActiveTask: boolean;
  activeTaskDescription: string | null;
  userId: number;
  onStartBreak: () => void;
  onEndBreak: () => void;
}

const BreakStatus = ({
  todayBreakMinutes,
  ongoingBreakSeconds,
  remainingBreakSeconds,
  lastBreak,
  isCreatingBreak,
  isCheckingOutBreak,
  hasActiveTask,
  activeTaskDescription,
  userId,
  onStartBreak,
  onEndBreak,
}: BreakStatusProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const safeTodayBreakMinutes = Math.max(0, todayBreakMinutes ?? 0);
  const safeOngoingBreakSeconds = Math.max(0, ongoingBreakSeconds ?? 0);
  const safeRemainingBreakSeconds = Math.max(0, remainingBreakSeconds ?? 0);

  const totalUsedBreakSeconds =
    safeTodayBreakMinutes * 60 + safeOngoingBreakSeconds;

  return (
    <Card variant="outlined" sx={{ flex: 1 }}>
      <Stack p={4} spacing={3} alignItems="center">
        <Typography variant="h5" align="center">
          {t("breakStatus", "Break Status")}
        </Typography>

        <Stack spacing={2} alignItems="center">
          <Box>
            <Typography
              variant="body1"
              color="text.secondary"
              align="center"
              gutterBottom
            >
              {t("totalBreakAllowance", "Total Break Allowance")}
            </Typography>
            <Typography variant="h4" color="primary" align="center">
              {formatTimeMinutesSeconds(30 * 60).display}
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="body1"
              color="text.secondary"
              align="center"
              gutterBottom
            >
              {t("breakTimeUsed", "Break Time Used")}
            </Typography>
            <Typography variant="h4" color="error" align="center">
              {formatTimeMinutesSeconds(totalUsedBreakSeconds).display}
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="body1"
              color="text.secondary"
              align="center"
              gutterBottom
            >
              {t("remainingBreakTime", "Remaining Break Time")}
            </Typography>
            <Typography variant="h4" color="success.main" align="center">
              {formatTimeMinutesSeconds(safeRemainingBreakSeconds).display}
            </Typography>
          </Box>

          {lastBreak && !lastBreak.endTime && (
            <Box>
              <Typography
                variant="body1"
                color="warning.main"
                align="center"
                gutterBottom
              >
                {t("currentlyOnBreak", "Currently on Break")}
              </Typography>
              <Typography variant="h5" color="warning.main" align="center">
                {t("activeBreakTime", "Active Break Time")}:{" "}
                {formatTimeMinutesSeconds(safeOngoingBreakSeconds).display}
              </Typography>
            </Box>
          )}

          {!lastBreak || lastBreak.endTime ? (
            <Box>
              <Typography
                variant="body1"
                color="text.secondary"
                align="center"
                gutterBottom
              >
                {t("active_task", "Active Task")}
              </Typography>
              {hasActiveTask && activeTaskDescription ? (
                <Typography variant="body2" color="success.main" align="center">
                  {activeTaskDescription}
                </Typography>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "center",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Typography variant="body2" color="error" align="center">
                    {t(
                      "no_active_task",
                      "No active task - You must log into a task to take a break"
                    )}
                  </Typography>
                  <Button
                    variant="outlined"
                    color="secondary"
                    endIcon={<AiOutlineRollback />}
                    onClick={() =>
                      navigate(`/${userId}/${ROUTES.USER.TIME_LOGGER}`)
                    }
                  >
                    {t("log_into_task", "Log into Task")}
                  </Button>
                </Box>
              )}
            </Box>
          ) : null}
        </Stack>

        <Button
          variant="contained"
          color={lastBreak && !lastBreak.endTime ? "error" : "primary"}
          size="large"
          disabled={Boolean(
            isCreatingBreak ||
              isCheckingOutBreak ||
              (safeRemainingBreakSeconds <= 0 &&
                !(lastBreak && !lastBreak.endTime)) ||
              ((!lastBreak || lastBreak.endTime) && !hasActiveTask)
          )}
          onClick={() => {
            if (lastBreak && !lastBreak.endTime) {
              onEndBreak();
            } else {
              onStartBreak();
            }
          }}
        >
          {isCreatingBreak || isCheckingOutBreak ? (
            <CircularProgress size={24} color="inherit" />
          ) : lastBreak && !lastBreak.endTime ? (
            t("end_break", "End Break")
          ) : (
            t("start_break", "Start Break")
          )}
        </Button>
      </Stack>
    </Card>
  );
};

export default BreakStatus;
