import { Stack } from "@mui/material";

const Loader = () => {
  return (
    <Stack
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
      }}
    >
      <div className="loader"></div>
    </Stack>
  );
};

export default Loader;
