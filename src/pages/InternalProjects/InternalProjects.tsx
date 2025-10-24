import { Container, Stack, Grid, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useMainLayout } from "../../context/main-layout-provider";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import useEmployee from "../../hooks/api/use-employee";
import TimeLogger from "./TimeLogger";
import ProductivityGraph from "../CustomerProjects/ProductivityGraph";
import ProductivityCard from "./ProductivityCard";
import WorkedTimeGraph from "../CustomerProjects/WorkedTimeGraph";

const InternalProjects = () => {
  const { userId } = useParams();
  const { setMainTitle, setBackLink } = useMainLayout();
  const { t } = useTranslation();

  const [timeRange, setTimeRange] = useState<"week" | "month">("week");

  const { data: users } = useEmployee();
  const user = users?.find((u) => u.id === Number(userId));

  useEffect(() => {
    if (user) {
      setMainTitle(
        `${user.firstname} ${user.lastname} - ${t(
          "internalTasks",
          "Internal Tasks"
        )}`
      );
    } else {
      setMainTitle(t("internalTasks", "Internal Tasks"));
    }
    setBackLink(`/${userId}`);
    return () => {
      setMainTitle("");
      setBackLink(null);
    };
  }, [setMainTitle, t, user]);

  return (
    <Stack pt={5} pb={3}>
      <Box>
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4, lg: 4, xl: 4 }}>
              <Stack spacing={2}>
                <TimeLogger userId={userId!} />
                <ProductivityCard
                  userId={userId!}
                  timeRange={timeRange}
                  onTimeRangeChange={setTimeRange}
                />
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 8, lg: 8, xl: 8 }}>
              <Stack spacing={2}>
                <ProductivityGraph
                  userId={userId!}
                  timeRange={timeRange}
                  onTimeRangeChange={setTimeRange}
                />
                <WorkedTimeGraph
                  userId={userId!}
                  timeRange={timeRange}
                  onTimeRangeChange={setTimeRange}
                />
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Stack>
  );
};

export default InternalProjects;
