import React, { createContext, useEffect, useRef, useState } from "react"
import { AppState, Alert, ToastAndroid } from "react-native"
import { loginStorage } from "../storage/appStorage"
import { fileStorage } from "../storage/appStorage"
import useReceiptSettings from "../hooks/api/useReceiptSettings"
import useLogin from "../hooks/api/useLogin"
import { ItemsData, ReceiptSettingsData, UnitData } from "../models/api_types"
import useItems from "../hooks/api/useItems"
import useUnits from "../hooks/api/useUnits"

export const AppStore = createContext(null)

const AppContext = ({ children }) => {
  const appState = useRef(AppState.currentState)

  const [isLogin, setIsLogin] = useState<boolean>(() => false)
  const [otp, setOtp] = useState<number>()
  const [receiptSettings, setReceiptSettings] = useState<ReceiptSettingsData>()
  const [items, setItems] = useState<ItemsData[]>(() => [])
  const [units, setUnits] = useState<UnitData[]>(() => [])

  const [flagOtp, setFlagOtp] = useState<boolean>(() => false)

  const { login } = useLogin()
  const { fetchReceiptSettings } = useReceiptSettings()
  const { fetchItems } = useItems()
  const { fetchUnits } = useUnits()

  const handleLogin = async (loginText: string) => {
    setFlagOtp(!flagOtp)
    await login(loginText)
      .then(loginData => {
        console.log("loginData", loginData)

        if (loginData?.suc === 0) {
          // Alert.alert("Error", "Login credentials are wrong! Please try again.")
          Alert.alert("Error", loginData?.msg?.toString())
          setIsLogin(false)
          return
        }
        if (loginData?.suc === 1) {
          setOtp(loginData?.otp?.otp)
          loginStorage.set("login-data", JSON.stringify(loginData?.msg))
        }
        // setIsLogin(true)
      })
      .catch(err => {
        ToastAndroid.show(
          "No internet or Some error on server.",
          ToastAndroid.SHORT,
        )
      })
  }

  useEffect(() => {
    setTimeout(() => {
      console.log("CALLED OTP RESET")
      setOtp(-1)
    }, 300000)
  }, [flagOtp])

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
      setIsLogin(isLogin)
    } else {
      console.log("ELSE - isLoggedIn")
      setIsLogin(!isLogin)
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
    console.log("itemsData", itemsData)

    setItems(itemsData)
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

  const handleLogout = () => {
    loginStorage.clearAll()
    fileStorage.clearAll()
    setIsLogin(!isLogin)
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
        units,
        handleGetUnits,
      }}>
      {children}
    </AppStore.Provider>
  )
}

export default AppContext
