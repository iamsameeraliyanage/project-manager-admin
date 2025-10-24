import { Stack, Card, Button, Typography, CardContent } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { useEmployeeCumulativeProductivity } from "../../hooks/api/use-productivity";

interface ProductivityCardProps {
  userId: string;
  timeRange: "week" | "month";
  onTimeRangeChange: (range: "week" | "month") => void;
}

const ProductivityCard = ({
  userId,
  timeRange,
  onTimeRangeChange,
}: ProductivityCardProps) => {
  const { t } = useTranslation();

  const dateRange = useMemo(() => {
    const now = new Date();
    if (timeRange === "week") {
      const start = startOfWeek(now, { weekStartsOn: 1 });
      const end = endOfWeek(now, { weekStartsOn: 1 });
      const range = {
        startDate: format(start, "yyyy-MM-dd"),
        endDate: format(end, "yyyy-MM-dd"),
      };
      console.log("Cumulative week date range:", range);
      return range;
    } else {
      return {
        startDate: format(startOfMonth(now), "yyyy-MM-dd"),
        endDate: format(endOfMonth(now), "yyyy-MM-dd"),
      };
    }
  }, [timeRange]);

  const { data: productivity, isLoading } = useEmployeeCumulativeProductivity(
    Number(userId),
    dateRange.startDate,
    dateRange.endDate,
    {
      staleTime: 0,
      cacheTime: 0,
    }
  );

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" sx={{ mb: 3 }}>
          {t("cumulativeProductivity", "Cumulative Productivity")}
        </Typography>
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          sx={{ mb: 3 }}
        >
          <Stack width={"100%"} direction="row" spacing={1} alignItems="center">
            <Button
              variant={timeRange === "week" ? "contained" : "outlined"}
              size="medium"
              onClick={() => onTimeRangeChange("week")}
              color="primary"
              fullWidth
            >
              {t("this_week", "This Week")}
            </Button>
            <Button
              variant={timeRange === "month" ? "contained" : "outlined"}
              size="medium"
              onClick={() => onTimeRangeChange("month")}
              color="primary"
              fullWidth
            >
              {t("this_month", "This Month")}
            </Button>
          </Stack>
        </Stack>

        <Stack alignItems="center" spacing={1}>
          {isLoading ? (
            <Typography variant="body1">
              {t("loading", "Loading...")}
            </Typography>
          ) : (
            <>
              <Typography variant="h4" color="primary">
                {productivity !== undefined
                  ? `${(productivity * 100).toFixed(1)}%`
                  : "-"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {timeRange === "week"
                  ? t("weeklyAverage", "Weekly Average")
                  : t("monthlyAverage", "Monthly Average")}
              </Typography>
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProductivityCard;
