import React, { useEffect, useState } from "react";
import DatatableAdv from "../../../Components/DatatableAdv";
import { useNavigate } from "react-router-dom";
import { Message } from "../../../Components/Message";
import useAPI from "../../../Hooks/useApi";
import HeaderLayout from "../../../Components/HeaderLayout";

function ManageSettingsView() {
  const navigation = useNavigate();
  const [called, setCalled] = useState(false);
  const { response, callApi } = useAPI();
  const [resp, setRestp] = useState();
  const [isReport, setIsReport] = useState(false);
  const [dataSet, setDataSet] = useState();
  const [search, setSearch] = useState();

  var comp;

  useEffect(() => {
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
    // comp = localStorage.getItem("comp_id");
    callApi(`/admin/S_Admin/select_settings?comp_id=${0}`, 0);
  }, []);

  const onPress = (data) => {
    console.log(data);
    navigation("/home/superadmin/managesettings/managesetting/" + data.comp_id);
  };

  useEffect(() => {
    setDataSet(
      response?.data?.msg?.filter(
        (e) =>
          e.comp_id
            ?.toString()
            ?.toLowerCase()
            .includes(search?.toString().toLowerCase()) ||
          e.company_name
            ?.toString()
            ?.toLowerCase()
            .includes(search?.toString().toLowerCase())
      )
    );
  }, [search]);
  return (
    <div className="py-1 w-full ">
      <HeaderLayout
        title={"Manage Settings"}
        btnText={"Add Settings"}
        onPress={() => onPress({ comp_id: 0 })}
      />
      <section class="dark:bg-gray-900 p-3 ">
        <div class="mx-auto w-full">
          <div class="bg-blue-900 dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
            <div class="overflow-x-auto">
              <DatatableAdv
                onPress={(data) => onPress(data)}
                setSearch={(val) => setSearch(val)}
                title={"Manage Settings"}
                btnText={"Add Settings"}
                onclick={() => onPress({ comp_id: 0 })}
                flag={1}
                headers={[
                  { name: "comp_id", value: "Company ID" },
                  { name: "company_name", value: "Company" },
                  // { name: "rcpt_type", value: "Receipt Type" },
                  // { name: "gst_flag", value: "GST Flag" },
                  // { name: "gst_type", value: "GST Type" },
                  // { name: "pay_mode", value: "Pay Mode" },
                  // { name: "stock_flag", value: "Stock Flag" },
                  // { name: "discount_type", value: "Discount Type" },
                  // { name: "discount_position", value: "Discount Position" },
                  // { name: "price_type", value: "Price Type" },
                  // { name: "kot_flag", value: "KOT Flag" },
                  // { name: "refund_days", value: "Refund Days" },
                ]}
                data={dataSet}
              />
            </div>
          </div>
        </div>
      </section>
      {/*  */}
    </div>
  );
}

export default ManageSettingsView;
