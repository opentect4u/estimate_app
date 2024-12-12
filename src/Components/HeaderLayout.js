import React from "react";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";

function HeaderLayout({ title, btnText, onPress }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="mb-4 mx-4 text-xl font-bold text-blue-900 dark:text-white sm:hidden">
        {title}
      </h2>
      {btnText && (
        <Tooltip title={btnText}>
          <button
            type="submit"
            onClick={() => onPress()}
            className="sm:hidden mb-4 inline-flex bg-blue-900 items-center justify-center sm:mr-14 px-5 py-2.5 mt-2 sm:mt-2 text-sm font-medium text-center text-white bg-primary-700 rounded-full h-10 w-10  focus:ring-4 mx-3 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
            <AddIcon />
          </button>
        </Tooltip>
      )}
    </div>
  );
}

export default HeaderLayout;
