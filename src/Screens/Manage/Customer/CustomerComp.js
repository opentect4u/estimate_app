import React from "react";
import { Outlet } from "react-router-dom";

function CustomerComp() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default CustomerComp;
