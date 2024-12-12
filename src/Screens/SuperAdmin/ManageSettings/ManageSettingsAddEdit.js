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

function ManageSettingsAddEdit() {
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
      callApi(`/admin/S_Admin/select_settings?comp_id=${params.id}`, 0);
  }, [isCalled]);

  useEffect(() => {
    userId = localStorage.getItem("user_id");
    // console.log(response, Array.isArray(response?.data?.msg));
    if (Array.isArray(response?.data?.msg)) {
      console.log(response);
      const rsp = {
        sm_comp_id: +response?.data?.msg[0].comp_id,
        sm_rcv_cash_flag: response?.data?.msg[0].rcv_cash_flag,
        sm_rcpt_type: response?.data?.msg[0].rcpt_type,
        sm_gst_flag: response?.data?.msg[0].gst_flag,
        sm_gst_type: response?.data?.msg[0].gst_type,
        sm_unit_flag: response?.data?.msg[0].unit_flag,
        sm_cust_inf: response?.data?.msg[0].cust_inf,
        sm_pay_mode: response?.data?.msg[0].pay_mode,
        sm_discount_flag: response?.data?.msg[0].discount_flag,
        sm_stock_flag: response?.data?.msg[0].stock_flag,
        sm_discount_type: response?.data?.msg[0].discount_type,
        sm_discount_position: response?.data?.msg[0].discount_position,
        sm_price_type: response?.data?.msg[0].price_type,
        sm_refund_days: +response?.data?.msg[0].refund_days,
        sm_kot_flag: response?.data?.msg[0].kot_flag,
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
          navigation("/home/superadmin/managesettings/view");
        }, 3500);
      }
    }
  }, [response]);

  const initialValues = {
    sm_comp_id: "",
    sm_rcv_cash_flag: "",
    sm_rcpt_type: "",
    sm_gst_flag: "",
    sm_gst_type: "",
    sm_unit_flag: "",
    sm_cust_inf: "",
    sm_pay_mode: "",
    sm_discount_flag: "",
    sm_stock_flag: "",
    sm_discount_type: "",
    sm_discount_position: "",
    sm_price_type: "",
    sm_refund_days: "",
    sm_kot_flag: "",
  };

  const onSubmit = (values) => {
    setCalled(true);
    console.log(values, params.comp_id);
    // comp = localStorage.getItem("comp_id");
    userId = localStorage.getItem("user_id");
    callApi("/admin/S_Admin/add_edit_settings", 1, {
      comp_id: +values?.sm_comp_id,
      rcv_cash_flag: values?.sm_rcv_cash_flag,
      rcpt_type: values?.sm_rcpt_type,
      gst_flag: values?.sm_gst_flag,
      gst_type: values?.sm_gst_type,
      unit_flag: values?.sm_unit_flag,
      cust_inf: values?.sm_cust_inf,
      pay_mode: values?.sm_pay_mode,
      discount_flag: values?.sm_discount_flag,
      stock_flag: values?.sm_stock_flag,
      discount_type: values?.sm_discount_type,
      discount_position: values?.sm_discount_position,
      price_type: values?.sm_price_type,
      refund_days: +values?.sm_refund_days,
      kot_flag: values?.sm_kot_flag,
      created_by: userId,
    });
  };

  const validationSchema = Yup.object({
    sm_comp_id: Yup.number().required("Company is required."),
    sm_rcv_cash_flag: Yup.string().required("Received cash flag is required."),
    sm_rcpt_type: Yup.string().required("Receipt type is required."),
    sm_gst_flag: Yup.string().required("GST Flag is required."),
    sm_gst_type: Yup.string().required("GST Type is required."),
    sm_unit_flag: Yup.string().required("Unit Flag is required."),
    sm_cust_inf: Yup.string().required("Customer Info is required."),
    sm_pay_mode: Yup.string().required("Pay mode is required."),
    sm_discount_flag: Yup.string().required("Discount is required."),
    sm_stock_flag: Yup.string().required("Stock Flag is required."),
    sm_discount_type: Yup.string().required("Discount type is required."),
    sm_discount_position: Yup.string().required(
      "Discount position is required."
    ),
    sm_price_type: Yup.string().required("Price type is required."),
    sm_refund_days: Yup.number().required("Refund days is required."),
    sm_kot_flag: Yup.string().required("KOT Flag is required."),
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
            {params.id == 0 ? "Add Settings" : "Update Settings"}
          </h2>
          <form onSubmit={formik.handleSubmit}>
            <div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div className="sm:col-span-2">
                <label
                  for="sm_comp_id"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Select Shop
                </label>
                <select
                  id="sm_comp_id"
                  name="sm_comp_id"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.sm_comp_id}>
                  <option selected="">Select Shop</option>

                  {shops?.map((items, i) => (
                    <option key={i} value={items?.id}>
                      {items?.company_name}
                    </option>
                  ))}
                </select>
                {formik.errors.sm_comp_id && formik.touched.sm_comp_id ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.sm_comp_id}
                  </div>
                ) : null}
              </div>
              <div>
                <label
                  for="sm_rcv_cash_flag"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Received Cash Flag
                </label>
                <select
                  id="sm_rcv_cash_flag"
                  name="sm_rcv_cash_flag"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.sm_rcv_cash_flag}>
                  <option selected="">Select Received Cash Flag</option>
                  <option value="Y">On</option>
                  <option value="N">Off</option>
                </select>
                {formik.errors.sm_rcv_cash_flag &&
                formik.touched.sm_rcv_cash_flag ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.sm_rcv_cash_flag}
                  </div>
                ) : null}
              </div>
              <div>
                <label
                  for="sm_rcpt_type"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Receipt Type
                </label>
                <select
                  id="sm_rcpt_type"
                  name="sm_rcpt_type"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.sm_rcpt_type}>
                  <option selected="">Select Receipt Type</option>
                  <option value="P">Print</option>
                  <option value="S">SMS</option>
                  <option value="B">Both</option>
                </select>
                {formik.errors.sm_rcpt_type && formik.touched.sm_rcpt_type ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.sm_rcpt_type}
                  </div>
                ) : null}
              </div>
              <div>
                <label
                  for="sm_gst_flag"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  GST Flag
                </label>
                <select
                  id="sm_gst_flag"
                  name="sm_gst_flag"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.sm_gst_flag}>
                  <option selected="">Select GST Flag</option>
                  <option value="Y">On</option>
                  <option value="N">Off</option>
                </select>
                {formik.errors.sm_gst_flag && formik.touched.sm_gst_flag ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.sm_gst_flag}
                  </div>
                ) : null}
              </div>
              <div>
                <label
                  for="sm_gst_type"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  GST Type
                </label>
                <select
                  id="sm_gst_type"
                  name="sm_gst_type"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.sm_gst_type}>
                  <option selected="">Select GST Type</option>
                  <option value="I">Inclusive</option>
                  <option value="E">Exclusive</option>
                </select>
                {formik.errors.sm_gst_type && formik.touched.sm_gst_type ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.sm_gst_type}
                  </div>
                ) : null}
              </div>
              <div>
                <label
                  for="sm_unit_flag"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Unit Flag
                </label>
                <select
                  id="sm_unit_flag"
                  name="sm_unit_flag"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.sm_unit_flag}>
                  <option selected="">Select Unit Flag</option>
                  <option value="Y">On</option>
                  <option value="N">Off</option>
                </select>
                {formik.errors.sm_unit_flag && formik.touched.sm_unit_flag ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.sm_unit_flag}
                  </div>
                ) : null}
              </div>
              <div>
                <label
                  for="sm_cust_inf"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Customer Info
                </label>
                <select
                  id="sm_cust_inf"
                  name="sm_cust_inf"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.sm_cust_inf}>
                  <option selected="">Select Customer Info Flag</option>
                  <option value="Y">On</option>
                  <option value="N">Off</option>
                </select>
                {formik.errors.sm_cust_inf && formik.touched.sm_cust_inf ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.sm_cust_inf}
                  </div>
                ) : null}
              </div>
              <div>
                <label
                  for="sm_pay_mode"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Pay Mode Toggle
                </label>
                <select
                  id="sm_pay_mode"
                  name="sm_pay_mode"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.sm_pay_mode}>
                  <option selected="">Select Pay Mode</option>
                  <option value="Y">On</option>
                  <option value="N">Off</option>
                </select>
                {formik.errors.sm_pay_mode && formik.touched.sm_pay_mode ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.sm_pay_mode}
                  </div>
                ) : null}
              </div>
              <div>
                <label
                  for="sm_discount_flag"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Discount Flag
                </label>
                <select
                  id="sm_discount_flag"
                  name="sm_discount_flag"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.sm_discount_flag}>
                  <option selected="">Select Discount Flag</option>
                  <option value="Y">On</option>
                  <option value="N">Off</option>
                </select>
                {formik.errors.sm_discount_flag &&
                formik.touched.sm_discount_flag ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.sm_discount_flag}
                  </div>
                ) : null}
              </div>
              <div>
                <label
                  for="sm_stock_flag"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Stock Flag
                </label>
                <select
                  id="sm_stock_flag"
                  name="sm_stock_flag"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.sm_stock_flag}>
                  <option selected="">Select Stock Flag</option>
                  <option value="Y">On</option>
                  <option value="N">Off</option>
                </select>
                {formik.errors.sm_stock_flag && formik.touched.sm_stock_flag ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.sm_stock_flag}
                  </div>
                ) : null}
              </div>
              <div>
                <label
                  for="sm_discount_type"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Discount Type
                </label>
                <select
                  id="sm_discount_type"
                  name="sm_discount_type"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.sm_discount_type}>
                  <option selected="">Select Discount Type</option>
                  <option value="P">Percentage</option>
                  <option value="A">Amount</option>
                </select>
                {formik.errors.sm_discount_type &&
                formik.touched.sm_discount_type ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.sm_discount_type}
                  </div>
                ) : null}
              </div>
              <div>
                <label
                  for="sm_discount_position"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Discount Position
                </label>
                <select
                  id="sm_discount_position"
                  name="sm_discount_position"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.sm_discount_position}>
                  <option selected="">Select Discount Type</option>
                  <option value="I">Itemwise</option>
                  <option value="B">Billwise</option>
                </select>
                {formik.errors.sm_discount_position &&
                formik.touched.sm_discount_position ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.sm_discount_position}
                  </div>
                ) : null}
              </div>
              <div>
                <label
                  for="sm_price_type"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Price Type
                </label>
                <select
                  id="sm_price_type"
                  name="sm_price_type"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.sm_price_type}>
                  <option selected="">Select Price Type</option>
                  <option value="A">Auto</option>
                  <option value="M">Manual</option>
                </select>
                {formik.errors.sm_price_type && formik.touched.sm_price_type ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.sm_price_type}
                  </div>
                ) : null}
              </div>
              <div>
                <label
                  for="kot_flag"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  KOT Flag
                </label>
                <select
                  id="sm_kot_flag"
                  name="sm_kot_flag"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.sm_kot_flag}>
                  <option selected="">Select KOT Flag</option>
                  <option value="Y">On</option>
                  <option value="N">Off</option>
                </select>
                {formik.errors.sm_kot_flag && formik.touched.sm_kot_flag ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.sm_kot_flag}
                  </div>
                ) : null}
              </div>
              <div>
                <label
                  for="sm_refund_days"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Refund Days
                </label>
                <input
                  type="number"
                  name="sm_refund_days"
                  id="sm_refund_days"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.sm_refund_days}
                  placeholder="Refund Days"
                  required=""
                />
                {formik.errors.sm_refund_days &&
                formik.touched.sm_refund_days ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.sm_refund_days}
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

export default ManageSettingsAddEdit;
