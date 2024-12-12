import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { ContextMenu } from "primereact/contextmenu";
import { Column } from "primereact/column";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { FilterMatchMode } from "primereact/api";
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";
const DatatableAdv = ({
  headers,
  data,
  flag,
  onPress,
  title,
  btnText,
  searchBy,
  onclick,
  setSearch,
  disabled = false,
  // onDownloadClick,
}) => {
  const dt = useRef(null);
  // console.log(data[0]?.catg_picture)
  const k = 0;

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  // const [search,set]
  // const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  // const [id,setId]=useState(null)
  const cm = useRef(null);
  const menuModel = [
    {
      label: "View",
      icon: "pi pi-fw pi-search",
      command: () => console.log("VIEWWWWW"),
    },
    {
      label: "Delete",
      icon: "pi pi-fw pi-times",
      command: () => console.log("DELETEEEEE"),
    },
  ];

  var id;

  const iconTemplate = () => {
    return flag == 1 ? (
      <EditIcon className="text-blue-900" />
    ) : (
      <VisibilityIcon className="text-blue-900" />
    );
  };

  const imageTemplate = (item) => {
    console.log(item);
    return flag == 3 ? (
      <img src={"http://202.21.38.178:3005" + item.catg_pciture} />
    ) : (
      ""
    );
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const onRowSelect = (event) => {
    console.log(event);
    id = event.data;
    //   setId(event.data.id)
    console.log(id);
    onPress(id);
  };

  const onRowUnselect = (event) => {};

  console.log(selectedProduct);

  // const exportCSV = (selectionOnly) => {
  //   dt.current.exportCSV({ selectionOnly });
  // };

  const exportExcel = () => {
    import("xlsx").then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(data);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      saveAsExcelFile(excelBuffer, "products");
    });
  };

  const saveAsExcelFile = (buffer, fileName) => {
    import("file-saver").then((module) => {
      if (module && module.default) {
        let EXCEL_TYPE =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        let EXCEL_EXTENSION = ".xlsx";
        const data = new Blob([buffer], {
          type: EXCEL_TYPE,
        });

        module.default.saveAs(
          data,
          fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
        );
      }
    });
  };

  // const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;
  const paginatorRight = (
    <Button
      type="button"
      icon="pi pi-download"
      text
      // onClick={() => exportCSV(false)}
      onClick={exportExcel}
    />
  );

  return (
    <>
      {title && (
        <div class="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
          <div class="w-full">
            <div class="flex items-center justify-evenly gap-2">
              <h2 className="text-xl font-bold bg-blue-900 text-nowrap text-white dark:text-white sm:block hidden">
                {title}
              </h2>

              <label for="simple-search" class="sr-only">
                Search
              </label>
              <div class="relative w-full mr-2">
                <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    aria-hidden="true"
                    class="w-5 h-5 text-gray-500 dark:text-gray-400"
                    fill="currentColor"
                    viewbox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      fill-rule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  id="simple-search"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block sm:w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder={searchBy ? `Search by ${searchBy}` : "Search"}
                  required=""
                  // value={search}
                  onChange={(text) => setSearch(text.target.value)}
                />
              </div>
              {btnText && (
                <div class="w-full md:w-auto sm:block flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                  <Tooltip title={btnText}>
                    <button
                      type="submit"
                      onClick={() => onclick()}
                      className="sm:block hidden  items-center justify-center text-blue-900 bg-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
                      <AddIcon /> {btnText}
                    </button>
                  </Tooltip>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <div>
        <div className="card  w-full">
          {/* <ContextMenu
            model={menuModel}
            ref={cm}
            onHide={() => setSelectedProduct(null)}
          /> */}
          <DataTable
            // onContextMenu={(e) => cm.current.show(e.originalEvent)}
            // contextMenuSelection={selectedProduct}
            // onContextMenuSelectionChange={(e) => {
            //   setSelectedProduct(e.value);
            //   console.log(e);
            // }}
            value={data}
            showGridlines={true}
            stripedRows
            stickyHeader="true"
            scrollable
            paginator
            rows={10}
            rowsPerPageOptions={[4, 10, 25, 50, data?.length]}
            tableStyle={{ minWidth: "100%", fontSize: "14px" }}
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            currentPageReportTemplate="{first} to {last} of {totalRecords}"
            // paginatorLeft={paginatorLeft}
            paginatorRight={paginatorRight}
            styleClass="p-datatable-gridlines"
            selectionMode="single"
            selection={selectedProduct}
            onSelectionChange={
              !disabled && ((e) => setSelectedProduct(e.value))
            }
            dataKey="id"
            onRowSelect={!disabled && onRowSelect}
            onRowUnselect={onRowUnselect}
            metaKeySelection={false}
            //    filters={filters} filterDisplay="row"
            //     globalFilterFields={headers}  emptyMessage="No customers found."
          >
            {headers.map((item, index) => (
              // <>
              <Column
                key={index}
                field={item.name}
                header={item.value}
                headerClassName="text-blue-900 bg-blue-300"
                style={{ width: "10%" }}
                // body={item.name=='catg_picture'? :''}
              ></Column>
            ))}
            {/* {flag == 1 && (
              <Column
                body={iconTemplate}
                header={"Action"}
                headerClassName="text-blue-900 bg-blue-300"
                style={{ width: "10%" }}
                frozen></Column>
            )}
            {flag == 2 && (
              <Column
                body={iconTemplate}
                header={"Action"}
                headerClassName="text-blue-900 bg-blue-300"
                style={{ width: "10%" }}
                frozen></Column>
            )} */}
          </DataTable>
        </div>

        <div className="card hidden w-full shadow-2xl">
          <DataTable
            // footerColumnGroup={totals ? footerGroup : ""}
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
                  header={item.name}
                  headerClassName="bg-blue-900 text-white"
                  style={{ width: "10%" }}></Column>
              ))}
          </DataTable>
        </div>
      </div>
    </>
  );
};

export default DatatableAdv;
