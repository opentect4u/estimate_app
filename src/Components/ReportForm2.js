import React, { useContext, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import axios from "axios";
import { url } from "../Address/baseURL";
function ReportForm2({ title, onPress, flag, outlet }) {
  console.log(url);
  const [d, setD] = useState([]);
  const initialValues = {
    dt: "",
    // to_dt: "",
    outlet: "",
    phone: "",
    // userlist: "",
    // paymentmode: "",
    // item_lst: "",
  };
  const onSubmit = (values) => {
    console.log(values);
    onPress(values);
  };
  const validationSchema = Yup.object({
    dt: Yup.string().required("Date is required"),
    outlet: Yup.string().required("Outlet is required"),
  });
  const validationSchemaCL = Yup.object({
    outlet: Yup.string().required("Outlet is required"),
    phone: Yup.string().required("Phone is required"),
  });

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema:
      flag == 1 ? validationSchema : flag == 2 ? validationSchemaCL : "",
    validateOnMount: true,
  });

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2 className="mb-4 text-xl font-bold text-blue-900 dark:text-white">
          {title}
        </h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            {flag == 1 && (
              <div className="w-full">
                <label
                  htmlFor="brand"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Date
                </label>
                <input
                  type="date"
                  name="dt"
                  id="dt"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  value={formik.values.dt}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder=""
                  required=""
                />
                {formik.errors.dt && formik.touched.dt ? (
                  <div className="text-red-500 text-sm">{formik.errors.dt}</div>
                ) : null}
              </div>
            )}

            <div className="w-full">
              <label
                htmlFor="outlet"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Outlet
              </label>
              <select
                id="outlet"
                value={formik.values.outlet}
                onChange={formik.handleChange}
                name="outlet"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                onBlur={formik.handleBlur}>
                <option selected>Select outlet</option>
                <option value="0">All outlets</option>
                {outlet?.map((item, i) => (
                  <option key={i} value={item?.id}>
                    {item?.branch_name}
                  </option>
                ))}
              </select>
              {formik.errors.outlet && formik.touched.outlet ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.outlet}
                </div>
              ) : null}
            </div>
            {flag == 2 && (
              <div className="w-full">
                <label
                  htmlFor="phone"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Phone
                </label>
                <input
                  type="number"
                  id="phone"
                  value={formik.values.phone}
                  name="phone"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />

                {formik.errors.phone && formik.touched.phone ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.phone}
                  </div>
                ) : null}
              </div>
            )}
          </div>
          <div className="flex justify-center">
            <button
              type="reset"
              onClick={formik.handleReset}
              className="inline-flex mr-3 bg-white items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-blue-900 border border-blue-900 bg-primary-700 rounded-full focus:ring-0 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800 hover:scale-105 active:scale-95 transition-all duration-200">
              Reset
            </button>
            <button
              type="submit"
              className="inline-flex bg-blue-900 items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-full focus:ring-0 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800 hover:scale-105 active:scale-95 transition-all duration-200">
              Submit
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default ReportForm2;
