import {
  Container,
  Card,
  Typography,
  Box,
  Grid,
  CardActionArea,
} from "@mui/material";
import { useEffect } from "react";
import { useMainLayout } from "../../context/main-layout-provider";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import useEmployee from "../../hooks/api/use-employee";
import { ROUTES } from "../../routes/routes.config";
import { useMutation } from "@tanstack/react-query";
import { autoEndEmployeeBreakQueryFn } from "../../services/api";
import { FaRegCalendarAlt } from "react-icons/fa";
import { LuTimer } from "react-icons/lu";
import { BsCupHot } from "react-icons/bs";
import { VscSignOut } from "react-icons/vsc";

const HomeCard = ({
  title,
  icon,
  color,
  onClick,
  description,
}: {
  title: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
  description: string;
}) => {
  return (
    <Card variant="outlined">
      <CardActionArea
        onClick={onClick}
        sx={{
          px: 4,
          py: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            mb: 2,
            color,
            fontSize: 52,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </Box>
        <Box mb={1}>
          <Typography variant="h3" align="center">
            {title}
          </Typography>
        </Box>
        <Box>
          <Typography variant="body1" align="center" color="textSecondary">
            {description}
          </Typography>
        </Box>
      </CardActionArea>
    </Card>
  );
};

const UserHome = () => {
  const { setMainTitle, setBackLink } = useMainLayout();
  const { t } = useTranslation();
  const { userId } = useParams();
  const navigate = useNavigate();

  const { data: users } = useEmployee();
  const user = users?.find((u) => u.id === Number(userId));

  const autoEndBreakMutation = useMutation({
    mutationFn: autoEndEmployeeBreakQueryFn,
    onSuccess: (data) => {
      if (data.autoEnded) {
        console.log(
          "Break was automatically ended due to exceeding 30 minutes"
        );
        // You can add a toast notification here if needed
      }
    },
    onError: (error) => {
      console.error("Error checking/ending break:", error);
    },
  });

  useEffect(() => {
    if (user) {
      setMainTitle(
        `${user.firstname} ${user.lastname} - ${t("userHome", "User Home")}`
      );
    } else {
      setMainTitle(t("userHome", "User Home"));
    }
    setBackLink(`/`);

    return () => {
      setMainTitle("");
      setBackLink(null);
    };
  }, [setMainTitle, t, user]);

  // Auto-end break if it exceeds 30 minutes when user home loads
  useEffect(() => {
    if (userId && user) {
      autoEndBreakMutation.mutate(Number(userId));
    }
  }, [userId, user]);

  const handleNavigation = (path: string) => {
    navigate(`/${userId}/${path}`);
  };

  const userCards = [
    {
      title: t("timeLogger", "Time Logger"),
      icon: <LuTimer />,
      color: "#009cc8",
      onClick: () => handleNavigation(ROUTES.USER.TIME_LOGGER),
      description: t(
        "timeLoggerDescription",
        "Track your work hours efficiently"
      ),
    },
    {
      title: t("break", "Break"),
      icon: <BsCupHot />,
      color: "#f59e0b",
      onClick: () => handleNavigation(ROUTES.USER.BREAK),
      description: t("breakDescription", "Take a well-deserved break"),
    },
    {
      title: t("calendar", "Calendar"),
      icon: <FaRegCalendarAlt />,
      color: "#10b981",
      onClick: () => handleNavigation(ROUTES.USER.CALENDAR),
      description: t("calendarDescription", "View your schedule and events"),
    },
    {
      title: t("signOff", "Sign Off"),
      icon: <VscSignOut />,
      color: "#ef4444",
      onClick: () => handleNavigation(ROUTES.USER.SIGN_OFF),
      description: t("signOffDescription", "End your session securely"),
    },
  ];

  return (
    <Box pt={5} pb={3} gap={2}>
      <Container maxWidth="xl">
        <Grid container spacing={2}>
          {userCards.map((card, index) => (
            <Grid key={index} size={{ xs: 12, md: 6 }}>
              <HomeCard
                title={card.title}
                icon={card.icon}
                color={card.color}
                onClick={card.onClick}
                description={card.description}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default UserHome;
