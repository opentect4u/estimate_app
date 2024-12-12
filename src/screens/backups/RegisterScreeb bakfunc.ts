// const handleRegister = async () => {
//     await register(mobileNo).then(async res => {
//         console.log("registeredData", res)

//         if (res?.status === 0) {
//             Alert.alert("Message", "Mobile No is not Registered.")
//             setMobileNo("")
//             return
//         }
//         else if (res?.status === 1) {
//             await verifyActive(mobileNo).then(async res => {
//                 console.log("verifyActiveData", res)

//                 if (res?.status === -1) {
//                     Alert.alert("Message", "Mobile No is already in use.")
//                     setMobileNo("")
//                     return
//                 } else {
//                     await getOtp(mobileNo).then(res => {
//                         console.log("otpData", res)

//                         setFetchedOtp(res?.data)
//                         setNext(!next)
//                     }).catch(err => {
//                         ToastAndroid.show("Some error on server.", ToastAndroid.SHORT)
//                     })
//                 }
//             }).catch(err => {
//                 ToastAndroid.show("Some error on server.", ToastAndroid.SHORT)
//             })
//         }
//     }).catch(err => {
//         ToastAndroid.show("Some error on server.", ToastAndroid.SHORT)
//     })
// }
