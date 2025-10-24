import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import { format, parseISO } from "date-fns";
import {
  TimeLoggingRequestStatus,
  TimeLoggingRequestType,
} from "../../types/time-logging-request";
import type { TimeLoggingRequest } from "../../types/time-logging-request";
import {
  useMyTimeLoggingRequests,
  useDeleteTimeLoggingRequest,
} from "../../hooks/api/use-time-logging-requests";
import { useTranslation } from "react-i18next";

interface MyTimeLoggingRequestsProps {
  employeeId: number;
  onViewRequest?: (request: TimeLoggingRequest) => void;
  onEditRequest?: (request: TimeLoggingRequest) => void;
}

export const MyTimeLoggingRequests: React.FC<MyTimeLoggingRequestsProps> = ({
  employeeId,
  onViewRequest,
  onEditRequest,
}) => {
  const { t } = useTranslation();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const { data: requests = [], isLoading } =
    useMyTimeLoggingRequests(employeeId);
  const deleteMutation = useDeleteTimeLoggingRequest();

  const showSnackbar = (
    message: string,
    severity: "success" | "error" = "success"
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleDeleteRequest = async (request: TimeLoggingRequest) => {
    if (request.status !== TimeLoggingRequestStatus.PENDING) {
      showSnackbar(
        t("onlyPendingCanBeDeleted", "Only pending requests can be deleted"),
        "error"
      );
      return;
    }

    if (
      window.confirm(
        t(
          "confirmDelete",
          "Are you sure you want to delete this time logging request?"
        )
      )
    ) {
      try {
        await deleteMutation.mutateAsync(request.id);
        showSnackbar(
          t("deleteSuccess", "Time logging request deleted successfully"),
          "success"
        );
      } catch (error) {
        showSnackbar(
          t("deleteFail", "Failed to delete time logging request"),
          "error"
        );
      }
    }
  };

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

  const formatRequestType = (type: TimeLoggingRequestType) => {
    return type === TimeLoggingRequestType.PROJECT_WORKPACKAGE
      ? t("projectWorkPackage", "Project/Work Package")
      : t("internalTask", "Internal Task");
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

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (requests.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">
          {t(
            "noRequests",
            "You have not created any time logging requests yet."
          )}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {t("myTimeRequests", "My Time Logging Requests")}
      </Typography>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t("date", "Date")}</TableCell>
              <TableCell>{t("type", "Type")}</TableCell>
              <TableCell>{t("task", "Task")}</TableCell>
              <TableCell>{t("time", "Time")}</TableCell>
              <TableCell>{t("duration", "Duration")}</TableCell>
              <TableCell>{t("status", "Status")}</TableCell>
              <TableCell>{t("actions", "Actions")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>
                  {format(parseISO(request.requestedDate), "MMM dd, yyyy")}
                </TableCell>
                <TableCell>
                  <Chip
                    label={formatRequestType(request.requestType)}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  {request.requestType ===
                  TimeLoggingRequestType.PROJECT_WORKPACKAGE
                    ? `${request.projectName} - ${request.workPackageName}`
                    : request.internalTaskName}
                </TableCell>
                <TableCell>
                  {request.requestedStartTime} - {request.requestedEndTime}
                </TableCell>
                <TableCell>
                  {calculateDuration(
                    request.requestedStartTime,
                    request.requestedEndTime,
                    request.breakMinutes
                  )}
                </TableCell>
                <TableCell>
                  <Chip
                    label={request.status.replace("_", " ").toUpperCase()}
                    size="small"
                    color={getStatusColor(request.status)}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    <Tooltip title={t("viewDetails", "View Details")}>
                      <IconButton
                        size="small"
                        onClick={() => onViewRequest?.(request)}
                      >
                        <ViewIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    {request.status === TimeLoggingRequestStatus.PENDING && (
                      <>
                        <Tooltip title={t("editRequest", "Edit Request")}>
                          <IconButton
                            size="small"
                            onClick={() => onEditRequest?.(request)}
                            color="primary"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t("deleteRequest", "Delete Request")}>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteRequest(request)}
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
    </Box>
  );
};
