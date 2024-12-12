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

function ManageItemsEdit() {
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
  const [categories, setCategories] = useState(() => []);
  const [units, setUnits] = useState(() => []);

  var comp, userId;

  useEffect(() => {
    if (params?.id > 0)
      callApi(
        `/admin/S_Admin/one_item_detail?comp_id=${params?.id2}&item_id=${params?.id}`,
        0
      );
  }, [isCalled]);

  useEffect(() => {
    axios
      .get(
        `${url}/admin/S_Admin/select_category?comp_id=${params?.id2}&catg_id=0`
      )
      .then((res) => {
        setCategories(res?.data?.msg);
        console.log(res);
      })
      .catch((err) => {
        Message("error", err);
      });
  }, [isCalled]);

  useEffect(() => {
    axios
      .get(
        `${url}/admin/S_Admin/select_unit?comp_id=${params?.id2}&unit_id=${0}`
      )
      .then((res) => {
        setUnits(res?.data?.msg);
        console.log(res);
      })
      .catch((err) => {
        Message("error", err);
      });
    // if (params?.id > 0)
    //   callApi(`/admin/S_Admin/select_unit?comp_id=${params?.id2}&unit_id=0`, 0);
  }, [isCalled]);

  // useEffect(() => {
  //   // callApi(`/admin/S_Admin/select_location`, 0);
  //   axios
  //     .get(`${url}/admin/S_Admin/select_shop?id=0`)
  //     .then((res) => {
  //       setShops(res?.data?.msg);
  //       console.log(res);
  //     })
  //     .catch((err) => {
  //       Message("error", err);
  //     });
  // }, []);

  useEffect(() => {
    // console.log(response, Array.isArray(response?.data?.msg));
    if (Array.isArray(response?.data?.msg)) {
      console.log(response);
      const rsp = {
        // sup_comp_id: +response?.data?.msg[0]?.comp_id,
        // sup_item_id: +params?.id,
        sup_item_name: response?.data?.msg[0]?.item_name,
        sup_catg_id: +response?.data?.msg[0]?.catg_id,
        sup_unit_id: +response?.data?.msg[0]?.unit_id,
        sup_hsn_code: response?.data?.msg[0]?.hsn_code,
        sup_bar_code: response?.data?.msg[0]?.bar_code,
        sup_price: +response?.data?.msg[0]?.price,
        sup_discount: +response?.data?.msg[0]?.discount,
        sup_cgst: +response?.data?.msg[0]?.cgst,
        sup_sgst: +response?.data?.msg[0]?.sgst,
        // sup_created_by: response?.data?.msg[0]?.created_by,
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
          navigation("/home/superadmin/manageitems/view");
        }, 3500);
      }
    }
  }, [response]);

  const initialValues = {
    // sup_comp_id: "",
    // sup_item_id: +params?.id,
    sup_item_name: "",
    sup_catg_id: "",
    sup_unit_id: "",
    sup_bar_code: "",
    sup_hsn_code: "",
    sup_price: "",
    sup_discount: "",
    sup_cgst: "",
    sup_sgst: "",
    // sup_created_by: "",
  };

  const onSubmit = (values) => {
    setCalled(true);
    console.log(values, params.id);
    // comp = localStorage.getItem("comp_id");
    userId = localStorage.getItem("user_id");
    callApi("/admin/S_Admin/edit_item_dtls", 1, {
      comp_id: +params?.id2,
      item_id: +params?.id,
      item_name: values?.sup_item_name,
      catg_id: +values?.sup_catg_id,
      // unit_id: +params?.id3,
      unit_id: +values?.sup_unit_id,
      hsn_code: values?.sup_hsn_code,
      bar_code: values?.sup_bar_code,
      price: +values?.sup_price,
      discount: +values?.sup_discount,
      cgst: +values?.sup_cgst,
      sgst: +values?.sup_sgst,
      created_by: userId,
    });
  };

  const validationSchema = Yup.object({
    sup_item_name: Yup.string().required("Item name is required."),
    sup_catg_id: Yup.string().required("Category is required."),
    sup_unit_id: Yup.string().required("Unit is required."),
    sup_bar_code: Yup.string().required("Barcode is required."),
    sup_hsn_code: Yup.string().required("HSN Code is required."),
    sup_price: Yup.string().required("Price is required."),
    sup_discount: Yup.string().required("Discount is required."),
    sup_cgst: Yup.string().required("CGST is required."),
    sup_sgst: Yup.string().required("SGST is required."),
    // sup_created_by: Yup.string().required("Item name is required."),
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
            Edit Item
          </h2>
          <form onSubmit={formik.handleSubmit}>
            <div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div class="sm:col-span-2">
                <label
                  for="sup_item_name"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Item Name
                </label>
                <input
                  type="text"
                  name="sup_item_name"
                  id="sup_item_name"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.sup_item_name}
                  placeholder="Item Name"
                  required=""
                />
                {formik.errors.sup_item_name && formik.touched.sup_item_name ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.sup_item_name}
                  </div>
                ) : null}
              </div>
              <div class="w-full">
                <label
                  for="sup_hsn_code"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  HSN Code
                </label>
                <input
                  type="text"
                  name="sup_hsn_code"
                  id="sup_hsn_code"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.sup_hsn_code}
                  placeholder="HSN Code"
                  required=""
                />
                {formik.errors.sup_hsn_code && formik.touched.sup_hsn_code ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.sup_hsn_code}
                  </div>
                ) : null}
              </div>

              <div>
                <label
                  for="sup_unit_id"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Unit
                </label>
                <select
                  id="sup_unit_id"
                  name="sup_unit_id"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.sup_unit_id}>
                  <option selected="">Select Unit</option>
                  {units?.map((item, i) => (
                    <option key={i} value={item?.sl_no}>
                      {item?.unit_name}
                    </option>
                  ))}
                  {/* <option value="Y">Yes</option>
                  <option value="N">No</option> */}
                </select>
                {formik.errors.sup_unit_id && formik.touched.sup_unit_id ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.sup_unit_id}
                  </div>
                ) : null}
              </div>

              <div>
                <label
                  for="sup_catg_id"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Category
                </label>
                <select
                  id="sup_catg_id"
                  name="sup_catg_id"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.sup_catg_id}>
                  <option selected="">Select Category</option>
                  {categories?.map((item, i) => (
                    <option key={i} value={item?.sl_no}>
                      {item?.category_name}
                    </option>
                  ))}
                  {/* <option value="Y">Yes</option>
                  <option value="N">No</option> */}
                </select>
                {formik.errors.sup_catg_id && formik.touched.sup_catg_id ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.sup_catg_id}
                  </div>
                ) : null}
              </div>

              <div class="w-full">
                <label
                  for="sup_bar_code"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Bar Code
                </label>
                <input
                  type="text"
                  name="sup_bar_code"
                  id="sup_bar_code"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.sup_bar_code}
                  placeholder="Bar Code"
                  required=""
                />
                {formik.errors.sup_bar_code && formik.touched.sup_bar_code ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.sup_bar_code}
                  </div>
                ) : null}
              </div>

              <div class="w-full">
                <label
                  for="sup_price"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Price
                </label>
                <input
                  type="number"
                  name="sup_price"
                  id="sup_price"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.sup_price}
                  placeholder="100/-"
                  required=""
                />
                {formik.errors.sup_price && formik.touched.sup_price ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.sup_price}
                  </div>
                ) : null}
              </div>
              <div class="w-full">
                <label
                  for="sup_discount"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Discount
                </label>
                <input
                  type="number"
                  name="sup_discount"
                  id="sup_discount"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.sup_discount}
                  placeholder="100/-"
                  required=""
                />
                {formik.errors.sup_discount && formik.touched.sup_discount ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.sup_discount}
                  </div>
                ) : null}
              </div>
              <div class="w-full">
                <label
                  for="sup_cgst"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  CGST
                </label>
                <input
                  type="number"
                  name="sup_cgst"
                  id="sup_cgst"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.sup_cgst}
                  placeholder="%"
                  required=""
                />
                {formik.errors.sup_cgst && formik.touched.sup_cgst ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.sup_cgst}
                  </div>
                ) : null}
              </div>
              <div class="w-full">
                <label
                  for="sup_sgst"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  SGST
                </label>
                <input
                  type="number"
                  name="sup_sgst"
                  id="sup_sgst"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.sup_sgst}
                  placeholder="%"
                  required=""
                />
                {formik.errors.sup_sgst && formik.touched.sup_sgst ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.sup_sgst}
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

export default ManageItemsEdit;
