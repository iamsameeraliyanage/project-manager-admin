import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  Paper,
  Box,
  Alert,
  Chip,
  Snackbar,
} from "@mui/material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format } from "date-fns";
import { TimeLoggingRequestType } from "../../types/time-logging-request";
import type { CreateTimeLoggingRequest } from "../../types/time-logging-request";
import { useCreateTimeLoggingRequest } from "../../hooks/api/use-time-logging-requests";
import { useTranslation } from "react-i18next";

interface TimeLoggingRequestFormDialogProps {
  open: boolean;
  onClose: () => void;
  requestType: TimeLoggingRequestType;
  projectId?: number;
  projectName?: string;
  workPackageId?: number;
  workPackageName?: string;
  internalTaskId?: number;
  internalTaskName?: string;
  employeeId: number;
}

interface FormData {
  requestedDate: Date | null;
  requestedStartTime: Date | null;
  requestedEndTime: Date | null;
  breakMinutes: number;
  reason: string;
  description: string;
}

const initialFormData: FormData = {
  requestedDate: null,
  requestedStartTime: null,
  requestedEndTime: null,
  breakMinutes: 0,
  reason: "",
  description: "",
};

export const TimeLoggingRequestFormDialog: React.FC<
  TimeLoggingRequestFormDialogProps
