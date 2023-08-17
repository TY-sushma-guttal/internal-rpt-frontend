import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import logo from "../../../assets/images/testyantralogo/testyantra.png";
import { Avatar, Tooltip } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function Navbar({ showHideSidebar }) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar className="navbar-bg-color">
          {/* <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => {
              showHideSidebar();
            }}
          >
            <MenuIcon />
          </IconButton> */}
          <Typography component="div" sx={{ flexGrow: 1 }}>
            <img src={logo} height={70} width={240} />
          </Typography>
          <Tooltip title="Logout">
            <Avatar
              className="cursor-pointer"
              sx={{
                backgroundColor: "#146389",
                "&:hover": {
                  backgroundColor: "#ff9800",
                },
              }}
            >
              <AccountCircleIcon />
            </Avatar>
          </Tooltip>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
