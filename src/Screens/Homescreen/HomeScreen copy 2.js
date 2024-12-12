import React, { useEffect, useState } from "react";
import "./HomeScreen.css";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Card, Col, Row, Statistic } from "antd";
import { Chart } from "primereact/chart";
import { Segmented } from "antd";
import useAPI from "../../Hooks/useApi";

function HomeScreen() {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

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

  return (
    <>
      <Segmented
        options={["Daily", "Monthly", "Yearly"]}
        className="my-4 text-blue-900"
        onChange={(value) => {
          console.log(value); // string
        }}
      />
      <Row gutter={16} className="mb-4">
        <Col span={6}>
          <Card className="blurredCard z-10 ">
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
          <Card className="blurredCard z-10">
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
          <Card className="blurredCard z-10 ">
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
          <Card className="blurredCard z-10">
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
      <div className="grid grid-cols-5 gap-2 my-10 align-middle -z-50">
        <div className="col-span-2 w-11/12 blurredCard z-10 p-5">
          <Chart type="doughnut" data={chartData} options={chartOptions} />
        </div>
        <div className="col-span-3 blurredCard z-10 p-5">
          <Chart
            type="line"
            data={chartDataLine}
            options={chartOptionsLine}
            height="380px"
            className="my-16"
          />
        </div>
      </div>
    </>
  );
}

export default HomeScreen;
