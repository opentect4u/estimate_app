import React, { useEffect, useState } from "react";
import DatatableAdv from "../../../Components/DatatableAdv";
import { useNavigate } from "react-router-dom";
import { Message } from "../../../Components/Message";
import useAPI from "../../../Hooks/useApi";
import HeaderLayout from "../../../Components/HeaderLayout";

function CustomerView() {
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
    comp = localStorage.getItem("comp_id");
    callApi("/admin/all_customer_list", 1, { comp_id: +comp });
  }, []);
  const onPress = (data) => {
    navigation("/home/manage/customer/custedit/" + data.cust_id);
  };
  useEffect(() => {
    setDataSet(
      response?.data?.msg?.filter(
        (e) =>
          e.cust_name
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
        title={"Customer Management"}
        btnText={"Add customer"}
        onPress={() => onPress({ cust_id: 0 })}
      />
      <section class="bg-gray-50 dark:bg-gray-900 p-3 ">
        <div class="mx-auto w-full">
          <div class="bg-blue-900 dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
            <div class="overflow-x-auto">
              <DatatableAdv
                onPress={(data) => onPress(data)}
                setSearch={(val) => setSearch(val)}
                title={"Customer Management"}
                btnText={"Add customer"}
                onclick={() => onPress({ cust_id: 0 })}
                flag={1}
                headers={[
                  { name: "cust_id", value: "#" },
                  { name: "cust_name", value: "Name" },
                  { name: "phone_no", value: "Phone No." },
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

export default CustomerView;
