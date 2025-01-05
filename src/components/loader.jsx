import React from "react";
import { hatch, lineWobble } from "ldrs";
import { Box,  Typography} from  "@mui/material";
function Preloader() {
  lineWobble.register();
  return (
    <>
      <Box
        sx={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
        }}
      >
        <l-line-wobble size="30" speed="1.2" color="white"></l-line-wobble>
      </Box>
    </>
  );
}

export default Preloader;
