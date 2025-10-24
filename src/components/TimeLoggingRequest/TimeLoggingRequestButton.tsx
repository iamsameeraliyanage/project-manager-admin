import React, { useState } from "react";
import { Button, Tooltip } from "@mui/material";
import { AccessTime as TimeLoggingIcon } from "@mui/icons-material";
import { TimeLoggingRequestFormDialog } from "./TimeLoggingRequestFormDialog";
import { TimeLoggingRequestType } from "../../types/time-logging-request";
import { useTranslation } from "react-i18next";

interface TimeLoggingRequestButtonProps {
  requestType: TimeLoggingRequestType;
  projectId?: number;
  projectName?: string;
  workPackageId?: number;
  workPackageName?: string;
  internalTaskId?: number;
  internalTaskName?: string;
  employeeId: number;
  size?: "small" | "medium" | "large";
  variant?: "text" | "outlined" | "contained";
  fullWidth?: boolean;
}

export const TimeLoggingRequestButton: React.FC<
  TimeLoggingRequestButtonProps
> = ({
  requestType,
  projectId,
  projectName,
  workPackageId,
  workPackageName,
  internalTaskId,
  internalTaskName,
  employeeId,
  size = "medium",
  variant = "outlined",
  fullWidth = false,
}) => {
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleClick = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <Tooltip
        title={t(
          "requestTimeForgottenLogging",
          "Request time logging for forgotten entry"
        )}
      >
        <Button
          variant={variant}
          size={size}
          startIcon={<TimeLoggingIcon />}
          onClick={handleClick}
          fullWidth={fullWidth}
          color="primary"
        >
          {t("requestTimeEntry", "Request Time Entry")}
        </Button>
      </Tooltip>

      <TimeLoggingRequestFormDialog
        open={dialogOpen}
        onClose={handleClose}
        requestType={requestType}
        projectId={projectId}
        projectName={projectName}
        workPackageId={workPackageId}
        workPackageName={workPackageName}
        internalTaskId={internalTaskId}
        internalTaskName={internalTaskName}
        employeeId={employeeId}
      />
    </>
  );
};
