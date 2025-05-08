import { Container, Stack } from "@mui/material";
import { Card } from "@mui/material";
import { useMainLayout } from "../../context/MainLayoutContext";
import { useEffect } from "react";

export default function Organization() {
  const { setMainTitle } = useMainLayout();

  useEffect(() => {
    setMainTitle("Organization");
  }, []);

  return (
    <Container>
      <Card variant="outlined">
        <Stack minHeight={"50vh"} p={3}>
          Organization goes here
        </Stack>
      </Card>
    </Container>
  );
}
