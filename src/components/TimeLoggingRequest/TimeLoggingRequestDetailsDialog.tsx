import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Paper,
  Box,
  Chip,
  Divider,
} from "@mui/material";
import { format, parseISO } from "date-fns";
import { TimeLoggingRequestStatus } from "../../types/time-logging-request";
import type { TimeLoggingRequest } from "../../types/time-logging-request";
import { useTranslation } from "react-i18next";

interface TimeLoggingRequestDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  request: TimeLoggingRequest | null;
}

export const TimeLoggingRequestDetailsDialog: React.FC<
  TimeLoggingRequestDetailsDialogProps
> = ({ open, onClose, request }) => {
  const { t } = useTranslation();
  if (!request) return null;

  const getStatusColor = (status: TimeLoggingRequestStatus) => {
    switch (status) {
      case TimeLoggingRequestStatus.PENDING:
        return "warning";
      case TimeLoggingRequestStatus.APPROVED:
        return "success";
      case TimeLoggingRequestStatus.REJECTED:
        return "error";
      case TimeLoggingRequestStatus.ADJUSTED_AND_APPROVED:
        return "info";
      default:
        return "default";
    }
  };

  const calculateDuration = (
    startTime: string,
    endTime: string,
    breakMinutes: number = 0
  ) => {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const durationMinutes =
      (end.getTime() - start.getTime()) / (1000 * 60) - breakMinutes;
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  const wasAdjusted =
    request.status === TimeLoggingRequestStatus.ADJUSTED_AND_APPROVED &&
    (request.adjustedDate ||
      request.adjustedStartTime ||
      request.adjustedEndTime);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {t("timeLoggingRequestDetails", "Time Logging Request Details")}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            {/* Status */}
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  {t("status", "Status")} :
                </Typography>
                <Chip
                  label={request.status.replace("_", " ").toUpperCase()}
                  color={getStatusColor(request.status)}
                  size="small"
                />
              </Box>
            </Grid>

            {/* Task Information */}
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {t("taskInformation", "Task Information")}
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Typography variant="body2" color="textSecondary">
                      {t("type", "Type")}
                    </Typography>
                    <Typography variant="body1">
                      {request.requestType === "project_workpackage"
                        ? t("projectWorkpackage", "Project/Work Package")
                        : t("internalTask", "Internal Task")}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Typography variant="body2" color="textSecondary">
                      {t("task", "Task")}
                    </Typography>
                    <Typography variant="body1">
                      {request.requestType === "project_workpackage"
                        ? `${request.projectName} - ${request.workPackageName}`
                        : request.internalTaskName}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Requested Time */}
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {t("requestedTime", "Requested Time")}
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Typography variant="body2" color="textSecondary">
                      {t("date", "Date")}
                    </Typography>
                    <Typography variant="body1">
                      {format(parseISO(request.requestedDate), "MMM dd, yyyy")}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Typography variant="body2" color="textSecondary">
                      {t("startTime", "Start Time")}
                    </Typography>
                    <Typography variant="body1">
                      {request.requestedStartTime}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Typography variant="body2" color="textSecondary">
                      {t("endTime", "End Time")}
                    </Typography>
                    <Typography variant="body1">
                      {request.requestedEndTime}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Typography variant="body2" color="textSecondary">
                      {t("duration", "Duration")}
                    </Typography>
                    <Typography variant="body1">
                      {calculateDuration(
                        request.requestedStartTime,
                        request.requestedEndTime,
                        request.breakMinutes
                      )}
                    </Typography>
                  </Grid>
                  {request.breakMinutes && request.breakMinutes > 0 && (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      <Typography variant="body2" color="textSecondary">
                        {t("breakTime", "Break Time")}
                      </Typography>
                      <Typography variant="body1">
                        {request.breakMinutes} {t("minutes", "minutes")}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Paper>
            </Grid>

            {/* Adjusted Time (if applicable) */}
            {wasAdjusted && (
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Paper sx={{ p: 2, bgcolor: "action.hover" }}>
                  <Typography variant="h6" gutterBottom color="primary">
                    {t("adjustedTime", "Adjusted Time")} (
                    {t("approved", "Approved")})
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      <Typography variant="body2" color="textSecondary">
                        {t("date", "Date")}
                      </Typography>
                      <Typography variant="body1">
                        {request.adjustedDate
                          ? format(
                              parseISO(request.adjustedDate),
                              "MMM dd, yyyy"
                            )
                          : format(
                              parseISO(request.requestedDate),
                              "MMM dd, yyyy"
                            )}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      <Typography variant="body2" color="textSecondary">
                        {t("startTime", "Start Time")}
                      </Typography>
                      <Typography variant="body1">
                        {request.adjustedStartTime ||
                          request.requestedStartTime}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      <Typography variant="body2" color="textSecondary">
                        {t("endTime", "End Time")}
                      </Typography>
                      <Typography variant="body1">
                        {request.adjustedEndTime || request.requestedEndTime}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      <Typography variant="body2" color="textSecondary">
                        {t("duration", "Duration")}
                      </Typography>
                      <Typography variant="body1">
                        {calculateDuration(
                          request.adjustedStartTime ||
                            request.requestedStartTime,
                          request.adjustedEndTime || request.requestedEndTime,
                          request.adjustedBreakMinutes ?? request.breakMinutes
                        )}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            )}

            {/* Request Details */}
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {t("requestDetails", "Request Details")}
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Typography variant="body2" color="textSecondary">
                      {t("reason", "Reason")}
                    </Typography>
                    <Typography variant="body1">{request.reason}</Typography>
                  </Grid>
                  {request.description && (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      <Typography variant="body2" color="textSecondary">
                        {t("description", "Description")}
                      </Typography>
                      <Typography variant="body1">
                        {request.description}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Paper>
            </Grid>

            {/* Manager Response (if reviewed) */}
            {request.status !== TimeLoggingRequestStatus.PENDING && (
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    {t("managerResponse", "Manager Response")}
                  </Typography>
                  <Grid container spacing={2}>
                    {request.manager && (
                      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Typography variant="body2" color="textSecondary">
                          {t("reviewedBy", "Reviewed By")}
                        </Typography>
                        <Typography variant="body1">
                          {request.manager.firstName} {request.manager.lastName}
                        </Typography>
                      </Grid>
                    )}
                    {request.reviewedAt && (
                      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Typography variant="body2" color="textSecondary">
                          {t("reviewedAt", "Reviewed At")}
                        </Typography>
                        <Typography variant="body1">
                          {format(
                            parseISO(request.reviewedAt),
                            "MMM dd, yyyy HH:mm"
                          )}
                        </Typography>
                      </Grid>
                    )}
                    {request.managerNotes && (
                      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Typography variant="body2" color="textSecondary">
                          {t("managerNotes", "Manager Notes")}
                        </Typography>
                        <Typography variant="body1">
                          {request.managerNotes}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Paper>
              </Grid>
            )}

            {/* Submission Details */}
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Divider />
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="textSecondary">
                  {t("submittedOn", "Submitted on")}{" "}
                  {format(parseISO(request.createdAt), "MMM dd, yyyy HH:mm")}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("button_text.close", "Close")}</Button>
      </DialogActions>
    </Dialog>
  );
};
