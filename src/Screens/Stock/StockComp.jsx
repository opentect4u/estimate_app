import React from "react";
import { Outlet } from "react-router-dom";

function StockComp() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default StockComp;
