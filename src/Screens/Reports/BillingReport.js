// import React, { useEffect, useState } from "react";
// import ReportForm from "../../Components/ReportForm";
// import useAPI from "../../Hooks/useApi";
// import { Message } from "../../Components/Message";
// import DatatableComp from "../../Components/DatatableComp";
// import DescriptionComp from "../../Components/DescriptionComp";

function BillingReport() {
  //   const {response,callApi} = useAPI();
  //   const [resp,setRestp]=useState()
  //   const [isReport,setIsReport] = useState(false)
  //   const [isCalled,setCalled] = useState(false)
  //   const [dataSet,setDataSet] = useState()
  //   const [from, setFrom] = useState()
  //   const [to, setTo] = useState()
  //   const [location,setLocation] = useState()
  //   const [totalPay,setTotal] = useState()
  //   var comp,totals=[],initpay=0;
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
  //         // let i = 1
  //         // for(let dt of response.data.msg){
  //         //   dt['sss'] = i;
  //         //   i++;
  //         // }
  //         // console.log(response.data, 'dsdasrawerasfasf');
  //         setDataSet(response?.data?.msg)
  //         response?.data?.msg?.forEach(e=>initpay+=e.net_amt)
  //         console.log(response?.data?.msg,'indicator')
  //         totals.push(initpay.toFixed(2))
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
  //     callApi('/admin/collection_report',1,{from_date: data.from_dt, to_date: data.to_dt,br_id:+data.outlet,comp_id:+comp,user_id:data.userlist});
  //   };
  //   return (
  // <div>
  // {!isReport &&  <ReportForm title="Billing Report" flag={1} onPress={(data) => onPress(data)} outlet={resp} />}
  // {isReport && <>
  // <DescriptionComp title='Billing Report' from={from} to={to} location={location?location:'All outlets'} backPress={()=>setIsReport(false)} headers={[{name:'pay_mode',value:'Mode'},{name:'no_of_bills',value:'No. of bills'},{name:'net_amt',value:'Amount'}]} data={dataSet} span={2} totals={totalPay}/>
  // <DatatableComp headers={[{name:'pay_mode',value:'Mode'},{name:'no_of_bills',value:'No. of bills'},{name:'net_amt',value:'Amount'}]} data={dataSet} span={2} totals={totalPay}/>
  // </>
  // }
  // </div>
  //   )
}

export default BillingReport;
