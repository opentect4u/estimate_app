import React from "react";
import { Outlet } from "react-router-dom";

function ManageComp() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default ManageComp;
