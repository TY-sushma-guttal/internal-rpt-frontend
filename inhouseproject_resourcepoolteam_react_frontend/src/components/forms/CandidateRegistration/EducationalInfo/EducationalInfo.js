import { Box, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import InputBoxComponent from "../../../atoms/InputBoxComponent/InputBoxComponent";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import DropdownComponent from "../../../atoms/DropdownComponent/DropdownComponent";
import educationalArray from "../../../../constants/candidateregistration/educactionalobject/educationalarray";
import RadioButton from "../../../atoms/RadioButton/RadioButton";

const EducationalInfo = ({
  educationalDetailsArray,
  setEducationalDetailsArray,
  handleEducationDetailsAddButtonError,
  educationDetailsError,
}) => {
  const [dropdownOptions, setDropdownOptions] = useState([]);
  // const [selectedOther, setSelectedOther] = useState(false);
  // const [indexForSelectedOther, setIndexForSelectedOther] = useState(null);
  const handleInputChange = (e, i) => {
    const { name, value } = e.target;
    const list = [...educationalDetailsArray];
    list[i][name] = value;
    setEducationalDetailsArray(list);
  };

  useEffect(() => {
    let tempArray = educationalArray.map((val, id) => {
      const label = val.split("-")[1];

      return label;
    });

    tempArray = tempArray.sort((a, b) => {
      let compareA;
      let compareB;

      if (a.includes(".")) {
        compareA = a.split(".").join("");
        console.log(compareA, "---compareA");
      } else {
        compareA = a;
      }

      if (b.includes(".")) {
        compareB = b.split(".").join("");
        console.log(compareB, "---compareB");
      } else {
        compareB = b;
      }

      if (a.includes("/")) {
        compareA = a.split("/").join("");
        console.log(compareA, "...compareA //");
      } else {
        compareA = a;
      }

      if (b.includes("/")) {
        compareB = b.split("/").join("");
        console.log(compareB, "...compareB //");
      } else {
        compareB = b;
      }

      if (compareA < compareB) return -1;
      else if (compareA > compareB) return 1;
      else return 0;
    });

    tempArray = tempArray.map((val, index) => {
      return {
        id: index,
        label: val,
      };
    });

    setDropdownOptions([...tempArray]);
  }, []);

  const getYear = () => {
    let date = new Date();

    let year = date.getFullYear();
    const limit = 23;

    const yearOptions = [];
    for (let i = 0; i <= limit; i++) {
      yearOptions.push({ label: (year - i).toString(), id: i + 1 });
    }
    return yearOptions;
  };

  return (
    <Box>
      <Box marginTop={2.5}>
        <Typography textAlign="center" variant="h4">
          Educational Details
        </Typography>
        {educationalDetailsArray.map((val, i) => {
          return (
            <Grid marginTop={4} container key={i}>
              <Grid item xs={9} md={11}>
                <Grid
                  container
                  rowSpacing={{ xs: 2, md: 0.5 }}
                  columnSpacing={2}
                >
                  <Grid item xs={12} md={6}>
                    {/* {selectedOther && indexForSelectedOther === i ? (
                      <InputBoxComponent
                        label="Qualification"
                        value={val.level.label}
                        onChange={(e) => {
                          const tempArray = [...educationalDetailsArray];
                          tempArray.splice(i, 1, {
                            ...educationalDetailsArray[i],
                            level: { id: "", label: e.target.value },
                          });
                          setEducationalDetailsArray([...tempArray]);
                        }}
                      />
                    ) : ( */}
                    <DropdownComponent
                      label="Qualification"
                      options={dropdownOptions}
                      value={val.level}
                      // value={val.level}
                      name="level"
                      // onChange={(e) => handleInputChange(e, i)}
                      helperText={
                        educationDetailsError[i]?.level
                          ? educationDetailsError[i].level
                          : ""
                      }
                      error={
                        educationDetailsError[i]?.level
                          ? educationDetailsError[i].level
                          : ""
                      }
                      onChange={(val) => {
                        const tempArray = [...educationalDetailsArray];
                        tempArray.splice(i, 1, {
                          ...educationalDetailsArray[i],
                          level: val,
                        });
                        console.log(tempArray, " --- this is temp array");
                        setEducationalDetailsArray([...tempArray]);
                      }}
                    />
                    {/* )} */}
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <InputBoxComponent
                      label="Institute Name"
                      value={val.instituteName}
                      name="instituteName"
                      onChange={(e) => handleInputChange(e, i)}
                      helperText={
                        educationDetailsError[i]?.instituteName
                          ? educationDetailsError[i].instituteName
                          : ""
                      }
                      error={
                        educationDetailsError[i]?.instituteName
                          ? educationDetailsError[i].instituteName
                          : ""
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box display="flex">
                      <RadioButton
                        checked={
                          educationalDetailsArray[i].percentageOrCgpa ===
                          "percentage"
                        }
                        label="Percentage"
                        handleChange={() => {
                          const tempArray = [...educationalDetailsArray];
                          tempArray[i].percentageOrCgpa = "percentage";
                          setEducationalDetailsArray([...tempArray]);
                        }}
                      />
                      <RadioButton
                        checked={
                          educationalDetailsArray[i].percentageOrCgpa === "cgpa"
                        }
                        label="CGPA"
                        handleChange={() => {
                          const tempArray = [...educationalDetailsArray];
                          tempArray[i].percentageOrCgpa = "cgpa";
                          setEducationalDetailsArray([...tempArray]);
                        }}
                      />
                    </Box>

                    <InputBoxComponent
                      label={
                        educationalDetailsArray[i].percentageOrCgpa ===
                        "percentage"
                          ? "Percentage"
                          : "CGPA"
                      }
                      value={val.percentage}
                      name="percentage"
                      onChange={(e) => handleInputChange(e, i)}
                      helperText={
                        educationDetailsError[i]?.percentage
                          ? educationDetailsError[i].percentage
                          : ""
                      }
                      error={
                        educationDetailsError[i]?.percentage
                          ? educationDetailsError[i].percentage
                          : ""
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box marginTop={{ xs: 0, md: 5 }}>
                      {" "}
                      <DropdownComponent
                        label="Year of passout"
                        value={val.yop}
                        options={getYear()}
                        onChange={(val) => {
                          let e = { target: { name: "yop", value: val } };
                          handleInputChange(e, i);
                        }}
                        helperText={
                          educationDetailsError[i]?.yop
                            ? educationDetailsError[i].yop
                            : ""
                        }
                        error={
                          educationDetailsError[i]?.yop
                            ? educationDetailsError[i].yop
                            : ""
                        }
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={3} md={1}>
                <Box
                  sx={{ width: "100%", height: "100%", marginLeft: 2 }}
                  justifyContent="flex-start"
                  alignItems="center"
                  display="flex"
                  onChange={(e) => handleInputChange(e, i)}
                >
                  <Box>
                    {educationalDetailsArray.length - 1 === i ? (
                      <AddCircleOutlineIcon
                        sx={{ cursor: "pointer" }}
                        fontSize="medium"
                        color="primary"
                        onClick={() => {
                          handleEducationDetailsAddButtonError(i);
                          // const tempArray = [...educationalDetailsArray];
                          // tempArray.push({
                          //   level: "",
                          //   instituteName: "",
                          //   percentage: "",
                          //   yop: "",
                          // });
                          // setEducationalDetailsArray([...tempArray]);
                        }}
                      />
                    ) : (
                      <RemoveCircleOutlineIcon
                        sx={{ cursor: "pointer" }}
                        fontSize="medium"
                        color="primary"
                        onClick={() => {
                          const tempArray = [...educationalDetailsArray];
                          tempArray.splice(i, 1);
                          setEducationalDetailsArray([...tempArray]);
                        }}
                      />
                    )}
                  </Box>
                </Box>
              </Grid>
            </Grid>
          );
        })}
      </Box>
    </Box>
  );
};

export default EducationalInfo;
