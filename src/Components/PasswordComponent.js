import React, { useEffect, useState } from "react";
import useAPI from "../Hooks/useApi";
import { Message } from "./Message";
import axios from "axios";
import { url } from "../Address/baseURL";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
function PasswordComponent({ onPress }) {
  const [oldPass, setOldPass] = useState("");
  const [password, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [type, setType] = useState(true);
  const [disable, setDisable] = useState(true);
  const [disableMsg, setDisableMsg] = useState("");
  const [suc, setSuc] = useState(0);
  const { response, callApi } = useAPI();
  const [loadText, showLoadText] = useState(false);
  const [called, setCalled] = useState(false);
  var comp;

  useEffect(() => {
    if (oldPass) {
      showLoadText(true);

      axios
        .post(url + "/admin/check_password", {
          comp_id: +localStorage.getItem("comp_id"),
          user_id: localStorage.getItem("user_id"),
          old_password: oldPass,
        })
        .then((res) => {
          console.log(res.data.suc);
          setSuc(res.data.suc);
          showLoadText(false);

          setDisableMsg(
            res.data.suc > 0
              ? ""
              : "The password you have given does not match with the original one!"
          );
        });
    }
  }, [oldPass]);
  useEffect(() => {
    if (password != confirm || password == "" || confirm == "") {
      setDisable(true);
      setDisableMsg("New passwords don't match");
    } else if (!suc) {
      setDisable(true);
    } else if (password == oldPass) {
      setDisable(true);
      setDisableMsg("Old and new passwords cannot be the same");
    } else {
      setDisable(false);
      setDisableMsg("");
    }
  }, [password, confirm]);
  useEffect(() => {
    if (response?.data?.suc == 0 || response?.data?.msg.length <= 0) {
      Message("error", "Something went wrong!");
    } else {
      if (response?.data?.suc == 1) {
        Message("success", "Success");
        setConfirm("");
        setDisable(true);
        setNewPass("");
        setOldPass("");
        onPress();
      }
    }
  }, [response]);
  const changePass = () => {
    setCalled(true);
    setDisable(true);
    comp = localStorage.getItem("comp_id");
    callApi("/admin/reset_password", 1, {
      comp_id: +comp,
      user_id: localStorage.getItem("user_id"),
      old_password: oldPass,
      new_password: password,
    });
  };
  return (
    <div>
      <div class="max-w-sm mx-auto">
        <div class="mb-5 relative">
          <label
            for="oldPass"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Old password
          </label>
          <input
            type={type ? "password" : "text"}
            id="oldPass"
            name="oldPass"
            value={oldPass}
            onChange={(text) => setOldPass(text.target.value)}
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
          {loadText && (
            <Spin
              className="absolute right-4 top-9"
              indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
            />
          )}
        </div>
        <div class="mb-5">
          <label
            for="password"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            New password
          </label>
          <input
            type={type ? "password" : "text"}
            id="password"
            name="password"
            value={password}
            onChange={(text) => setNewPass(text.target.value)}
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div class="mb-5">
          <label
            for="rPass"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Confirm password
          </label>
          <input
            type={type ? "password" : "text"}
            id="rPass"
            name="rPass"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={confirm}
            onChange={(text) => setConfirm(text.target.value)}
          />
          {disable && <div className="text-red-600">{disableMsg}</div>}
        </div>
        <div class="flex items-start mb-5">
          <div class="flex items-center h-5">
            <input
              id="remember"
              onClick={() => setType(!type)}
              type="checkbox"
              value=""
              class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
              required
            />
          </div>
          <label
            for="remember"
            class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            Show Password
          </label>
        </div>
        <button
          type="submit"
          disabled={disable}
          onClick={() => {
            changePass();
          }}
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-full px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:bg-blue-400">
          {called ? (
            <Spin
              className="text-white"
              indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
            />
          ) : (
            "Submit"
          )}
        </button>
      </div>
    </div>
  );
}

export default PasswordComponent;