> = ({
  open,
  onClose,
  requestType,
  projectId,
  projectName,
  workPackageId,
  workPackageName,
  internalTaskId,
  internalTaskName,
  employeeId,
}) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const createMutation = useCreateTimeLoggingRequest();
  const { t } = useTranslation();

  const showSnackbar = (
    message: string,
    severity: "success" | "error" = "success"
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setFormData(initialFormData);
      setErrors({});
    }
  }, [open]);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear field-specific errors
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.requestedDate) {
      newErrors.requestedDate = t("date_required", "Date is required") as any;
    }

    if (!formData.requestedStartTime) {
      newErrors.requestedStartTime = t(
        "start_time_required",
        "Start time is required"
      ) as any;
    }

    if (!formData.requestedEndTime) {
      newErrors.requestedEndTime = t(
        "end_time_required",
        "End time is required"
      ) as any;
    }

    if (formData.requestedStartTime && formData.requestedEndTime) {
      if (formData.requestedStartTime >= formData.requestedEndTime) {
        newErrors.requestedEndTime = t(
          "end_time_after_start",
          "End time must be after start time"
        ) as any;
      }
    }

    if (!formData.reason.trim()) {
      newErrors.reason = t("reason_required", "Reason is required") as any;
    }

    if (formData.breakMinutes < 0) {
      newErrors.breakMinutes = t(
        "break_minutes_negative",
        "Break minutes cannot be negative"
      ) as any;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const submitData: CreateTimeLoggingRequest = {
      employeeId,
      requestType,
      projectId,
      projectName,
      workPackageId,
      workPackageName,
      internalTaskId,
      internalTaskName,
      requestedDate: formData.requestedDate
        ? format(formData.requestedDate, "yyyy-MM-dd")
        : "",
      requestedStartTime: formData.requestedStartTime
        ? format(formData.requestedStartTime, "HH:mm")
        : "",
      requestedEndTime: formData.requestedEndTime
        ? format(formData.requestedEndTime, "HH:mm")
        : "",
      breakMinutes: formData.breakMinutes,
      reason: formData.reason,
      description: formData.description || undefined,
    };

    try {
      const result = await createMutation.mutateAsync(submitData);
      console.log("Time logging request created successfully:", result);
      showSnackbar(
        t(
          "time_logging_request_created_successfully",
          "Time logging request created successfully"
        ),
        "success"
      );
      onClose();
    } catch (error: any) {
      console.error("Error submitting time logging request:", error);

      // Extract meaningful error message
      let errorMessage = t(
        "failed_to_create_time_logging_request",
        "Failed to create time logging request"
      );

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      showSnackbar(errorMessage, "error");
    }
  };

  const isLoading = createMutation.isPending;

  const calculateDuration = () => {
    if (formData.requestedStartTime && formData.requestedEndTime) {
      const start = formData.requestedStartTime;
      const end = formData.requestedEndTime;
      const durationMinutes =
        (end.getTime() - start.getTime()) / (1000 * 60) - formData.breakMinutes;
      const hours = Math.floor(durationMinutes / 60);
      const minutes = durationMinutes % 60;
      return `${hours}h ${minutes}m`;
    }
    return "-";
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {t("request_time_entry", "Request Time Entry")}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Alert severity="info" sx={{ mb: 3 }}>
              {t(
                "requestTimeEntryAlert",
                "Use this form to request a time entry for work you forgot to log. Your manager will review and approve this request."
              )}
            </Alert>

            {/* Task Information Section */}
            <Paper sx={{ p: 3, mb: 3, backgroundColor: "#f8f9fa" }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  color: "primary.main",
                  fontWeight: 600,
                }}
              >
                📋 {t("taskInformation", "Task Information")}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  flexWrap: "wrap",
                }}
              >
                <Chip
                  label={
                    requestType === TimeLoggingRequestType.PROJECT_WORKPACKAGE
                      ? t("projectWorkPackage", "Project/Work Package")
                      : t("internalTask", "Internal Task")
                  }
                  color="primary"
                  size="medium"
                />
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {requestType === TimeLoggingRequestType.PROJECT_WORKPACKAGE
                    ? `${projectName} - ${workPackageName}`
                    : internalTaskName}
                </Typography>
              </Box>
            </Paper>

            {/* Time Details Section */}
            <Paper sx={{ p: 3, mb: 3, backgroundColor: "#f0f8ff" }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 3,
                  color: "primary.main",
                  fontWeight: 600,
                }}
              >
                ⏰ {t("time_details", "Time Details")}
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <DatePicker
                    label={t("date", "Date")}
                    value={formData.requestedDate}
                    onChange={(date) =>
                      handleInputChange("requestedDate", date)
                    }
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.requestedDate,
                        helperText: errors.requestedDate?.toString(),
                        sx: { backgroundColor: "white" },
                      },
                    }}
                    maxDate={new Date()}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <TimePicker
                    label={t("start_time", "Start Time")}
                    value={formData.requestedStartTime}
                    onChange={(time) =>
                      handleInputChange("requestedStartTime", time)
                    }
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.requestedStartTime,
                        helperText: errors.requestedStartTime?.toString(),
                        sx: { backgroundColor: "white" },
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <TimePicker
                    label={t("end_time", "End Time")}
                    value={formData.requestedEndTime}
                    onChange={(time) =>
                      handleInputChange("requestedEndTime", time)
                    }
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.requestedEndTime,
                        helperText: errors.requestedEndTime?.toString(),
                        sx: { backgroundColor: "white" },
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label={t("break_minutes", "Break (minutes)")}
                    value={formData.breakMinutes}
                    onChange={(e) =>
                      handleInputChange(
                        "breakMinutes",
                        parseInt(e.target.value) || 0
                      )
                    }
                    error={!!errors.breakMinutes}
                    helperText={errors.breakMinutes?.toString()}
                    inputProps={{ min: 0 }}
                    sx={{ backgroundColor: "white" }}
                  />
                </Grid>
                {formData.requestedStartTime && formData.requestedEndTime && (
                  <Grid size={12}>
                    <Box
                      sx={{
                        mt: 2,
                        p: 2,
                        backgroundColor: "primary.50",
                        borderRadius: 1,
                        border: "1px solid",
                        borderColor: "primary.200",
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 0.5 }}
                      >
                        {t("total_duration", "Total Duration")}:
                      </Typography>
                      <Typography
                        variant="h6"
                        color="primary.main"
                        fontWeight="bold"
                      >
                        {calculateDuration()}
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Paper>

            {/* Request Details Section */}
            <Paper sx={{ p: 3, mb: 3, backgroundColor: "#fff8f0" }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 3,
                  color: "primary.main",
                  fontWeight: 600,
                }}
              >
                📝 {t("request_details", "Request Details")}
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label={t("reason_for_request", "Reason for Request")}
                    multiline
                    rows={3}
                    value={formData.reason}
                    onChange={(e) =>
                      handleInputChange("reason", e.target.value)
                    }
                    error={!!errors.reason}
                    helperText={
                      errors.reason ||
                      t(
                        "please_explain_why_this_time_entry_was_not_logged_on_time",
                        "Please explain why this time entry was not logged on time"
                      )
                    }
                    required
                    sx={{ backgroundColor: "white" }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label={t(
                      "work_description_optional",
                      "Work Description (Optional)"
                    )}
                    multiline
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    helperText={t(
                      "describeWorkPerformed",
                      "Describe the work performed during this time"
                    )}
                    sx={{ backgroundColor: "white" }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isLoading}>
            {t("cancel", "Cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={isLoading}
          >
            {t("submit_request", "Submit Request")}
          </Button>
        </DialogActions>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Dialog>
    </LocalizationProvider>
  );
};
