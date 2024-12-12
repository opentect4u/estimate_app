import React from "react";
import { Outlet } from "react-router-dom";

function ManageHeaderFooterComp() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default ManageHeaderFooterComp;
