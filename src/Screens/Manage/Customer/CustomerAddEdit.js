import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import * as Yup from "yup";
import { useFormik } from "formik";
import useAPI from "../../../Hooks/useApi";
import { Message } from "@mui/icons-material";
import { DurationMessage } from "../../../Components/DurationMessage";
import Backbtn from "../../../Components/Backbtn";

function CustomerAddEdit() {
  const params = useParams();
  const { response, callApi } = useAPI();
  const navigation = useNavigate();

  // const [resp,setRestp]=useState()
  const [isReport, setIsReport] = useState(false);
  const [isCalled, setCalled] = useState(false);
  const [dataSet, setDataSet] = useState();
  const [c_del, setDel] = useState("");
  const [c_bill, setBill] = useState("");

  var comp;
  useEffect(() => {
    console.log(params);
    comp = localStorage.getItem("comp_id");
    if (params.id > 0)
      callApi("/admin/customer_list", 1, {
        comp_id: +comp,
        cust_id: +params.id,
      });
    // setDataSet(response?.data?.msg)
  }, [isCalled]);
  useEffect(() => {
    console.log(response, Array.isArray(response?.data?.msg));
    if (Array.isArray(response?.data?.msg)) {
      console.log(response);
      const rsp = {
        c_name: response?.data?.msg[0].cust_name,
        c_phone: response?.data?.msg[0].phone_no,
        c_gender: response?.data?.msg[0].gender,
        c_dob: response?.data?.msg[0].date_of_birth,
        c_email: response?.data?.msg[0].email_id,
        c_paymode: response?.data?.msg[0].pay_mode,
        c_bill: response?.data?.msg[0].bill_address,
        c_del: response?.data?.msg[0].delivery_address,
      };
      setValues(rsp);
      //  setBill(response?.data?.msg[0].bill_address)
      //  setDel(response?.data?.msg[0].delivery_address)
      console.log(rsp);
    }
    // setDataSet(response?.data?.msg)
    if (response?.data?.suc == 0 || response?.data?.msg.length <= 0) {
      Message("error", "Something went wrong!");
    } else {
      if (isCalled && response?.data?.suc == 1) {
        setCalled(false);
        DurationMessage();
        setTimeout(() => {
          navigation("/home/manage/customer/view");
        }, 4500);
      }
    }
  }, [response]);
  const initialValues = {
    c_name: "",
    c_phone: "",
    c_gender: "",
    c_dob: "",
    c_email: "",
    c_paymode: "",
    c_bill: "",
    c_del: "",
  };

  const onSubmit = (values) => {
    setCalled(true);
    console.log(values, params.id);
    comp = localStorage.getItem("comp_id");
    callApi("/admin/add_edit_customer", 1, {
      comp_id: +comp,
      cust_id: +params.id,
      cust_name: values.c_name,
      phone_no: values.c_phone.toString(),
      date_of_birth: values.c_dob,
      gender: values.c_gender,
      pay_mode: values.c_paymode,
      email_id: values.c_email,
      delivery_address: values.c_del,
      bill_address: values.c_bill,
    });
  };

  const validationSchema = Yup.object({
    c_name: Yup.string().required("Name is required"),
    c_phone: Yup.string().required("Phone is required"),
    c_gender: Yup.string().required("Gender is required"),
    c_dob: Yup.string().required("DOB is required"),
    c_email: Yup.string()
      .required("Email is required")
      .email("Email format incorrect"),
    c_paymode: Yup.string().required("Pay Mode is required"),
    c_bill: Yup.string().required("Billing address is required"),
    c_del: Yup.string().required("Delivery address is required"),
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
  return (
    <>
      <Backbtn />

      <section class="bg-white dark:bg-gray-900">
        <div class="py-8 px-4 mx-auto max-w-2xl lg:py-16">
          <h2 class="mb-4 text-xl font-bold text-blue-900 dark:text-white">
            {params.id == 0 ? "Add a new customer" : "Update customer"}
          </h2>
          <form onSubmit={formik.handleSubmit}>
            <div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div class="sm:col-span-2">
                <label
                  for="c_name"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Customer name
                </label>
                <input
                  type="text"
                  name="c_name"
                  id="c_name"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Type customer name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.c_name}
                  required=""
                />
                {formik.errors.c_name && formik.touched.c_name ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.c_name}
                  </div>
                ) : null}
              </div>
              <div class="w-full">
                <label
                  for="c_dob"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  DOB
                </label>
                <input
                  type="date"
                  name="c_dob"
                  id="c_dob"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="98367XXXXX"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.c_dob}
                  required=""
                />
                {formik.errors.c_dob && formik.touched.c_dob ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.c_dob}
                  </div>
                ) : null}
              </div>
              <div>
                <label
                  for="c_gender"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Gender
                </label>
                <select
                  id="c_gender"
                  name="c_gender"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.c_gender}>
                  <option selected="">Select gender</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
                {formik.errors.c_gender && formik.touched.c_gender ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.c_gender}
                  </div>
                ) : null}
              </div>
              <div class="w-full">
                <label
                  for="c_email"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Email
                </label>
                <input
                  type="email"
                  name="c_email"
                  id="c_email"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.c_email}
                  placeholder="abc@gmail.com"
                  required=""
                />
                {formik.errors.c_email && formik.touched.c_email ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.c_email}
                  </div>
                ) : null}
              </div>

              <div class="w-full">
                <label
                  for="c_phone"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Phone
                </label>
                <input
                  type="number"
                  name="c_phone"
                  id="c_phone"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.c_phone}
                  placeholder="98367XXXXX"
                  required=""
                />
                {formik.errors.c_phone && formik.touched.c_phone ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.c_phone}
                  </div>
                ) : null}
              </div>
              <div className="sm:col-span-2">
                <label
                  for="c_paymode"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Pay mode
                </label>
                <select
                  id="c_paymode"
                  name="c_paymode"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.c_paymode}
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                  <option selected="">Select pay mode</option>
                  <option value="U">UPI</option>
                  <option value="C">Cash</option>
                  <option value="D">Card</option>
                  <option value="R">Credit</option>
                </select>
                {formik.errors.c_paymode && formik.touched.c_paymode ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.c_paymode}
                  </div>
                ) : null}
              </div>

              <div class="sm:col-span-2">
                <label
                  for="c_bill"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Billing address
                </label>
                <textarea
                  id="c_bill"
                  name="c_bill"
                  value={formik.values.c_bill}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  rows="8"
                  class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Your billing address here"
                />

                {formik.errors.c_bill && formik.touched.c_bill ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.c_bill}
                  </div>
                ) : null}
              </div>
              <div class="sm:col-span-2">
                <label
                  for="c_del"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Delivery address
                </label>
                <textarea
                  id="c_del"
                  value={formik.values.c_del}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  rows="8"
                  name="c_del"
                  class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Your delivery address here"
                />

                {formik.errors.c_del && formik.touched.c_del ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.c_del}
                  </div>
                ) : null}
              </div>
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

export default CustomerAddEdit;
