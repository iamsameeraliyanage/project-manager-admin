import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import UnderConstructuion from "./../../../assets/images/under-construction.svg";

const ComingSoonCard = () => {
  const { t } = useTranslation();
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 4,
          }}
        >
          <Box
            sx={{
              maxWidth: (theme) => theme.spacing(48),
            }}
          >
            <img
              src={UnderConstructuion}
              alt="under construction"
              className="img-fluid"
            />
          </Box>
          <Box mt={4}>
            <Typography variant="h2">
              {t("coming_soon", "Coming Soon")}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ComingSoonCard;
