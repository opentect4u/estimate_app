import React, { useEffect, useState } from "react";
import { Descriptions } from "antd";
import useAPI from "../Hooks/useApi";
import { Message } from "./Message";
import { Skeleton } from "primereact/skeleton";
function ProfileInfo({ flag }) {
  const { response, callApi } = useAPI();
  const [items, setItems] = useState();
  var comp;
  useEffect(() => {
    console.log(response);
    if (Array.isArray(response?.data?.msg)) {
      setItems(response?.data?.msg);
    }

    if (response?.data?.msg?.length <= 0) {
      Message("error", "No data!");
    }
  }, [response]);

  useEffect(() => {
    comp = localStorage.getItem("comp_id");
    if (flag == 1) {
      callApi("/admin/store_profile", 1, { comp_id: +comp });
    } else if (flag == 2)
      callApi("/admin/user_profile", 1, {
        comp_id: +comp,
        user_id: localStorage.getItem("user_id"),
      });
    else {
    }
  }, []);

  return (
    <div>
      {items ? (
        <Descriptions
          title={
            <div className="text-blue-900 font-bold">
              {flag == 1 ? "Store Profile" : "User Profile"}
            </div>
          }
          items={
            flag == 1
              ? [
                  {
                    key: "1",
                    label: (
                      <div className=" text-blue-900 font-bold">Store</div>
                    ),
                    children: items[0]?.company_name
                      ? items[0]?.company_name
                      : "none",
                    span: 2,
                  },
                  {
                    key: "2",
                    label: (
                      <div className=" text-blue-900 font-bold">Phone</div>
                    ),
                    children: items[0]?.phone_no ? items[0]?.phone_no : "none",
                    span: 2,
                  },
                  {
                    key: "3",
                    label: (
                      <div className=" text-blue-900 font-bold">
                        {" "}
                        Contact person
                      </div>
                    ),
                    children: items[0]?.contact_person
                      ? items[0]?.contact_person
                      : "none",
                    span: 2,
                  },
                  {
                    key: "4",
                    label: (
                      <div className=" text-blue-900 font-bold"> Email</div>
                    ),
                    children: items[0]?.email_id ? items[0]?.email_id : "none",
                    span: 2,
                  },
                  {
                    key: "5",
                    label: (
                      <div className=" text-blue-900 font-bold"> Address</div>
                    ),
                    children: items[0]?.address ? items[0]?.address : "none",
                    span: 3,
                  },
                ]
              : [
                  {
                    key: "1",
                    label: (
                      <div className=" text-blue-900 font-bold"> User name</div>
                    ),
                    children: items[0]?.user_name
                      ? items[0]?.user_name
                      : "none",
                    span: 1,
                  },
                  {
                    key: "2",
                    label: <div className=" text-blue-900 font-bold"> ID</div>,
                    children: items[0]?.user_id ? items[0]?.user_id : "none",
                    span: 3,
                  },
                  {
                    key: "3",
                    label: (
                      <div className=" text-blue-900 font-bold"> Phone</div>
                    ),
                    children: items[0]?.phone_no ? items[0]?.phone_no : "none",
                    span: 1,
                  },
                  {
                    key: "4",
                    label: (
                      <div className=" text-blue-900 font-bold"> Email</div>
                    ),
                    children: items[0]?.email_id ? items[0]?.email_id : "none",
                    span: 3,
                  },
                ]
          }
        />
      ) : (
        <>
          <Skeleton className="mb-2"></Skeleton>
          <Skeleton width="10rem" className="mb-2"></Skeleton>
          <Skeleton width="5rem" className="mb-2"></Skeleton>
          <Skeleton height="2rem" className="mb-2"></Skeleton>
        </>
      )}
    </div>
  );
}

export default ProfileInfo;
