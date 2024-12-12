import React, { useEffect, useState } from "react";
import { Switch } from "antd";
import useAPI from "../Hooks/useApi";
import { Message } from "./Message";

function DiscountSettings() {
  const [discount, setDiscount] = useState(true);
  const [position, setPosition] = useState(true);
  const [type, setType] = useState();
  const { response, callApi } = useAPI();
  // const [resp,setRestp]=useState()
  const [isReport, setIsReport] = useState(false);
  const [isCalled, setCalled] = useState(false);
  // const [dataSet,setDataSet] = useState()
  const [from, setFrom] = useState();
  const [to, setTo] = useState();
  const [location, setLocation] = useState();
  var comp, resp;
  const handleSubmit = () => {
    console.log(discount, position, type);
    setCalled(true);
    comp = localStorage.getItem("comp_id");
    callApi("/admin/edit_discount_settings", 1, {
      discount_flag: discount == true ? "Y" : "N",
      discount_type: type,
      discount_position: position == true ? "I" : "B",
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
        setType(resp[0]?.discount_type);
        setDiscount(resp[0]?.discount_flag == "Y" ? true : false);
        setPosition(resp[0]?.discount_position == "I" ? true : false);
      }
    }

    if (response?.data?.suc == 0 || response?.data?.msg.length <= 0) {
      Message("error", "Error!");
      setIsReport(false);
    } else {
      if (isCalled) {
        if (response?.data?.suc == 0 || response?.data?.msg.length <= 0) {
          Message("error", "Error!");
        } else {
          if (response?.data?.suc == 1) {
            console.log(response?.data?.suc);
            Message("success", "Success!");
          }
        }
        setCalled(false);
        // setDataSet(response?.data?.msg)
        // setIsReport(true)
      }
    }
  }, [response]);
  useEffect(() => {
    comp = localStorage.getItem("comp_id");
    callApi("/admin/settings_details", 1, { comp_id: +comp });
  }, []);
  return (
    <>
      <div className="grid gap-6 md:grid-cols-4 md:gap-0 my-6 md:mx-[10px] items-center">
        <div className="col-span-1 flex items-baseline">
          <div className="mr-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Discount
          </div>
          <div>
            <Switch
              checked={discount}
              checkedChildren="Active"
              unCheckedChildren="Inactive"
              onClick={() => {
                setDiscount(!discount);
              }}
            />
          </div>
        </div>
        <div className="col-span-2  flex items-baseline">
          <label
            htmlFor="outlet"
            className="flex mb-2 mr-2 text-sm font-medium text-gray-900 dark:text-white">
            Type{" "}
          </label>
          <select
            id="type"
            name="type"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            value={type}
            onChange={(type) => setType(type.target.value)}>
            <option selected="">Select type</option>
            <option value="A">Amount</option>
            <option value="P">Percentage</option>
          </select>
        </div>
        <div className="col-span-1 flex sm:justify-end items-baseline">
          <div className="mr-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Position
          </div>
          <Switch
            checked={position}
            checkedChildren="Itemwise"
            unCheckedChildren="Billwise"
            onClick={() => {
              setPosition(!position);
            }}
          />
        </div>
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

export default DiscountSettings;
