import { Container, Stack, Card, Typography, Box } from "@mui/material";
import { useMainLayout } from "../../context/MainLayoutContext";
import { useEffect } from "react";
import UserTable from "../../modules/UserTable/UserTable";
import { useTranslation } from "react-i18next";

export default function Organization() {
  const { setMainTitle } = useMainLayout();

  const { t } = useTranslation();

  useEffect(() => {
    setMainTitle("Organization");
  }, []);

  return (
    <Stack py={3}>
      <Container>
        <Card variant="outlined">
          <Stack p={3}>
            <Box mb={3}>
              <Typography variant="h5">{t("users")}</Typography>
            </Box>
            <UserTable />
          </Stack>
        </Card>
      </Container>
    </Stack>
  );
}
