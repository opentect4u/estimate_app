import React from "react";
import { Descriptions } from "antd";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DownloadIcon from "@mui/icons-material/Download";
import { Tooltip } from "@mui/material";
import moment from "moment";
import { FloatButton } from "antd";
import SettingsIcon from "@mui/icons-material/Settings";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function DescriptionComp({
  title,
  from,
  to,
  location,
  backPress,
  headers,
  data,
  span,
  totals,
}) {
  const onPress = () => {
    backPress();
  };

  const exportToExcel = (data) => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
    const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
    saveAs(blob, "data_dump.xlsx");
  };

  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
      view[i] = s.charCodeAt(i) & 0xff;
    }
    return buf;
  };

  const item = [
    // {
    //   key: "1",
    //   label: <div className=" text-blue-900 font-bold">Store</div>,
    //   children: localStorage.getItem("company_name"),
    // },
    // {
    //   key: "2",
    //   label: <div className=" text-blue-900 font-bold">Telephone</div>,
    //   children: localStorage.getItem("phone_no"),
    // },
    // {
    //   key: "3",
    //   label: <div className=" text-blue-900 font-bold">Email</div>,
    //   children: localStorage.getItem("email_id"),
    // },
    {
      key: "4",
      label: <div className=" text-blue-900 font-bold">Outlet</div>,
      children: location,
    },
    // {
    //   key: "5",
    //   label: <div className=" text-blue-900 font-bold">Address</div>,
    //   children: localStorage.getItem("address"),
    // },
  ];
  return (
    <>
      <FloatButton.Group
        className="sm:hidden block"
        trigger="click"
        type="primary"
        style={{ right: 24, bottom: 80 }}
        icon={<SettingsIcon />}>
        <FloatButton onClick={() => onPress()} icon={<ArrowBackIcon />} />
        <FloatButton
          onClick={() => exportToExcel(data)}
          icon={<DownloadIcon />}
        />
      </FloatButton.Group>
      <div className="sm:flex sm:justify-end sm:items-center sm:-mt-12  hidden">
        <Tooltip title="Back">
          <button
            className="mt-5 inline-flex bg-blue-900 items-center justify-center mr-2 sm:mr-3 px-5 py-2.5 sm:mt-2 text-sm font-medium text-center text-white bg-primary-700 rounded-full h-10 w-10  focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
            onClick={() => onPress()}>
            <ArrowBackIcon />
          </button>
        </Tooltip>
        <Tooltip title="Download Dump">
          <button
            className="mt-5 inline-flex bg-green-500 items-center justify-center mr-2 sm:mr-3 px-5 py-2.5 sm:mt-2 text-sm font-medium text-center text-white bg-primary-700 rounded-full h-10 w-10  focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
            onClick={() => exportToExcel(data)}>
            <DownloadIcon />
          </button>
        </Tooltip>
      </div>
      <div>
        <div className="mt-10 my-5 w-full ">
          <Descriptions
            title={
              from && to ? (
                <div className="text-blue-900 font-bold">
                  {title} from {moment(from).format("DD/MM/YYYY")} to{" "}
                  {moment(to).format("DD/MM/YYYY")}
                </div>
              ) : from && !to ? (
                <div className="text-blue-900 font-bold">
                  {title} on {moment(from).format("DD/MM/YYYY")}{" "}
                </div>
              ) : (
                <div className="text-blue-900 font-bold">{title}</div>
              )
            }
            items={
              location === ""
                ? item?.filter((item, i) => +item.key !== 4)
                : item
            }
          />
        </div>
      </div>
    </>
  );
}

export default DescriptionComp;
