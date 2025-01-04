import React from "react";
import { reportHeaders } from "../../../Assets/Data/TemplateConstants";
import { useLocation } from "react-router-dom";
import ReportTemplate from "../../Reports/ReportTemplate";

function ProductwiseEstimate() {
  const locationpath = useLocation();
  var template =
    locationpath.pathname.split("/")[
      locationpath.pathname.split("/").length - 1
    ];
  var templateData = reportHeaders[template];

  return (
    <ReportTemplate
      templateData={templateData}
      template={template}
      // _url={"/admin/item_report"}
      flag={666}
      _url={"/admin/productwise_report_outlet"}
    />
  );
}

export default ProductwiseEstimate;
