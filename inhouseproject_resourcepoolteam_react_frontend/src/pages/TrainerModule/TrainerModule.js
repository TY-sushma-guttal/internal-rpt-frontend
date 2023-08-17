import { Box, Rating } from "@mui/material";
import React from "react";
import TableComponent from "../../components/molecules/TableComponent/TableComponent";
import {
  deleteASingleTrainer,
  getAllTrainerDetails,
  getTrainerDetailsByID,
  mapATrainer,
  unMapTrainer,
} from "../../services/trainermodule/trainermodule";
import { useEffect } from "react";
import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ButtonComponent from "../../components/atoms/ButtonComponent/ButtonComponent";

import MapTrainerModalComponent from "../../components/forms/TrainerModule/MapTrainerModalComponent";
import TrainerModal from "./trainerModal/TrainerModal";
import { useToasts } from "react-toast-notifications";
import ConfirmDelete from "../../components/molecules/ConfirmDelete";

const TRAINER_DETAILS_COLUMNS = [
  {
    id: "col1",
    label: "Emp. ID",
    minWidth: 80,
    align: "center",
    sort: false,
  },
  {
    id: "col2",
    label: "Full Name",
    minWidth: 100,
    align: "center",
    sort: false,
  },
  {
    id: "col3",
    label: "Status",
    minWidth: 100,
    align: "center",
    sort: false,
  },
  {
    id: "col4",
    label: "Rating",
    minWidth: 100,
    align: "center",
    sort: false,
  },

  {
    id: "col5",
    label: "Phone Number",
    minWidth: 100,
    align: "center",
    sort: false,
  },
  {
    id: "col6",
    label: "Actions",
    minWidth: 170,
    align: "center",
    sort: false,
  },
];

