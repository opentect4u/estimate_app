import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import * as Yup from "yup";
import { useFormik } from "formik";
import useAPI from "../../Hooks/useApi";
import { Message } from "@mui/icons-material";
import axios from "axios";
import { DurationMessage } from "../../Components/DurationMessage";
import { useNavigate } from "react-router-dom";
import Backbtn from "../../Components/Backbtn";
import { url } from "../../Address/baseURL";

function StockIn() {
  const params = useParams();
  const { response, callApi } = useAPI();
  const navigation = useNavigate();

  // const [resp,setRestp]=useState()
  const [isReport, setIsReport] = useState(false);
  const [isCalled, setCalled] = useState(false);
  const [dataSet, setDataSet] = useState();
  const [items, setItems] = useState(() => []);
  const [outlets, setOutlets] = useState(() => []);
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
    st_br_id: "",
    st_item_id: "",
    st_in_price: "",
    st_in_cgst: "",
    st_in_sgst: "",
    st_qty: "",
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
    callApi("/admin/stock_in", 1, {
      comp_id: +comp,
      br_id: +values?.st_br_id,
      item_id: +values?.st_item_id,
      in_price: +values?.st_in_price,
      in_cgst: +values?.st_in_cgst,
      in_sgst: +values?.st_in_sgst,
      qty: +values?.st_qty,
      created_by: userId,
    });
  };

  const validationSchema = Yup.object({
    st_br_id: Yup.number().required("Outlet is required"),
    st_item_id: Yup.number().required("Item is required"),
    // st_in_price: Yup.number().required("Price is required"),
    // st_in_cgst: Yup.number().required("Item is required"),
    // st_in_sgst: Yup.number().required("Item is required"),
    st_qty: Yup.number().min(1).required("Quantity is required"),
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
            {"Stock In"}
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
                  id="st_br_id"
                  name="st_br_id"
                  value={formik.values.st_br_id}
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
                {formik.errors.st_br_id && formik.touched.st_br_id ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.st_br_id}
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
                  id="st_item_id"
                  name="st_item_id"
                  value={formik.values.st_item_id}
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
                {formik.errors.st_item_id && formik.touched.st_item_id ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.st_item_id}
                  </div>
                ) : null}
              </div>
              <div className="w-full">
                <label
                  for="st_in_price"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  In Price
                </label>
                <input
                  type="number"
                  name="st_in_price"
                  value={formik.values.st_in_price}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  id="st_in_price"
                  disabled={params.id > 0 ? true : false}
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="In Price"
                  required=""
                />
                {formik.errors.st_in_price && formik.touched.st_in_price ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.st_in_price}
                  </div>
                ) : null}
              </div>
              <div class="w-full">
                <label
                  for="st_in_cgst"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  In CGST
                </label>
                <input
                  type="number"
                  name="st_in_cgst"
                  id="st_in_cgst"
                  value={formik.values.st_in_cgst}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="CGST (%)"
                  required=""
                />
                {formik.errors.st_in_cgst && formik.touched.st_in_cgst ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.st_in_cgst}
                  </div>
                ) : null}
              </div>
              <div class="w-full">
                <label
                  for="st_in_sgst"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  In SGST
                </label>
                <input
                  type="number"
                  name="st_in_sgst"
                  id="st_in_sgst"
                  value={formik.values.st_in_sgst}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="SGST (%)"
                  required=""
                />
                {formik.errors.st_in_sgst && formik.touched.st_in_sgst ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.st_in_sgst}
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
                  name="st_qty"
                  id="st_qty"
                  value={formik.values.st_qty}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Quantity"
                  required=""
                />
                {formik.errors.st_qty && formik.touched.st_qty ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.st_qty}
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

export default StockIn;
