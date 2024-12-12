import React from "react";
import { Outlet } from "react-router-dom";

function SuperAdminComp() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default SuperAdminComp;
