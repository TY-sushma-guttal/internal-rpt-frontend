import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Fragment } from "react";
import PushPinIcon from "../../../assets/PushPinIcon";

const SideBar = ({
  openDrawer,
  setOpenDrawer,
  pinned,
  setPinned,
  sidebarConstants,
}) => {
  const location = useLocation();
  const [selectedLabel, setSelectedLabel] = useState("");
  const [subSelected, setSubSelected] = useState("");
  const [child, setChild] = useState([]);
  const [selectedNode, setSelectedNode] = useState();
  const navigate = useNavigate();
  const drawerWidth = "200px";
  useEffect(() => {
    setSelectedLabel(location.pathname);
    setSubSelected(location.pathname);
  }, [location.pathname]);

  const showSelectedLabel = (selectedLabel, index) => {
    let pathMatched = false;
    const childArray = sidebarConstants[index].child;
    childArray?.forEach((val, index) => {
      if (val.path === selectedLabel) {
        pathMatched = true;
      }
    });
    return pathMatched;
  };

  return (
    <Box sx={{ display: "flex", zIndex: "100" }}>
      <Box
        sx={{
          height: "calc(100vh - 98px)",
          width: "75px",
          overflowY: "auto",
          zIndex: 1201,
          // marginTop: "65px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingBottom: "8px",
          marginTop: "12px",
          borderTopRightRadius: "25px",
        }}
        className="navbar-bg-color hide-scrollbar"
      >
        {sidebarConstants.map((text, index) => {
          return (
            <Fragment key={index}>
              <Tooltip title={text.label} placement="right-end">
                <Box
                  onClick={() => {
                    if (!text?.child?.length) {
                      setSelectedNode(null);
                      setSelectedLabel(text.path);
                    }
                    setChild([...text.child]);
                    // setSubSelected(text?.child[0]?.label);
                    if (text.child.length && !text.hideDrawer) {
                      setSelectedNode(index);
                      setOpenDrawer(true);
                    } else {
                      setSelectedNode(index);
                      navigate(text.path);
                      setOpenDrawer(false);
                      setPinned(false);
                    }
                  }}
                  className={`${
                    selectedLabel === text.path ||
                    showSelectedLabel(selectedLabel, index)
                      ? "bg-btn"
                      : ""
                  } p-2 rounded cursor-pointer`}
                  sx={{
                    borderRadius: "8px",
                    marginTop: "12px",
                    display: "flex",
                    padding: "0.5rem",
                    "&:hover": {
                      background: "white",
                    },
                    background: index === selectedNode ? "white" : "",
                  }}
                  key={index}
                >
                  {selectedLabel === text.path ||
                  showSelectedLabel(selectedLabel, index)
                    ? text.sideBarActiveIcon
                    : text.sideBarIcon}
                  {/* <AttachEmailOutlinedIcon
                    sx={{ width: "30px", height: "30px" }}
                    className={`${
                      selectedLabel === text.path ||
                      showSelectedLabel(selectedLabel, index)
                        ? "text-white "
                        : "color-blue"
                    } fs-1`}
                  /> */}
                </Box>
              </Tooltip>
            </Fragment>
          );
        })}
      </Box>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          position: "relative",
          "&.MuiDrawer-root": {
            zIndex: "50 !important",
          },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            background: "#F8FDFF",
            left: 78,
            top: 65,
          },
        }}
        variant={pinned ? "permanent" : "temporary"}
        anchor="left"
        open={openDrawer}
        onClose={() => {
          setSelectedNode(null);
          setOpenDrawer(false);
        }}
        BackdropProps={{ invisible: true }}
      >
        <Box display={"flex"} sx={{ justifyContent: "flex-end" }}>
          <PushPinIcon
            onClick={() => {
              setPinned(!pinned);
              setOpenDrawer(false);
            }}
            className={`${
              pinned ? " pinned" : "unpinned"
            } mt-2 me-2 cursor-pointer fs-5`}
            fill={pinned ? "rgb(232,23,80)" : "rgb(164,145,165)"}
          />
        </Box>
        <List className="">
          {child?.map((obj, index) => {
            if (!obj.hide) {
              return (
                <Fragment key={index}>
                  <ListItem key={obj.label} disablePadding>
                    <ListItemButton
                      onClick={() => {
                        navigate(obj.path);
                        setSelectedLabel(obj.path);
                        setSubSelected(obj.path);
                        setOpenDrawer(false);
                      }}
                      className={`${
                        subSelected === obj.path ||
                        subSelected.includes(obj.path)
                          ? "bg-btn"
                          : ""
                      } mx-2 rounded`}
                    >
                      <ListItemIcon
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        <Typography
                          className={`${
                            subSelected === obj.path ||
                            subSelected.includes(obj.path)
                              ? "text-white"
                              : "subnavbar-gray mt-2  cursor-pointer"
                          } mx-2 py-2 rounded fs-14`}
                        >
                          {obj.label}
                        </Typography>
                      </ListItemIcon>
                    </ListItemButton>
                  </ListItem>
                </Fragment>
              );
            }
          })}
        </List>
      </Drawer>
    </Box>
  );
};

export default SideBar;
