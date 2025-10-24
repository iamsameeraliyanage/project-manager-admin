import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Stack,
  LinearProgress,
  Chip,
  IconButton,
  Avatar,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDashboardEmployeeProductivity } from "../../hooks/api/use-dashboard-employee-productivity";
import { FiChevronLeft, FiChevronRight, FiUser } from "react-icons/fi";
import dayjs from "dayjs";
import Card from "../Card/Card";

const EmployeeProductivitySummary = () => {
  const { t } = useTranslation();
  const {
    data: productivityData,
    isLoading,
    error,
  } = useDashboardEmployeeProductivity();
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 12;

  // Auto-rotate pages every 8 seconds if more than 6 employees
  useEffect(() => {
    if (!productivityData || productivityData.length <= itemsPerPage) return;

    const totalPages = Math.ceil(productivityData.length / itemsPerPage);
    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 8000); // 8 seconds

    return () => clearInterval(interval);
  }, [productivityData?.length, itemsPerPage]);

  // Reset to first page when data changes
  useEffect(() => {
    setCurrentPage(0);
  }, [productivityData?.length]);

  // Function to get color based on productivity percentage
  function getProductivityColor(percentage: number): string {
    if (percentage >= 70) return "#4caf50"; // Green for high productivity
    if (percentage >= 30) return "#ff9800"; // Orange for medium productivity
    return "#f44336"; // Red for low productivity
  }
  if (isLoading) {
    return (
      <Card fullHeight>
        <Stack
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Stack>
      </Card>
    );
  }
  if (error) {
    return (
      <Card fullHeight>
        <Alert severity="error">
          {t("errorLoadingProductivityData", "Error loading productivity data")}
        </Alert>
      </Card>
    );
  }

  if (!productivityData || productivityData.length === 0) {
    return (
      <Card fullHeight>
        <Alert severity="info">
          {t("noProductivityDataAvailable", "No productivity data available")}
        </Alert>
      </Card>
    );
  }

  // Pagination logic
  const totalPages = Math.ceil(productivityData.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, productivityData.length);
  const currentEmployees = productivityData.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  // Get last 30 days range for display
  const last30DaysRange = `${dayjs().subtract(29, "days").format("MMM DD")} - ${dayjs().format("MMM DD, YYYY")}`;

  return (
    <Card sx={{ minHeight: 400 }} fullHeight>
      <Stack>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1.5}
        >
          <Typography variant="h6" color="primary">
            {t(
              "employeeProductivityLast30Days",
              "Employee Productivity - Last 30 Days"
            )}
          </Typography>
          <Chip
            label={`${productivityData.length}`}
            color="secondary"
            size="small"
            sx={{ minWidth: 40, height: 24 }}
          />
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {last30DaysRange}
        </Typography>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="body2" color="text.secondary">
            {t("showing", "Showing")} {startIndex + 1}-{endIndex}{" "}
            {t("of", "of")} {productivityData.length}
          </Typography>
          {totalPages > 1 && (
            <Box display="flex" alignItems="center" gap={1}>
              <IconButton size="small" onClick={handlePrevPage}>
                <FiChevronLeft />
              </IconButton>
              <Typography variant="caption" color="text.secondary">
                {currentPage + 1} / {totalPages}
              </Typography>
              <IconButton size="small" onClick={handleNextPage}>
                <FiChevronRight />
              </IconButton>
            </Box>
          )}
        </Box>

        <Box sx={{ minHeight: 280 }}>
          <Stack spacing={1.5}>
            {currentEmployees.map((employee, index) => (
              <Box
                key={`${currentPage}-${index}`}
                sx={{
                  animation: "fadeIn 0.5s ease-in-out",
                  "@keyframes fadeIn": {
                    "0%": { opacity: 0 },
                    "100%": { opacity: 1 },
                  },
                }}
              >
                <Box display="flex" alignItems="center" gap={2} mb={0.5}>
                  <Avatar
                    sx={{
                      bgcolor: getProductivityColor(employee.productivity),
                      width: 32,
                      height: 32,
                    }}
                  >
                    <FiUser size={16} />
                  </Avatar>
                  <Box flex={1}>
                    <Typography
                      variant="body2"
                      fontWeight="600"
                      sx={{ fontSize: "0.9rem" }}
                    >
                      {employee.name}
                    </Typography>
                  </Box>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color={getProductivityColor(employee.productivity)}
                    sx={{
                      fontSize: "1.1rem",
                      minWidth: 60,
                      textAlign: "right",
                    }}
                  >
                    {employee.productivity.toFixed(1)}%
                  </Typography>
                </Box>

                <LinearProgress
                  variant="determinate"
                  value={employee.productivity}
                  sx={{
                    height: 8,
                    borderRadius: 1,
                    backgroundColor: "#e0e0e0",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: getProductivityColor(
                        employee.productivity
                      ),
                      borderRadius: 1,
                    },
                  }}
                />
              </Box>
            ))}
          </Stack>
        </Box>
      </Stack>
    </Card>
  );
};

export default EmployeeProductivitySummary;
