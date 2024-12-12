import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import * as Yup from "yup";
import { useFormik } from "formik";
import useAPI from "../../../Hooks/useApi";
import { Message } from "@mui/icons-material";
import axios from "axios";
import { DurationMessage } from "../../../Components/DurationMessage";
import { useNavigate } from "react-router-dom";
import Backbtn from "../../../Components/Backbtn";
import { url } from "../../../Address/baseURL";

function OutletAddEdit() {
  const params = useParams();
  const { response, callApi } = useAPI();
  const navigation = useNavigate();
  const [isCalled, setCalled] = useState(false);
  const [dataSet, setDataSet] = useState();
  const [category, setCat] = useState();
  var comp;

  useEffect(() => {
    console.log(params);
    comp = localStorage.getItem("comp_id");
    if (params.id > 0)
      callApi("/admin/outlet_details", 1, {
        comp_id: +comp,
        br_id: +params.id,
      });
    // setDataSet(response?.data?.msg)
  }, [isCalled]);
  useEffect(() => {
    console.log(response, Array.isArray(response?.data?.msg));
    if (Array.isArray(response?.data?.msg)) {
      console.log(response);
      const rsp = {
        o_name: response?.data?.msg[0].branch_name,
        o_contact: response?.data?.msg[0].contact_person,
        o_email: response?.data?.msg[0].email_id,
        o_address: response?.data?.msg[0].branch_address,
        o_phone: response?.data?.msg[0].phone_no,
      };
      setValues(rsp);
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
          navigation("/home/manage/outlet/view");
        }, 4500);
      }
    }
  }, [response]);
  const initialValues = {
    o_name: "",
    o_phone: "",
    o_address: "",
    o_contact: "",
    o_email: "",
  };

  const onSubmit = (values) => {
    setCalled(true);
    console.log(values, params.id);
    comp = localStorage.getItem("comp_id");
    callApi("/admin/add_edit_outlet", 1, {
      comp_id: +comp,
      br_id: +params.id,
      branch_name: values.o_name,
      branch_address: values.o_address,
      location: 0,
      contact_person: values.o_contact,
      phone_no: values.o_phone,
      email_id: values.o_email || "",
      user_id: localStorage.getItem("user_id"),
    });
  };

  const validationSchema = Yup.object({
    o_name: Yup.string().required("Outlet name is required"),
    o_phone: Yup.string().required("Phone No. is required"),
    // o_email: Yup.string().optional(),
    o_contact: Yup.string().required("Contact person is required"),
    o_address: Yup.string().required("Address is required"),
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
            {" "}
            {params.id == 0 ? "Add a new outlet" : "Update outlet"}
          </h2>
          <form onSubmit={formik.handleSubmit}>
            <div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div class="w-full">
                <label
                  for="o_name"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Outlet
                </label>
                <input
                  type="text"
                  name="o_name"
                  value={formik.values.o_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  id="name"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Type outlet name"
                />
                {formik.errors.o_name && formik.touched.o_name ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.o_name}
                  </div>
                ) : null}
              </div>
              <div class="w-full">
                <label
                  for="o_contact"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Contact person
                </label>
                <input
                  type="text"
                  name="o_contact"
                  id="o_contact"
                  value={formik.values.o_contact}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Contact person"
                />
                {formik.errors.o_contact && formik.touched.o_contact ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.o_contact}
                  </div>
                ) : null}
              </div>
              <div class="sm:col-span-2">
                <label
                  for="o_phone"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Phone
                </label>
                <input
                  type="number"
                  name="o_phone"
                  id="o_phone"
                  value={formik.values.o_phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="98367XXXXX"
                  required=""
                />
                {formik.errors.o_phone && formik.touched.o_phone ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.o_phone}
                  </div>
                ) : null}
              </div>
              {/* <div class="w-full">
                <label
                  for="o_email"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Email
                </label>
                <input
                  type="email"
                  name="o_email"
                  id="o_email"
                  value={formik.values.o_email}
                  onChange={formik.handleChange}
                  disabled={params.id > 0 ? true : false}
                  onBlur={formik.handleBlur}
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="abc@gmail.com"
                  required=""
                />
                {formik.errors.o_email && formik.touched.o_email ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.o_email}
                  </div>
                ) : null}
              </div> */}
              <div class="sm:col-span-2">
                <label
                  for="o_address"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Outlet address
                </label>
                <textarea
                  id="o_address"
                  value={formik.values.o_address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  rows="8"
                  name="o_address"
                  class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Outlet address"
                />

                {formik.errors.o_address && formik.touched.o_address ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.o_address}
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

export default OutletAddEdit;
