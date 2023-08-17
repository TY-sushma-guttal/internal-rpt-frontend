import { Box, Paper, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import HorizontalLinearSterpper from "../../components/molecules/Stepper/HorizontalLinearStepper";
import CandidateInfo from "../../components/forms/CandidateRegistration/CandidateInfo/CandidateInfo";
import CandidateOtherInfo from "../../components/forms/CandidateRegistration/CandidateOtherInfo/CandidateOtherInfo";
import EducationalInfo from "../../components/forms/CandidateRegistration/EducationalInfo/EducationalInfo";
import TechnicalSkills from "../../components/forms/CandidateRegistration/TechnicalSkills/TechnicalSkills";
import { regex } from "../../regex/regex";
import { getCandidateInfo } from "../../services/candidateregistration/candidateregistration";
import { postCandidateInfo } from "../../services/candidateregistration/candidateregistration";
import { useToasts } from "react-toast-notifications";
import technicalskillsarray from "../../constants/candidateregistration/technicalskillarray/technicalskillsarray";

let candidateInfoErrorObj = {
  candidateName: "",
  gender: "",
  officialMailId: "",
  contactNumber: "",
  dateOfBirth: "",
  bloodGroup: "",
  panNumber: "",
  adhaarNumber: "",
  highestQualification: "",
  trainedInJspider: "",
  haveAnExperience: "",
};

let candidateOtherDetailsErrorObj = {
  fatherName: "",
  fatherContactNumber: "",
  motherName: "",
  motherContactNumber: "",
  personalEmailID: "",
  emergencyContactNumber: "",
  alternateEmergencyContactNumber: "",
  permanentAddress: "",
  temporaryAddress: "",
};

let jspiderDetailsErrorObj = {
  joiningDate: "",
  branchName: "",
  technologiesLearned: "",
  isCourseCompleted: "",
};

let experienceDetailsErrorObj = {
  totalExperience: "",
  companyName: "",
  joiningDateInCompany: "",
  releavingDate: "",
  designation: "",
  technicalSkills: "",
};

const CandidateRegistration = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [candidateInfoFormData, setCandidateInfoFormData] = useState({
    candidateName: "",
    gender: { label: "", id: 0 },
    officialMailId: "",
    contactNumber: "",
    dateOfBirth: null,
    bloodGroup: { label: "", id: 0 },
    panNumber: "",
    adhaarNumber: "",
    highestQualification: "",
    trainedInJspider: false,
    haveAnExperience: false,
  });

  const { addToast } = useToasts();
  const [dropdownOptionsForSkills, setDropdownOptionsForSkills] = useState([]);

  const [candidateInfoError, setCandidateInfoError] = useState(
    candidateInfoErrorObj
  );

  const [jspiderDetailsError, setJspiderDetailsError] = useState(
    jspiderDetailsErrorObj
  );

  const [experienceDetailsError, setExperienceDetailsError] = useState(
    experienceDetailsErrorObj
  );

  const [candidateJspidersDetails, setCandidateJspidersDetails] = useState({
    joiningDate: null,
    branchName: "",
    technologiesLearned: [],
    isCourseCompleted: false,
  });

  const [experienceDetails, setExperienceDetails] = useState({
    totalExperience: "",
    companyName: "",
    joiningDateInCompany: null,
    releavingDate: null,
    designation: "",
    technicalSkills: [],
  });

  const [educationDetailsError, seteducationDetailsError] = useState([
    {
      level: "",
      instituteName: "",
      percentage: "",
      yop: "",
    },
  ]);

  const [technicalSkillsError, settechnicalSkillsError] = useState([
    {
      skill: "",
      rating: "",
    },
  ]);

  const {
    nameWithSpaces,
    emailRegex,
    mobileRegex,
    indianMobileNumberRegex,
    pancardNumberRegex,
    adhaarNumberRegex,
    percentageRegex,
    cgpaRegex,
  } = regex;

  // second page
  const [candidateOtherDetails, setcandidateOtherDetails] = useState({
    fatherName: "",
    fatherContactNumber: "",
    motherName: "",
    motherContactNumber: "",
    personalEmailID: "",
    emergencyContactNumber: "",
    alternateEmergencyContactNumber: "",
    permanentAddress: "",
    temporaryAddress: "",
  });

  const [candidateOtherInfoError, setCandidateOtherInfoError] = useState(
    candidateOtherDetailsErrorObj
  );

  // third page
  const [educationalDetailsArray, setEducationalDetailsArray] = useState([
    {
      level: { id: "", label: "" },
      instituteName: "",
      percentage: "",
      yop: { label: "", id: 0 },
      percentageOrCgpa: "percentage",
    },
  ]);
  //fourth page
  const [technicalSkillsArray, setTechnicalSkillsArray] = useState([
    {
      skill: "",
      rating: "",
    },
  ]);

  const sortSkillsArrayAndSetToTheOptions = () => {
    let tempArray = technicalskillsarray.sort((a, b) => {
      let compareA;
      let compareB;
      if (a.includes(".")) {
        compareA = a.split(".").join("");
      } else {
        compareA = a;
      }

      if (b.includes(".")) {
        compareB = b.split(".").join("");
      } else {
        compareB = b;
      }

      if (compareA.toUpperCase() < compareB.toUpperCase()) {
        return -1;
      } else if (compareA.toUpperCase() > compareB.toUpperCase()) {
        return 1;
      } else {
        return 0;
      }
    });

    tempArray = tempArray.map((val, index) => {
      return {
        id: index,
        title: val,
        value: val,
      };
    });

    setDropdownOptionsForSkills([...tempArray]);
  };
  const handleCandidateInfoFormDataError = () => {
    candidateInfoErrorObj = {
      candidateName: "",
      gender: "",
      officialMailId: "",
      contactNumber: "",
      dateOfBirth: "",
      bloodGroup: "",
      panNumber: "",
      adhaarNumber: "",
      highestQualification: "",
      trainedInJspider: "",
      haveAnExperience: "",
    };
    let theError = false;

    const {
      candidateName,
      gender,
      officialMailId,
      contactNumber,
      dateOfBirth,
      bloodGroup,
      panNumber,
      adhaarNumber,
      highestQualification,
    } = candidateInfoFormData;

    if (candidateName.trim() === "") {
      candidateInfoErrorObj.candidateName = "This field is required";
      theError = true;
    } else if (!nameWithSpaces.test(candidateName)) {
      candidateInfoErrorObj.candidateName = "Invalid Name";
      theError = true;
    } else if (candidateName.length > 50) {
      candidateInfoErrorObj.candidateName =
        "Invalid Name (Max characters allowed 50)";
      theError = true;
    }

    if (gender.label === "") {
      candidateInfoErrorObj.gender = "This field is required";
      theError = true;
    }

    if (officialMailId.trim() === "") {
      candidateInfoErrorObj.officialMailId = "This field is required";
      theError = true;
    } else if (!emailRegex.test(officialMailId)) {
      candidateInfoErrorObj.officialMailId = "Invalid Email";
      theError = true;
    }

    if (contactNumber.trim() === "") {
      candidateInfoErrorObj.contactNumber = "This field is required";
      theError = true;
    } else if (!mobileRegex.test(contactNumber)) {
      candidateInfoErrorObj.contactNumber = "Invalid mobile number";
      theError = true;
    }

    if (dateOfBirth === null) {
      candidateInfoErrorObj.dateOfBirth = "This field is required";
      theError = true;
    }

    if (bloodGroup.label === "") {
      candidateInfoErrorObj.bloodGroup = "This field is required";
      theError = true;
    }

    if (panNumber.trim() === "") {
      candidateInfoErrorObj.panNumber = "This field is required";
      theError = true;
    } else if (!pancardNumberRegex.test(panNumber)) {
      candidateInfoErrorObj.panNumber = "Invalid Pan Number";
      theError = true;
    }

    if (adhaarNumber.trim() === "") {
      candidateInfoErrorObj.adhaarNumber = "This field is required";
      theError = true;
    } else if (!adhaarNumberRegex.test(adhaarNumber)) {
      candidateInfoErrorObj.adhaarNumber = "Invalid Adhaar number";
      theError = true;
    }

    if (highestQualification.trim() === "") {
      candidateInfoErrorObj.highestQualification = "This field is required";
      theError = true;
    } else if (!nameWithSpaces.test(highestQualification)) {
      candidateInfoErrorObj.highestQualification = "Invalid Qualification";
      theError = true;
    }

    setCandidateInfoError({ ...candidateInfoErrorObj });

    return theError;
  };

  const handleJspiderDetailsError = () => {
    let theError = false;

    const { joiningDate, branchName, technologiesLearned } =
      candidateJspidersDetails;

    jspiderDetailsErrorObj = {
      joiningDate: "",
      branchName: "",
      technologiesLearned: "",
      isCourseCompleted: "",
    };

    if (joiningDate === null) {
      jspiderDetailsErrorObj.joiningDate = "This field is required";
      theError = true;
    }

    if (branchName.trim() === "") {
      jspiderDetailsErrorObj.branchName = "This field is required";
      theError = true;
    } else if (!nameWithSpaces.test(branchName)) {
      jspiderDetailsErrorObj.branchName = "Invalid branch name";
      theError = true;
    }

    if (technologiesLearned.length === 0) {
      jspiderDetailsErrorObj.technologiesLearned = "This field is required";
      theError = true;
    }

    setJspiderDetailsError({ ...jspiderDetailsErrorObj });

    return theError;
  };

  const handleExperienceDetailsError = () => {
    let theError = false;
    experienceDetailsErrorObj = {
      totalExperience: "",
      companyName: "",
      joiningDateInCompany: "",
      releavingDate: "",
      designation: "",
      technicalSkills: "",
    };

    const {
      totalExperience,
      companyName,
      joiningDateInCompany,
      releavingDate,
      designation,
      technicalSkills,
    } = experienceDetails;

    if (totalExperience.trim() === "") {
      experienceDetailsErrorObj.totalExperience = "This field is required";
      theError = true;
    }
    if (companyName.trim() === "") {
      experienceDetailsErrorObj.companyName = "This field is required";
      theError = true;
    } else if (!nameWithSpaces.test(companyName)) {
      experienceDetailsErrorObj.companyName = "Invalid company name";
      theError = true;
    }

    if (joiningDateInCompany === null) {
      experienceDetailsErrorObj.joiningDateInCompany = "This field is required";
      theError = true;
    }

    if (releavingDate === null) {
      experienceDetailsErrorObj.releavingDate = "This field is required";
      theError = true;
    } else if (releavingDate < joiningDateInCompany) {
      experienceDetailsErrorObj.releavingDate =
        "Relieving Date cannot be less than Joining Date";
      theError = true;
    }
    if (designation === "") {
      experienceDetailsErrorObj.designation = "This field is required";
      theError = true;
    } else if (!nameWithSpaces.test(designation)) {
      experienceDetailsErrorObj.designation = "Invalid designation";
      theError = true;
    }

    if (technicalSkills.length === 0) {
      experienceDetailsErrorObj.technicalSkills = "This field is required";
      theError = true;
    }

    setExperienceDetailsError({ ...experienceDetailsErrorObj });

    return theError;
  };

  const handleCandidateOtherDetailsError = () => {
    let candidateOtherDetailsErrorObj = {
      fatherName: "",
      fatherContactNumber: "",
      motherName: "",
      motherContactNumber: "",
      personalEmailID: "",
      emergencyContactNumber: "",
      alternateEmergencyContactNumber: "",
      permanentAddress: "",
      temporaryAddress: "",
    };
    let theError = false;

    let {
      fatherName,
      fatherContactNumber,
      motherName,
      motherContactNumber,
      personalEmailID,
      emergencyContactNumber,
      alternateEmergencyContactNumber,
      permanentAddress,
      temporaryAddress,
    } = candidateOtherDetails;

    if (fatherName.trim() === "") {
      candidateOtherDetailsErrorObj.fatherName = "This field is required";
      theError = true;
    } else if (!nameWithSpaces.test(fatherName)) {
      candidateOtherDetailsErrorObj.fatherName = "Invalid father's name";
      theError = true;
    } else if (fatherName.length > 50) {
      candidateInfoErrorObj.candidateName =
        "Invalid Name (Max characters allowed 50)";
      theError = true;
    }

    if (fatherContactNumber.trim() === "") {
      candidateOtherDetailsErrorObj.fatherContactNumber =
        "This field is required";
      theError = true;
    } else if (!mobileRegex.test(fatherContactNumber)) {
      candidateOtherDetailsErrorObj.fatherContactNumber =
        "Invalid mobile number";
      theError = true;
    }

    if (motherName.trim() === "") {
      candidateOtherDetailsErrorObj.motherName = "This field is required";
      theError = true;
    } else if (!nameWithSpaces.test(motherName)) {
      candidateOtherDetailsErrorObj.motherName = "Invalid mother's name";
      theError = true;
    } else if (motherName.length > 50) {
      candidateInfoErrorObj.candidateName =
        "Invalid Name (Max characters allowed 50)";
      theError = true;
    }

    if (motherContactNumber.trim() === "") {
      candidateOtherDetailsErrorObj.motherContactNumber =
        "This field is required";
      theError = true;
    } else if (!mobileRegex.test(motherContactNumber)) {
      candidateOtherDetailsErrorObj.motherContactNumber =
        "Invalid mobile number";
      theError = true;
    }

    if (personalEmailID.trim() === "") {
      candidateOtherDetailsErrorObj.personalEmailID = "This field is required";
      theError = true;
    } else if (!emailRegex.test(personalEmailID)) {
      candidateOtherDetailsErrorObj.personalEmailID = "Invalid Email";
      theError = true;
    }

    if (emergencyContactNumber.trim() === "") {
      candidateOtherDetailsErrorObj.emergencyContactNumber =
        "This field is required";
      theError = true;
    } else if (!mobileRegex.test(emergencyContactNumber)) {
      candidateOtherDetailsErrorObj.emergencyContactNumber =
        "Invalid mobile number";
      theError = true;
    }

    if (alternateEmergencyContactNumber.trim() === "") {
      candidateOtherDetailsErrorObj.alternateEmergencyContactNumber =
        "This field is required";
      theError = true;
    } else if (!mobileRegex.test(alternateEmergencyContactNumber)) {
      candidateOtherDetailsErrorObj.alternateEmergencyContactNumber =
        "Invalid mobile number";
      theError = true;
    }

    if (permanentAddress.trim() === "") {
      candidateOtherDetailsErrorObj.permanentAddress = "This field is required";
      theError = true;
    }
    if (temporaryAddress.trim() === "") {
      candidateOtherDetailsErrorObj.temporaryAddress = "This field is required";
      theError = true;
    }

    setCandidateOtherInfoError({ ...candidateOtherDetailsErrorObj });

    return theError;
  };

  let handleEducationDetailsAddButtonError = (index) => {
    const tempsEducationDetails = [...educationalDetailsArray];
    const tempErr = [...educationDetailsError];
    if (tempsEducationDetails[index].level.label === "") {
      tempErr[index].level = "This field is requried";
    } else {
      tempErr[index].level = "";
    }
    if (tempsEducationDetails[index].instituteName === "") {
      tempErr[index].instituteName = "This field is requried";
    } else if (
      tempsEducationDetails[index].instituteName !== "" &&
      !nameWithSpaces.test(tempsEducationDetails[index].instituteName)
    ) {
      tempErr[index].instituteName =
        "Enter valid institute name (Max 50 characters)";
    } else if (tempsEducationDetails[index].instituteName.length > 50) {
      tempErr[index].instituteName =
        "Enter valid institute name (Max 50 characters)";
    } else {
      tempErr[index].instituteName = "";
    }
    if (tempsEducationDetails[index].percentage === "") {
      tempErr[index].percentage = "This field is requried";
    } else if (
      tempsEducationDetails[index].percentageOrCgpa === "percentage" &&
      !percentageRegex.test(tempsEducationDetails[index].percentage)
    ) {
      tempErr[index].percentage = "Enter valid percentage (between 0-100)";
    } else if (
      tempsEducationDetails[index].percentageOrCgpa === "cgpa" &&
      !cgpaRegex.test(tempsEducationDetails[index].percentage)
    ) {
      tempErr[index].percentage = "Enter valid cgpa (between 0-10)";
    } else {
      tempErr[index].percentage = "";
    }

    if (tempsEducationDetails[index].yop.label === "") {
      tempErr[index].yop = "This field is requried";
    } else if (
      tempsEducationDetails[index].yop.label !== "" &&
      (parseInt(tempsEducationDetails[index].yop.label) < 2000 ||
        parseInt(tempsEducationDetails[index].yop.label) >
          new Date().getFullYear())
    ) {
      tempErr[index].yop = "Enter valid year of passout";
    } else {
      tempErr[index].yop = "";
    }

    seteducationDetailsError([...tempErr]);
    if (Object.values(tempErr[index]).every((x) => x === "")) {
      setEducationalDetailsArray([
        ...tempsEducationDetails,
        {
          level: { id: "", label: "" },
          instituteName: "",
          percentage: "",
          yop: { label: "", id: 0 },
          percentageOrCgpa: "percentage",
        },
      ]);
      seteducationDetailsError([
        ...tempErr,
        {
          level: "",
          instituteName: "",
          percentage: "",
          yop: "",
        },
      ]);
    }
  };

  const handleEducationDetailsError = (data) => {
    let err = false;
    let tempErr = [...educationDetailsError];
    data.map((value, index) => {
      console.log(value, index, "value index");
      if (value.level.label.trim() === "") {
        err = true;
        tempErr[index].level = "This field is required";
      } else {
        tempErr[index].level = "";
      }
      if (value.instituteName === "") {
        err = true;
        tempErr[index].instituteName = "This field is required";
      } else if (
        value.instituteName !== "" &&
        !nameWithSpaces.test(value.instituteName)
      ) {
        err = true;
        tempErr[index].instituteName =
          "Enter valid institute name (Max 50 characters)";
      } else if (value.instituteName.length > 50) {
        err = true;
        tempErr[index].instituteName =
          "Enter valid institute name (Max 50 characters)";
      } else {
        tempErr[index].instituteName = "";
      }
      if (value.percentage === "") {
        err = true;
        tempErr[index].percentage = "This field is required";
      } else if (
        value.percentageOrCgpa === "percentage" &&
        !percentageRegex.test(value.percentage)
      ) {
        err = true;
        tempErr[index].percentage = "Enter valid percentage (between 0-100)";
      } else if (
        value.percentageOrCgpa === "cgpa" &&
        !cgpaRegex.test(value.percentage)
      ) {
        err = true;
        tempErr[index].percentage = "Enter valid cgpa (between 0-10)";
      } else {
        tempErr[index].percentage = "";
      }

      if (value.yop.label === "") {
        err = true;
        tempErr[index].yop = "This field is required";
      } else if (
        value.yop.label !== "" &&
        (parseInt(value.yop.label) < 2000 ||
          parseInt(value.yop.label) > new Date().getFullYear())
      ) {
        err = true;
        tempErr[index].yop = "Enter valid year of passout";
      } else {
        tempErr[index].yop = "";
      }
    });
    seteducationDetailsError([...tempErr]);
    return err;
  };

  let handleTechnicalSkillsAddButtonError = (index) => {
    const tempskills = [...technicalSkillsArray];
    const tempErr = [...technicalSkillsError];
    if (tempskills[index].skill === "") {
      tempErr[index].skill = "This field is requried";
    } else {
      tempErr[index].skill = "";
    }
    if (tempskills[index].rating === "") {
      tempErr[index].rating = "This field is requried";
    } else {
      tempErr[index].rating = "";
    }
    settechnicalSkillsError([...tempErr]);
    if (Object.values(tempErr[index]).every((x) => x === "")) {
      setTechnicalSkillsArray([
        ...tempskills,
        {
          skill: "",
          rating: "",
        },
      ]);
      settechnicalSkillsError([
        ...tempErr,
        {
          skill: "",
          rating: "",
        },
      ]);
    }
  };

  const handleTechnicalSkillsError = (data) => {
    let err = false;
    let tempErr = [...technicalSkillsError];
    data.map((value, index) => {
      if (value.skill === "") {
        err = true;
        tempErr[index].skill = "This field is required";
      } else {
        tempErr[index].skill = "";
      }
      if (value.rating === "") {
        err = true;
        tempErr[index].rating = "This field is required";
      } else {
        tempErr[index].rating = "";
      }
    });
    settechnicalSkillsError([...tempErr]);
    return err;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  // handling error in by active steps
  const handlingErrorsIfActiveStepIsZero = () => {
    if (
      !candidateInfoFormData.trainedInJspider &&
      !candidateInfoFormData.haveAnExperience
    ) {
      if (!handleCandidateInfoFormDataError()) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    } else if (
      candidateInfoFormData.trainedInJspider &&
      !candidateInfoFormData.haveAnExperience
    ) {
      const errorForJspiderDetails = handleJspiderDetailsError();
      const errorForCandidateInfoDetails = handleCandidateInfoFormDataError();
      if (!errorForJspiderDetails && !errorForCandidateInfoDetails) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    } else if (
      !candidateInfoFormData.trainedInJspider &&
      candidateInfoFormData.haveAnExperience
    ) {
      const errorForExperienceDetails = handleExperienceDetailsError();
      const errorForCandidateInfoDetails = handleCandidateInfoFormDataError();
      if (!errorForExperienceDetails && !errorForCandidateInfoDetails) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    } else {
      const errorForExperienceDetails = handleExperienceDetailsError();
      const errorForCandidateInfoDetails = handleCandidateInfoFormDataError();
      const errorForJspiderDetails = handleJspiderDetailsError();
      if (
        !errorForExperienceDetails &&
        !errorForCandidateInfoDetails &&
        !errorForJspiderDetails
      ) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    }
  };

  const handlingErrorsIfActiveStepIsOne = () => {
    if (!handleCandidateOtherDetailsError()) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handlingErrorsIfActiveStepIsTwo = (data) => {
    if (!handleEducationDetailsError(data)) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };
  const handlingErrorsIfActiveStepIsThree = async (data) => {
    if (!handleTechnicalSkillsError(data)) {
      await postTheDetailsOfTheCandidate();
    }
  };

  const handleNext = () => {
    if (activeStep === 0) {
      handlingErrorsIfActiveStepIsZero();
    }
    if (activeStep === 1) {
      handlingErrorsIfActiveStepIsOne();
    }
    if (activeStep === 2) {
      handlingErrorsIfActiveStepIsTwo(educationalDetailsArray);
    }
    if (activeStep === 3) {
      handlingErrorsIfActiveStepIsThree(technicalSkillsArray);
    }
    // OR
    // setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const returnProperDate = (aDate) => {
    return `${
      aDate.getDate() >= 10 ? aDate.getDate() : `0${aDate.getDate()}`
    }-${
      aDate.getMonth() + 1 >= 10
        ? aDate.getMonth() + 1
        : `0${aDate.getMonth() + 1}`
    }-${aDate.getFullYear()}`;
  };

  const postTheDetailsOfTheCandidate = async () => {
    const {
      candidateName,
      gender,
      officialMailId,
      contactNumber,
      dateOfBirth,
      bloodGroup,
      panNumber,
      adhaarNumber,
      highestQualification,
      trainedInJspider,
      haveAnExperience,
    } = candidateInfoFormData;

    const {
      fatherName,
      fatherContactNumber,
      motherName,
      motherContactNumber,
      personalEmailID,
      emergencyContactNumber,
      alternateEmergencyContactNumber,
      permanentAddress,
      temporaryAddress,
    } = candidateOtherDetails;

    const { joiningDate, branchName, technologiesLearned, isCourseCompleted } =
      candidateJspidersDetails;

    const {
      totalExperience,
      companyName,
      joiningDateInCompany,
      releavingDate,
      designation,
      technicalSkills,
    } = experienceDetails;

    const payload = {
      candidateId: null,
      candidateName,
      gender: gender.label,
      officialMailId,
      selfContactNumber: contactNumber,
      dob: returnProperDate(dateOfBirth),
      bloodGroup: bloodGroup.label,
      panNumber,
      adhaarNumber,
      highestQualification,
      isDelete: false,
      candidateOtherInfo: {
        // candidateOtherInfoId: 0,
        candidateFatherName: fatherName,
        fatherContactNumber,
        candidateMotherName: motherName,
        motherContactNumber,
        personalEmailAddress: personalEmailID,
        areaOfInterest: "Some interest",
        emergencyContactNumber1: emergencyContactNumber,
        emergencyContactNumber2: alternateEmergencyContactNumber,
        permanentAddress,
        temporaryAddress,
      },
      trainingDetails: trainedInJspider
        ? {
            // traningDetailId: 0,
            joiningDate: returnProperDate(joiningDate),
            branchName,
            isCourseCompleted,
            technology: technologiesLearned.map((val) => val.title),
          }
        : null,
      educationalDetails: educationalDetailsArray.map((val, index) => {
        const { level, instituteName, percentage, yop } = val;
        return {
          // educationalId: index,
          type: level.label,
          result: percentage,
          instituteName,
          yearOfPassout: yop.label,
          stream: level,
        };
      }),
      experienceDetails: haveAnExperience
        ? [
            {
              // experienceDetailId: 0,
              isExperience: true,
              totalExperience: totalExperience,
              companyName: companyName,
              designation: designation,
              joiningDate: returnProperDate(joiningDateInCompany),
              releavingDate: returnProperDate(releavingDate),
            },
          ]
        : null,
      technicalSkills: technicalSkillsArray.map((val, index) => {
        const { skill, rating } = val;
        return {
          // technicalSkillId: index,
          skill: skill.label,
          rating: rating.label,
        };
      }),
    };

    const { data, error } = await postCandidateInfo(payload);

    if (data) {
      if (data.isError) {
        addToast(data.message, { appearance: "error" });
      } else {
        addToast(data.message, { appearance: "success" });
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    } else if (error) {
      addToast(error?.response?.data?.message, { appearance: "error" });
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const steps = [
    "Candidate Details",
    "Candidate Other Details",
    "Educational Details",
    "Technical Skills",
  ];

  const handleReset = () => {
    setActiveStep(0);
  };

  const getCanInfo = async () => {
    const { data, error } = await getCandidateInfo();
    if (data) {
      console.log(data.data);
    } else if (error) {
      console.log(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    if (!candidateInfoFormData.trainedInJspider) {
      setCandidateJspidersDetails({
        joiningDate: null,
        branchName: "",
        technologiesLearned: [],
        isCourseCompleted: false,
      });
      setJspiderDetailsError({
        joiningDate: "",
        branchName: "",
        technologiesLearned: "",
        isCourseCompleted: "",
      });
    }
  }, [candidateInfoFormData.trainedInJspider]);

  useEffect(() => {
    if (!candidateInfoFormData.haveAnExperience) {
      setExperienceDetails({
        totalExperience: "",
        companyName: "",
        joiningDateInCompany: null,
        releavingDate: null,
        designation: "",
        technicalSkills: [],
      });
      setExperienceDetailsError({
        totalExperience: "",
        companyName: "",
        joiningDateInCompany: "",
        releavingDate: "",
        designation: "",
        technicalSkills: "",
      });
    }
  }, [candidateInfoFormData.haveAnExperience]);

  useEffect(() => {
    sortSkillsArrayAndSetToTheOptions();
  }, []);

  return (
    <Paper>
      <Box paddingTop={2} display="flex" justifyContent="center">
        <Box sx={{ width: "80%" }}>
          <HorizontalLinearSterpper
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            skipped={skipped}
            setSkipped={setSkipped}
            steps={steps}
            handleNext={handleNext}
            handleBack={handleBack}
            isStepSkipped={isStepSkipped}
            handleReset={handleReset}
          >
            <Box
              sx={{
                height: "65vh",
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              {activeStep === 0 && (
                <CandidateInfo
                  candidateInfoFormData={candidateInfoFormData}
                  setCandidateInfoFormData={setCandidateInfoFormData}
                  candidateJspidersDetails={candidateJspidersDetails}
                  setCandidateJspidersDetails={setCandidateJspidersDetails}
                  experienceDetails={experienceDetails}
                  setExperienceDetails={setExperienceDetails}
                  candidateInfoError={candidateInfoError}
                  experienceDetailsError={experienceDetailsError}
                  jspiderDetailsError={jspiderDetailsError}
                  dropdownOptionsForSkills={dropdownOptionsForSkills}
                />
              )}
              {activeStep === 1 && (
                <CandidateOtherInfo
                  candidateOtherDetails={candidateOtherDetails}
                  setcandidateOtherDetails={setcandidateOtherDetails}
                  candidateOtherInfoError={candidateOtherInfoError}
                />
              )}
              {activeStep === 2 && (
                <EducationalInfo
                  educationalDetailsArray={educationalDetailsArray}
                  setEducationalDetailsArray={setEducationalDetailsArray}
                  handleEducationDetailsAddButtonError={
                    handleEducationDetailsAddButtonError
                  }
                  educationDetailsError={educationDetailsError}
                />
              )}
              {activeStep === 3 && (
                <TechnicalSkills
                  technicalSkillsArray={technicalSkillsArray}
                  setTechnicalSkillsArray={setTechnicalSkillsArray}
                  technicalSkillsError={technicalSkillsError}
                  handleTechnicalSkillsAddButtonError={
                    handleTechnicalSkillsAddButtonError
                  }
                />
              )}
              {activeStep === 4 && (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  sx={{ height: "100%", width: "100%" }}
                >
                  <Typography variant="h4" color="lightgreen">
                    You have filled the form successfully
                  </Typography>
                </Box>
              )}
            </Box>
          </HorizontalLinearSterpper>
        </Box>
      </Box>
    </Paper>
  );
};

export default CandidateRegistration;
