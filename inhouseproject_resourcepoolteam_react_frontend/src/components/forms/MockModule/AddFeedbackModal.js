import React, { useEffect, useState } from "react";
import ModalComponent from "../../molecules/ModalComponent";
import { Box, Grid } from "@mui/material";
import InputBoxComponent from "../../atoms/InputBoxComponent/InputBoxComponent";
import DatePickerComponent from "../../atoms/DatePickerComponent/DatePickerComponent";
import MultiSelectComponent from "../../atoms/MultiSelectComponent/MultiSelectComponent";
import DropdownComponent from "../../atoms/DropdownComponent/DropdownComponent";
import TextAreaComponent from "../../atoms/TextAreaComponent/TextAreaComponent";
import { postMockFeedback } from "../../../services/mockModule/mockModule";
import { useToasts } from "react-toast-notifications";
import { regex } from "../../../regex/regex";

const skillList = [
  { id: "HTML", title: "HTML", value: "HTML" },
  { id: "CSS", title: "CSS", value: "CSS" },
  { id: "Javascript", title: "Javascript", value: "Javascript" },
  { id: "React", title: "React", value: "React" },
  { id: "Java", title: "Java", value: "Java" },
  { id: "Sql", title: "Sql", value: "Sql" },
  { id: "Spring", title: "Spring", value: "Spring" },
];

const candidateFeedbackErrorObj = {
  candidateName: "",
  mockTakenBy: "",
  mockDate: "",
  technologies: "",
  practicalKnowledge: "",
  theoreticalKnowledge: "",
  overallFeedback: "",
  detailedFeedback: "",
};

