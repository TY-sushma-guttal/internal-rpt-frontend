import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AddFeedbackModal from "../../components/forms/MockModule/AddFeedbackModal";
import { getMockDetailsById } from "../../services/mockModule/mockModule";
import TableComponent from "../../components/molecules/TableComponent/TableComponent";
import { Box, Tooltip } from "@mui/material";
import AddchartIcon from "@mui/icons-material/Addchart";

const TABLE_COLUMNS = [
  {
    id: "col1",
    label: "Candidate Name",
    minWidth: 120,
    align: "center",
    sort: false,
  },
  {
    id: "col2",
    label: "Email Id",
    minWidth: 120,
    align: "center",
    sort: false,
  },
  {
    id: "col3",
    label: "Contact Number",
    minWidth: 120,
    align: "center",
    sort: false,
  },
  {
    id: "col4",
    label: "Actions",
    minWidth: 100,
    align: "center",
    sort: false,
  },
];

function AddFeedBack() {
  const [openCandidateFeedback, setOpenCandidateFeedback] = useState(false);
  const [candidateRows, setCandidatesRows] = useState([]);
  const [selectedCandidateData, setSeletedCandidateData] = useState({
    id: null,
    data: null,
  });

  const { state } = useLocation();

  useEffect(() => {
    if (state.mockId) {
      getmockDetailsID(state.mockId);
    }
  }, [state]);

  const handleSelectedCandidate = (data, candidateId) => {
    setSeletedCandidateData({ id: candidateId, data: data });
    setOpenCandidateFeedback(true);
  };

  const feedBackAdded = (data, candidateId) => {
    let completed = false;

    data.data.trainerCandidateDetails.map((val) => {
      if (candidateId === val.candidateId && val.isCompleted === true) {
        completed = true;
      }
    });

    return completed;
  };

  const getmockDetailsID = async (mockId) => {
    const { data, error } = await getMockDetailsById(mockId);

    if (data) {
      if (data.isError) {
      } else {
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
            col2: officialMailId,
            col3: selfContactNumber,
            col4: (
              <Box
                display="flex"
                justifyContent="space-around"
                alignItems="center"
              >
                {feedBackAdded(data, candidateId) ? (
                  <Tooltip title="Feedback submited">
                    <AddchartIcon
                      className="cursor-pointer"
                      color="disabled"
                      // onClick={() => {
                      //   handleSelectedCandidate(data.data,candidateId)
                      // }}
                    />
                  </Tooltip>
                ) : (
                  <Tooltip title="Add feedback">
                    <AddchartIcon
                      className="cursor-pointer"
                      color="primary"
                      onClick={() => {
                        handleSelectedCandidate(data.data, candidateId);
                      }}
                    />
                  </Tooltip>
                )}
              </Box>
            ),
          };
        });

        setCandidatesRows([...tempArray]);
      }
    } else if (error) {
    }
  };

  return (
    <>
      <TableComponent
      showHeader
      headerTitle="Candidates list"
        tableRows={candidateRows}
        tableColumns={TABLE_COLUMNS}
        showFooterButtonFilled={false}
        showFooterButtonOutlined={false}
        showPagination
        customHeight
        tableHeight={{ xs: "calc(41vh - 90px)", md: "39vh" }}
      />
      {openCandidateFeedback && (
        <AddFeedbackModal
          openCandidateFeedback={openCandidateFeedback}
          setOpenCandidateFeedback={setOpenCandidateFeedback}
          selectedCandidateData={selectedCandidateData}
          getmockDetailsID={getmockDetailsID}
        />
      )}
    </>
  );
}

export default AddFeedBack;
