import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import * as Yup from "yup";
import { useFormik } from "formik";
import DatatableAdv from "../../../Components/DatatableAdv";
import * as XLSX from "xlsx";
import useAPI from "../../../Hooks/useApi";
import { Message } from "../../../Components/Message";
import { DurationMessage } from "../../../Components/DurationMessage";
import axios from "axios";
import { url } from "../../../Address/baseURL";
import Backbtn from "../../../Components/Backbtn";

function ManageItemsAdd() {
  const params = useParams();
  const { response, callApi } = useAPI();
  const navigation = useNavigate();

  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  // const [resp,setRestp]=useState()
  const [selectedFile, setSelectedFile] = useState(null);
  const [isReport, setIsReport] = useState(false);
  const [isCalled, setCalled] = useState(false);
  const [dataSet, setDataSet] = useState();
  const [c_del, setDel] = useState("");
  const [c_bill, setBill] = useState("");
  const [outlets, setOutlets] = useState(() => []);
  const [categories, setCategories] = useState(() => []);
  const [categoryId, setCategoryId] = useState(() => []);
  const [compId, setCompId] = useState(() => null);
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

  // useEffect(() => {
  //   axios
  //     .get(`${url}/admin/S_Admin/select_location`)
  //     .then((res) => {
  //       setLocations(res?.data?.msg);
  //       console.log(res);
  //     })
  //     .catch((err) => {
  //       Message("error", err);
  //     });
  // }, []);

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
  }, [isCalled]);

  useEffect(() => {
    // callApi(`/admin/S_Admin/select_location`, 0);
    axios
      .get(
        `${url}/admin/S_Admin/select_category?comp_id=${compId || 1}&catg_id=0`
      )
      .then((res) => {
        setCategories(res?.data?.msg);
        console.log(res);
      })
      .catch((err) => {
        Message("error", err);
      });
  }, [compId]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const arrayBuffer = event.target.result;
      const data = new Uint8Array(arrayBuffer);
      const arr = [];
      for (let i = 0; i < data.length; ++i) {
        arr[i] = String.fromCharCode(data[i]);
      }
      const binaryString = arr.join("");
      const workbook = XLSX.read(binaryString, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      setData(jsonData);
      console.log(jsonData);
    };
    reader.readAsArrayBuffer(file);
  };

  // const onSubmit = (values) => {
  //   setCalled(true);
  //   console.log(values, params.id);
  //   // comp = localStorage.getItem("comp_id");
  //   userId = localStorage.getItem("user_id");
  //   callApi("/admin/S_Admin/add_edit_outlet", 1, {
  //     br_id: +params.id,
  //     comp_id: +values?.o_comp_id,
  //     branch_name: values?.o_branch_name,
  //     branch_address: values?.o_branch_address,
  //     location: values?.o_location,
  //     contact_person: values?.o_email_id,
  //     phone_no: +values?.o_phone_no,
  //     email_id: values?.o_email_id,
  //     created_by: userId,
  //   });
  // };

  useEffect(() => {
    if (response?.data?.suc == 0 || response?.data?.msg.length <= 0) {
      Message("error", "Something went wrong!");
    } else {
      if (isCalled && response?.data?.suc == 1) {
        setCalled(false);
        Message("success", "Success!");
        setData(() => []);
      }
    }
  }, [response]);

  const handleSendData = () => {
    setCalled(true);
    // comp = localStorage.getItem("comp_id");
    userId = localStorage.getItem("user_id");

    // axios
    //   .post("http://your-backend-api-endpoint", data)
    //   .then((response) => {
    //     console.log("Data sent successfully:", response.data);
    //   })
    //   .catch((error) => {
    //     console.error("Error sending data:", error);
    //   });

    var newFile = new File([file], "data" + ".xlsx");

    var data = new FormData();
    data.append("comp_id", +compId);
    data.append("catg_id", +categoryId);
    data.append("created_by", userId);
    data.append("file", newFile);

    callApi("/admin/S_Admin/insert_excel", 1, data);
  };

  return (
    <>
      <Backbtn />

      <section className="bg-white dark:bg-gray-900">
        <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
          <h2 className="mb-4 text-xl font-bold text-blue-900 dark:text-white">
            Add items
          </h2>
          {/* <form onSubmit={formik.handleSubmit}> */}
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div>
              <label
                htmlFor="brand"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Select Shop
              </label>
              <select
                id="comp_id"
                name="comp_id"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                onChange={(e) => setCompId(e.target.value)}
                // onBlur={() => null}
                value={compId}>
                <option selected="">Select Shop</option>

                {shops?.map((items, i) => (
                  <option key={i} value={items?.id}>
                    {items?.company_name}
                  </option>
                ))}
              </select>
              {isCalled && !compId ? (
                <div className="text-red-500 text-sm">
                  Shop Name is required
                </div>
              ) : null}
            </div>
            <div>
              <label
                htmlFor="brand"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Select Category
              </label>
              <select
                id="cat_id"
                name="cat_id"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                onChange={(e) => {
                  console.log("TTTTTTTTTTTTTTTTTTTTT", e);
                  setCategoryId(e.target.value);
                }}
                // onBlur={() => null}
                value={categoryId}>
                <option selected="">Select Category</option>

                {categories?.map((items, i) => (
                  <option key={i} value={items?.sl_no}>
                    {items?.category_name}
                  </option>
                ))}
              </select>
              {isCalled && !categoryId ? (
                <div className="text-red-500 text-sm">Category is required</div>
              ) : null}
            </div>

            <div className="sm:col-span-2">
              <label
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                for="file_input">
                Upload Excel
              </label>
              <input
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                aria-describedby="file_input_help"
                id="file_input"
                type="file"
                accept=".xlsx, .xls"
                // onChange={(e) => {
                //   console.log(e.target.files);
                //   setSelectedFile(e.target.files[0]);
                // }}
                onChange={handleFileUpload}
              />
              <p
                className="mt-1 text-sm text-gray-500 dark:text-gray-300"
                id="file_input_help">
                Only .xlsx, .xls is allowed.
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            {/* {params.id == 0 && (
              <button
                type="reset"
                onClick={() => {}}
                className="inline-flex mr-3 bg-white items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-blue-900 border border-blue-900 bg-primary-700 rounded-full focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
                Reset
              </button>
            )} */}
            <button
              onClick={handleSendData}
              type="submit"
              className="inline-flex bg-blue-900 items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-full focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
              Submit
            </button>
          </div>
          {/* </form> */}
        </div>
        {data?.length > 0 && (
          <div class="bg-blue-900 dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
            <div class="overflow-x-auto">
              <DatatableAdv
                onPress={() => null}
                // setSearch={(val) => setSearch(val)}
                // title={"Manage Items"}
                // btnText={"Add Item"}
                // onclick={() => null}
                // flag={1}
                headers={[
                  { name: "hsn_code", value: "HSN" },
                  { name: "bar_code", value: "Barcode" },
                  { name: "item_name", value: "Item Name" },
                  { name: "price", value: "Price" },
                  { name: "discount", value: "Discount" },
                  { name: "cgst", value: "CGST" },
                  { name: "sgst", value: "SGST" },
                ]}
                data={data}
              />
            </div>
          </div>
        )}
      </section>
    </>
  );
}

export default ManageItemsAdd;
