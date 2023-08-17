import AttendanceModule from "../../pages/AttendanceModule/AttendanceModule";
import BatchIcon from "../../assets/BatchIcon";
import CandidateOnboadIcon from "../../assets/CandidateOnboadIcon";
import CandidateRegistrationIcon from "../../assets/CandidateRegistrationIcon";
import DashboardIcon from "../../assets/DashboardIcon";
import TrainerIcon from "../../assets/TrainerIcon";
import BatchModule from "../../pages/BatchModule/BatchModule";
import CandidateOnBoardDetails from "../../pages/CandidateOnboardDetails/CandidateOnBoardDetails";
import CandidateRegistration from "../../pages/CandidateRegistration/CandidateRegistration";
import TrainerModule from "../../pages/TrainerModule/TrainerModule";
import AttendanceIcon from "../../assets/AttendanceIcon";
import TrainerFeedbackToCandidate from "../../pages/TrainerFeedbackToCandidate/TrainerFeedbackToCandidate";
import TrainerFeedbackToCandidateIcon from "../../assets/TrainerFeedbackToCandidateIcon";
import MockCreationModule from "../../pages/MockModule/MockModule";
import CreateMock from "../../pages/MockModule/CreateMock";
import MockDetailsIcon from "../../assets/MockDetailsIcon";
import AddFeedBack from "../../pages/MockModule/AddFeedBack";

const resourcePoolRouteObject = [
  {
    label: "Dashboard",
    sideBarIcon: <DashboardIcon fill={"#ff9800"} />,
    sideBarActiveIcon: <DashboardIcon fill={"#ff9800"} />,
    element: "Dashboard",
    path: "/dashboard",
    child: [],
  },
  {
    label: "Candidate registration",
    sideBarIcon: <CandidateRegistrationIcon fill={"#ff9800"} />,
    sideBarActiveIcon: <CandidateRegistrationIcon fill={"#ff9800"} />,
    element: <CandidateRegistration />,
    path: "/candidateregistration",
    child: [],
  },
  {
    label: "Batch module",
    sideBarIcon: <BatchIcon fill={"#ff9800"} />,
    sideBarActiveIcon: <BatchIcon fill={"#ff9800"} />,
    element: <BatchModule />,
    path: "/batchmodule",
    child: [],
  },
  {
    label: "Trainer module",
    sideBarIcon: <TrainerIcon fill={"#ff9800"} />,
    sideBarActiveIcon: <TrainerIcon fill={"#ff9800"} />,
    element: <TrainerModule />,
    path: "/trainermodule",
    child: [],
  },
  {
    label: "Candidate onboard details",
    sideBarIcon: <CandidateOnboadIcon fill={"#ff9800"} />,
    sideBarActiveIcon: <CandidateOnboadIcon fill={"#ff9800"} />,
    element: <CandidateOnBoardDetails />,
    path: "/candidateonboarddetails",
    child: [],
  },
  {
    label: "Attendance module",
    sideBarIcon: <AttendanceIcon fill={"#ff9800"} />,
    sideBarActiveIcon: <AttendanceIcon fill={"#ff9800"} />,
    element: <AttendanceModule />,
    path: "/attendancemodule",
    child: [],
  },

  {
    label: "Mock details",
    sideBarIcon: <MockDetailsIcon fill={"#ff9800"} />,
    sideBarActiveIcon: <MockDetailsIcon fill={"#ff9800"} />,
    element: <MockCreationModule />,
    path: "/mocklist",
    child: [],
  },
  {
    label: "Trainer Feedback To Candidate",
    sideBarIcon: <TrainerFeedbackToCandidateIcon fill={"#ff9800"} />,
    sideBarActiveIcon: <TrainerFeedbackToCandidateIcon fill={"#ff9800"} />,
    element: <TrainerFeedbackToCandidate />,
    path: "/trainerfeedbacktocandidate",
    child: [],
  },
  {
    label: "Mock Creation",
    element: <CreateMock />,
    path: "/createmock",
    child: [],
  },
  {
    label: "Mock Feedback To Candidate",
    element : <AddFeedBack/>,
    path:"/mockfeedbacktocandidate",
    child:[]
  }
];

export { resourcePoolRouteObject };
