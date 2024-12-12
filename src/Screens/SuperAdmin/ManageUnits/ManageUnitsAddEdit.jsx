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

function ManageUnitsAddEdit() {
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
        `/admin/S_Admin/select_unit?comp_id=${params.id2}&unit_id=${params.id}`,
        0
      );

    localStorage.setItem("compIdx", `${params.id2}`);
  }, [isCalled]);

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
        su_comp_id: +response?.data?.msg[0].comp_id,
        su_unit_name: response?.data?.msg[0].unit_name,
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
          navigation("/home/superadmin/manageunits/view");
        }, 3500);
      }
    }
  }, [response]);

  const initialValues = {
    su_comp_id: "",
    su_unit_name: "",
  };

  const onSubmit = (values) => {
    setCalled(true);
    console.log(values, params.id);
    // comp = localStorage.getItem("comp_id");
    userId = localStorage.getItem("user_id");
    callApi("/admin/S_Admin/add_edit_unit", 1, {
      sl_no: +params.id,
      comp_id: +values?.su_comp_id,
      unit_name: values?.su_unit_name,
      created_by: userId,
    });
  };

  const validationSchema = Yup.object({
    su_comp_id: Yup.string().required("Company is required."),
    su_unit_name: Yup.string().required("Unit name is required."),
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
            {params.id == 0 ? "Add Unit" : "Update unit"}
          </h2>
          <form onSubmit={formik.handleSubmit}>
            <div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div>
                <label
                  for="su_comp_id"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Select Shop
                </label>
                <select
                  id="su_comp_id"
                  name="su_comp_id"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.su_comp_id}>
                  <option selected="">Select Shop</option>

                  {shops?.map((items, i) => (
                    <option key={i} value={items?.id}>
                      {items?.company_name}
                    </option>
                  ))}
                </select>
                {formik.errors.su_comp_id && formik.touched.su_comp_id ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.su_comp_id}
                  </div>
                ) : null}
              </div>
              <div class="w-full">
                <label
                  for="su_unit_name"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Unit Name
                </label>
                <input
                  type="text"
                  name="su_unit_name"
                  id="su_unit_name"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.su_unit_name}
                  placeholder="Unit Name"
                  required=""
                />
                {formik.errors.su_unit_name && formik.touched.su_unit_name ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.su_unit_name}
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

export default ManageUnitsAddEdit;
