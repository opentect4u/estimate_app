import React from "react";
import { Outlet } from "react-router-dom";

function UserComp() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default UserComp;
