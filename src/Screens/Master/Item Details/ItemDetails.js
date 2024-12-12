import React from "react";
import { Outlet } from "react-router-dom";

function ItemDetails() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default ItemDetails;
