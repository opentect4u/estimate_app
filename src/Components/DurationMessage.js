import React from "react";
import { Button, message, Space } from "antd";

export const DurationMessage = () => {
  message.success("Success!").then(() => {
    message.open({
      type: "loading",
      content: "Redirecting to previous page...",
      duration: 1.5,
    });
  });
};

// export default DurationMessage
