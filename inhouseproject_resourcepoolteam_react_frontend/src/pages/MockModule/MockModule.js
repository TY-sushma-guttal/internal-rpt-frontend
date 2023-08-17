import { Box, Chip, IconButton, Stack, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import TableComponent from "../../components/molecules/TableComponent/TableComponent";
import {
  deleteMockById,
  getAllMockDetails,
} from "../../services/mockModule/mockModule";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddchartIcon from "@mui/icons-material/Addchart";
import { useNavigate } from "react-router-dom";
import ConfirmDelete from "../../components/molecules/ConfirmDelete";
import { useToasts } from "react-toast-notifications";

const MOCK_COLUMNS = [
  {
    id: "col1",
    label: "Mock Name",
    minWidth: 80,
    align: "center",
    sort: false,
  },
  {
    id: "col2",
    label: "Technologies",
    minWidth: 80,
    align: "center",
    sort: false,
  },
  {
    id: "col3",
    label: "Description",
    minWidth: 80,
    align: "center",
    sort: false,
  },
  {
    id: "col4",
    label: "Date & time",
    minWidth: 80,
    align: "center",
    sort: false,
  },
  {
    id: "col5",
    label: "Panel members",
    minWidth: 80,
    align: "center",
    sort: false,
  },
  {
    id: "col6",
    label: "Actions",
    minWidth: 100,
    align: "center",
    sort: false,
  },
];
function MockModule() {
  const [tableRows, setTableRows] = useState([]);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState({
    openModal: false,
    id: null,
  });

  const navigate = useNavigate();
  const { addToast } = useToasts();

  useEffect(() => {
    getAllTheMockDetails();
  }, []);

  const handleConfirmDeleteModal = (id) => {
    setConfirmDeleteModal({ openModal: false, id: id });
    handleDelete(id);
  };

  const handleDelete = async (id) => {
    const { data, error } = await deleteMockById(`mock/${id}`);
    if (data) {
      if (data.isError) {
        addToast(data.message, { appearance: "error" });
      } else {
        await getAllTheMockDetails();
        addToast(data.message, { appearance: "success" });
      }
    } else if (error) {
      addToast(error?.response?.data?.messsage, { appearance: "error" });
    }
  };

  const goToaddFeedback = (mockId)=>{
    navigate("/mockfeedbacktocandidate",{
      state:{
        mockId
      }
    })
  }

  let goToCreateMock = (batchID,mockData) => {

    navigate("/createmock", {
      state: {
        batchID,
        mockData : mockData
      },
    });
  };

  const getAllTheMockDetails = async () => {
    const { data, error } = await getAllMockDetails();

    if (data) {
      if (data.isError) {
      } else {
        const tempArray = data.data
          .sort((a, b) => b.mockId.slice(2) - a.mockId.slice(2))
          .map((val) => {
            const {
              mockId,
              mockName,
              technologies,
              mockDescription,
              mockDate,
              mentors,
              batchDetails
            } = val;
            return {
              id: mockId,
              col1: mockName,

              col2: (
                <Box
                  sx={{ width: "100%" }}
                  display="flex"
                  justifyContent="center"
                >
                  <Stack
                    width={170}
                    useFlexGap
                    justifyContent="center"
                    flexWrap="wrap"
                    direction={"row"}
                    spacing={1}
                  >
                    {technologies.map((val, idx) => {
                      return (
                        <Chip
                          variant="outlined"
                          key={idx}
                          label={val}
                          color="primary"
                          size="small"
                          sx={{ marginBottom: "4px" }}
                        />
                      );
                    })}
                  </Stack>
                </Box>
              ),
              col3: mockDescription,
              col4: `${mockDate}`,
              col5: (
                <Box
                  sx={{ width: "100%" }}
                  display="flex"
                  justifyContent="center"
                >
                  <Stack
                    width={170}
                    useFlexGap
                    justifyContent="center"
                    flexWrap="wrap"
                    direction={"row"}
                    spacing={1}
                  >
                    {Object.values(mentors).map((val, idx) => {
                      return (
                        <Chip
                          variant="outlined"
                          key={idx}
                          label={val}
                          color="primary"
                          size="small"
                          sx={{ marginBottom: "4px" }}
                        />
                      );
                    })}
                  </Stack>
                </Box>
              ),
              col6: (
                <Box
                  display="flex"
                  justifyContent="space-around"
                  alignItems="center"
                >
                  <Tooltip title="Edit mock">
                    <EditIcon
                      className="cursor-pointer"
                      color="primary"
                      onClick={() => {
                        goToCreateMock(batchDetails.batchId,val)
                      }}
                    />
                  </Tooltip>

                  <Tooltip title="Delete mock">
                    <DeleteIcon
                      className="cursor-pointer"
                      color="error"
                      onClick={() => {
                        setConfirmDeleteModal({
                          openModal: true,
                          id: mockId,
                        });
                      }}
                    />
                  </Tooltip>
                  <Tooltip title="Add feedback">
                    <AddchartIcon
                      className="cursor-pointer"
                      color="primary"
                      onClick={() => {
                        goToaddFeedback(mockId)
                      }}
                    />
                  </Tooltip>
                </Box>
              ),
            };
          });

        setTableRows([...tempArray]);
      }
    } else if (error) {
    }
  };

  return (
    <Box>
      <TableComponent
        // onHeaderBtnClick={openBatchModal}
        headerTitle="Mock List "
        // addbtnlabel="Create Mock"
        // showAddBtn
        showHeader
        tableColumns={MOCK_COLUMNS}
        showSearchInput
        tableRows={tableRows}
      />
      <ConfirmDelete
        open={confirmDeleteModal.openModal}
        modalMsg=""
        defaultMessage={"Are you sure you want to delete ?"}
        cancelBtnLabel={"No"}
        submitBtnLabel={"Yes"}
        onSubmitBtnClick={() => handleConfirmDeleteModal(confirmDeleteModal.id)}
        onCancelBtnClick={() =>
          setConfirmDeleteModal({ openModal: false, id: null })
        }
      />
    </Box>
  );
}

export default MockModule;
