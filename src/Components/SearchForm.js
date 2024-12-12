import React, { useContext, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";

function SearchForm({ flag, title, onPress, products }) {
  const [d, setD] = useState([]);
  const initialValues = {
    from_dt: "",
    to_dt: "",
    phone: "",
    product: "",
  };
  const onSubmit = (values) => {
    console.log(values);
    onPress(values);
  };
  const validationSchema = Yup.object({
    from_dt: Yup.string().required("From date is required"),
    to_dt: Yup.string().required("To date is required"),
  });
  const validationProduct = Yup.object({
    from_dt: Yup.string().required("From date is required"),
    to_dt: Yup.string().required("To date is required"),
    product: Yup.string().required("Product is required"),
  });
  const validationPhone = Yup.object({
    from_dt: Yup.string().required("From date is required"),
    to_dt: Yup.string().required("To date is required"),
    phone: Yup.string().required("Phone is required"),
  });
  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema:
      flag == 2
        ? validationProduct
        : flag == 1
        ? validationPhone
        : validationSchema,

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
            <div className="w-full">
              <label
                htmlFor="brand"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                From
              </label>
              <input
                type="date"
                name="from_dt"
                id="from_dt"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                value={formik.values.from_dt}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Product brand"
                required=""
              />
              {formik.errors.from_dt && formik.touched.from_dt ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.from_dt}
                </div>
              ) : null}
            </div>
            <div className="w-full">
              <label
                htmlFor="price"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                To
              </label>
              <input
                type="date"
                name="to_dt"
                id="to_dt"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                onBlur={formik.handleBlur}
                placeholder="$2999"
                value={formik.values.to_dt}
                onChange={formik.handleChange}
                required=""
              />
              {formik.errors.to_dt && formik.touched.to_dt ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.to_dt}
                </div>
              ) : null}
            </div>
            {flag == 2 && (
              <div className="sm:col-span-2">
                <label
                  htmlFor="product"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Product
                </label>
                <select
                  id="product"
                  value={formik.values.product}
                  onChange={formik.handleChange}
                  name="product"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onBlur={formik.handleBlur}>
                  <option selected>Select product</option>
                  {products?.map((item) => (
                    <option value={item?.id}>{item?.item_name}</option>
                  ))}
                </select>
                {formik.errors.product &&
                formik.touched.product &&
                flag == 2 ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.product}
                  </div>
                ) : null}
              </div>
            )}
            {flag == 1 && (
              <div className="sm:col-span-2">
                <label
                  htmlFor="phone"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Phone
                </label>
                <input
                  type="number"
                  name="phone"
                  id="phone"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="98367XXXXX"
                  value={formik.values.phone}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  required=""
                />
                {formik.errors.phone && formik.touched.phone && flag == 1 ? (
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

export default SearchForm;
