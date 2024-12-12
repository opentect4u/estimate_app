import React from "react";
import { CloseCircleOutlined } from "@ant-design/icons";
import { Result, Typography } from "antd";
const { Paragraph, Text } = Typography;
function Error({ error }) {
  return (
    <div>
      <Result
        status="error"
        title="Aw, Snap!"
        subTitle="This screen has met with some issues. If you are viewing this message then immediately contact the developer!">
        <div className="desc">
          <Paragraph>
            <Text
              strong
              style={{
                fontSize: 16,
              }}>
              The content you wanted has the following error(s):
            </Text>
          </Paragraph>
          {error.message && (
            <Paragraph>
              <CloseCircleOutlined className="site-result-demo-error-icon text-red-500" />{" "}
              {error.message}
            </Paragraph>
          )}
        </div>
      </Result>
    </div>
  );
}

export default Error;
