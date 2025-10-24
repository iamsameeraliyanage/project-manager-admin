import {
  Stack,
  Container,
  Card,
  Typography,
  Grid,
  CardActionArea,
  CardContent,
  Box,
  lighten,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import type { Project } from "../../types/user";
import { ROUTES } from "../../routes/routes.config";
import { RiCaravanLine } from "react-icons/ri";
import { TbCarSuv } from "react-icons/tb";
import { PiCarProfileBold } from "react-icons/pi";
import { HiOutlineTruck } from "react-icons/hi";
import { LiaTruckMonsterSolid } from "react-icons/lia";
import { BsTruckFlatbed } from "react-icons/bs";
import { TbBus } from "react-icons/tb";
import { LiaTrainSolid } from "react-icons/lia";
import { LuCableCar } from "react-icons/lu";
import { TbWheel } from "react-icons/tb";
import { LiaShuttleVanSolid } from "react-icons/lia";
import { PiTruckTrailer } from "react-icons/pi";
import { PiFireTruck } from "react-icons/pi";
import { TbFiretruck } from "react-icons/tb";

interface ProjectGridCardProps {
  projects?: Project[];
  title?: string;
  isLoading?: boolean;
}

const ProjectGridCard = ({
  projects = [],
  title,
  isLoading = false,
}: ProjectGridCardProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { userId } = useParams();

  const handleProjectClick = (projectId: number) => {
    if (userId) {
      navigate(
        `/${userId}/${ROUTES.USER.CUSTOMER_PROJECTS}?${ROUTES.PARAMS.PROJECT}=${projectId}`
      );
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
                {title || t("customerProjects", "Customer Projects")}
              </Typography>
            </Box>

            <Grid container spacing={2}>
              {isLoading
                ? Array.from(new Array(6)).map((_, index) => (
                    <Grid size={{ xs: 6, md: 4, lg: 3 }} key={index}>
                      <Card variant="outlined" sx={{ height: "100%" }}>
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
                : projects.map((project, index) => (
                    <Grid size={{ xs: 6, md: 4, lg: 3 }} key={project.id}>
                      <Card
                        variant="outlined"
                        sx={{
                          height: "100%",
                          backgroundColor: lighten(
                            project.metadata?.color || "#ffffff",
                            0.95
                          ),
                        }}
                      >
                        <CardActionArea
                          onClick={() => handleProjectClick(project.id)}
                          sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Box mb={1}>
                            {getRandomIconFromList(
                              index,
                              project.metadata?.color
                            )}
                          </Box>
                          <Typography variant="body1" textAlign="center">
                            {project.name}
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

export default ProjectGridCard;

const getRandomIconFromList = (index: number, color?: string) => {
  const list = [
    <RiCaravanLine fontSize={28} color={color} />,
    <TbCarSuv fontSize={28} color={color} />,
    <PiCarProfileBold fontSize={28} color={color} />,
    <HiOutlineTruck fontSize={28} color={color} />,
    <LiaTruckMonsterSolid fontSize={28} color={color} />,
    <BsTruckFlatbed fontSize={28} color={color} />,
    <TbBus fontSize={28} color={color} />,
    <LiaTrainSolid fontSize={28} color={color} />,
    <LuCableCar fontSize={28} color={color} />,
    <TbWheel fontSize={28} color={color} />,
    <LiaShuttleVanSolid fontSize={28} color={color} />,
    <PiTruckTrailer fontSize={28} color={color} />,
    <PiFireTruck fontSize={28} color={color} />,
    <TbFiretruck fontSize={28} color={color} />,
  ];
  return list[index % list.length];
};
