import { Alert } from "@mui/material";
import React from "react";

const CustomToast = ({ children, appearance }) => {
  return (
    <div>
      <Alert severity={appearance} variant="filled">
        {children}
      </Alert>
    </div>
  );
};

export default CustomToast;
