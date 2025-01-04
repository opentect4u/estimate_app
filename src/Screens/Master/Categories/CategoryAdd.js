import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAPI from "../../../Hooks/useApi";
import Cropper from "react-easy-crop";
import "./styles.css";

import { Dialog } from "primereact/dialog";
import getCroppedImg from "../../../Components/cropImage";
import { Message } from "../../../Components/Message";
import { Image } from "antd";
import Backbtn from "../../../Components/Backbtn";
import { url } from "../../../Address/baseURL";

const CROP_AREA_ASPECT = 1 / 1;

function CategoryAdd() {
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
  var comp, catg_name, resp;
  const navigate = useNavigate();

  useEffect(() => {
    console.log(params);
    comp = localStorage.getItem("comp_id");
    if (params.id > 0)
      callApi("/admin/category_dtls", 1, {
        comp_id: +comp,
        catg_id: +params.id,
      });
    // setDataSet(response?.data?.msg)
  }, [isCalled]);
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
      setCatgName(response?.data?.msg[0].category_name);
      setRemoteImg(url + response?.data?.msg[0].catg_picture);
    }
    if (response?.data?.suc == 0 || response?.data?.msg.length <= 0) {
      Message("error", "Something went wrong!");
    } else {
      if (isCalled && response?.data?.suc == 1) {
        setCalled(false);
        Message("success", "Success!");
      }
    }
  }, [response]);

  const imageSubmit = () => {
    setCalled(true);
    if (catgName) {
      comp = localStorage.getItem("comp_id");
      var file = new File(
        [croppedImage],
        catgName.split(" ").join("") + ".png"
      );
      var data = new FormData();
      if (croppedImage) data.append("file", file);
      data.append("comp_id", comp);
      data.append("catg_id", params.id);
      data.append("category_name", catgName);
      data.append("user_id", localStorage.getItem("user_id"));
      callApi(`/admin/add_edit_category`, 1, data);
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
                Name
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
                <div className="text-red-500 text-sm">Name is required</div>
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

export default CategoryAdd;
