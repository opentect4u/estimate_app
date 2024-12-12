import logo from "./logo.svg";
import "./App.css";
import { Outlet } from "react-router-dom";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { PrimeReactProvider } from "primereact/api";
import { ConfigProvider } from "antd";

function App() {
  console.log("app");
  return (
    // <ReportContext>
    <PrimeReactProvider>
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              itemSelectedBg: "#E2E2F3",
              itemSelectedColor: "#404198",
            },
            Tabs: {
              inkBarColor: "#404198",
              itemColor: "#404198",
              itemSelectedColor: "#404198",
              itemHoverColor: "#404198",
            },
            Switch: {
              colorPrimary: "#404198",
              colorPrimaryHover: "#404198CC",
            },
            Transfer: {
              colorBgContainer: "#40419822",
              controlItemBgActive: "#40419811",
            },
            Button: {
              colorPrimary: "#404198",
              colorPrimaryHover: "#404198CC",
              colorPrimaryActive: "#404198BB",
            },
            Checkbox: {
              colorPrimary: "#404198",
            },
          },
        }}>
        <Outlet />
      </ConfigProvider>
    </PrimeReactProvider>
    // </ReportContext>
  );
}

export default App;
