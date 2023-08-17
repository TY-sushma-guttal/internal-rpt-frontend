import React, { useEffect, useState } from "react";
import BatchRegistrationModal from "../../components/forms/BatchModule/BatchRegistrationModal/BatchRegistrationModal";
import TableComponent from "../../components/molecules/TableComponent/TableComponent";
import {
  deleteABatch,
  getAllBatchDetails,
  getBatchDetailsById,
} from "../../services/batchmodule/batchmodule";
import {
  Box,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCandidateToABatchModal from "../../components/forms/BatchModule/AddCandidateToABatchModal";
import ConfirmDelete from "../../components/molecules/ConfirmDelete";
import { useToasts } from "react-toast-notifications";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import PostAddIcon from "@mui/icons-material/PostAdd";
import { useNavigate } from "react-router-dom";
const BATCH_COLUMNS = [
  {
    id: "col1",
    label: "Batch Name",
    minWidth: 80,
    align: "center",
    sort: false,
  },
  {
    id: "col2",
    label: "Technologies",
    minWidth: 190,
    align: "center",
    sort: false,
  },
  {
    id: "col3",
    label: "Count",
    minWidth: 70,
    align: "center",
    sort: false,
  },
  {
    id: "col4",
    label: "Batch Trainer",
    minWidth: 70,
    align: "center",
    sort: false,
  },
  {
    id: "col5",
    label: "Status",
    minWidth: 70,
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

const BatchModule = () => {
  const [batchModal, setbatchModal] = useState(false);
  const [batchModalType, setbatchModalType] = useState("");
  const [tableRows, setTableRows] = useState([]);
  const [batchModalData, setbatchModalData] = useState({});
  const [openAddCandidateModal, setOpenAddCandidateModal] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

  const { addToast } = useToasts();

  const [bacthIdAndTrainerId, setBatchIdAndTrainerId] = useState({
    batchId: "",
    trainerId: "",
  });

  const [modalType, setModalType] = useState("map");

  const [batchIdForDelete, setBatchIdForDelete] = useState("");

  let navigate = useNavigate();
  let openBatchModal = () => {
    setbatchModalType("ADD");
    setbatchModal(true);
  };

  let closeBatchModal = () => {
    setbatchModal(false);
  };

  let handleTrainerEdit = (batchId) => {
    batchDetailsID(batchId);
    setbatchModalType("EDIT");
    setbatchModal(true);
  };

  let batchDetailsID = async (selectedBatchID) => {
    let { data, error } = await getBatchDetailsById(selectedBatchID);

    if (data) {
      if (data.isError) {
        // console.log("error in trainerDetailsID");
      } else {
        setbatchModalData({
          batchStatus: data.data?.batchStatus,
          batchId: data.data?.batchId,
          batchName: data.data?.batchName,
          technologies: data.data?.technologies,
          trainerId: data.data?.trainerId,
          trainerName: data.data?.trainerName,
          startDate: data.data?.startDate,
          endDate: data.data?.endDate,
        });
      }
    }
  };

  const deleteBatch = async () => {
    const { data, error } = await deleteABatch(batchIdForDelete);
    if (data) {
      if (data.isError) {
        addToast(data.message, { appearance: "error" });
      } else {
        await getAllTheBatchDetails();
        addToast(data.message, { appearance: "success" });
        setOpenConfirmDelete(false);
      }
    } else if (error) {
      addToast(error?.response?.data?.message, { appearance: "error" });
    }
  };

  const getAllTheBatchDetails = async () => {
    const { data, error } = await getAllBatchDetails();
    if (data) {
      if (data.isError) {
      } else {
        const tempArray = data.data
          .sort((a, b) => b.batchId.slice(2) - a.batchId.slice(2))
          .map((val) => {
            const {
              batchId,
              batchName,
              technologies,
              startDate,
              endDate,
              trainerName,
              batchStatus,
              trainerId,
              totalStrangth,
              unMapCandCount,
              aviableStrangth
            } = val;
            return {
              id: batchId,
              col1: (
                <Tooltip
                  arrow
                  title={
                    <Box
                      sx={{ color: "black" }}
                      id="composition-menu"
                      aria-labelledby="composition-button"
                      className="p-3"
                    >
                      <Typography sx={{ color: "#02B91B" }} className="fs-12">
                        Start date :{" "}
                        {startDate ? startDate.split(" ")[0] : "--"}
                      </Typography>
                      <Typography sx={{ color: "#02B91B" }} className="fs-12">
                        End date : {endDate ? endDate.split(" ")[0] : "--"}
                      </Typography>
                    </Box>
                  }
                  placement="bottom"
                  PopperProps={{
                    sx: {
                      "& .MuiTooltip-tooltip": {
                        backgroundColor: "white",
                        border: "#00000029 solid 1px",
                      },
                      "& .MuiTooltip-arrow:before": {
                        backgroundColor: "white",
                        border: "#00000029 solid 1px",
                      },
                    },
                  }}
                >
                  <Typography
                    noWrap
                    className="fw-400 fs-14 pe-2"
                    sx={{ cursor: "pointer", color: "black" }}
                  >
                    {batchName}
                  </Typography>
                </Tooltip>
              ),
              col2: (
                <Box
                  sx={{ width: "100%" }}
                  display="flex"
                  justifyContent="center"
                >
                  <Stack
                    width={"190px"}
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
              col3: (
                <Tooltip
                  arrow
                  title={
                    <Box
                      sx={{ color: "black" }}
                      id="composition-menu"
                      aria-labelledby="composition-button"
                      className="p-3"
                    >
                      <Typography sx={{ color: "#086288" }} className="fs-12">
                        Initial strength :{" "}
                        {totalStrangth ? totalStrangth : "--"}
                      </Typography>
                      <Typography sx={{ color: "#EC3E66" }} className="fs-12">
                        Dropout : {unMapCandCount?.DROPOUT ? unMapCandCount.DROPOUT : "--"}
                      </Typography>
                      <Typography sx={{ color: "#EC3E66" }} className="fs-12">
                        Terminated : {unMapCandCount?.TERMINATED ? unMapCandCount.TERMINATED : "--"}
                      </Typography>
                      <Typography sx={{ color: "#EC3E66" }} className="fs-12">
                        Absconding : {unMapCandCount?.ABSCOND ? unMapCandCount.ABSCOND : "--"}
                      </Typography>
                      <Typography sx={{ color: "#02B91B" }} className="fs-12">
                        Present strength :{" "}
                        {aviableStrangth ? aviableStrangth : "--"}
                      </Typography>
                    </Box>
                  }
                  placement="bottom"
                  PopperProps={{
                    sx: {
                      "& .MuiTooltip-tooltip": {
                        backgroundColor: "white",
                        border: "#00000029 solid 1px",
                      },
                      "& .MuiTooltip-arrow:before": {
                        backgroundColor: "white",
                        border: "#00000029 solid 1px",
                      },
                    },
                  }}
                >
                  <Typography
                    noWrap
                    className="fw-400 fs-14 pe-2"
                    sx={{ cursor: "pointer", color: "black" }}
                  >
                    {totalStrangth ? totalStrangth : "--"}
                  </Typography>
                </Tooltip>
              ),

              col4: trainerName ? trainerName : "--",
              col5: batchStatus,
              col6: (
                <Box
                  display="flex"
                  justifyContent="space-around"
                  alignItems="center"
                >
                  {batchStatus === "CREATED" || batchStatus === "ONGOING" ? (
                    <Tooltip title="Edit batch">
                      <EditIcon
                        className="cursor-pointer"
                        color="primary"
                        onClick={() => {
                          handleTrainerEdit(batchId);
                        }}
                      />
                    </Tooltip>
                  ) : (
                    <Tooltip title="Edit batch">
                      <EditIcon className="cursor-pointer" color="disabled" />
                    </Tooltip>
                  )}

                  {batchStatus === "CREATED" ? (
                    <Tooltip title="Delete batch">
                      <DeleteIcon
                        className="cursor-pointer"
                        color="error"
                        onClick={() => {
                          setBatchIdForDelete(batchId);
                          setOpenConfirmDelete(true);
                        }}
                      />
                    </Tooltip>
                  ) : (
                    <Tooltip title="Delete batch">
                      <DeleteIcon color="disabled" />
                    </Tooltip>
                  )}
                  <Box>
                    {batchStatus === "CREATED" || batchStatus === "ONGOING" ? (
                      <Tooltip title="Assign candidates">
                        <IconButton
                          onClick={() => {
                            setOpenAddCandidateModal(true);
                            setBatchIdAndTrainerId({
                              batchId: batchId,
                              trainerId,
                            });
                            setModalType("map");
                          }}
                        >
                          <PersonAddIcon color="primary" />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Assign candidates">
                        <PersonAddIcon
                          sx={{ paddingX: 0.5, paddingY: 0.5 }}
                          color="disabled"
                        />
                      </Tooltip>
                    )}
                  </Box>
                  <Box>
                    {batchStatus === "CREATED" || batchStatus === "ONGOING" ? (
                      <Tooltip title="Unassign candidates">
                        <IconButton
                          onClick={() => {
                            setOpenAddCandidateModal(true);
                            setBatchIdAndTrainerId({
                              batchId: batchId,
                              trainerId,
                            });
                            setModalType("unmap");
                          }}
                        >
                          <PersonOffIcon color="error" />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Unassign candidates">
                        <PersonOffIcon
                          sx={{ paddingX: 0.5, paddingY: 0.5 }}
                          color="disabled"
                        />
                      </Tooltip>
                    )}
                  </Box>
                  <Box>
                    {batchStatus === "COMPLETED" ||
                    batchStatus === "ONGOING" ? (
                      <Tooltip title="Create mock">
                        <IconButton
                          onClick={() => {
                            goToCreateMock(batchId);
                          }}
                        >
                          <PostAddIcon
                            sx={{ paddingX: 0.5, paddingY: 0.5 }}
                            color="primary"
                          />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Create mock">
                        <IconButton
                        //  onClick={() => {
                        //    goToCreateMock(batchId);
                        //  }}
                        >
                          <PostAddIcon
                            sx={{ paddingX: 0.5, paddingY: 0.5 }}
                            color="disabled"
                          />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </Box>
              ),
            };
          });

        setTableRows([...tempArray]);
      }
    } else if (error) {
    }
  };

  useEffect(() => {
    getAllTheBatchDetails();
  }, []);

  let goToCreateMock = (batchID) => {
    navigate("/createmock", {
      state: {
        batchID,
        type:"create"
      },
    });
  };
  return (
    <>
      <BatchRegistrationModal
        batchModal={batchModal}
        closeBatchModal={closeBatchModal}
        batchModalType={batchModalType}
        getAllTheBatchDetails={getAllTheBatchDetails}
        batchModalData={batchModalData}
        setbatchModalType={setbatchModalType}
      />

      <TableComponent
        onHeaderBtnClick={openBatchModal}
        headerTitle="Batch list"
        addbtnlabel="Add batch"
        showAddBtn
        showHeader
        tableColumns={BATCH_COLUMNS}
        showSearchInput
        tableRows={tableRows}
      />
      {openAddCandidateModal && (
        <AddCandidateToABatchModal
          openAddCandidateModal={openAddCandidateModal}
          setOpenAddCandidateModal={setOpenAddCandidateModal}
          bacthIdAndTrainerId={bacthIdAndTrainerId}
          setBatchIdAndTrainerId={setBatchIdAndTrainerId}
          modalType={modalType}
        />
      )}
      <ConfirmDelete
        open={openConfirmDelete}
        onCancelBtnClick={() => {
          setOpenConfirmDelete(false);
        }}
        onSubmitBtnClick={() => {
          deleteBatch();
        }}
        onCloseBtnClick={() => {
          setOpenConfirmDelete(false);
        }}
      />
    </>
  );
};

export default BatchModule;
