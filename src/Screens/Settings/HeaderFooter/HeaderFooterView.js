import React, { useEffect, useState } from "react";
import { Badge, Descriptions } from "antd";
import { DescriptionsProps } from "antd";
import useAPI from "../../../Hooks/useApi";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";

function HeaderFooterView() {
  const [resp, setRest] = useState();
  const navigation = useNavigate();

  const [f1, setF1] = useState(false);
  const [f2, setF2] = useState(false);
  const [f3, setF3] = useState(false);
  const [f4, setF4] = useState(false);
  const { response, callApi } = useAPI();
  var comp;
  useEffect(() => {
    console.log(response);
    setF1(response?.data?.msg[0]?.on_off_flag1);
    setF2(response?.data?.msg[0]?.on_off_flag2);
    setF3(response?.data?.msg[0]?.on_off_flag3);
    setF4(response?.data?.msg[0]?.on_off_flag4);
  }, [response]);

  useEffect(() => {
    comp = localStorage.getItem("comp_id");
    callApi("/admin/header_footer_details", 1, { comp_id: +comp });
  }, []);
  const items = [
    {
      key: "1",
      label: <div className=" text-blue-900 font-bold">Company</div>,
      children: localStorage.getItem("company_name"),
    },
    {
      key: "2",
      label: <div className=" text-blue-900 font-bold">Header1 Flag</div>,
      children:
        f1 == "Y" ? (
          <DoneIcon className="text-green-800" />
        ) : (
          <CloseIcon className="text-red-800" />
        ),
    },
    {
      key: "3",
      label: <div className=" text-blue-900 font-bold">Header2 Flag</div>,
      children:
        f2 == "Y" ? (
          <DoneIcon className="text-green-800" />
        ) : (
          <CloseIcon className="text-red-800" />
        ),
    },
    {
      key: "4",
      label: <div className=" text-blue-900 font-bold">Footer1 Flag</div>,
      children:
        f3 == "Y" ? (
          <DoneIcon className="text-green-800" />
        ) : (
          <CloseIcon className="text-red-800" />
        ),
    },
    {
      key: "5",
      label: <div className=" text-blue-900 font-bold">Footer2 Flag</div>,
      children: (
        <div className="flex justify-start items-center">
          {f4 == "Y" ? (
            <DoneIcon className="text-green-800" />
          ) : (
            <CloseIcon className="text-red-800" />
          )}
          <Tooltip title="View and edit">
            <button
              type="submit"
              onClick={() =>
                navigation("/home/settings/headerfooter/hfdetails")
              }
              className="absolute right-12 bg-blue-900 items-center justify-center  text-sm font-medium text-center text-white bg-primary-700 rounded-full h-10 w-10  focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
              <EditIcon />
            </button>
          </Tooltip>
        </div>
      ),
      span: 2,
    },
  ];
  return (
    <div className="my-10">
      <Descriptions
        title={
          <div className="text-blue-900 font-bold">Header/Footer info. </div>
        }
        bordered
        items={items}
      />
    </div>
  );
}

export default HeaderFooterView;
