import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import * as Yup from "yup";
import { useFormik } from "formik";
import useAPI from "../../../Hooks/useApi";
import { Message } from "../../../Components/Message";
import { DurationMessage } from "../../../Components/DurationMessage";
import axios from "axios";
import { url } from "../../../Address/baseURL";
import Backbtn from "../../../Components/Backbtn";

function ManageOutletsAddEdit() {
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
  const [locations, setLocations] = useState(() => []);

  var comp, userId;

  //   useEffect(() => {
  //     console.log(params);
  //     comp = localStorage.getItem("comp_id");
  //     if (params.id > 0)
  //       callApi(`/admin/S_Admin/select_outlet?comp_id=${params.id}`, 0);
  //     // setDataSet(response?.data?.msg)
  //   }, [isCalled]);

  useEffect(() => {
    if (params.id > 0)
      callApi(
        `/admin/S_Admin/select_one_outlet?comp_id=${params.id2}&br_id=${params.id}`,
        0
      );

    localStorage.setItem("compIdx", `${params.id2}`);
  }, [isCalled]);

  useEffect(() => {
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
        // "br_id": 0,
        o_comp_id: +response?.data?.msg[0].comp_id,
        o_branch_name: response?.data?.msg[0]?.branch_name,
        o_branch_address: response?.data?.msg[0]?.branch_address,
        o_location: response?.data?.msg[0]?.location,
        o_contact_person: response?.data?.msg[0]?.contact_person,
        o_phone_no: +response?.data?.msg[0]?.phone_no,
        o_email_id: response?.data?.msg[0]?.email_id,
        o_created_by: response?.data?.msg[0]?.created_by,
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
          navigation("/home/superadmin/manageoutlets/view");
        }, 4500);
      }
    }
  }, [response]);

  const initialValues = {
    // "br_id": 0,
    o_comp_id: "",
    o_branch_name: "",
    o_branch_address: "",
    o_location: "",
    o_contact_person: "",
    o_phone_no: "",
    o_email_id: "",
    o_created_by: "",
  };

  const onSubmit = (values) => {
    setCalled(true);
    console.log(values, params.id);
    // comp = localStorage.getItem("comp_id");
    userId = localStorage.getItem("user_id");
    callApi("/admin/S_Admin/add_edit_outlet", 1, {
      //   id: +params.id,
      //   comp_id: +values?.u_comp_id,
      //   br_id: +values?.u_br_id,
      //   user_name: values?.u_user_name,
      //   user_type: values?.u_user_type,
      //   user_id: values?.u_user_id,
      //   phone_no: +values?.u_phone_no,
      //   email_id: values?.u_email_id,
      //   password: values?.u_password,
      //   active_flag: values?.u_active_flag,
      //   login_flag: values?.u_login_flag,
      //   created_by: userId,

      br_id: +params.id,
      comp_id: +values?.o_comp_id,
      branch_name: values?.o_branch_name,
      branch_address: values?.o_branch_address,
      location: +values?.o_location,
      contact_person: values?.o_email_id,
      phone_no: +values?.o_phone_no,
      email_id: values?.o_email_id,
      created_by: userId,
    });
  };

  const validationSchema = Yup.object({
    // u_br_id: Yup.string().required("Outlet is required."),
    o_comp_id: Yup.string().required("Company is required."),
    o_branch_name: Yup.string().required("Outlet name is required."),
    // o_branch_address: Yup.string().required("Outlet address is required."),
    // o_location: Yup.string().required("Location is required."),
    // o_contact_person: Yup.string().required("Contact person is required."),
    // o_phone_no: Yup.string().required("Phone no. is required."),
    // o_email_id: Yup.string().required("Email is required."),
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

  //   useEffect(() => {
  //     console.log(formik.values.u_comp_id);
  //     axios
  //       .get(
  //         `${url}/admin/S_Admin/select_outlet?comp_id=${
  //           formik.values.o_comp_id || 0
  //         }`
  //       )
  //       .then((res) => {
  //         setOutlets(res?.data?.msg);
  //         console.log(res);
  //       })
  //       .catch((err) => {
  //         Message("error", err);
  //       });
  //   }, [formik.values.o_comp_id]);

  return (
    <>
      <Backbtn />

      <section class="bg-white dark:bg-gray-900">
        <div class="py-8 px-4 mx-auto max-w-2xl lg:py-16">
          <h2 class="mb-4 text-xl font-bold text-blue-900 dark:text-white">
            {params.id == 0 ? "Add Outlet" : "Update outlet"}
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
                  id="o_comp_id"
                  name="o_comp_id"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.o_comp_id}>
                  <option selected="">Select Shop</option>

                  {shops?.map((items, i) => (
                    <option key={i} value={items?.id}>
                      {items?.company_name}
                    </option>
                  ))}
                </select>
                {formik.errors.o_comp_id && formik.touched.o_comp_id ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.o_comp_id}
                  </div>
                ) : null}
              </div>
              <div class="w-full">
                <label
                  for="o_branch_name"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Outlet Name
                </label>
                <input
                  type="text"
                  name="o_branch_name"
                  id="o_branch_name"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.o_branch_name}
                  placeholder="Enter Outlet Name"
                  required=""
                />
                {formik.errors.o_branch_name && formik.touched.o_branch_name ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.o_branch_name}
                  </div>
                ) : null}
              </div>
              <div class="sm:col-span-2">
                <label
                  for="o_branch_address"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Outlet address
                </label>
                <textarea
                  id="o_branch_address"
                  name="o_branch_address"
                  value={formik.values.o_branch_address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  rows="8"
                  class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Your outlet address here"
                />

                {formik.errors.o_branch_address &&
                formik.touched.o_branch_address ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.o_branch_address}
                  </div>
                ) : null}
              </div>
              <div>
                <label
                  for="o_location"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Location
                </label>
                <select
                  id="o_location"
                  name="o_location"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.o_location}>
                  <option selected="">Select Location</option>
                  {locations?.map((item, i) => (
                    <option key={i} value={item?.sl_no}>
                      {item?.location_name}
                    </option>
                  ))}
                  {/* <option value="Y">Yes</option>
                  <option value="N">No</option> */}
                </select>
                {formik.errors.o_location && formik.touched.o_location ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.o_location}
                  </div>
                ) : null}
              </div>
              <div class="w-full">
                <label
                  for="o_contact_person"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Contact Person
                </label>
                <input
                  type="text"
                  name="o_contact_person"
                  id="o_contact_person"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.o_contact_person}
                  placeholder="Contact Person Name"
                  required=""
                />
                {formik.errors.o_contact_person &&
                formik.touched.o_contact_person ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.o_contact_person}
                  </div>
                ) : null}
              </div>
              <div class="w-full">
                <label
                  for="o_phone_no"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Phone Number
                </label>
                <input
                  type="number"
                  name="o_phone_no"
                  id="o_phone_no"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.o_phone_no}
                  placeholder="98500XXXXX"
                  required=""
                />
                {formik.errors.o_phone_no && formik.touched.o_phone_no ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.o_phone_no}
                  </div>
                ) : null}
              </div>
              <div class="w-full">
                <label
                  for="o_email_id"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Email
                </label>
                <input
                  type="email"
                  name="o_email_id"
                  id="o_email_id"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.o_email_id}
                  placeholder="abc@def.com"
                  required=""
                />
                {formik.errors.o_email_id && formik.touched.o_email_id ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.o_email_id}
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

export default ManageOutletsAddEdit;
