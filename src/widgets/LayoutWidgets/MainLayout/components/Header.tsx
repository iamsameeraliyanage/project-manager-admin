import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Grid from "@mui/material/GridLegacy";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useMainLayout } from "../../../../context/MainLayoutContext";
import ProfileButton from "./ProfileButton";
import { NavLink, useLocation } from "react-router-dom";

interface HeaderProps {
  onDrawerToggle: () => void;
}

export default function Header(props: HeaderProps) {
  const { onDrawerToggle } = props;
  const { mainTitle, mainHeaderTabs } = useMainLayout();

  const location = useLocation();

  const currentTabIndex = mainHeaderTabs.findIndex(
    (tab) => location.pathname === tab.route
  );

  return (
    <React.Fragment>
      <AppBar color="primary" position="sticky" elevation={0}>
        <Toolbar>
          <Grid container spacing={1} sx={{ alignItems: "center" }}>
            <Grid sx={{ display: { sm: "none", xs: "block" } }} item>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={onDrawerToggle}
                edge="start"
              >
                <MenuIcon />
              </IconButton>
            </Grid>
            <Grid item xs />
            <Grid item>
              <Tooltip title="Alerts • No alerts">
                <IconButton color="inherit">
                  <NotificationsIcon />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item>
              <ProfileButton />
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>

      <AppBar
        component="div"
        color="primary"
        position="static"
        elevation={0}
        sx={{ zIndex: 0 }}
      >
        <Toolbar>
          <Typography
            color="inherit"
            variant="h5"
            component="h1"
            sx={{ pb: 2 }}
          >
            {mainTitle}
          </Typography>
        </Toolbar>
      </AppBar>

      {mainHeaderTabs.length > 0 && (
        <AppBar
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
