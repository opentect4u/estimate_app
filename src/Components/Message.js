import React from "react";
import { Button, message, Space } from "antd";
export const Message = (type, msg) => {
  message.open({
    type: type,
    content: msg,
  });
};

// export default Message
