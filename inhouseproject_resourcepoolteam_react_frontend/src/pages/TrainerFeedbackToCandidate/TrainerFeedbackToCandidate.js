import { Box, Grid, getLinearProgressUtilityClass } from "@mui/material";
import React from "react";
import DropdownComponent from "../../components/atoms/DropdownComponent/DropdownComponent";
import {
  getAllTheBatches,
  getFeedbackDetailsOfAParticularBatch,
  saveIndividualFeedback,
  saveTheFeedbackOfTheBatch,
} from "../../services/trainerfeedbacktocandidate/trainerfeedbacktocandidate";
import { useEffect } from "react";
import { useState } from "react";
import TableComponent from "../../components/molecules/TableComponent/TableComponent";
import { useToasts } from "react-toast-notifications";
import ButtonComponent from "../../components/atoms/ButtonComponent/ButtonComponent";

const TABLE_COLUMS_FOR_CANDIDATES = [
  {
    id: "col1",
    label: "Candidate Name",
    minWidth: 100,
    align: "center",
    sort: false,
  },
  {
    id: "col2",
    label: "Phone Number",
    minWidth: 100,
    align: "center",
    sort: false,
  },
  {
    id: "col3",
    label: "Official Mail Id",
    minWidth: 170,
    align: "center",
    sort: false,
  },
  {
    id: "col4",
    label: "Rating",
    minWidth: 80,
    align: "center",
    sort: false,
  },
  {
    id: "col5",
    label: "Action",
    minWidth: 80,
    align: "center",
    sort: false,
  },
];

