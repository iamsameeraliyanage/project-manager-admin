import { Container, Stack } from "@mui/material";
import ComingSoonCard from "../../widgets/CardWidgets/ComingSoon/ComingSoonCard";

const SettingsUsers = () => {
  return (
    <Stack py={3}>
      <Container maxWidth="xl">
        <ComingSoonCard />
      </Container>
    </Stack>
  );
};

export default SettingsUsers;
