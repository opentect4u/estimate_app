import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import * as Yup from "yup";
import { useFormik } from "formik";
import useAPI from "../../../Hooks/useApi";
import { Message } from "../../../Components/Message";
import { DurationMessage } from "../../../Components/DurationMessage";
import Backbtn from "../../../Components/Backbtn";
import axios from "axios";
import { url } from "../../../Address/baseURL";

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
  const [locations, setLocations] = useState(() => []);

  var comp, userId;

  useEffect(() => {
    console.log(params);
    comp = localStorage.getItem("comp_id");
    if (params.id > 0) callApi(`/admin/S_Admin/select_shop?id=${params.id}`, 0);
    // setDataSet(response?.data?.msg)
  }, [isCalled]);

  useEffect(() => {
    // callApi(`/admin/S_Admin/select_location`, 0);
    axios
      .get(`${url}/admin/S_Admin/select_location`)
      .then((res) => {
        setLocations(res?.data?.msg);
        console.log(res);
      })
      .catch((err) => {
        Message("error", err);
      });
  }, []);

  useEffect(() => {
    console.log(response, Array.isArray(response?.data?.msg));
    if (Array.isArray(response?.data?.msg)) {
      console.log(response);
      const rsp = {
        sh_company_name: response?.data?.msg[0].company_name,
        sh_address: response?.data?.msg[0].address,
        sh_phone_no: response?.data?.msg[0].phone_no,
        sh_email_id: response?.data?.msg[0].email_id,
        sh_active_flag: response?.data?.msg[0].active_flag,
        sh_contact_person: response?.data?.msg[0].contact_person,
        sh_max_user: response?.data?.msg[0].max_user,
        sh_web_portal: response?.data?.msg[0].web_portal,
        sh_mode: response?.data?.msg[0].mode,
        sh_location: response?.data?.msg[0].location
          ? response?.data?.msg[0].location
          : "", //etao ami korechhi ebong beshhhhhh korechhiiiiiii
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
          navigation("/home/superadmin/manageshops/view");
        }, 4500);
      }
    }
  }, [response]);

  const initialValues = {
    sh_company_name: "",
    sh_address: "",
    sh_phone_no: "",
    sh_email_id: "",
    sh_location: "",
    sh_active_flag: "",
    sh_max_user: "",
    sh_web_portal: "",
    sh_contact_person: "",
    sh_mode: "",
  };

  const onSubmit = (values) => {
    setCalled(true);
    console.log(values, params.id);
    // comp = localStorage.getItem("comp_id");
    userId = localStorage.getItem("user_id");
    callApi("/admin/S_Admin/add_edit_shop", 1, {
      id: +params.id,
      company_name: values?.sh_company_name,
      address: values?.sh_address,
      location: values?.sh_location ? +values?.sh_location : 0, //ami korechhi besh korechhi
      contact_person: values?.sh_contact_person,
      phone_no: +values?.sh_phone_no,
      email_id: values?.sh_email_id,
      // logo: "",
      web_portal: values?.sh_web_portal,
      active_flag: values?.sh_active_flag,
      max_user: +values?.sh_max_user,
      user_id: userId,
      mode: values?.sh_mode,
    });
  };

  const validationSchema = Yup.object({
    sh_company_name: Yup.string().required("Shop Name is required."),
    // sh_address: Yup.string().required("Company Address is required."),
    // sh_location: Yup.string().required("Location is required."),
    // sh_phone_no: Yup.string().required("Phone no. is required."),
    // sh_email_id: Yup.string().required("Email is required."),
    sh_active_flag: Yup.string().required("Active Flag is required."),
    sh_max_user: Yup.number().min(0).max(20).required("Max user is required."),
    sh_web_portal: Yup.string().required("Web Portal is required."),
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
            {params.id == 0 ? "Add a new shop" : "Update shop"}
          </h2>
          <form onSubmit={formik.handleSubmit}>
            <div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div className="sm:col-span-2">
                <label
                  for="sh_company_name"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Shop Name
                </label>
                <input
                  type="text"
                  name="sh_company_name"
                  id="sh_company_name"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Type shop name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.sh_company_name}
                  required=""
                />
                {formik.errors.sh_company_name &&
                formik.touched.sh_company_name ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.sh_company_name}
                  </div>
                ) : null}
              </div>
              <div>
                <label
                  for="sh_web_portal"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Web Portal
                </label>
                <select
                  id="sh_web_portal"
                  name="sh_web_portal"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.sh_web_portal}>
                  <option selected="">Select Web Portal</option>
                  <option value="Y">Yes</option>
                  <option value="N">No</option>
                </select>
                {formik.errors.sh_web_portal && formik.touched.sh_web_portal ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.sh_web_portal}
                  </div>
                ) : null}
              </div>
              <div>
                <label
                  for="sh_location"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Location
                </label>
                <select
                  id="sh_location"
                  name="sh_location"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.sh_location}>
                  <option selected="">Select Location</option>
                  {locations?.map((item, i) => (
                    <option key={i} value={item?.sl_no}>
                      {item?.location_name}
                    </option>
                  ))}
                  {/* <option value="Y">Yes</option>
                  <option value="N">No</option> */}
                </select>
                {formik.errors.sh_location && formik.touched.sh_location ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.sh_location}
                  </div>
                ) : null}
              </div>
              <div>
                <label
                  for="sh_active_flag"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Active Flag
                </label>
                <select
                  id="sh_active_flag"
                  name="sh_active_flag"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.sh_active_flag}>
                  <option selected="">Select Active Flag</option>
                  <option value="Y">Yes</option>
                  <option value="N">No</option>
                </select>
                {formik.errors.sh_active_flag &&
                formik.touched.sh_active_flag ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.sh_active_flag}
                  </div>
                ) : null}
              </div>
              <div class="w-full">
                <label
                  for="sh_email_id"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Email
                </label>
                <input
                  type="email"
                  name="sh_email_id"
                  id="sh_email_id"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.sh_email_id}
                  placeholder="abc@gmail.com"
                  required=""
                />
                {formik.errors.sh_email_id && formik.touched.sh_email_id ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.sh_email_id}
                  </div>
                ) : null}
              </div>

              <div class="w-full">
                <label
                  for="sh_phone_no"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Phone
                </label>
                <input
                  type="number"
                  name="sh_phone_no"
                  id="sh_phone_no"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.sh_phone_no}
                  placeholder="98367XXXXX"
                  required=""
                />
                {formik.errors.sh_phone_no && formik.touched.sh_phone_no ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.sh_phone_no}
                  </div>
                ) : null}
              </div>
              <div class="w-full">
                <label
                  for="sh_max_user"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Max Users
                </label>
                <input
                  type="number"
                  name="sh_max_user"
                  id="sh_max_user"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.sh_max_user}
                  placeholder="Max number of user"
                  required=""
                />
                {formik.errors.sh_max_user && formik.touched.sh_max_user ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.sh_max_user}
                  </div>
                ) : null}
              </div>
              <div class="w-full">
                <label
                  for="sh_contact_person"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Contact Person
                </label>
                <input
                  type="text"
                  name="sh_contact_person"
                  id="sh_contact_person"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.sh_contact_person}
                  placeholder="Contact Person"
                  required=""
                />
                {formik.errors.sh_contact_person &&
                formik.touched.sh_contact_person ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.sh_contact_person}
                  </div>
                ) : null}
              </div>

              <div className="w-full">
                <label
                  for="sh_mode"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Mode
                </label>
                <select
                  disabled={params.id == 0}
                  id="sh_mode"
                  name="sh_mode"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.sh_mode}>
                  {/* <option>Select Mode</option> */}
                  <option selected value="N">
                    Normal
                  </option>
                  <option value="C">Calculator</option>
                </select>
                {formik.errors.sh_mode && formik.touched.sh_mode ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.sh_mode}
                  </div>
                ) : null}
              </div>

              <div class="sm:col-span-2">
                <label
                  for="sh_address"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Address
                </label>
                <textarea
                  id="sh_address"
                  name="sh_address"
                  value={formik.values.sh_address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  rows="8"
                  class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Address here"
                />
                {formik.errors.sh_address && formik.touched.sh_address ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.sh_address}
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

export default ManageShopsAddEdit;
