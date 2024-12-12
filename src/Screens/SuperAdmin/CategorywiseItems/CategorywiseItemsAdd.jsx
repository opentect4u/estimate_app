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
import { Transfer } from "antd";

function CategorywiseItemsAdd() {
  const navigation = useNavigate();

  const params = useParams();
  const { response, callApi } = useAPI();
  const [isCalled, setCalled] = useState(false);
  const [compId, setCompId] = useState(null);
  const [catgId, setCatgId] = useState(null);
  const [shops, setShops] = useState(() => []);
  const [categories, setCategories] = useState(() => []);
  const [items, setItems] = useState(() => []);
  var comp;
  const navigate = useNavigate();

  ///////////////////////////////////////////////////////////////

  //   const mockData = Array.from({
  //     length: 20,
  //   }).map((_, i) => ({
  //     key: i.toString(),
  //     title: `content${i + 1}`,
  //     description: `description of content${i + 1}`,
  //   }));

  const rawItemsData = items?.map((item, i) => ({
    key: parseInt(item?.item_id),
    title: item?.item_name,
    disabled: item?.catg_id !== 0 || !catgId,
  }));

  const initialTargetKeys = rawItemsData;
  // ?.filter((item) => Number(item.key) > 10)
  // ?.map((item) => item.key);

  const [targetKeys, setTargetKeys] = useState(initialTargetKeys);
  const [selectedKeys, setSelectedKeys] = useState([]);
  //   const [disabledItem, setDisabledItem] = useState(false);
  const onChange = (nextTargetKeys, direction, moveKeys) => {
    console.log("targetKeys:", nextTargetKeys);
    console.log("direction:", direction);
    console.log("moveKeys:", moveKeys);
    setTargetKeys(nextTargetKeys);
  };
  const onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    console.log("sourceSelectedKeys:", sourceSelectedKeys);
    console.log("targetSelectedKeys:", targetSelectedKeys);
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };
  const onScroll = (direction, e) => {
    // console.log("direction:", direction);
    // console.log("target:", e.target);
  };

  //   const handleDisable = (checked) => {
  //     setDisabledItem(checked);
  //   };

  ///////////////////////////////////////////////////////////////

  useEffect(() => {
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
    axios
      .get(`${url}/admin/S_Admin/catg_list?comp_id=${compId || 0}`)
      .then((res) => {
        setCategories(res?.data?.msg);
      })
      .catch((err) => {
        setCategories(() => []);
      });
  }, [compId]);

  useEffect(() => {
    axios
      .get(`${url}/admin/S_Admin/item_detail?comp_id=${compId || 0}`)
      .then((res) => {
        setItems(res?.data?.msg);
      })
      .catch((err) => {
        setItems(() => []);
      });
  }, [compId]);

  const onSubmit = () => {
    let payload = {
      comp_id: +compId,
      catg_id: +catgId,
      item_id: Array.from(targetKeys),
    };

    callApi("/admin/S_Admin/categorywise_items", 1, payload);
    console.log("GADUGFDYSAVGD");
    setCalled(true);
  };

  useEffect(() => {
    if (response?.data?.suc == 0) {
      Message("error", "Something went wrong!");
    } else {
      if (isCalled && response?.data?.suc == 1) {
        setCalled(false);
        Message("success", "Success!");

        setCategories(() => []);
        setItems(() => []);
        setCompId(() => 0);
        setTargetKeys(() => []);
        setSelectedKeys(() => []);
      }
    }
  }, [response]);

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2 className="mb-4 text-xl font-bold text-blue-900 dark:text-white">
          Add categorywise Items
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          <div className="w-full">
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
              <option selected>Select Shop</option>

              {shops?.map((items, i) => (
                <option key={i} value={items?.id}>
                  {items?.company_name}
                </option>
              ))}
            </select>
            {isCalled && !compId ? (
              <div className="text-red-500 text-sm">Shop Name is required</div>
            ) : null}
          </div>
          <div className="w-full">
            <label
              htmlFor="brand"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Select Category
            </label>
            <select
              id="catg_id"
              name="catg_id"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              onChange={(e) => setCatgId(e.target.value)}
              // onBlur={() => null}
              value={catgId}>
              <option selected="">Select Category</option>

              {categories?.map((items, i) => (
                <option key={i} value={items?.catg_id}>
                  {items?.category_name}
                </option>
              ))}
            </select>
            {isCalled && !compId ? (
              <div className="text-red-500 text-sm">Category is required</div>
            ) : null}
          </div>
          <div className="sm:col-span-2">
            <Transfer
              className="align-middle justify-center"
              dataSource={rawItemsData}
              titles={[
                "Products",
                categories?.find((cat) => cat?.catg_id == catgId)
                  ?.category_name,
              ]}
              listStyle={{
                width: 250,
                height: 300,
              }}
              operations={["Select", "Back"]}
              targetKeys={targetKeys}
              selectedKeys={selectedKeys}
              onChange={onChange}
              onSelectChange={onSelectChange}
              onScroll={onScroll}
              //   showSearch
              //   onSearch={handleSearch}
              render={(item) => item.title}
            />
          </div>
        </div>

        <div className="flex justify-center">
          {params.id == 0 && (
            <button
              type="reset"
              className="inline-flex mr-3 bg-white items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-blue-900 border border-blue-900 bg-primary-700 rounded-full focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
              Reset
            </button>
          )}

          <button
            onClick={onSubmit}
            type="submit"
            className="inline-flex bg-blue-900 items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-full focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
            Submit
          </button>
        </div>

        <div></div>
      </div>
    </section>
  );
}

export default CategorywiseItemsAdd;
