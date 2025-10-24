import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Stack,
  lighten,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useLeaveSummary } from "../../hooks/api/use-leave-summary";
import {
  MdPendingActions,
  MdHourglassEmpty,
  MdEventAvailable,
} from "react-icons/md";
import { GiTeapotLeaves } from "react-icons/gi";
import { PiAirplaneInFlight } from "react-icons/pi";

interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
}

interface LeaveSummaryProps {
  employeeId: number;
  year?: number;
  user?: User;
}

export const LeaveSummary: React.FC<LeaveSummaryProps> = ({
  employeeId,
  year,
  user,
}) => {
  const { t } = useTranslation();
  const {
    data: leaveSummary,
    isLoading,
    error,
  } = useLeaveSummary(employeeId, year);

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {t("leaveSummary.title")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("leaveSummary.loading", "Loading")}...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (error || !leaveSummary) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" color="error">
            {t("leaveSummary.errorLoading")}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const summaryItems = [
    {
      value: leaveSummary.annualQuota,
      titleKey: "leaveSummary.annualQuota",
      subtitleKey: "leaveSummary.totalDaysAllocated",
      color: "#2463eb",
      icon: <MdEventAvailable size={24} />,
    },
    {
      value: leaveSummary.takenLeaves,
      titleKey: "leaveSummary.takenLeaves",
      subtitleKey: "leaveSummary.alreadyConsumed",
      color: "#dc2625",
      icon: <GiTeapotLeaves size={24} />,
    },
    {
      value: leaveSummary.pendingLeaves,
      titleKey: "leaveSummary.pendingLeaves",
      subtitleKey: "leaveSummary.approvedYetToTake",
      color: "#5147e4",
      icon: <PiAirplaneInFlight size={24} />,
    },
    {
      value: leaveSummary.pendingApprovalLeaves,
      titleKey: "leaveSummary.pendingApproval",
      subtitleKey: "leaveSummary.awaitingApproval",
      color: "#d97708",
      icon: <MdHourglassEmpty size={24} />,
    },
    {
      value: leaveSummary.remainingLeaves,
      titleKey: "leaveSummary.remainingLeaves",
      subtitleKey: "leaveSummary.canBeTaken",
      color: "#079669",
      icon: <MdPendingActions size={24} />,
    },
  ];

  return (
    <Card sx={{ mb: 2 }} variant="outlined">
      <Stack p={3}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
            borderBottom: 1,
            borderColor: "divider",
            pb: 1,
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {user
                ? `${user.firstname} ${user.lastname}`
                : t("leaveSummary.title")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("leaveSummary.yearSummary", `Leave Summary`)} -{" "}
              {leaveSummary.year}
            </Typography>
          </Box>
        </Box>

        <Stack py={2}>
          <Grid container spacing={2}>
            {summaryItems.map((item, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 2.4 }} key={index}>
                <Card
                  variant="outlined"
                  sx={{
                    borderColor: item.color,
                    borderWidth: 1,
                    backgroundColor: lighten(item.color, 0.9),
                  }}
                >
                  <Box textAlign="center" py={3}>
                    <Box color={item.color}>{item.icon}</Box>
                    <Typography
                      variant="h1"
                      color={item.color}
                      fontWeight="bold"
                      sx={{
                        lineHeight: 1,
                        mt: 1,
                        mb: 1,
                      }}
                    >
                      {item.value}
                    </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1 }}>
                      {t(item.titleKey)}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {t(item.subtitleKey)}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Stack>
    </Card>
  );
};
