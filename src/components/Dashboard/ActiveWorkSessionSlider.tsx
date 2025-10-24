import type { DashboardActiveSession } from "../../hooks/api/use-dashboard-active-sessions";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import Card from "../Card/Card";

import { Box, Typography, Chip, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  FiClock,
  FiUser,
  FiBriefcase,
  FiPackage,
  FiTool,
  FiCoffee,
} from "react-icons/fi";
import { formatDistanceToNow } from "date-fns";

const ActiveWorkSessionSlider = ({
  currentSessions,
}: {
  currentSessions: DashboardActiveSession[];
}) => {
  const { t } = useTranslation();
  const iconSizeRem = "0.9rem";

  return (
    <Box data-id="active-work-sessions">
      <Swiper
        modules={[Autoplay]}
        spaceBetween={10}
        slidesPerView={5}
        autoplay={{
          delay: 5000, // 5 seconds
          disableOnInteraction: false,
        }}
        loop
      >
        {currentSessions.map((session) => {
          const employeeName = session.employee
            ? `${session.employee.firstname} ${session.employee.lastname}`
            : "Unknown Employee";
          const duration = formatDistanceToNow(new Date(session.startTime), {
            addSuffix: false,
          });

          // Determine session type details
          const getSessionDetails = () => {
            switch (session.type) {
              case "project":
                return {
                  typeIcon: <FiBriefcase size={iconSizeRem} color="#1976d2" />,
                  typeLabel: t("project", "Project"),
                  primaryText: session.projectName,
                  secondaryText: session.packageName,
                  secondaryIcon: <FiPackage size={iconSizeRem} color="#666" />,
                  backgroundColor: session.isOnBreak
                    ? "warning.light"
                    : "primary.light",
                };
              case "internal":
                return {
                  typeIcon: <FiTool size={iconSizeRem} color="#ff9800" />,
                  typeLabel: t("internalTask", "Internal Task"),
                  primaryText:
                    session.internalTaskName ||
                    t("unnamedTask", "Unnamed Task"),
                  secondaryText:
                    session.comment || t("noComment", "No comment"),
                  secondaryIcon: <FiTool size={iconSizeRem} color="#666" />,
                  backgroundColor: session.isOnBreak
                    ? "warning.light"
                    : "info.light",
                };
              default:
                return {
                  typeIcon: <FiBriefcase size={iconSizeRem} color="#666" />,
                  typeLabel: t("unknown", "Unknown"),
                  primaryText: t("unknownSession", "Unknown Session"),
                  secondaryText: "",
                  secondaryIcon: (
                    <FiBriefcase size={iconSizeRem} color="#666" />
                  ),
                  backgroundColor: "grey.300",
                };
            }
          };

          const sessionDetails = getSessionDetails();
          return (
            <SwiperSlide key={session.id}>
              <Card
                fullHeight
                padding={"sm"}
                sx={{
                  transition: "all 0.2s",
                  "&:hover": {
                    boxShadow: 2,
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <Stack>
                  {/* Employee Name */}
                  <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                    <FiUser size={"1rem"} color="#1976d2" />
                    <Typography variant="subtitle2" fontWeight="bold" noWrap>
                      {employeeName}
                    </Typography>
                  </Box>

                  {/* Session Type */}
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    {sessionDetails.typeIcon}
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight="medium"
                    >
                      {sessionDetails.typeLabel}
                    </Typography>
                    {session.isOnBreak && (
                      <Chip
                        icon={<FiCoffee size={12} />}
                        label={t("onBreak", "On Break")}
                        size="small"
                        color="warning"
                        variant="outlined"
                      />
                    )}
                  </Box>

                  {/* Primary Content */}
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {sessionDetails.primaryText}
                    </Typography>
                  </Box>

                  {/* Secondary Content */}
                  {sessionDetails.secondaryText && (
                    <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                      <Box>{sessionDetails.secondaryIcon}</Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        noWrap
                      >
                        {sessionDetails.secondaryText}
                      </Typography>
                    </Box>
                  )}

                  {/* Duration */}
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                    sx={{
                      bgcolor: sessionDetails.backgroundColor,
                      color: "white",
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      mt: "auto",
                    }}
                  >
                    <FiClock size={iconSizeRem} />
                    <Typography
                      variant="caption"
                      fontWeight="medium"
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {duration}
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </Box>
  );
};

export default ActiveWorkSessionSlider;
