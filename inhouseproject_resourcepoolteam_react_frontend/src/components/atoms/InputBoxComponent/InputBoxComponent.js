import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@mui/material";

export default function InputBoxComponent({
  label = "Example Label",
  variant = "outlined",
  name = "",
  params,
  value = "",
  onChange = () => {},
  helperText = "",
  error = false,
  type = "text",
  disabled = false,
  required = true,
  placeholder = "",
}) {
  const newTheme = createTheme({
    components: {
      MuiFormLabel: {
        styleOverrides: {
          asterisk: {
            color: "red",
            fontWeight: 500,
            fontSize: 20,
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={newTheme}>
      <TextField
        required={required}
        {...params}
        sx={{
          width: "100%",
        }}
        name={name}
        size="small"
        InputLabelProps={{ shrink: true }}
        label={label}
        variant={variant}
        value={value}
        onChange={onChange}
        helperText={helperText}
        error={Boolean(error)}
        type={type}
        disabled={disabled}
        placeholder={placeholder}
      />
    </ThemeProvider>
  );
}