function AddFeedbackModal({
  openCandidateFeedback,
  setOpenCandidateFeedback,
  selectedCandidateData,
  getmockDetailsID,
}) {
  const [candidateData, setcandidateData] = useState({
    candidateName: "",
    mockTakenBy: "",
    mockDate: "",
    technologies: [],
    practicalKnowledge: "",
    theoreticalKnowledge: "",
    overallFeedback: { label: "", id: 0 },
    detailedFeedback: "",
  });

  const [candidateFeedbackError, setCandidateFeedbackError] = useState(
    candidateFeedbackErrorObj
  );

  useEffect(() => {
    const { id, data } = selectedCandidateData;
    console.log(data, id, "data------");
    getCandidateData(data, id);
  }, [selectedCandidateData]);

  const { addToast } = useToasts();

  const modifyDate = (date) => {
    let dateArr = date.split("-");

    return `${dateArr[1]}-${dateArr[0]}-${dateArr[2]}`;
  };

  const setTrainerId = (mentors, data, id) => {
    let result = data.trainerCandidateDetails.map((trainer) => {
      for (const [key, value] of Object.entries(mentors)) {
        if (trainer.trainerName === value && trainer.candidateId === id) {
          return key;
        }
      }
    });
    return result.filter((name) => name !== undefined);
  };

  const getCandidateData = (data, id) => {
    data.candidateInfoLists?.map((candidate) => {
      if (candidate.candidateId === id) {
        setcandidateData({
          ...candidateData,
          mockId: data.mockId,
          candidateId: id,
          candidateName: candidate.candidateName,
          mockTakenBy: data.trainerCandidateDetails
            ?.map((candidate) => {
              if (candidate.candidateId === id) {
                return candidate.trainerName;
              }
            })
            .filter((trainer) => trainer !== undefined),
          mockDate: modifyDate(data.mockDate),
          technologies: data?.technologies?.map((tech) => ({
            id: tech,
            value: tech,
            title: tech,
          })),
          trainerId: setTrainerId(data.mentors, data, id),
        });
      }
    });
  };

  const handleTextInputChange = (event) => {
    setcandidateData({
      ...candidateData,
      [event.target.name]: event.target.value,
    });
  };

  const closeCandidateFeedbackModal = () => {
    setOpenCandidateFeedback(false);
    clearAllFields()
  };

  const clearAllFields = () => {
    setcandidateData({
      ...candidateData,
      practicalKnowledge: "",
      theoreticalKnowledge: "",
      overallFeedback: { label: "", id: 0 },
      detailedFeedback: "",
    });
  };

  const { numberRegex } = regex;

  const handleError = () => {
    const candidateFeedbackErrorObj = {
      candidateName: "",
      mockTakenBy: "",
      mockDate: "",
      technologies: "",
      practicalKnowledge: "",
      theoreticalKnowledge: "",
      overallFeedback: "",
      detailedFeedback: "",
    };
    const {
      candidateName,
      detailedFeedback,
      mockDate,
      mockTakenBy,
      overallFeedback,
      practicalKnowledge,
      technologies,
      theoreticalKnowledge,
    } = candidateData;

    let isError = false;

    if (candidateName.trim() === "") {
      candidateFeedbackErrorObj.candidateName = "This field is required";
      isError = true;
    }
    if (mockTakenBy === "") {
      candidateFeedbackErrorObj.mockTakenBy = "This field is required";
      isError = true;
    }
    if (mockDate === "") {
      candidateFeedbackErrorObj.mockDate = "This field is required";
      isError = true;
    }
    if (technologies === null) {
      candidateFeedbackErrorObj.technologies = "This field is required";
      isError = true;
    }
    if (practicalKnowledge.trim() === "") {
      candidateFeedbackErrorObj.practicalKnowledge = "This field is required";
      isError = true;
    } else if (!numberRegex.test(practicalKnowledge)) {
      candidateFeedbackErrorObj.practicalKnowledge =
        "Only numbers are allowed (out of 100)";
      isError = true;
    }
    if (theoreticalKnowledge.trim() === "") {
      candidateFeedbackErrorObj.theoreticalKnowledge = "This field is required";
      isError = true;
    } else if (!numberRegex.test(theoreticalKnowledge)) {
      candidateFeedbackErrorObj.theoreticalKnowledge =
        "Only numbers are allowed (out of 100)";
      isError = true;
    }
    if (overallFeedback.label === "") {
      candidateFeedbackErrorObj.overallFeedback = "This field is required";
      isError = true;
    }
    if (detailedFeedback === "") {
      candidateFeedbackErrorObj.detailedFeedback = "This field is required";
      isError = true;
    }

    setCandidateFeedbackError({ ...candidateFeedbackErrorObj });
    return isError;
  };

  const submitCandidateFeedback = () => {
    if (!handleError()) {
      createPayloadAndCallApi();
    }
  };

  const createPayloadAndCallApi = async () => {
    const payload = {
      mockId: candidateData.mockId,
      candidateId: candidateData.candidateId,
      trainerName: candidateData.mockTakenBy[0],
      practical: candidateData.practicalKnowledge,
      theoritical: candidateData.theoreticalKnowledge,
      feedback: candidateData.overallFeedback.label,
      remark: candidateData.detailedFeedback,
    };

    const { data, error } = await postMockFeedback(
      payload,
      candidateData.trainerId[0]
    );

    if (data) {
      if (data.isError) {
        addToast(data.isError, { appearance: "error" });
      } else {
        addToast(data.data, { appearance: "success" });
        getmockDetailsID(candidateData.mockId);
        closeCandidateFeedbackModal();
      }
    } else if (error) {
      addToast(error?.response?.data?.message, { appearance: "error" });
    }
  };

  return (
    <ModalComponent
      open={openCandidateFeedback}
      onCancelBtnClick={closeCandidateFeedbackModal}
      onCloseBtnClick={closeCandidateFeedbackModal}
      onClearBtnClick={clearAllFields}
      onSubmitBtnClick={submitCandidateFeedback}
      modalTitle="Add Feedback"
    >
      <Box paddingX={5} marginBottom={3}>
        <Grid marginTop={1} container spacing={2}>
          <Grid item xs={6}>
            <InputBoxComponent
              label="Candidate Name"
              value={candidateData.candidateName}
              disabled
              error={candidateFeedbackError.candidateName}
              helperText={candidateFeedbackError.candidateName}
            />
          </Grid>
          <Grid item xs={6}>
            <InputBoxComponent
              label="Mock Taken By"
              value={candidateData.mockTakenBy}
              disabled
              error={candidateFeedbackError.mockTakenBy}
              helperText={candidateFeedbackError.mockTakenBy}
            />
          </Grid>
          <Grid item xs={6}>
            <DatePickerComponent
              label="Mock Date"
              inputlabelshrink
              value={candidateData.mockDate}
              size="small"
              disabled
              error={candidateFeedbackError.mockDate}
              helperText={candidateFeedbackError.mockDate}
            />
          </Grid>
          <Grid item xs={6}>
            <MultiSelectComponent
              list={skillList}
              label="Technologies"
              value={candidateData.technologies}
              disabled
              // onSelectionChange={(e, val) => {
              //   setmockDetails({
              //     ...mockDetails,
              //     technologies: [...val],
              //   });
              // }}
              error={candidateFeedbackError.technologies}
              helperText={candidateFeedbackError.technologies}
            />
          </Grid>
          <Grid item xs={6}>
            <InputBoxComponent
              label="Practical Knowledge (Out of 100)"
              name="practicalKnowledge"
              value={candidateData.practicalKnowledge}
              onChange={(event) => {
                handleTextInputChange(event);
              }}
              error={candidateFeedbackError.practicalKnowledge}
              helperText={candidateFeedbackError.practicalKnowledge}
            />
          </Grid>
          <Grid item xs={6}>
            <InputBoxComponent
              label="Theoretical Knowledge (Out of 100)"
              name="theoreticalKnowledge"
              value={candidateData.theoreticalKnowledge}
              onChange={(event) => {
                handleTextInputChange(event);
              }}
              error={candidateFeedbackError.theoreticalKnowledge}
              helperText={candidateFeedbackError.theoreticalKnowledge}
            />
          </Grid>
          <Grid item xs={6}>
            <DropdownComponent
              options={[
                { label: "Failed", id: 1 },
                { label: "Below Average", id: 2 },
                { label: "Average", id: 3 },
                { label: "Above Average", id: 4 },
                { label: "Good", id: 5 },
                { label: "Excellent", id: 6 },
              ]}
              label="Overall Feedback"
              onChange={(val) => {
                setcandidateData({
                  ...candidateData,
                  overallFeedback: { ...val },
                });
              }}
              value={candidateData.overallFeedback}
              error={candidateFeedbackError.overallFeedback}
              helperText={candidateFeedbackError.overallFeedback}
            />
          </Grid>
          <Grid item xs={6}>
            <TextAreaComponent
              label="Detailed Feedback"
              name="detailedFeedback"
              rows={2}
              value={candidateData.detailedFeedback}
              onChange={(event) => {
                handleTextInputChange(event);
              }}
              error={candidateFeedbackError.detailedFeedback}
              helperText={candidateFeedbackError.detailedFeedback}
            />
          </Grid>
        </Grid>
      </Box>
    </ModalComponent>
  );
}

export default AddFeedbackModal;
