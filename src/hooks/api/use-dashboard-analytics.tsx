import { useQuery } from "@tanstack/react-query";
import { getLastMonthsQuoteAnalyticsQueryFn, getLastMonthsInvoiceAnalyticsQueryFn } from "../../services/api";

export interface MonthlyQuoteAnalytics {
  summary: {
    total_quotes: number;
    total_value: number;
    average_approval_rate: number;
    by_status: {
      accepted?: {
        count: number;
        total_value: number;
      };
      rejected?: {
        count: number;
        total_value: number;
      };
      pending?: {
        count: number;
        total_value: number;
      };
    };
  };
}

export interface MonthlyInvoiceAnalytics {
  summary: {
    total_invoices: number;
    average_collection_ratio: number;
    by_status: {
      paid?: {
        count: number;
      };
      pending?: {
        count: number;
      };
      overdue?: {
        count: number;
      };
    };
  };
}

export const useLastMonthsQuoteAnalytics = (months: number) => {
  return useQuery<MonthlyQuoteAnalytics>({
    queryKey: ["dashboard", "last-months-quote-analytics", months],
    queryFn: () => getLastMonthsQuoteAnalyticsQueryFn(months),
    enabled: !!months,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useLastMonthsInvoiceAnalytics = (months: number) => {
  return useQuery<MonthlyInvoiceAnalytics>({
    queryKey: ["dashboard", "last-months-invoice-analytics", months],
    queryFn: () => getLastMonthsInvoiceAnalyticsQueryFn(months),
    enabled: !!months,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};