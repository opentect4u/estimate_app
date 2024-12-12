// import React, { useEffect, useState } from "react";
// import ReportForm from "../../Components/ReportForm";
// import useAPI from "../../Hooks/useApi";
// import { Message } from "../../Components/Message";
// import DatatableComp from "../../Components/DatatableComp";
// import DescriptionComp from "../../Components/DescriptionComp";

function RefundReport() {
  //   const {response,callApi} = useAPI();
  //   const [resp,setRestp]=useState()
  //   const [isReport,setIsReport] = useState(false)
  //   const [isCalled,setCalled] = useState(false)
  //   const [dataSet,setDataSet] = useState()
  //   const [from, setFrom] = useState()
  //   const [to, setTo] = useState()
  //   const [location,setLocation] = useState()
  //   const [totalPay,setTotal] = useState()
  //   var comp,totals=[],price=0,disc=0,cgst_amt=0,sgst_amt=0,net_amt=0;
  //   useEffect(()=>{
  //     console.log(response)
  //     if(!isCalled)
  //     setRestp(response?.data?.msg)
  //     if(response?.data?.suc==0 || response?.data?.msg.length<=0){
  //       Message('error','No data!')
  //       setIsReport(false)
  //     }
  //     else{
  //       if(isCalled){
  //         setDataSet(response?.data?.msg)
  //         response?.data?.msg?.forEach(e=>net_amt+=e.net_amt)
  //         response?.data?.msg?.forEach(e=>price+=e.price)
  //         response?.data?.msg?.forEach(e=>cgst_amt+=e.cgst_amt)
  //         response?.data?.msg?.forEach(e=>sgst_amt+=e.sgst_amt)
  //         response?.data?.msg?.forEach(e=>disc+=e.discount_amt)
  //         totals.push(price.toFixed(2),disc.toFixed(2),cgst_amt.toFixed(2),sgst_amt.toFixed(2),' ',net_amt.toFixed(2))
  //         console.log('totals',totals)
  //         setTotal(totals)
  //         setIsReport(true)
  //       }
  //     }
  //   },[response])
  //   useEffect(()=>{
  //     comp = localStorage.getItem('comp_id')
  //     callApi('/admin/outlet_list',1,{comp_id:+comp});
  // },[])
  //   const onPress = (data) => {
  //     console.log(data)
  //     setFrom(data.from_dt)
  //     setTo(data.to_dt)
  //     comp = localStorage.getItem('comp_id')
  //     setCalled(true)
  //     setLocation(resp?.filter(e=>e?.id==data.outlet)[0]?.branch_name)
  //     callApi('/admin/refund_report',1,{from_date: data.from_dt, to_date: data.to_dt,br_id:+data.outlet,comp_id:+comp});
  //   };
  //   return (
  //      <div>
  //      {!isReport &&  <ReportForm title="Refund Report" flag={0} onPress={(data) => onPress(data)} outlet={resp} />}
  //      {isReport &&
  //      <>
  //      <DescriptionComp title='Refund Report' from={from} to={to} location={location?location:'All outlets'} backPress={()=>setIsReport(false)} headers={[{name:'refund_rcpt_no',value:'Refund receipt No.'},{name:'refund_dt',value:'Date'},{name:'cust_name',value:'Customer'},{name:'phone_no',value:'Phone No.'},{name:'no_of_items',value:'No. of items'},{name:'qty',value:'Qty'},{name:'price',value:'Price'},{name:'discount_amt',value:'Discount'},{name:'cgst_amt',value:'CGST'},{name:'sgst_amt',value:'SGST'},{name:'round_off',value:'Round'},{name:'net_amt',value:'Amount'},{name:'refund_by',value:'Refu By'}]} data={dataSet} span={6} totals={totalPay}/>
  //      <DatatableComp headers={[{name:'refund_rcpt_no',value:'Refund receipt No.'},{name:'refund_dt',value:'Date'},{name:'cust_name',value:'Customer'},{name:'phone_no',value:'Phone No.'},{name:'no_of_items',value:'No. of items'},{name:'qty',value:'Qty'},{name:'price',value:'Price'},{name:'discount_amt',value:'Discount'},{name:'cgst_amt',value:'CGST'},{name:'sgst_amt',value:'SGST'},{name:'round_off',value:'Round'},{name:'net_amt',value:'Amount'},{name:'refund_by',value:'Refunded By'}]} data={dataSet} span={6} totals={totalPay}/>
  //      </>}
  //      </div>
  //   )
}

export default RefundReport;
