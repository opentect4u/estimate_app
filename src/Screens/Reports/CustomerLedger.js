import React from "react";
import { reportHeaders } from "../../Assets/Data/TemplateConstants";
import { useLocation } from "react-router-dom";
import ReportTemplate from "./ReportTemplate";
import ReportTemplate2 from "./ReportTemplate2";

function CustomerLedger() {
  const locationpath = useLocation();
  var template =
    locationpath.pathname.split("/")[
      locationpath.pathname.split("/").length - 1
    ];
  var templateData = reportHeaders[template];
  return (
    <ReportTemplate2
      templateData={templateData}
      template={template}
      _url={"/admin/customer_ledger"}
      flag={2}
    />
  );
}

export default CustomerLedger;
