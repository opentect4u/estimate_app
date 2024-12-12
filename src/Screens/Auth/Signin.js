import React, { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
// import { PinInput } from 'react-input-pin-code';
import IMG from "../../Assets/Images/Receipt.gif";
import logo from "../../Assets/Images/mainlogo.png";
// import useApi from '../../Hooks/useApi';
import useAPI from "../../Hooks/useApi";
import { Message } from "../../Components/Message";
import { ErrorBoundary } from "react-error-boundary";
import Error from "../../Components/Error";
import { Toast } from "primereact/toast";
function Signin() {
  const [values, setValues] = useState(["", "", "", ""]);
  const { response, callApi } = useAPI();
  const navigate = useNavigate();
  const location = useLocation();
  const [called, setCalled] = useState(false);
  // localStorage.clear()
  const toast = useRef(null);
  const initialValues = {
    email: "",
    password: "",
  };
  const onSubmit = (values) => {
    SignIn(values);
  };
  useEffect(() => {
    if (!localStorage.getItem("email_id")) {
      console.log(location);
      setTimeout(() => {
        Message("info", "Welcome back, admin!");
      }, 1000);
    } else {
      // navigate("home/report/daybook");
      navigate("home");
    }
  }, []);
  useEffect(() => {
    if (response?.data?.suc == 1 && response?.data?.msg.length > 0 && called) {
      localStorage.setItem("address", response?.data?.msg[0].address);
      localStorage.setItem(
        "branch_address",
        response?.data?.msg[0].branch_address
      );
      localStorage.setItem("branch_name", response?.data?.msg[0].branch_name);
      localStorage.setItem("company_name", response?.data?.msg[0].company_name);
      localStorage.setItem(
        "contact_person",
        response?.data?.msg[0].contact_person
      );
      localStorage.setItem("comp_id", response?.data?.msg[0].comp_id);
      localStorage.setItem("phone_no", response?.data?.msg[0].phone_no);
      localStorage.setItem("email_id", response?.data?.msg[0].email_id);
      setCalled(false);
      // navigate("home/report/daybook");
      navigate("home");
    } else {
      if (called) Message("error", "Incorrect credentials!");
      setCalled(false);
    }
  }, [response]);

  const SignIn = (values) => {
    localStorage.setItem("user_id", values.email);

    callApi("/admin/user_login", 1, {
      user_id: values.email,
      password: values.password,
    });
    setCalled(true);
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .required("Email is required")
      .email("Not a correct a email format"),
    password: Yup.string().required("Password is required"),
  });
  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
    validateOnMount: true,
  });
  return (
    <ErrorBoundary
      FallbackComponent={Error}
      onError={(error) => {
        console.error(error);
      }}>
      {/* <div className="bg-blue-900 flex justify-center items-center h-screen w-full bg-line bg-no-repeat bg-cover">
        <div className="md:ml-12 grid grid-cols-2 gap-0">
          <div className="hidden md:block md:col-span-1">
            <div className="mt-24 mb-10 bg-white rounded-tl-lg rounded-bl-lg h-auto w-full text-black p-8 font-semibold text-xl shadow-xl">
              <p className="flex justify-center items-center">
                <img src={`${IMG}`} className="h-[368px] w-96" />
              </p>
            </div>
          </div>
          <div className="md:col-span-1 col-span-2">
            <div className="mt-24 mb-10 bg-white rounded-tl-lg rounded-bl-lg rounded-tr-lg rounded-br-lg sm:rounded-tr-lg sm:rounded-br-lg sm:rounded-bl-none sm:rounded-tl-none w-96 h-auto text-gray-600 p-8 font-semibold text-xl shadow-xl">
              <p className="flex justify-center items-center">
                <img src={`${logo}`} className="w-24 h-28" />
              </p>
              <form onSubmit={formik.handleSubmit}>
                <div className="pt-6 block">
                  <label className="text-sm text-gray-600">Your email</label>
                  <input
                    type="text"
                    name="email"
                    value={formik.values.email}
                    className="block border-gray-300 text-[13px] pt-2 p-1 rounded-lg h- w-full border "
                    placeholder="name@company.com"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.errors.email && formik.touched.email ? (
                    <div className="text-red-500 text-sm">
                      {formik.errors.email}
                    </div>
                  ) : null}
                </div>
                <div className="pt-6 block">
                  <label className="text-sm text-gray-600">Your password</label>
                  <input
                    type="password"
                    name="password"
                    value={formik.values.password}
                    className="block border-gray-300 text-[13px] pt-1 p-1 rounded-lg h- w-full border "
                    placeholder="*******"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.errors.password && formik.touched.password ? (
                    <div className="text-red-500 text-sm">
                      {formik.errors.password}
                    </div>
                  ) : null}
                </div>

                <div className="pt-5 pb-4 block text-sm">
                  <button
                    disabled={!formik.isValid}
                    type="submit"
                    className="bg-blue-900 hover:bg-blue-800 w-full text-white p-3 rounded-md disabled:bg-blue-400 dark:bg-white dark:text-white">
                    Sign In
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div> */}

      {/* ==================================================================== */}
      <div
        className="bg-blue-900 flex justify-center min-h-screen min-w-screen 
    items-center
    p-2 shadow-lg
    ">
        <div
          className="
      grid 
      grid-cols-2 
      gap-0 h-auto shadow-lg">
          <div
            className="hidden 
        sm:block rounded-l-3xl border-0 border-r border-r-slate-100">
            <img
              className="w-full h-full rounded-l-3xl"
              src={`${IMG}`}
              alt=""
            />
          </div>
          <div
            className={`p-5 
        col-span-2 sm:col-span-1 
        bg-white h-full space-y-5 w-full
        rounded-r-3xl rounded-l-3xl lg:rounded-l-none
       
        `}>
            <div>
              <div
                className={`max-w-full flex-col items-center justify-center mx-auto mt-7`}>
                <div className="flex items-center justify-center">
                  <img src={`${logo}`} className="h-32" alt="Flowbite Logo" />
                </div>
                <form onSubmit={formik.handleSubmit} className="w-full py-6">
                  <div className="pt-6 block">
                    <label className="text-sm text-gray-600">Your email</label>
                    <input
                      type="text"
                      name="email"
                      value={formik.values.email}
                      className="block border-gray-300 text-[13px] pt-2 p-1 rounded-lg h- w-full border "
                      placeholder="name@company.com"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.errors.email && formik.touched.email ? (
                      <div className="text-red-500 text-sm">
                        {formik.errors.email}
                      </div>
                    ) : null}
                  </div>
                  <div className="pt-6 block">
                    <label className="text-sm text-gray-600">
                      Your password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formik.values.password}
                      className="block border-gray-300 text-[13px] pt-1 p-1 rounded-lg h- w-full border "
                      placeholder="*******"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.errors.password && formik.touched.password ? (
                      <div className="text-red-500 text-sm">
                        {formik.errors.password}
                      </div>
                    ) : null}
                  </div>

                  <div className="pt-5 pb-4 block text-sm">
                    <button
                      disabled={!formik.isValid}
                      type="submit"
                      className="bg-blue-900 hover:bg-blue-800 w-full text-white p-3 rounded-md disabled:bg-blue-400 dark:bg-white dark:text-white">
                      Sign In
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default Signin;
