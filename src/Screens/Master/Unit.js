import Column from "antd/es/table/Column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useRef, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Message } from "../../Components/Message";
import { Button } from "antd";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useAPI from "../../Hooks/useApi";
import HeaderLayout from "../../Components/HeaderLayout";

function Unit() {
  const [open, setOpen] = useState(false);
  const [unit, setUnit] = useState();
  const { response, callApi } = useAPI();
  const [resp, setRestp] = useState();
  const [isReport, setIsReport] = useState(false);
  const [isCalled, setCalled] = useState(false);
  const [dataSet, setDataSet] = useState();
  const [search, setSearch] = useState();

  var comp;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    console.log(response, Array.isArray(response?.data?.msg));
    if (!isCalled && Array.isArray(response?.data?.msg))
      setDataSet(response?.data?.msg);
    if (response?.data?.suc == 0 || response?.data?.msg.length <= 0) {
      Message("error", "Something went wrong!");
      setIsReport(false);
    } else {
      if (isCalled && response?.data?.suc == 1) {
        setCalled(false);
        if (unit) Message("success", "Success!");
      }
    }
  }, [response]);
  useEffect(() => {
    comp = localStorage.getItem("comp_id");
    callApi("/admin/unit_list", 1, { comp_id: +comp });
    // setDataSet(response?.data?.msg)
  }, [isCalled]);
  useEffect(() => {
    setDataSet(
      response?.data?.msg?.filter((e) =>
        e.unit_name.toLowerCase().includes(search?.toString().toLowerCase())
      )
    );
  }, [search]);
  const handleAdd = (data) => {
    comp = localStorage.getItem("comp_id");
    setCalled(true);
    if (data)
      callApi("/admin/add_unit_details", 1, {
        unit_id: 0,
        comp_id: +comp,
        unit_name: data,
      });
    else Message("error", "Unit is required!");
    // callApi('/admin/unit_list',1,{comp_id:+comp});
  };
  var headers = [
    { id: "sl_no", name: "#" },
    { id: "unit_name", name: "Name" },
  ];
  const onCellEditComplete = (e) => {
    let { rowData, newValue, field, originalEvent: event, value } = e;
    console.log(e.rowData);
    comp = localStorage.getItem("comp_id");
    if (newValue && field != "sl_no") {
      setCalled(true);
      callApi("/admin/add_unit_details", 1, {
        unit_id: e.rowData.sl_no,
        comp_id: +comp,
        unit_name: newValue,
      });
      switch (field) {
        case "unit_name":
          if (newValue.trim().length > 0) rowData[field] = newValue;
          else event.preventDefault();
          break;
      }
    } else {
      if (field != "sl_no" && newValue.length == 0)
        Message("error", "Updated data cannot be blank!");
      if (field == "sl_no") Message("error", "You cannot update this field!");
    }
  };

  const cellEditor = (options) => {
    //   if (options.field === 'price') return priceEditor(options);
    //   else
    return textEditor(options);
  };

  const textEditor = (options) => {
    return (
      <InputText
        type="text"
        className="rounded-lg"
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
        onKeyDown={(e) => e.stopPropagation()}
      />
    );
  };
  return (
    <div className="py-1 w-full">
      <HeaderLayout
        title={"Unit"}
        btnText={"Add unit"}
        onPress={handleClickOpen}
      />
      <section class="bg-gray-50 dark:bg-gray-900 p-3 ">
        {/* <div class="mx-auto w-full px-4 lg:px-12"> */}
        <div class="mx-auto w-full">
          <div class="bg-blue-900 dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
            <div class="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
              <div class="w-full">
                <div class="flex items-center justify-evenly">
                  <h2 className="text-xl font-bold bg-blue-900 text-white dark:text-white sm:block hidden">
                    Unit
                  </h2>

                  <label for="simple-search" class="sr-only">
                    Search
                  </label>
                  <div class="relative w-full md:w-1/2">
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
                      placeholder="Search"
                      required=""
                      value={search}
                      onChange={(text) => setSearch(text.target.value)}
                    />
                  </div>
                  <div class="w-full md:w-auto sm:block flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                    <Tooltip title="Add unit">
                      <button
                        onClick={handleClickOpen}
                        className="sm:block hidden  items-center justify-center text-blue-900 bg-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
                        <AddIcon /> Add unit
                      </button>
                    </Tooltip>
                  </div>
                </div>
              </div>
              {/* <div class="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                    <button type="button" class="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
                        <svg class="h-3.5 w-3.5 mr-2" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path clip-rule="evenodd" fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                        </svg>
                        Add product
                    </button>
                  
                </div> */}
            </div>
            <div class="overflow-x-auto">
              <div className="card  shadow-2xl w-full">
                <DataTable
                  paginator
                  showGridlines={true}
                  rows={10}
                  stripedRows
                  rowsPerPageOptions={[4, 8, 10, 25, 50]}
                  paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                  currentPageReportTemplate="{first} to {last} of {totalRecords}"
                  value={dataSet}
                  editMode="cell"
                  tableStyle={{
                    minWidth: "10rem",
                    fontSize: "14px",
                    fontFamily: "sans-serif",
                  }}>
                  {headers?.map((field) => {
                    return (
                      <Column
                        headerClassName="bg-blue-300 text-blue-900"
                        key={field.id}
                        field={field.id}
                        header={field.name}
                        style={{ width: "10%" }}
                        editor={(options) => cellEditor(options)}
                        onCellEditComplete={onCellEditComplete}
                      />
                    );
                  })}
                </DataTable>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <DialogComponent visible={visible} flag={flag} onPress={()=>setVisible(false)}/> */}
      {/* <DialogComponent visible={visible} flag={4} onPress={()=>setVisible(false)}/> */}

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (event) => {
            console.log(event);
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const unit = formJson.unit;
            console.log(unit);
            handleClose();
          },
        }}>
        <DialogTitle className="mb-4 text-xl font-bold text-blue-900 dark:text-white">
          Add unit
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            By clicking on the add button, you will be able to add a unit in the
            table below
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="unit"
            name="unit"
            label="Kg"
            type="text"
            fullWidth
            variant="standard"
            value={unit}
            onChange={(unit) => setUnit(unit.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            className="inline-flex mr-3 bg-white items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-blue-900 border border-blue-900 bg-primary-700 rounded-full focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
            onClick={handleClose}>
            Cancel
          </Button>
          <Button
            className="inline-flex bg-blue-900 items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-full focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
            onClick={() => {
              handleAdd(unit);
              handleClose();
            }}
            type="submit">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Unit;
