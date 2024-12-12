import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAPI from "../../Hooks/useApi";
import { Message } from "../../Components/Message";
import moment from "moment";
import PrintIcon from "@mui/icons-material/Print";

function PrintBill() {
  const params = useParams();
  const { response, callApi } = useAPI();
  const [dataSet, setDataSet] = useState();
  const [isCalled, setCalled] = useState(false);
  const [totqty, setTot] = useState(0);
  var comp,
    tot = 0;

  useEffect(() => {
    comp = localStorage.getItem("comp_id");
    callApi("/admin/print_bill", 1, { comp_id: +comp, recp_no: params.id });
    // setCalled(true)
  }, [isCalled]);
  useEffect(() => {
    console.log(response);
    // setDataSet(response?.data?.msg);

    if (response?.data?.msg?.length <= 0) {
      Message("error", "No data!");
    } else {
      // if(isCalled){
      // debugger
      setDataSet(response?.data?.msg);
      response?.data?.msg?.forEach((element) => {
        tot += element.qty;
        setTot(tot);
      });
      // }
    }
  }, [response]);
  function print() {
    var divToPrint = document.getElementById("divToPrint");

    var WindowObject = window.open("", "Print-Window");
    WindowObject.document.open();
    WindowObject.document.writeln("<!DOCTYPE html>");
    WindowObject.document.writeln(
      '<html><head><title></title><style type="text/css">'
    );

    WindowObject.document.writeln(
      "@media print {" +
        "table { text-align:center }" +
        "table .text-left { text-align: left; }" +
        ".tot_section { display: flex; justify-content: space-around; flex-direction: row; }" +
        "tr { display: flex; justify-content: space-between; flex-direction: row; }" +
        "} </style>"
    );
    WindowObject.document.writeln(
      '<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback">'
    );
    WindowObject.document.writeln(
      '<link rel="stylesheet" href="/plugins/fontawesome-free/css/all.min.css">'
    );
    WindowObject.document.writeln(
      '<link rel="stylesheet" href="/css/adminlte.min.css">'
    );
    WindowObject.document.writeln('</head><body onload="window.print()">');
    WindowObject.document.writeln(divToPrint.innerHTML);
    WindowObject.document.writeln("</body></html>");
    WindowObject.document.close();
    //   setTimeout(function () {
    //     WindowObject.close();
    // }, 10);
  }
  return (
    <>
      <div className="flex justify-end">
        <button
          className="mt-5 inline-flex bg-red-500 items-center justify-center mr-2 sm:mr-3 px-5 py-2.5 sm:mt-2 text-sm font-medium text-center text-white bg-primary-700 rounded-full h-10 w-10  focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
          onClick={() => print()}>
          <PrintIcon />
        </button>
      </div>

      <div className="flex justify-center" id="divToPrint">
        {/* <div className="card-body" id="divToPrint"> */}
        <table className="text-center">
          <tr>
            <td className="flex justify-center items-center">
              <span className="text-black">
                {localStorage.getItem("company_name")}
              </span>
            </td>
          </tr>
          <tr>
            <td className="flex justify-center items-center">
              <span className="text-black">Welcome</span>
            </td>
          </tr>
          <tr>
            <td className="flex justify-center">
              <span className="text-black">Your Purchase Bill</span>
            </td>
          </tr>
          <tr>
            <td className="flex justify-center ">
              <span className="text-black">RECEIPT</span>
            </td>
          </tr>
          ============================================================
          <tr>
            <td className="flex justify-center flex-wrap">
              <span className="text-black">
                {localStorage.getItem("address")}
              </span>
            </td>
          </tr>
          ============================================================
          <tr class="flex justify-between">
            <td className="text-left text-black">MOBILE:</td>
            <td className="text-left text-black">
              {localStorage.getItem("phone_no")}
            </td>
          </tr>
          <tr class="flex justify-between">
            <td className="text-left text-black">EMAIL:</td>
            <td className="  text-black">{localStorage.getItem("email_id")}</td>
          </tr>
          ============================================================
          <tr class="flex justify-between">
            <td className="text-left text-black">RECPT. NO:</td>
            <td className="  text-black">{params.id}</td>
          </tr>
          <tr class="flex justify-between">
            <td className="text-left text-black">DATE:</td>
            <td className="  text-black">
              {dataSet?.length > 0 &&
                moment(dataSet[0]?.tcreated_dt).format("DD/MM/YYYY")}
            </td>
          </tr>
          <tr class="flex justify-between">
            <td className="text-left text-black">CASHIER:</td>
            <td className="col-span-1   text-black">{params.user}</td>
          </tr>
          <tr class="flex justify-between">
            <td className="text-left text-black">NAME:</td>
            <td className="  text-black">
              {dataSet?.length > 0 && dataSet[0]?.cust_name}
            </td>
          </tr>
          <tr class="flex justify-between">
            <td className="text-left text-black">PHONE:</td>
            <td className="  text-black">
              {dataSet?.length > 0 && dataSet[0]?.phone_no}
            </td>
          </tr>
          ============================================================
          <tr class="flex justify-between items-center w-full">
            <th className="text-black w-24 ">ITEM</th>
            <th className="text-black w-24">QTY</th>
            <th className="text-black w-24">PRICE</th>
            <th className="text-black w-24">DIS.</th>
            <th className="text-black w-24">AMT</th>
          </tr>
          ============================================================
          {dataSet?.length > 0 &&
            dataSet?.map((item) => (
              <tr className="flex justify-between items-center w-full">
                <td className="w-24">{item.item_name}</td>
                <td className="w-24">{item.qty}</td>
                <td className="w-24">{item.price}</td>
                <td className="w-24">{item.discount_amt}</td>
                <td className="w-24">
                  {(item.price - item.discount_amt) * item.qty}
                </td>
              </tr>
            ))}
          ============================================================
          <tr>
            <td className="">
              <div className="flex justify-between">
                <label className="text-black">
                  ITEM: <span className="text-black">{dataSet?.length}</span>
                </label>
                <label className="text-black">
                  QTY:{" "}
                  <span className="text-black">
                    {/* {dataSet?.length>0 && dataSet?.reduce(
                     (accumulator, currentValue) =>
                       accumulator.qty + currentValue.qty
                   )} */}
                    {totqty}
                  </span>
                </label>
                <label className="text-black">
                  AMT:{" "}
                  <span className="text-black">
                    {dataSet?.length > 0 && dataSet[0]?.tprice}
                  </span>
                </label>
              </div>
            </td>
          </tr>
          ============================================================
          <tr class="flex justify-between">
            <td className="text-left text-black">DISCOUNT:</td>
            <td className="  text-black">
              {dataSet?.length > 0 && dataSet[0]?.tdiscount_amt}
            </td>
          </tr>
          <tr class="flex justify-between">
            <td className="text-left text-black">TOTAL:</td>
            <td className="  text-black">
              {dataSet?.length > 0 && dataSet[0]?.amount}
            </td>
          </tr>
          <tr class="flex justify-between">
            <td className="text-left text-black">ROUND OFF:</td>
            <td className="  text-black">
              {dataSet?.length > 0 && dataSet[0]?.round_off}
            </td>
          </tr>
          <tr class="flex justify-between">
            <td className="text-left text-black">NET AMT:</td>
            <td className="  text-black">
              {dataSet?.length > 0 && dataSet[0]?.net_amt}
            </td>
          </tr>
          <tr class="flex justify-between">
            <td className="">
              <p classNameName="text-black border border-dashed width-full"></p>
            </td>
          </tr>
          ============================================================
          <tr class="flex justify-between">
            <td className="text-black">
              <span>PAYMENT MODE</span>
            </td>
            <td className="  text-black">
              {dataSet?.length > 0 && dataSet[0]?.pay_mode == "R"
                ? "Credit"
                : dataSet?.length > 0 && dataSet[0]?.pay_mode == "C"
                  ? "Cash"
                  : dataSet?.length > 0 && dataSet[0]?.pay_mode == "U"
                    ? "UPI"
                    : "Card"}
            </td>
          </tr>
          <tr class="flex justify-between">
            <td className="text-left text-black">CASH RECEIVED:</td>
            <td className="  text-black">
              {dataSet?.length > 0 && dataSet[0]?.received_amt}
            </td>
          </tr>
          <tr class="flex justify-between">
            <td className="text-left text-black">RETURNED AMT:</td>
            <td className="  text-black">
              {dataSet?.length > 0 &&
                Math.abs(dataSet[0]?.received_amt - dataSet[0]?.net_amt)}
            </td>
          </tr>
          <tr class="flex justify-between">
            <td className="">
              <p classNameName="text-black border border-dashed width-full"></p>
            </td>
          </tr>
          <tr>
            <td className="text-black">Thank You, Visit Again</td>
          </tr>
          <tr>
            <td className="text-black">Have a nice day</td>
          </tr>
          <tr>
            <td className="text-black">-----X-----</td>
          </tr>
        </table>

        {/* </div> */}
        {/* <div className="mt-2" id="btnclassName">
       <div className="row">
         <div className="col-sm-12">
           <button
             type="button"
             className="btn btn-primary"
             id="printMe"
             onclick="printDiv()"
           >
             Print
           </button>
         </div>
       </div>
     </div> */}

        {/* <script> */}
        {/* function printDiv() {

var divToPrint = document.getElementById('divToPrint');

var WindowObject = window.open('', 'Print-Window');
WindowObject.document.open();
WindowObject.document.writeln('<!DOCTYPE html>');
WindowObject.document.writeln('<html><head><title></title><style type="text/css">');


WindowObject.document.writeln('@media print {' +
'table { text-align: center; border: none; }' +
'table .text-left { text-align: left; }' +
'table .  { text-align: right; }' +
'.tot_section { display: flex; justify-content: space-around; flex-direction: row; }' +
'} </style>');
WindowObject.document.writeln('<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback">');
WindowObject.document.writeln('<link rel="stylesheet" href="/plugins/fontawesome-free/css/all.min.css">');
WindowObject.document.writeln('<link rel="stylesheet" href="/css/adminlte.min.css">');
WindowObject.document.writeln('</head><body onload="window.print()">');
WindowObject.document.writeln(divToPrint.innerHTML);
WindowObject.document.writeln('</body></html>');
WindowObject.document.close();
setTimeout(function () {
WindowObject.close();
}, 8);

}
</script> */}
      </div>
    </>
  );
}

export default PrintBill;
