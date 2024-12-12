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

function ManageHeaderFooterAddEdit() {
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

  var comp, userId;

  useEffect(() => {
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
    if (params.id > 0)
      callApi(`/admin/S_Admin/select_header_footer?comp_id=${params.id}`, 0);
  }, [isCalled]);

  useEffect(() => {
    userId = localStorage.getItem("user_id");
    // console.log(response, Array.isArray(response?.data?.msg));
    if (Array.isArray(response?.data?.msg)) {
      console.log(response);
      const rsp = {
        m_comp_id: +response?.data?.msg[0].comp_id,
        m_header1: response?.data?.msg[0].header1,
        m_on_off_flag1: response?.data?.msg[0].on_off_flag1,
        m_header2: response?.data?.msg[0].header2,
        m_on_off_flag2: response?.data?.msg[0].on_off_flag2,
        m_footer1: response?.data?.msg[0].footer1,
        m_on_off_flag3: response?.data?.msg[0].on_off_flag3,
        m_footer2: response?.data?.msg[0].footer2,
        m_on_off_flag4: response?.data?.msg[0].on_off_flag4,
        m_created_by: userId,
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
          navigation("/home/superadmin/manageheaderfooters/view");
        }, 4500);
      }
    }
  }, [response]);

  const initialValues = {
    m_comp_id: "",
    m_header1: "",
    m_on_off_flag1: "N",
    m_header2: "",
    m_on_off_flag2: "N",
    m_footer1: "",
    m_on_off_flag3: "N",
    m_footer2: "",
    m_on_off_flag4: "N",
    // m_created_by: userId,
  };

  const onSubmit = (values) => {
    setCalled(true);
    console.log(values, params.comp_id);
    // comp = localStorage.getItem("comp_id");
    userId = localStorage.getItem("user_id");
    callApi("/admin/S_Admin/add_edit_header_footer", 1, {
      comp_id: values?.m_comp_id,
      header1: values?.m_header1,
      on_off_flag1: values?.m_on_off_flag1,
      header2: values?.m_header2,
      on_off_flag2: values?.m_on_off_flag2,
      footer1: values?.m_footer1,
      on_off_flag3: values?.m_on_off_flag3,
      footer2: values?.m_footer2,
      on_off_flag4: values?.m_on_off_flag4,
      created_by: userId,
    });
  };

  const validationSchema = Yup.object({
    m_comp_id: Yup.string().required("Shop is required."),
    // m_header1: Yup.string().required("Header 1 is required."),
    // m_on_off_flag1: Yup.string().required("Company is required."),
    // m_header2: Yup.string().required("Company is required."),
    // m_on_off_flag2: Yup.string().required("Company is required."),
    // m_footer1: Yup.string().required("Company is required."),
    // m_on_off_flag3: Yup.string().required("Company is required."),
    // m_footer2: Yup.string().required("Company is required."),
    // m_on_off_flag4: Yup.string().required("Company is required."),
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
            {params.id == 0 ? "Add Header/Footer" : "Update Header/Footer"}
          </h2>
          <form onSubmit={formik.handleSubmit}>
            <div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div className="sm:col-span-2">
                <label
                  for="m_comp_id"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Select Shop
                </label>
                <select
                  id="m_comp_id"
                  name="m_comp_id"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.m_comp_id}>
                  <option selected="">Select Shop</option>

                  {shops?.map((items, i) => (
                    <option key={i} value={items?.id}>
                      {items?.company_name}
                    </option>
                  ))}
                </select>
                {formik.errors.m_comp_id && formik.touched.m_comp_id ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.m_comp_id}
                  </div>
                ) : null}
              </div>
              <div class="w-full">
                <label
                  for="m_header1"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Header 1
                </label>
                <input
                  type="text"
                  name="m_header1"
                  id="m_header1"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.m_header1}
                  maxLength="25"
                  placeholder="Header 1"
                  required=""
                />
                {/* <p
                  id="helper-text-explanation"
                  class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {f1Text?.length}/25
                </p> */}
                {formik.errors.m_header1 && formik.touched.m_header1 ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.m_header1}
                  </div>
                ) : null}
              </div>
              <div>
                <label
                  for="m_on_off_flag1"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Header 1 Flag
                </label>
                <select
                  id="m_on_off_flag1"
                  name="m_on_off_flag1"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.m_on_off_flag1}>
                  {/* <option selected="">Select Header 1 Flag</option> */}
                  <option value="Y">On</option>
                  <option value="N">Off</option>
                </select>
                {formik.errors.m_on_off_flag1 &&
                formik.touched.m_on_off_flag1 ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.m_on_off_flag1}
                  </div>
                ) : null}
              </div>
              <div class="w-full">
                <label
                  for="m_header2"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Header 2
                </label>
                <input
                  type="text"
                  name="m_header2"
                  id="m_header2"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.m_header2}
                  placeholder="Header 2"
                  maxLength="25"
                  required=""
                />
                {formik.errors.m_header2 && formik.touched.m_header2 ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.m_header2}
                  </div>
                ) : null}
              </div>
              <div>
                <label
                  for="m_on_off_flag2"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Header 2 Flag
                </label>
                <select
                  id="m_on_off_flag2"
                  name="m_on_off_flag2"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.m_on_off_flag2}>
                  {/* <option selected="">Select Header 2 Flag</option> */}
                  <option value="Y">On</option>
                  <option value="N">Off</option>
                </select>
                {formik.errors.m_on_off_flag2 &&
                formik.touched.m_on_off_flag2 ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.m_on_off_flag2}
                  </div>
                ) : null}
              </div>
              <div class="w-full">
                <label
                  for="m_footer1"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Footer 1
                </label>
                <input
                  type="text"
                  name="m_footer1"
                  id="m_footer1"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.m_footer1}
                  placeholder="Footer 1"
                  maxLength="25"
                  required=""
                />
                {formik.errors.m_footer1 && formik.touched.m_footer1 ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.m_footer1}
                  </div>
                ) : null}
              </div>
              <div>
                <label
                  for="m_on_off_flag3"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Footer 1 Flag
                </label>
                <select
                  id="m_on_off_flag3"
                  name="m_on_off_flag3"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.m_on_off_flag3}>
                  {/* <option selected="">Select Footer 1 Flag</option> */}
                  <option value="Y">On</option>
                  <option value="N">Off</option>
                </select>
                {formik.errors.m_on_off_flag3 &&
                formik.touched.m_on_off_flag3 ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.m_on_off_flag3}
                  </div>
                ) : null}
              </div>
              <div class="w-full">
                <label
                  for="m_footer2"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Footer 2
                </label>
                <input
                  type="text"
                  name="m_footer2"
                  id="m_footer2"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.m_footer2}
                  placeholder="Footer 2"
                  maxLength="25"
                  required=""
                />
                {formik.errors.m_footer2 && formik.touched.m_footer2 ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.m_footer2}
                  </div>
                ) : null}
              </div>
              <div>
                <label
                  for="m_on_off_flag4"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Footer 2 Flag
                </label>
                <select
                  id="m_on_off_flag4"
                  name="m_on_off_flag4"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.m_on_off_flag4}>
                  {/* <option selected="">Select Footer 2 Flag</option> */}
                  <option value="Y">On</option>
                  <option value="N">Off</option>
                </select>
                {formik.errors.m_on_off_flag4 &&
                formik.touched.m_on_off_flag4 ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.m_on_off_flag4}
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

export default ManageHeaderFooterAddEdit;
