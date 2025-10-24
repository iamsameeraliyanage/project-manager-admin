import {
  Box,
  Typography,
  Card,
  CardContent,
  useTheme,
  Chip,
} from "@mui/material";
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
import { TrendingUp as TrendingUpIcon } from "@mui/icons-material";

interface MonthlyHoursChartProps {
  data: { month: number; hours: number }[];
  year: number;
}

const MonthlyHoursChart: React.FC<MonthlyHoursChartProps> = ({
  data,
  year,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  // Transform data to include month names
  const chartData = data.map((item) => ({
    month: t(`month.${item.month}`, getMonthName(item.month)),
    hours: item.hours,
    monthNumber: item.month,
  }));

  // Calculate average hours
  const totalHours = data.reduce((sum, item) => sum + item.hours, 0);
  const averageHours = totalHours / data.length;

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: "background.paper",
            p: 1.5,
            border: 1,
            borderColor: "divider",
            borderRadius: 1,
            boxShadow: 2,
          }}
        >
          <Typography variant="body2" fontWeight="medium">
            {payload[0].payload.month}
          </Typography>
          <Typography variant="body2" color="primary">
            {t("hours", "Hours")}: {payload[0].value.toFixed(1)}h
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
          <Box display="flex" alignItems="center" gap={2}>
            <TrendingUpIcon color="primary" />
            <Typography variant="h6">
              {t("monthlyWorkHours", "Monthly Work Hours")} - {year}
            </Typography>
          </Box>
          <Chip
            label={`${t("average", "Average")}: ${averageHours.toFixed(1)}h`}
            color="primary"
            size="small"
          />
        </Box>

        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              label={{
                value: t("hours", "Hours"),
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="hours"
              fill={theme.palette.primary.main}
              radius={[8, 8, 0, 0]}
              maxBarSize={50}
            />
          </BarChart>
        </ResponsiveContainer>

        <Box mt={2} display="flex" justifyContent="space-between">
          <Typography variant="caption" color="text.secondary">
            {t("totalHoursYear", "Total Hours (Year)")}: {totalHours.toFixed(1)}h
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t("monthsWithData", "Months with data")}: {data.filter(d => d.hours > 0).length}/12
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

// Helper function to get month name
function getMonthName(monthNumber: number): string {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[monthNumber - 1] || "";
}

export default MonthlyHoursChart;