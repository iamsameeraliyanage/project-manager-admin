import * as React from "react";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useMainLayout } from "../../../../context/main-layout-provider";
import ProfileButton from "./ProfileButton";
import { NavLink, useLocation } from "react-router-dom";
import LanguageSelector from "./LanguageSelector";
import { Box } from "@mui/material";
import { IoIosNotificationsOutline } from "react-icons/io";

interface HeaderProps {
  onDrawerToggle: () => void;
}

export default function Header(props: HeaderProps) {
  const { onDrawerToggle } = props;
  const { mainTitle, mainHeaderTabs } = useMainLayout();

  const location = useLocation();

  const currentTabIndex = mainHeaderTabs.findIndex((tab) =>
    location.pathname.startsWith(tab.route)
  );

  return (
    <React.Fragment>
      <AppBar color="primary" position="sticky" elevation={0}>
        <Toolbar>
          <Box
            sx={{
              display: "flex",
              flexGrow: 1,
              alignItems: "center",
              gap: 1,
              py: 3,
            }}
          >
            <Box sx={{ display: { sm: "none", xs: "block" }, mr: 2 }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={onDrawerToggle}
                edge="start"
              >
                <MenuIcon />
              </IconButton>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography color="inherit" variant="h5" component="h2">
                {mainTitle}
              </Typography>
            </Box>

            <Box
              sx={{
                ml: "auto",
              }}
            >
              <Tooltip title="Alerts • No alerts">
                <IconButton color="inherit">
                  <IoIosNotificationsOutline />
                </IconButton>
              </Tooltip>
            </Box>
            <Box>
              <LanguageSelector />
            </Box>
            <Box>
              <ProfileButton />
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {mainHeaderTabs.length > 0 && (
        <AppBar
          color="primary"
          component="div"
          position="static"
          elevation={0}
          sx={{ zIndex: 0 }}
        >
          <Tabs
            value={currentTabIndex === -1 ? false : currentTabIndex}
            textColor="inherit"
          >
            {mainHeaderTabs.map((tab, index) => (
              <Tab
                key={tab.label}
                label={tab.label}
                component={NavLink}
                to={tab.route}
                value={index}
              />
            ))}
          </Tabs>
        </AppBar>
      )}
    </React.Fragment>
  );
}
