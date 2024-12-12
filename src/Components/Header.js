import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Avatar, Divider, ListItemIcon, Tooltip } from "@mui/material";
import DialogComponent from "./DialogComponent";
import { Logout, PersonAdd, Settings } from "@mui/icons-material";

function Header() {
  const location = useLocation();
  console.log(location);
  const [visible, setVisible] = useState(false);
  const [flag, setFlag] = useState();
  const [anchorElProfile, setAnchorElProfile] = React.useState(null);
  const openProfile = Boolean(anchorElProfile);
  localStorage.setItem("dark", false);
  const handleClickProfile = (event) => {
    console.log(event);
    setAnchorElProfile(event.currentTarget);
  };
  const handleCloseProfile = (routeTo, flag) => {
    setAnchorElProfile(null);

    if (flag) {
      setFlag(flag);

      setVisible(true);
      // }
    }
  };

  const [anchorElNotif, setAnchorElNotif] = React.useState(null);
  const [dark, setDark] = React.useState(false);
  const openNotif = Boolean(anchorElNotif);
  const handleClickNotif = (event) => {
    setAnchorElNotif(event.currentTarget);
  };
  const handleCloseNotif = () => {
    setAnchorElNotif(null);
  };

  return (
    <div className="w-full sticky top-0 z-10">
      <nav className="bg-blue-300 dark:bg-gray-900 dark:text-white">
        <div className="flex flex-wrap justify-end items-center mx-5 min-w-screen-xl py-4 px-4">
          <div className=" text-white  space-x-4 rtl:space-x-reverse">
            <span className="relative right-0 text-sm sm:text-base  text-pretty text-blue-900 font-semibold">
              {" "}
              {/* {localStorage.getItem("company_name")} */}
              Estimate
            </span>

            <div className="relative inline-flex border border-blue-400 items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
              <span
                id="basic-button"
                aria-controls={openProfile ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openProfile ? "true" : undefined}
                onClick={handleClickProfile}
                className="font-medium text-blue-900  dark:text-gray-300 cursor-pointer">
                <Tooltip
                  // title={"Hello, " + localStorage.getItem("company_name")}
                  title={"Hello, " + "Estimate"}>
                  {/* {localStorage.getItem("company_name").includes(" ")
                    ? localStorage.getItem("company_name").split(" ")[0][0] +
                      localStorage.getItem("company_name").split(" ")[1][0]
                    : localStorage.getItem("company_name").charAt(0)} */}
                  E
                </Tooltip>
              </span>

              {/* <Menu
        id="basic-menu"
        anchorEl={anchorElProfile}
        open={openProfile}
        onClose={()=>handleCloseProfile('',null)}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
       <MenuItem  className='text-blue-900 hover:text-blue-900' onClick={()=>handleCloseProfile('',1)}>Store Profile</MenuItem>
        <MenuItem  className='text-blue-900 hover:text-blue-900' onClick={()=>handleCloseProfile('',2)}>User Profile</MenuItem>
        <MenuItem  className='text-blue-900 hover:text-blue-900' onClick={()=>handleCloseProfile('/',3)}>Logout</MenuItem>
      </Menu> */}

              <Menu
                id="basic-menu"
                anchorEl={anchorElProfile}
                open={openProfile}
                onClose={() => handleCloseProfile("", null)}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&::before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}>
                <MenuItem
                  className="text-blue-900 hover:text-blue-900"
                  onClick={() => handleCloseProfile("", 1)}>
                  <Avatar />
                  Store Profile
                </MenuItem>
                <MenuItem
                  className="text-blue-900 hover:text-blue-900"
                  onClick={() => handleCloseProfile("", 2)}>
                  <Avatar /> User Profile
                </MenuItem>
                <Divider />
                {/* <MenuItem >
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem >
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem> */}
                <MenuItem
                  className="text-blue-900 hover:text-blue-900"
                  onClick={() => handleCloseProfile("/", 3)}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
              {/* </Dropdown> */}
            </div>
          </div>
        </div>
      </nav>
      <DialogComponent
        visible={visible}
        flag={flag}
        onPress={() => setVisible(false)}
      />
    </div>
  );
}

export default Header;
