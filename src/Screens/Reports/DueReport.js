import React from "react";
import { reportHeaders } from "../../Assets/Data/TemplateConstants";
import { useLocation } from "react-router-dom";
import ReportTemplate from "./ReportTemplate";
import ReportTemplate2 from "./ReportTemplate2";

function DueReport() {
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
      _url={"/admin/due_report"}
      flag={1}
    />
  );
}

export default DueReport;
