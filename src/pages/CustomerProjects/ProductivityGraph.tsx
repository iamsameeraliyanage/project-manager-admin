import { Stack, Card, Button, Typography } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTranslation } from "react-i18next";
import { useEmployeeProductivity } from "../../hooks/api/use-productivity";
import { useMemo } from "react";
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";

interface ProductivityGraphProps {
  userId: string;
  timeRange: "week" | "month";
  onTimeRangeChange: (range: "week" | "month") => void;
}

const ProductivityGraph = ({
  userId,
  timeRange,
  onTimeRangeChange,
}: ProductivityGraphProps) => {
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
      console.log("Week date range:", range);
      return range;
    } else {
      return {
        startDate: format(startOfMonth(now), "yyyy-MM-dd"),
        endDate: format(endOfMonth(now), "yyyy-MM-dd"),
      };
    }
  }, [timeRange]);

  const { data: productivityData } = useEmployeeProductivity(
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
      productivity: item.productivity
        ? (item.productivity * 100).toFixed(1)
        : null,
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
            {t("productivityGraph", "Productivity Graph")}
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
                value: t("productivity", "Productivity (%)"),
                angle: -90,
                position: "left",
                offset: 5,
              }}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              formatter={(value) => [
                `${value}%`,
                t("productivity", "Productivity"),
              ]}
            />
            <Bar dataKey="productivity" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Stack>
    </Card>
  );
};

export default ProductivityGraph;