const TrainerFeedbackToCandidate = () => {
  const [batchesForDropdown, setBatchesForDropdown] = useState([]);
  const [candidatesOfABatch, setCandidatesOfABatch] = useState([]);
  const [aBatch, setABatch] = useState({
    id: "",
    label: "",
  });

  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
  const { addToast } = useToasts();

  const [dropdownValues, setDropdownValues] = useState([
    {
      id: "",
      label: "",
    },
  ]);

  const [tableRows, setTableRows] = useState([]);

  const [dataForTable, setDataForTable] = useState([]);

  const getAllBatchDetails = async () => {
    const { data, error } = await getAllTheBatches();

    if (data.data) {
      const filteredArray = data.data.filter((val) => {
        return val.batchStatus === "COMPLETED" || val.batchStatus === "ONGOING";
      });

      const tempArray = filteredArray.map((val) => {
        return { id: `${val.batchId}:${val.trainerId}`, label: val.batchName };
      });

      setBatchesForDropdown([...tempArray]);
    } else if (error) {
    }
  };

  const setDropDownValuesForTable = async () => {
    const { data, error } = await getFeedbackDetailsOfAParticularBatch(
      aBatch.id.split(":")[0]
    );

    if (data) {
      if (data.isError) {
      } else {
        const tempArray = data.data.map((val) => {
          return {
            id: val.candidateId,
            col1: val.candidateName,
            col2: val.selfContactNumber,
            col3: val.officialMailId,
            col4: {
              id: 0,
              label: val.feedback ? val.feedback : "",
            },
          };
        });

        setDataForTable([...tempArray]);
      }
    } else if (error) {
    }
  };

  const saveIndividualFeedbackOfTheCandidate = async (payload) => {
    const { data, error } = await saveIndividualFeedback(payload);

    if (data) {
      if (data.isError) {
        addToast(data.message, { appearance: "error" });
      } else {
        await setDropDownValuesForTable();
        addToast(data.message, { appearance: "success" });
      }
    } else if (error) {
      addToast(error?.response?.data?.message, { appearance: "error" });
    } else {
      addToast("Something Went Wrong", { appearance: "error" });
    }
  };

  const returnTheValueToDropDownComponent = (col4) => {
    if (col4?.label === "ABOVE_AVERAGE" || col4?.label === "BELOW_AVERAGE") {
      let label = `${col4?.label.split("_")[0]} ${col4?.label.split("_")[1]}`;
      return { ...col4, label };
    }

    return col4;
  };

  const setTheRowsForTable = () => {
    const tempArray = dataForTable.map((val, index) => {
      const { id, col1, col2, col3, col4 } = val;
      const payload = {
        feedback:
          col4?.label?.toUpperCase() === "ABOVE AVERAGE"
            ? "ABOVE_AVERAGE"
            : col4?.label?.toUpperCase() === "BELOW AVERAGE"
            ? "BELOW_AVERAGE"
            : col4?.label?.toUpperCase(),
        trainerId: aBatch?.id.split(":")[1],
        candidateId: id,
      };
      return {
        id,
        col1,
        col2,
        col3,
        col4: (
          <DropdownComponent
            options={[
              {
                id: 1,
                label: "BELOW AVERAGE".toUpperCase(),
              },
              {
                id: 2,
                label: "AVERAGE".toUpperCase(),
              },
              {
                id: 3,
                label: "ABOVE AVERAGE".toUpperCase(),
              },
              {
                id: 4,
                label: "GOOD".toUpperCase(),
              },
              {
                id: 5,
                label: "EXCELLENT".toUpperCase(),
              },
            ]}
            value={returnTheValueToDropDownComponent(col4)}
            onChange={(val) => {
              const tempArray = [...dataForTable];
              tempArray.splice(index, 1, { ...dataForTable[index], col4: val });
              setDataForTable([...tempArray]);
            }}
            placeholder=""
          />
        ),
        col5: (
          <ButtonComponent
            onBtnClick={() => {
              saveIndividualFeedbackOfTheCandidate(payload);
            }}
            label="Save"
            variant="outlined"
            disabled={!col4?.label}
          />
        ),
      };
    });

    setTableRows([...tempArray]);
  };

  const saveFeedbackOfMultipleCandidates = async () => {
    const trainerId = aBatch?.id.split(":")[1];

    const payload = dataForTable.map((val) => {
      return {
        feedback:
          val.col4?.label?.toUpperCase() === "ABOVE AVERAGE"
            ? "ABOVE_AVERAGE"
            : val.col4?.label?.toUpperCase() === "BELOW AVERAGE"
            ? "BELOW_AVERAGE"
            : val.col4?.label?.toUpperCase(),
        trainerId: trainerId,
        candidateId: val.id,
      };
    });
    const { data, error } = await saveTheFeedbackOfTheBatch(payload);
    if (data) {
      if (data.isError) {
        addToast(data.message, { appearance: "error" });
      } else {
        await setDropDownValuesForTable();
        addToast(data.message, { appearance: "success" });
      }
    } else if (error) {
      addToast(error?.response?.data?.message, { appearance: "error" });
    } else {
      addToast("Something Went Wrong", { appearance: "error" });
    }
  };

  const checkWeatherAllDropdownsAreFilled = () => {
    let allFilled = true;

    dataForTable.forEach((val) => {
      if (!val.col4?.label) {
        allFilled = false;
      }
    });

    setSubmitButtonDisabled(allFilled);
  };

  useEffect(() => {
    getAllBatchDetails();
  }, []);

  useEffect(() => {
    if (aBatch?.id) setDropDownValuesForTable();
    else setDataForTable([]);
  }, [aBatch?.id]);

  useEffect(() => {
    setTheRowsForTable();
    checkWeatherAllDropdownsAreFilled();
  }, [dataForTable]);

  return (
    <Box>
      <Box marginTop={2}>
        <Grid container>
          <Grid marginLeft={1} item xs={3}>
            <DropdownComponent
              options={batchesForDropdown}
              label="Batch List"
              value={aBatch}
              onChange={(val) => {
                setABatch(val);
              }}
            />
          </Grid>
        </Grid>
      </Box>
      <Box marginTop={1}>
        <TableComponent
          tableRows={tableRows}
          tableColumns={TABLE_COLUMS_FOR_CANDIDATES}
          showSubmit
          submitButtonLabel="Save"
          customHeight
          tableHeight="52vh"
          handleSubmit={() => {
            saveFeedbackOfMultipleCandidates();
          }}
          disableSubmitButton={
            !submitButtonDisabled || dataForTable.length === 0
          }
        />
      </Box>
    </Box>
  );
};

export default TrainerFeedbackToCandidate;
