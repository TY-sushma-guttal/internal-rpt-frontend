import { useState, useEffect } from "react";
import InputBoxComponent from "../../../atoms/InputBoxComponent/InputBoxComponent";
import ModalComponent from "../../../molecules/ModalComponent";
import { Box, Grid, Typography } from "@mui/material";
import { postCandidateDetails } from "../../../../services/candidateOnboardDetails/candidateOnBoardDetails";
import { useToasts } from "react-toast-notifications";
import DatePickerComponent from "../../../atoms/DatePickerComponent/DatePickerComponent";
import { regex } from "../../../../regex/regex";
import DropdownComponent from "../../../atoms/DropdownComponent/DropdownComponent";
import { getBatchNameDropdown } from "../../../../services/batchmodule/batchmodule";
import { getCandidateInfoById } from "../../../../services/candidateregistration/candidateregistration";

const maxBatchStrength = 99;

let candidateOnBoardDetailsErrorObj = {
  candidateName: "",
  candidateId: "",
  batchName: "",
  batchStartDate: "",
  employmentDate: "",
  totalStrength: "",
  availableBatchStrength: "",
  loi: "",
  loginCredential: "",
  documentCheck: "",
  experienceLetter: "",
  stipend: "",
  appraisal: "",
};

const SaveCandidateOnBoardDetailsModal = ({
  candidateOnBoardDetailsFormData,
  setCandidateOnBoardDetailsFormData,
  openCandidateonBoard,
  setOpenCandidateonBoard,
  modalType,
  getTheCandidateDetails,
  batchNames,
  candidateData,
}) => {
  const { addToast } = useToasts();
  let {
    candidateId,
    candidateName,
    batchName,
    batchStartDate,
    employmentDate,
    totalStrength,
    availableBatchStrength,
    loi,
    loginCredential,
    documentCheck,
    experienceLetter,
    stipend,
    appraisal,
  } = candidateOnBoardDetailsFormData;

  // console.log(
  //   candidateOnBoardDetailsFormData,
  //   "---candidateOnBoardDetailsFormData"
  // );

  const changeDate = (aDate) => {
    let date = new Date(aDate);

    let getdate = date.getDate() >= 10 ? date.getDate() : `0${date.getDate()}`;
    let getmonth =
      date.getMonth() + 1 >= 10
        ? date.getMonth() + 1
        : `0${date.getMonth() + 1}`;
    let year = date.getFullYear();

    return `${getdate}-${getmonth}-${year}`;
  };

  // batchStartDate = changeDate(batchStartDate);

  // employmentDate = changeDate(employmentDate);

  // console.log(batchStartDate);

  const [candidateOnBoardDetailsError, setCandidateOnBoardDetailsError] =
    useState(candidateOnBoardDetailsErrorObj);

  //   const handleTextInputChange = (e) => {
  //   setCandidateOnBoardDetailsFormData({
  //     ...candidateOnBoardDetailsFormData,
  //     [e.target.name]: e.target.value,
  //   });
  // };

  const { numberRegex } = regex;

  const handleCandidateDataError = () => {
    const candidateOnboardDetailsError = {
      candidateId: "",
      batchName: "",
      batchStartDate: "",
      employmentDate: "",
      totalStrength: "",
      availableBatchStrength: "",
      loi: "",
      loginCredential: "",
      documentCheck: "",
      experienceLetter: "",
      stipend: "",
      appraisal: "",
    };

    let theError = false;

    if (!candidateId) {
      candidateOnboardDetailsError.candidateId = "This field is required";
      theError = true;
    }

    if (!batchName) {
      candidateOnboardDetailsError.batchName = "This field is required";
      theError = true;
    }

    // if (batchStartDate === "") {
    //   candidateOnboardDetailsError.batchStartDate = "This field is required";
    //   theError = true;
    // }

    if (employmentDate === "") {
      candidateOnboardDetailsError.employmentDate = "This field is required";
      theError = true;
    }

    if (totalStrength === "") {
      candidateOnboardDetailsError.totalStrength = "This field is required";
      theError = true;
    } else if (!numberRegex.test(totalStrength)) {
      candidateOnboardDetailsError.totalStrength = "Only numbers are allowed";
      theError = true;
    }

    // if (availableBatchStrength === "") {
    //   candidateOnboardDetailsError.availableBatchStrength =
    //     "This field is required";
    //   theError = true;
    // } else if (!numberRegex.test(availableBatchStrength)) {
    //   candidateOnboardDetailsError.availableBatchStrength =
    //     "Only numbers are allowed";
    //   theError = true;
    // }

    if (!loi) {
      candidateOnboardDetailsError.loi = "This field is required";
      theError = true;
    }
    if (!loginCredential) {
      candidateOnboardDetailsError.loginCredential = "This field is required";
      theError = true;
    }
    if (!documentCheck) {
      candidateOnboardDetailsError.documentCheck = "This field is required";
      theError = true;
    }

    if (!experienceLetter) {
      candidateOnboardDetailsError.experienceLetter = "This field is required";
      theError = true;
    }

    if (!stipend) {
      candidateOnboardDetailsError.stipend = "This field is required";
      theError = true;
    }

    if (!appraisal) {
      candidateOnboardDetailsError.appraisal = "This field is required";
      theError = true;
    }

    setCandidateOnBoardDetailsError({ ...candidateOnboardDetailsError });
    return theError;
  };

  const clearAllFields = () => {
    setCandidateOnBoardDetailsFormData({
      candidateId: "",
      batchName: { label: "", id: 0 },
      batchStartDate: null,
      employmentDate: null,
      totalStrength: "",
      availableBatchStrength: "",
      loi: { label: "", id: 0 },
      loginCredential: { label: "", id: 0 },
      documentCheck: { label: "", id: 0 },
      experienceLetter: { label: "", id: 0 },
      stipend: { label: "", id: 0 },
      appraisal: { label: "", id: 0 },
    });
  };

  const closeCandidateModal = () => {
    setOpenCandidateonBoard(false);
    clearAllFields();
  };

  const handleSubmitButton = () => {
    if (!handleCandidateDataError()) {
      createPayloadAndCallApi();
      setOpenCandidateonBoard(false);
      clearAllFields();
    }
  };

  const returnProperDate = (aDate) => {
    let date = new Date(aDate);
    return `${date.getDate() >= 10 ? date.getDate() : `0${date.getDate()}`}-${
      date.getMonth() + 1 >= 10
        ? date.getMonth() + 1
        : `0${date.getMonth() + 1}`
    }-${date.getFullYear()}`;
  };

  const createPayloadAndCallApi = async () => {
    let payload = {
      candidateId: candidateOnBoardDetailsFormData.candidateId,
      candidateName: candidateOnBoardDetailsFormData.candidateName.label,
      batchName: candidateOnBoardDetailsFormData.batchName.label,
      batchStartDate: returnProperDate(
        candidateOnBoardDetailsFormData.batchStartDate
      ),
      employmentDate: returnProperDate(
        candidateOnBoardDetailsFormData.employmentDate
      ),
      totalStrength: candidateOnBoardDetailsFormData.totalStrength,
      availableBatchStrength:
        candidateOnBoardDetailsFormData.availableBatchStrength,
      loi: candidateOnBoardDetailsFormData.loi.label,
      loginCredential: candidateOnBoardDetailsFormData.loginCredential.label,
      documentCheck: candidateOnBoardDetailsFormData.documentCheck.label,
      experienceLetter: candidateOnBoardDetailsFormData.experienceLetter.label,
      stipend: candidateOnBoardDetailsFormData.stipend.label,
      appraisal: candidateOnBoardDetailsFormData.appraisal.label,
      isDelete: false,
      mobileNumber: candidateOnBoardDetailsFormData.mobileNumber,
    };

    console.log(payload, "---this is paylaod");

    payload.onBoardId =
      modalType === "EDIT" ? candidateOnBoardDetailsFormData.onBoardId : null;

    let { data, error } = await postCandidateDetails(payload);
    if (data) {
      if (data.isError) {
        addToast(data.isError, { appearance: "error" });
      } else {
        await getTheCandidateDetails();
        addToast(data.message, { appearance: "success" });
      }
    } else if (error) {
      addToast(error?.response?.data?.message, { appearance: "error" });
    }
  };
  useEffect(() => {
    // console.log(modalType, " modaltype");
    if (modalType === "EDIT") {
      console.log(candidateOnBoardDetailsFormData.employmentDate, "emp date");
      const correctEmpDate = changeDate(
        candidateOnBoardDetailsFormData.employmentDate
      );

      const correctBatchStartDate = changeDate(
        candidateOnBoardDetailsFormData.batchStartDate
      );

      console.log(correctEmpDate, "some date");

      setCandidateOnBoardDetailsFormData({
        candidateId,
        candidateName,
        batchName,
        batchStartDate: new Date(correctBatchStartDate),
        employmentDate: new Date(correctEmpDate),
        totalStrength,
        availableBatchStrength,
        loi,
        loginCredential,
        documentCheck,
        experienceLetter,
        stipend,
        appraisal,
      });
    }
  }, [modalType]);

  const handleCandidateNameSelect = async (id) => {
    const { data, error } = await getCandidateInfoById(id);
    if (data) {
      if (data.isError) {
        console.log(data.message);
      } else {
        // console.log(data?.data);
        setCandidateOnBoardDetailsFormData({
          candidateId: data?.data?.candidateId,
          candidateName: {
            id: data?.data?.candidateId,
            label: data?.data?.candidateName,
          },
          batchName: {
            id: data?.data?.batchDetails?.batchId,
            label: data?.data?.batchDetails?.batchName,
          },
          batchStartDate: data?.data?.batchDetails?.endDate,
          employmentDate: data?.data?.batchDetails?.endDate,
          totalStrength: data?.data?.batchDetails?.candidateInfoLists.length,
          availableBatchStrength:
            maxBatchStrength -
            data?.data?.batchDetails?.candidateInfoLists.length,
          loi: candidateOnBoardDetailsFormData?.loi?.label,
          loginCredential:
            candidateOnBoardDetailsFormData?.loginCredential?.label,
          documentCheck: candidateOnBoardDetailsFormData?.documentCheck?.label,
          experienceLetter:
            candidateOnBoardDetailsFormData?.experienceLetter?.label,
          stipend: candidateOnBoardDetailsFormData?.stipend?.label,
          appraisal: candidateOnBoardDetailsFormData?.appraisal?.label,
          mobileNumber: data?.data?.selfContactNumber,
        });
      }
    } else {
      console.log(error);
    }
  };

  return (
    <ModalComponent
      open={openCandidateonBoard}
      onCancelBtnClick={closeCandidateModal}
      modalTitle={
        modalType === "ADD" ? "Add Candidate Details" : "Edit Candidate Details"
      }
      onCloseBtnClick={closeCandidateModal}
      onSubmitBtnClick={handleSubmitButton}
      onClearBtnClick={clearAllFields}
    >
      <Box paddingX={5} marginBottom={3}>
        <Grid marginTop={1} container spacing={2}>
          <Grid item xs={6} md={4}>
            <DropdownComponent
              label="Candidate Name"
              options={candidateData?.map((candidate) => {
                return {
                  label: candidate.candidateName,
                  id: candidate.candidateId,
                };
              })}
              onChange={(val) => {
                handleCandidateNameSelect(val?.id);
              }}
              value={candidateName}
              error={candidateOnBoardDetailsError.candidateName}
              helperText={candidateOnBoardDetailsError.candidateName}
            />
          </Grid>
          <Grid item xs={6} md={4}>
            <DropdownComponent
              options={batchNames.map((batch, index) => {
                return { label: batch.batchName, id: index + 1 };
              })}
              label="Batch Name"
              disabled={true}
              // onChange={(val) => {
              //   console.log(val, "....batchselected");
              //   setCandidateOnBoardDetailsFormData({
              //     ...candidateOnBoardDetailsFormData,
              //     batchName: val,
              //   });
              // }}
              value={batchName}
              error={candidateOnBoardDetailsError.batchName}
              helperText={candidateOnBoardDetailsError.batchName}
            />
          </Grid>
          <Grid item xs={6} md={4}>
            <DatePickerComponent
              inputlabelshrink
              label="Batch Start Date"
              size="small"
              disabled={true}
              // onDateChange={(val) => {
              //   console.log(val);
              //   setCandidateOnBoardDetailsFormData({
              //     ...candidateOnBoardDetailsFormData,
              //     batchStartDate: val,
              //   });
              // }}
              value={batchStartDate}
              error={candidateOnBoardDetailsError.batchStartDate}
              helperText={candidateOnBoardDetailsError.batchStartDate}
            />
          </Grid>
          <Grid item xs={6} md={4}>
            <DatePickerComponent
              inputlabelshrink
              label="Employment Date"
              size="small"
              // disabled={true}
              onDateChange={(val) => {
                console.log(val);
                setCandidateOnBoardDetailsFormData({
                  ...candidateOnBoardDetailsFormData,
                  employmentDate: val,
                });
              }}
              value={candidateOnBoardDetailsFormData.employmentDate}
              error={candidateOnBoardDetailsError.employmentDate}
              helperText={candidateOnBoardDetailsError.employmentDate}
            />
          </Grid>
          <Grid item xs={6} md={4}>
            <InputBoxComponent
              label="Total Strength"
              value={totalStrength}
              name="totalStrength"
              variant="outlined"
              disabled={true}
              // onChange={(e) => {
              //   handleTextInputChange(e);
              // }}
              error={candidateOnBoardDetailsError.totalStrength}
              helperText={candidateOnBoardDetailsError.totalStrength}
            />
          </Grid>
          <Grid item xs={6} md={4}>
            <InputBoxComponent
              label="Available Batch Strength"
              value={availableBatchStrength}
              name="availableBatchStrength"
              variant="outlined"
              disabled={true}
              // onChange={(e) => {
              //   handleTextInputChange(e);
              // }}
              // error={candidateOnBoardDetailsError.availableBatchStrength}
              helperText={candidateOnBoardDetailsError.availableBatchStrength}
            />
          </Grid>
          <Grid item xs={6} md={4}>
            <DropdownComponent
              options={[
                { label: "YES", id: 1 },
                { label: "NO", id: 2 },
              ]}
              label="LOI"
              onChange={(val) => {
                // console.log(val);
                setCandidateOnBoardDetailsFormData({
                  ...candidateOnBoardDetailsFormData,
                  loi: { ...val },
                });
              }}
              value={loi}
              error={candidateOnBoardDetailsError.loi}
              helperText={candidateOnBoardDetailsError.loi}
            />
          </Grid>
          <Grid item xs={6} md={4}>
            <DropdownComponent
              options={[
                { label: "YES", id: 1 },
                { label: "NO", id: 2 },
              ]}
              label="LogIn Credentials"
              onChange={(val) => {
                console.log(val);
                setCandidateOnBoardDetailsFormData({
                  ...candidateOnBoardDetailsFormData,
                  loginCredential: { ...val },
                });
              }}
              value={loginCredential}
              error={candidateOnBoardDetailsError.loginCredential}
              helperText={candidateOnBoardDetailsError.loginCredential}
            />
          </Grid>
          <Grid item xs={6} md={4}>
            <DropdownComponent
              options={[
                { label: "YES", id: 1 },
                { label: "NO", id: 2 },
              ]}
              label="Document Check"
              onChange={(val) => {
                // console.log(val);
                setCandidateOnBoardDetailsFormData({
                  ...candidateOnBoardDetailsFormData,
                  documentCheck: { ...val },
                });
              }}
              value={documentCheck}
              error={candidateOnBoardDetailsError.documentCheck}
              helperText={candidateOnBoardDetailsError.documentCheck}
            />
          </Grid>
          <Grid item xs={6} md={4}>
            <DropdownComponent
              options={[
                { label: "YES", id: 1 },
                { label: "NO", id: 2 },
              ]}
              label="Experience Letter"
              value={experienceLetter}
              onChange={(val) => {
                // console.log(val);
                setCandidateOnBoardDetailsFormData({
                  ...candidateOnBoardDetailsFormData,
                  experienceLetter: { ...val },
                });
              }}
              error={candidateOnBoardDetailsError.experienceLetter}
              helperText={candidateOnBoardDetailsError.experienceLetter}
            />
          </Grid>
          <Grid item xs={6} md={4}>
            <DropdownComponent
              options={[
                { label: "YES", id: 1 },
                { label: "NO", id: 2 },
              ]}
              label="Stipend"
              value={stipend}
              onChange={(val) => {
                console.log(val);
                setCandidateOnBoardDetailsFormData({
                  ...candidateOnBoardDetailsFormData,
                  stipend: { ...val },
                });
              }}
              error={candidateOnBoardDetailsError.stipend}
              helperText={candidateOnBoardDetailsError.stipend}
            />
          </Grid>
          <Grid item xs={6} md={4}>
            <DropdownComponent
              options={[
                { label: "YES", id: 1 },
                { label: "NO", id: 2 },
              ]}
              label="Appraisal"
              value={appraisal}
              onChange={(val) => {
                console.log(val);
                setCandidateOnBoardDetailsFormData({
                  ...candidateOnBoardDetailsFormData,
                  appraisal: { ...val },
                });
              }}
              error={candidateOnBoardDetailsError.appraisal}
              helperText={candidateOnBoardDetailsError.appraisal}
            />
          </Grid>
        </Grid>
      </Box>
    </ModalComponent>
  );
};

export default SaveCandidateOnBoardDetailsModal;
