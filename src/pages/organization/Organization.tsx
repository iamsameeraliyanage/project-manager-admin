import { Container, Stack, Typography, Box } from "@mui/material";
import { useMainLayout } from "../../context/main-layout-provider";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import UserGrid from "../../modules/UserGrid/UserGrid";
import Card from "../../components/Card/Card";
export default function Organization() {
  const { setMainTitle } = useMainLayout();

  const { t } = useTranslation();

  useEffect(() => {
    setMainTitle(t("organization", "Organization"));
  }, []);

  return (
    <Stack pt={5} pb={3} height={"100%"}>
      <Container
        maxWidth="xl"
        sx={{
          flexGrow: 1,
        }}
      >
        <Card fullHeight>
          <Stack>
            <Box
              sx={{
                borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                pb: 3,
                mb: 3,
              }}
            >
              <Typography variant="h3">{t("users")}</Typography>
            </Box>
            <UserGrid />
          </Stack>
        </Card>
      </Container>
    </Stack>
  );
}
