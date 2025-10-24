import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useMainLayout } from "../../../../context/main-layout-provider";
import ProfileButton from "./ProfileButton";
import {
  Link as RouterLink,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

import LanguageSelector from "./LanguageSelector";
import { Box, IconButton, Link } from "@mui/material";
import { IoMdArrowBack } from "react-icons/io";

export default function Header() {
  const { mainTitle, mainHeaderTabs, backLink } = useMainLayout();

  const navigate = useNavigate();
  const location = useLocation();

  const currentTabIndex = mainHeaderTabs.findIndex(
    (tab) => location.pathname === tab.route
  );

  const handleBack = () => {
    if (backLink) {
      navigate(backLink);
      return;
    }
    navigate(-1);
  };
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
              py: 2.5,
            }}
          >
            <Box sx={{ display: { sm: "none" } }}>
              <Box
                sx={{
                  display: { xs: "flex", sm: "none" },
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  height: "3.75rem",
                  padding: 2,
                  maxWidth: "4rem",
                }}
              >
                <Link component={RouterLink} to="/">
                  <img src="/logo-icon.svg" alt="logo" className="img-fluid" />
                </Link>
              </Box>
            </Box>
            {location.pathname !== "/" && (
              <Box
                sx={{
                  mr: 1,
                  borderRightWidth: 1,
                  borderRightColor: `rgba(255, 255, 255, 0.12)`,
                  borderRightStyle: "solid",
                }}
              >
                <IconButton
                  color="inherit"
                  onClick={handleBack}
                  sx={{
                    px: 2,
                    borderRadius: 1,
                  }}
                >
                  <IoMdArrowBack />
                </IconButton>
              </Box>
            )}

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography color="inherit" variant="h2" component="h1">
                {mainTitle}
              </Typography>
            </Box>

            <Box
              sx={{
                ml: "auto",
              }}
            >
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
          component="div"
          position="static"
          elevation={0}
          sx={{ zIndex: 0 }}
          color="primary"
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
