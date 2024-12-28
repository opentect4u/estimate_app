import React, { createContext, useEffect, useRef, useState } from "react"
import { AppState, Alert, ToastAndroid } from "react-native"
import FastImage from 'react-native-fast-image'
import { ezetapStorage, itemsContextStorage, loginStorage, productStorage } from "../storage/appStorage"
import { fileStorage } from "../storage/appStorage"
import useReceiptSettings from "../hooks/api/useReceiptSettings"
import useLogin from "../hooks/api/useLogin"
import {
  CategoryListData,
  ItemsData,
  LogoutCredentials,
  ReceiptSettingsData,
  SendOtpCredentials,
  UnitData,
} from "../models/api_types"
import useItems from "../hooks/api/useItems"
import useUnits from "../hooks/api/useUnits"
import useSendOtp from "../hooks/api/useSendOtp"
import useLogout from "../hooks/api/useLogout"
import useCategories from "../hooks/api/useCategories"
import useSendOtp2 from "../hooks/api/useSendOtp2"
import { AppStoreContext } from "../models/custom_types"
import RNEzetapSdk from "react-native-ezetap-sdk"

export const AppStore = createContext<AppStoreContext>(null)

const AppContext = ({ children }) => {
  const appState = useRef(AppState.currentState)

  const [isLogin, setIsLogin] = useState<boolean>(() => false)
  const [otp, setOtp] = useState<number>()
  const [receiptSettings, setReceiptSettings] = useState<ReceiptSettingsData>()
  const [items, setItems] = useState<ItemsData[]>(() => [])
  const [categories, setCategories] = useState<CategoryListData[]>(() => [])
  const [units, setUnits] = useState<UnitData[]>(() => [])

  const [flagOtp, setFlagOtp] = useState<boolean>(() => false)

  const { login } = useLogin()
  const { logout } = useLogout()
  const { fetchReceiptSettings } = useReceiptSettings()
  const { fetchItems } = useItems()
  const { fetchUnits } = useUnits()
  // const { getOtp } = useSendOtp()
  const { getOtp } = useSendOtp2()
  const { fetchCategories } = useCategories()

  // const initRazorpay = async () => {
  //   var withAppKey =
  //     '{"userName":' +
  //     "9903044748" +
  //     ',"demoAppKey":"a40c761a-b664-4bc6-ab5a-bf073aa797d5","prodAppKey":"a40c761a-b664-4bc6-ab5a-bf073aa797d5","merchantName":"SYNERGIC_SOFTEK_SOLUTIONS","appMode":"DEMO","currencyCode":"INR","captureSignature":false,"prepareDevice":false}'
  //   var response = await RNEzetapSdk.initialize(withAppKey)
  //   console.log("XXXXXXXXXXCCCCCCCCCCCCCC========RES", response)
  //   // var jsonData = JSON.parse(response)
  //   // setRazorpayInitializationJson(jsonData)
  //   ezetapStorage.set("ezetap-initialization-json", response)
  // }

  // const init = async () => {
  //   console.log(
  //     "PPPPPPPPPPPPKKKKKKKKKKKKK",
  //     ezetapStorage.contains("ezetap-initialization-json"),
  //     ezetapStorage.getString("ezetap-initialization-json"),
  //   )
  //   // if (!ezetapStorage.contains("ezetap-initialization-json")) {
  //   await initRazorpay()

  //   var res = await RNEzetapSdk.prepareDevice()
  //   console.warn("RAZORPAY===PREPARE DEVICE", res)
  //   // }
  // }

  // useEffect(() => {
  //   init()
  // }, [])

  // useEffect(() => {
  //   const handleAppStateChange = (nextAppState) => {
  //     if (nextAppState === 'background') {
  //       console.log('App has gone to the background!');

  //       // ezetapStorage.clearAll()
  //     } else if (nextAppState === 'inactive') {
  //       console.log('App is closing!');

  //       // ezetapStorage.clearAll()
  //     }
  //   };

  //   const subscription = AppState.addEventListener('change', handleAppStateChange);

  //   return () => {
  //     subscription.remove();
  //   };
  // }, []);

  const handleLogin = async (loginText: string, passwordText: string) => {
    setFlagOtp(!flagOtp)
    console.log("@@@@@@@@@@@@@@@@", loginText, passwordText)
    await login(loginText, passwordText)
      .then(loginData => {
        console.log("loginData", loginData)

        if (loginData?.suc === 0) {
          // Alert.alert("Error", "Login credentials are wrong! Please try again.")
          Alert.alert("Error", loginData?.msg?.toString())
          setIsLogin(false)
          return
        }
        if (loginData?.suc === 1) {
          // setOtp(loginData?.otp?.otp)
          // let otpCreds: SendOtpCredentials = {
          //   comp_id: loginData?.msg?.comp_id,
          //   phone: loginData?.msg?.user_id,
          // }

          loginStorage.set("login-data", JSON.stringify(loginData?.msg))

          setIsLogin(true)
          // getOtp(otpCreds)
          //   .then(res => {
          //     setOtp(res?.otp)
          //   })
          //   .catch(err => {
          //     ToastAndroid.show(
          //       "Some error while sending otp.",
          //       ToastAndroid.SHORT,
          //     )
          //     console.log("ERRR OTP: ", err)
          //   })

          // loginStorage.set("login-data", JSON.stringify(loginData?.msg))
        }
        // setIsLogin(true)
      })
      .catch(err => {
        console.log("========", err)
        ToastAndroid.show(
          "Some error on server while logging in.",
          ToastAndroid.SHORT,
        )
      })
  }

  // useEffect(() => {
  //   setTimeout(() => {
  //     console.log("CALLED OTP RESET")
  //     setOtp(-1)
  //   }, 300000)
  // }, [flagOtp])

  // const handleLogin = async (loginText: string, passwordText: string) => {
  //   await login(loginText, passwordText).then(loginData => {
  //     console.log("loginData", loginData)

  //     if (loginData?.suc === 0) {
  //       Alert.alert("Error", "Login credentials are wrong! Please try again.")
  //       setIsLogin(false)
  //       return
  //     }
  //     if (loginData?.suc === 1) {
  //       loginStorage.set("login-data", JSON.stringify(loginData?.msg));
  //     }
  //     setIsLogin(true)
  //   }).catch(err => {
  //     ToastAndroid.show("No internet or Some error on server.", ToastAndroid.SHORT)
  //   })
  // }

  const isLoggedIn = () => {
    if (loginStorage.getAllKeys().length === 0) {
      console.log("IF - isLoggedIn")
      setIsLogin(false)
    } else {
      console.log("ELSE - isLoggedIn")
      setIsLogin(true)
    }
  }

  useEffect(() => {
    if (appState.current === "active") {
      isLoggedIn()
    }
  }, [])

  const handleGetReceiptSettings = async () => {
    const loginStore = JSON.parse(loginStorage.getString("login-data"))

    const companyId = loginStore.comp_id
    await fetchReceiptSettings(companyId)
      .then(res => {
        setReceiptSettings(res[0])
        console.log("receiptSettingsData", res[0])
      })
      .catch(err => {
        ToastAndroid.show(
          "Error fetching Receipt Settings.",
          ToastAndroid.SHORT,
        )
      })
  }

  const handleGetItems = async () => {
    const loginStore = JSON.parse(loginStorage.getString("login-data"))
    const companyId = loginStore.comp_id
    let itemsData = await fetchItems(companyId)
    // console.log("itemsData", itemsData)

    setItems(itemsData)
  }

  const handleGetCategories = async () => {
    const loginStore = JSON.parse(loginStorage.getString("login-data"))

    await fetchCategories(loginStore?.comp_id).then(res => {
      setCategories(res?.msg)
    }).catch(err => {
      ToastAndroid.show(`Some error occurred while getting categories - ${err}`, ToastAndroid.SHORT)
    })
  }

  const handleGetUnits = async () => {
    const loginStore = JSON.parse(loginStorage.getString("login-data"))
    const companyId = loginStore.comp_id

    let unitsData = await fetchUnits(companyId)
    console.log("unitsData", unitsData)

    setUnits(unitsData)
  }

  useEffect(() => {
    if (isLogin) {
      handleGetReceiptSettings()
    }
  }, [isLogin])

  const handleLogout = async () => {
    const loginStore = JSON.parse(loginStorage.getString("login-data"))

    const logoutCreds: LogoutCredentials = {
      comp_id: loginStore?.comp_id,
      br_id: loginStore?.br_id,
      user_id: loginStore?.user_id
    }

    await logout(logoutCreds).then(res => {
      loginStorage.clearAll()
      fileStorage.clearAll()
      productStorage.clearAll()
      itemsContextStorage.clearAll()
      FastImage.clearMemoryCache()
      FastImage.clearDiskCache()
      setIsLogin(false)
      ToastAndroid.show(`${res?.data}`, ToastAndroid.SHORT)
    }).catch(err => {
      ToastAndroid.show("Some error occurred while logging out!", ToastAndroid.SHORT)
    })
    // loginStorage.clearAll()
    // fileStorage.clearAll()
    // setIsLogin(!isLogin)
  }

  return (
    <AppStore.Provider
      value={{
        isLogin,
        otp,
        setIsLogin,
        handleLogin,
        handleLogout,
        receiptSettings,
        handleGetReceiptSettings,
        items,
        handleGetItems,
        categories,
        handleGetCategories,
        units,
        handleGetUnits,
        // init
      }}>
      {children}
    </AppStore.Provider>
  )
}

export default AppContext
