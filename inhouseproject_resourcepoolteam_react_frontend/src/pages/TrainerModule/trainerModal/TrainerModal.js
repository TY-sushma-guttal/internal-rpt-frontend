import React, { useEffect, useState } from "react";
import ModalComponent from "../../../components/molecules/ModalComponent";
import { regex } from "../../../regex/regex";
import {
  editTrainerDetails,
  saveTrainerDetails,
} from "../../../services/trainermodule/trainermodule";
import TrainerRegistration from "../../../components/forms/TrainerModule/TrainerRegistration";
import { useToasts } from "react-toast-notifications";

let trainerRegistrationFormErrorObj = {
  empid: "",
  empName: "",
  officialEmail: "",
  skills: "",
  phno: "",
  rating: "",
};

function TrainerModal({
  trainerModal,
  closeTrainerModal,
  getTheTrainerDetails,
  modalType,
  modalData,
}) {
  const [trainerRegistrationForm, settrainerRegistrationForm] = useState({
    empid: "",
    empName: "",
    officialEmail: "",
    skills: [],
    phno: "",
    rating: {},
  });

  const { addToast } = useToasts();
  const [trainerRegistrationFormError, settrainerRegistrationFormError] =
    useState(trainerRegistrationFormErrorObj);

  const {
    nameWithSpaces,
    emailRegex,
    indianMobileNumberRegex,
    notAllowSpecialChar,
    mobileRegex,
  } = regex;

  const handleTrainerDetailsError = () => {
    let trainerRegistrationFormErrorObj = {
      empid: "",
      empName: "",
      officialEmail: "",
      skills: "",
      phno: "",
      rating: "",
    };

    let theError = false;

    let { empid, empName, officialEmail, skills, phno, rating } =
      trainerRegistrationForm;

    if (empid.trim() === "") {
      trainerRegistrationFormErrorObj.empid = "This field is required";
      theError = true;
    } else if (empid.trim().length > 20) {
      trainerRegistrationFormErrorObj.empid = "Upto 20 characters allowed";
      theError = true;
    } else if (notAllowSpecialChar.test(empid)) {
      trainerRegistrationFormErrorObj.empid =
        "Special characters are not allowed";
      theError = true;
    }

    if (empName.trim() === "") {
      trainerRegistrationFormErrorObj.empName = "This field is required";
      theError = true;
    } else if (!nameWithSpaces.test(empName)) {
      trainerRegistrationFormErrorObj.empName = "Invalid employee name";
      theError = true;
    } else if (empName.trim().length > 50) {
      trainerRegistrationFormErrorObj.empName = "Upto 50 characters allowed";
      theError = true;
    }

    if (phno.trim() === "") {
      trainerRegistrationFormErrorObj.phno = "This field is required";
      theError = true;
    } else if (!mobileRegex.test(phno)) {
      trainerRegistrationFormErrorObj.phno = "Invalid mobile number";
      theError = true;
    }

    if (officialEmail.trim() === "") {
      trainerRegistrationFormErrorObj.officialEmail = "This field is required";
      theError = true;
    } else if (!emailRegex.test(officialEmail)) {
      trainerRegistrationFormErrorObj.officialEmail = "Invalid email id";
      theError = true;
    }

    // if (Object.keys(rating).length === 0) {
    //   trainerRegistrationFormErrorObj.rating = "This field is required";
    //   theError = true;
    // }

    if (skills.length === 0) {
      trainerRegistrationFormErrorObj.skills = "This field is required";
      theError = true;
    }

    settrainerRegistrationFormError({ ...trainerRegistrationFormErrorObj });

    return theError;
  };

  let createPayloadAndCallApi = async () => {
    let addPayload = {
      employeeId: trainerRegistrationForm.empid,
      name: trainerRegistrationForm.empName,
      officialEmailId: trainerRegistrationForm.officialEmail,
      skills: trainerRegistrationForm.skills.map((val) => val.title),
      phno: trainerRegistrationForm.phno,
      rating: trainerRegistrationForm.rating.label,
    };
    let editPayload = {
      trainerId: trainerRegistrationForm.trainerId,
      employeeId: trainerRegistrationForm.empid,
      name: trainerRegistrationForm.empName,
      officialEmailId: trainerRegistrationForm.officialEmail,
      skills: trainerRegistrationForm.skills.map((val) => val.title),
      phno: trainerRegistrationForm.phno,
      rating: trainerRegistrationForm.rating.label,
      status: trainerRegistrationForm.status,
      isDelete: trainerRegistrationForm.isDelete,
    };

    let { data, error } =
      modalType === "ADD"
        ? await saveTrainerDetails(addPayload)
        : await editTrainerDetails(editPayload);
    if (data) {
      if (data.isError) {
        addToast(data.message, { appearance: "error" });
      } else {
        addToast(data.message, { appearance: "success" });
        await getTheTrainerDetails();
        closeTrainerModal();
        clearAllField();
      }
    } else if (error) {
      addToast(error?.response?.data?.message, { appearance: "error" });
    }
  };

  let submitTrainerDetails = () => {
    if (!handleTrainerDetailsError()) {
      createPayloadAndCallApi();
    }
  };

  let clearAllField = () => {
    settrainerRegistrationForm({
      empid: "",
      empName: "",
      officialEmail: "",
      skills: [],
      phno: "",
      rating: {},
    });
  };

  let clearValidationFields = () => {
    settrainerRegistrationFormError(trainerRegistrationFormErrorObj);
  };

  useEffect(() => {
    return () => {
      clearValidationFields();
      clearAllField();
    };
  }, [trainerModal]);

  useEffect(() => {
    if (modalType === "EDIT") {
      let tempSkills = [];
      if (modalData.skills.length > 0) {
        modalData.skills.map((val) => {
          return tempSkills.push({ id: val, title: val, value: val });
        });
      }
      settrainerRegistrationForm({
        empid: modalData.empid,
        empName: modalData.empName,
        officialEmail: modalData.officialEmail,
        skills: tempSkills,
        phno: `${modalData.phno}`,
        rating: modalData.rating,
        trainerId: modalData.trainerId,
        isDelete: modalData.isDelete,
        status: modalData.status,
      });
    }
  }, [modalData]);

  return (
    <>
      <ModalComponent
        open={trainerModal}
        onCloseBtnClick={closeTrainerModal}
        onCancelBtnClick={closeTrainerModal}
        modalTitle={
          modalType === "ADD" ? "Add Trainer Details" : "Edit Trainer Details"
        }
        onSubmitBtnClick={submitTrainerDetails}
        onClearBtnClick={clearAllField}
      >
        <TrainerRegistration
          trainerRegistrationForm={trainerRegistrationForm}
          settrainerRegistrationForm={settrainerRegistrationForm}
          trainerRegistrationFormError={trainerRegistrationFormError}
          modalType={modalType}
        />
      </ModalComponent>
    </>
  );
}

export default TrainerModal;
