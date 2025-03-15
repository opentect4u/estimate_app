import React, { useRef } from "react";
import { Descriptions } from "antd";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PrintIcon from "@mui/icons-material/Print";
import DownloadIcon from "@mui/icons-material/Download";
import { Toolbar, Tooltip } from "@mui/material";
import moment from "moment";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
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
  // const footerGroup = (
  //   <ColumnGroup>
  //     <Row>
  //       <Column
  //         footer="Totals:"
  //         colSpan={span}
  //         footerStyle={{ textAlign: "center" }}
  //       />
  //       {totals.map((item) => (
  //         <Column footer={item} />
  //       ))}
  //     </Row>
  //   </ColumnGroup>
  // );

  // const dt = useRef(null);
  // const onPress = () => {
  //   backPress();
  // };
  // const exportCSV = (selectionOnly) => {
  //   dt.current.exportCSV({ selectionOnly });
  // };

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

  function print() {
    var divToPrint = document.getElementById("printablediv");

    var WindowObject = window.open("", "Print-Window");
    WindowObject.document.open();
    WindowObject.document.writeln("<!DOCTYPE html>");
    WindowObject.document.writeln(
      '<html><head><title></title><style type="text/css">'
    );

    WindowObject.document.writeln(
      "@media print { .center { text-align: center;}" +
        "                                         .inline { display: inline; }" +
        "                                         .underline { text-decoration: underline; }" +
        "                                         .left { margin-left: 315px;} " +
        "                                         .right { margin-right: 375px; display: inline; }" +
        "                                          table { border-collapse: collapse; font-size: 10px;}" +
        "                                          th, td { border: 1px solid black; border-collapse: collapse; padding: 6px;}" +
        "                                           th, td { }" +
        "                                         .border { border: 1px solid black; } " +
        "                                         .bottom { bottom: 5px; width: 100%; position: fixed " +
        "                                       " +
        "                                   } .p-paginator-bottom.p-paginator.p-component { display: none; } .heading{display: flex; flex-direction: column; justify-content: center; align-items: center;font-weight:800;margin-bottom:15px} } </style>"
    );
    WindowObject.document.writeln('</head><body onload="window.print()">');
    WindowObject.document.writeln(divToPrint.innerHTML);
    WindowObject.document.writeln("</body></html>");
    WindowObject.document.close();
    setTimeout(function () {
      WindowObject.close();
    }, 10);
  }
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
        {/* <FloatButton onClick={() => print()} icon={<PrintIcon />} /> */}
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
        {/* <Tooltip title="Print">
          <button
            className="mt-5 inline-flex bg-red-500 items-center justify-center mr-2 sm:mr-3 px-5 py-2.5 sm:mt-2 text-sm font-medium text-center text-white bg-primary-700 rounded-full h-10 w-10  focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
            onClick={() => print()}>
            <PrintIcon />
          </button>
        </Tooltip> */}
        <Tooltip title="Download CSV">
          <button
            className="mt-5 inline-flex bg-green-500 items-center justify-center mr-2 sm:mr-3 px-5 py-2.5 sm:mt-2 text-sm font-medium text-center text-white bg-primary-700 rounded-full h-10 w-10  focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
            // onClick={() => exportCSV(false)}
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

        <div className="mt-10 w-full " id="printablediv">
          <div hidden className="heading">
            <span>
              {title} from {moment(from).format("DD/MM/YYYY")} to{" "}
              {moment(to).format("DD/MM/YYYY")}{" "}
            </span>
            {/* <span>{localStorage.getItem("company_name")} </span>
            <span>{localStorage.getItem("phone_no")} </span>
            <span>{localStorage.getItem("address")} </span>
            <span>{localStorage.getItem("email_id")} </span> */}
            <span>{location} </span>
          </div>
          {/* <div className="card hidden w-full shadow-2xl">
            <DataTable
              footerColumnGroup={totals ? footerGroup : ""}
              value={data}
              showGridlines={true}
              stripedRows
              scrollable
              paginator
              rows={data?.length}
              rowsPerPageOptions={[3, 5, 10, 25, 50]}
              tableStyle={{ minWidth: "100%" }}
              paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
              currentPageReportTemplate="{first} to {last} of {totalRecords}"
              ref={dt}>
              {headers &&
                headers.map((item, index) => (
                  <Column
                    key={index}
                    field={item.name}
                    header={item.value}
                    headerClassName="bg-blue-900 text-white"
                    style={{ width: "10%" }}></Column>
                ))}
            </DataTable>
          </div> */}
        </div>
      </div>
    </>
  );
}

export default DescriptionComp;
