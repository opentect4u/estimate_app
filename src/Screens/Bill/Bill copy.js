import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAPI from "../../Hooks/useApi";
import { Message } from "../../Components/Message";

import "./Styles.css";
import axios from "axios";
import { url } from "../../Address/baseURL";
function Bill() {
  const params = useParams();
  const { response, callApi } = useAPI();
  const [dataSet, setDataSet] = useState();
  const [isCalled, setCalled] = useState(false);
  const [totqty, setTot] = useState(0);
  const [totAmt, setAmt] = useState(0);
  const [info, setInfo] = useState();

  var tot = 0,
    net = 0,
    totcgst = 0,
    totsgst = 0;

  useEffect(() => {
    callApi("/admin/print_bill", 1, { recp_no: params.id });
    // setCalled(true)
  }, [isCalled]);
  useEffect(() => {
    console.log("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF", response);
    setDataSet(response?.data?.msg);
    if (response)
      axios
        .post(url + "/admin/store_profile", {
          comp_id: response?.data?.msg[0].comp_id,
        })
        .then((res) => {
          console.log(res);
          setInfo(res.data.msg);
        });

    if (response?.data?.msg?.length <= 0) {
      Message("error", "No data!");
    } else {
      // if(isCalled){
      // debugger
      setDataSet(response?.data?.msg);
      response?.data?.msg?.forEach((element) => {
        tot += element.qty;
        totcgst += element.cgst_prtg;
        totsgst += element.sgst_prtg;
        net += element.qty * element.price - element.discount_amt;
        setTot(tot);
        setAmt(net);
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
      {dataSet?.length > 0 && (
        <div class="container-fluid">
          <div class="row">
            <div class="col-12">
              <div class="card">
                <div class="card-body" id="divToPrint">
                  <table width="100%">
                    <tr>
                      {info?.length && (
                        <th colspan="8">{info[0]?.company_name}</th>
                      )}
                    </tr>
                    {dataSet[0]?.on_off_flag1 == "Y" && (
                      <tr>
                        <th colspan="8">{dataSet[0]?.header1}</th>
                      </tr>
                    )}
                    {dataSet[0]?.on_off_flag2 == "Y" && (
                      <tr>
                        <th colspan="8">{dataSet[0]?.header2}</th>
                      </tr>
                    )}
                    <tr>
                      <th colspan="8">RECEIPT</th>
                    </tr>
                    <tr>
                      <td colspan="8">
                        ========================================================
                      </td>
                    </tr>
                    <tr>
                      <td colspan="4">Store:</td>
                      <td colspan="4">Customer Details:</td>
                    </tr>
                    <tr>
                      {info?.length && <td colspan="4">{info[0]?.address}</td>}
                      {dataSet?.length > 0 && (
                        <td colspan="4">{dataSet[0]?.cust_name}</td>
                      )}
                    </tr>
                    <tr>
                      {info?.length && (
                        <td colspan="4">
                          Contact Number: {info[0]?.phone_no}
                          <br />
                          Email: {info[0].email_id}
                        </td>
                      )}
                      {dataSet?.length > 0 && (
                        <td colspan="4">Phone: {dataSet[0]?.phone_no}</td>
                      )}
                    </tr>
                    <tr>
                      <td colspan="8">
                        ========================================================
                      </td>
                    </tr>
                    <tr>
                      <th colspan="8">Item Details</th>
                    </tr>
                    <tr>
                      <td colspan="8">
                        ========================================================
                      </td>
                    </tr>
                    <tr>
                      <th>Item Name</th>
                      <th>MRP</th>
                      <th>Qty</th>
                      <th>Price</th>
                      {dataSet[0]?.discount_flag == "Y" && <th>Discount</th>}
                      {dataSet[0]?.gst_flag == "Y" && <th>CGST (%)</th>}
                      {dataSet[0]?.gst_flag == "Y" && <th>SGST (%)</th>}
                      <th>Net Amount</th>
                    </tr>
                    {dataSet?.map((item) => (
                      <tr class="texAlignCenter">
                        <td>{item.item_name}</td>
                        <td>{item.price.toFixed(2)}</td>
                        <td>{item.qty}</td>
                        <td>{item.qty * item.price}</td>
                        <td>{item.discount_amt.toFixed(2)}</td>
                        {dataSet[0]?.gst_flag == "Y" && (
                          <td>{item.cgst_prtg.toFixed(2)}</td>
                        )}
                        {dataSet[0]?.gst_flag == "Y" && (
                          <td>{item.sgst_prtg.toFixed(2)}</td>
                        )}
                        {dataSet[0]?.discount_flag == "Y" && (
                          <td>{item.qty * item.price - item.discount_amt}</td>
                        )}
                      </tr>
                    ))}
                    <tr>
                      <td colspan="8">
                        ========================================================
                      </td>
                    </tr>
                    <tr>
                      <td>Total</td>
                      <td colspan="2">Item: {dataSet[0]?.length}</td>
                      <td colspan="2">QTY: {totqty}</td>
                      <td colspan="2">AMT: {totAmt?.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td colspan="8">
                        ========================================================
                      </td>
                    </tr>
                    {dataSet[0]?.gst_flag == "Y" && (
                      <tr>
                        <th colspan="8">GST Breakup</th>
                      </tr>
                    )}
                    {dataSet[0]?.gst_flag == "Y" && (
                      <tr>
                        <td colspan="8">
                          ========================================================
                        </td>
                      </tr>
                    )}
                    {dataSet[0]?.gst_flag == "Y" && (
                      <tr>
                        <td colspan="1">CGST</td>
                        <td class="texAlignLeft" colspan="1">
                          @{totcgst}%
                        </td>
                        <td class="texAlignLeft" colspan="1">
                          :
                        </td>
                        <td class="texAlignLeft" colspan="5">
                          {dataSet[0]?.tcgst_amt}
                        </td>
                      </tr>
                    )}
                    {dataSet[0]?.gst_flag == "Y" && (
                      <tr>
                        <td colspan="1">SGST</td>
                        <td class="texAlignLeft" colspan="1">
                          @{totsgst}%
                        </td>
                        <td class="texAlignLeft" colspan="1">
                          :
                        </td>
                        <td class="texAlignLeft" colspan="5">
                          {dataSet[0]?.tsgst_amt}
                        </td>
                      </tr>
                    )}
                    {dataSet[0]?.gst_flag == "Y" && (
                      <tr>
                        <th colspan="1">Total GST</th>
                        <td></td>
                        <td class="texAlignLeft" colspan="1">
                          :
                        </td>
                        {dataSet[0]?.length && (
                          <td class="texAlignLeft" colspan="5">
                            {dataSet[0].tsgst_amt + dataSet[0]?.tcgst_amt}
                          </td>
                        )}
                      </tr>
                    )}
                    {dataSet[0]?.discount_flag == "Y" && (
                      <tr>
                        <td colspan="8">
                          ========================================================
                        </td>
                      </tr>
                    )}

                    {dataSet[0]?.discount_flag == "Y" && (
                      <tr>
                        <th colspan="8">Discount Breakup</th>
                      </tr>
                    )}
                    {dataSet[0]?.discount_flag == "Y" && (
                      <tr>
                        <td colspan="8">
                          ========================================================
                        </td>
                      </tr>
                    )}
                    {dataSet[0]?.discount_flag == "Y" &&
                      dataSet?.map((item) => (
                        <tr>
                          <td colspan="1">Discount</td>
                          <td class="texAlignLeft" colspan="1">
                            :
                          </td>
                          <td class="texAlignLeft" colspan="6">
                            {item?.discount_amt}
                          </td>
                        </tr>
                      ))}
                    <tr>
                      <td colspan="1">Total Discount</td>
                      <td class="texAlignLeft" colspan="1">
                        :
                      </td>
                      {dataSet?.length > 0 && (
                        <td class="texAlignLeft" colspan="6">
                          {dataSet[0]?.tdiscount_amt}
                        </td>
                      )}
                    </tr>
                    <tr>
                      <td colspan="8">
                        ========================================================
                      </td>
                    </tr>
                    <tr>
                      <th colspan="8">Payment Summary</th>
                    </tr>
                    <tr>
                      <td colspan="8">
                        ========================================================
                      </td>
                    </tr>
                    <tr>
                      <td colspan="1">Round Off:</td>
                      {dataSet?.length > 0 && (
                        <td class="texAlignLeft" colspan="3">
                          {
                            // dataSet[0].round_off
                            (dataSet[0]?.net_amt - dataSet[0]?.tprice)?.toFixed(
                              2
                            )
                          }
                        </td>
                      )}
                      <td colspan="1">Net Amount:</td>
                      <td class="texAlignLeft" colspan="3">
                        {totAmt?.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td colspan="1">Receipt No:</td>
                      <td class="texAlignLeft" colspan="3">
                        {params.id}
                      </td>
                      <td colspan="1">Date:</td>
                      {dataSet?.length > 0 && (
                        <td class="texAlignLeft" colspan="3">
                          {dataSet[0].trn_date}
                        </td>
                      )}
                    </tr>
                    <tr>
                      <td colspan="1">Cash Received:</td>
                      {dataSet?.length > 0 && (
                        <td class="texAlignLeft" colspan="3">
                          {dataSet[0]?.received_amt}
                        </td>
                      )}
                      <td colspan="1">Returned Amount:</td>
                      {dataSet?.length > 0 && dataSet[0]?.pay_mode == "C" ? (
                        <td class="texAlignLeft" colspan="3">
                          {dataSet[0]?.received_amt - dataSet[0]?.net_amt}
                        </td>
                      ) : (
                        <td class="texAlignLeft" colspan="3">
                          {0}
                        </td>
                      )}
                    </tr>
                    <tr>
                      <td colspan="8">
                        ========================================================
                      </td>
                    </tr>
                    {dataSet[0]?.on_off_flag3 == "Y" && (
                      <tr class="texAlignCenter">
                        <td colspan="8">{dataSet[0]?.footer1}</td>
                      </tr>
                    )}
                    {dataSet[0]?.on_off_flag4 == "Y" && (
                      <tr class="texAlignCenter">
                        <td colspan="8">{dataSet[0]?.footer2}</td>
                      </tr>
                    )}
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* </div> */}
    </>
  );
}

export default Bill;
