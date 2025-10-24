import { Card, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useWorkPackageById } from "../../hooks/api/use-project";

interface WorkPackageInfoProps {
  userId: string;
  projectId: string;
  workPackageId: string;
}

const WorkPackageInfo = ({
  userId,
  projectId,
  workPackageId,
}: WorkPackageInfoProps) => {
  const { t } = useTranslation();

  const { data: workPackage } = useWorkPackageById(
    Number(projectId),
    Number(workPackageId),
    Number(userId),
    true,
    {
      enabled: Boolean(projectId && workPackageId),
    }
  );

  if (!workPackage) return null;

  const plannedHours = workPackage.estimated_time_in_hours;
  const spentHours =
    Math.round(((workPackage.spentMinutes || 0) / 60) * 10) / 10;
  const remainingHours = plannedHours - spentHours;
  const isNegative = remainingHours < 0;

  return (
    <Card variant="outlined">
      <Stack p={2} spacing={1}>
        <Typography variant="h6" gutterBottom>
          {t("workPackageInfo", "Work Package Information")}
        </Typography>

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body1">
            {t("plannedTime", "Planned Time")}:
          </Typography>
          <Typography variant="body1">{plannedHours.toFixed(2)} h</Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body1">
            {t("spentTime", "Spent Time")}:
          </Typography>
          <Typography variant="body1">{spentHours.toFixed(2)} h</Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body1">
            {t("remainingTime", "Remaining Time")}:
          </Typography>
          <Typography
            variant="body1"
            color={isNegative ? "error" : "success.main"}
            fontWeight="bold"
          >
            {remainingHours.toFixed(2)} h
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
};

export default WorkPackageInfo;
