import React from "react";
import { Outlet } from "react-router-dom";

function CategoryComp() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default CategoryComp;
