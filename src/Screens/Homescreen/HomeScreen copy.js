import React, { useEffect, useState } from "react";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Card, Col, Row, Statistic } from "antd";

// import { ChartContainer } from "@mui/x-charts/ChartContainer";
// import { ResponsiveChartContainer } from "@mui/x-charts/ResponsiveChartContainer";
// import { BarPlot } from "@mui/x-charts/BarChart";
// import {
//   LinePlot,
//   MarkPlot,
//   lineElementClasses,
//   markElementClasses,
// } from "@mui/x-charts/LineChart";
// import { ChartsXAxis } from "@mui/x-charts/ChartsXAxis";
// import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
// import Stack from "@mui/material/Stack";

import { Segmented } from "antd";
import useAPI from "../../Hooks/useApi";
// import axios from "axios";
// import { url } from "../../Address/baseURL";
// import moment from "moment";
// import { Skeleton } from "primereact/skeleton";
// import DatatableComp from "../../Components/DatatableComp";
// import { Tooltip } from "primereact/tooltip";

function HomeScreen() {
  const [called, setCalled] = useState(false);
  const { response, callApi } = useAPI();
  const [dataSet1, setDataSet] = useState();
  const [settings, setSettings] = useState({});
  const [settingsStock, setSettingsStock] = useState({});
  const [settingsCredit, setSettingsCredit] = useState({});
  const [pData, setPdata] = useState([]);
  var comp,
    countUser = 0,
    userSet,
    stockSet;
  var today = new Date();

  // useEffect(() => {
  //   comp = localStorage.getItem("comp_id");
  //   axios
  //     .post(url + "/admin/item_report", {
  //       comp_id: +localStorage.getItem("comp_id"),
  //       br_id: 1,
  //       from_date: moment(priorDate).format("YYYY-MM-DD"),
  //       to_date: moment(today).format("YYYY-MM-DD"),
  //     })
  //     .then((resp) => {
  //       console.log(resp);
  //       resp?.data?.msg.sort((a, b) => b.qty - a.qty);
  //       setPdata([
  //         resp?.data?.msg[0].qty,
  //         resp?.data?.msg[1].qty,
  //         resp?.data?.msg[2].qty,
  //         resp?.data?.msg[3].qty,
  //         resp?.data?.msg[4].qty,
  //         resp?.data?.msg[5].qty,
  //         resp?.data?.msg[6].qty,
  //       ]);
  //       console.log(pData);
  //     });
  //   // callApi('/admin/stock_list',1,{comp_id:+comp,item_id:0});
  //   axios
  //     .post(url + "/admin/stock_list", {
  //       comp_id: +localStorage.getItem("comp_id"),
  //       item_id: 0,
  //     })
  //     .then((resp) => {
  //       console.log(resp);
  //       stockSet = resp?.data?.msg;
  //       setDataSet(stockSet);
  //       // countUser=userSet?.filter(e=>e.active_flag=='Y')?.length/userSet?.length*100

  //       setSettingsStock({
  //         height: 100,
  //         width: 100,
  //         value: (
  //           (stockSet?.filter((e) => e.stock != 0)?.length / stockSet?.length) *
  //           100
  //         ).toFixed(0),
  //       });
  //       console.log(settings);
  //     });

  //   axios
  //     .post(url + "/admin/user_list", {
  //       comp_id: +localStorage.getItem("comp_id"),
  //       br_id: 0,
  //     })
  //     .then((resp) => {
  //       console.log(resp);
  //       userSet = resp?.data?.msg;

  //       countUser =
  //         (userSet?.filter((e) => e.active_flag == "Y")?.length /
  //           userSet?.length) *
  //         100;

  //       setSettings({ height: 100, width: 100, value: countUser.toFixed(0) });
  //       console.log(settings);
  //     });
  //   // callApi('/admin/credit_report',1,{});
  //   axios
  //     .post(url + "/admin/credit_report", {
  //       comp_id: +localStorage.getItem("comp_id"),
  //       br_id: 0,
  //       from_date: moment(priorDate).format("YYYY-MM-DD"),
  //       to_date: moment(today).format("YYYY-MM-DD"),
  //     })
  //     .then((resp) => {
  //       console.log(resp);
  //       setSettingsCredit({
  //         height: 100,
  //         width: 100,
  //         value: resp?.data?.msg?.length,
  //       });
  //     });
  // }, []);
  return (
    <>
      <Segmented
        options={["Daily", "Weekly", "Monthly", "Quarterly", "Yearly"]}
        className="my-4 text-blue-900"
        onChange={(value) => {
          console.log(value); // string
        }}
      />
      <Row gutter={16} className="mb-4">
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Active"
              value={11.28}
              precision={2}
              valueStyle={{ color: "#404198" }}
              prefix={<ArrowUpOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Idle"
              value={9.3}
              precision={2}
              valueStyle={{ color: "#404198" }}
              prefix={<ArrowDownOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Active"
              value={11.28}
              precision={2}
              valueStyle={{ color: "#404198" }}
              prefix={<ArrowUpOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Idle"
              value={9.3}
              precision={2}
              valueStyle={{ color: "#404198" }}
              prefix={<ArrowDownOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      {/* Dashboard */}
      {/* <div className="space-y-5">
        <div className="md:grid md:grid-cols-6 md:gap-1 ">
          <Row gutter={16} className="md:hidden md:shadow-lg">
            <Col span={12}>
              <Card bordered={false}>
                <Statistic
                  title="Active"
                  value={11.28}
                  precision={2}
                  valueStyle={{ color: "#3f8600" }}
                  prefix={<ArrowUpOutlined />}
                  suffix="%"
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card bordered={false}>
                <Statistic
                  title="Idle"
                  value={9.3}
                  precision={2}
                  valueStyle={{ color: "#cf1322" }}
                  prefix={<ArrowDownOutlined />}
                  suffix="%"
                />
              </Card>
            </Col>
          </Row>
          <a
            href="#"
            class="col-span-2 md:w-80 w-full md:h-40 h-60 mt-4 bg-blue-900 border  rounded-lg shadow hover:bg-blue-800 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 flex items-center bg-simple bg-no-repeat bg-cover">
            <ChartContainer
              width={500}
              height={300}
              series={[{ type: "line", data: pData }]}
              xAxis={[{ scaleType: "point", data: xLabels }]}
              sx={{
                [`& .${lineElementClasses.root}`]: {
                  stroke: "white",
                  strokeWidth: 2,
                },
                [`& .${markElementClasses.root}`]: {
                  stroke: "white",
                  scale: "0.6",
                  fill: "#fff",
                  strokeWidth: 2,
                },
              }}
              disableAxisListener>
              <LinePlot />
              <MarkPlot />
            </ChartContainer>
          </a>
          <a
            href="#"
            class="col-span-2 md:w-80 w-full hidden md:h-40 h-60 mt-4 bg-blue-400 border border-gray-200 rounded-lg shadow hover:bg-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 md:flex items-center bg-rect bg-no-repeat bg-cover">
            <ChartContainer
              width={500}
              height={300}
              series={[{ type: "line", data: pData }]}
              xAxis={[{ scaleType: "point", data: xLabels }]}
              sx={{
                [`& .${lineElementClasses.root}`]: {
                  stroke: "white",
                  strokeWidth: 2,
                },
                [`& .${markElementClasses.root}`]: {
                  stroke: "white",
                  scale: "0.6",
                  fill: "#fff",
                  strokeWidth: 2,
                },
              }}
              disableAxisListener>
              <LinePlot />
              <MarkPlot />
            </ChartContainer>
          </a>
          <a
            href="#"
            class="col-span-2 md:w-80 w-full hidden md:h-40 h-60 mt-4 bg-blue-300 border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 md:flex items-center bg-anitwo bg-no-repeat bg-cover">
            <ChartContainer
              width={500}
              height={300}
              series={[{ type: "line", data: pData }]}
              xAxis={[{ scaleType: "point", data: xLabels }]}
              sx={{
                [`& .${lineElementClasses.root}`]: {
                  stroke: "#404198",
                  strokeWidth: 2,
                },
                [`& .${markElementClasses.root}`]: {
                  stroke: "#404198",
                  scale: "0.6",
                  fill: "#fff",
                  strokeWidth: 2,
                },
              }}
              disableAxisListener>
              <LinePlot />
              <MarkPlot />
            </ChartContainer>
          </a>
        </div>
        <div className="md:grid md:grid-cols-6 md:gap-1  items-center">
          <a
            href="#"
            class="md:col-span-2 hidden  md:flex justify-center md:max-w-md h-auto w-full p-1 bg-white rounded-lg  hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 ">
            <div className="sm:flex-col justify-between sm:justify-around sm:align-middle sm:space-y-5 flex flex-wrap ">
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={{ xs: 1, md: 3 }}>
                {settings.value && (
                  <a
                    href="#"
                    class="col-span-2 w-40 p-1 bg-blue-900 border border-gray-200 rounded-lg shadow hover:bg-blue-800 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 flex items-center bg-simple bg-no-repeat bg-cover">
                    <Tooltip title="% Profit">
                      <Gauge
                        {...settings}
                        cornerRadius="50%"
                        sx={(theme) => ({
                          [`& .${gaugeClasses.valueText}`]: {
                            fontSize: 20,
                            fontPalette: "#ffff",
                          },
                          [`& .${gaugeClasses.valueArc}`]: {
                            fill: "white",
                          },
                          [`& .${gaugeClasses.referenceArc}`]: {
                            fill: "#404198",
                          },
                        })}
                      />
                    </Tooltip>
                  </a>
                )}
                {!settings.value && (
                  <Skeleton width="10rem" height="6.7rem"></Skeleton>
                )}
                {settingsCredit.value && (
                  <a
                    href="#"
                    class="col-span-2 w-40 p-1 bg-blue-300 border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 flex items-center bg-anitwo bg-no-repeat bg-cover">
                    <Tooltip title="Credit sale for last 30 days">
                      <Gauge
                        {...settingsCredit}
                        cornerRadius="50%"
                        sx={(theme) => ({
                          [`& .${gaugeClasses.valueText}`]: {
                            fontSize: 20,
                          },
                          [`& .${gaugeClasses.valueArc}`]: {
                            fill: "#404198",
                          },
                          [`& .${gaugeClasses.referenceArc}`]: {
                            fill: "#D4D4ED",
                          },
                        })}
                      />
                    </Tooltip>
                  </a>
                )}
                {!settingsCredit.value && (
                  <Skeleton width="10rem" height="6.7rem"></Skeleton>
                )}
              </Stack>
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={{ xs: 1, md: 3 }}>
                {settingsStock.value && (
                  <a
                    href="#"
                    class="col-span-2 w-40 p-1 bg-blue-300 border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 flex items-center bg-ani bg-no-repeat bg-cover">
                    <Tooltip title="% Items in stock">
                      <Gauge
                        {...settingsStock}
                        cornerRadius="50%"
                        sx={(theme) => ({
                          [`& .${gaugeClasses.valueText}`]: {
                            fontSize: 20,
                          },
                          [`& .${gaugeClasses.valueArc}`]: {
                            fill: "#404198",
                          },
                          [`& .${gaugeClasses.referenceArc}`]: {
                            fill: "#D4D4ED",
                          },
                        })}
                      />
                    </Tooltip>
                  </a>
                )}
                {!settingsStock.value && (
                  <Skeleton width="10rem" height="6.7rem"></Skeleton>
                )}
                {settings.value && (
                  <a
                    href="#"
                    class="col-span-2 w-40 p-1 bg-blue-900 border border-gray-200 rounded-lg shadow hover:bg-blue-800 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 flex items-center bg-simple bg-no-repeat bg-cover">
                    <Tooltip title="% Active Users">
                      <Gauge
                        {...settings}
                        cornerRadius="50%"
                        sx={(theme) => ({
                          [`& .${gaugeClasses.valueText}`]: {
                            fontSize: 20,
                            fontPalette: "#ffff",
                          },
                          [`& .${gaugeClasses.valueArc}`]: {
                            fill: "white",
                          },
                          [`& .${gaugeClasses.referenceArc}`]: {
                            fill: "#404198",
                          },
                        })}
                      />
                    </Tooltip>
                  </a>
                )}
                {!settings.value && (
                  <Skeleton width="10rem" height="6.7rem"></Skeleton>
                )}
              </Stack>
            </div>
          </a>

          <div class="col-span-4 md:w-auto w-full md:mx-4 p-1 border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 flex items-center">
            {dataSet1 && (
              <DatatableComp
                headers={[
                  { name: "id", value: "#" },
                  { name: "item_name", value: "Item" },
                  { name: "stock", value: "In stock" },
                ]}
                data={dataSet1}
              />
            )}
            {!dataSet1 && <Skeleton width="45rem" height="15rem"></Skeleton>}
          </div>
        </div>
      </div> */}
    </>
  );
}

export default HomeScreen;
