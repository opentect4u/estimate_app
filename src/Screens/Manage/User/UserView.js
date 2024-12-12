import AddIcon from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Message } from "../../../Components/Message";
import useAPI from "../../../Hooks/useApi";
import { Switch } from "antd";
import { Paginator } from "primereact/paginator";
import HeaderLayout from "../../../Components/HeaderLayout";
function UserView() {
  const navigation = useNavigate();
  const [called, setCalled] = useState(false);
  const { response, callApi } = useAPI();
  const [resp, setRestp] = useState();
  const [isReport, setIsReport] = useState(false);
  const [dataSet, setDataSet] = useState();
  const [checkState, setChecked] = useState();
  const [search, setSearch] = useState("");
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  var comp;
  useEffect(() => {
    console.log(response);
    if (Array.isArray(response?.data?.msg)) setDataSet(response?.data?.msg);

    if (response?.data?.msg?.length <= 0) {
      Message("error", "No data!");
      setIsReport(false);
    } else {
      if (called) {
        // setDataSet(response?.data?.msg)
        setIsReport(true);
        setCalled(false);
      }
    }
  }, [response]);

  useEffect(() => {
    setDataSet(
      response?.data?.msg?.filter(
        (e) =>
          e.user_name.toLowerCase().includes(search.toString().toLowerCase()) ||
          e.branch_name.toString().toLowerCase().includes(search.toString()) ||
          e.user_id
            .toLowerCase()
            .toString()
            .includes(search.toString().toLowerCase())
      )
    );
  }, [search]);
  useEffect(() => {
    comp = localStorage.getItem("comp_id");
    callApi("/admin/user_list", 1, { comp_id: 1, br_id: 0 });
  }, [called]);
  const onPress = () => {
    navigation("/home/manage/usermng/usermngadd");
  };

  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  return (
    <div className="py-1 w-full ">
      <HeaderLayout
        title={"User Management"}
        btnText={"Add user"}
        onPress={() => onPress()}
      />

      <section class="bg-gray-50 dark:bg-gray-900 p-3 ">
        <div class="mx-auto w-full">
          <div class="bg-blue-900 dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
            <div class="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
              <div class="w-full">
                <div class="flex items-center justify-evenly">
                  <h2 className="text-xl sm:block hidden font-bold bg-blue-900 text-white dark:text-white ">
                    User Management
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
                    <Tooltip title="Add user">
                      <button
                        type="submit"
                        onClick={() => onPress({ sl_no: 0 })}
                        className="sm:block hidden  items-center justify-center text-blue-900 bg-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
                        <AddIcon /> Add user
                      </button>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full overflow-x-auto shadow-md text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-900  dark:text-gray-400">
                  <tr className="bg-blue-300 text-blue-900">
                    <th scope="col" class="px-6 py-3">
                      Branch
                    </th>
                    <th scope="col" class="px-6 py-3">
                      User
                    </th>
                    <th scope="col" class="px-6 py-3">
                      User Type
                    </th>
                    <th scope="col" class="px-6 py-3">
                      ID
                    </th>
                    <th scope="col" class="px-3 py-3">
                      Active flag
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dataSet?.slice(first, rows + first).map((item, index) => (
                    <tr class="bg-white dark:bg-gray-800">
                      <td scope="row" class="px-6 py-4 dark:text-white">
                        {item.branch_name}
                      </td>
                      <td scope="row" class="px-6 py-4 dark:text-white">
                        {item.user_name}
                      </td>
                      <td scope="row" class="px-6 py-4 dark:text-white">
                        {item.user_type}
                      </td>
                      <td class="px-6 py-4">{item.user_id}</td>
                      <td class="px-3 py-4">
                        <Switch
                          id={"toggle_" + item.id}
                          name={"toggle " + item.id}
                          checked={item.active_flag == "N" ? false : true}
                          size={"large"}
                          checkedChildren="On"
                          unCheckedChildren="Off"
                          onClick={() => {
                            console.log(item.id);
                            setCalled(!called);
                            comp = localStorage.getItem("comp_id");
                            callApi("/admin/edit_user", 1, {
                              comp_id: +comp,
                              br_id: 0,
                              user_id: item.user_id,
                              user_name: item.user_name,
                              user_type: item.user_type,
                              phone_no: item.phone_no.toString(),
                              login_flag: item.login_flag,
                              active_flag: item.active_flag == "Y" ? "N" : "Y",
                            });
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Paginator
                first={first}
                rows={rows}
                totalRecords={dataSet?.length}
                rowsPerPageOptions={[3, 5, 10, 15, 20, 30, dataSet?.length]}
                onPageChange={onPageChange}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default UserView;
