import { Box, Paper } from "@mui/material";
import React, { useState } from "react";
import Navbar from "../../molecules/Navbar/Navbar";
import { RouterComponent } from "../../../routes/routes";
import SideBar from "../../molecules/SideBar";
import { resourcePoolRouteObject } from "../../../constants/routeobject/routeobject";

const Layout = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [sidebarConstants, setSidebarConstants] = useState([
    ...resourcePoolRouteObject,
  ]);
  const [showSidebar, setshowSidebar] = useState(true);

  let showHideSidebar = () => {
    setshowSidebar(!showSidebar);
  };
  return (
    <Box
      sx={{
        borderRadius: "0",
        height: "100vh",
        width: "100%",
      }}
      className="hide-scrollbar background-light-blue"
    >
      <Navbar showHideSidebar={showHideSidebar} />
      <Box
        className="hide-scrollbar"
        display={"flex"}
        sx={{
          borderRadius: "0",
          width: "100%",
          height: "calc(100vh-200px) !important",
        }}
      >
        {showSidebar ? (
          <SideBar
            sidebarConstants={sidebarConstants}
            openDrawer={openDrawer}
            setOpenDrawer={setOpenDrawer}
            pinned={pinned}
            setPinned={setPinned}
          />
        ) : null}

        <Box
          className="hide-scrollbar"
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            // marginTop: "65px",
            overflowY: "hidden !important",
            width: openDrawer ? "calc(100vw - 280px)" : "100vw",
            marginLeft: openDrawer && !pinned ? "200px" : "0px",
            paddingX: "25px",
            paddingTop: "20px",
          }}
        >
          {/* <Paper> */}
          <Box sx={{ height: "calc(100vh - 115px)" }}>
            <RouterComponent />
          </Box>
          {/* </Paper> */}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
