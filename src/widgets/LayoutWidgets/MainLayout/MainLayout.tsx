import * as React from "react";

import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Header from "./components/Header";
import { MainLayoutProvider } from "../../../context/main-layout-provider";
import { LinearProgress } from "@mui/material";
import { useIsFetching } from "@tanstack/react-query";
import { AuthProvider } from "../../../context/auth-provider";
import LeftNavigation from "./components/LeftNavigation";
import BottomNavigationBar from "./components/BottomNavigationBar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const fetchingQueryCount = useIsFetching();
  const drawerWidth = "4rem";
  return (
    <AuthProvider>
      <MainLayoutProvider>
        <Box
          sx={{
            display: "flex",
            height: "100vh",
            overflow: "auto",
            position: "relative",
          }}
        >
          <CssBaseline />
          {fetchingQueryCount > 0 && (
            <Box
              sx={{
                zIndex: 9999,
                position: "fixed",
                width: "100%",
                top: 0,
                left: 0,
              }}
            >
              <LinearProgress color="secondary" />
            </Box>
          )}
          <Box
            component="nav"
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          >
            <LeftNavigation drawerWidth={drawerWidth} />
          </Box>
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <Header />
            <Box
              component="main"
              sx={{ flex: 1, bgcolor: "#eaeff1", overflow: "auto" }}
            >
              {children}
            </Box>
            <BottomNavigationBar />
          </Box>
        </Box>
      </MainLayoutProvider>
    </AuthProvider>
  );
};

export default MainLayout;
