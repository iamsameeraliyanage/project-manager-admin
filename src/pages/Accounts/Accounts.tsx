import { Container, Stack } from "@mui/material";
import ComingSoonCard from "../../widgets/CardWidgets/ComingSoon/ComingSoonCard";
import { useMainLayout } from "../../context/main-layout-provider";
import { useEffect } from "react";

const Accounts = () => {
  const { setMainTitle } = useMainLayout();

  useEffect(() => {
    setMainTitle("Accounts");

    return () => {
      setMainTitle("");
    };
  }, []);
  return (
    <Stack py={3}>
      <Container maxWidth="xl">
        <ComingSoonCard />
      </Container>
    </Stack>
  );
};

export default Accounts;
