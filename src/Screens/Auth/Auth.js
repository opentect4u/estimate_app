import React from "react";
import { Outlet } from "react-router-dom";

function Auth() {
  console.log("auth");

  return (
    <div>
      <Outlet />
    </div>
  );
}

export default Auth;
