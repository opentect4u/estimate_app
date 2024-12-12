import React, { useState } from "react";
import { Tabs } from "antd";
import GeneralSettings from "../../Components/GeneralSettings";
import DiscountSettings from "../../Components/DiscountSettings";
import GSTSettings from "../../Components/GSTSettings";
function Settings() {
  const onChange = (key) => {
    console.log(key);
  };
  const items = [
    {
      key: "1",
      label: "General Settings",
      children: <GeneralSettings />,
    },
    // {
    //   key: "2",
    //   label: "Discount Settings",
    //   children: <DiscountSettings />,
    // },
    // {
    //   key: "3",
    //   label: "GST Settings",
    //   children: <GSTSettings />,
    // },
  ];
  return (
    <div>
      {/* Settings */}
      <Tabs
        inkBarColor={"#404198"}
        defaultActiveKey="1"
        size={"large"}
        animated
        centered
        items={items}
        onChange={onChange}
      />
    </div>
  );
}

export default Settings;
