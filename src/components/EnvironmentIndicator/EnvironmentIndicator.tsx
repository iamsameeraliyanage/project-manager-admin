import React from "react";
import { Box } from "@mui/material";

const EnvironmentIndicator: React.FC = () => {
  const environment = import.meta.env.VITE_ENVIRONMENT;

  // Only show indicator if environment is 'dev'
  if (environment !== "dev") {
    return null;
  }

  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: "#FFD700", // Yellow color
          animation: "pulse 2s infinite",
          "@keyframes pulse": {
            "0%": {
              transform: "scale(0.95)",
              boxShadow: "0 0 0 0 rgba(255, 215, 0, 0.7)",
            },
            "70%": {
              transform: "scale(1)",
              boxShadow: "0 0 0 10px rgba(255, 215, 0, 0)",
            },
            "100%": {
              transform: "scale(0.95)",
              boxShadow: "0 0 0 0 rgba(255, 215, 0, 0)",
            },
          },
        }}
      />
    </Box>
  );
};

export default EnvironmentIndicator;