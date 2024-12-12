import React, { useEffect, useState } from "react";
import axios from "axios";
import DatatableAdv from "../../../Components/DatatableAdv";
import { useNavigate, useParams } from "react-router-dom";
import { Message } from "../../../Components/Message";
import useAPI from "../../../Hooks/useApi";
import HeaderLayout from "../../../Components/HeaderLayout";
import { url } from "../../../Address/baseURL";

function ManageOutletsView() {
  const params = useParams();
  const navigation = useNavigate();
  const [called, setCalled] = useState(false);
  const { response, callApi } = useAPI();
  const [resp, setRestp] = useState();
  const [isReport, setIsReport] = useState(false);
  const [compId, setCompId] = useState(null);
  const [shops, setShops] = useState(() => []);
  const [dataSet, setDataSet] = useState();
  const [search, setSearch] = useState();

  var comp;

  useEffect(() => {
    setCompId(compId ?? localStorage.getItem("compIdx") ?? undefined);
    console.log(response);
    setDataSet(response?.data?.msg);

    if (response?.data?.msg?.length <= 0) {
      Message("error", "No data!");
      setIsReport(false);
    } else {
      if (called) {
        setDataSet(response?.data?.msg);
        setIsReport(true);
        setCalled(false);
      }
    }
  }, [response]);

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
    // comp = localStorage.getItem("comp_id");
    let compIdx = compId ?? localStorage.getItem("compIdx") ?? undefined;

    callApi(`/admin/S_Admin/select_outlet?comp_id=${compIdx}`, 0);
    // callApi(`/admin/S_Admin/select_one_outlet?comp_id=${0}&br_id=${0}`, 0);
  }, [compId]);

  useEffect(() => {
    localStorage.removeItem("compIdx");
  }, [compId]);

  const onPress = (data) => {
    console.log(data);
    navigation(
      "/home/superadmin/manageoutlets/manageoutlet/" +
        data.id +
        "/" +
        data.comp_id
    );
  };

  useEffect(() => {
    setDataSet(
      response?.data?.msg?.filter(
        (e) =>
          e.branch_name
            .toLowerCase()
            .includes(search?.toString().toLowerCase()) ||
          e.email_id
            ?.toString()
            .toLowerCase()
            .includes(search?.toString().toLowerCase()) ||
          e.phone_no
            ?.toString()
            .toLowerCase()
            .includes(search?.toString().toLowerCase())
      )
    );
  }, [search]);
  return (
    <div className="py-1 w-full ">
      <HeaderLayout
        title={"Manage Outlets"}
        btnText={"Add Outlet"}
        onPress={() => onPress({ id: 0 })}
      />
      <section class="dark:bg-gray-900 p-3 ">
        <div className="my-4 w-full">
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
            <option selected value={undefined}>
              Select Shop
            </option>

            {shops?.map((items, i) => (
              <option key={i} value={items?.id}>
                {items?.company_name}
              </option>
            ))}
          </select>
          {called && !compId ? (
            <div className="text-red-500 text-sm">Shop Name is required</div>
          ) : null}
        </div>
        <div class="mx-auto w-full">
          <div class="bg-blue-900 dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
            <div class="overflow-x-auto">
              <DatatableAdv
                onPress={(data) => onPress(data)}
                setSearch={(val) => setSearch(val)}
                title={"Manage Outlets"}
                btnText={"Add Outlet"}
                onclick={() => onPress({ id: 0 })}
                flag={1}
                headers={[
                  { name: "id", value: "Outlet ID" },
                  // { name: "comp_id", value: "Company ID" },
                  { name: "branch_name", value: "Outlet Name" },
                  { name: "phone_no", value: "Phone Number" },
                  { name: "email_id", value: "Email" },
                ]}
                data={dataSet}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ManageOutletsView;
