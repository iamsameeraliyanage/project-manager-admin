import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import PageNotFound from "./../../../assets/images/page-not-found.svg";
import { Link } from "react-router-dom";

const NotFoundCard = () => {
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
              src={PageNotFound}
              alt="under construction"
              className="img-fluid"
            />
          </Box>
          <Box mt={4}>
            <Typography variant="h2">{t("page_not_found")}</Typography>
          </Box>
          <Box mt={2}>
            <Button component={Link} variant="outlined" to={"/"}>
              <Typography variant="body1">
                {t("button_text.go_back_to_home")}
              </Typography>
            </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default NotFoundCard;
