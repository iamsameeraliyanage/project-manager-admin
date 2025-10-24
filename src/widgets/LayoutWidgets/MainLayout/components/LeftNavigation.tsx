import Drawer, { type DrawerProps } from "@mui/material/Drawer";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { Link as RouterLink, NavLink, useLocation } from "react-router-dom";
import { Link, Stack } from "@mui/material";

export const navigationLinks = [
  {
    id: "Management",
    children: [
      {
        id: "Organization",
        icon: <HomeIcon />,
        route: "/",
      },
      {
        id: "Dashboard",
        icon: <DashboardIcon />,
        route: "/dashboard",
      },
    ],
  },
];

interface LeftNavigationProps extends DrawerProps {
  drawerWidth: string;
}

export default function LeftNavigation(props: LeftNavigationProps) {
  const { drawerWidth, ...other } = props;
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      {...other}
      sx={{
        display: { xs: "none", sm: "block" },
        "& .MuiPaper-root": {
          width: drawerWidth,
        },
      }}
    >
      <Stack>
        <Box
          sx={{
            display: "flex",
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
        <List disablePadding>
          {navigationLinks.map(({ id, children }) => (
            <Box
              key={id}
              sx={{ bgcolor: (theme) => theme.palette.primary.main }}
            >
              {children.map(({ id: childId, icon, route }) => {
                const isSelected =
                  route === "/"
                    ? location.pathname === "/"
                    : location.pathname.startsWith(route);
                return (
                  <ListItem
                    disablePadding
                    key={childId}
                    sx={{
                      borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    <ListItemButton
                      sx={{
                        py: 3,
                        px: 3,
                        color: "rgba(255, 255, 255, 0.7)",
                        justifyContent: "center",
                      }}
                      component={NavLink}
                      to={route}
                      selected={isSelected}
                      data-label={childId}
                    >
                      {icon}
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </Box>
          ))}
        </List>
      </Stack>
    </Drawer>
  );
}
