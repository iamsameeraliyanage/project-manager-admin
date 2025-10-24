import { Box, Container, Stack } from "@mui/material";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CalendarNavTabs from "./CalendarNavTabs";
import { useMainLayout } from "../../context/main-layout-provider";
import { useEffect } from "react";
import useEmployee from "../../hooks/api/use-employee";

const Calendar = () => {
  const { userId } = useParams();

  const { setMainTitle, setBackLink } = useMainLayout();

  const { t } = useTranslation();

  const { data: users } = useEmployee();
  const user = users?.find((u) => u.id === Number(userId));

  useEffect(() => {
    if (user) {
      setMainTitle(
        `${user.firstname} ${user.lastname} - ${t("calendars", "Calendars")}`
      );
    } else {
      setMainTitle(t("break", "Calendars"));
    }
    setBackLink(`/${userId}`);
    return () => {
      setMainTitle("");
      setBackLink(null);
    };
  }, [setMainTitle, t, user]);
  return (
    <Stack pt={5}>
      <Box>
        <Container maxWidth="xl">
          <CalendarNavTabs />
        </Container>
      </Box>
    </Stack>
  );
};

export default Calendar;
