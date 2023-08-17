import React, { useState, useEffect } from "react";
import SaveCandidateOnBoardDetailsModal from "../../components/forms/CandidateOnBoardDetails/SaveCandidateModal/SaveCandidateOnBoardDetailsModal";
import {
  deleteCandidateById,
  getCandidateDetails,
  getCandidateDetailsById,
} from "../../services/candidateOnboardDetails/candidateOnBoardDetails";
import { Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TableComponent from "../../components/molecules/TableComponent/TableComponent";
import { useToasts } from "react-toast-notifications";
import ConfirmDelete from "../../components/molecules/ConfirmDelete";
import { getBatchNameDropdown } from "../../services/batchmodule/batchmodule";
import { getCandidateDetailsDropdown } from "../../services/candidateregistration/candidateregistration";

const CANDIDATE_ONBOARD_DETAILS_LIST_HEADER = [
  {
    id: "col1",
    label: "Candidate name",
    minWidth: 100,
    align: "center",
    sort: false,
  },
  {
    id: "col2",
    label: "Batch name",
    minWidth: 100,
    align: "center",
    sort: false,
  },
  {
    id: "col3",
    label: "Batch start date",
    minWidth: 100,
    align: "center",
    sort: false,
  },

  {
    id: "col4",
    label: "Employment date",
    minWidth: 100,
    align: "center",
    sort: false,
  },
  {
    id: "col5",
    label: "Mobile number",
    minWidth: 100,
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

const CandidateOnBoardDetails = () => {
  const { addToast } = useToasts();
  const [candidateOnBoardDetailsFormData, setCandidateOnBoardDetailsFormData] =
    useState({
      candidateId: "",
      candidateName: { label: "", id: "" },
      mobileNumber: "",
      batchName: { label: "", id: 0 },
      batchStartDate: "",
      employmentDate: "",
      totalStrength: "",
      mobileNumber: "",
      totalStrength: "",
      availableBatchStrength: "",
      loi: { label: "", id: 0 },
      loginCredential: { label: "", id: 0 },
      documentCheck: { label: "", id: 0 },
      experienceLetter: { label: "", id: 0 },
      stipend: { label: "", id: 0 },
      appraisal: { label: "", id: 0 },
    });

  const [candidateData, setCandidateData] = useState([]);
  const [batchNames, setBatchNames] = useState([]);
  const [tableRows, setTableRows] = useState([]);
  const [openCandidateonBoard, setOpenCandidateonBoard] = useState(false);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState({
    openModal: false,
    id: null,
  });

  const [modalType, setmodalType] = useState("");

  useEffect(() => {
    getTheCandidateDetails();
    getTheBatchDetails();
    getTheCandidateData();
  }, []);

  const getTheCandidateData = async () => {
    const { data } = await getCandidateDetailsDropdown();
    if (data) {
      if (data.error) {
        console.log(data.error);
      } else {
        setCandidateData(data.data);
      }
    }
  };

  const getTheBatchDetails = async () => {
    const { data } = await getBatchNameDropdown();
    if (data) {
      if (data.error) {
        // console.log(data.error);
      } else {
        setBatchNames(data.data);
      }
    }
  };

  let openCandidateonBoardModal = () => {
    setOpenCandidateonBoard(true);
    setmodalType("ADD");
  };

  const handleConfirmDeleteModal = (id) => {
    setConfirmDeleteModal({ openModal: false, id: id });
    handleDelete(id);
  };

  const handleDelete = async (id) => {
    const { data, error } = await deleteCandidateById(`onboard/${id}`);
    if (data) {
      if (data.isError) {
        addToast(data.message, { appearance: "error" });
      } else {
        await getTheCandidateDetails();
        addToast(data.message, { appearance: "success" });
      }
    } else if (error) {
      addToast(error?.response?.data?.messsage, { appearance: "error" });
    }
  };

  const getTheCandidateDetails = async () => {
    const { data, error } = await getCandidateDetails();

    if (data) {
      if (data.isError) {
        addToast(data.message, { appearance: "error" });
      } else {
        const tempArray = data.data.map((val) => {
          const {
            candidateId,
            candidateName,
            onBoardId,
            batchName,
            batchStartDate, 
            employmentDate,
            mobileNumber,
          } = val;
          // console.log(candidateId, ".......from mapdata");
          return {
            id: candidateId,
            col1: candidateName,
            col2: batchName,
            col3: batchStartDate,
            col4: employmentDate,
            col5: mobileNumber,
            col6: (
              <Box
                display="flex"
                justifyContent="space-evenly"
                alignItems="center"
              >
                <EditIcon
                  className="cursor-pointer"
                  color="primary"
                  onClick={() => {
                    handleCandidateEdit(candidateId);
                  }}
                />
                <Box>
                  <DeleteIcon
                    className="cursor-pointer"
                    color="error"
                    onClick={() => {
                      setConfirmDeleteModal({
                        openModal: true,
                        id: onBoardId,
                      });
                    }}
                  />
                </Box>
              </Box>
            ),
          };
        });
        setTableRows([...tempArray]);
      }
    } else if (error) {
      addToast(error?.response?.data?.message, { appearance: "error" });
    }
  };

  let candidateDetailsID = async (selectedCandidateID) => {
    let { data } = await getCandidateDetailsById(selectedCandidateID);
    if (data) {
      if (data.isError) {
        // console.log("error in candidateDetailsID");
      } else {
        setCandidateOnBoardDetailsFormData({
          candidateId: data.data?.candidateId,
          candidateName: {
            label: data.data?.candidateName,
            id: data.data?.candidateName,
          },
          batchName: { label: data.data?.batchName, id: data.data?.batchName },
          batchStartDate: data.data?.batchStartDate,
          employmentDate: data.data?.employmentDate,
          mobileNumber: data.data?.mobileNumber,
          totalStrength: data.data?.totalStrength,
          availableBatchStrength: data.data?.availableBatchStrength,
          loi: { label: data.data?.loi, id: data.data?.loi },
          loginCredential: {
            label: data.data?.loginCredential,
            id: data.data?.loginCredential,
          },
          documentCheck: {
            label: data.data?.documentCheck,
            id: data.data?.documentCheck,
          },
          experienceLetter: {
            label: data.data?.experienceLetter,
            id: data.data?.experienceLetter,
          },
          stipend: { label: data.data?.stipend, id: data.data?.stipend },
          appraisal: { label: data.data?.appraisal, id: data.data?.appraisal },
          onBoardId: data.data?.onBoardId,
        });
      }
    }
  };

  let handleCandidateEdit = async (candidateId) => {
    // console.log(candidateId, "........idinhandle");
    await candidateDetailsID(candidateId);
    setOpenCandidateonBoard(true);
    setmodalType("EDIT");
    // setEditData(val)
  };

  return (
    <div>
      <TableComponent
        showHeader
        showAddBtn
        addbtnlabel="Add Candidate"
        tableColumns={CANDIDATE_ONBOARD_DETAILS_LIST_HEADER}
        tableRows={tableRows}
        headerTitle="Onboarded candidate list"
        showSearchInput
        onHeaderBtnClick={openCandidateonBoardModal}
        // customHeight
        // tableHeight="calc(100vh - 195px)"
      />
      <SaveCandidateOnBoardDetailsModal
        openCandidateonBoard={openCandidateonBoard}
        setOpenCandidateonBoard={setOpenCandidateonBoard}
        candidateOnBoardDetailsFormData={candidateOnBoardDetailsFormData}
        setCandidateOnBoardDetailsFormData={setCandidateOnBoardDetailsFormData}
        modalType={modalType}
        setmodalType={setmodalType}
        getTheCandidateDetails={getTheCandidateDetails}
        batchNames={batchNames}
        candidateData={candidateData}
      />
      {confirmDeleteModal.openModal && (
        <ConfirmDelete
          open={confirmDeleteModal.openModal}
          modalMsg=""
          defaultMessage={"Are you sure you want to delete ?"}
          cancelBtnLabel={"No"}
          submitBtnLabel={"Yes"}
          onSubmitBtnClick={() =>
            handleConfirmDeleteModal(confirmDeleteModal.id)
          }
          onCancelBtnClick={() =>
            setConfirmDeleteModal({ openModal: false, id: null })
          }
        />
      )}
    </div>
  );
};

export default CandidateOnBoardDetails;
