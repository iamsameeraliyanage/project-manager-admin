import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Grid,
  Alert,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormHelperText,
  Chip,
  Skeleton,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { IoArrowBack } from "react-icons/io5";
import { CalendarMonth, Info } from "@mui/icons-material";
import dayjs from "../../utils/dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLeaveQueryFn } from "../../services/api";
import { useEmployeeVisibleLeaveTypes } from "../../hooks/api/use-leave-types";
import useEmployee from "../../hooks/api/use-employee";
import { useHolidays } from "../../hooks/api/use-holidays";
import { useCalculateLeaveDaysWithBreakdown } from "../../hooks/api/use-leaves";
import type { CreateLeaveRequest, HalfDayPeriod } from "../../types/leave";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type { Dayjs } from "dayjs";

const VacationRequestForm = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  // Fetch data
  const { data: employees = [] } = useEmployee();
  const { data: leaveTypes = [] } = useEmployeeVisibleLeaveTypes();

  // Find current employee
  const currentEmployee = employees.find((emp) => emp.id === Number(userId));

  // Fetch holidays for the current year to exclude them from working days calculation
  const currentYear = dayjs().year();
  const { data: holidays = [] } = useHolidays(
    `${currentYear}-01-01`,
    `${currentYear + 1}-12-31` // Get holidays for current and next year to cover year transitions
  );

  // Helper function to check if a date is a weekend
  const isWeekend = (date: string): boolean => {
    const dayOfWeek = dayjs(date).day(); // 0=Sunday, 6=Saturday
    return dayOfWeek === 0 || dayOfWeek === 6;
  };

  // Helper function to check if a date is a holiday
  const isDateHoliday = (date: string): boolean => {
    return holidays.some((holiday) => holiday.date.startsWith(date));
  };

  // Helper function to get next working day (not weekend and not holiday)
  const getNextWorkingDay = (date: dayjs.Dayjs): string => {
    let nextDay = date.clone();
    while (
      isWeekend(nextDay.format("YYYY-MM-DD")) ||
      isDateHoliday(nextDay.format("YYYY-MM-DD"))
    ) {
      nextDay = nextDay.add(1, "day");
    }
    return nextDay.format("YYYY-MM-DD");
  };

  // Helper function to get next weekday (keeping original for backward compatibility)
  const getNextWeekday = (date: dayjs.Dayjs): string => {
    return getNextWorkingDay(date);
  };

  // Get initial date (next weekday if today is weekend)
  const getInitialDate = (): string => {
    const today = dayjs();
    return getNextWeekday(today);
  };

  // Helper function to disable weekends and holidays in date picker
  const shouldDisableDate = (date: dayjs.Dayjs) => {
    const dayOfWeek = date.day();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isHolidayDate = holidays.some(
      (holiday) => date.format("YYYY-MM-DD") === holiday.date.split("T")[0]
    );
    return isWeekend || isHolidayDate;
  };

  // Form state
  const [formData, setFormData] = useState<CreateLeaveRequest>({
    employeeId: Number(userId),
    leaveName: "Leave Request", // Will be auto-generated from leave type
    startDate: getInitialDate(),
    endDate: getInitialDate(),
    numberOfDays: 1,
    reason: "",
    leaveTypeId: undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [dateInputMessage, setDateInputMessage] = useState<{
    startDate?: string;
    endDate?: string;
  }>({});

  // Get leave days breakdown with work schedule consideration
  const { data: leaveDaysBreakdown, isLoading: isLoadingBreakdown } = useCalculateLeaveDaysWithBreakdown(
    Number(userId) || 0,
    formData.startDate,
    formData.endDate,
    formData.isHalfDay
  );

  // Update form data when breakdown changes
  React.useEffect(() => {
    if (leaveDaysBreakdown && leaveDaysBreakdown.adjustedWorkingDays !== formData.numberOfDays) {
      setFormData(prev => ({
        ...prev,
        numberOfDays: leaveDaysBreakdown.adjustedWorkingDays
      }));
    }
  }, [leaveDaysBreakdown]);

  // Helper function to check if a date is a holiday
  const isHoliday = (date: dayjs.Dayjs): boolean => {
    const dateString = date.format("YYYY-MM-DD");
    return holidays.some((holiday) => holiday.date.startsWith(dateString));
  };

  // Calculate working days excluding weekends and holidays
  const calculateWorkingDays = (
    start: dayjs.Dayjs,
    end: dayjs.Dayjs
  ): number => {
    if (!start.isValid() || !end.isValid()) {
      return 1; // Default to 1 day for invalid dates
    }

    if (end.isBefore(start)) {
      return 1; // Default to 1 day for invalid ranges
    }

    let workingDays = 0;
    let currentDate = start.clone();

    // Calculate total days between start and end (inclusive)
    const totalDays = end.diff(start, "day") + 1;

    // Safety check: don't process more than 365 days
    if (totalDays > 365) {
      return 1; // Return default for very long ranges
    }

    for (let i = 0; i < totalDays; i++) {
      const dayOfWeek = currentDate.day(); // 0=Sunday, 6=Saturday
      const isWeekendDay = dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
      const isHolidayDay = isHoliday(currentDate);

      if (!isWeekendDay && !isHolidayDay) {
        // Not weekend and not holiday
        workingDays++;
      }
      currentDate = currentDate.add(1, "day");
    }

    return workingDays || 1; // Ensure at least 1 day is returned
  };

  // Create leave mutation
  const createLeaveMutation = useMutation({
    mutationFn: createLeaveQueryFn,
    onSuccess: () => {
      // Invalidate and refetch leaves
      queryClient.invalidateQueries({ queryKey: ["leaves"] });
      // Navigate back
      navigate(`/${userId}/calendar/vacation-request`);
    },
    onError: (error: any) => {
      console.error("Failed to create leave:", error);
    },
  });

  const handleBack = () => {
    navigate(`/${userId}/calendar/vacation-request`);
  };

  const handleInputChange = (field: keyof CreateLeaveRequest, value: any) => {
    // Handle date fields with weekend and holiday validation
    if (field === "startDate" || field === "endDate") {
      const originalDate = dayjs(value);

      // If selected date is a weekend or holiday, automatically move to next working day
      if (isWeekend(value) || isDateHoliday(value)) {
        const isWeekendDay = isWeekend(value);
        const isHolidayDay = isDateHoliday(value);
        value = getNextWorkingDay(originalDate);

        // Show a temporary message about the adjustment
        let messageKey = "weekendAdjusted";
        if (isWeekendDay && isHolidayDay) {
          messageKey = "weekendAndHolidayAdjusted";
        } else if (isHolidayDay) {
          messageKey = "holidayAdjusted";
        }

        setDateInputMessage((prev) => ({
          ...prev,
          [field]: t(
            messageKey,
            `Date adjusted to next working day: ${dayjs(value).format(
              "MMM DD, YYYY"
            )}`
          ),
        }));

        // Clear the message after 3 seconds
        setTimeout(() => {
          setDateInputMessage((prev) => ({
            ...prev,
            [field]: undefined,
          }));
        }, 3000);
      }
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }

    // Auto-calculate number of days when dates change
    if (field === "startDate") {
      const start = dayjs(value);
      const currentEnd = dayjs(formData.endDate);

      let newEndDate = formData.endDate;

      if (formData.isHalfDay) {
        // For half-day leaves, always set end date to match start date
        newEndDate = value;
      } else {
        // For regular leaves, if start date is after current end date, set end date to start date
        if (
          start.isValid() &&
          currentEnd.isValid() &&
          start.isAfter(currentEnd)
        ) {
          newEndDate = value;
        }
      }

      const end = dayjs(newEndDate);
      if (start.isValid() && end.isValid()) {
        setFormData((prev) => ({
          ...prev,
          startDate: value,
          endDate: newEndDate,
          numberOfDays: prev.isHalfDay ? 0.5 : calculateWorkingDays(start, end),
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [field]: value,
        }));
      }
    } else if (field === "endDate") {
      const start = dayjs(formData.startDate);
      const end = dayjs(value);

      if (
        start.isValid() &&
        end.isValid() &&
        end.isAfter(start.subtract(1, "day"))
      ) {
        const days = calculateWorkingDays(start, end);
        setFormData((prev) => ({
          ...prev,
          [field]: value,
          numberOfDays: prev.isHalfDay ? 0.5 : days,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [field]: value,
        }));
      }
    }

    // Auto-calculate days when half-day changes
    if (field === "isHalfDay") {
      const start = dayjs(formData.startDate);

      if (value) {
        // When half-day is selected, set end date to match start date
        setFormData((prev) => ({
          ...prev,
          [field]: value,
          endDate: prev.startDate, // Set end date same as start date
          numberOfDays: 0.5,
          halfDayPeriod: prev.halfDayPeriod,
        }));
      } else {
        // When half-day is unchecked, recalculate based on current dates
        const end = dayjs(formData.endDate);
        const days =
          start.isValid() && end.isValid()
            ? calculateWorkingDays(start, end)
            : 1;

        setFormData((prev) => ({
          ...prev,
          [field]: value,
          numberOfDays: days,
          halfDayPeriod: undefined, // Clear half-day period
        }));
      }
    }

    // Auto-generate leave name based on leave type
    if (field === "leaveTypeId") {
      const selectedLeaveType = leaveTypes.find((type) => type.id === value);
      setFormData((prev) => ({
        ...prev,
        [field]: value,
        leaveName: selectedLeaveType
          ? selectedLeaveType.description
          : "Leave Request",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.leaveTypeId) {
      newErrors.leaveTypeId = t("leaveTypeRequired", "Leave type is required");
    }

    if (!formData.startDate) {
      newErrors.startDate = t("startDateRequired", "Start date is required");
    }

    if (!formData.endDate) {
      newErrors.endDate = t("endDateRequired", "End date is required");
    }

    if (formData.startDate && formData.endDate) {
      const start = dayjs(formData.startDate);
      const end = dayjs(formData.endDate);

      if (end.isBefore(start)) {
        newErrors.endDate = t(
          "endDateBeforeStart",
          "End date cannot be before start date"
        );
      }
    }

    if (formData.numberOfDays <= 0) {
      newErrors.numberOfDays = t(
        "numberOfDaysInvalid",
        "Number of days must be greater than 0"
      );
    }

    // Validate half-day logic
    if (formData.isHalfDay) {
      if (formData.startDate !== formData.endDate) {
        newErrors.isHalfDay = t(
          "halfDayMustBeSingleDay",
          "Half-day leave must be for a single day"
        );
      }
      if (!formData.halfDayPeriod) {
        newErrors.halfDayPeriod = t(
          "halfDayPeriodRequired",
          "Half-day period is required"
        );
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = () => {
    setShowConfirmDialog(false);
    
    // Use the breakdown data for more accurate number of days if available
    const submitData = {
      ...formData,
      numberOfDays: leaveDaysBreakdown?.adjustedWorkingDays ?? formData.numberOfDays
    };

    createLeaveMutation.mutate(submitData);
  };

  const handleCancelConfirm = () => {
    setShowConfirmDialog(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <Box sx={{ py: 2, px: 3, borderBottom: 1, borderColor: "divider" }}>
          <Button
            startIcon={<IoArrowBack />}
            onClick={handleBack}
            sx={{ mb: 1 }}
          >
            {t("back", "Back")}
          </Button>

          <Box sx={{ mb: 1 }}>
            <Typography variant="h5" component="h1" gutterBottom>
              {t("requestVacation", "Request Vacation")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {currentEmployee &&
                `${t("requestingFor", "Requesting for")}: ${
                  currentEmployee.firstname
                } ${currentEmployee.lastname}`}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ flex: 1, overflow: "auto", p: 3 }}>
          <Card>
            <CardContent>
              <Grid container spacing={3}>
                {/* Leave Type - Full width row */}
                <Grid size={{ xs: 12 }}>
                  <FormControl
                    fullWidth
                    sx={{ minWidth: 200 }}
                    error={!!errors.leaveTypeId}
                  >
                    <InputLabel>{t("leaveType", "Leave Type")}</InputLabel>
                    <Select
                      value={formData.leaveTypeId || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "leaveTypeId",
                          e.target.value || undefined
                        )
                      }
                      label={t("leaveType", "Leave Type")}
                    >
                      <MenuItem value="">
                        <em>{t("none", "None")}</em>
                      </MenuItem>
                      {leaveTypes.map((type) => (
                        <MenuItem key={type.id} value={type.id}>
                          {type.description}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.leaveTypeId && (
                      <FormHelperText>{errors.leaveTypeId}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                {/* Start Date and End Date - Same row */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <DatePicker
                    label={t("startDate", "Start Date")}
                    value={
                      formData.startDate ? dayjs(formData.startDate) : null
                    }
                    onChange={(newValue) => {
                      if (newValue) {
                        handleInputChange(
                          "startDate",
                          dayjs(newValue).format("YYYY-MM-DD")
                        );
                      }
                    }}
                    shouldDisableDate={(date: Dayjs | Date) => shouldDisableDate(dayjs(date))}
                    minDate={dayjs()}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error:
                          !!errors.startDate || !!dateInputMessage.startDate,
                        helperText: dateInputMessage.startDate ||
                          errors.startDate || (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <Info sx={{ fontSize: 16 }} />
                              <span>
                                {t(
                                  "weekendsAndHolidaysNotAllowed",
                                  "Weekends and holidays are disabled"
                                )}
                              </span>
                            </Box>
                          ),
                        FormHelperTextProps: {
                          component: "div",
                        },
                      },
                      day: {
                        sx: {
                          "&.MuiPickersDay-root.Mui-disabled": {
                            backgroundColor: "action.disabledBackground",
                            color: "text.disabled",
                            textDecoration: "line-through",
                          },
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <DatePicker
                    label={t("endDate", "End Date")}
                    value={formData.endDate ? dayjs(formData.endDate) : null}
                    onChange={(newValue) => {
                      if (newValue) {
                        handleInputChange(
                          "endDate",
                          dayjs(newValue).format("YYYY-MM-DD")
                        );
                      }
                    }}
                    shouldDisableDate={(date: Date | Dayjs) => shouldDisableDate(dayjs(date))}
                    minDate={
                      formData.startDate ? dayjs(formData.startDate) : dayjs()
                    }
                    disabled={formData.isHalfDay}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.endDate || !!dateInputMessage.endDate,
                        helperText:
                          dateInputMessage.endDate ||
                          errors.endDate ||
                          (formData.startDate ? (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                                color: "primary.main",
                              }}
                            >
                              <CalendarMonth sx={{ fontSize: 16 }} />
                              <span>
                                {t(
                                  "startDateSelected",
                                  `Start date: ${dayjs(
                                    formData.startDate
                                  ).format("MMM DD, YYYY")}`
                                )}
                              </span>
                            </Box>
                          ) : (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <Info sx={{ fontSize: 16 }} />
                              <span>
                                {t(
                                  "weekendsAndHolidaysNotAllowed",
                                  "Weekends and holidays are disabled"
                                )}
                              </span>
                            </Box>
                          )),
                        FormHelperTextProps: {
                          component: "div",
                        },
                      },
                      day: {
                        sx: {
                          "&.MuiPickersDay-root.Mui-disabled": {
                            backgroundColor: "action.disabledBackground",
                            color: "text.disabled",
                            textDecoration: "line-through",
                          },
                        },
                      },
                    }}
                  />
                </Grid>

                {/* Number of Days - Below dates */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label={t("numberOfDays", "Number of Days")}
                    value={leaveDaysBreakdown?.adjustedWorkingDays ?? formData.numberOfDays}
                    onChange={(e) =>
                      handleInputChange("numberOfDays", Number(e.target.value))
                    }
                    error={!!errors.numberOfDays}
                    helperText={
                      errors.numberOfDays || 
                      (leaveDaysBreakdown && leaveDaysBreakdown.adjustedWorkingDays !== formData.numberOfDays
                        ? t("autoCalculated", "Auto-calculated based on work schedule")
                        : undefined)
                    }
                    inputProps={{ min: 0.5, step: 0.5 }}
                    disabled={true} // Always disabled as it's calculated automatically
                  />
                </Grid>

                {/* Leave Days Breakdown - Show when dates are selected */}
                {formData.startDate && formData.endDate && (
                  <Grid size={{ xs: 12 }}>
                    <Card variant="outlined" sx={{ backgroundColor: "background.default" }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <CalendarMonth color="primary" />
                          {t("leaveDaysBreakdown", "Leave Days Breakdown")}
                        </Typography>
                        
                        {isLoadingBreakdown ? (
                          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            <Skeleton variant="text" width={200} />
                            <Skeleton variant="text" width={150} />
                            <Skeleton variant="text" width={180} />
                          </Box>
                        ) : leaveDaysBreakdown ? (
                          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                              <Chip 
                                label={`${t("totalCalendarDays", "Total Days")}: ${leaveDaysBreakdown.totalCalendarDays}`}
                                variant="outlined"
                                size="small"
                              />
                              <Chip 
                                label={`${t("weekendDays", "Weekend Days")}: ${leaveDaysBreakdown.weekendDays}`}
                                variant="outlined"
                                size="small"
                                color="default"
                              />
                              {leaveDaysBreakdown.offDaysFromSchedule > 0 && (
                                <Chip 
                                  label={`${t("offDaysFromSchedule", "Off Days (Work Schedule)")}: ${leaveDaysBreakdown.offDaysFromSchedule}`}
                                  variant="outlined"
                                  size="small"
                                  color="warning"
                                />
                              )}
                              <Chip 
                                label={`${t("adjustedWorkingDays", "Actual Leave Days")}: ${leaveDaysBreakdown.adjustedWorkingDays}`}
                                variant="filled"
                                size="small"
                                color="primary"
                              />
                            </Box>
                            
                            {leaveDaysBreakdown.offDaysFromSchedule > 0 && (
                              <Alert severity="info" sx={{ mt: 1 }}>
                                <Typography variant="body2">
                                  {t(
                                    "offDaysExcluded", 
                                    "{{count}} day(s) excluded based on your work schedule (off days will not count towards leave balance).",
                                    { count: leaveDaysBreakdown.offDaysFromSchedule }
                                  )}
                                </Typography>
                              </Alert>
                            )}
                          </Box>
                        ) : null}
                      </CardContent>
                    </Card>
                  </Grid>
                )}

                {/* Half-day selection */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.isHalfDay || false}
                        onChange={(e) =>
                          handleInputChange("isHalfDay", e.target.checked)
                        }
                      />
                    }
                    label={t("isHalfDay", "Half-day leave")}
                  />
                  {errors.isHalfDay && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ display: "block", mt: 0.5 }}
                    >
                      {errors.isHalfDay}
                    </Typography>
                  )}
                </Grid>

                {formData.isHalfDay && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth error={!!errors.halfDayPeriod}>
                      <InputLabel>
                        {t("halfDayPeriod", "Half-day Period")}
                      </InputLabel>
                      <Select
                        value={formData.halfDayPeriod || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "halfDayPeriod",
                            e.target.value as HalfDayPeriod
                          )
                        }
                        label={t("halfDayPeriod", "Half-day Period")}
                      >
                        <MenuItem value="">
                          <em>{t("selectPeriod", "Select Period")}</em>
                        </MenuItem>
                        <MenuItem value="morning">
                          {t("morning", "Morning")}
                        </MenuItem>
                        <MenuItem value="afternoon">
                          {t("afternoon", "Afternoon")}
                        </MenuItem>
                      </Select>
                      {errors.halfDayPeriod && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{ mt: 0.5 }}
                        >
                          {errors.halfDayPeriod}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>
                )}

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label={t("reason", "Reason (Optional)")}
                    value={formData.reason}
                    onChange={(e) =>
                      handleInputChange("reason", e.target.value)
                    }
                    placeholder={t(
                      "reasonPlaceholder",
                      "Provide additional details about your leave request..."
                    )}
                  />
                </Grid>

                {createLeaveMutation.isError && (
                  <Grid size={{ xs: 12 }}>
                    <Alert severity="error">
                      {t(
                        "createLeaveError",
                        "Failed to create leave request. Please try again."
                      )}
                    </Alert>
                  </Grid>
                )}

                <Grid size={{ xs: 12 }}>
                  <Box
                    sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}
                  >
                    <Button
                      variant="outlined"
                      onClick={handleBack}
                      disabled={createLeaveMutation.isPending}
                    >
                      {t("cancel", "Cancel")}
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleSubmit}
                      disabled={createLeaveMutation.isPending}
                    >
                      {createLeaveMutation.isPending
                        ? t("submitting", "Submitting...")
                        : t("submitRequest", "Submit Request")}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>

        {/* Confirmation Dialog */}
        <Dialog
          open={showConfirmDialog}
          onClose={handleCancelConfirm}
          aria-labelledby="confirm-dialog-title"
          aria-describedby="confirm-dialog-description"
        >
          <DialogTitle id="confirm-dialog-title">
            <Box>
              <Typography variant="h6" component="div">
                {t("confirmLeaveRequest", "Confirm Leave Request")}
              </Typography>
              {currentEmployee && (
                <Typography
                  variant="h6"
                  color="primary"
                  fontWeight="bold"
                  sx={{ mt: 1 }}
                >
                  {currentEmployee.firstname} {currentEmployee.lastname}
                </Typography>
              )}
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              {t(
                "confirmLeaveMessage",
                "Are you sure you want to submit this leave request?"
              )}
            </Typography>
            <Box sx={{ mt: 2, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
              <Grid container spacing={1}>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    {t("leaveType", "Leave Type")}:
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {leaveTypes.find((type) => type.id === formData.leaveTypeId)
                      ?.description || t("none", "None")}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    {t("startDate", "Start Date")}:
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {dayjs(formData.startDate).format("MMM DD, YYYY")}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    {t("endDate", "End Date")}:
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {dayjs(formData.endDate).format("MMM DD, YYYY")}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    {t("numberOfDays", "Number of Days")}:
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {formData.numberOfDays}{" "}
                    {formData.isHalfDay
                      ? `(${t("halfDay", "Half Day")} - ${
                          formData.halfDayPeriod === "morning"
                            ? t("morning", "Morning")
                            : t("afternoon", "Afternoon")
                        })`
                      : ""}
                  </Typography>
                </Grid>
                {formData.reason && (
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="body2" color="text.secondary">
                      {t("reason", "Reason")}:
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {formData.reason}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCancelConfirm}
              disabled={createLeaveMutation.isPending}
            >
              {t("cancel", "Cancel")}
            </Button>
            <Button
              onClick={handleConfirmSubmit}
              variant="contained"
              disabled={createLeaveMutation.isPending}
            >
              {createLeaveMutation.isPending
                ? t("submitting", "Submitting...")
                : t("submitRequest", "Submit Request")}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default VacationRequestForm;
