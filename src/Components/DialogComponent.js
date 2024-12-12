import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { Tabs } from "antd";

import PasswordComponent from "./PasswordComponent";
import ProfileInfo from "./ProfileInfo";
function DialogComponent({ visible, flag, onPress }) {
  const navigate = useNavigate();

  const onChange = (key) => {
    console.log(key);
  };

  const itemsComp = [
    {
      key: "1",
      label: "User profile",
      children: <ProfileInfo flag={flag} />,
    },
    {
      key: "2",
      label: "Change password",
      children: <PasswordComponent onPress={onPress} />,
    },
  ];
  return (
    <div>
      <Dialog
        header={
          <div
            className={
              flag != 3
                ? "text-blue-900 font-bold"
                : "text-blue-900 font-bold w-20"
            }>
            {flag != 3 ? "Profile Information" : "Warning!"}
          </div>
        }
        visible={visible}
        maximizable
        style={{ width: "50vw" }}
        onHide={() => {
          if (!visible) return;
          onPress();
        }}>
        <p className="m-0">
          {flag == 1 && <ProfileInfo flag={flag} />}
          {flag == 2 && (
            <Tabs
              defaultActiveKey="1"
              size={"large"}
              animated
              centered
              items={itemsComp}
              onChange={onChange}
            />
          )}
          {flag == 3 && (
            <p className="m-0">
              Do you want to logout?
              <div className="flex justify-center">
                <button
                  type="reset"
                  onClick={onPress}
                  className="inline-flex mr-3 bg-white items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-blue-900 border border-blue-900 bg-primary-700 rounded-full focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
                  No
                </button>
                <button
                  type="submit"
                  onClick={() => {
                    localStorage.clear();
                    navigate("/");
                  }}
                  className="inline-flex bg-blue-900 items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-full focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
                  Yes
                </button>
              </div>
            </p>
          )}
          {/* {flag == 4 && (
            <p className="m-0">
              Do you want to logout?
              <div className="flex justify-center">
                <button
                  type="reset"
                  onClick={onPress}
                  className="inline-flex mr-3 bg-white items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-blue-900 border border-blue-900 bg-primary-700 rounded-full focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
                  No
                </button>
                <button
                  type="submit"
                  onClick={() => {
                    localStorage.clear();
                    navigate("/");
                  }}
                  className="inline-flex bg-blue-900 items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-full focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
                  Yes
                </button>
              </div>
            </p>
          )} */}
        </p>
      </Dialog>
    </div>
  );
}

export default DialogComponent;
