import { Box, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import InputBoxComponent from "../../components/atoms/InputBoxComponent/InputBoxComponent";
import { useLocation, useNavigate } from "react-router-dom";
import { getBatchDetailsById } from "../../services/batchmodule/batchmodule";
import DatePickerComponent from "../../components/atoms/DatePickerComponent/DatePickerComponent";
import TimePickerComponent from "../../components/atoms/TimePickerComponent";
import MultiSelectComponent from "../../components/atoms/MultiSelectComponent/MultiSelectComponent";
import {
  getPanelMembers,
  postMockDetails,
} from "../../services/mockModule/mockModule";
import TableComponent from "../../components/molecules/TableComponent/TableComponent";
import {
  changeDate,
  returnProperDate,
  returnProperTime,
} from "../../commonfunctions/commonfunctions";
import { useToasts } from "react-toast-notifications";
import { regex } from "../../regex/regex";

const CANDIDATE_DETAILS_FOR_TABLE = [
  {
    id: "col1",
    label: "Candidate Name",
    minWidth: 120,
    align: "center",
    sort: false,
  },
  {
    id: "col2",
    label: "Phone Number",
    minWidth: 120,
    align: "center",
    sort: false,
  },
  {
    id: "col3",
    label: "Email Id",
    minWidth: 120,
    align: "center",
    sort: false,
  },
];

const mockDetailsErrorObj = {
  batchName: "",
  mockName: "",
  mockDescription: "",
  technologies: "",
  mockDate: "",
  mockTime: "",
  panelMembers: "",
  candidates: "",
};

function CreateMock() {
  const [mockDetails, setmockDetails] = useState({
    batchName: "",
    mockName: "",
    mockDescription: "",
    technologies: [],
    mockDate: "",
    mockTime: null,
    panelMembers: [],
    candidates: [],
  });


  const [skillsList, setskillsList] = useState([
    { id: "HTML", title: "HTML", value: "HTML" },
    { id: "CSS", title: "CSS", value: "CSS" },
    { id: "Javascript", title: "Javascript", value: "Javascript" },
    { id: "React", title: "React", value: "React" },
    { id: "Java", title: "Java", value: "Java" },
    { id: "Sql", title: "Sql", value: "Sql" },
    { id: "Spring", title: "Spring", value: "Spring" },
  ]);

  const [panelMembers, setPanelMembers] = useState([]);
  const [candidatesRows, setCandidatesRows] = useState([]);
  const [mockDetailsError, setmockDetailsError] = useState(mockDetailsErrorObj);

  console.log(panelMembers,"panelMembers");

  const { state } = useLocation();
  let navigate = useNavigate();

  useEffect(() => {
    if (state.batchID) {
      getThePanelMembers();
      batchDetailsID(state.batchID);
    }
  }, [state]);

  const { addToast } = useToasts();

  const { nameWithSpaces } = regex;

  const modifyDate = (date) => {
    let dateArr = date.split("-");

    return `${dateArr[1]}-${dateArr[0]}-${dateArr[2]}`;
  };

  const setEditPanelMembers = (mentors) =>{
    let tempArr = []
    for (const [key, value] of Object.entries(mentors)) {
      let obj = {id: key,value:value,title:value}
      console.log(obj,"object");
      tempArr.push(obj)
    }
    return tempArr
  }

  let batchDetailsID = async (selectedBatchID) => {
    let { data, error } = await getBatchDetailsById(selectedBatchID);

    if (data) {
      if (data.isError) {
      } else {
        if (state.mockData) {
          let dateTime = state.mockData.mockDate.split(" ");
          let correctDate = modifyDate(dateTime[0]);
          let correctTime = new Date([correctDate, dateTime[1]]);

          setmockDetails({
            ...mockDetails,
            mockName: state.mockData.mockName,
            mockDescription: state.mockData.mockDescription,
            mockDate: correctDate,
            mockTime: correctTime,
            panelMembers: setEditPanelMembers(state.mockData.mentors),
            batchStatus: data.data?.batchStatus,
            batchId: data.data?.batchId,
            batchName: data.data?.batchName,
            technologies: [
              ...state.mockData?.technologies.map((val) => ({
                id: val,
                title: val,
                value: val,
              })),
            ],
          });
        } else {
          setmockDetails({
            ...mockDetails,
            batchStatus: data.data?.batchStatus,
            batchId: data.data?.batchId,
            batchName: data.data?.batchName,
            technologies: [
              ...data.data?.technologies.map((val) => ({
                id: val,
                title: val,
                value: val,
              })),
            ],
          });
        }

        const tempArray = data.data?.candidateInfoLists.map((val) => {
          const {
            candidateId,
            candidateName,
            selfContactNumber,
            officialMailId,
          } = val;
          return {
            id: candidateId,
            col1: candidateName,
            col2: selfContactNumber,
            col3: officialMailId,
          };
        });

        setCandidatesRows([...tempArray]);
      }
    }
  };

  const getThePanelMembers = async () => {
    let { data, error } = await getPanelMembers();

    if (data) {
      if (data.isError) {
      } else {
        let tempData = data.data.map((val) => ({
          id: val.mentorId,
          title: val.mentorName,
          value: val.mentorName,
        }));
        setPanelMembers([...tempData]);
      }
    }
  };

  const handleMockDetailsError = () => {
    let mockDetailError = {
      batchName: "",
      mockName: "",
      mockDescription: "",
      technologies: "",
      mockDate: "",
      mockTime: "",
      panelMembers: "",
      candidates: "",
    };
    let {
      batchName,
      candidates,
      mockDate,
      mockDescription,
      mockName,
      mockTime,
      panelMembers,
      technologies,
    } = mockDetails;
console.log(mockTime,mockDate);
    let isError = false;

    if (mockName.trim() === "") {
      mockDetailError.mockName = "This field is required";
      isError = true;
    } else if (!nameWithSpaces.test(mockName)) {
      mockDetailError.mockName = "Invalid mock name";
      isError = true;
    }
    if (batchName.trim() === "") {
      mockDetailError.batchName = "This field is required";
      isError = true;
    }
    if (mockDescription.trim() === "") {
      mockDetailError.mockDescription = "This field is required";
      isError = true;
    } else if (!nameWithSpaces.test(mockDescription)) {
      mockDetailError.mockDescription = "Invalid description";
      isError = true;
    }
    if (mockDate === "") {
      mockDetailError.mockDate = "This field is required";
      isError = true;
    }else if(returnProperDate(mockDate) < returnProperDate(new Date())){
      mockDetailError.mockDate = "Please select correct Date";
      isError = true;
    }
    if (mockTime === null) {
      mockDetailError.mockTime = "This field is required";
      isError = true;
    }else if(returnProperDate(mockDate) <= returnProperDate(new Date()) && mockTime < new Date()){
      mockDetailError.mockTime = "please provide a valid time";
      isError = true; 
    }
    if (candidates.length === 0) {
      mockDetailError.candidates = "This field is required";
      isError = true;
    }
    if (panelMembers.length === 0) {
      mockDetailError.panelMembers = "This field is required";
      isError = true;
    } else if (panelMembers.length > candidates.length) {
      mockDetailError.panelMembers =
        "panel members cannot be more than candidates";
      isError = true;
    }
    if (technologies.length === 0) {
      mockDetailError.technologies = "This field is required";
      isError = true;
    }
    setmockDetailsError({ ...mockDetailError });
    return isError;
  };

  const handleCreateMock = () => {
    if (!handleMockDetailsError()) {
      createPayloadAndCallApi();
    }
  };

  const createPayloadAndCallApi = async () => {
    const {
      candidates,
      mockDate,
      mockDescription,
      mockName,
      mockTime,
      panelMembers,
      technologies,
      batchId,
      batchStatus,
    } = mockDetails;

    const mentors = {};
    panelMembers.map((member) => {
      mentors[member.id] = member.value;
      return null;
    });
    const payload = {
      mockName: mockName,
      mockDescription: mockDescription,
      mockDate: `${returnProperDate(new Date(mockDate))} ${returnProperTime(mockTime)}`,
      isDelete: false,
      technologies: technologies.map((tech) => tech.value),
      batchDetailsId: batchId,
      candidateInfoIds: candidates.map((candidate) => candidate),
      batchStatuses: [batchStatus],
      mentors: mentors,
    };

    payload.mockId =  state.type ==="create" ? null : state.mockData.mockId; 

    let { data, error } = await postMockDetails(payload);

    if (data) {
      if (data.isError) {
        addToast(data.isError, { appearance: "error" });
      } else {
        addToast(data.message, { appearance: "success" });
        navigate("/mocklist");
      }
    } else if (error) {
      addToast(error?.response?.data?.message, { appearance: "error" });
    }
  };

  let handleTextInputChange = (e) => {
    setmockDetails({
      ...mockDetails,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Box paddingX={5} marginBottom={3} >
      <Box marginTop={2}>
        <Typography textAlign="center" variant="h4">
          {state.type === "create" ? "Create Mock" : "Edit Mock"}
        </Typography>
      </Box>
      <Grid marginTop={1} container spacing={2}>
        <Grid item xs={6} md={4}>
          <InputBoxComponent
            name="batchName"
            disabled={true}
            label="Batch Name"
            value={mockDetails.batchName}
            variant="outlined"
            error={mockDetailsError.batchName}
            helperText={mockDetailsError.batchName}
          />
        </Grid>
        <Grid item xs={6} md={4}>
          <InputBoxComponent
            name="mockName"
            label="Mock Name"
            value={mockDetails.mockName}
            variant="outlined"
            onChange={(e) => {
              handleTextInputChange(e);
            }}
            error={mockDetailsError.mockName}
            helperText={mockDetailsError.mockName}
          />
        </Grid>
        <Grid item xs={6} md={4}>
          <InputBoxComponent
            name="mockDescription"
            label="Mock Description"
            value={mockDetails.mockDescription}
            variant="outlined"
            onChange={(e) => {
              handleTextInputChange(e);
            }}
            error={mockDetailsError.mockDescription}
            helperText={mockDetailsError.mockDescription}
          />
        </Grid>

        <Grid item xs={6} md={4}>
          <DatePickerComponent
            inputlabelshrink
            name="mockDate"
            size="small"
            label="Mock Date"
            value={mockDetails.mockDate}
            variant="outlined"
            onDateChange={(val) => {
              setmockDetails({
                ...mockDetails,
                mockDate: val,
              });
            }}
            error={mockDetailsError.mockDate}
            helperText={mockDetailsError.mockDate}
          />
        </Grid>
        <Grid item xs={6} md={4}>
          <TimePickerComponent
            label="Mock Time"
            value={mockDetails.mockTime}
            inputlabelshrink
            onChange={(val) => {
              setmockDetails({
                ...mockDetails,
                mockTime: val,
              });
            }}
            errorText={mockDetailsError.mockTime}
          />
        </Grid>
        <Grid item xs={6} md={4}>
          <MultiSelectComponent
            list={skillsList}
            label="Technologies"
            value={mockDetails.technologies}
            onSelectionChange={(e, val) => {
              setmockDetails({
                ...mockDetails,
                technologies: [...val],
              });
            }}
            error={mockDetailsError.technologies}
            helperText={mockDetailsError.technologies}
          />
        </Grid>

        <Grid item xs={6} md={4}>
          <MultiSelectComponent
            list={panelMembers}
            label="Panel Members"
            value={mockDetails.panelMembers}
            onSelectionChange={(e, val) => {
              setmockDetails({
                ...mockDetails,
                panelMembers: [...val],
              });
            }}
            error={mockDetailsError.panelMembers}
            helperText={mockDetailsError.panelMembers}
          />
        </Grid>
      </Grid>
      <TableComponent
        showCheckbox
        tableRows={candidatesRows}
        tableColumns={CANDIDATE_DETAILS_FOR_TABLE}
        onSelectionChange={(val) => {
          const tempArray = [...val];
          setmockDetails({ ...mockDetails, candidates: [...tempArray] });
        }}
        showSubmit
        submitButtonLabel={state.type==="create" ?"Create Mock": "Edit Mock"}
        handleSubmit={handleCreateMock}
        showFooterButtonFilled={false}
        showFooterButtonOutlined={false}
        showPagination
        customHeight
        tableHeight={{ xs: "calc(41vh - 90px)", md: "39vh" }}
      />
    </Box>
  );
}

export default CreateMock;
