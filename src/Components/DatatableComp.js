import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FloatButton } from "antd";
import { PrinterOutlined } from "@ant-design/icons";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";

function DatatableComp({ headers, data, span, totals }) {
  console.log(headers, data, span, totals);
  // const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;
  // const paginatorRight = <Button type="button" icon="pi pi-download" text />;
  const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column
          footer="Totals:"
          colSpan={span}
          footerStyle={{ textAlign: "center" }}
        />
        {totals?.map((item) => (
          <Column footer={item} />
        ))}
      </Row>
    </ColumnGroup>
  );
  return (
    <div className="card w-full ">
      <DataTable
        footerColumnGroup={totals ? footerGroup : ""}
        value={data}
        showGridlines={true}
        sortMode="multiple"
        stripedRows
        scrollable
        paginator
        rows={data?.length}
        rowsPerPageOptions={[3, 5, 10, 25, 50, data?.length]}
        tableStyle={{ minWidth: "100%" }}
        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        currentPageReportTemplate="{first} to {last} of {totalRecords}"
        // paginatorLeft={paginatorLeft}
        // paginatorRight={paginatorRight}
      >
        {headers.map((item, index) => (
          <Column
            key={index}
            field={item.name}
            header={item.value}
            sortable
            headerClassName="bg-blue-900 text-white text-sm"
            style={{ width: "10%" }}></Column>
        ))}
      </DataTable>
    </div>
  );
}

export default DatatableComp;
