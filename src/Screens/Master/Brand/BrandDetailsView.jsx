import React, { useEffect, useState } from "react";
import DatatableAdv from "../../../Components/DatatableAdv";
import { useNavigate } from "react-router-dom";
import { Message } from "../../../Components/Message";
import useAPI from "../../../Hooks/useApi";
import HeaderLayout from "../../../Components/HeaderLayout";

function BrandDetailsView() {
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
    callApi(`/admin/brand_dtls`, 1, {
      // catg_id: 0,
      brand_id: 0,
    });
  }, []);

  const onPress = (data) => {
    console.log(data);
    navigation("/home/master/brand/brandedit/" + data.brand_id);
  };

  useEffect(() => {
    setDataSet(
      response?.data?.msg?.filter((e) =>
        e.brand_name.toLowerCase().includes(search?.toString().toLowerCase())
      )
    );
  }, [search]);
  return (
    <div className="py-1 w-full ">
      <HeaderLayout
        title={"Manage Brands"}
        btnText={"Add brand"}
        onPress={() => onPress({ brand_id: 0 })}
      />
      <section class="dark:bg-gray-900 p-3 ">
        <div class="mx-auto w-full">
          <div class="bg-blue-900 dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
            <div class="overflow-x-auto">
              <DatatableAdv
                onPress={(data) => onPress(data)}
                setSearch={(val) => setSearch(val)}
                title={"Manage Brands"}
                btnText={"Add Brand"}
                onclick={() => onPress({ brand_id: 0 })}
                flag={1}
                headers={[
                  // { name: "id", value: "#" },
                  { name: "brand_name", value: "Brand" },
                  // { name: "category_name", value: "Category" },
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

export default BrandDetailsView;
