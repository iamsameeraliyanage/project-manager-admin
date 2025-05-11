import { useState } from "react";

import {
  Avatar,
  Box,
  Menu,
  Button,
  IconButton,
  MenuItem,
  ListItemText,
  Typography,
} from "@mui/material";

import PeopleIcon from "@mui/icons-material/People";
import TimerIcon from "@mui/icons-material/Timer";
import { Link } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";

const ProfileButton = () => {
  const { setToken } = useAuth();

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  const [anchorEl, setAnchorEl] = useState(null);

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
        <Avatar src="/static/images/avatar/1.jpg" alt="My Avatar" />
      </IconButton>

      <Menu
        id="msgs-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        sx={{
          "& .MuiMenu-paper": {
            padding: 2,
            width: 280,
          },
        }}
      >
        <MenuItem component={Link} to="/profile">
          <Box display="flex" alignItems="center" gap={2}>
            <PeopleIcon width={20} />
            <ListItemText>
              <Typography>My Profile</Typography>
            </ListItemText>
          </Box>
        </MenuItem>

        <MenuItem component={Link} to="/settings">
          <Box display="flex" alignItems="center" gap={2}>
            <TimerIcon width={20} />
            <ListItemText>
              <Typography variant="subtitle1" color="textPrimary">
                Settings
              </Typography>
            </ListItemText>
          </Box>
        </MenuItem>
        <Box mt={1} py={1} px={2}>
          <Button variant="outlined" color="primary" fullWidth onClick={logout}>
            Logout
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default ProfileButton;
