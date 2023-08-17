import { Box, Grid, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import DropdownComponent from "../../components/atoms/DropdownComponent/DropdownComponent";
import DatePickerComponent from "../../components/atoms/DatePickerComponent/DatePickerComponent";
import CheckBoxComponentTwo from "../../components/atoms/CheckBoxComponentTwo/CheckBoxComponentTwo";
import TableComponent from "../../components/molecules/TableComponent/TableComponent";
import {
  getAttendanceDetails,
  getBatchesInfo,
  getQrCodeOfAParticularBatch,
  markAsHoliday,
  saveAttendance,
} from "../../services/attendancemodule/attendancemodule";
import { returnProperDate } from "../../commonfunctions/commonfunctions";
import { useToasts } from "react-toast-notifications";
import ButtonComponent from "../../components/atoms/ButtonComponent/ButtonComponent";
import ConfirmDelete from "../../components/molecules/ConfirmDelete";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import QrCodeDisplayModal from "../../components/forms/AttendanceModule/QrCodeDisplayModal/QrCodeDisplayModal";

const BATCH_ATTENDANCE_COLUMNS = [
  {
    id: "col1",
    label: "Candidate Name",
    minWidth: 120,
    align: "center",
    sort: false,
  },
  {
    id: "col2",
    label: "Month",
    minWidth: 200,
    align: "center",
    sort: false,
  },
  {
    id: "col3",
    label: "Attendance",
    minWidth: 200,
    align: "center",
    sort: false,
  },
];

const AttendanceModule = () => {
  const [ongoingBatches, setOngoingBatches] = useState([]);
  const [date, setDate] = useState(new Date());
  const [rows, setRows] = useState([]);
  const [tableHeading, setTableHeading] = useState("");
  const [fetchAttendance, setFetchAttendance] = useState(true);
  const [openQrCodeModal, setOpenQrCodeModal] = useState(false);

  const [selectOneOngoingBatch, setSelectOneOngoingBatch] = useState({
    id: "",
    label: "",
  });

  const [attendanceDropDown, setAttendanceDropDown] = useState([]);
  const [theBatchId, setTheBatchId] = useState("");

  const [selectAShift, setSelectAShift] = useState({
    id: "1",
    label: "MORNING",
  });

  const [openMarkAsHolidayModal, setOpenMarkAsHolidayModal] = useState(false);
  const [qrCodeImage, setQrCodeImage] = useState("");

  const { addToast } = useToasts();

  const getTheBatches = async () => {
    const { data, error } = await getBatchesInfo("ONGOING");
    if (data) {
      if (data.isError) {
      } else {
        console.log(data.data, "---data.data");
        let tempArray = data.data.filter(
          (val) => val.batchStatus === "ONGOING" && val.trainerId !== null
        );

        tempArray = tempArray.map((val) => {
          const { batchId, batchName, trainerId } = val;
          return {
            id: `${batchId}:${trainerId}`,
            label: batchName,
          };
        });

        setOngoingBatches([...tempArray]);
        // setDetailsWithTrainerIdArray([...tempArrayTwo]);
      }
    } else if (error) {
    }
  };

  // useEffect(() => {}, [detailsToGetParticularBatchDetails]);

  const getAttendanceDropDown = async () => {
    const batchTrinerIdArray = selectOneOngoingBatch?.id?.split(":");
    const theBatchId = batchTrinerIdArray[0];
    const theTrainerId = batchTrinerIdArray[1];

    setTheBatchId(theBatchId);

    const payload = {
      trainerId: theTrainerId,
      batchId: theBatchId,
      attendanceShift: selectAShift?.label,
      attendanceDate: returnProperDate(date),
    };

    const { data, error } = await getAttendanceDetails(payload);
    if (data) {
      if (data.isError) {
        addToast(data.message, { appearance: "error" });
      } else {
        console.log(data.data, "---- data.data");

        const tempArrayTwo = data.data.map((val, index) => {
          const { attendance } = val;
          return { id: 0, label: attendance };
        });

        setAttendanceDropDown([...tempArrayTwo]);
      }
    } else if (error) {
      addToast(error?.response?.data?.message, { appearance: "error" });
    }
  };

  const getAttendance = async () => {
    const batchTrinerIdArray = selectOneOngoingBatch?.id?.split(":");
    const theBatchId = batchTrinerIdArray[0];
    const theTrainerId = batchTrinerIdArray[1];

    const payload = {
      trainerId: theTrainerId,
      batchId: theBatchId,
      attendanceShift: selectAShift?.label,
      attendanceDate: returnProperDate(date),
    };

    setTableHeading("");
    const { data, error } = await getAttendanceDetails(payload);
    if (data) {
      if (data.isError) {
        addToast(data.message, { appearance: "error" });
      } else {
        console.log(data.data, "---- data.data");
        const tempArray = data.data.map((val, index) => {
          const {
            candidateId,
            candidateName,
            month,
            attendance,
            batchName,
            isHoliday,
          } = val;

          setTableHeading(batchName);
          console.log(
            attendanceDropDown[index],
            "---attendanceDropDown[index]"
          );

          return {
            id: candidateId,
            col1: candidateName,
            col2: month,
            col3:
              attendance === "HOLIDAY" ? (
                "HOLIDAY"
              ) : (
                <Box>
                  <DropdownComponent
                    label="Candidate Attendance"
                    value={attendanceDropDown[index]}
                    options={[
                      {
                        id: 0,
                        label: "ABSENT",
                      },
                      {
                        id: 1,
                        label: "PRESENT",
                      },
                      {
                        id: 2,
                        label: "LEAVE",
                      },
                      // {
                      //   id: 3,
                      //   label: "TERMINATED",
                      // },
                      // {
                      //   id: 4,
                      //   label: "DROP_OUT",
                      // },
                    ]}
                    onChange={(val) => {
                      const tempArrayForDropDown = [...attendanceDropDown];
                      tempArrayForDropDown.splice(index, 1, val);
                      setAttendanceDropDown([...tempArrayForDropDown]);
                    }}
                    disabled={attendanceDropDown[index]?.label === "HOLIDAY"}
                  />{" "}
                </Box>
              ),
          };
        });

        setRows([...tempArray]);
        setFetchAttendance(false);
      }
    } else if (error) {
      addToast(error?.response?.data?.message, { appearance: "error" });
    }
  };

  useEffect(() => {
    getTheBatches();
  }, []);

  useEffect(() => {
    if (selectOneOngoingBatch?.id) getAttendanceDropDown();
    else setRows([]);
  }, [selectOneOngoingBatch, selectAShift?.label, date]);

  useEffect(() => {
    if (fetchAttendance && selectOneOngoingBatch?.id) getAttendance();
  }, [attendanceDropDown, fetchAttendance, selectOneOngoingBatch]);

  useEffect(() => {
    const tempArray = rows.map((val, index) => {
      const { col1, col2, col3, id } = val;

      return {
        id,
        col1,
        col2,
        col3:
          col3 === "HOLIDAY" ? (
            "HOLIDAY"
          ) : (
            <Box>
              <DropdownComponent
                label="Candidate Attendance"
                value={attendanceDropDown[index]}
                options={[
                  {
                    id: 0,
                    label: "ABSENT",
                  },
                  {
                    id: 1,
                    label: "PRESENT",
                  },
                  {
                    id: 2,
                    label: "LEAVE",
                  },
                  {
                    id: 3,
                    label: "TERMINATED",
                  },
                  {
                    id: 4,
                    label: "DROP_OUT",
                  },
                ]}
                onChange={(val) => {
                  const tempArrayForDropDown = [...attendanceDropDown];
                  tempArrayForDropDown.splice(index, 1, val);
                  setAttendanceDropDown([...tempArrayForDropDown]);
                }}
              />{" "}
            </Box>
          ),
      };
    });

    setRows([...tempArray]);
  }, [attendanceDropDown]);

  // console.log(detailsWithTrainerId, "---detailsWithTrainerId");

  // const handleOngoingBatchesDropdown = (val) => {
  //   const singleValue = detailsWithTrainerIdArray.find((theValue) => {
  //     return theValue.id === val.id;
  //   });
  //   setSelectOneOngoingBatch(val);
  //   setDetailsWithTrainerId({ ...singleValue });
  // };

  const handleSaveAttendance = async () => {
    const theTempArray = rows.map((val, index) => {
      return { [val.id]: attendanceDropDown[index]?.label };
    });

    let obj = {};

    for (let i = 0; i < theTempArray.length; i++) {
      obj = { ...obj, ...theTempArray[i] };
    }

    console.log(obj, "---obj");

    // console.log(JSON.parse(obj));
    const payload = {
      trainerId: selectOneOngoingBatch.id.split(":")[1],
      batchId: selectOneOngoingBatch.id.split(":")[0],
      attendanceShift: selectAShift?.label,
      attendanceDate: returnProperDate(date),
      candidates: {
        ...obj,
      },
    };

    const { data, error } = await saveAttendance(payload);

    if (data) {
      if (data.error) {
        addToast(data.message, { appearance: "error" });
      } else {
        addToast(data.message, { appearance: "success" });
        getAttendance();
      }
    } else if (error) {
      addToast(error?.response?.data?.message, { appearance: "error" });
    }
  };

  const markADateAsHoliday = async () => {
    const payload = {
      batchId: theBatchId,
      date: returnProperDate(date),
    };

    const { data, error } = await markAsHoliday(payload);
    if (data) {
      if (data.error) {
        addToast(data.message, { appearance: "error" });
      } else {
        addToast(data.message, { appearance: "success" });
        await getAttendance();
        setOpenMarkAsHolidayModal(false);
      }
    } else if (error) {
      addToast(error?.response?.data?.message, { appearance: "error" });
    }
  };

  const getTheQrCodeForTheModal = async () => {
    const { data, error } = await getQrCodeOfAParticularBatch(
      selectOneOngoingBatch?.id?.split(":")[1]
    );
    if (data) {
      if (data.isError) {
        addToast(data.message, { appearance: "error" });
      } else {
        setQrCodeImage(data.data);
      }
    } else if (error) {
      addToast(error?.response?.data?.message, { appearance: "error" });
    }
  };

  return (
    <Box paddingTop={2}>
      <Box marginX={3}>
        <Grid rowSpacing={2} justifyContent="space-between" container>
          <Grid item xs={12} sm={12} md={3}>
            <DropdownComponent
              options={ongoingBatches}
              label="Ongoing Batches"
              value={selectOneOngoingBatch}
              onChange={(val) => {
                setSelectOneOngoingBatch(val);
                setFetchAttendance(true);
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={9}>
            <Grid spacing={2} justifyContent="flex-end" container>
              <Grid item xs={12} sm={6} md={3}>
                <DatePickerComponent
                  inputlabelshrink
                  label="Date"
                  size="small"
                  value={date}
                  onDateChange={(val) => {
                    setDate(val);
                    setFetchAttendance(true);
                  }}
                />
              </Grid>
              <Grid xs={12} item sm={6} md={6}>
                <Box display="flex" alignItems="center">
                  <DropdownComponent
                    options={[
                      {
                        id: 1,
                        label: "MORNING",
                      },
                      {
                        id: 2,
                        label: "AFTERNOON",
                      },
                    ]}
                    width="50%"
                    label="Attendance Shift"
                    value={selectAShift}
                    onChange={(val) => {
                      setFetchAttendance(true);
                      setSelectAShift(val);
                    }}
                  />
                  <Box marginLeft={2}>
                    <ButtonComponent
                      variant="outlined"
                      label="Mark As Holiday"
                      onBtnClick={() => {
                        setOpenMarkAsHolidayModal(true);
                      }}
                      disabled={rows.length === 0}
                    />
                  </Box>
                  {selectOneOngoingBatch.id !== "" && (
                    <Tooltip
                      placement="top"
                      title="Display Qr code for attendance"
                    >
                      <Box
                        sx={{
                          background: "rgba(0, 0, 0, 0.1)",
                          borderRadius: 100,
                        }}
                        className="cursor-pointer"
                        padding={1}
                        marginLeft={1}
                        onClick={async () => {
                          await getTheQrCodeForTheModal();
                          setOpenQrCodeModal(true);
                        }}
                      >
                        <QrCode2Icon />
                      </Box>
                    </Tooltip>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>

      <TableComponent
        tableRows={rows}
        tableColumns={BATCH_ATTENDANCE_COLUMNS}
        headerTitle={tableHeading}
        showHeader
        showSearchInput={rows.length !== 0}
        submitButtonLabel="Save"
        customHeight
        tableHeight={{ xs: "calc(45vh - 90px)", md: "45vh" }}
        showSubmit
        handleSubmit={() => {
          handleSaveAttendance();
        }}
        disableSubmitButton={rows.length === 0}
        showPaginationFooter
        showFooterCancelButton
      />

      <ConfirmDelete
        modalMsg="Do you want to proceed ?"
        defaultMessage="The selected date will be marked as holiday."
        open={openMarkAsHolidayModal}
        onCancelBtnClick={() => {
          setOpenMarkAsHolidayModal(false);
        }}
        onCloseBtnClick={() => {
          setOpenMarkAsHolidayModal(false);
        }}
        onSubmitBtnClick={() => {
          markADateAsHoliday();
        }}
      />
      <QrCodeDisplayModal
        openQrCodeModal={openQrCodeModal}
        setOpenQrCodeModal={setOpenQrCodeModal}
        imgSource={qrCodeImage}
        getTheQrCodeForTheModal={getTheQrCodeForTheModal}
      />
    </Box>
  );
};

export default AttendanceModule;
