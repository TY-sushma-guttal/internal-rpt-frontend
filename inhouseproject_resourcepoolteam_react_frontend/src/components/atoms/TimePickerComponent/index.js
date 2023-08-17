import React from "react";
import { TextField, Grid, Typography, FormHelperText } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

const commonStyles = {
  m: 1,
  borderColor: "grey.500",
  height: "0.48rem",
};
const TimePickerComponent = ({
  label = "",
  value = null,
  onChange = () => {},
  readOnly = false,
  placeholder = "",
  textLabel = "",
  errorText = "",
  required = false,
  disabled = false,
  minTime = null,
  maxTime = null,
  inputlabelshrink = false,
}) => {
  const onKeyDown = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <Grid mb="3px" px="6px">
        <Typography
          className="ff-Ro fs-14 fw-500"
          sx={{ color: disabled ? "#ccc" : "#000" }}
        >
          {textLabel}
          {required && <span className="text-danger ms-1">*</span>}
        </Typography>
      </Grid>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker
          disabled={disabled}
          label={label}
          value={value}
          onChange={onChange}
          renderInput={(params) => (
            <TextField
              variant="outlined"
              size="small"
              error={Boolean(errorText)}
              sx={{
                "& .MuiInputBase-input": {
                  ...commonStyles,
                  padding: "8px 2px",
                },
                "& .MuiOutlinedInput-root:hover": {
                  "& > fieldset": {
                    borderColor: "#A6A6A6",
                  },
                },
                "& .MuiOutlinedInput-root:focus": {
                  "& > fieldset": {
                    outline: "none",
                    borderColor: "#A6A6A6",
                  },
                },
                "& .MuiOutlinedInput-root": {
                  "& > fieldset": {
                    borderColor: "#A6A6A6",
                  },
                },
                "& .MuiInputAdornment-root": {
                  "& >button": {
                    background: "#f8fafb",
                    borderLeft: "1px solid #A6A6A6",
                    borderRadius: "0px",
                    "& >svg": {
                      fill: "#A6A6A6",
                    },
                  },
                },
                "& .MuiIconButton-root": {
                  padding: "4px 8px",
                },
                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                  borderColor: errorText ? "#d32f2f" : "",
                },
              }}
              fullWidth
              {...params}
              inputProps={{
                ...params.inputProps,
                placeholder: placeholder,
              }}
              onKeyDown={onKeyDown}
              InputLabelProps={{
                shrink: inputlabelshrink || value,
              }}
            />
          )}
          readOnly={readOnly}
          minTime={minTime}
          maxTime={maxTime}
        />
      </LocalizationProvider>
      {errorText && (
        <FormHelperText error className="fw-700">
          {errorText}
        </FormHelperText>
      )}
    </>
  );
};

export default TimePickerComponent;