const TrainerModule = () => {
  const [tableRows, setTableRows] = useState([]);
  const [trainerModal, settrainerModal] = useState(false);
  const [modalType, setmodalType] = useState("");
  const [modalData, setmodalData] = useState({});
  const [openMapTrainerModal, setOpenMapTrainerModal] = useState(false);
  const [confirmUnMapTrainer, setConfirmUnMapTrainer] = useState({
    openModal: false,
    batchId: null,
  });
  const [batchesForDropdown, setBatchesForDropdown] = useState([]);
  const [mapTrainerDetails, setMapTrainerDetails] = useState({
    batchId: "",
    trainerId: "",
  });

  const [openDeleteModal, setopenDeleteModal] = useState(false);
  const [deleteTrainerId, setdeleteTrainerId] = useState("");

  let openTrainerModal = () => {
    settrainerModal(true);
    setmodalType("ADD");
  };

  let { addToast } = useToasts();

  let closeTrainerModal = () => {
    settrainerModal(false);
  };

  const unMapTheTrainer = async (batchId) => {
    const { data, error } = await unMapTrainer(batchId);
    if (data) {
      if (data.isError) {
        addToast(data.message, { appearance: "error" });
      } else {
        setConfirmUnMapTrainer({ openModal: false, batchId: null });
        await getTheTrainerDetails();
        addToast(data.message, { appearance: "success" });
      }
    } else if (error) {
      addToast(error?.response?.data?.message, { appearance: "error" });
    }
  };

  let handleTrainerDeleteModal = (trainerID) => {
    setopenDeleteModal(true);
    setdeleteTrainerId(trainerID);
  };

  let handleSubmitDeleteTrainerModal = async () => {
    const { data, error } = await deleteASingleTrainer(deleteTrainerId);
    if (data) {
      if (data.error) {
        addToast(data.message, { appearance: "info" });
      } else {
        addToast(data.message, { appearance: "success" });
        await getTheTrainerDetails();
        setopenDeleteModal(false);
      }
    } else if (error) {
      addToast(data.message, { appearance: "error" });
    }
  };

  const getTheTrainerDetails = async () => {
    const { data, error } = await getAllTrainerDetails();
    if (data) {
      if (data.error) {
      } else {
        const tempArray = data.data.map((val) => {
          const { trainerId, name, status, rating, phno, employeeId } = val;
          return {
            id: trainerId,
            col1: employeeId,
            col2: name,
            col3:
              status === "OCCUPIED_BUT_AVAILABLE"
                ? "OCCUPIED BUT AVAILABLE"
                : status === "AVAILABLE"
                ? "AVAILABLE"
                : status === "OCCUPIED"
                ? "OCCUPIED"
                : "NOT AVAILABLE",
            col4: (
              <Rating
                sx={{ color: "#FFA41C" }}
                name="read-only"
                value={rating}
                precision={0.5}
                readOnly
              />
            ),
            col5: phno,
            col6: (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <EditIcon
                  className="cursor-pointer"
                  color="primary"
                  onClick={() => {
                    handleTrainerEdit(trainerId);
                  }}
                />
                <Box>
                  {status === "AVAILABLE" ? (
                    <DeleteIcon
                      className="cursor-pointer"
                      color="error"
                      onClick={() => {
                        handleTrainerDeleteModal(trainerId);
                      }}
                    />
                  ) : (
                    <DeleteIcon color="disabled" />
                  )}
                </Box>
                <Box>
                  {status === "AVAILABLE" ? (
                    <ButtonComponent
                      sx={{ paddingX: 0.5, paddingY: 0.5 }}
                      label="Map"
                      variant="outlined"
                      onBtnClick={() => {
                        setMapTrainerDetails({
                          ...mapTrainerDetails,
                          trainerId: trainerId,
                        });
                        setOpenMapTrainerModal(true);
                      }}
                    />
                  ) : (
                    <ButtonComponent
                      sx={{ paddingX: 0.5, paddingY: 0.5 }}
                      label="Un-Map"
                      variant="outlined"
                      onBtnClick={() => {
                        setConfirmUnMapTrainer({
                          openModal: true,
                          batchId: val?.batchDetails?.batchId,
                        });
                        // unMapTheTrainer(val?.batchDetails?.batchId);
                      }}
                    />
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

  const mapTrainer = async () => {
    const { data, error } = await mapATrainer(
      mapTrainerDetails.batchId,
      mapTrainerDetails.trainerId
    );
    if (data) {
      if (data.isError) {
        addToast(data.message, { appearance: "error" });
      } else {
        await getTheTrainerDetails();
        addToast(data.message, { appearance: "success" });
      }
    } else if (error) {
      addToast(error?.response?.data?.message, { appearance: "error" });
    }
  };

  useEffect(() => {
    getTheTrainerDetails();
  }, []);

  let handleTrainerEdit = (trainerId) => {
    settrainerModal(true);
    setmodalType("EDIT");
    trainerDetailsID(trainerId);
  };

  let trainerDetailsID = async (selectedTrainerID) => {
    let { data } = await getTrainerDetailsByID(selectedTrainerID);
    if (data) {
      if (data.isError) {
      } else {
        setmodalData({
          trainerId: data.data?.trainerId,
          empid: data.data?.employeeId,
          empName: data.data?.name,
          officialEmail: data.data?.officialEmailId,
          skills: data.data?.skills,
          phno: data.data?.phno,
          rating: { id: data.data.rating, label: data.data.rating },
          isDelete: data.data?.isDelete,
          status: data.data?.status,
        });
      }
    }
  };
  return (
    <Box>
      <TableComponent
        showHeader
        showAddBtn
        addbtnlabel="Add Trainer"
        tableColumns={TRAINER_DETAILS_COLUMNS}
        tableRows={tableRows}
        headerTitle="Trainer's list"
        showSearchInput
        onHeaderBtnClick={openTrainerModal}
        // customHeight
        // tableHeight="calc(100vh - 192px)"
      />

      <TrainerModal
        modalData={modalData}
        modalType={modalType}
        setmodalType={setmodalType}
        trainerModal={trainerModal}
        closeTrainerModal={closeTrainerModal}
        getTheTrainerDetails={getTheTrainerDetails}
      />
      <MapTrainerModalComponent
        openMapTrainerModal={openMapTrainerModal}
        batchesForDropdown={batchesForDropdown}
        setBatchesForDropdown={setBatchesForDropdown}
        setOpenMapTrainerModal={setOpenMapTrainerModal}
        setMapTrainerDetails={setMapTrainerDetails}
        mapTrainerDetails={mapTrainerDetails}
        mapTrainer={mapTrainer}
      />

      <ConfirmDelete
        open={openDeleteModal}
        onCancelBtnClick={() => {
          setopenDeleteModal(false);
        }}
        onSubmitBtnClick={() => {
          handleSubmitDeleteTrainerModal();
        }}
        onCloseBtnClick={() => {
          setopenDeleteModal(false);
        }}
      />
      <ConfirmDelete
        open={confirmUnMapTrainer.openModal}
        modalMsg=""
        defaultMessage={"Are you sure you want to un-map ?"}
        cancelBtnLabel={"No"}
        submitBtnLabel={"Yes"}
        onSubmitBtnClick={() => unMapTheTrainer(confirmUnMapTrainer.batchId)}
        onCancelBtnClick={() =>
          setConfirmUnMapTrainer({ openModal: false, batchId: null })
        }
        onCloseBtnClick={() =>
          setConfirmUnMapTrainer({ openModal: false, batchId: null })
        }
      />
    </Box>
  );
};

export default TrainerModule;
