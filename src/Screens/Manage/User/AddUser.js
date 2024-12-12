import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import useAPI from "../../../Hooks/useApi";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Message } from "../../../Components/Message";
import Backbtn from "../../../Components/Backbtn";
import { url } from "../../../Address/baseURL";
function AddUser() {
  const { response, callApi } = useAPI();
  const navigation = useNavigate();
  const [isCalled, setCalled] = useState(false);
  const [dataSet, setDataSet] = useState();
  var comp, userId;
  useEffect(() => {
    // axios.post('http://192.168.1.238:3005/admin/outlet_list',{comp_id:+localStorage.getItem('comp_id'),}).then(resp=>{console.log(resp); setDataSet(resp?.data?.msg)})

    axios
      .post(url + "/admin/outlet_list", {
        comp_id: +localStorage.getItem("comp_id"),
      })
      .then((resp) => {
        console.log(resp);
        setDataSet(resp?.data?.msg);
      });
  }, []);

  useEffect(() => {
    if (response?.data?.suc == 0 || response?.data?.msg.length <= 0) {
      Message("error", "Something went wrong!");
    } else {
      if (isCalled && response?.data?.suc == 1) {
        setCalled(false);
        Message("success", "Success!");
        // setTimeout(()=>{
        //     navigation('/home/user/view')

        // },4500)
      }
    }
  }, [response]);

  const initialValues = {
    u_name: "",
    u_email: "",
    u_type: "",
    u_br_id: "",
    u_phone: "",
    u_pass: "",
  };

  const onSubmit = (values) => {
    setCalled(true);
    console.log(values);
    comp = localStorage.getItem("comp_id");
    userId = localStorage.getItem("user_id");
    callApi("/admin/add_user", 1, {
      comp_id: 1,
      br_id: +values.u_br_id,
      user_name: values.u_name,
      phone_no: values.u_phone.toString(),
      email_id: values.u_email,
      user_type: values.u_type || "",
      active_flag: "Y",
      login_flag: "N",
      device_id: "",
      password: values.u_pass,
      created_by: userId,
    });
    formik.handleReset();
  };

  const validationSchema = Yup.object({
    u_name: Yup.string().required("Name is required"),
    u_phone: Yup.string().required("Phone is required"),
    // u_email: Yup.string()
    //   .required("Email is required")
    //   .email("Email format incorrect"),
    u_type: Yup.string().required("Type is required"),
    u_br_id: Yup.string().required("Branch is required"),
    u_pass: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
    enableReinitialize: true,
    validateOnMount: true,
  });

  return (
    <>
      <Backbtn />
      <section class="bg-white dark:bg-gray-900">
        <div class="py-8 px-4 mx-auto max-w-2xl lg:py-16">
          <h2 class="mb-4 text-xl font-bold text-blue-900 dark:text-white">
            Add a new user
          </h2>
          <form onSubmit={formik.handleSubmit}>
            <div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div class="sm:col-span-2">
                <label
                  for="u_name"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Name
                </label>
                <input
                  type="text"
                  name="u_name"
                  id="i_name"
                  value={formik.values.u_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Type name"
                  required=""
                />
                {formik.errors.u_name && formik.touched.u_name ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.u_name}
                  </div>
                ) : null}
              </div>
              <div class="w-full">
                <label
                  for="u_phone"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Phone
                </label>
                <input
                  type="number"
                  name="u_phone"
                  id="u_phone"
                  value={formik.values.u_phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="98367XXXXX"
                  required=""
                />
                {formik.errors.u_phone && formik.touched.u_phone ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.u_phone}
                  </div>
                ) : null}
              </div>
              {/* <div class="w-full">
                <label
                  for="u_email"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Email
                </label>
                <input
                  type="email"
                  name="u_email"
                  value={formik.values.u_email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  id="u_email"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="abcd@gmail.com"
                  required=""
                />
                {formik.errors.u_email && formik.touched.u_email ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.u_email}
                  </div>
                ) : null}
              </div> */}
              <div class="w-full">
                <label
                  for="u_type"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Type
                </label>
                <select
                  id="u_type"
                  value={formik.values.u_type}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                  <option selected="">Select type</option>
                  <option value="U">User</option>
                  {/* <option value="M">Master</option> */}
                </select>
                {formik.errors.u_type && formik.touched.u_type ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.u_type}
                  </div>
                ) : null}
              </div>
              <div>
                <label
                  for="u_br_id"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Outlet
                </label>
                <select
                  id="u_br_id"
                  value={formik.values.u_br_id}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                  <option selected="">Select outlet</option>
                  {dataSet?.map((item) => (
                    <option value={item.id}>{item.branch_name}</option>
                  ))}
                </select>
                {formik.errors.u_br_id && formik.touched.u_br_id ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.u_br_id}
                  </div>
                ) : null}
              </div>

              <div>
                <label
                  for="u_pass"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Password
                </label>
                <input
                  type="password"
                  name="u_pass"
                  id="u_pass"
                  value={formik.values.u_pass}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Type Password"
                  required=""
                />
                {formik.errors.u_pass && formik.touched.u_pass ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.u_pass}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="reset"
                onClick={formik.handleReset}
                className="inline-flex mr-3 bg-white items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-blue-900 border border-blue-900 bg-primary-700 rounded-full focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
                Reset
              </button>
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

export default AddUser;
