import React, { useContext, useEffect, useState } from "react";
import "./ReportForm.css";
import * as Yup from "yup";
import { useFormik } from "formik";
import axios from "axios";
import { url } from "../Address/baseURL";
import moment from "moment";

function ReportForm({ title, onPress, flag, outlet }) {
  console.log(url);
  const [d, setD] = useState([]);
  const initialValues = {
    from_dt: flag === 777 ? moment(new Date()).format("YYYY-MM-DD") : "",
    to_dt: "",
    outlet: "",
    userlist: "",
    paymentmode: "",
    item_lst: "",
  };
  const onSubmit = (values) => {
    console.log(values);
    onPress(values);
  };
  const validationSchema = Yup.object({
    from_dt: Yup.string().required("From date is required"),
    to_dt: Yup.string().required("To date is required"),
    outlet: Yup.string().required("Outlet is required"),
  });
  const validationSchemaUser = Yup.object({
    from_dt: Yup.string().required("From date is required"),
    to_dt: Yup.string().required("To date is required"),
    outlet: Yup.string().required("Outlet is required"),
    userlist: Yup.string().required("User name is required"),
  });
  const validationSchemaUserOutlet = Yup.object({
    from_dt: Yup.string().required("From date is required"),
    to_dt: Yup.string().required("To date is required"),
    userlist: Yup.string().required("User name is required"),
  });
  const validationSchemaDueOutlet = Yup.object({
    from_dt: Yup.string().required("From date is required"),
    userlist: Yup.string().required("User name is required"),
  });
  const validationSchemaPay = Yup.object({
    from_dt: Yup.string().required("From date is required"),
    to_dt: Yup.string().required("To date is required"),
    outlet: Yup.string().required("Outlet is required"),
    paymentmode: Yup.string().required("Pay mode is required"),
  });
  const validationSchemaItem = Yup.object({
    from_dt: Yup.string().required("From date is required"),
    to_dt: Yup.string().required("To date is required"),
    outlet: Yup.string().required("Outlet is required"),
    item_lst: Yup.string().required("Item is required"),
  });
  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema:
      flag == 1
        ? validationSchemaUser
        : flag == 2
        ? validationSchemaPay
        : flag == 3
        ? validationSchemaItem
        : flag == 666
        ? validationSchemaUserOutlet
        : flag == 777
        ? validationSchemaDueOutlet
        : validationSchema,

    validateOnMount: true,
  });
  const handleChangeWithAPI = async (event) => {
    formik.handleChange(event);

    const { name, value } = event.target;

    if (name === "outlet" && flag == 1) {
      console.log(event.target.value);
      // axios.post('http://192.168.1.238:3005/admin/user_list',{comp_id:localStorage.getItem('comp_id'),br_id:+event.target.value}).then(response=>{console.log(response); setD(response?.data?.msg); console.log(d)})
      axios
        .post(url + "/admin/user_list", {
          comp_id: localStorage.getItem("comp_id"),
          br_id: +event.target.value,
        })
        .then((response) => {
          console.log(response);
          setD(response?.data?.msg);
          console.log(d);
        });
    }
    if (name === "outlet" && flag == 3) {
      console.log(event.target.value);
      //   axios.post('http://192.168.1.238:3005/admin/user_list',{comp_id:localStorage.getItem('comp_id'),br_id:+event.target.value}).then(response=>{console.log(response); setD(response?.data?.msg); console.log(d)})
      //   axios.post('http://202.21.38.178:3005/admin/item_list',{comp_id:localStorage.getItem('comp_id'),br_id:+event.target.value}).then(response=>{console.log(response); setD(response?.data?.msg); console.log(d)})
      axios
        .post(url + "/admin/item_list", {
          comp_id: localStorage.getItem("comp_id"),
          br_id: +event.target.value,
        })
        .then((response) => {
          console.log(response);
          setD(response?.data?.msg);
          console.log(d);
        });
    }
  };

  useEffect(() => {
    if (flag === 666) {
      axios
        .post(url + "/admin/S_Admin/user_list", {
          comp_id: localStorage.getItem("comp_id"),
          br_id: localStorage.getItem("br_id"),
        })
        .then((response) => {
          console.log(response);
          setD(response?.data?.msg);
          console.log(d);
        });
    }

    if (flag === 777) {
      axios
        .post(url + "/admin/S_Admin/user_list", {
          comp_id: localStorage.getItem("comp_id"),
          br_id: localStorage.getItem("br_id"),
        })
        .then((response) => {
          console.log(response);
          setD(response?.data?.msg);
          console.log(d);
        });
    }
  }, []);

  return (
    <section className="glassmorphicReport bg-white bg-opacity-65 bg-blend-luminosity dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2 className="mb-4 text-xl font-bold text-blue-900 dark:text-white">
          {title}
        </h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div className={flag == 777 ? "sm:col-span-2" : "w-full"}>
              <label
                htmlFor="brand"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                From
              </label>
              <input
                type="date"
                name="from_dt"
                id="from_dt"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                value={formik.values.from_dt}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Product brand"
                required=""
                disabled={flag === 777}
              />
              {formik.errors.from_dt && formik.touched.from_dt ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.from_dt}
                </div>
              ) : null}
            </div>
            {flag !== 777 && (
              <div className="w-full">
                <label
                  htmlFor="price"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  To
                </label>
                <input
                  type="date"
                  name="to_dt"
                  id="to_dt"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="$2999"
                  value={formik.values.to_dt}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  required=""
                />
                {formik.errors.to_dt && formik.touched.to_dt ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.to_dt}
                  </div>
                ) : null}
              </div>
            )}
            {flag !== 666 && flag !== 777 && (
              <div className={flag == 0 ? "sm:col-span-2" : "w-full"}>
                <label
                  htmlFor="outlet"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Outlet
                </label>
                <select
                  id="outlet"
                  value={formik.values.outlet}
                  onChange={handleChangeWithAPI}
                  name="outlet"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onBlur={formik.handleBlur}>
                  <option selected>Select outlet</option>
                  <option value="0">All outlets</option>
                  {outlet?.map((item, i) => (
                    <option key={i} value={item?.id}>
                      {item?.branch_name}
                    </option>
                  ))}
                </select>
                {formik.errors.outlet && formik.touched.outlet ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.outlet}
                  </div>
                ) : null}
              </div>
            )}
            {(flag === 666 || flag === 777) && (
              <div className="sm:col-span-2">
                <label
                  htmlFor="userlist"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  User List
                </label>
                <select
                  id="userlist"
                  value={formik.values.userlist}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="userlist"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                  <option selected="">Select user</option>
                  {d?.map((item) => (
                    <option value={item?.user_id}>{item?.user_name}</option>
                  ))}
                </select>
                {formik.errors.userlist &&
                formik.touched.userlist &&
                flag == 1 ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.userlist}
                  </div>
                ) : null}
              </div>
            )}
            {flag == 1 && (
              <div className="w-full">
                <label
                  htmlFor="userlist"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  User List
                </label>
                <select
                  id="userlist"
                  value={formik.values.userlist}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="userlist"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                  <option selected="">Select user</option>
                  {d?.map((item) => (
                    <option value={item?.user_id}>{item?.user_name}</option>
                  ))}
                </select>
                {formik.errors.userlist &&
                formik.touched.userlist &&
                flag == 1 ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.userlist}
                  </div>
                ) : null}
              </div>
            )}
            {flag == 2 && (
              <div className="w-full">
                <label
                  htmlFor="outlet"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Pay mode{" "}
                </label>
                <select
                  id="paymentmode"
                  value={formik.values.paymentmode}
                  onChange={formik.handleChange}
                  name="paymentmode"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                  <option selected="">Select mode</option>
                  <option value="U">UPI</option>
                  <option value="C">Cash</option>
                  <option value="D">Card</option>
                  <option value="R">Credit</option>
                </select>
                {formik.errors.paymentmode &&
                formik.touched.paymentmode &&
                flag == 2 ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.paymentmode}
                  </div>
                ) : null}
              </div>
            )}
            {flag == 3 && (
              <div className="w-full">
                <label
                  htmlFor="outlet"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Item{" "}
                </label>
                <select
                  id="item_lst"
                  value={formik.values.item_lst}
                  onChange={formik.handleChange}
                  name="item_lst"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                  <option selected="">Select item</option>
                  {d?.map((item) => (
                    <option value={item?.id}>{item?.item_name}</option>
                  ))}
                </select>
                {formik.errors.item_lst &&
                formik.touched.item_lst &&
                flag == 3 ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.item_lst}
                  </div>
                ) : null}
              </div>
            )}
          </div>
          <div className="flex justify-center">
            <button
              type="reset"
              onClick={formik.handleReset}
              className="inline-flex mr-3 bg-white items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-blue-900 border border-blue-900 bg-primary-700 rounded-full focus:ring-0 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800 hover:scale-105 active:scale-95 transition-all duration-200">
              Reset
            </button>
            <button
              type="submit"
              className="inline-flex bg-blue-900 items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-full focus:ring-0 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800 hover:scale-105 active:scale-95 transition-all duration-200">
              Submit
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default ReportForm;
