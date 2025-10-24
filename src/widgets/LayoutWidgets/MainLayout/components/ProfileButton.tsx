import { useState } from "react";

import {
  Avatar,
  Box,
  Button,
  IconButton,
  Typography,
  CircularProgress,
  Tooltip,
  Popover,
  Card,
  CardContent,
  Stack,
  Divider,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../../context/auth-provider";
import { useTranslation } from "react-i18next";

const ProfileButton = () => {
  const navigate = useNavigate();
  const { isLoading, user } = useAuthContext();

  const { t } = useTranslation();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/signin", { replace: true });
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="show 11 new notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl === "object" && {
            color: "primary.main",
          }),
        }}
        onClick={handleClick}
      >
        {isLoading ? (
          <Box>
            <CircularProgress size={16} />
          </Box>
        ) : (
          <Tooltip title={`${user?.firstName} ${user?.lastName}`}>
            <Box>
              <Avatar>{user?.firstName[0]}</Avatar>
            </Box>
          </Tooltip>
        )}
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Card>
          <CardContent>
            <Stack sx={{ minWidth: 280 }}>
              <Stack alignItems="center" pt={3}>
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                  }}
                />
                <Typography variant="h5" mt={2} textTransform="capitalize">
                  {user?.firstName} {user?.lastName}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {user?.email}
                </Typography>
              </Stack>
              <Stack alignItems="center" my={2}>
                <Box width={0.75}>
                  <Button
                    fullWidth
                    variant="text"
                    onClick={() => {
                      navigate("/settings");
                      handleClose();
                    }}
                    color="secondary"
                    sx={{
                      border: (theme) =>
                        `1px solid ${theme.palette.secondary.main}`,
                      borderRadius: "30px",
                    }}
                    data-testid="manage-account-button"
                  >
                    {t("manageAccount")}
                  </Button>
                </Box>
              </Stack>
              <Divider />
              <Stack mt={1}>
                <Box width={1}>
                  <Button
                    fullWidth
                    color="secondary"
                    variant="text"
                    size="large"
                    onClick={logout}
                    data-testid="logout-button"
                  >
                    {t("logout")}
                  </Button>
                </Box>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Popover>
    </Box>
  );
};

export default ProfileButton;
