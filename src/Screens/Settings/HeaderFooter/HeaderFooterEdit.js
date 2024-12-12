import { Switch } from "antd";
import React, { useEffect, useState } from "react";
import useAPI from "../../../Hooks/useApi";
import { DurationMessage } from "../../../Components/DurationMessage";
import { Message } from "../../../Components/Message";
import { useNavigate } from "react-router-dom";
import Backbtn from "../../../Components/Backbtn";

function HeaderFooterEdit() {
  const { response, callApi } = useAPI();
  const [isCalled, setCalled] = useState(false);
  const navigation = useNavigate();

  const [f1, setF1] = useState(false);
  const [f2, setF2] = useState(false);
  const [f3, setF3] = useState(false);
  const [f4, setF4] = useState(false);

  const [f1Text, setF1Text] = useState("");
  const [f2Text, setF2Text] = useState("");
  const [f3Text, setF3Text] = useState("");
  const [f4Text, setF4Text] = useState("");
  var comp;
  useEffect(() => {
    if (!isCalled) {
      console.log(response);
      setF1(response?.data?.msg[0]?.on_off_flag1 == "Y" ? true : false);
      setF2(response?.data?.msg[0]?.on_off_flag2 == "Y" ? true : false);
      setF3(response?.data?.msg[0]?.on_off_flag3 == "Y" ? true : false);
      setF4(response?.data?.msg[0]?.on_off_flag4 == "Y" ? true : false);

      setF1Text(response?.data?.msg[0]?.header1);
      setF2Text(response?.data?.msg[0]?.header2);
      setF3Text(response?.data?.msg[0]?.footer1);
      setF4Text(response?.data?.msg[0]?.footer2);
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
            navigation("/home/settings/headerfooter/view");
          }, 4500);
        }
        // setDataSet(response?.data?.msg)
        // setIsReport(true)
      }
    }
  }, [response]);
  const handleSubmit = () => {
    setCalled(true);
    comp = localStorage.getItem("comp_id");

    callApi("/admin/edit_header_footer", 1, {
      on_off_flag1: f1 == true ? "Y" : "N",
      on_off_flag2: f2 == true ? "Y" : "N",
      on_off_flag3: f3 == true ? "Y" : "N",
      on_off_flag4: f4 == true ? "Y" : "N",
      header1: f1Text,
      header2: f2Text,
      footer1: f3Text,
      footer2: f4Text,
      comp_id: +comp,
      modified_by: localStorage.getItem("email_id"),
    });
  };
  useEffect(() => {
    comp = localStorage.getItem("comp_id");
    callApi("/admin/header_footer_details", 1, { comp_id: +comp });
  }, []);

  return (
    <>
      <Backbtn />

      <section className="bg-white dark:bg-gray-900">
        <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
          <h2 className="mb-4 text-xl font-bold text-blue-900 dark:text-white">
            Header/Footer Details
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="w-full">
              <label
                htmlFor="brand"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Header1 Text{" "}
              </label>
              <input
                type="text"
                name="from_dt"
                id="from_dt"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                maxLength="25"
                value={f1Text}
                onChange={(f1Text) => setF1Text(f1Text.target.value)}
                placeholder="Product brand"
                required=""
              />
              <p
                id="helper-text-explanation"
                class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {f1Text?.length}/25
              </p>
            </div>
            <div className="w-full mt-8">
              <Switch
                checked={f1}
                checkedChildren="Active"
                unCheckedChildren="Inactive"
                onClick={() => {
                  setF1(!f1);
                }}
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="brand"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Header2 Text{" "}
              </label>
              <input
                type="text"
                name="from_dt"
                id="from_dt"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                maxLength="25"
                value={f2Text}
                onChange={(f2Text) => setF2Text(f2Text.target.value)}
                placeholder="Product brand"
                required=""
              />
              <p
                id="helper-text-explanation"
                class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {f2Text?.length}/25
              </p>
            </div>
            <div className="w-full mt-8">
              <Switch
                checked={f2}
                checkedChildren="Active"
                unCheckedChildren="Inactive"
                onClick={() => {
                  setF2(!f2);
                }}
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="brand"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Footer1 Text{" "}
              </label>
              <input
                type="text"
                name="from_dt"
                id="from_dt"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 "
                maxLength="25"
                value={f3Text}
                onChange={(f3Text) => setF3Text(f3Text.target.value)}
                placeholder="Product brand"
                required=""
              />
              <p
                id="helper-text-explanation"
                class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {f3Text?.length}/25
              </p>
            </div>
            <div className="w-full mt-8">
              <Switch
                checked={f3}
                checkedChildren="Active"
                unCheckedChildren="Inactive"
                onClick={() => {
                  setF3(!f3);
                }}
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="brand"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Footer2 Text{" "}
              </label>
              <input
                type="text"
                name="from_dt"
                id="from_dt"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                maxLength="25"
                value={f4Text}
                onChange={(f4Text) => setF4Text(f4Text.target.value)}
                placeholder="Product brand"
                required=""
              />
              <p
                id="helper-text-explanation"
                class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {f4Text?.length}/25
              </p>
            </div>
            <div className="w-full mt-8">
              <Switch
                checked={f4}
                checkedChildren="Active"
                unCheckedChildren="Inactive"
                onClick={() => {
                  setF4(!f4);
                }}
              />
            </div>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              onClick={() => handleSubmit()}
              className="inline-flex bg-blue-900 items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-full focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
              Submit
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default HeaderFooterEdit;
