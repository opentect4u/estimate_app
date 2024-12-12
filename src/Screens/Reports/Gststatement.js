// import React, { useEffect, useState } from 'react'
// import ReportForm from "../../Components/ReportForm";
// import useAPI from "../../Hooks/useApi";
// import { Message } from "../../Components/Message";
// import DatatableComp from "../../Components/DatatableComp";
// import DescriptionComp from '../../Components/DescriptionComp';

function Gststatement() {
  //   const {response,callApi} = useAPI();
  //   const [resp,setRestp]=useState()
  //   const [isReport,setIsReport] = useState(false)
  //   const [isCalled,setCalled] = useState(false)
  //   const [dataSet,setDataSet] = useState()
  //   const [from, setFrom] = useState()
  //   const [to, setTo] = useState()
  //   const [location,setLocation] = useState()
  //   const [totalPay,setTotal] = useState()
  //   var comp,totals=[],initpay=0,taxable_amt=0,cgst_amt=0,sgst_amt=0,total_tax=0;
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
  //         response?.data?.msg?.forEach(e=>initpay+=e.net_amt)
  //         response?.data?.msg?.forEach(e=>taxable_amt+=e.taxable_amt)
  //         response?.data?.msg?.forEach(e=>cgst_amt+=e.cgst_amt)
  //         response?.data?.msg?.forEach(e=>sgst_amt+=e.sgst_amt)
  //         response?.data?.msg?.forEach(e=>total_tax+=e.total_tax)
  //         totals.push(initpay.toFixed(2),taxable_amt.toFixed(2),cgst_amt.toFixed(2),sgst_amt.toFixed(2),total_tax.toFixed(2))
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
  //     const onPress = (data) => {
  //       console.log(data)
  //       setFrom(data.from_dt)
  //       setTo(data.to_dt)
  //       comp = localStorage.getItem('comp_id')
  //       setCalled(true)
  //     setLocation(resp?.filter(e=>e?.id==data.outlet)[0]?.branch_name)
  //       callApi('/admin/gst_statement',1,{from_date: data.from_dt, to_date: data.to_dt,br_id:+data.outlet,comp_id:+comp});
  //       };
  //   return (
  //     <div>
  //      {!isReport && <ReportForm title="GST Statement" flag={0} onPress={(data) => onPress(data)} outlet={resp} />
  // }
  //      {isReport &&
  //      <>
  //      <DescriptionComp title='GST Statement' from={from} to={to} location={location?location:'All outlets'} backPress={()=>setIsReport(false)} headers={[{name:'receipt_no',value:'Receipt No.'},{name:'trn_date',value:'Date'},{name:'taxable_amt',value:'Taxable Amt.'},{name:'cgst_amt',value:'CGST'},{name:'sgst_amt',value:'SGST'},{name:'total_tax',value:'Total'},{name:'net_amt',value:'Net Amt.'}]} data={dataSet} span={2} totals={totalPay}/>
  //      <DatatableComp headers={[{name:'receipt_no',value:'Receipt No.'},{name:'trn_date',value:'Date'},{name:'taxable_amt',value:'Taxable Amt.'},{name:'cgst_amt',value:'CGST'},{name:'sgst_amt',value:'SGST'},{name:'total_tax',value:'Total'},{name:'net_amt',value:'Net Amt.'}]} data={dataSet} span={2} totals={totalPay}/>
  //      </>
  //    }
  //      </div>
  //   )
}

export default Gststatement;
