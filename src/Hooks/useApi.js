import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Components/Loader";
import { Message } from "../Components/Message";
import Democontext, { loaderProvider } from "../Context/Democontext";
import { useNavigate } from "react-router-dom";
import { url } from "../Address/baseURL";
const axios_instance = axios.create({
  // baseURL: 'http://192.168.1.238:3005',
  baseURL: url,
  // baseURL: 'http://202.21.38.178:3005',
  // baseURL: `${url}`,
  headers: {},
});
let response_count = 0;

axios_instance.interceptors.request.use(
  function (config) {
    response_count++;
    if (!loaderProvider.loading) {
      loaderProvider.setLoading(true);
    }
    <Loader hidden={true} />;
    console.log(response_count);

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axios_instance.interceptors.response.use(
  function (response) {
    console.log(response_count);
    response_count--;
    if (response_count === 0) {
      // setTimeout(()=>{
      loaderProvider.setLoading(false);

      // },500)
    }
    return response;
  },
  function (error) {
    response_count--;
    if (response_count === 0) {
      // setTimeout(()=>{
      loaderProvider.setLoading(false);

      // },500)
    }

    return Promise.reject(error);
  }
);

/******************************************************************************************* */
// const useApi=(url,flag,dt) => {

//     const [data, setData] = useState(null);

//     useEffect(() => {

//       if(flag==0){
//         axios_instance.get(url).then((res)=>{console.log(res); setData(res)})
//       }
//       else{
//         axios_instance.post(url,dt).then((res)=>{console.log(res); setData(res)})
//       }

//     }, [url]);
//     return [data];
//   }
// export default useApi;

/*********************************************************************** */

const useAPI = () => {
  const navigation = useNavigate();

  const [response, setReponse] = useState(null);

  const callApi = (api_url, flag_for_methode_identification, dt_to_be_sent) => {
    if (flag_for_methode_identification == 0) {
      axios_instance
        .get(api_url)
        .then((res) => {
          console.log(res);
          setReponse(res);
        })
        .catch((err) => {
          console.log(err);
          Message("error", err);
        });
    } else {
      axios_instance
        .post(api_url, dt_to_be_sent)
        .then((res) => {
          console.log(res);
          setReponse(res);
        })
        .catch((err) => {
          console.log(err);
          navigation("/noresult" + "/" + err.code + "/" + err.message);
          // alert('hii')
          // Message('error',err)
        });
    }
  };

  // useEffect(()=>{
  //       callApi(url,flag,dt)
  // },[url,flag,dt])

  return { response, callApi };
};

export default useAPI;
