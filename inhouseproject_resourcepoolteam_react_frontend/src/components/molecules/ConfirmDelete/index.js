import { Typography } from "@mui/material";
import { Box } from "@mui/material";
import React from "react";
import WarningAmberIcon from "@mui/icons-material/WarningAmberRounded";
import ModalComponent from "../ModalComponent";

function ConfirmDelete({
  open = true,
  modalMsg = "",
  defaultMessage = "Are you sure you want to delete ?",
  cancelBtnLabel = "No",
  submitBtnLabel = "Yes",
  onSubmitBtnClick = () => {},
  onCancelBtnClick = () => {},
  onCloseBtnClick = () => {},
}) {
  return (
    <ModalComponent
      onCloseBtnClick={onCloseBtnClick}
      open={open}
      onCancelBtnClick={onCancelBtnClick}
      modalTitle={
        <Box display={"flex"}>
          <Typography
            className="ff-Ro fs-20 fw-500"
            sx={{ marginRight: "4px" }}
          >
            Alert
          </Typography>
          <WarningAmberIcon
            className="fs-22"
            sx={{ color: "#f0ad4e", marginTop: "4px" }}
          />
        </Box>
      }
      cancelBtnLabel={cancelBtnLabel}
      submitBtnLabel={submitBtnLabel}
      minHeightClassName="mnh-300"
      modalWidth={400}
      onSubmitBtnClick={onSubmitBtnClick}
      showClearBtn={false}
    >
      <Box sx={{ margin: "3px" }}>
        <Typography
          textAlign="center"
          className="fs-18"
        >{`${defaultMessage}`}</Typography>
        <Typography
          textAlign="center"
          className="fs-18"
        >{`${modalMsg}`}</Typography>
      </Box>
    </ModalComponent>
  );
}

export default ConfirmDelete;
