import { useTranslation } from "react-i18next";
import { useState } from "react";
import {
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";

const LANGUAGES = [
  { code: "en", label: "English", icon: "/locales/EN.png" },
  { code: "de", label: "Deutsch", icon: "/locales/DE.png" },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);
  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    handleClose();
  };
  const currentFlag = LANGUAGES.find(({ code }) => code === i18n.language);

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleOpen}
        aria-label="change language"
      >
        <img src={currentFlag?.icon} alt={currentFlag?.label} width={20} />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {LANGUAGES.map(({ code, label, icon }) => (
          <MenuItem
            key={code}
            selected={i18n.language === code}
            onClick={() => changeLanguage(code)}
          >
            <ListItemIcon>
              <img src={icon} alt={label} width={20} />
            </ListItemIcon>
            <ListItemText>{label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
