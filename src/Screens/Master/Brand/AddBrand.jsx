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

function AddBrand() {
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
  const [category, setCat] = useState();

  var comp, userId;

  //   useEffect(() => {
  //     console.log(params);
  //     comp = localStorage.getItem("comp_id");
  //     if (params.id > 0) callApi(`/admin/S_Admin/select_shop?id=${params.id}`, 0);
  //     // setDataSet(response?.data?.msg)
  //   }, [isCalled]);

  //   useEffect(() => {
  //     // callApi(`/admin/S_Admin/select_location`, 0);
  //     axios
  //       .get(`${url}/admin/S_Admin/select_location`)
  //       .then((res) => {
  //         setLocations(res?.data?.msg);
  //         console.log(res);
  //       })
  //       .catch((err) => {
  //         Message("error", err);
  //       });
  //   }, []);

  useEffect(() => {
    axios
      .post(url + "/admin/category_list", {
        comp_id: +localStorage.getItem("comp_id"),
      })
      .then((resp) => {
        console.log(resp);
        setCat(resp?.data?.msg);
      });
  }, []);

  useEffect(() => {
    console.log(params);
    comp = localStorage.getItem("comp_id");
    if (params.id > 0)
      callApi("/admin/brand_dtls", 1, {
        brand_id: +params.id,
        // catg_id: +params.id2,
      });
    // setDataSet(response?.data?.msg)
  }, [isCalled]);

  useEffect(() => {
    console.log(response, Array.isArray(response?.data?.msg));
    if (Array.isArray(response?.data?.msg)) {
      console.log(response);
      const rsp = {
        sh_brand_name: response?.data?.msg[0]?.brand_name,
        // sh_catg_id: response?.data?.msg[0]?.catg_id,
      };
      setValues(rsp);
      //  setBill(response?.data?.msg[0].bill_address)
      //  setDel(response?.data?.msg[0].delivery_address)
      console.log(rsp);
    }
    // setDataSet(response?.data?.msg)
    if (response?.data?.suc == 0) {
      Message("error", "Something went wrong!");
    } else {
      if (isCalled && response?.data?.suc == 1) {
        setCalled(false);
        DurationMessage();
        setTimeout(() => {
          navigation("/home/master/brand/view");
        }, 4500);
      }
    }
  }, [response]);

  const initialValues = {
    sh_brand_name: "",
    // sh_catg_id: "",
  };

  const onSubmit = (values) => {
    setCalled(true);
    console.log(values, params.id);
    // comp = localStorage.getItem("comp_id");
    userId = localStorage.getItem("user_id");
    callApi("/admin/add_edit_brand", 1, {
      brand_id: +params?.id,
      brand_name: values?.sh_brand_name,
      // catg_id: +values?.sh_catg_id,
      created_by: localStorage.getItem("user_id"),
    });
  };

  const validationSchema = Yup.object({
    sh_brand_name: Yup.string().required("Brand Name is required."),
    // sh_catg_id: Yup.string().required("Category is required."),
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
            {params.id == 0 ? "Add a brand" : "Update brand"}
          </h2>
          <form onSubmit={formik.handleSubmit}>
            <div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div className="sm:col-span-2">
                <label
                  for="sh_brand_name"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Brand Name
                </label>
                <input
                  type="text"
                  name="sh_brand_name"
                  id="sh_brand_name"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Type shop name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.sh_brand_name}
                  required=""
                />
                {formik.errors.sh_brand_name && formik.touched.sh_brand_name ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.sh_brand_name}
                  </div>
                ) : null}
              </div>
              {/* <div>
                <label
                  for="sh_catg_id"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Category
                </label>
                <select
                  id="sh_catg_id"
                  name="sh_catg_id"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.sh_catg_id}>
                  <option selected="">Select Category</option>
                  {category?.map((item, i) => (
                    <option key={i} value={item.sl_no}>
                      {item.category_name}
                    </option>
                  ))}
                </select>
                {formik.errors.sh_catg_id && formik.touched.sh_catg_id ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.sh_catg_id}
                  </div>
                ) : null}
              </div> */}
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

export default AddBrand;
