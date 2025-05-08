import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useMainLayout } from "../../../context/MainLayoutContext";

const Settings = () => {
  const { setMainTitle, setMainHeaderTabs } = useMainLayout();

  useEffect(() => {
    setMainTitle("Settings");
    setMainHeaderTabs([
      { label: "Users", route: "/settings/users" },
      { label: "Teams", route: "/settings/teams" },
      { label: "Permissions", route: "/settings/permissions" },
    ]);
    return () => {
      setMainTitle("");
      setMainHeaderTabs([]);
    };
  }, []);

  return (
    <>
      <Outlet />
    </>
  );
};

export default Settings;
