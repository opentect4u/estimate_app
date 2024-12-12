import React, { useEffect, useState } from "react";
import ReportForm from "../../Components/ReportForm";
import useAPI from "../../Hooks/useApi";
import { Message } from "../../Components/Message";
import DatatableComp from "../../Components/DatatableComp";
import DescriptionComp from "../../Components/DescriptionComp";

function CreditReport() {
  const { response, callApi } = useAPI();
  const [resp, setRestp] = useState();
  const [isReport, setIsReport] = useState(false);
  const [isCalled, setCalled] = useState(false);
  const [dataSet, setDataSet] = useState();
  const [from, setFrom] = useState();
  const [to, setTo] = useState();
  const [location, setLocation] = useState();
  const [totalPay, setTotal] = useState();
  var comp,
    totals = [],
    net_amt = 0,
    paid_amt = 0,
    due_amt = 0;
  useEffect(() => {
    console.log(response);
    if (!isCalled) setRestp(response?.data?.msg);
    if (response?.data?.suc == 0 || response?.data?.msg.length <= 0) {
      Message("error", "No data!");
      setIsReport(false);
    } else {
      if (isCalled) {
        setDataSet(response?.data?.msg);
        response?.data?.msg?.forEach((e) => (net_amt += e.net_amt));
        response?.data?.msg?.forEach((e) => (paid_amt += e.paid_amt));
        response?.data?.msg?.forEach((e) => (due_amt += e.due_amt));
        totals.push(
          net_amt.toFixed(2),
          paid_amt.toFixed(2),
          due_amt.toFixed(2)
        );
        console.log("totals", totals);
        setTotal(totals);
        setIsReport(true);
      }
    }
  }, [response]);
  useEffect(() => {
    comp = localStorage.getItem("comp_id");
    callApi("/admin/outlet_list", 1, { comp_id: +comp });
  }, []);
  const onPress = (data) => {
    console.log(data);
    setFrom(data.from_dt);
    setTo(data.to_dt);
    comp = localStorage.getItem("comp_id");
    setCalled(true);
    setLocation(resp?.filter((e) => e?.id == data.outlet)[0]?.branch_name);
    callApi("/admin/credit_report", 1, {
      from_date: data.from_dt,
      to_date: data.to_dt,
      br_id: +data.outlet,
      comp_id: +comp,
    });
  };
  return (
    <div>
      {!isReport && (
        <ReportForm
          title="Credit Report"
          flag={0}
          onPress={(data) => onPress(data)}
          outlet={resp}
        />
      )}
      {isReport && (
        <>
          <DescriptionComp
            title="Credit Report"
            from={from}
            to={to}
            location={location ? location : "All outlets"}
            backPress={() => setIsReport(false)}
            headers={[
              { name: "trn_date", value: "Date" },
              { name: "receipt_no", value: "Receipt No." },
              { name: "cust_name", value: "Customer" },
              { name: "phone_no", value: "Phone No." },
              { name: "net_amt", value: "Amount" },
              { name: "paid_amt", value: "Paid Amount" },
              { name: "due_amt", value: "Due Amount" },
            ]}
            data={dataSet}
            span={4}
            totals={totalPay}
          />
          <DatatableComp
            headers={[
              { name: "trn_date", value: "Date" },
              { name: "receipt_no", value: "Receipt No." },
              { name: "cust_name", value: "Customer" },
              { name: "phone_no", value: "Phone No." },
              { name: "net_amt", value: "Amount" },
              { name: "paid_amt", value: "Paid Amount" },
              { name: "due_amt", value: "Due Amount" },
            ]}
            data={dataSet}
            span={4}
            totals={totalPay}
          />
        </>
      )}
    </div>
  );
}

export default CreditReport;
