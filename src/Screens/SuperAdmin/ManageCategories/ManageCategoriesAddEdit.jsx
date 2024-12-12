import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAPI from "../../../Hooks/useApi";
import Cropper from "react-easy-crop";
import "../../Master/Categories/styles.css";
import axios from "axios";
import { Dialog } from "primereact/dialog";
import getCroppedImg from "../../../Components/cropImage";
import { Message } from "../../../Components/Message";
import { Image } from "antd";
import Backbtn from "../../../Components/Backbtn";
import { url } from "../../../Address/baseURL";
import { DurationMessage } from "../../../Components/DurationMessage";

const CROP_AREA_ASPECT = 1 / 1;

function ManageCategoriesAddEdit() {
  const navigation = useNavigate();

  const [visible, setVisible] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [rotation, setRotation] = useState(0);
  const params = useParams();
  const { response, callApi } = useAPI();
  const [isCalled, setCalled] = useState(false);
  const [remoteImg, setRemoteImg] = useState(false);
  const [catgName, setCatgName] = useState(null);
  const [compId, setCompId] = useState(null);
  const [shops, setShops] = useState(() => []);
  var comp, catg_name, resp, userId;
  const navigate = useNavigate();

  useEffect(() => {
    console.log(params);
    comp = localStorage.getItem("comp_id");
    if (params.id > 0)
      callApi(
        `/admin/S_Admin/select_category?comp_id=${params.id2}&catg_id=${params.id}`,
        0
      );
    // setDataSet(response?.data?.msg)

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
    if (Array.isArray(response?.data?.msg)) {
      console.log(response);
      setCompId(response?.data?.msg[0].comp_id);
      setCatgName(response?.data?.msg[0].category_name);
      setRemoteImg(url + response?.data?.msg[0].catg_picture);
    }
    if (response?.data?.suc == 0 || response?.data?.msg.length <= 0) {
      Message("error", "Something went wrong!");
    } else {
      if (isCalled && response?.data?.suc == 1) {
        setCalled(false);
        // Message("success", "Success!");
        DurationMessage();
        setTimeout(() => {
          navigation("/home/superadmin/managecategories/view");
        }, 4500);
      }
    }
  }, [response]);

  const imageSubmit = () => {
    setCalled(true);
    if (catgName) {
      comp = localStorage.getItem("comp_id");
      userId = localStorage.getItem("user_id");
      var file = new File(
        [croppedImage],
        catgName.split(" ").join("") + ".png"
      );
      var data = new FormData();
      if (croppedImage) data.append("file", file);
      data.append("comp_id", +compId);
      data.append("catg_id", +params.id);
      data.append("category_name", catgName);
      data.append("created_by", userId);

      console.log(
        "CATEGORY SUPER ADMIN LOG ===>",
        file,
        compId,
        params.id2,
        catgName,
        userId
      );
      callApi(`/admin/S_Admin/add_edit_category`, 1, data);
    }
  };

  return (
    <>
      <Backbtn />

      <section className="bg-white dark:bg-gray-900">
        <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
          <h2 className="mb-4 text-xl font-bold text-blue-900 dark:text-white">
            {params.id > 0 ? "Update category" : "Add category"}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="sm:col-span-2">
              <label
                htmlFor="brand"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Select Shop
              </label>
              <select
                id="comp_id"
                name="comp_id"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
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
            <div className="w-full">
              <label
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                for="file_input">
                Upload file
              </label>
              <input
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
            <div className="w-full">
              <label
                htmlFor="brand"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Category Name
              </label>
              <input
                type="text"
                name="from_dt"
                id="from_dt"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Category name"
                required=""
                value={catgName}
                onChange={(text) => setCatgName(text.target.value)}
              />
              {isCalled && !catgName ? (
                <div className="text-red-500 text-sm">
                  Cateogry Name is required
                </div>
              ) : null}
            </div>
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
          {/* {croppedImage && }
       {remoteImg &&  */}
          {/* </div> */}
          <div className="flex justify-center">
            {params.id == 0 && (
              <button
                type="reset"
                className="inline-flex mr-3 bg-white items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-blue-900 border border-blue-900 bg-primary-700 rounded-full focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
                Reset
              </button>
            )}

            <button
              onClick={imageSubmit}
              type="submit"
              className="inline-flex bg-blue-900 items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-full focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
              Submit
            </button>
          </div>

          <div></div>
        </div>
      </section>

      <Dialog
        header="Cropper"
        maximizable
        visible={visible}
        style={{ width: "50vw", height: "35vw" }}
        onHide={() => setVisible(false)}>
        {/* <p className="m-0"> */}
        <div className="cropper">
          {selectedFile && (
            <Cropper
              image={window.URL.createObjectURL(selectedFile)}
              aspect={CROP_AREA_ASPECT}
              crop={crop}
              zoom={zoom}
              cropSize={{ height: 450, width: 450 }}
              rotation={rotation}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropAreaChange={setCroppedArea}
              onCropComplete={onCropComplete}
            />
          )}
        </div>
        {/* </p> */}
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

export default ManageCategoriesAddEdit;
