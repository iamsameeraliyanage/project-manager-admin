import {
  Container,
  Stack,
  Card,
  Typography,
  CircularProgress,
  Button,
  Grid,
  CardContent,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback, type ReactNode } from "react";
import { useMainLayout } from "../../context/main-layout-provider";
import useEmployee from "../../hooks/api/use-employee";
import { useTranslation } from "react-i18next";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const UserDetailCard = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  };

  return (
    <Stack py={2}>
      <Container maxWidth="xl">
        <Card variant="outlined">
          <Stack p={2}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
              sx={{ alignSelf: "flex-start", mb: 1 }}
            >
              {t("back", "Back")}
            </Button>
            {children}
          </Stack>
        </Card>
      </Container>
    </Stack>
  );
};

const CustomProjectCard = () => {
  const { t } = useTranslation();

  return (
    <Stack py={1}>
      <Container maxWidth="xl">
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h5" align="center">
              {t("customProjects", "Custom Projects")}
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Stack>
  );
};

const TaskGridCard = () => {
  const { t } = useTranslation();

  // Sample predefined tasks - in a real app, these might come from an API
  const tasks = [
    { id: 1, title: "Project Planning", status: "In Progress" },
    { id: 2, title: "Client Meeting", status: "Completed" },
    { id: 3, title: "Documentation", status: "Pending" },
    { id: 4, title: "Code Review", status: "In Progress" },
    { id: 5, title: "Testing", status: "Pending" },
    { id: 6, title: "Deployment", status: "Pending" },
  ];

  return (
    <Stack py={1}>
      <Container maxWidth="xl">
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h5" align="center" mb={3}>
              {t("internalTasks", "Internal Tasks")}
            </Typography>

            <Grid container spacing={2}>
              {tasks?.map((task) => (
                <Grid size={{ xs: 6, md: 4, lg: 3 }} key={task.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1">{task.title}</Typography>
                      <Typography
                        variant="body2"
                        color={
                          task.status === "Completed"
                            ? "success.main"
                            : task.status === "In Progress"
                              ? "secondary.main"
                              : "text.secondary"
                        }
                      >
                        {task.status}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </Stack>
  );
};

const UserDetail = () => {
  const { userId } = useParams();
  const { setMainTitle } = useMainLayout();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [lastActivity, setLastActivity] = useState(Date.now());

  const { data: users, isLoading, error } = useEmployee();

  const user = users?.find((u) => u.id === Number(userId));

  const updateActivity = useCallback(() => {
    setLastActivity(Date.now());
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", updateActivity);
    window.addEventListener("mousedown", updateActivity);
    window.addEventListener("keypress", updateActivity);
    window.addEventListener("touchmove", updateActivity);
    window.addEventListener("scroll", updateActivity);

    return () => {
      window.removeEventListener("mousemove", updateActivity);
      window.removeEventListener("mousedown", updateActivity);
      window.removeEventListener("keypress", updateActivity);
      window.removeEventListener("touchmove", updateActivity);
      window.removeEventListener("scroll", updateActivity);
    };
  }, [updateActivity]);

  useEffect(() => {
    const inactivityTimer = setInterval(() => {
      const currentTime = Date.now();
      const inactiveTime = currentTime - lastActivity;

      if (inactiveTime > 20000) {
        navigate("/");
      }
    }, 1000);

    return () => {
      clearInterval(inactivityTimer);
    };
  }, [lastActivity, navigate]);

  useEffect(() => {
    if (user) {
      setMainTitle(`${user.firstname} ${user.lastname}`);
    } else {
      setMainTitle(t("userDetails", "User Details"));
    }

    return () => {
      setMainTitle("");
    };
  }, [user, setMainTitle, t]);

  if (isLoading) {
    return (
      <UserDetailCard>
        <Stack alignItems="center" justifyContent="center">
          <CircularProgress />
          <Typography mt={2}>
            {t("loadingUserDetails", "Loading user details...")}
          </Typography>
        </Stack>
      </UserDetailCard>
    );
  }

  if (error) {
    return (
      <UserDetailCard>
        <Typography variant="h5" color="error">
          {t("error", "Error")}
        </Typography>
        <Typography>
          {error.message ||
            t("failedToFetchUserDetails", "Failed to fetch user details")}
        </Typography>
      </UserDetailCard>
    );
  }

  if (!user) {
    return (
      <UserDetailCard>
        <Typography variant="h5" color="error">
          {t("userNotFound", "User Not Found")}
        </Typography>
        <Typography>
          {t("requestedUserNotFound", "The requested user could not be found.")}
        </Typography>
      </UserDetailCard>
    );
  }

  return (
    <>
      <UserDetailCard>
        <></>
      </UserDetailCard>
      <CustomProjectCard />
      <TaskGridCard />
    </>
  );
};

export default UserDetail;
