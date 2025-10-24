import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Stack,
  LinearProgress,
  Chip,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import Card from "../Card/Card";
import { useKPIData } from "../../hooks/api/use-finance";

const ProjectProgressChart = () => {
  const { t } = useTranslation();
  const { data: kpiData, isLoading, error } = useKPIData();

  const activeProjects =
    kpiData?.filter((project) => {
      // Project is active if status is 'Active'
      return project.state === "active";
    }) || [];

  const allChartData = activeProjects
    .sort((a, b) => (b.estimated_hours || 0) - (a.estimated_hours || 0))
    .map((project) => ({
      name: project.name || `Project ${project.nr || project.id}`,
      shortName:
        (project.name || `P${project.nr || project.id}`).length > 25
          ? (project.name || `P${project.nr || project.id}`).substring(0, 25) +
            "..."
          : project.name || `P${project.nr || project.id}`,
      actualProgress: Math.min(
        Math.round((project.overallProgress || 0) * 10) / 10,
        100
      ),
      expectedProgress: Math.min(
        Math.round((project.targetProgress || 0) * 10) / 10,
        100
      ),
      estimatedHours: project.estimated_hours || 0,
      spentHours: project.spentHours || 0,
      status: getProjectStatus(
        project.overallProgress || 0,
        project.targetProgress || 0
      ),
    }));

  // Function to determine project status
  function getProjectStatus(
    actual: number,
    expected: number
  ): "onTrack" | "atRisk" | "behind" {
    const diff = actual - expected;
    if (diff >= 0) return "onTrack";
    if (diff >= -10) return "atRisk";
    return "behind";
  }

  // Function to get color based on status
  function getProgressColor(status: "onTrack" | "atRisk" | "behind"): string {
    switch (status) {
      case "onTrack":
        return "#4caf50";
      case "atRisk":
        return "#ff9800";
      case "behind":
        return "#f44336";
      default:
        return "#1976d2";
    }
  }

  if (isLoading) {
    return (
      <Card fullHeight>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
        >
          <CircularProgress />
        </Box>
      </Card>
    );
  }

  if (error) {
    return (
      <Card fullHeight>
        <Alert severity="error">
          {t("errorLoadingProjectData", "Error loading project data")}
        </Alert>
      </Card>
    );
  }

  if (!kpiData || kpiData.length === 0) {
    return (
      <Card fullHeight>
        <Alert severity="info">
          {t("noProjectDataAvailable", "No project data available")}
        </Alert>
      </Card>
    );
  }

  return (
    <Card sx={{ minHeight: 400 }} fullHeight>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5" color="primary">
          {t("activeProjectProgressOverview", "Active Project Progress")}
        </Typography>
        <Chip
          label={`${allChartData.length}`}
          color="secondary"
          size="small"
          sx={{ minWidth: 40, height: 24 }}
        />
      </Box>

      <Box sx={{ minHeight: 320 }}>
        <Stack spacing={1.5}>
          {allChartData.map((project, index) => {
            return (
              <Box
                key={`${index}`}
                sx={{
                  animation: "fadeIn 0.5s ease-in-out",
                  "@keyframes fadeIn": {
                    "0%": {
                      opacity: 0,
                    },
                    "100%": {
                      opacity: 1,
                    },
                  },
                }}
              >
                <Box mb={0.5}>
                  <Typography
                    variant="body2"
                    fontWeight="600"
                    sx={{
                      fontSize: "0.9rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {project.shortName}
                  </Typography>
                </Box>

                <Box position="relative">
                  <LinearProgress
                    variant="determinate"
                    value={project.actualProgress}
                    sx={{
                      height: 12,
                      borderRadius: 1,
                      backgroundColor: "#e0e0e0",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: getProgressColor(project.status),
                        borderRadius: 1,
                      },
                    }}
                  />
                  <Box
                    position="absolute"
                    left={`${project.expectedProgress}%`}
                    top={0}
                    bottom={0}
                    sx={{
                      width: 2,
                      backgroundColor: "#333",
                      transform: "translateX(-50%)",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        top: -6,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 0,
                        height: 0,
                        borderLeft: "4px solid transparent",
                        borderRight: "4px solid transparent",
                        borderTop: "6px solid #333",
                      },
                    }}
                  />
                </Box>

                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mt={0.5}
                >
                  <Box display="flex" gap={2}>
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: "0.75rem" }}
                      >
                        {t("expected", "Expected")}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        fontWeight="bold"
                        sx={{ fontSize: "0.95rem" }}
                      >
                        {project.expectedProgress}%
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: "0.75rem" }}
                      >
                        {t("actual", "Actual")}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        fontWeight="bold"
                        color={getProgressColor(project.status)}
                        sx={{ fontSize: "0.95rem" }}
                      >
                        {project.actualProgress}%
                      </Typography>
                    </Box>
                  </Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: "0.7rem" }}
                  >
                    {project.spentHours}/{project.estimatedHours}h
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Stack>
      </Box>
    </Card>
  );
};

export default ProjectProgressChart;
