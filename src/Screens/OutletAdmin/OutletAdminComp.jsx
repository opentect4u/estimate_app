import React from "react";
import { Outlet } from "react-router-dom";

function OutletAdminComp() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default OutletAdminComp;
