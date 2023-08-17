import React, { useEffect, useState } from "react";
import ModalComponent from "../../../molecules/ModalComponent";
import { Box, Grid, Tooltip, Typography } from "@mui/material";
import InputBoxComponent from "../../../atoms/InputBoxComponent/InputBoxComponent";
import MultiSelectComponent from "../../../atoms/MultiSelectComponent/MultiSelectComponent";
import { saveBatchDetails } from "../../../../services/batchmodule/batchmodule";
import { useToasts } from "react-toast-notifications";
import CheckBoxComponentTwo from "../../../atoms/CheckBoxComponentTwo/CheckBoxComponentTwo";
import { regex } from "../../../../regex/regex";
import DatePickerComponent from "../../../atoms/DatePickerComponent/DatePickerComponent";
import DropdownComponent from "../../../atoms/DropdownComponent/DropdownComponent";
import { getAllAvailableTrainer } from "../../../../services/trainermodule/trainermodule";
import moment from "moment/moment";
import {
  datePickerFormat,
  formatDateToBackEndReqirement,
  getLocalTime,
} from "../../../../commonfunctions/commonfunctions";

let batchRegistrationFormErrorObj = {
  batchName: "",
  technologies: "",
  startDate: "",
  endDate: "",
};

function BatchRegistrationModal({
  batchModal,
  closeBatchModal,
  batchModalType,
  getAllTheBatchDetails,
  batchModalData,
  setbatchModalType,
}) {
  const [batchRegistrationForm, setbatchRegistrationForm] = useState({
    batchName: "",
    batchStatus: "",
    technologies: [],
    startDate: null,
    endDate: null,
    trainer: {},
  });

  const [trainerDropdown, settrainerDropdown] = useState([]);
  const [batchStatusCheckbox, setbatchStatusCheckbox] = useState("");
  const [skillsList, setskillsList] = useState([
    { id: "HTML", title: "HTML", value: "HTML" },
    { id: "CSS", title: "CSS", value: "CSS" },
    { id: "Javascript", title: "Javascript", value: "Javascript" },
    { id: "React", title: "React", value: "React" },
    { id: "Java", title: "Java", value: "Java" },
    { id: "Sql", title: "Sql", value: "Sql" },
  ]);

  const [batchRegistrationFormError, setbatchRegistrationFormError] = useState(
    batchRegistrationFormErrorObj
  );

  const { nameWithSpacesAndNumbers } = regex;

  let { addToast } = useToasts();
  // validation
  const handleBatchDetailsError = () => {
    let batchRegistrationFormErrorObj = {
      batchName: "",
      technologies: "",
    };

    let theError = false;

    let { batchName, technologies } = batchRegistrationForm;

    if (batchName.trim() === "") {
      batchRegistrationFormErrorObj.batchName = "This field is required";
      theError = true;
    } else if (batchName.length > 20) {
      batchRegistrationFormErrorObj.batchName = "Upto 20 characters allowed";
      theError = true;
    } else if (!nameWithSpacesAndNumbers.test(batchName.trim())) {
      batchRegistrationFormErrorObj.batchName =
        "Only numbers and alphabets are allowed";
      theError = true;
    }

    if (technologies?.length === 0) {
      batchRegistrationFormErrorObj.technologies = "This field is required";
      theError = true;
    }

    setbatchRegistrationFormError({ ...batchRegistrationFormErrorObj });

    return theError;
  };

  const handleTextInputChange = (e) => {
    setbatchRegistrationForm({
      ...batchRegistrationForm,
      [e.target.name]: e.target.value,
    });
  };

  let clearAllField = () => {
    setbatchRegistrationForm({
      batchName: "",
      batchStatus: "",
      technologies: [],
      startDate: null,
      endDate: null,
      trainer: {},
    });

    setbatchStatusCheckbox("");
  };

  let clearAll = () => {
    clearAllField();
    clearValidationFields();
  };

  let clearValidationFields = () => {
    setbatchRegistrationFormError(batchRegistrationFormErrorObj);
  };

  let submitBatchDetails = () => {
    if (!handleBatchDetailsError()) {
      createPayloadAndCallApi();
    }
  };

  useEffect(() => {
    // trainer dropdown
    getAvailableTrainerDropdown();

    if (batchModalType === "EDIT") {
    
      let tempTechnologies = [];
      if (batchModalData.technologies?.length > 0) {
        batchModalData.technologies.map((val) => {
          return tempTechnologies.push({ id: val, title: val, value: val });
        });
      }

      setbatchRegistrationForm({
        batchStatus: batchModalData.batchStatus,
        batchId: batchModalData?.batchId,
        batchName: batchModalData?.batchName,
        technologies: tempTechnologies,
        trainer: {
          id: batchModalData?.trainerId,
          label: batchModalData?.trainerName,
        },
        startDate: datePickerFormat(batchModalData?.startDate),
        endDate: datePickerFormat(batchModalData?.endDate),
      });

      setbatchStatusCheckbox(batchModalData.batchStatus);
    }
  }, [batchModalData]);

  let createPayloadAndCallApi = async () => {
    let addPayload = {
      batchName: batchRegistrationForm.batchName,
      technologies: batchRegistrationForm.technologies.map((val) => val.title),
      trainerId: batchRegistrationForm?.trainer.id,
      startDate:
        formatDateToBackEndReqirement(batchRegistrationForm?.startDate) +
        " " +
        getLocalTime(),
      endDate:
        formatDateToBackEndReqirement(batchRegistrationForm?.endDate) +
        " " +
        getLocalTime(),
    };

    let editPayload = {
      batchStatus: batchStatusCheckbox,
      batchId: batchRegistrationForm.batchId,
      batchName: batchRegistrationForm.batchName,
      technologies: batchRegistrationForm.technologies.map((val) => val.title),
      trainerId: batchRegistrationForm.trainer.id,
      startDate:
        formatDateToBackEndReqirement(batchRegistrationForm?.startDate) +
        " " +
        getLocalTime(),
      endDate:
        formatDateToBackEndReqirement(batchRegistrationForm?.endDate) +
        " " +
        getLocalTime(),
    };
    let { data, error } =
      batchModalType === "ADD"
        ? await saveBatchDetails(addPayload)
        : await saveBatchDetails(editPayload);
    if (data) {
      if (data.isError) {
        addToast(data.message, { appearance: "info" });
      } else {
        addToast(data.message, { appearance: "success" });
        getAllTheBatchDetails();
        closeBatchModal();
        clearAllField();
        setbatchModalType("");
      }
    } else if (error) {
      addToast(data.message, { appearance: "error" });
    }
  };

  useEffect(() => {
    clearValidationFields();
    clearAllField();
  }, [batchModalType, batchModal]);

  let handleBatchStatus = (checkType) => {
    if (batchStatusCheckbox === "CREATED" && checkType === "markOngoing") {
      setbatchStatusCheckbox("ONGOING");
    } else if (
      checkType === "markOngoing" &&
      batchStatusCheckbox === "ONGOING"
    ) {
      setbatchStatusCheckbox("CREATED");
    }

    if (batchStatusCheckbox === "ONGOING" && checkType === "markCompleted") {
      setbatchStatusCheckbox("COMPLETED");
    } else if (
      checkType === "markCompleted" &&
      batchStatusCheckbox === "COMPLETED"
    ) {
      setbatchStatusCheckbox("ONGOING");
    }
  };

  const getAvailableTrainerDropdown = async () => {
    const { data, error } = await getAllAvailableTrainer();
    if (data) {
      if (data.isError) {
      } else {
        const tempArrayTwo = data.data.map((val) => {
          const { trainerId, name } = val;
          return { id: trainerId, label: name };
        });

        settrainerDropdown([...tempArrayTwo]);
      }
    }
  };

  console.log("batchRegistrationForm", batchRegistrationForm);

  return (
    <>
      <ModalComponent
        open={batchModal}
        onCloseBtnClick={closeBatchModal}
        onCancelBtnClick={closeBatchModal}
        modalTitle={
          batchModalType === "ADD" ? "Add Batch Details" : "Edit Batch Details"
        }
        onSubmitBtnClick={submitBatchDetails}
        onClearBtnClick={clearAll}
        modalWidth={580}
      >
        <Box marginX={3}>
          <Box marginTop={3}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <InputBoxComponent
                  label="Batch name"
                  name="batchName"
                  value={batchRegistrationForm.batchName}
                  onChange={(e) => {
                    handleTextInputChange(e);
                  }}
                  error={batchRegistrationFormError.batchName}
                  helperText={batchRegistrationFormError.batchName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <MultiSelectComponent
                  list={skillsList}
                  label="Technologies"
                  name="technologies"
                  value={batchRegistrationForm.technologies}
                  onSelectionChange={(e, val) => {
                    setbatchRegistrationForm({
                      ...batchRegistrationForm,
                      technologies: [...val],
                    });
                  }}
                  error={batchRegistrationFormError.technologies}
                  helperText={batchRegistrationFormError.technologies}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePickerComponent
                  value={batchRegistrationForm.startDate}
                  inputlabelshrink
                  label="Start Date"
                  size="small"
                  onDateChange={(val) => {
                    setbatchRegistrationForm({
                      ...batchRegistrationForm,
                      startDate: val,
                    });
                  }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePickerComponent
                  value={batchRegistrationForm.endDate}
                  inputlabelshrink
                  label="End Date"
                  size="small"
                  onDateChange={(val) => {
                    setbatchRegistrationForm({
                      ...batchRegistrationForm,
                      endDate: val,
                    });
                  }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DropdownComponent
                  label="Trainer Name"
                  options={trainerDropdown}
                  onChange={(val) => {
                    setbatchRegistrationForm({
                      ...batchRegistrationForm,
                      trainer: val,
                    });
                  }}
                  value={batchRegistrationForm.trainer}
                  // error={candidateOnBoardDetailsError.candidateName}
                  // helperText={candidateOnBoardDetailsError.candidateName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                {batchRegistrationForm.batchStatus === "CREATED" ? (
                  <CheckBoxComponentTwo
                    label="Mark batch status as ongoing"
                    onChange={() => {
                      handleBatchStatus("markOngoing");
                    }}
                    checked={batchStatusCheckbox === "ONGOING" ? true : false}
                  />
                ) : batchRegistrationForm.batchStatus === "ONGOING" ? (
                  <CheckBoxComponentTwo
                    label="Mark batch status as completed"
                    onChange={() => {
                      handleBatchStatus("markCompleted");
                    }}
                    checked={batchStatusCheckbox === "COMPLETED" ? true : false}
                  />
                ) : (
                  ""
                )}
              </Grid>
            </Grid>
          </Box>
        </Box>
      </ModalComponent>
    </>
  );
}

export default BatchRegistrationModal;
