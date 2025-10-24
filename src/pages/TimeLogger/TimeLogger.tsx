import { Stack } from "@mui/material";
import { useEffect, useState, useCallback } from "react";
import { useMainLayout } from "../../context/main-layout-provider";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import useEmployee from "../../hooks/api/use-employee";
import TaskGridCard from "../../components/TaskGridCard";
import ProjectGridCard from "../../components/ProjectGridCard";
import useInternalTasks from "../../hooks/api/use-internal-tasks";
import { useProjects } from "../../hooks/api/use-project";
import TimeSheetHistory from "../../components/TimeSheetHistory/TimeSheetHistory";
import type { Project } from "../../types/user";
import {
  getUncoloredProjectsWithNewColors,
  type ProjectIdWithColor,
} from "../../utils/projectColorConfigs";
import { useUpdateProjectColors } from "../../hooks/api/use-admin-projects";

const TimeLogger = () => {
  const { userId } = useParams();
  const { setMainTitle, setBackLink } = useMainLayout();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: users } = useEmployee();
  const user = users?.find((u) => u.id === Number(userId));

  const { data: internalTasks, isLoading: isLoadingTasks } = useInternalTasks();
  const { data: projects, isLoading: isLoadingProjects } = useProjects();

  const [updatedProjectProjects, setUpdatedProjectProjects] = useState<
    Project[]
  >([]);

  const {
    mutateAsync: updateProjectColors,
    isPending: isUpdateProjectColorsPending,
  } = useUpdateProjectColors();

  const formattedTasks =
    internalTasks
      ?.filter((task) => task.isActive)
      ?.map((task) => ({
        id: task.id,
        name: task.name,
        isActive: task.isActive,
      })) || [];

  const updateProjectWithColors = async (
    updatedProjectColors: ProjectIdWithColor[],
    planableProjectWithColors: Project[]
  ) => {
    try {
      await updateProjectColors(
        {
          projctWithColors: updatedProjectColors,
        },
        {
          onSuccess: () => {
            setUpdatedProjectProjects(planableProjectWithColors);
          },
        }
      );
    } catch (_error) {
      console.error("Error updating project with colors:", _error);
    }
  };
  useEffect(() => {
    if (!projects || projects.length === 0) return;

    const updatedProjectColors = getUncoloredProjectsWithNewColors(projects);

    const planableProjectWithColors: Project[] = projects.map((project) => {
      const foundColor = updatedProjectColors.find(
        (p) => p.projectId === project.id
      )?.color;

      return {
        ...project,
        color: project.metadata?.color ?? foundColor,
      };
    });

    if (updatedProjectColors.length > 0) {
      updateProjectWithColors(updatedProjectColors, planableProjectWithColors);
    } else {
      setUpdatedProjectProjects(planableProjectWithColors);
    }
  }, [projects]);

  const activeProjects =
    updatedProjectProjects?.filter((project) => project.name) || [];

  const [lastActivity, setLastActivity] = useState(Date.now());

  const updateActivity = useCallback(() => {
    console.log("Activity detected");
    setLastActivity(Date.now());
  }, []);

  useEffect(() => {
    console.log("Setting up activity listeners");
    setLastActivity(Date.now());

    const events = [
      "mousemove",
      "mousedown",
      "keypress",
      "touchmove",
      "scroll",
    ];

    const wrappedUpdateActivity = (e: Event) => {
      console.log("Event triggered:", e.type);
      updateActivity();
    };

    events.forEach((event) =>
      window.addEventListener(event, wrappedUpdateActivity)
    );

    return () => {
      console.log("Cleaning up activity listeners");
      events.forEach((event) =>
        window.removeEventListener(event, wrappedUpdateActivity)
      );
    };
  }, [updateActivity]);

  useEffect(() => {
    const inactivityTimer = setInterval(() => {
      const currentTime = Date.now();
      const inactiveTime = currentTime - lastActivity;

      console.log("Checking inactivity:", { inactiveTime, threshold: 10000 });

      if (inactiveTime > 20000) {
        console.log("Inactive period detected, navigating to home");
        navigate("/");
      }
    }, 1000);

    return () => {
      clearInterval(inactivityTimer);
    };
  }, [lastActivity, navigate]);

  useEffect(() => {
    if (user) {
      setMainTitle(
        `${user.firstname} ${user.lastname} - ${t("timeLogger", "Time Logger")}`
      );
    } else {
      setMainTitle(t("timeLogger", "Time Logger"));
    }
    setBackLink(`/${userId}`);
    return () => {
      setMainTitle("");
      setBackLink(null);
    };
  }, [setMainTitle, t, user]);

  return (
    <Stack py={3} spacing={2}>
      <ProjectGridCard
        projects={activeProjects}
        isLoading={isLoadingProjects || isUpdateProjectColorsPending}
      />
      <TaskGridCard tasks={formattedTasks} isLoading={isLoadingTasks} />
      <TimeSheetHistory userId={userId!} />
    </Stack>
  );
};

export default TimeLogger;
