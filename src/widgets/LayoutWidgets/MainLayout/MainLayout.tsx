import * as React from "react";

import useMediaQuery from "@mui/material/useMediaQuery";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import LeftNavigation from "./components/LeftNavigation";
import Header from "./components/Header";
import { MainLayoutProvider } from "../../../context/MainLayoutContext";
import { useTheme } from "@mui/material";

const drawerWidth = 256;

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <MainLayoutProvider>
      <Box sx={{ display: "flex", height: "100vh", overflow: "auto" }}>
        <CssBaseline />
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          {isSmUp ? null : (
            <LeftNavigation
              PaperProps={{ style: { width: drawerWidth } }}
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
            />
          )}
          <LeftNavigation
            PaperProps={{ style: { width: drawerWidth } }}
            sx={{ display: { sm: "block", xs: "none" } }}
          />
        </Box>
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Header onDrawerToggle={handleDrawerToggle} />
          <Box
            component="main"
            sx={{ flex: 1, bgcolor: "#eaeff1", overflow: "auto" }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </MainLayoutProvider>
  );
};

export default MainLayout;
