import React, { useEffect, useState } from "react";
import DatatableAdv from "../../../Components/DatatableAdv";
import { useNavigate } from "react-router-dom";
import { Message } from "../../../Components/Message";
import useAPI from "../../../Hooks/useApi";
import HeaderLayout from "../../../Components/HeaderLayout";
import axios from "axios";
import { url } from "../../../Address/baseURL";

function ItemDetailsViewBranchwise() {
  const navigation = useNavigate();
  const [called, setCalled] = useState(false);
  const { response, callApi } = useAPI();
  const [resp, setRestp] = useState();
  const [isReport, setIsReport] = useState(false);
  const [dataSet, setDataSet] = useState();
  const [search, setSearch] = useState();
  const [outlets, setOutlets] = useState(() => []);
  const [selectedOutlet, setSelectedOutlet] = useState(null);
  var comp;

  useEffect(() => {
    console.log(response);
    setDataSet(response?.data?.msg);

    if (response?.data?.msg?.length <= 0) {
      Message("error", "No data!");
      setIsReport(false);
    } else {
      if (called) {
        setDataSet(response?.data?.msg);
        setIsReport(true);
        setCalled(false);
      }
    }
  }, [response]);

  useEffect(() => {
    axios
      .get(
        `${url}/admin/S_Admin/select_outlet?comp_id=${+localStorage.getItem(
          "comp_id"
        )}`
      )
      .then((res) => {
        setOutlets(res?.data?.msg);
        console.log(res);
      })
      .catch((err) => {
        Message("error", err);
      });
  }, []);

  useEffect(() => {
    setDataSet(
      response?.data?.msg?.filter((e) =>
        e.item_name.toLowerCase().includes(search?.toString().toLowerCase())
      )
    );
  }, [search]);

  useEffect(() => {
    comp = localStorage.getItem("comp_id");
    callApi("/admin/item_list", 1, { comp_id: +comp });
  }, []);

  const onPress = (data) => {
    navigation(
      "/home/master/itemdetailsbranchwise/adddetailsbranchwise/" +
        data.id +
        "/" +
        selectedOutlet
    );
  };

  return (
    <div className="py-1 w-full ">
      <HeaderLayout
        title={"Item Details"}
        btnText={"Add item"}
        onPress={() => onPress({ id: 0 })}
      />
      <section class="bg-gray-50 dark:bg-gray-900 p-3">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
          <div className="my-4 w-full">
            <label
              htmlFor="outlet"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Select Outlet
            </label>
            <select
              id="comp_id"
              name="comp_id"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              onChange={(e) => setSelectedOutlet(e.target.value)}
              // onBlur={() => null}
              value={selectedOutlet}>
              <option selected value={undefined}>
                Select outlet
              </option>

              {outlets?.map((items, i) => (
                <option key={i} value={items?.id}>
                  {items?.branch_name}
                </option>
              ))}
            </select>
            {called && !+localStorage.getItem("comp_id") ? (
              <div className="text-red-500 text-sm">Outlet is required</div>
            ) : null}
          </div>
        </div>
        <div class="mx-auto w-full">
          <div class="bg-blue-900 dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
            <div class="overflow-x-auto">
              <DatatableAdv
                disabled={!selectedOutlet}
                onPress={(data) => onPress(data)}
                setSearch={(val) => setSearch(val)}
                flag={1}
                title={"Item Details"}
                // btnText={"Add item"}
                // onclick={() => onPress({ id: 0 })}
                headers={[
                  { name: "id", value: "#" },
                  // { name: "hsn_code", value: "HSN Code" },
                  { name: "item_name", value: "Name" },
                ]}
                data={dataSet}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ItemDetailsViewBranchwise;
