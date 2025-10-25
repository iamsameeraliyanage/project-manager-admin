import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { NavLink, useLocation } from "react-router-dom";
import { ROUTES } from "../../../../routes/routes.config";
import { Link, Stack, Typography } from "@mui/material";
import { TbHomeStats } from "react-icons/tb";
import { MdDashboard } from "react-icons/md";

import { useTranslation } from "react-i18next";
import { MdOutlineAdminPanelSettings } from "react-icons/md";

import companyLogo from "../../../../assets/images/logo.svg";
import { useAuthContext } from "../../../../context/auth-provider";

interface LeftNavigationCategory {
  id?: string;
  children: {
    id: string;
    icon: React.ReactNode;
    route: string;
  }[];
}

const categories: LeftNavigationCategory[] = [
  {
    children: [
      {
        id: "overview",
        icon: <TbHomeStats />,
        route: "/",
      },
      {
        id: "dashboard",
        icon: <MdDashboard />,
        route: `/${ROUTES.MAIN.DASHBOARD}`,
      },
    ],
  },
];

const item = {
  py: 1,
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

export default function LeftNavigation({
  width,
  isMobile,
}: {
  width: number;
  isMobile: boolean;
}) {
  const location = useLocation();
  const { user } = useAuthContext();
  const { t } = useTranslation();

  return (
    <Stack
      sx={{
        width: width,
        display: isMobile ? "none" : "block",
        overflow: "auto",
        backgroundColor: "#081627",
        height: "100%",
      }}
    >
      <Box>
        <Link
          to="/"
          component={NavLink}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            py: 4,
            px: 2,
            maxWidth: "120px",
          }}
        >
          <img src={companyLogo} className="img-fluid" />
        </Link>
      </Box>
      <Box>
        <List
          disablePadding
          sx={{
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <ListItem
            sx={{
              ...item,
              ...itemCategory,
              pointerEvents: "none",
              color: "#b28d00",
            }}
          >
            <ListItemIcon>
              <MdOutlineAdminPanelSettings />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="h5" textTransform={"capitalize"}>
                {user?.role}
              </Typography>
            </ListItemText>
          </ListItem>
          {categories.map(({ id, children }, index) => (
            <Box key={index} sx={{ bgcolor: "#101F33", pt: 2 }}>
              {id && (
                <ListItem sx={{ pb: 2, px: 3 }}>
                  <ListItemText sx={{ color: "#fff" }}>{t(id)}</ListItemText>
                </ListItem>
              )}

              {children.map(({ id: childId, route }) => {
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
                      <ListItemText>{t(childId)}</ListItemText>
                    </ListItemButton>
                  </ListItem>
                );
              })}
              <Divider sx={{ mt: 2 }} />
            </Box>
          ))}
        </List>
      </Box>
    </Stack>
  );
}
