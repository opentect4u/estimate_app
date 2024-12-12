import React, { useEffect, useState } from "react";
import axios from "axios";
import DatatableAdv from "../../../Components/DatatableAdv";
import { useNavigate, useParams } from "react-router-dom";
import { Message } from "../../../Components/Message";
import useAPI from "../../../Hooks/useApi";
import HeaderLayout from "../../../Components/HeaderLayout";
import { url } from "../../../Address/baseURL";

function ManageStockView() {
  const params = useParams();
  const navigation = useNavigate();
  const [called, setCalled] = useState(false);
  const { response, callApi } = useAPI();
  const [resp, setRestp] = useState();
  const [isReport, setIsReport] = useState(false);
  const [dataSet, setDataSet] = useState();
  const [search, setSearch] = useState();
  const [compId, setCompId] = useState(null);
  const [shops, setShops] = useState(() => []);
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
    // callApi(`/admin/S_Admin/select_location`, 0);
    axios
      .get(`${url}/admin/S_Admin/select_shop?id=0`)
      .then((res) => {
        setShops(res?.data?.msg);
        console.log(res);
      })
      .catch((err) => {
        Message("error", err);
      });
  }, []);

  useEffect(() => {
    // callApi(`/admin/S_Admin/select_location`, 0);
    axios
      .get(`${url}/admin/S_Admin/select_outlet?comp_id=${compId}`)
      .then((res) => {
        setOutlets(res?.data?.msg);
        console.log(res);
      })
      .catch((err) => {
        Message("error", err);
      });
  }, [compId]);

  useEffect(() => {
    // comp = localStorage.getItem("comp_id");
    // callApi(`/admin/S_Admin/item_detail?comp_id=${compId || 1}`, 0);
    callApi(
      `/admin/S_Admin/item_stock?comp_id=${compId}&br_id=${selectedOutlet}`,
      0
    );
  }, [compId, selectedOutlet]);

  const onPress = () => {
    navigation("/home/superadmin/managestock/managestockadd");
  };

  const onPressEdit = (data) => {
    console.log(data);
    navigation(
      "/home/superadmin/managestock/" +
        data?.item_id +
        "/" +
        data?.comp_id +
        "/" +
        data?.unit_id
    );
  };

  useEffect(() => {
    setDataSet(
      response?.data?.msg?.filter(
        (e) =>
          e.item_name
            .toLowerCase()
            .includes(search?.toString().toLowerCase()) ||
          e.item_id
            ?.toString()
            .toLowerCase()
            .includes(search?.toString().toLowerCase())
      )
    );
  }, [search]);
  return (
    <div className="py-1 w-full">
      <HeaderLayout
        title={"Manage Stock"}
        btnText={"Add Stock"}
        onPress={() => onPress()}
      />
      <section class="dark:bg-gray-900 p-3 ">
        <div class="mx-auto">
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="my-4 w-full">
              <label
                htmlFor="brand"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Select Shop
              </label>
              <select
                id="comp_id"
                name="comp_id"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                onChange={(e) => setCompId(e.target.value)}
                // onBlur={() => null}
                value={compId}>
                <option selected value={undefined}>
                  Select Shop
                </option>

                {shops?.map((items, i) => (
                  <option key={i} value={items?.id}>
                    {items?.company_name}
                  </option>
                ))}
              </select>
              {called && !compId ? (
                <div className="text-red-500 text-sm">
                  Shop Name is required
                </div>
              ) : null}
            </div>
            <div className="my-4 w-full">
              <label
                htmlFor="brand"
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
              {called && !compId ? (
                <div className="text-red-500 text-sm">Outlet is required</div>
              ) : null}
            </div>
          </div>

          <div class="bg-blue-900 dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
            <div class="overflow-x-auto">
              <DatatableAdv
                onPress={(data) => onPressEdit(data)}
                setSearch={(val) => setSearch(val)}
                title={"Manage Stock"}
                btnText={"Add Stock"}
                onclick={() => onPress()}
                flag={1}
                headers={[
                  { name: "item_id", value: "#" },
                  { name: "item_name", value: "Item Name" },
                  { name: "stock", value: "Stock" },
                ]}
                data={dataSet}
                disabled
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ManageStockView;
