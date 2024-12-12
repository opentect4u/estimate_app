import React, { useEffect, useState } from "react";
import { Switch } from "antd";
import useAPI from "../Hooks/useApi";
import { Message } from "./Message";

function GSTSettings() {
  const [flag, setFlag] = useState(true);
  const [type, setType] = useState();
  const { response, callApi } = useAPI();
  const [isReport, setIsReport] = useState(false);
  const [isCalled, setCalled] = useState(false);
  const [from, setFrom] = useState();
  const [to, setTo] = useState();
  const [location, setLocation] = useState();
  var comp, resp;
  const handleSubmit = () => {
    console.log(flag, type);
    setCalled(true);
    comp = localStorage.getItem("comp_id");
    callApi("/admin/edit_gst_settings", 1, {
      gst_flag: flag == true ? "Y" : "N",
      gst_type: type,
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
        setFlag(resp[0]?.gst_flag == "Y" ? true : false);
        setType(resp[0]?.gst_type);
      }
    }

    if (response?.data?.suc == 0 || response?.data?.msg.length <= 0) {
      Message("error", "Error!");
      setIsReport(false);
    } else {
      if (isCalled) {
        console.log(isCalled);
        if (response?.data?.suc == 0 || response?.data?.msg?.length <= 0) {
          Message("error", "Error!");
        } else {
          Message("success", "Success!");
        }
        setCalled(false);
      }
    }
  }, [response]);
  useEffect(() => {
    comp = localStorage.getItem("comp_id");
    callApi("/admin/settings_details", 1, { comp_id: +comp });
  }, []);
  return (
    <>
      <div className="flex-col justify-center w-full items-baseline">
        <div className="flex justify-center">
          <div className="mr-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            GST Flag
          </div>
          <div>
            <Switch
              checked={flag}
              checkedChildren="Active"
              unCheckedChildren="Inactive"
              onClick={() => {
                setFlag(!flag);
              }}
            />
          </div>
        </div>

        <div>
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
            <option value="E">Exclusive</option>
            <option value="I">Inclusive</option>
          </select>
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

export default GSTSettings;
