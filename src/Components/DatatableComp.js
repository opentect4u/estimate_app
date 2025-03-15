import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";

function DatatableComp({ headers, data, span, totals }) {
  console.log(headers, data, span, totals);

  const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column
          footer={span !== 0 && "Totals:"}
          colSpan={span}
          footerStyle={{ textAlign: "center" }}
        />
        {totals?.map((item, index) => (
          <Column key={index} footer={item} />
        ))}
      </Row>
    </ColumnGroup>
  );

  return (
    <div className="card w-full">
      <DataTable
        footerColumnGroup={totals || span !== 0 ? footerGroup : ""}
        value={data}
        showGridlines
        sortMode="multiple"
        stripedRows
        scrollable
        paginator
        rows={10} // sets 20 rows per page
        rowsPerPageOptions={[10, 20, 50, 100]}
        tableStyle={{ minWidth: "100%" }}
        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        currentPageReportTemplate="{first} to {last} of {totalRecords}">
        {headers.map((item, index) => (
          <Column
            key={index}
            field={item.name}
            header={item.value}
            sortable
            headerClassName="bg-blue-900 text-white text-sm"
            style={{ width: "10%" }}
          />
        ))}
      </DataTable>
    </div>
  );
}

export default DatatableComp;
