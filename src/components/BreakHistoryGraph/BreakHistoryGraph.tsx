import {
  Card,
  Stack,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  useDailyEmployeeBreaks,
  useEmployeeLastBreak,
} from "../../hooks/api/use-employee-break";
import { useMemo, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  format,
  eachDayOfInterval,
} from "date-fns";

interface BreakHistoryGraphProps {
  userId: number;
  timeRange: "week" | "month";
  onTimeRangeChange: (range: "week" | "month") => void;
}

const BreakHistoryGraph = ({
  userId,
  timeRange,
  onTimeRangeChange,
}: BreakHistoryGraphProps) => {
  const { t } = useTranslation();

  const dateRange = useMemo(() => {
    const now = new Date();
    if (timeRange === "week") {
      const start = startOfWeek(now, { weekStartsOn: 1 });
      const end = endOfWeek(now, { weekStartsOn: 1 });
      return {
        startDate: format(start, "yyyy-MM-dd"),
        endDate: format(end, "yyyy-MM-dd"),
        start,
        end,
      };
    } else {
      const start = startOfMonth(now);
      const end = endOfMonth(now);
      return {
        startDate: format(start, "yyyy-MM-dd"),
        endDate: format(end, "yyyy-MM-dd"),
        start,
        end,
      };
    }
  }, [timeRange]);

  const { data: breakData, refetch: refetchBreakData } = useDailyEmployeeBreaks(
    userId,
    dateRange.startDate,
    dateRange.endDate
  );
  const { data: lastBreak } = useEmployeeLastBreak(userId);

  // Refresh data every 30 seconds when there's an active break to show real-time updates
  useEffect(() => {
    if (lastBreak && !lastBreak.endTime) {
      const interval = setInterval(() => {
        refetchBreakData();
      }, 30000); // Refresh every 30 seconds for active breaks

      return () => clearInterval(interval);
    }
  }, [lastBreak, refetchBreakData]);

  const chartData = useMemo(() => {
    const allDates = eachDayOfInterval({
      start: dateRange.start,
      end: dateRange.end,
    });

    const breakMap = new Map<string, number>();
    if (breakData) {
      breakData.forEach((item) => {
        // Convert UTC date to local date by adding the timezone offset
        const utcDate = new Date(item.breakDate);
        console.log(item.breakDate);
        const localDate = new Date(
          utcDate.getTime() + utcDate.getTimezoneOffset() * 60000
        );
        console.log(localDate);
        const dateKey = format(localDate, "yyyy-MM-dd");
        console.log(dateKey);
        breakMap.set(dateKey, item.totalDurationMinutes);
      });
    }

    // Generate chart data for all dates in range
    return allDates.map((date) => {
      const dateKey = format(date, "yyyy-MM-dd");
      return {
        day: timeRange === "week" ? format(date, "EEE") : format(date, "d"),
        minutes: breakMap.get(dateKey) || 0,
        fullDate: dateKey,
      };
    });
  }, [breakData, timeRange, dateRange]);

  return (
    <Card variant="outlined">
      <Stack p={4} spacing={3}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h5">
            {t("breakHistory", "Break History")}
          </Typography>
          <ToggleButtonGroup
            value={timeRange}
            exclusive
            onChange={(_, value) => value && onTimeRangeChange(value)}
            size="small"
          >
            <ToggleButton value="week">{t("week", "Week")}</ToggleButton>
            <ToggleButton value="month">{t("month", "Month")}</ToggleButton>
          </ToggleButtonGroup>
        </Stack>

        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis
                label={{
                  value: t("minutes", "Minutes"),
                  angle: -90,
                  position: "insideLeft",
                }}
                domain={[0, 30]}
              />
              <Tooltip
                labelFormatter={(value, data) => {
                  if (!data || !data[0] || !data[0].payload) {
                    return value;
                  }
                  // Parse the date string as local date to avoid timezone issues
                  const dateStr = data[0].payload.fullDate;
                  const [year, month, day] = dateStr.split('-').map(Number);
                  const localDate = new Date(year, month - 1, day);
                  return format(localDate, "PPP");
                }}
                formatter={(value) => [
                  `${value} ${t("minutes", "Minutes")}`,
                  t("breakDuration", "Break Duration"),
                ]}
              />
              <Bar dataKey="minutes" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Stack>
    </Card>
  );
};

export default BreakHistoryGraph;
