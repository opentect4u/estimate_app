import React from "react";
import { Outlet } from "react-router-dom";

function MasterComp() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default MasterComp;
