import React from "react";
import { Outlet } from "react-router-dom";

function HeaderFooterComp() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default HeaderFooterComp;
