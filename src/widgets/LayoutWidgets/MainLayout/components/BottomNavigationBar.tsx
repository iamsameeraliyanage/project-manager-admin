import { useState } from "react";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { navigationLinks } from "./LeftNavigation";

export default function BottomNavigationBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = navigationLinks.flatMap((cat) => cat.children);

  const currentIndex = navItems.findIndex((item) =>
    location.pathname.startsWith(item.route)
  );

  const [value, setValue] = useState(currentIndex !== -1 ? currentIndex : 0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    navigate(navItems[newValue].route);
  };

  return (
    <Paper
      sx={{
        display: { xs: "flex", sm: "none" },
        position: "relative",
        zIndex: 1200,
        backgroundColor: (theme) => theme.palette.primary.main,
      }}
      elevation={3}
    >
      <BottomNavigation
        value={value}
        onChange={handleChange}
        color="primary"
        showLabels
        sx={{
          justifyContent: "space-between",
          width: "100%",
          backgroundColor: (theme) => theme.palette.primary.main,
          height: "4rem",
        }}
      >
        {navItems.map((item) => (
          <BottomNavigationAction
            key={item.id}
            label={item.id}
            icon={item.icon}
            sx={{
              color: (theme) => theme.palette.primary.contrastText,
              "&.Mui-selected": {
                color: (theme) => theme.palette.secondary.light,
              },
            }}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
}
