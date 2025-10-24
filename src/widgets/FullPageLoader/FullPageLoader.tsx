import { Stack } from "@mui/material";
import Loader from "../../components/Loader/Loader";

const FullPageLoader = () => {
  return (
    <Stack
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100%",
      }}
    >
      <Loader />
    </Stack>
  );
};

export default FullPageLoader;
