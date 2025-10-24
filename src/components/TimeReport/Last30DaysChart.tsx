import { Card, CardContent, Typography, Box, Chip, useTheme } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useTranslation } from "react-i18next";
import dayjs from "../../utils/dayjs";
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";

interface Last30DaysChartProps {
  data: {
    date: string;
    hoursWorked: number;
    overtime: number;
    undertime: number;
    isWeekend: boolean;
    isHoliday: boolean;
    leaveType?: string;
  }[];
  totalHours: number;
  averageHoursPerDay: number;
  overtimeHours: number;
  undertimeHours: number;
}

const Last30DaysChart = ({
  data,
  totalHours,
  averageHoursPerDay,
  overtimeHours,
  undertimeHours,
}: Last30DaysChartProps) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const formatDate = (dateStr: string) => {
    return dayjs(dateStr).format("MMM DD");
  };

  const getBarColor = (entry: any) => {
    if (entry.isWeekend) return theme.palette.grey[400];
    if (entry.isHoliday) return theme.palette.warning.main;
    if (entry.leaveType) return theme.palette.info.main;
    if (entry.hoursWorked > 8.4) return theme.palette.success.main;
    if (entry.hoursWorked < 8.4 && entry.hoursWorked > 0) return theme.palette.warning.main;
    return theme.palette.primary.main;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Card sx={{ p: 1 }}>
          <Typography variant="body2" fontWeight="bold">
            {dayjs(label).format("MMMM DD, YYYY")}
          </Typography>
          <Typography variant="body2">
            {t("hoursWorked", "Hours Worked")}: {data.hoursWorked.toFixed(1)}h
          </Typography>
          {data.overtime > 0 && (
            <Typography variant="body2" color="success.main">
              {t("overtime", "Overtime")}: +{data.overtime.toFixed(1)}h
            </Typography>
          )}
          {data.undertime > 0 && (
            <Typography variant="body2" color="warning.main">
              {t("undertime", "Undertime")}: -{data.undertime.toFixed(1)}h
            </Typography>
          )}
          {data.isWeekend && (
            <Chip
              label={t("weekend", "Weekend")}
              size="small"
              sx={{ mt: 0.5 }}
            />
          )}
          {data.isHoliday && (
            <Chip
              label={t("holiday", "Holiday")}
              size="small"
              color="warning"
              sx={{ mt: 0.5 }}
            />
          )}
          {data.leaveType && (
            <Chip
              label={data.leaveType}
              size="small"
              color="info"
              sx={{ mt: 0.5 }}
            />
          )}
        </Card>
      );
    }
    return null;
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
          <Box display="flex" alignItems="center" gap={2}>
            <ScheduleIcon color="primary" />
            <Typography variant="h6">
              {t("last30DaysBreakdown", "Last 30 Days Breakdown")}
            </Typography>
          </Box>
          <Box display="flex" gap={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="body2" color="text.secondary">
                {t("totalHours", "Total")}:
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {totalHours.toFixed(1)}h
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="body2" color="text.secondary">
                {t("average", "Average")}:
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {averageHoursPerDay.toFixed(1)}h/day
              </Typography>
            </Box>
            {overtimeHours > 0 && (
              <Chip
                icon={<TrendingUpIcon />}
                label={`+${overtimeHours.toFixed(1)}h ${t("overtime", "Overtime")}`}
                color="success"
                size="small"
              />
            )}
            {undertimeHours > 0 && (
              <Chip
                icon={<TrendingDownIcon />}
                label={`-${undertimeHours.toFixed(1)}h ${t("undertime", "Undertime")}`}
                color="warning"
                size="small"
              />
            )}
          </Box>
        </Box>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              label={{
                value: t("hours", "Hours"),
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="hoursWorked" name={t("hoursWorked", "Hours Worked")}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <Box mt={2} display="flex" gap={2} flexWrap="wrap">
          <Box display="flex" alignItems="center" gap={0.5}>
            <Box
              sx={{
                width: 16,
                height: 16,
                backgroundColor: theme.palette.primary.main,
                borderRadius: "2px",
              }}
            />
            <Typography variant="caption">{t("standardHours", "Standard Hours (8.4h)")}</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={0.5}>
            <Box
              sx={{
                width: 16,
                height: 16,
                backgroundColor: theme.palette.success.main,
                borderRadius: "2px",
              }}
            />
            <Typography variant="caption">{t("overtime", "Overtime (>8.4h)")}</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={0.5}>
            <Box
              sx={{
                width: 16,
                height: 16,
                backgroundColor: theme.palette.warning.main,
                borderRadius: "2px",
              }}
            />
            <Typography variant="caption">{t("undertime", "Undertime (<8.4h) / Holiday")}</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={0.5}>
            <Box
              sx={{
                width: 16,
                height: 16,
                backgroundColor: theme.palette.grey[400],
                borderRadius: "2px",
              }}
            />
            <Typography variant="caption">{t("weekend", "Weekend")}</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={0.5}>
            <Box
              sx={{
                width: 16,
                height: 16,
                backgroundColor: theme.palette.info.main,
                borderRadius: "2px",
              }}
            />
            <Typography variant="caption">{t("leave", "Leave")}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Last30DaysChart;