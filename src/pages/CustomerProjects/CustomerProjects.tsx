import { Container, Stack, Grid, type SelectChangeEvent } from "@mui/material";
import { useEffect, useState } from "react";
import { useMainLayout } from "../../context/main-layout-provider";
import { useTranslation } from "react-i18next";
import { useParams, useSearchParams } from "react-router-dom";
import useEmployee from "../../hooks/api/use-employee";
import TimeLogger from "./TimeLogger";
import ProductivityGraph from "./ProductivityGraph";
import ProductivityCard from "../InternalProjects/ProductivityCard";
import WorkedTimeGraph from "./WorkedTimeGraph";
import WorkPackageInfo from "./WorkPackageInfo";
import { ROUTES } from "../../routes/routes.config";

const CustomerProjects = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { userId } = useParams();
  const { setMainTitle, setBackLink } = useMainLayout();
  const { t } = useTranslation();

  const { data: users } = useEmployee();
  const user = users?.find((u) => u.id === Number(userId));

  // Get initial values from URL params
  const initialProject = searchParams.get("project") || "";
  const initialWorkPackage = searchParams.get("workpackage") || "";

  const [selectedProject, setSelectedProject] =
    useState<string>(initialProject);
  const [selectedWorkPackage, setSelectedWorkPackage] =
    useState<string>(initialWorkPackage);

  const [timeRange, setTimeRange] = useState<"week" | "month">("week");

  useEffect(() => {
    if (user) {
      setMainTitle(
        `${user.firstname} ${user.lastname} - ${t(
          "customerProjects",
          "Customer Projects"
        )}`
      );
    } else {
      setMainTitle(t("customerProjects", "Customer Projects"));
    }
    setBackLink(`/${userId}/${ROUTES.USER.TIME_LOGGER}`);

    return () => {
      setMainTitle("");
    };
  }, [setMainTitle, t, user]);

  const handleProjectChange = (e: SelectChangeEvent<string>) => {
    const newProjectId = e.target.value;
    setSelectedProject(newProjectId);
    setSelectedWorkPackage("");

    if (newProjectId) {
      setSearchParams({ project: newProjectId });
    } else {
      searchParams.delete("project");
      searchParams.delete("workpackage");
      setSearchParams(searchParams);
    }
  };

  const handleWorkPackageChange = (e: SelectChangeEvent<string>) => {
    const newWorkPackageId = e.target.value;
    setSelectedWorkPackage(newWorkPackageId);

    // Update URL params
    if (newWorkPackageId) {
      setSearchParams({
        project: selectedProject,
        workpackage: newWorkPackageId,
      });
    } else {
      searchParams.delete("workpackage");
      setSearchParams(searchParams);
    }
  };

  return (
    <Stack py={3} spacing={2}>
      <Stack py={1}>
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4, lg: 4, xl: 4 }}>
              <Stack spacing={2}>
                <TimeLogger
                  userId={userId!}
                  selectedProject={selectedProject}
                  selectedWorkPackage={selectedWorkPackage}
                  onProjectChange={handleProjectChange}
                  onWorkPackageChange={handleWorkPackageChange}
                />
                {selectedProject && selectedWorkPackage && (
                  <WorkPackageInfo
                    userId={userId!}
                    projectId={selectedProject}
                    workPackageId={selectedWorkPackage}
                  />
                )}
                <ProductivityCard
                  userId={userId!}
                  timeRange={timeRange}
                  onTimeRangeChange={setTimeRange}
                />
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 8, lg: 8, xl: 8 }}>
              <ProductivityGraph
                userId={userId!}
                timeRange={timeRange}
                onTimeRangeChange={setTimeRange}
              />
              <br />
              <WorkedTimeGraph
                userId={userId!}
                timeRange={timeRange}
                onTimeRangeChange={setTimeRange}
              />
            </Grid>
          </Grid>
        </Container>
      </Stack>
    </Stack>
  );
};

export default CustomerProjects;
