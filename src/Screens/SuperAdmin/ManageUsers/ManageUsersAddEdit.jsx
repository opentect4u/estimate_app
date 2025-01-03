import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router";
import * as Yup from "yup";
import { useFormik } from "formik";
import useAPI from "../../../Hooks/useApi";
import { Message } from "../../../Components/Message";
import { DurationMessage } from "../../../Components/DurationMessage";
import axios from "axios";
import { url } from "../../../Address/baseURL";
import Backbtn from "../../../Components/Backbtn";
import { Toast } from "primereact/toast";
import { message } from "antd";

function ManageShopsAddEdit() {
  const params = useParams();
  const { response, callApi } = useAPI();
  const navigation = useNavigate();

  // const [resp,setRestp]=useState()
  const [isReport, setIsReport] = useState(false);
  const [isCalled, setCalled] = useState(false);
  const [dataSet, setDataSet] = useState();
  const [c_del, setDel] = useState("");
  const [c_bill, setBill] = useState("");
  const [outlets, setOutlets] = useState(() => []);
  const [shops, setShops] = useState(() => []);
  const [count_device,setCountDevice] = useState(0)
  const [userTypeText, setUserTypeText] = useState(() => "");

  var comp, userId;

  // const [messageApi, contextHolder] = message.useMessage();
  // const info = () => {
  //   messageApi.error("Something went wrong!");
  // };

  // const toast = useRef(null);

  // const show = () => {
  //   toast.current.show({
  //     severity: "info ",
  //     summary: "Error",
  //     detail: "Somehting went wrong!",
  //   });
  // };

  useEffect(() => {
    console.log(params);
    comp = localStorage.getItem("comp_id");
    if (params.id > 0) callApi(`/admin/S_Admin/select_user?id=${params.id}`, 0);
    // setDataSet(response?.data?.msg)
  }, [isCalled]);

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
    // console.log(response, Array.isArray(response?.data?.msg));
    if (Array.isArray(response?.data?.msg)) {
      console.log(response);
      const rsp = {
        u_comp_id: +response?.data?.msg[0].comp_id,
        u_br_id: +response?.data?.msg[0].br_id,
        u_user_name: response?.data?.msg[0].user_name,
        u_user_type: response?.data?.msg[0].user_type,
        u_user_id: response?.data?.msg[0].user_id,
        u_phone_no: +response?.data?.msg[0].phone_no,
        // u_email_id: response?.data?.msg[0].email_id,
        u_password: response?.data?.msg[0].password,
        u_active_flag: response?.data?.msg[0].active_flag,
        u_login_flag: response?.data?.msg[0].login_flag,
        u_created_by: response?.data?.msg[0].created_by,
        u_device_id: response?.data?.msg[0]?.device_id,
      };
      setValues(rsp);
      //  setBill(response?.data?.msg[0].bill_address)
      //  setDel(response?.data?.msg[0].delivery_address)
      console.log(rsp);
    }
    // setDataSet(response?.data?.msg)
    if (response?.data?.suc == 0 || response?.data?.msg.length <= 0) {
      console.log(":RRRRRRRRRRSSSSSSSSSSSS", response);
      Message("error", "Something went wrong!");
      // message.info("This is a normal message");
      // show();
    } else {
      if (isCalled && response?.data?.suc == 1) {
        setCalled(false);
        DurationMessage();
        setTimeout(() => {
          navigation("/home/superadmin/manageusers/view");
        }, 4500);
      }
    }
  }, [response]);

  const initialValues = {
    // id: 0,
    u_comp_id: "",
    u_br_id: "",
    u_user_name: "",
    u_user_type: "",
    u_user_id: "",
    u_phone_no: "",
    // u_email_id: "",
    // device_id: string,
    u_password: "",
    u_active_flag: "",
    u_login_flag: "N",
    // u_created_by: "",
  };

  const onSubmit = (values) => {
    setCalled(true);
    console.log(values, params.id);
    // comp = localStorage.getItem("comp_id");
    userId = localStorage.getItem("user_id");

    let payload =
      params.id != 0
        ? {
            id: +params.id,
            comp_id: +values?.u_comp_id,
            br_id: +values?.u_br_id,
            user_name: values?.u_user_name,
            user_type: values?.u_user_type,
            user_id: values?.u_user_id,
            phone_no: +values?.u_phone_no,
            // email_id: values?.u_email_id,
            password: values?.u_password || "",
            active_flag: values?.u_active_flag,
            login_flag: values?.u_login_flag,
            device_id: values?.u_device_id,
            created_by: userId,
          }
        : {
            id: +params.id,
            comp_id: +values?.u_comp_id,
            br_id: +values?.u_br_id,
            user_name: values?.u_user_name,
            user_type: values?.u_user_type,
            user_id: values?.u_user_id,
            phone_no: +values?.u_phone_no,
            // email_id: values?.u_email_id,
            active_flag: "Y",
            login_flag: "N",
            password: values?.u_password || "",
            device_id: values?.u_device_id,
            created_by: userId,
          };

    callApi("/admin/S_Admin/add_edit_user", 1, payload);
  };

  const validationSchema = Yup.object({
    u_comp_id: Yup.string().required("Company is required."),
    u_br_id: Yup.string().required("Outlet is required."),
    u_user_name: Yup.string().required("User name is required."),
    u_user_type: Yup.string().required("User type is required."),
    u_user_id: Yup.string().required("User ID is required."),
    // u_phone_no: Yup.string().required("Phone number is required."),
    // u_email_id: Yup.string().required("Email id is required."),
    // u_password: Yup.string().required("Password is required."),
    // u_password: Yup.string().when("u_user_type", {
    //   is: (val) => val === "A",
    //   then: () => Yup.string().required("Password is required"),
    //   otherwise: () => Yup.string().optional(),
    // }),
    u_password: Yup.string().required("Password is required"),
    // u_active_flag: Yup.string().required("Active flag is required."),
    // u_login_flag: Yup.string().required("Login flag is required."),
    // u_created_by: Yup.string().required(" is required."),
  });

  const [formValues, setValues] = useState(initialValues);
  console.log(formValues);
  const formik = useFormik({
    initialValues: params.id > 0 ? formValues : initialValues,
    onSubmit,
    validationSchema,
    enableReinitialize: true,
    validateOnMount: true,
  });

  // useEffect(() => {

  // }, [formik.values.])

  useEffect(() => {
    console.log(formik.values.u_comp_id);
    axios
      .get(
        `${url}/admin/S_Admin/select_outlet?comp_id=${
          formik.values.u_comp_id || 0
        }`
      )
      .then((res) => {
        setOutlets(res?.data?.msg);
        console.log(res);
      })
      .catch((err) => {
        Message("error", err);
      });
  }, [formik.values.u_comp_id]);

  useEffect(() => {
    if (
      formik.values.u_user_type === "U" ||
      formik.values.u_user_type === "M"
    ) {
      setUserTypeText("PHONE_NO");
    } else if (formik.values.u_user_type === "A") {
      setUserTypeText("EMAIL");
    } else {
      setUserTypeText("NONE");
    }
  }, [formik.values.u_user_type]);

  return (
    <>
      {/* <Toast ref={toast} /> */}
      <Backbtn />

      <section class="bg-white dark:bg-gray-900">
        <div class="py-8 px-4 mx-auto max-w-2xl lg:py-16">
          <h2 class="mb-4 text-xl font-bold text-blue-900 dark:text-white">
            {params.id == 0 ? "Add User" : "Update user"}
          </h2>
          <form onSubmit={formik.handleSubmit}>
            <div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div>
                <label
                  for="u_comp_id"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Select Shop
                </label>
                <select
                  id="u_comp_id"
                  name="u_comp_id"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.u_comp_id}>
                  <option selected="">Select Shop</option>

                  {shops?.map((items, i) => (
                    <option key={i} value={items?.id}>
                      {items?.company_name}
                    </option>
                  ))}
                </select>
                {formik.errors.u_comp_id && formik.touched.u_comp_id ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.u_comp_id}
                  </div>
                ) : null}
              </div>
              <div>
                <label
                  for="u_br_id"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Outlets
                </label>
                <select
                  id="u_br_id"
                  name="u_br_id"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.u_br_id}>
                  <option selected="">Select Outlet</option>

                  {outlets?.map((item, i) => (
                    <option key={i} value={item?.id}>
                      {item?.branch_name}
                    </option>
                  ))}
                </select>
                {formik.errors.u_br_id && formik.touched.u_br_id ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.u_br_id}
                  </div>
                ) : null}
              </div>
              <div class="w-full sm:col-span-2">
                <label
                  for="u_user_name"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  User Name
                </label>
                <input
                  type="text"
                  name="u_user_name"
                  id="u_user_name"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.u_user_name}
                  placeholder="Enter username"
                  required=""
                />
                {formik.errors.u_user_name && formik.touched.u_user_name ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.u_user_name}
                  </div>
                ) : null}
              </div>
              <div>
                <label
                  for="u_user_type"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  User Type
                </label>
                <select
                  id="u_user_type"
                  name="u_user_type"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.u_user_type}>
                  <option selected="">Select User Type</option>
                  <option value="U">User</option>
                  <option value="M">Manager</option>
                  <option value="A">Admin</option>
                </select>
                {formik.errors.u_user_type && formik.touched.u_user_type ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.u_user_type}
                  </div>
                ) : null}
              </div>

              <div class="w-full">
                <label
                  for="u_user_id"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  {/* {userTypeText === "PHONE_NO"
                    ? "User ID"
                    : userTypeText === "EMAIL"
                    ? "User ID (Email)"
                    : "User ID"} */}
                     {"User ID"}
                </label>
                <input
                  disabled={userTypeText === "NONE"}
                  // type={userTypeText === "PHONE_NO" ? "text" : "email"}
                  type={"text"}
                  name="u_user_id"
                  id="u_user_id"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.u_user_id}
                  // placeholder="98367XXXXX or abc@email.com"
                  // placeholder={
                  //   userTypeText === "PHONE_NO"
                  //     ? "98367XXXXX"
                  //     : userTypeText === "EMAIL"
                  //     ? "abc@email.com"
                  //     : "Choose User Type"
                  // }
                  placeholder={
                   "Enter User ID"
                  }
                  required=""
                />
                {/* <div className="text-blue-600 text-xs">
                  For Admin User, write Email. For normal User/Manager, write
                  any.
                </div> */}
                {formik.errors.u_user_id && formik.touched.u_user_id ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.u_user_id}
                  </div>
                ) : null}
              </div>
              <div class="w-full">
                <label
                  for="u_phone_no"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Phone Number
                </label>
                <input
                  type="number"
                  name="u_phone_no"
                  id="u_phone_no"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.u_phone_no}
                  placeholder="Phone Number"
                  required=""
                />
                {/* {formik.errors.u_phone_no && formik.touched.u_phone_no ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.u_phone_no}
                  </div>
                ) : null} */}
              </div>
              {/* <div class="w-full">
                <label
                  for="u_email_id"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Email
                </label>
                <input
                  type="email"
                  name="u_email_id"
                  id="u_email_id"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.u_email_id}
                  placeholder="abc@email.com"
                  required=""
                />
                {formik.errors.u_email_id && formik.touched.u_email_id ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.u_email_id}
                  </div>
                ) : null}
              </div> */}
              {/* {formik.values.u_user_type === "A" && (
                <div class="w-full">
                  <label
                    for="u_password"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Password
                  </label>
                  <input
                    type="password"
                    name="u_password"
                    id="u_password"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.u_password}
                    placeholder="qwerty1234..."
                    required=""
                  />
                  {formik.errors.u_password && formik.touched.u_password ? (
                    <div className="text-red-500 text-sm">
                      {formik.errors.u_password}
                    </div>
                  ) : null}
                </div>
              )} */}
              <div class="w-full">
                <label
                  for="u_password"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Password
                </label>
                <input
                  type="password"
                  name="u_password"
                  id="u_password"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.u_password}
                  placeholder="qwerty1234..."
                  required=""
                />
                {formik.errors.u_password && formik.touched.u_password ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.u_password}
                  </div>
                ) : null}
              </div>
              {/* {params.id != 0 && (
                <>
                  <div>
                    <label
                      for="u_active_flag"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Active Flag
                    </label>
                    <select
                      id="u_active_flag"
                      name="u_active_flag"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.u_active_flag}>
                      <option selected="">Select Active Status</option>
                      <option value="Y">Yes</option>
                      <option value="N">No</option>
                    </select>
                    {formik.errors.u_active_flag &&
                    formik.touched.u_active_flag ? (
                      <div className="text-red-500 text-sm">
                        {formik.errors.u_active_flag}
                      </div>
                    ) : null}
                  </div>
                  <div>
                    <label
                      for="u_login_flag"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Login Flag
                    </label>
                    <select
                      id="u_login_flag"
                      name="u_login_flag"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.u_login_flag}>
                      <option>Select Login Status</option>
                      <option value="Y">Yes</option>
                      <option selected value="N">
                        No
                      </option>
                    </select>
                    {formik.errors.u_login_flag &&
                    formik.touched.u_login_flag ? (
                      <div className="text-red-500 text-sm">
                        {formik.errors.u_login_flag}
                      </div>
                    ) : null}
                  </div>
                  <div class="sm:col-span-2">
                    <label
                      for="u_device_id"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Device ID
                    </label>
                    <input
                      type="text"
                      name="u_device_id"
                      id="u_device_id"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.u_device_id}
                      placeholder="Enter Device ID"
                      required=""
                    />
                    {formik.errors.u_device_id && formik.touched.u_device_id ? (
                      <div className="text-red-500 text-sm">
                        {formik.errors.u_device_id}
                      </div>
                    ) : null}
                  </div>
                </>
              )} */}

              <>
                <div>
                  <label
                    for="u_active_flag"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Active Flag
                  </label>
                  <select
                    id="u_active_flag"
                    name="u_active_flag"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.u_active_flag}>
                    <option selected="">Select Active Status</option>
                    <option value="Y">Yes</option>
                    <option value="N">No</option>
                  </select>
                  {formik.errors.u_active_flag &&
                  formik.touched.u_active_flag ? (
                    <div className="text-red-500 text-sm">
                      {formik.errors.u_active_flag}
                    </div>
                  ) : null}
                </div>
                <div>
                  <label
                    for="u_login_flag"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Login Flag
                  </label>
                  <select
                    id="u_login_flag"
                    name="u_login_flag"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.u_login_flag}>
                    <option>Select Login Status</option>
                    <option value="Y">Yes</option>
                    <option selected value="N">
                      No
                    </option>
                  </select>
                  {formik.errors.u_login_flag && formik.touched.u_login_flag ? (
                    <div className="text-red-500 text-sm">
                      {formik.errors.u_login_flag}
                    </div>
                  ) : null}
                </div>
                <div class="sm:col-span-2">
                  <label
                    for="u_device_id"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Device ID
                  </label>
                  <input
                    type="text"
                    name="u_device_id"
                    id="u_device_id"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    onChange={formik.handleChange}
                    onBlur={
                      e=>{
                        formik.handleBlur(e)
                        if(formik.values.u_device_id)
                        axios.post(`${url}/admin/S_Admin/check_device_id`,{device_id:formik.values.u_device_id}).then(res=>{
                          console.log(res)
                          setCountDevice(res?.data?.msg[0].count)
                        
                        
                        })
                      }
                    }
                    value={formik.values.u_device_id}
                    placeholder="Enter Device ID"
                    required=""
                  />
                  {formik.errors.u_device_id && formik.touched.u_device_id ? (
                    <div className="text-red-500 text-sm">
                      {formik.errors.u_device_id}
                    </div>
                  ) : null}

{count_device>0 && <div className="text-red-500 text-sm">
                      Device ID already allotted
                    </div>
}
                </div>
              </>
            </div>
            <div className="flex justify-center">
              {params.id == 0 && (
                <button
                  type="reset"
                  onClick={formik.handleReset}
                  className="inline-flex mr-3 bg-white items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-blue-900 border border-blue-900 bg-primary-700 rounded-full focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
                  Reset
                </button>
              )}
              <button
                type="submit"
                className="inline-flex bg-blue-900 items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-full focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
                Submit
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

export default ManageShopsAddEdit;
