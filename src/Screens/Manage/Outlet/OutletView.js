import React, { useEffect, useState } from "react";
import DatatableAdv from "../../../Components/DatatableAdv";
import { useNavigate } from "react-router-dom";
import { Message } from "../../../Components/Message";
import useAPI from "../../../Hooks/useApi";
import HeaderLayout from "../../../Components/HeaderLayout";

function OutletView() {
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
    setDataSet(
      response?.data?.msg?.filter(
        (e) =>
          e.branch_name
            .toLowerCase()
            .includes(search?.toString().toLowerCase()) ||
          e.contact_person
            .toLowerCase()
            .includes(search?.toString().toLowerCase()) ||
          e.phone_no
            .toString()
            .toLowerCase()
            .includes(search?.toString().toLowerCase()) ||
          e.email_id.toLowerCase().includes(search?.toString().toLowerCase())
      )
    );
  }, [search]);
  useEffect(() => {
    comp = localStorage.getItem("comp_id");
    callApi("/admin/outlet_list", 1, { comp_id: +comp });
  }, []);
  const onPress = (data) => {
    navigation("/home/manage/outlet/outletaddedit/" + data.id);
  };
  return (
    <div className="py-1 w-full ">
      <HeaderLayout
        title={"Outlet Management"}
        btnText={"Add outlet"}
        onPress={() => onPress({ id: 0 })}
      />
      <section class="bg-gray-50 dark:bg-gray-900 p-3 ">
        <div class="mx-auto w-full">
          <div class="bg-blue-900 dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
            <div class="overflow-x-auto">
              <DatatableAdv
                onPress={(data) => onPress(data)}
                setSearch={(val) => setSearch(val)}
                flag={1}
                title={"Outlet Management"}
                btnText={"Add outlet"}
                onclick={() => onPress({ id: 0 })}
                headers={[
                  { name: "id", value: "#" },
                  { name: "branch_name", value: "Outlet" },
                  { name: "contact_person", value: "Contact person" },
                  ,
                  { name: "phone_no", value: "Phone No." },
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

export default OutletView;
