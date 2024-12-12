import React from "react";
import { useNavigate } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { FloatButton } from "antd";
function Backbtn() {
  const navigation = useNavigate();

  return (
    <>
      <FloatButton
        icon={<ArrowBackIcon />}
        className="sm:hidden"
        onClick={() => navigation(-1)}
        type="primary"
        style={{ right: 24, bottom: 80 }}
      />

      <div className="hidden sm:flex sm:justify-end sm:-mt-12">
        <Tooltip title="Back">
          <button
            className="mt-4 inline-flex bg-blue-900 items-center justify-center mr-4 sm:mr-4 px-5 py-2.5 sm:mt-1 text-sm font-medium text-center text-white bg-primary-700 rounded-full h-10 w-10  focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
            onClick={() => navigation(-1)}>
            <ArrowBackIcon />
          </button>
        </Tooltip>
      </div>
    </>
  );
}

export default Backbtn;
