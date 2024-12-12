import React, { useEffect, useMemo, useState } from "react";
import DatatableAdv from "../../Components/DatatableAdv";
import { useNavigate } from "react-router-dom";
import { Message } from "../../Components/Message";
import useAPI from "../../Hooks/useApi";
import HeaderLayout from "../../Components/HeaderLayout";
import axios from "axios";
import { url } from "../../Address/baseURL";

function StockReport() {
  const navigation = useNavigate();
  const [called, setCalled] = useState(false);
  const { response, callApi } = useAPI();
  const [resp, setRestp] = useState();
  const [isReport, setIsReport] = useState(false);
  const [dataSet, setDataSet] = useState(() => []);
  const [search, setSearch] = useState("");
  const [outlets, setOutlets] = useState(() => []);

  const [selectedOutlet, setSelectedOutlet] = useState(() => 1);

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
    comp = localStorage.getItem("comp_id");

    axios
      .post(`${url}/admin/outlet_list`, {
        comp_id: +comp,
      })
      .then((res) => {
        setOutlets(res?.data?.msg);
      });
  }, []);

  useEffect(() => {
    setDataSet(
      response?.data?.msg?.filter(
        (e) =>
          e.item_name.toLowerCase().includes(search.toString().toLowerCase()) ||
          e.stock.toString().includes(search.toString())
      )
    );
  }, [search]);

  // useEffect(() => {
  //   comp = localStorage.getItem("comp_id");
  //   callApi("/admin/stock_list", 1, { comp_id: +comp, item_id: 0 });
  //   console.log(response);
  // }, []);

  useMemo(() => {
    comp = localStorage.getItem("comp_id");
    // callApi("/admin/stock_list", 1, { comp_id: +comp, item_id: 0 });
    callApi("/admin/stock_report", 1, {
      comp_id: +comp,
      br_id: +selectedOutlet,
    });
    console.log(response);
  }, [selectedOutlet]);

  //   const onPress = (data) => {
  //     navigation(
  //       "/home/stock/stockview/stockedit/" + data?.id + "/" + data?.br_id
  //     );
  //   };

  useEffect(() => {
    setDataSet(
      response?.data?.msg?.filter(
        (e) =>
          e?.branch_name
            ?.toString()
            ?.toLowerCase()
            ?.includes(search?.toString()?.toLowerCase()) ||
          e?.item_name
            ?.toString()
            ?.toLowerCase()
            ?.includes(search?.toString()?.toLowerCase()) ||
          e?.stock
            ?.toString()
            ?.toLowerCase()
            ?.includes(search?.toString()?.toLowerCase())
      )
    );

    console.log("RRRRRRR", response?.data?.msg);
  }, [search]);

  return (
    <div className="py-1 w-full ">
      <HeaderLayout title={"Stock"} btnText={""} />
      <section class="dark:bg-gray-900 p-3">
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
            <option>Select outlet</option>

            {outlets?.map((items, i) => (
              <option key={i} value={items?.id} selected={items?.id === 1}>
                {items?.branch_name}
              </option>
            ))}
          </select>
          {called && !comp ? (
            <div className="text-red-500 text-sm">Outlet is required</div>
          ) : null}
        </div>
        <div class="mx-auto w-full">
          <div class="bg-blue-900 dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
            <div class="overflow-x-auto">
              <DatatableAdv
                disabled={true}
                // onPress={(data) => onPress(data)}
                setSearch={(val) => setSearch(val)}
                title={"Stock"}
                btnText={""}
                flag={1}
                headers={[
                  { name: "item_id", value: "#" },
                  // { name: "branch_name", value: "Outlet" },
                  { name: "item_name", value: "Item" },
                  { name: "stock", value: "In stock" },
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

export default StockReport;
