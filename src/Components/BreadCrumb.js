import React from "react";
import { Breadcrumb } from "antd";
function BreadCrumb({ items }) {
  return (
    <Breadcrumb
      separator=">"
      // items={[
      //   {
      //     title: 'Home',
      //   },
      //   {
      //     title: 'Application Center',
      //     href: '',
      //   },
      //   {
      //     title: 'Application List',
      //     href: '',
      //   },
      //   {
      //     title: 'An Application',
      //   },
      // ]}
      items={items}
    />
  );
}

export default BreadCrumb;
