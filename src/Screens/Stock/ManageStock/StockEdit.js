import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAPI from "../../../Hooks/useApi";
import { Message } from "@mui/icons-material";
import { DurationMessage } from "../../../Components/DurationMessage";
import { useNavigate } from "react-router-dom";
import Backbtn from "../../../Components/Backbtn";
function StockEdit() {
  const params = useParams();
  const [name, setName] = useState("");
  const [stock, setStock] = useState(100);
  const [stockBack, setStockBack] = useState(100);
  const [add, setAdd] = useState(0);
  const [less, setLess] = useState(0);
  // const [resp,setRestp]=useState()
  const { response, callApi } = useAPI();
  const [isCalled, setCalled] = useState(false);
  const [dataSet, setDataSet] = useState();
  const navigation = useNavigate();

  var comp, resp;

  useEffect(() => {
    console.log(response);
    if (!isCalled) {
      resp = response?.data?.msg;
      console.log(resp);
      if (resp) {
        setName(resp[0]?.item_name);
        setStock(resp[0]?.stock);
        setStockBack(resp[0]?.stock);
      }
    }

    if (response?.data?.suc == 0 || response?.data?.msg.length <= 0) {
      Message("error", "Error!");
    } else {
      if (isCalled) {
        if (response?.data?.suc == 0 || response?.data?.msg.length <= 0) {
          Message("error", "Error!");
        } else {
          setCalled(false);
          DurationMessage();
          setTimeout(() => {
            navigation("/home/stock/stockview/view");
          }, 4500);
        }
        // setDataSet(response?.data?.msg)
        // setIsReport(true)
      }
    }
  }, [response]);

  useEffect(() => {
    comp = localStorage.getItem("comp_id");
    callApi("/admin/stock_list", 1, { comp_id: +comp, item_id: +params.id });
  }, []);

  const onSubmit = () => {
    setCalled(true);
    comp = localStorage.getItem("comp_id");
    callApi("/admin/add_edit_stock", 1, {
      comp_id: +comp,
      item_id: +params.id,
      br_id: +params.br_id,
      stock_add: +add,
      stock_less: +less,
    });
  };

  return (
    <>
      <Backbtn />

      <section class="bg-white dark:bg-gray-900">
        <div class="py-8 px-4 mx-auto max-w-2xl lg:py-16">
          <h2 class="mb-4 text-xl font-bold text-blue-900 dark:text-white">
            Edit stock
          </h2>
          <div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div class="w-full">
              <label
                for="name"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={(name) => setName(name.target.value)}
                id="name"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Type item name"
                disabled={true}
              />
            </div>
            <div class="w-full">
              <label
                for="brand"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Stock
              </label>
              <input
                type="number"
                name="brand"
                id="brand"
                value={stock}
                onChange={(stock) => setStock(stock.target.value)}
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="120"
                disabled={true}
              />
            </div>
            <div class="w-full">
              <label
                for="price"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Add
              </label>
              <input
                type="number"
                name="price"
                id="price"
                value={add}
                onChange={(add) => {
                  setAdd(add.target.value);
                  setStock(() => setStock(+stockBack + +add.target.value));
                }}
                onBlur={() => setStockBack(stock)}
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="0"
                required=""
              />
            </div>
            <div class="w-full">
              <label
                for="brand"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Less
              </label>
              <input
                type="number"
                name="brand"
                id="brand"
                value={less}
                onChange={(less) => {
                  setLess(less.target.value);
                  setStock(() => setStock(+stockBack - +less.target.value));
                }}
                onBlur={() => setStockBack(stock)}
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="0"
                required=""
              />
            </div>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              onClick={() => onSubmit()}
              className="inline-flex bg-blue-900 items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-full focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
              Submit
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default StockEdit;
