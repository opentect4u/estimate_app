import React, { useEffect, useState } from "react";
import DatatableAdv from "../../../Components/DatatableAdv";
import { useNavigate } from "react-router-dom";
import { Message } from "../../../Components/Message";
import useAPI from "../../../Hooks/useApi";
import HeaderLayout from "../../../Components/HeaderLayout";

function StockView() {
  const navigation = useNavigate();
  const [called, setCalled] = useState(false);
  const { response, callApi } = useAPI();
  const [resp, setRestp] = useState();
  const [isReport, setIsReport] = useState(false);
  const [dataSet, setDataSet] = useState();
  const [search, setSearch] = useState("");

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
          e.item_name.toLowerCase().includes(search.toString().toLowerCase()) ||
          e.stock.toString().includes(search.toString())
      )
    );
  }, [search]);

  useEffect(() => {
    comp = localStorage.getItem("comp_id");
    callApi("/admin/stock_list", 1, { comp_id: +comp, item_id: 0 });
    console.log(response);
  }, []);

  const onPress = (data) => {
    navigation(
      "/home/stock/stockview/stockedit/" + data?.id + "/" + data?.br_id
    );
  };

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
        <div class="mx-auto w-full">
          <div class="bg-blue-900 dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
            <div class="overflow-x-auto">
              <DatatableAdv
                onPress={(data) => onPress(data)}
                setSearch={(val) => setSearch(val)}
                title={"Stock"}
                btnText={""}
                flag={1}
                headers={[
                  { name: "id", value: "#" },
                  { name: "branch_name", value: "Outlet" },
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

export default StockView;
