import { Stack, Card, Button, Typography } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useTranslation } from "react-i18next";
import { useEmployeeDailyProductivity } from "../../hooks/api/use-daily-productivity";
import { useMemo } from "react";
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";

interface WorkedTimeGraphProps {
  userId: string;
  timeRange: "week" | "month";
  onTimeRangeChange: (range: "week" | "month") => void;
}

const WorkedTimeGraph = ({
  userId,
  timeRange,
  onTimeRangeChange,
}: WorkedTimeGraphProps) => {
  const { t } = useTranslation();

  const dateRange = useMemo(() => {
    const now = new Date();
    if (timeRange === "week") {
      const start = startOfWeek(now, { weekStartsOn: 1 });
      const end = endOfWeek(now, { weekStartsOn: 1 });
      return {
        startDate: format(start, "yyyy-MM-dd"),
        endDate: format(end, "yyyy-MM-dd"),
      };
    } else {
      return {
        startDate: format(startOfMonth(now), "yyyy-MM-dd"),
        endDate: format(endOfMonth(now), "yyyy-MM-dd"),
      };
    }
  }, [timeRange]);

  const { data: productivityData } = useEmployeeDailyProductivity(
    {
      employeeId: Number(userId),
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    },
    {
      staleTime: 0,
      cacheTime: 0,
    }
  );

  const chartData = useMemo(() => {
    if (!productivityData) return [];

    return productivityData.map((item) => ({
      day:
        timeRange === "week"
          ? format(new Date(item.date), "EEE")
          : format(new Date(item.date), "d"),
      productiveHours: Math.round((item.productiveMinutes / 60) * 10) / 10,
      unproductiveHours: Math.round((item.unproductiveMinutes / 60) * 10) / 10,
    }));
  }, [productivityData, timeRange]);

  return (
    <Card variant="outlined">
      <Stack p={2} spacing={2}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">
            {t("workedTimeGraph", "Worked Time")}
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button
              variant={timeRange === "week" ? "contained" : "outlined"}
              size="small"
              onClick={() => onTimeRangeChange("week")}
              color="primary"
            >
              {t("this_week", "This Week")}
            </Button>
            <Button
              variant={timeRange === "month" ? "contained" : "outlined"}
              size="small"
              onClick={() => onTimeRangeChange("month")}
              color="primary"
            >
              {t("this_month", "This Month")}
            </Button>
          </Stack>
        </Stack>

        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 30,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="day"
              domain={
                timeRange === "week"
                  ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
                  : undefined
              }
              type={timeRange === "week" ? "category" : "category"}
              label={{
                value:
                  timeRange === "week"
                    ? t("day_of_week", "Day of Week")
                    : t("day_of_month", "Day of Month"),
                position: "bottom",
                offset: 15,
              }}
            />
            <YAxis
              label={{
                value: t("hours", "Hours"),
                angle: -90,
                position: "left",
                offset: 5,
              }}
            />
            <Tooltip
              formatter={(value, name) => {
                // Convert value to hours and minutes format
                const hours = Math.floor(Number(value));
                const minutes = Math.round((Number(value) - hours) * 60);
                return [`${hours}h ${minutes}m`, name];
              }}
            />
            <Legend />
            <Bar
              dataKey="productiveHours"
              stackId="a"
              name={t("productive_time", "Productive Time")}
              fill="#3f51b5"
            />
            <Bar
              dataKey="unproductiveHours"
              stackId="a"
              name={t("unproductive_time", "Unproductive Time")}
              fill="#9c27b0"
            />
          </BarChart>
        </ResponsiveContainer>
      </Stack>
    </Card>
  );
};

export default WorkedTimeGraph;
