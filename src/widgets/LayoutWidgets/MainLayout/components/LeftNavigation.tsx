import Divider from "@mui/material/Divider";
import Drawer, { type DrawerProps } from "@mui/material/Drawer";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PeopleIcon from "@mui/icons-material/People";
import DnsRoundedIcon from "@mui/icons-material/DnsRounded";
import TimerIcon from "@mui/icons-material/Timer";
import SettingsIcon from "@mui/icons-material/Settings";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";

const categories = [
  {
    id: "Management",
    children: [
      {
        id: "Organization",
        icon: <PeopleIcon />,
        route: "/",
      },
      {
        id: "Accounts",
        icon: <DnsRoundedIcon />,
        route: "/accounts",
      },
    ],
  },
  {
    id: "Settings",
    children: [
      {
        id: "Settings",
        icon: <SettingsIcon />,
        route: "/settings",
      },
      {
        id: "Profile",
        icon: <TimerIcon />,
        route: "/profile",
      },
    ],
  },
];

const item = {
  py: "2px",
  px: 3,
  color: "rgba(255, 255, 255, 0.7)",
  "&:hover, &:focus": {
    bgcolor: "rgba(255, 255, 255, 0.08)",
  },
};

const itemCategory = {
  boxShadow: "0 -1px 0 rgb(255,255,255,0.1) inset",
  py: 1.5,
  px: 3,
};

export default function LeftNavigation(props: DrawerProps) {
  const { ...other } = props;
  const location = useLocation();
  const { userRole } = useAuth();
  return (
    <Drawer variant="permanent" {...other}>
      <List disablePadding>
        <ListItem
          sx={{ ...item, ...itemCategory, fontSize: 22, color: "#fff" }}
        >
          CompanyLogo
        </ListItem>
        <ListItem sx={{ ...item, ...itemCategory }}>
          <ListItemIcon>
            <AdminPanelSettingsIcon />
          </ListItemIcon>
          <ListItemText
            sx={{
              textTransform: "capitalize",
            }}
          >
            {userRole}
          </ListItemText>
        </ListItem>
        {categories.map(({ id, children }) => (
          <Box key={id} sx={{ bgcolor: "#101F33" }}>
            <ListItem sx={{ py: 2, px: 3 }}>
              <ListItemText sx={{ color: "#fff" }}>{id}</ListItemText>
            </ListItem>
            {children.map(({ id: childId, icon, route }) => {
              const isSelected =
                route === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(route);
              return (
                <ListItem disablePadding key={childId}>
                  <ListItemButton
                    sx={item}
                    component={NavLink}
                    to={route}
                    selected={isSelected}
                  >
                    <ListItemIcon>{icon}</ListItemIcon>
                    <ListItemText>{childId}</ListItemText>
                  </ListItemButton>
                </ListItem>
              );
            })}
            <Divider sx={{ mt: 2 }} />
          </Box>
        ))}
      </List>
    </Drawer>
  );
}
