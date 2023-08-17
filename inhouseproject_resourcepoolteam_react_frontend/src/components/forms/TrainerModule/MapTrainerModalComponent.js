import React, { useEffect } from "react";
import ModalComponent from "../../molecules/ModalComponent";
import { useState } from "react";
import DropdownComponent from "../../atoms/DropdownComponent/DropdownComponent";
import { getBatchesForMappingTheTrainer } from "../../../services/trainermodule/trainermodule";
import { Box } from "@mui/material";
import { useToasts } from "react-toast-notifications";

const MapTrainerModalComponent = ({
  openMapTrainerModal,
  batchesForDropdown,
  setBatchesForDropdown,
  setOpenMapTrainerModal,
  setMapTrainerDetails,
  mapTrainerDetails,
  mapTrainer,
}) => {
  const { addToast } = useToasts();

  const getBatches = async () => {
    const { data, error } = await getBatchesForMappingTheTrainer("CREATED");
    console.log(data.data, "===data.data");
    if (data) {
      if (data.isError) {
      } else {
        const tempArray = data.data.map((val) => {
          return { id: val.batchId, label: val.batchName };
        });
        setBatchesForDropdown([...tempArray]);
      }
    } else if (error) {
    }
  };

  const [mapTrainerErrorObj, setMapTrainerErrorObj] = useState({
    dropDownValue: "",
  });

  const [dropDownValue, setDropDownValue] = useState({
    id: "",
    label: "",
  });

  useEffect(() => {
    getBatches();
  }, [openMapTrainerModal]);

  const handleMapError = () => {
    let mapTrainerErrorObj = {
      dropDownValue: "",
    };
    let theError = false;

    if (dropDownValue.label === "") {
      mapTrainerErrorObj.dropDownValue = "Please select batch";
      theError = true;
    }
    setMapTrainerErrorObj(mapTrainerErrorObj);
    return theError;
  };

  const handleSubmitClick = async () => {
    if (!handleMapError()) {
      await mapTrainer();
      setOpenMapTrainerModal(false);
      setDropDownValue({ id: "", label: "" });
    }
  };

  const handleClose = () => {
    setOpenMapTrainerModal(false);
    setDropDownValue({
      id: "",
      label: "",
    });
  };

  return (
    <ModalComponent
      modalTitle="Map Trainer"
      showClearBtn={false}
      modalWidth={400}
      open={openMapTrainerModal}
      onCancelBtnClick={() => {
        handleClose();
      }}
      onCloseBtnClick={() => {
        handleClose();
      }}
      onSubmitBtnClick={handleSubmitClick}
    >
      <Box paddingY={3} paddingX={3}>
        <DropdownComponent
          label="Available Batches"
          options={batchesForDropdown}
          onChange={(val) => {
            console.log(val, " --- this is val");
            setMapTrainerDetails({ ...mapTrainerDetails, batchId: val?.id });
            setDropDownValue({ ...val });
          }}
          value={dropDownValue}
          error={mapTrainerErrorObj.dropDownValue}
          helperText={mapTrainerErrorObj.dropDownValue}
        />
      </Box>
    </ModalComponent>
  );
};

export default MapTrainerModalComponent;
