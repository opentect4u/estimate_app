import React, { useEffect, useState } from "react";
import { Switch } from "antd";
import useAPI from "../Hooks/useApi";
import { Message } from "./Message";

function GeneralSettings() {
  const [cust_info, setInfo] = useState(true);
  const [pay_mode, setPay] = useState(true);
  const [unit, setUnit] = useState(true);
  const [inventory, setInventory] = useState(false);
  const [kot_flag, setKot] = useState(false);
  const [receivedFlag, setReceivedFlag] = useState(false);
  const [price_type, setPrice] = useState(false);
  const [type, setType] = useState("P");
  const [refund, setRefund] = useState();
  const { response, callApi } = useAPI();
  const [isCalled, setCalled] = useState(false);

  var comp, resp;
  const handleSubmit = () => {
    console.log(cust_info, pay_mode, unit, inventory, type, refund);
    setCalled(true);
    comp = localStorage.getItem("comp_id");

    callApi("/admin/edit_general_settings", 1, {
      rcpt_type: type,
      unit_flag: unit == true ? "Y" : "N",
      cust_inf: cust_info == true ? "Y" : "N",
      pay_mode: pay_mode == true ? "Y" : "N",
      stock_flag: inventory == true ? "Y" : "N",
      price_type: price_type,
      kot_flag: kot_flag == true ? "Y" : "N",
      rcv_cash_flag: receivedFlag == true ? "Y" : "N",
      refund_days: refund,
      comp_id: +comp,
      modified_by: localStorage.getItem("email_id"),
    });
  };
  useEffect(() => {
    console.log(response);
    if (!isCalled) {
      resp = response?.data?.msg;
      console.log(resp);
      if (resp) {
        setInfo(resp[0]?.cust_inf == "Y" ? true : false);
        setPay(resp[0]?.pay_mode == "Y" ? true : false);
        setUnit(resp[0]?.unit_flag == "Y" ? true : false);
        setInventory(resp[0]?.stock_flag == "Y" ? true : false);
        setReceivedFlag(resp[0]?.rcv_cash_flag == "Y" ? true : false);
        setType(resp[0]?.rcpt_type);
        setRefund(resp[0]?.refund_days);
        setKot(resp[0]?.kot_flag);
        setPrice(resp[0]?.price_type);
      }
    }

    if (response?.data?.suc == 0 || response?.data?.msg.length <= 0) {
      Message("error", "Error!");
    } else {
      if (isCalled) {
        if (response?.data?.suc == 0 || response?.data?.msg.length <= 0) {
          Message("error", "Error!");
        } else {
          Message("success", "Success!");
        }
      }
    }
  }, [response]);
  useEffect(() => {
    comp = localStorage.getItem("comp_id");
    callApi("/admin/settings_details", 1, { comp_id: +comp });
  }, []);

  return (
    <>
      <div className="md:flex md:justify-between md:my-3 grid gap-6 md:grid-cols-6 md:gap-0 my-6 md:mx-[10px] ">
        <div className="flex  justify-between sm:flex">
          <div className="mr-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Customer Info.
          </div>
          <div>
            <Switch
              checked={cust_info}
              checkedChildren="Active"
              unCheckedChildren="Inactive"
              onClick={() => {
                setInfo(!cust_info);
              }}
            />
          </div>
        </div>
        <div className="flex justify-between sm:flex">
          <div className="mr-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Paymode
          </div>
          <Switch
            checked={pay_mode}
            checkedChildren="Active"
            unCheckedChildren="Inactive"
            onClick={() => {
              setPay(!pay_mode);
            }}
          />
        </div>
        <div className="flex justify-between sm:flex">
          <div className="mr-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Unit
          </div>
          <Switch
            checked={unit}
            checkedChildren="Active"
            unCheckedChildren="Inactive"
            onClick={() => {
              setUnit(!unit);
            }}
          />
        </div>
        {/* <div className="flex justify-between sm:flex">
          <div className="mr-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Inventory
          </div>
          <Switch
            checked={inventory}
            checkedChildren="Active"
            unCheckedChildren="Inactive"
            onClick={() => {
              setInventory(!inventory);
            }}
          />
        </div> */}
        {/* <div className="flex justify-between sm:flex">
          <div className="mr-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            KOT
          </div>
          <Switch
            checked={kot_flag}
            checkedChildren="Active"
            unCheckedChildren="Inactive"
            onClick={() => {
              setKot(!kot_flag);
            }}
          />
        </div> */}
        {/* <div className="flex justify-between sm:flex">
          <div className="mr-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Received Flag
          </div>
          <Switch
            checked={receivedFlag}
            checkedChildren="Active"
            unCheckedChildren="Inactive"
            onClick={() => {
              setReceivedFlag(!receivedFlag);
            }}
          />
        </div> */}
      </div>
      <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
        {/* <div className="w-full">
          <label
            htmlFor="outlet"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Receipt type{" "}
          </label>
          <select
            id="type"
            name="type"
            disabled
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            value={type}
            onChange={(type) => setType(type.target.value)}>
            <option selected="">Select type</option>
            <option value="P">Print</option>
            <option value="S">SMS</option>
            <option value="B">Both</option>
          </select>
        </div> */}
        {/* <div className="w-full">
          <label
            htmlFor="brand"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Refund within (days)
          </label>
          <input
            type="text"
            name="refund"
            id="refund"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            placeholder="2"
            value={refund}
            onChange={(refund) => setRefund(refund.target.value)}
          />
        </div> */}
        {/* <div className="w-full">
          <label
            htmlFor="outlet"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Price type{" "}
          </label>
          <select
            id="type"
            name="type"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            value={price_type}
            onChange={(type) => setPrice(type.target.value)}>
            <option selected="">Select type</option>
            <option value="A">Auto</option>
            <option value="M">Manual</option>
          </select>
        </div> */}
      </div>
      <div className="flex justify-center">
        <button
          type="submit"
          className="inline-flex bg-blue-900 items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-full focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
          onClick={() => handleSubmit()}>
          Submit
        </button>
      </div>
    </>
  );
}

export default GeneralSettings;
