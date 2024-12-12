import React, { useEffect, useState } from "react";
import DatatableAdv from "../../../Components/DatatableAdv";
import { useNavigate } from "react-router-dom";
import { Message } from "../../../Components/Message";
import useAPI from "../../../Hooks/useApi";
import HeaderLayout from "../../../Components/HeaderLayout";

function ManageShopsView() {
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
    callApi(`/admin/S_Admin/select_header_footer?comp_id=${0}`, 0);
  }, []);

  const onPress = (data) => {
    console.log(data);
    navigation(
      "/home/superadmin/manageheaderfooters/manageheaderfooter/" + data.comp_id
    );
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
            .toLowerCase()
            .includes(search?.toString().toLowerCase())
      )
    );
  }, [search]);
  return (
    <div className="py-1 w-full ">
      <HeaderLayout
        title={"Manage Headers/Footers"}
        btnText={"Add Header/Footer"}
        onPress={() => onPress({ comp_id: 0 })}
      />
      <section class="dark:bg-gray-900 p-3 ">
        <div class="mx-auto w-full">
          <div class="bg-blue-900 dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
            <div class="overflow-x-auto">
              <DatatableAdv
                onPress={(data) => onPress(data)}
                setSearch={(val) => setSearch(val)}
                title={"Manage Headers/Footers"}
                btnText={"Add Header/Footer"}
                onclick={() => onPress({ comp_id: 0 })}
                flag={1}
                headers={[
                  { name: "comp_id", value: "Company ID" },
                  { name: "company_name", value: "Company" },
                  // { name: "header1", value: "Header 1" },
                  // { name: "on_off_flag1", value: "Header 1 Flag" },
                  // { name: "header2", value: "Header 2" },
                  // { name: "on_off_flag2", value: "Header 2 Flag" },
                  // { name: "footer1", value: "Footer 1" },
                  // { name: "on_off_flag3", value: "Footer 1 Flag" },
                  // { name: "footer2", value: "Footer 2" },
                  // { name: "on_off_flag4", value: "Footer 2 Flag" },
                  // { name: "max_user", value: "Max User" },
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

export default ManageShopsView;
