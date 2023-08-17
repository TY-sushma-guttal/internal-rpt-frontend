import { Box } from "@mui/material";
import Layout from "./components/organism/Layout/Layout";
import "./styles/global.css";
import "./styles/font.css";
import "./styles/color.css";
import { BallTriangle } from "react-loader-spinner";
import axios from "axios";
import { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { ToastProvider } from "react-toast-notifications";
import CustomToast from "./components/atoms/CustomToast/CustomToast";

// const baseURL = process.env.REACT_APP_DOMAIN_URL;

// const baseURL = "http://10.10.20.22:9090/api/v1";
// const baseURL = "http://10.10.21.129:9090/api/v1";
const baseURL = "http://10.10.21.190:9090/api/v1";

const axiosInstance = axios.create({
  baseURL,
});

function App() {
  const [showLoader, setshowLoader] = useState(false);
  axiosInstance.interceptors.request.use(async (config) => {
    setshowLoader(true);
    config.headers = {
      "content-type": "application/json",
      ...config.headers,
    };
    return config;
  });

  axiosInstance.interceptors.response.use(
    async (response) => {
      setshowLoader(false);
      return response;
    },
    async (error) => {
      setshowLoader(false);
      return error;
    }
  );

  return (
    <BrowserRouter>
      <Box>
        {showLoader && (
          <div id="loadContainer">
            <BallTriangle
              height="80"
              width="80"
              color="#fff"
              ariaLabel="ball-triangle-loading"
              wrapperClass="loader"
              visible={true}
            />
          </div>
        )}

        <ToastProvider
          components={{ Toast: CustomToast }}
          placement="top-right"
          autoDismissTimeout={3500}
          autoDismiss
          id="toaster"
          transitionDuration={4}
        >
          <Layout />
        </ToastProvider>
      </Box>
    </BrowserRouter>
  );
}

export { axiosInstance };

export default App;
