import React from "react";
import { Outlet } from "react-router-dom";

function OutletComp() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default OutletComp;
