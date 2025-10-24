import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Stack,
  LinearProgress,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useLastMonthsQuoteAnalytics } from "../../hooks/api/use-dashboard-analytics";
import { formatPercentage } from "../../utils/formatters";
import Card from "../Card/Card";

const QuotesInvoicesSummary = () => {
  const { t } = useTranslation();

  const {
    data: quoteAnalytics,
    isLoading: quoteLoading,
    error: quoteError,
  } = useLastMonthsQuoteAnalytics(3);

  const isLoading = quoteLoading;
  const hasError = quoteError;

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

  if (hasError) {
    return (
      <Card fullHeight>
        <Alert severity="error">
          {t("errorLoadingFinancialData", "Error loading financial data")}
        </Alert>
      </Card>
    );
  }

  const quoteSummary = quoteAnalytics?.summary;

  return (
    <Card fullHeight>
      <Stack spacing={3}>
        {/* Header */}
        <Box>
          <Typography variant="h5" component="h2" gutterBottom color="primary">
            {t("quotesSummary", "Quotes Summary")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("last3MonthsOverview", "Last 3 months overview")}
          </Typography>
        </Box>
        <Box>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
              <Box textAlign="center">
                <Typography
                  variant="body1"
                  color="text.secondary"
                  fontWeight={600}
                >
                  {t("totalQuotes", "Total Quotes")}
                </Typography>
                <Typography
                  variant="h1"
                  color="primary"
                  fontWeight="bold"
                  lineHeight={1.5}
                >
                  {quoteSummary?.total_quotes || 0}
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
              <Stack>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  textAlign="center"
                  fontWeight={600}
                >
                  {t("approvalRate", "Approval Rate")}
                </Typography>
                <Stack
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  spacing={2}
                >
                  <Box>
                    <Typography
                      variant="h1"
                      color="secondary"
                      fontWeight="bold"
                      sx={{
                        lineHeight: 1.5,
                      }}
                    >
                      {formatPercentage(
                        quoteSummary?.total_quotes &&
                          quoteSummary?.total_quotes > 0
                          ? (quoteSummary?.by_status?.accepted?.count || 0) /
                              quoteSummary?.total_quotes
                          : 0
                      )}
                    </Typography>

                    <Typography
                      variant="caption"
                      display="block"
                      color="text.secondary"
                      textAlign={"center"}
                    >
                      {t("byCount", "By Count")}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Box>

        {/* Quotes Section */}
        <Box>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <Box>
                <LinearProgress
                  variant="determinate"
                  value={
                    ((quoteSummary?.by_status?.accepted?.count || 0) /
                      (quoteSummary?.total_quotes || 0)) *
                    100
                  }
                  sx={{
                    height: 8,
                    borderRadius: 1,
                    backgroundColor: "#e0e0e0",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: "#4caf50",
                      borderRadius: 1,
                    },
                  }}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 1,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {quoteSummary?.by_status?.accepted?.count || 0}{" "}
                  {t("accepted", "Accepted")}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {(quoteSummary?.total_quotes || 0) -
                    (quoteSummary?.by_status?.accepted?.count || 0)}{" "}
                  {t("accepted", "Accepted")}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Stack>
    </Card>
  );
};

export default QuotesInvoicesSummary;
