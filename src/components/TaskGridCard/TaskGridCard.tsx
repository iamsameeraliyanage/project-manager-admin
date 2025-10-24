import {
  Stack,
  Container,
  Card,
  Typography,
  Grid,
  CardActionArea,
  CardContent,
  Box,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import type { InternalTask } from "../../types/user";
import { ROUTES } from "../../routes/routes.config";
import {
  MdCleaningServices,
  MdAccountBalance,
  MdPeople,
  MdSupportAgent,
  MdInventory,
  MdLocalLaundryService,
  MdWorkspaces,
  MdHelpOutline,
} from "react-icons/md";
import type { ReactNode } from "react";

interface TaskGridCardProps {
  tasks?: InternalTask[];
  title?: string;
  isLoading?: boolean;
}

const TaskGridCard = ({
  tasks = [],
  title,
  isLoading = false,
}: TaskGridCardProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { userId } = useParams();

  const handleTaskClick = (taskId: number) => {
    if (userId) {
      navigate(`/${userId}/${ROUTES.USER.INTERNAL_PROJECTS}/${taskId}`);
    }
  };

  return (
    <Stack py={1}>
      <Container maxWidth="xl">
        <Card variant="outlined">
          <CardContent>
            <Box
              sx={{
                borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                pb: 2,
                mb: 3,
              }}
            >
              <Typography variant="h4">
                {title || t("internalTasks", "Internal Tasks")}
              </Typography>
            </Box>
            <Grid container spacing={2}>
              {isLoading
                ? Array.from(new Array(6)).map((_, index) => (
                    <Grid size={{ xs: 6, md: 4, lg: 3 }} key={index}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography
                            variant="subtitle1"
                            sx={{ visibility: "hidden" }}
                          >
                            Loading...
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
                : tasks.map((task) => (
                    <Grid size={{ xs: 6, md: 4, lg: 3 }} key={task.id}>
                      <Card variant="outlined">
                        <CardActionArea
                          onClick={() => handleTaskClick(task.id)}
                          sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            pb: 3,
                            pt: 5,
                          }}
                        >
                          <Box mb={1}>{getIconForTask(task.name)}</Box>
                          <Typography
                            variant="h6"
                            textAlign="center"
                            color="textSecondary"
                          >
                            {task.name}
                          </Typography>
                        </CardActionArea>
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

export default TaskGridCard;

const iconMap: { [key: string]: ReactNode } = {
  cleaning: <MdCleaningServices size={32} />,
  accounting: <MdAccountBalance size={32} />,
  hr: <MdPeople size={32} />,
  support: <MdSupportAgent size={32} />,
  inventar: <MdInventory size={32} />,
  laundry: <MdLocalLaundryService size={32} />,
  aufräumen: <MdWorkspaces size={32} />,
  waschen: <MdLocalLaundryService size={32} />,
};

const getIconForTask = (name: string): ReactNode => {
  const lower = name.toLowerCase();
  for (const key in iconMap) {
    if (lower.includes(key)) return iconMap[key];
  }
  return <MdHelpOutline size={32} />;
};
