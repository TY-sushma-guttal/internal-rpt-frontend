import React from "react";
import ModalComponent from "../../../molecules/ModalComponent";
import { Box } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

const QrCodeDisplayModal = ({
  openQrCodeModal = false,
  setOpenQrCodeModal = () => {},
  imgSource = "",
  getTheQrCodeForTheModal = () => {},
}) => {
  return (
    <ModalComponent
      onCloseBtnClick={() => {
        setOpenQrCodeModal(false);
      }}
      showCancelBtn={false}
      showClearBtn={false}
      //   showSubmitBtn={false}
      modalWidth={350}
      open={openQrCodeModal}
      submitBtnLabel="Refresh Qr Code"
      onSubmitBtnClick={() => {
        getTheQrCodeForTheModal();
      }}
      submitBtnIcon={<RefreshIcon />}
      showSubmitBtnIcon
      modalTitle="Mark Your Attendance"
    >
      <Box display="flex" justifyContent="center" alignItems="center">
        <img
          src={"data:image/png;base64," + imgSource}
          alt="qr-code"
          height={250}
          width={250}
          style={{ display: "block" }}
        />
      </Box>
    </ModalComponent>
  );
};

export default QrCodeDisplayModal;
