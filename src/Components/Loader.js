import React, { useContext, useEffect } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { loadingContext } from "../Context/Democontext";

function Loader(hidden) {
  const { loading } = useContext(loadingContext);

  useEffect(() => {
    console.log(loading);
  }, [loading]);

  return (
    <Spin
      spinning={loading}
      fullscreen={true}
      indicator={
        <LoadingOutlined style={{ fontSize: 70, color: "#404198" }} spin />
      }
    />
  );
}

export default Loader;
