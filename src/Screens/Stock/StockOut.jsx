import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import * as Yup from "yup";
import { useFormik } from "formik";
import useAPI from "../../Hooks/useApi";
import { Message } from "../../Components/Message";
import axios from "axios";
import { DurationMessage } from "../../Components/DurationMessage";
import { useNavigate } from "react-router-dom";
import Backbtn from "../../Components/Backbtn";
import { url } from "../../Address/baseURL";

function StockOut() {
  const params = useParams();
  const { response, callApi } = useAPI();
  const navigation = useNavigate();

  const isFirstRender = useRef(true);

  // const [resp,setRestp]=useState()
  const [isReport, setIsReport] = useState(false);
  const [isCalled, setCalled] = useState(false);
  const [dataSet, setDataSet] = useState();
  const [items, setItems] = useState(() => []);
  const [outlets, setOutlets] = useState(() => []);
  const [availableStock, setAvailableStock] = useState(() => 0);
  const [category, setCat] = useState();
  var comp, userId;

  useEffect(() => {
    axios
      .post(url + "/admin/outlet_list", {
        comp_id: +localStorage.getItem("comp_id"),
      })
      .then((resp) => {
        console.log(resp);
        setOutlets(resp?.data?.msg);
      });

    axios
      .post(url + "/admin/item_list", {
        comp_id: +localStorage.getItem("comp_id"),
      })
      .then((resp) => {
        console.log(resp);
        setItems(resp?.data?.msg);
      });
  }, []);

  //   useEffect(() => {
  //     console.log(params);
  //     comp = localStorage.getItem("comp_id");
  //     if (params.id > 0)
  //       callApi("/admin/item_details", 1, { item_id: +params.id });
  //     // setDataSet(response?.data?.msg)
  //   }, [isCalled]);

  //   useEffect(() => {
  //     console.log(response, Array.isArray(response?.data?.msg));
  //     if (Array.isArray(response?.data?.msg)) {
  //       console.log(response);
  //       const rsp = {
  //         // i_br_id: +response?.data?.msg[0].br_id,
  //         st_name: response?.data?.msg[0].item_name,
  //         st_hsn: +response?.data?.msg[0].hsn_code,
  //         st_price: +response?.data?.msg[0].price,
  //         st_discount: +response?.data?.msg[0].discount,
  //         i_cgst: +response?.data?.msg[0].cgst,
  //         i_sgst: +response?.data?.msg[0].sgst,
  //         i_unit: +response?.data?.msg[0].unit_id,
  //         i_cat: +response?.data?.msg[0].catg_id,
  //       };
  //       setValues(rsp);
  //       console.log(rsp);
  //     }
  //     // setDataSet(response?.data?.msg)
  //     if (response?.data?.suc == 0 || response?.data?.msg.length <= 0) {
  //       Message("error", "Something went wrong!");
  //     } else {
  //       if (isCalled && response?.data?.suc == 1) {
  //         setCalled(false);
  //         DurationMessage();
  //         setTimeout(() => {
  //           navigation("/home/master/itemdetails/view");
  //         }, 4500);
  //       }
  //     }
  //   }, [response]);

  const initialValues = {
    // st_comp_id: "",
    sto_br_id: "",
    sto_item_id: "",
    sto_damage_flag: "",
    sto_remarks: "",
    sto_qty: "",
    //   created_by: userId,
  };

  useEffect(() => {
    console.log(response, Array.isArray(response?.data?.msg));
    // setDataSet(response?.data?.msg)
    if (response?.data?.suc == 0 || response?.data?.msg.length <= 0) {
      Message("error", "Something went wrong!");
    } else {
      if (isCalled && response?.data?.suc == 1) {
        setCalled(false);
        DurationMessage();
        setTimeout(() => {
          navigation("/home/stock/stockview/view");
        }, 4500);
      }
    }
  }, [response]);

  const onSubmit = (values) => {
    setCalled(true);
    console.log(values, params.id);
    comp = localStorage.getItem("comp_id");
    userId = localStorage.getItem("user_id");
    callApi("/admin/stock_out", 1, {
      comp_id: +comp,
      br_id: +values?.sto_br_id,
      item_id: +values?.sto_item_id,
      damage_flag: values?.sto_damage_flag,
      qty: +values?.sto_qty,
      remarks: values?.sto_remarks,
      created_by: userId,
    });
  };

  const validationSchema = Yup.object({
    sto_br_id: Yup.number().required("Outlet is required"),
    sto_item_id: Yup.number().required("Item is required"),
    sto_damage_flag: Yup.string().required("Type is required"),
    sto_qty: Yup.number()
      .max(availableStock)
      .min(1)
      .required("Quantity is required"),
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

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    comp = localStorage.getItem("comp_id");
    axios
      .post(url + "/admin/fetch_stock", {
        comp_id: +comp,
        br_id: +formik?.values?.sto_br_id,
        item_id: +formik?.values?.sto_item_id,
      })
      .then((res) => {
        setAvailableStock(res?.data?.msg[0]?.stock);
        console.log(res?.data?.msg[0]?.stock);
      });
  }, [formik?.values?.sto_item_id, formik?.values?.sto_br_id]);

  return (
    <>
      <Backbtn />
      <section class="bg-white dark:bg-gray-900">
        <div class="py-8 px-4 mx-auto max-w-2xl lg:py-16">
          <h2 class="mb-4 text-xl font-bold text-blue-900 dark:text-white">
            {"Stock Out"}
            {/* {params.id == 0 ? "Add a new item" : "Update item"} */}
          </h2>
          <form onSubmit={formik.handleSubmit}>
            <div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div>
                <label
                  for="st_br_id"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Outlet
                </label>
                <select
                  id="sto_br_id"
                  name="sto_br_id"
                  value={formik.values.sto_br_id}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                  <option selected="">Select outlet</option>
                  {outlets?.map((item, i) => (
                    <option key={i} value={item.id}>
                      {item.branch_name}
                    </option>
                  ))}
                </select>
                {formik.errors.sto_br_id && formik.touched.sto_br_id ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.sto_br_id}
                  </div>
                ) : null}
              </div>
              <div>
                <label
                  for="st_item_id"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Item
                </label>
                <select
                  id="sto_item_id"
                  name="sto_item_id"
                  value={formik.values.sto_item_id}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                  <option selected="">Select item</option>
                  {items?.map((item, i) => (
                    <option key={i} value={item.id}>
                      {item.item_name}
                    </option>
                  ))}
                </select>
                {formik.errors.sto_item_id && formik.touched.sto_item_id ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.sto_item_id}
                  </div>
                ) : null}
              </div>
              <div>
                <label
                  for="sto_damage_flag"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Type
                </label>
                <select
                  id="sto_damage_flag"
                  name="sto_damage_flag"
                  value={formik.values.sto_damage_flag}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                  <option selected="">Select type</option>
                  <option value={"R"}>Return</option>
                  <option value={"D"}>Damaged</option>
                </select>
                {formik.errors.sto_damage_flag &&
                formik.touched.sto_damage_flag ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.sto_damage_flag}
                  </div>
                ) : null}
              </div>

              <div class="w-full">
                <label
                  for="st_qty"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Quantity
                </label>
                <input
                  type="number"
                  name="sto_qty"
                  id="sto_qty"
                  value={formik.values.sto_qty}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder={`${availableStock} available`}
                  required=""
                />
                {formik.errors.sto_qty && formik.touched.sto_qty ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.sto_qty}
                  </div>
                ) : null}
              </div>

              <div className="sm:col-span-2">
                <label
                  for="st_in_price"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Remarks
                </label>
                <textarea
                  type="text"
                  name="sto_remarks"
                  value={formik.values.sto_remarks}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  id="sto_remarks"
                  //   disabled={params.id > 0 ? true : false}
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Remarks"
                  required=""
                />
                {formik.errors.sto_remarks && formik.touched.sto_remarks ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.sto_remarks}
                  </div>
                ) : null}
              </div>
            </div>
            <div className="flex justify-center">
              {/* {params.id == 0 && ( */}
              <button
                type="reset"
                onClick={formik.handleReset}
                className="inline-flex mr-3 bg-white items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-blue-900 border border-blue-900 bg-primary-700 rounded-full focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
                Reset
              </button>
              {/* )} */}
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

export default StockOut;
