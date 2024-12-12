import {
  View,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  Alert,
  BackHandler,
} from "react-native"
import React, { useContext, useEffect, useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { Divider, List } from "react-native-paper"
import normalize, { SCREEN_HEIGHT, SCREEN_WIDTH } from "react-native-normalize"
import HeaderImage from "../components/HeaderImage"
import { flowerHome, flowerHomeDark } from "../resources/images"
import { usePaperColorScheme } from "../theme/theme"
import { loginStorage } from "../storage/appStorage"
import { useIsFocused, useNavigation } from "@react-navigation/native"
import { AppStore } from "../context/AppContext"
import MenuPaper from "../components/MenuPaper"
import ButtonPaper from "../components/ButtonPaper"
import { GeneralSettingsEditCredentials } from "../models/api_types"
import InputPaper from "../components/InputPaper"
import useGeneralSettings from "../hooks/api/useGeneralSettings"
import { AppStoreContext } from "../models/custom_types"

export default function GeneralSettingsScreen() {
  const theme = usePaperColorScheme()
  const isFocused = useIsFocused()
  const navigation = useNavigation()

  const loginStore = JSON.parse(loginStorage.getString("login-data"))

  const { receiptSettings, handleGetReceiptSettings } = useContext<AppStoreContext>(AppStore)

  const { editGeneralSettings } = useGeneralSettings()

  const [isLoading, setIsLoading] = useState(() => false)
  const [isDisabled, setIsDisabled] = useState(() => false)

  const [rcptType, setRcptType] = useState<"P" | "B" | "S">(
    () => receiptSettings?.rcpt_type,
  )
  const [receiptFlag, setReceiptFlag] = useState<"Y" | "N">(
    () => receiptSettings?.rcpt_flag,
  )
  const [stockFlag, setStockFlag] = useState<"Y" | "N">(
    () => receiptSettings?.stock_flag,
  )
  const [customerInfo, setCustomerInfo] = useState<"Y" | "N">(
    () => receiptSettings?.cust_inf,
  )
  const [payMode, setPayMode] = useState<"Y" | "N">(
    () => receiptSettings?.pay_mode,
  )
  const [priceType, setPriceType] = useState<"A" | "M">(
    () => receiptSettings?.price_type,
  )
  const [cashFlag, setCashFlag] = useState<"Y" | "N">(
    () => receiptSettings?.rcv_cash_flag,
  )
  const [kot, setKot] = useState<"Y" | "N">(
    () => receiptSettings?.kot_flag,
  )
  const [refundTime, setRefundTime] = useState<number>(
    () => receiptSettings?.refund_days,
  )
  const [unitFlag, setUnitFlag] = useState<"Y" | "N">(
    receiptSettings?.unit_flag,
  )

  let receiptTypeArr = [
    {
      icon: "cloud-print-outline",
      title: "Print",
      func: () => setRcptType("P"),
    },
    { icon: "android-messages", title: "SMS", func: () => setRcptType("S") },
    { icon: "all-inclusive", title: "Both", func: () => setRcptType("B") },
  ]

  // let receiptFlagArr = [
  //   { icon: "check-outline", title: "Allow", func: () => setReceiptFlag("Y") },
  //   { icon: "close-outline", title: "Deny", func: () => setReceiptFlag("N") },
  // ]

  let stockFlagArr = [
    { icon: "check-outline", title: "Allow", func: () => setStockFlag("Y") },
    { icon: "close-outline", title: "Deny", func: () => setStockFlag("N") },
  ]

  let customerInfoArr = [
    { icon: "check-outline", title: "Allow", func: () => setCustomerInfo("Y") },
    { icon: "close-outline", title: "Deny", func: () => setCustomerInfo("N") },
  ]

  let payModeArr = [
    { icon: "check-outline", title: "Allow", func: () => setPayMode("Y") },
    { icon: "close-outline", title: "Deny", func: () => setPayMode("N") },
  ]

  let priceAutoManualArr = [
    { icon: "auto-fix", title: "Auto", func: () => setPriceType("A") },
    {
      icon: "database-edit-outline",
      title: "Manual",
      func: () => setPriceType("M"),
    },
  ]

  let cashFlagArr = [
    { icon: "check-outline", title: "Allow", func: () => setCashFlag("Y") },
    {
      icon: "close-outline",
      title: "Deny",
      func: () => setCashFlag("N"),
    },
  ]

  let unitSwitchArr = [
    { icon: "check-outline", title: "Allow", func: () => setUnitFlag("Y") },
    { icon: "close-outline", title: "Deny", func: () => setUnitFlag("N") },
  ]

  let kotArr = [
    { icon: "check-outline", title: "Allow", func: () => setKot("Y") },
    { icon: "close-outline", title: "Deny", func: () => setKot("N") },
  ]

  const handleReceiptSettingsUpdate = async () => {
    setIsDisabled(true)
    setIsLoading(true)
    let editedGeneralSettings: GeneralSettingsEditCredentials = {
      comp_id: loginStore?.comp_id,
      rcpt_type: rcptType,
      // rcpt_flag: receiptFlag,
      rcv_cash_flag: cashFlag,
      stock_flag: stockFlag,
      cust_inf: customerInfo,
      pay_mode: payMode,
      price_type: priceType,
      kot_flag: kot,
      modified_by: loginStore?.user_name,
      unit_flag: unitFlag,
      refund_days: refundTime,
    }

    console.log("==========+++++++++++=+===+++++++++======", editedGeneralSettings)

    await editGeneralSettings(editedGeneralSettings)
      .then(res => {
        ToastAndroid.show("General Settings Updated!", ToastAndroid.SHORT)

        console.log("*****************************************", res)
        handleGetReceiptSettings()
        navigation.goBack()
      })
      .catch(err => {
        ToastAndroid.show(
          "Something went wrong while updating!",
          ToastAndroid.SHORT,
        )
      })
    setIsDisabled(false)
    setIsLoading(false)
  }

  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        "Want to Go Back?",
        "Please press UPDATE Button to update. Do you want to still go back?",
        [
          {
            text: "NO",
            onPress: () => null,
            style: "cancel",
          },
          { text: "YES", onPress: () => navigation.goBack() },
        ],
      )
      return true
    }

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    )

    return () => backHandler.remove()
  }, [])

  const backPressed = () => {
    Alert.alert(
      "Want to Go Back?",
      "Please press UPDATE Button to update. Do you want to still go back?",
      [
        {
          text: "NO",
          onPress: () => null,
          style: "cancel",
        },
        { text: "YES", onPress: () => navigation.goBack() },
      ],
    )
  }

  return (
    <SafeAreaView
      style={[{ backgroundColor: theme.colors.background, height: "100%" }]}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={{ alignItems: "center" }}>
          <HeaderImage
            isBackEnabled
            isBackCustom={true}
            backPressed={backPressed}
            imgLight={flowerHome}
            imgDark={flowerHomeDark}
            borderRadius={30}
            blur={10}>
            General Settings
          </HeaderImage>
        </View>

        <View
          style={{
            paddingHorizontal: normalize(25),
            paddingBottom: normalize(10),
          }}>
          {loginStore?.user_type === "M" ? (
            <ButtonPaper
              icon="cloud-upload-outline"
              mode="contained"
              onPress={handleReceiptSettingsUpdate}
              loading={isLoading}
              disabled={isDisabled}>
              UPDATE
            </ButtonPaper>
          ) : (
            <ButtonPaper
              disabled
              mode="elevated"
              onPress={() => console.log("UPDATE")}>
              YOU CAN'T UPDATE
            </ButtonPaper>
          )}
        </View>

        <View style={{ padding: normalize(20) }}>
          <List.Item
            title="Receipt Type"
            description={
              rcptType === "P"
                ? "Print"
                : rcptType === "S"
                  ? "SMS"
                  : rcptType === "B"
                    ? "Both"
                    : "Error Occurred!"
            }
            left={props => <List.Icon {...props} icon="receipt" />}
            right={props => {
              return <MenuPaper menuArrOfObjects={receiptTypeArr} disabled />
            }}
            descriptionStyle={{ color: theme.colors.primary }}
          />
          <Divider />
          <List.Item
            title="Inventory"
            description={
              stockFlag === "Y"
                ? "Allowed"
                : stockFlag === "N"
                  ? "Denied"
                  : "Error Occurred!"
            }
            left={props => <List.Icon {...props} icon="inbox-full-outline" />}
            right={props => {
              return <MenuPaper menuArrOfObjects={stockFlagArr} />
            }}
            descriptionStyle={{
              color:
                stockFlag === "Y" ? theme.colors.green : theme.colors.error,
            }}
          />
          <Divider />
          <List.Item
            title="Unit"
            description={
              unitFlag === "Y"
                ? "Allowed"
                : unitFlag === "N"
                  ? "Denied"
                  : "Error Occurred!"
            }
            left={props => <List.Icon {...props} icon="weight-kilogram" />}
            right={props => {
              return <MenuPaper menuArrOfObjects={unitSwitchArr} />
            }}
            descriptionStyle={{
              color: unitFlag === "Y" ? theme.colors.green : theme.colors.error,
            }}
          />
          <Divider />
          <List.Item
            title="Customer Name"
            description={
              customerInfo === "Y"
                ? "Allowed"
                : customerInfo === "N"
                  ? "Denied"
                  : "Error Occurred!"
            }
            left={props => (
              <List.Icon {...props} icon="account-circle-outline" />
            )}
            right={props => {
              return <MenuPaper menuArrOfObjects={customerInfoArr} />
            }}
            descriptionStyle={{
              color:
                customerInfo === "Y" ? theme.colors.green : theme.colors.error,
            }}
          />
          <Divider />
          <List.Item
            title="Payment Mode"
            description={
              payMode === "Y"
                ? "Allowed"
                : payMode === "N"
                  ? "Denied"
                  : "Error Occurred!"
            }
            left={props => (
              <List.Icon {...props} icon="contactless-payment-circle-outline" />
            )}
            right={props => {
              return <MenuPaper menuArrOfObjects={payModeArr} />
            }}
            descriptionStyle={{
              color: payMode === "Y" ? theme.colors.green : theme.colors.error,
            }}
          />
          <Divider />
          <List.Item
            title="Cash Receive"
            description={
              cashFlag === "Y"
                ? "Allowed"
                : cashFlag === "N"
                  ? "Denied"
                  : "Error Occurred!"
            }
            left={props => (
              <List.Icon {...props} icon="cash-remove" />
            )}
            right={props => {
              return <MenuPaper menuArrOfObjects={cashFlagArr} />
            }}
            descriptionStyle={{
              color: cashFlag === "Y" ? theme.colors.green : theme.colors.error,
            }}
          />
          <Divider />
          <List.Item
            title="Price Type"
            description={
              priceType === "A"
                ? "Automatic"
                : priceType === "M"
                  ? "Manual Edit"
                  : "Error Occurred!"
            }
            left={props => <List.Icon {...props} icon="cash-lock-open" />}
            right={props => {
              return <MenuPaper menuArrOfObjects={priceAutoManualArr} />
            }}
            descriptionStyle={{
              color:
                priceType === "A" ? theme.colors.primary : theme.colors.orange,
            }}
          />
          <Divider />
          <List.Item
            title="KOT"
            description={
              kot === "Y"
                ? "Allowed"
                : kot === "N"
                  ? "Denied"
                  : "Error Occurred!"
            }
            left={props => <List.Icon {...props} icon="badge-account-outline" />}
            right={props => {
              return <MenuPaper menuArrOfObjects={kotArr} />
            }}
            descriptionStyle={{
              color:
                kot === "Y" ? theme.colors.green : theme.colors.error,
            }}
          />
          <Divider />
          <List.Item
            title="Refund Time (In Days)"
            description={
              refundTime == 1 ? `${refundTime} day` : `${refundTime} days`
            }
            left={props => <List.Icon {...props} icon="cash-refund" />}
            right={props => {
              return (
                <InputPaper
                  keyboardType="numeric"
                  label="Days"
                  mode="outlined"
                  value={refundTime}
                  onChangeText={(txt: number) => setRefundTime(txt)}
                  customStyle={{ height: normalize(35) }}
                  maxLength={3}
                />
              )
            }}
            descriptionStyle={{
              color:
                priceType === "A" ? theme.colors.primary : theme.colors.orange,
            }}
          />
          <Divider />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  iconBtnStyle: {
    justifyContent: "center",
    alignItems: "center",
    width: SCREEN_WIDTH / 10,
    height: SCREEN_HEIGHT / 20,
  },
  iconStyle: {
    alignSelf: "center",
  },
})
