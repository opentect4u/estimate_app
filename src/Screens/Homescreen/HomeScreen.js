import { Button } from "primereact/button";
import { Chart } from "primereact/chart";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Menu } from "primereact/menu";
import React, { useContext, useEffect, useRef, useState } from "react";
// import { ProductService } from "../../demo/service/ProductService";
// import { LayoutContext } from "../../layout/context/layoutcontext";
// import Link from "next/link";
// import { Demo } from "@/types";
// import { ChartData, ChartOptions } from "chart.js";

import "./HomeScreen.css";
import { Card, Col, Row, Statistic } from "antd";
import DashboardCard from "../../Components/DashboardCard";
import useAPI from "../../Hooks/useApi";
import axios from "axios";
import { url } from "../../Address/baseURL";

const HomeScreen = () => {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [called, setCalled] = useState(false);
  const [users, setUsers] = useState();
  const [userType, setUserType] = useState("");

  const { response, callApi } = useAPI();

  var comp;
  var userId;

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const data = {
      labels: ["Profit", "Loss", "Average"],
      datasets: [
        {
          data: [300, 50, 100],
          backgroundColor: [
            documentStyle.getPropertyValue("--blue-500"),
            documentStyle.getPropertyValue("--red-500"),
            documentStyle.getPropertyValue("--green-500"),
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue("--blue-400"),
            documentStyle.getPropertyValue("--red-400"),
            documentStyle.getPropertyValue("--green-400"),
          ],
        },
      ],
    };
    const options = {
      cutout: "60%",
    };

    setChartData(data);
    setChartOptions(options);
  }, []);

  const [chartDataLine, setChartDataLine] = useState({});
  const [chartOptionsLine, setChartOptionsLine] = useState({});

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary = documentStyle.getPropertyValue(
      "--text-color-secondary"
    );
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");
    const data = {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          label: "First Dataset",
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          tension: 0.4,
          borderColor: documentStyle.getPropertyValue("--blue-500"),
        },
        {
          label: "Second Dataset",
          data: [28, 48, 40, 19, 86, 27, 90],
          fill: false,
          borderDash: [5, 5],
          tension: 0.4,
          borderColor: documentStyle.getPropertyValue("--teal-500"),
        },
        {
          label: "Third Dataset",
          data: [12, 51, 62, 33, 21, 62, 45],
          fill: true,
          borderColor: documentStyle.getPropertyValue("--orange-500"),
          tension: 0.4,
          backgroundColor: "rgba(255,167,38,0.2)",
        },
      ],
    };
    const options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
      },
    };

    setChartDataLine(data);
    setChartOptionsLine(options);
  }, []);

  let DASHBOARD_DATA = [];

  useEffect(() => {
    comp = localStorage.getItem("comp_id");
    callApi("/admin/user_list", 1, { comp_id: +comp, br_id: 0 });
    setCalled(!called);
  }, []);

  // useEffect(() => {
  //   setUsers(response?.data?.msg);
  //   setCalled(!called);
  // }, [called]);

  // useEffect(() => {
  DASHBOARD_DATA = [
    {
      header: "Users",
      body: 4,
      footerNumber: "24",
      footerText: "new since last visit",
      borderColor: "border-pink-200",
      primaryTextColor: "text-pink-900",
      secondaryColor: "bg-pink-200",
      svg: "bg-ani",
    },
    {
      header: "Cash",
      body: "152",
      footerNumber: "24",
      footerText: "new since last visit",
      borderColor: "border-green-200",
      primaryTextColor: "text-green-900",
      secondaryColor: "bg-green-200",
      svg: "bg-anitwo",
    },
    {
      header: "Stocks",
      body: "152",
      footerNumber: "24",
      footerText: "new since last visit",
      borderColor: "border-purple-300",
      primaryTextColor: "text-blue-900",
      secondaryColor: "bg-blue-100",
      svg: "bg-ani3",
    },
    {
      header: "Bills",
      body: "152",
      footerNumber: "24",
      footerText: "new since last visit",
      borderColor: "border-amber-200",
      primaryTextColor: "text-amber-900",
      secondaryColor: "bg-amber-200",
      svg: "bg-ani4",
    },
  ];
  // }, []);

  useEffect(() => {
    userId = localStorage.getItem("user_id");
    // callApi(`/admin/S_Admin/user_type?user_id=${userId}`, 0);
    // callApi(`/admin/S_Admin/select_one_outlet?comp_id=${0}&br_id=${0}`, 0);

    axios
      .get(`${url}/admin/S_Admin/user_type?user_id=${userId}`)
      .then((res) => {
        setUserType(res?.data?.msg[0]?.user_type);
      });

    // console.log(response?.data?.msg[0]?.user_type);
    // console.log(items.filter((item) => item.key === "sub33"));
  }, []);

  return (
    <>
      {/* <div className="flex flex-col sm:grid sm:grid-cols-4 gap-4">
        {DASHBOARD_DATA?.map((item, i) => (
          <div key={i} className="col-span-1 sm:w-full">
            <DashboardCard
              header={item?.header}
              body={item?.body}
              footerNumber={item?.footerNumber}
              footerText={item?.footerText}
              borderColor={item?.borderColor}
              primaryTextColor={item?.primaryTextColor}
              secondaryColor={item?.secondaryColor}
              svg={item?.svg}
            />
          </div>
        ))}
      </div> */}

      {userType === "S" ? (
        <div className="grid grid-cols-5 gap-5 my-10 align-middle -z-50 text-lg">
          {/* <div className="col-span-2 bg-white z-10 rounded-2xl flex justify-center items-center shadow-xl h-fit p-10">
            <Chart
              type="doughnut"
              data={chartData}
              options={chartOptions}
              style={{
                width: "70%",
                height: 350,
              }}
            />
          </div>
          <div className="col-span-3 bg-white z-10 rounded-2xl flex justify-center items-center shadow-xl h-fit p-10">
            <Chart
              type="line"
              data={chartDataLine}
              options={chartOptionsLine}
              // height="380px"
              className="my-16"
              style={{
                width: "90%",
                height: 350,
              }}
            />
          </div> */}
          Superuser Dashboard
        </div>
      ) : userType === "M" ? (
        <div className="mt-5 text-2xl">Outlet Dashboard</div>
      ) : (
        <div className="mt-5 text-2xl">Admin Dashboard</div>
      )}
    </>

    // <div className="grid">
    //   <div className="col-12 lg:col-6 xl:col-3">
    //     <div className="card mb-0">
    //       <div className="flex justify-content-between mb-3">
    //         <div>
    //           <span className="block text-500 font-medium mb-3">Orders</span>
    //           <div className="text-900 font-medium text-xl">152</div>
    //         </div>
    //         <div
    //           className="flex align-items-center justify-content-center bg-blue-100 border-round"
    //           style={{ width: "2.5rem", height: "2.5rem" }}>
    //           <i className="pi pi-shopping-cart text-blue-500 text-xl" />
    //         </div>
    //       </div>
    //       <span className="text-green-500 font-medium">24 new </span>
    //       <span className="text-500">since last visit</span>
    //     </div>
    //   </div>
    //   <div className="col-12 lg:col-6 xl:col-3">
    //     <div className="card mb-0">
    //       <div className="flex justify-content-between mb-3">
    //         <div>
    //           <span className="block text-500 font-medium mb-3">Revenue</span>
    //           <div className="text-900 font-medium text-xl">$2.100</div>
    //         </div>
    //         <div
    //           className="flex align-items-center justify-content-center bg-orange-100 border-round"
    //           style={{ width: "2.5rem", height: "2.5rem" }}>
    //           <i className="pi pi-map-marker text-orange-500 text-xl" />
    //         </div>
    //       </div>
    //       <span className="text-green-500 font-medium">%52+ </span>
    //       <span className="text-500">since last week</span>
    //     </div>
    //   </div>
    //   <div className="col-12 lg:col-6 xl:col-3">
    //     <div className="card mb-0">
    //       <div className="flex justify-content-between mb-3">
    //         <div>
    //           <span className="block text-500 font-medium mb-3">Customers</span>
    //           <div className="text-900 font-medium text-xl">28441</div>
    //         </div>
    //         <div
    //           className="flex align-items-center justify-content-center bg-cyan-100 border-round"
    //           style={{ width: "2.5rem", height: "2.5rem" }}>
    //           <i className="pi pi-inbox text-cyan-500 text-xl" />
    //         </div>
    //       </div>
    //       <span className="text-green-500 font-medium">520 </span>
    //       <span className="text-500">newly registered</span>
    //     </div>
    //   </div>
    //   <div className="col-12 lg:col-6 xl:col-3">
    //     <div className="card mb-0">
    //       <div className="flex justify-content-between mb-3">
    //         <div>
    //           <span className="block text-500 font-medium mb-3">Comments</span>
    //           <div className="text-900 font-medium text-xl">152 Unread</div>
    //         </div>
    //         <div
    //           className="flex align-items-center justify-content-center bg-purple-100 border-round"
    //           style={{ width: "2.5rem", height: "2.5rem" }}>
    //           <i className="pi pi-comment text-purple-500 text-xl" />
    //         </div>
    //       </div>
    //       <span className="text-green-500 font-medium">85 </span>
    //       <span className="text-500">responded</span>
    //     </div>
    //   </div>

    //   <div className="col-12 xl:col-6">
    //     <div className="card">
    //       <h5>Recent Sales</h5>
    //       <DataTable
    //         value={products}
    //         rows={5}
    //         paginator
    //         responsiveLayout="scroll">
    //         <Column
    //           header="Image"
    //           body={(data) => (
    //             <img
    //               className="shadow-2"
    //               src={`/demo/images/product/${data.image}`}
    //               alt={data.image}
    //               width="50"
    //             />
    //           )}
    //         />
    //         <Column
    //           field="name"
    //           header="Name"
    //           sortable
    //           style={{ width: "35%" }}
    //         />
    //         <Column
    //           field="price"
    //           header="Price"
    //           sortable
    //           style={{ width: "35%" }}
    //           body={(data) => formatCurrency(data.price)}
    //         />
    //         <Column
    //           header="View"
    //           style={{ width: "15%" }}
    //           body={() => (
    //             <>
    //               <Button icon="pi pi-search" text />
    //             </>
    //           )}
    //         />
    //       </DataTable>
    //     </div>
    //     <div className="card">
    //       <div className="flex justify-content-between align-items-center mb-5">
    //         <h5>Best Selling Products</h5>
    //         <div>
    //           <Button
    //             type="button"
    //             icon="pi pi-ellipsis-v"
    //             rounded
    //             text
    //             className="p-button-plain"
    //             onClick={(event) => menu1.current?.toggle(event)}
    //           />
    //           <Menu
    //             ref={menu1}
    //             popup
    //             model={[
    //               { label: "Add New", icon: "pi pi-fw pi-plus" },
    //               { label: "Remove", icon: "pi pi-fw pi-minus" },
    //             ]}
    //           />
    //         </div>
    //       </div>
    //       <ul className="list-none p-0 m-0">
    //         <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
    //           <div>
    //             <span className="text-900 font-medium mr-2 mb-1 md:mb-0">
    //               Space T-Shirt
    //             </span>
    //             <div className="mt-1 text-600">Clothing</div>
    //           </div>
    //           <div className="mt-2 md:mt-0 flex align-items-center">
    //             <div
    //               className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem"
    //               style={{ height: "8px" }}>
    //               <div
    //                 className="bg-orange-500 h-full"
    //                 style={{ width: "50%" }}
    //               />
    //             </div>
    //             <span className="text-orange-500 ml-3 font-medium">%50</span>
    //           </div>
    //         </li>
    //         <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
    //           <div>
    //             <span className="text-900 font-medium mr-2 mb-1 md:mb-0">
    //               Portal Sticker
    //             </span>
    //             <div className="mt-1 text-600">Accessories</div>
    //           </div>
    //           <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
    //             <div
    //               className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem"
    //               style={{ height: "8px" }}>
    //               <div
    //                 className="bg-cyan-500 h-full"
    //                 style={{ width: "16%" }}
    //               />
    //             </div>
    //             <span className="text-cyan-500 ml-3 font-medium">%16</span>
    //           </div>
    //         </li>
    //         <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
    //           <div>
    //             <span className="text-900 font-medium mr-2 mb-1 md:mb-0">
    //               Supernova Sticker
    //             </span>
    //             <div className="mt-1 text-600">Accessories</div>
    //           </div>
    //           <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
    //             <div
    //               className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem"
    //               style={{ height: "8px" }}>
    //               <div
    //                 className="bg-pink-500 h-full"
    //                 style={{ width: "67%" }}
    //               />
    //             </div>
    //             <span className="text-pink-500 ml-3 font-medium">%67</span>
    //           </div>
    //         </li>
    //         <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
    //           <div>
    //             <span className="text-900 font-medium mr-2 mb-1 md:mb-0">
    //               Wonders Notebook
    //             </span>
    //             <div className="mt-1 text-600">Office</div>
    //           </div>
    //           <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
    //             <div
    //               className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem"
    //               style={{ height: "8px" }}>
    //               <div
    //                 className="bg-green-500 h-full"
    //                 style={{ width: "35%" }}
    //               />
    //             </div>
    //             <span className="text-green-500 ml-3 font-medium">%35</span>
    //           </div>
    //         </li>
    //         <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
    //           <div>
    //             <span className="text-900 font-medium mr-2 mb-1 md:mb-0">
    //               Mat Black Case
    //             </span>
    //             <div className="mt-1 text-600">Accessories</div>
    //           </div>
    //           <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
    //             <div
    //               className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem"
    //               style={{ height: "8px" }}>
    //               <div
    //                 className="bg-purple-500 h-full"
    //                 style={{ width: "75%" }}
    //               />
    //             </div>
    //             <span className="text-purple-500 ml-3 font-medium">%75</span>
    //           </div>
    //         </li>
    //         <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
    //           <div>
    //             <span className="text-900 font-medium mr-2 mb-1 md:mb-0">
    //               Robots T-Shirt
    //             </span>
    //             <div className="mt-1 text-600">Clothing</div>
    //           </div>
    //           <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
    //             <div
    //               className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem"
    //               style={{ height: "8px" }}>
    //               <div
    //                 className="bg-teal-500 h-full"
    //                 style={{ width: "40%" }}
    //               />
    //             </div>
    //             <span className="text-teal-500 ml-3 font-medium">%40</span>
    //           </div>
    //         </li>
    //       </ul>
    //     </div>
    //   </div>

    //   <div className="col-12 xl:col-6">
    //     <div className="card">
    //       <h5>Sales Overview</h5>
    //       <Chart type="line" data={lineData} options={lineOptions} />
    //     </div>

    //     <div className="card">
    //       <div className="flex align-items-center justify-content-between mb-4">
    //         <h5>Notifications</h5>
    //         <div>
    //           <Button
    //             type="button"
    //             icon="pi pi-ellipsis-v"
    //             rounded
    //             text
    //             className="p-button-plain"
    //             onClick={(event) => menu2.current?.toggle(event)}
    //           />
    //           <Menu
    //             ref={menu2}
    //             popup
    //             model={[
    //               { label: "Add New", icon: "pi pi-fw pi-plus" },
    //               { label: "Remove", icon: "pi pi-fw pi-minus" },
    //             ]}
    //           />
    //         </div>
    //       </div>

    //       <span className="block text-600 font-medium mb-3">TODAY</span>
    //       <ul className="p-0 mx-0 mt-0 mb-4 list-none">
    //         <li className="flex align-items-center py-2 border-bottom-1 surface-border">
    //           <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">
    //             <i className="pi pi-dollar text-xl text-blue-500" />
    //           </div>
    //           <span className="text-900 line-height-3">
    //             Richard Jones
    //             <span className="text-700">
    //               {" "}
    //               has purchased a blue t-shirt for{" "}
    //               <span className="text-blue-500">79$</span>
    //             </span>
    //           </span>
    //         </li>
    //         <li className="flex align-items-center py-2">
    //           <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-orange-100 border-circle mr-3 flex-shrink-0">
    //             <i className="pi pi-download text-xl text-orange-500" />
    //           </div>
    //           <span className="text-700 line-height-3">
    //             Your request for withdrawal of{" "}
    //             <span className="text-blue-500 font-medium">2500$</span> has
    //             been initiated.
    //           </span>
    //         </li>
    //       </ul>

    //       <span className="block text-600 font-medium mb-3">YESTERDAY</span>
    //       <ul className="p-0 m-0 list-none">
    //         <li className="flex align-items-center py-2 border-bottom-1 surface-border">
    //           <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">
    //             <i className="pi pi-dollar text-xl text-blue-500" />
    //           </div>
    //           <span className="text-900 line-height-3">
    //             Keyser Wick
    //             <span className="text-700">
    //               {" "}
    //               has purchased a black jacket for{" "}
    //               <span className="text-blue-500">59$</span>
    //             </span>
    //           </span>
    //         </li>
    //         <li className="flex align-items-center py-2 border-bottom-1 surface-border">
    //           <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-pink-100 border-circle mr-3 flex-shrink-0">
    //             <i className="pi pi-question text-xl text-pink-500" />
    //           </div>
    //           <span className="text-900 line-height-3">
    //             Jane Davis
    //             <span className="text-700">
    //               {" "}
    //               has posted a new questions about your product.
    //             </span>
    //           </span>
    //         </li>
    //       </ul>
    //     </div>
    //     <div
    //       className="px-4 py-5 shadow-2 flex flex-column md:flex-row md:align-items-center justify-content-between mb-3"
    //       style={{
    //         borderRadius: "1rem",
    //         background:
    //           "linear-gradient(0deg, rgba(0, 123, 255, 0.5), rgba(0, 123, 255, 0.5)), linear-gradient(92.54deg, #1C80CF 47.88%, #FFFFFF 100.01%)",
    //       }}>
    //       <div>
    //         <div className="text-blue-100 font-medium text-xl mt-2 mb-3">
    //           TAKE THE NEXT STEP
    //         </div>
    //         <div className="text-white font-medium text-5xl">
    //           Try PrimeBlocks
    //         </div>
    //       </div>
    //       <div className="mt-4 mr-auto md:mt-0 md:mr-0">
    //         {/* <Link
    //           href="https://blocks.primereact.org"
    //           className="p-button font-bold px-5 py-3 p-button-warning p-button-rounded p-button-raised">
    //           Get Started
    //         </Link> */}
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default HomeScreen;
