import React, { useEffect, useState } from "react";
import DatatableAdv from "../../../Components/DatatableAdv";
import { useNavigate } from "react-router-dom";
import { Message } from "../../../Components/Message";
import useAPI from "../../../Hooks/useApi";
import HeaderLayout from "../../../Components/HeaderLayout";
function CategoryView() {
  const navigation = useNavigate();
  const [called, setCalled] = useState(false);
  const { response, callApi } = useAPI();
  const [isReport, setIsReport] = useState(false);
  const [dataSet, setDataSet] = useState();
  const [search, setSearch] = useState("");
  var comp, resp;

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
    callApi("/admin/category_list", 1, { comp_id: +comp });
  }, []);
  useEffect(() => {
    setDataSet(
      response?.data?.msg?.filter((e) =>
        e.category_name.toLowerCase().includes(search.toString().toLowerCase())
      )
    );
  }, [search]);
  useEffect(() => {
    console.log(response, "category_list");
    {
      resp = response?.data?.msg;
      console.log(resp, "resp");
    }
  });
  const onPress = (data) => {
    navigation("/home/master/category/categoryedit/" + data.sl_no);
  };
  return (
    <div className="py-1 w-full ">
      <HeaderLayout
        title={"Category Management"}
        btnText={"Add category"}
        onPress={() => onPress({ sl_no: 0 })}
      />
      <section class="bg-gray-50 dark:bg-gray-900 p-3 ">
        <div class="mx-auto w-full">
          <div class="bg-blue-900 dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
            <div class="overflow-x-auto">
              <DatatableAdv
                onPress={(data) => onPress(data)}
                title={"Category Management"}
                btnText={"Add Category"}
                onclick={() => onPress({ sl_no: 0 })}
                setSearch={(val) => setSearch(val)}
                flag={1}
                headers={[
                  { name: "sl_no", value: "#" },
                  { name: "category_name", value: "Name" },
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

export default CategoryView;
