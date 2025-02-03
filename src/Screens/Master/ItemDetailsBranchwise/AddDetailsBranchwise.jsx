import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import * as Yup from "yup";
import { useFormik } from "formik";
import useAPI from "../../../Hooks/useApi";
import { Message } from "@mui/icons-material";
import axios from "axios";
import { DurationMessage } from "../../../Components/DurationMessage";
import { useNavigate } from "react-router-dom";
import Backbtn from "../../../Components/Backbtn";
import { url, url_for_image } from "../../../Address/baseURL";

import { Image } from "antd";
import Cropper from "react-easy-crop";
import getCroppedImg from "../../../Components/cropImage";
import { Dialog } from "primereact/dialog";

const CROP_AREA_ASPECT = 1 / 1;

function AddDetailsBranchwise() {
  const params = useParams();
  const { response, callApi } = useAPI();
  const navigation = useNavigate();

  // const [resp,setRestp]=useState()
  const [isReport, setIsReport] = useState(false);
  const [isCalled, setCalled] = useState(false);
  const [dataSet, setDataSet] = useState();
  const [outlets, setOutlets] = useState(() => []);
  const [brands, setBrands] = useState(() => []);
  const [category, setCat] = useState();
  var comp, userId;

  const [visible, setVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [remoteImg, setRemoteImg] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState(null);

  useEffect(() => {
    axios
      .post(url + "/admin/outlet_list", {
        comp_id: +localStorage.getItem("comp_id"),
      })
      .then((resp) => {
        console.log(resp);
        setOutlets(resp?.data?.msg);
      });
  }, []);

  useEffect(() => {
    axios
      .post(url + "/admin/unit_list", {
        comp_id: +localStorage.getItem("comp_id"),
      })
      .then((resp) => {
        console.log(resp);
        setDataSet(resp?.data?.msg);
      });
    axios
      .post(url + "/admin/category_list", {
        comp_id: +localStorage.getItem("comp_id"),
      })
      .then((resp) => {
        console.log(resp);
        setCat(resp?.data?.msg);
      });
  }, []);

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    console.log(croppedAreaPixels);
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const showCroppedImage = async () => {
    console.log(croppedAreaPixels, "croppedAreaPixels");
    console.log(selectedFile.name, "selectedFile");
    try {
      const croppedImage = await getCroppedImg(
        window.URL.createObjectURL(selectedFile),
        croppedAreaPixels,
        rotation
      );
      console.log("donee", { croppedImage });
      setVisible(false);
      setCroppedImage(croppedImage);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    console.log(params);
    comp = localStorage.getItem("comp_id");
    if (params.id > 0)
      callApi("/admin/item_details", 1, {
        item_id: +params.id,
        br_id: +params.id2,
      });
    // setDataSet(response?.data?.msg)
  }, [isCalled]);

  useEffect(() => {
    console.log(response, Array.isArray(response?.data?.msg));
    if (Array.isArray(response?.data?.msg)) {
      console.log(response);
      const rsp = {
        // i_br_id: +response?.data?.msg[0].br_id,
        i_name: response?.data?.msg[0].item_name,
        // i_hsn: +response?.data?.msg[0].hsn_code,
        i_price: +response?.data?.msg[0].price,
        // i_discount: +response?.data?.msg[0].discount,
        // i_cgst: +response?.data?.msg[0].cgst,
        // i_sgst: +response?.data?.msg[0].sgst,
        i_unit: +response?.data?.msg[0].unit_id,
        i_cat: +response?.data?.msg[0].catg_id,
        i_selling_price: +response?.data?.msg[0].selling_price,
        i_brand_id: +response?.data?.msg[0].brand_id,
      };
      setValues(rsp);
      console.log(rsp);
    }

    // useEffect(() => {
    //   fetchBrands();
    // }, []);

    // setDataSet(response?.data?.msg)
    if (response?.data?.suc == 0 || response?.data?.msg.length <= 0) {
      Message("error", "Something went wrong!");
    } else {
      if (isCalled && response?.data?.suc == 1) {
        setCalled(false);
        DurationMessage();
        setTimeout(() => {
          navigation("/home/master/itemdetailsbranchwise/view");
        }, 3500);
      }
    }
  }, [response]);

  // const onSubmit = (values) => {
  //   setCalled(true);
  //   console.log(values, params.id);
  //   // comp = localStorage.getItem("comp_id");
  //   // userId = localStorage.getItem("user_id");
  //   // callApi("/admin/add_edit_items", 1, {
  //   //   // comp_id: +comp, // default 1 - may remove
  //   //   comp_id: 1,
  //   //   item_id: +params.id,
  //   //   item_name: values.i_name,
  //   //   unit_id: +values.i_unit,
  //   //   price: +values.i_price,
  //   //   catg_id: +values.i_cat,
  //   //   selling_price: +values.i_selling_price, // newly added
  //   //   brand_id: +values.i_brand_id || 0, // newly added
  //   //   created_by: userId,
  //   // });
  // };

  const initialValues = {
    // i_br_id: "",
    i_name: "",
    // i_hsn: "",
    i_price: "",
    i_selling_price: "",
    i_brand_id: "",
    // i_discount: "",
    // i_cgst: "",
    // i_sgst: "",
    i_unit: "",
    i_cat: "",
  };

  const validationSchema = Yup.object({
    i_name: Yup.string().required("Name is required"),
    // i_br_id: Yup.number().required("Branch is required"),
    // i_hsn: Yup.number().required("HSN is required"),
    i_price: Yup.number().required("Price is required"),
    i_unit: Yup.number().required("Unit is required"),
    // i_discount: Yup.number().required("Discount is required"),
    // i_cgst: Yup.number().required("CGST is required"),
    // i_sgst: Yup.number().required("SGST is required"),
    i_cat: Yup.number().required("Category is required"),

    i_selling_price: Yup.number().required("Selling price is required"),
    i_brand_id: Yup.number().optional(),
  });

  const [formValues, setValues] = useState(initialValues);
  console.log(formValues);

  const imageSubmit = () => {
    setCalled(true);
    if (formik.values.i_name) {
      comp = localStorage.getItem("comp_id");
      var file = new File(
        [croppedImage],
        formik.values.i_name.split(" ").join("") + ".png"
      );
      var data = new FormData();
      if (croppedImage) data.append("file", file);
      data.append("comp_id", 1);
      data.append("br_id", +params?.id2);
      data.append("item_id", +params.id);
      data.append("item_name", formik.values.i_name);
      data.append("unit_id", formik.values.i_unit);
      data.append("price", formik.values.i_selling_price);
      data.append("mrp", formik.values.i_price);
      data.append("catg_id", +formik.values.i_cat);
      data.append("brand_id", +formik.values.i_brand_id);
      data.append("created_by", localStorage.getItem("user_id"));

      callApi("/admin/add_edit_items", 1, data);
    }
  };

  const formik = useFormik({
    initialValues: params.id > 0 ? formValues : initialValues,
    // imageSubmit,
    validationSchema,
    enableReinitialize: true,
    validateOnMount: true,
  });

  useEffect(() => {
    axios
      .post(`${url}/admin/brand_dtls`, {
        catg_id: +formik.values.i_cat,
        brand_id: 0,
      })
      .then((res) => {
        setBrands(res?.data?.msg);
      })
      .catch((err) => {
        console.log("---=+++++=====", err);
      });
  }, [formik.values.i_cat]);

  // const onSubmitForm = (e) => {
  //   e.preventDefault();
  //   // formik.handleSubmit(e);

  //   console.log(">>>>>>>>>>", formik.values);
  // };

  useEffect(() => {
    if (Array.isArray(response?.data?.msg)) {
      console.log(response);

      setValues({
        i_name: response?.data?.msg[0]?.item_name,
        i_price: response?.data?.msg[0]?.mrp,
        i_selling_price: response?.data?.msg[0]?.price,
        i_brand_id: response?.data?.msg[0]?.brand_id,
        i_unit: response?.data?.msg[0]?.unit_id,
        i_cat: response?.data?.msg[0]?.catg_id,
      });

      setRemoteImg(url_for_image + response?.data?.msg[0].item_img);
    }
    if (response?.data?.suc == 0 || response?.data?.msg.length <= 0) {
      Message("error", "Something went wrong!");
    } else {
      if (isCalled && response?.data?.suc == 1) {
        setCalled(false);
        // Message("success", "Success!");
      }
    }
  }, [response]);

  // const imageSubmit = () => {
  //   setCalled(true);
  //   if (formik.values.i_name) {
  //     comp = localStorage.getItem("comp_id");
  //     var file = new File(
  //       [croppedImage],
  //       formik.values.i_name.split(" ").join("") + ".png"
  //     );
  //     var data = new FormData();
  //     if (croppedImage) data.append("file", file);
  //     data.append("comp_id", 1);
  //     data.append("item_id", +params.id);
  //     data.append("item_name", formik.values.i_name);
  //     data.append("unit_id", formik.values.i_unit);
  //     data.append("price", formik.values.i_price);
  //     data.append("price", formik.values.i_price);
  //     data.append("selling_price", formik.values.i_selling_price);
  //     data.append("catg_id", +formik.values.i_cat);
  //     data.append("brand_id", +formik.values.i_brand_id);
  //     data.append("created_by", localStorage.getItem("user_id"));

  //     callApi("/admin/add_edit_items", 1, data);
  //   }
  // };

  return (
    <>
      <Backbtn />
      <section class="bg-white dark:bg-gray-900">
        <div class="py-8 px-4 mx-auto max-w-2xl lg:py-16">
          <h2 class="mb-4 text-xl font-bold text-blue-900 dark:text-white">
            {" "}
            {params.id == 0 ? "Add a new item" : "Update item"}
          </h2>
          <div>
            <div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div class="sm:col-span-2">
                <label
                  for="i_name"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Item Name
                </label>
                <input
                  disabled={params.id2 > 0 ? true : false}
                  type="text"
                  name="i_name"
                  id="i_name"
                  value={formik.values.i_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Item name"
                  required=""
                />
                {formik.errors.i_name && formik.touched.i_name ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.i_name}
                  </div>
                ) : null}
              </div>
              {/* <div class="w-full">
                <label
                  for="i_hsn"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  HSN Code
                </label>
                <input
                  type="number"
                  name="i_hsn"
                  value={formik.values.i_hsn}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  id="i_hsn"
                  disabled={params.id > 0 ? true : false}
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="HSN Code"
                  required=""
                />
                {formik.errors.i_hsn && formik.touched.i_hsn ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.i_hsn}
                  </div>
                ) : null}
              </div> */}
              <div class="w-full">
                <label
                  for="i_selling_price"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Selling Price
                </label>
                <input
                  type="number"
                  name="i_selling_price"
                  value={formik.values.i_selling_price}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  id="i_selling_price"
                  // disabled={params.id > 0 ? true : false}
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Selling Price"
                  required=""
                />
                {formik.errors.i_selling_price &&
                formik.touched.i_selling_price ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.i_selling_price}
                  </div>
                ) : null}
              </div>
              <div class="w-full">
                <label
                  for="i_price"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  MRP
                </label>
                <input
                  type="number"
                  name="i_price"
                  id="i_price"
                  value={formik.values.i_price}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="$2999"
                  required=""
                />
                {formik.errors.i_price && formik.touched.i_price ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.i_price}
                  </div>
                ) : null}
              </div>
              <div>
                <label
                  for="i_cat"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Category
                </label>
                <select
                  disabled={params.id2 > 0 ? true : false}
                  id="i_cat"
                  name="i_cat"
                  value={formik.values.i_cat}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                  <option selected="">Select category</option>
                  {category?.map((item, i) => (
                    <option key={i} value={item.sl_no}>
                      {item.category_name}
                    </option>
                  ))}
                  {/* <option value="TV">TV/Monitors</option>
                        <option value="PC">PC</option>
                        <option value="GA">Gaming/Console</option>
                        <option value="PH">Phones</option> */}
                </select>
                {formik.errors.i_cat && formik.touched.i_cat ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.i_cat}
                  </div>
                ) : null}
              </div>
              <div>
                <label
                  for="i_brand_id"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Brand
                </label>
                <select
                  disabled={params.id2 > 0 ? true : false}
                  id="i_brand_id"
                  name="i_brand_id"
                  value={formik.values.i_brand_id}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                  <option selected="">Select brand</option>
                  {brands?.map((item, i) => (
                    <option key={i} value={item.brand_id}>
                      {item.brand_name}
                    </option>
                  ))}
                  {/* <option value="TV">TV/Monitors</option>
                        <option value="PC">PC</option>
                        <option value="GA">Gaming/Console</option>
                        <option value="PH">Phones</option> */}
                </select>
                {formik.errors.i_brand_id && formik.touched.i_brand_id ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.i_brand_id}
                  </div>
                ) : null}
              </div>
              <div>
                <label
                  for="i_unit"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Unit
                </label>
                <select
                  disabled={params.id2 > 0 ? true : false}
                  id="i_unit"
                  name="i_unit"
                  value={formik.values.i_unit}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                  <option selected="">Select Unit</option>
                  {dataSet?.map((item) => (
                    <option value={item.sl_no}>{item.unit_name}</option>
                  ))}
                  {/* <option value="TV">TV/Monitors</option>
                        <option value="PC">PC</option>
                        <option value="GA">Gaming/Console</option>
                        <option value="PH">Phones</option> */}
                </select>
                {formik.errors.i_unit && formik.touched.i_unit ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.i_unit}
                  </div>
                ) : null}
              </div>
              <div className="w-full">
                <label
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  for="file_input">
                  Upload file
                </label>
                <input
                  disabled={params.id2 > 0 ? true : false}
                  class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  aria-describedby="file_input_help"
                  id="file_input"
                  type="file"
                  accept="image/png"
                  onChange={(e) => {
                    console.log(e.target.files);
                    setSelectedFile(e.target.files[0]);
                    setVisible(true);
                  }}
                />
                <p
                  class="mt-1 text-sm text-gray-500 dark:text-gray-300"
                  id="file_input_help">
                  Only PNG is allowed (MAX. 800x400px).
                </p>
              </div>

              {croppedImage ? (
                <Image
                  width={200}
                  src={URL.createObjectURL(croppedImage)}
                  className="w-40 h-40 object-cover rounded-lg"
                />
              ) : !remoteImg.toString().includes(null) ? (
                <Image
                  width={200}
                  src={remoteImg}
                  className="w-40 h-40 object-cover rounded-lg"
                />
              ) : (
                ""
              )}
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
                type="button"
                className="inline-flex bg-blue-900 items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-full focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
                onClick={imageSubmit}>
                Submit
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* .cropper {
  position: relative;
  height: 50vh;
} */}

      <Dialog
        header="Cropper"
        maximizable
        visible={visible}
        style={{ width: "50vw", height: "35vw" }}
        onHide={() => setVisible(false)}>
        <div
          className="cropper"
          style={{
            position: "relative",
            height: "50vh",
          }}>
          {selectedFile && (
            <Cropper
              image={window.URL.createObjectURL(selectedFile)}
              aspect={CROP_AREA_ASPECT}
              crop={crop}
              zoom={zoom}
              zoomWithScroll={true}
              cropSize={{ height: 450, width: 450 }}
              rotation={rotation}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropAreaChange={setCroppedArea}
              onCropComplete={onCropComplete}
            />
          )}
        </div>
        <div className="flex justify-center">
          <button
            onClick={showCroppedImage}
            variant="contained"
            className="inline-flex mr-3 bg-white items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-blue-900 border border-blue-900 bg-primary-700 rounded-full focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800 justify-center">
            Generate
          </button>
        </div>
      </Dialog>
    </>
  );
}

export default AddDetailsBranchwise;
