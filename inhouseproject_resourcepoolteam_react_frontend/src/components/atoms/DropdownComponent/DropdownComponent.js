import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import InputBoxComponent from "../InputBoxComponent/InputBoxComponent";
import { Box } from "@mui/material";
const DropdownComponent = ({
  label = "",
  options = [],
  fullWidth = true,
  width = "100%",
  onChange = () => {},
  value = { label: "", id: 1 },
  error = false,
  helperText = "",
  isOptionEqualTo = () => {},
  disableClearable = false,
  disabled = false,
  placeholder = "",
  required=false
}) => {
  return (
    <Autocomplete
      fullWidth={fullWidth}
      sx={{ width: width, background: "#fff" }}
      options={options}
      getOptionLabel={(option) => {
        return option.label || "";
      }}
      renderInput={(params) => (
        <InputBoxComponent
          helperText={helperText}
          error={error}
          label={label}
          params={params}
          placeholder={placeholder}
          required = {required}
        />
      )}
      onChange={(_, val) => {
        onChange(val);
      }}
      value={value}
      // getOptionSelected={(option, value) => {
      //   console.log(option.id, "---option.id", value.id, "---value.id");
      //   return option.id === value.id;
      // }}
      isOptionEqualToValue={(option, value) => {
        return (
          value?.label === "" ||
          option?.id === value?.id ||
          value?.label === option?.label
        );
      }}
      renderOption={(props, option) => {
        return (
          <Box {...props} key={option?.id}>
            {option.label}
          </Box>
        );
      }}
      disableClearable={disableClearable}
      disabled={disabled}
    />
  );
};

export default DropdownComponent;
