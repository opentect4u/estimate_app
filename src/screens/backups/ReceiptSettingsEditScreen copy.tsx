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
import useEditReceiptSettings from "../hooks/api/useEditReceiptSettings"
import { ReceiptSettingsEditCredentials } from "../models/api_types"
import InputPaper from "../components/InputPaper"

export default function ReceiptSettingsEditScreen() {
  const theme = usePaperColorScheme()
  const isFocused = useIsFocused()
  const navigation = useNavigation()

  const loginStore = JSON.parse(loginStorage.getString("login-data"))

  const { receiptSettings, handleGetReceiptSettings } = useContext(AppStore)

  const { editReceiptSettings } = useEditReceiptSettings()

  const [rcptType, setRcptType] = useState<"P" | "B" | "S">(
    () => receiptSettings?.rcpt_type,
  )
  const [stockFlag, setStockFlag] = useState<"Y" | "N">(
    () => receiptSettings?.stock_flag,
  )
  const [gstFlag, setGstFlag] = useState<"Y" | "N">(
    () => receiptSettings?.gst_flag,
  )
  const [gstType, setGstType] = useState<"I" | "E">(
    () => receiptSettings?.gst_type,
  )
  const [customerInfo, setCustomerInfo] = useState<"Y" | "N">(
    () => receiptSettings?.cust_inf,
  )
  const [payMode, setPayMode] = useState<"Y" | "N">(
    () => receiptSettings?.pay_mode,
  )
  const [discountFlag, setDiscountFlag] = useState<"Y" | "N">(
    () => receiptSettings?.discount_flag,
  )
  const [discountType, setDiscountType] = useState<"P" | "A">(
    () => receiptSettings?.discount_type,
  )
  const [priceType, setPriceType] = useState<"A" | "M">(
    () => receiptSettings?.price_type,
  )
  const [refundTime, setRefundTime] = useState<number>(
    () => receiptSettings?.refund_days,
  )
  // const [cancelBillFlag, setCancelBillFlag] = useState<"Y" | "N">(() => "Y")
  const [unitFlag, setUnitFlag] = useState<"Y" | "N">(
    receiptSettings?.unit_flag,
  )

  // const dependencyArray = [
  //     rcptType,
  //     stockFlag,
  //     gstFlag,
  //     customerInfo,
  //     payMode,
  //     discountFlag,
  //     discountType,
  //     priceType,
  //     unitFlag
  // ]

  let receiptTypeArr = [
    {
      icon: "cloud-print-outline",
      title: "Print",
      func: () => setRcptType("P"),
    },
    { icon: "android-messages", title: "SMS", func: () => setRcptType("S") },
    { icon: "all-inclusive", title: "Both", func: () => setRcptType("B") },
  ]

  let stockFlagArr = [
    { icon: "check-outline", title: "Allow", func: () => setStockFlag("Y") },
    { icon: "close-outline", title: "Deny", func: () => setStockFlag("N") },
  ]

  let gstFlagArr = [
    { icon: "check-outline", title: "Allow", func: () => setGstFlag("Y") },
    { icon: "close-outline", title: "Deny", func: () => setGstFlag("N") },
  ]

  let gstTypeArr = [
    {
      icon: "tag-text-outline",
      title: "Exclusive",
      func: () => setGstType("E"),
    },
    { icon: "tag-outline", title: "Inclusive", func: () => setGstType("I") },
  ]

  let customerInfoArr = [
    { icon: "check-outline", title: "Allow", func: () => setCustomerInfo("Y") },
    { icon: "close-outline", title: "Deny", func: () => setCustomerInfo("N") },
  ]

  let payModeArr = [
    { icon: "check-outline", title: "Allow", func: () => setPayMode("Y") },
    { icon: "close-outline", title: "Deny", func: () => setPayMode("N") },
  ]

  let discountSwitchArr = [
    { icon: "check-outline", title: "Allow", func: () => setDiscountFlag("Y") },
    { icon: "close-outline", title: "Deny", func: () => setDiscountFlag("N") },
  ]

  let discountTypeArr = [
    {
      icon: "percent-outline",
      title: "Percentage",
      func: () => setDiscountType("P"),
    },
    { icon: "cash", title: "Amount", func: () => setDiscountType("A") },
  ]

  let priceAutoManualArr = [
    { icon: "auto-fix", title: "Auto", func: () => setPriceType("A") },
    {
      icon: "database-edit-outline",
      title: "Manual",
      func: () => setPriceType("M"),
    },
  ]

  // let cancelBillSwitchArr = [
  //     { icon: "check-outline", title: "Allow", func: () => setCancelBillFlag("Y") },
  //     { icon: "cancel", title: "Deny", func: () => setCancelBillFlag("N") },
  // ]

  let unitSwitchArr = [
    { icon: "check-outline", title: "Allow", func: () => setUnitFlag("Y") },
    { icon: "cancel", title: "Deny", func: () => setUnitFlag("N") },
  ]

  const handleReceiptSettingsUpdate = async () => {
    let editedReceiptSettings: ReceiptSettingsEditCredentials = {
      comp_id: loginStore?.comp_id,
      rcpt_type: rcptType,
      stock_flag: stockFlag,
      gst_flag: gstFlag,
      gst_type: gstType,
      cust_inf: customerInfo,
      pay_mode: payMode,
      discount_flag: discountFlag,
      discount_type: discountType,
      price_type: priceType,
      created_by: loginStore?.user_name,
      modified_by: loginStore?.user_name,
      unit_flag: unitFlag,
      refund_days: refundTime,
    }

    await editReceiptSettings(editedReceiptSettings)
      .then(res => {
        ToastAndroid.show("Receipt Settings Updated!", ToastAndroid.SHORT)
        handleGetReceiptSettings()
        navigation.goBack()
      })
      .catch(err => {
        ToastAndroid.show(
          "Something went wrong while updating!",
          ToastAndroid.SHORT,
        )
      })
  }

  // useEffect(() => {
  //     handleReceiptSettingsUpdate()
  // }, dependencyArray)

  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        "Updated the data?",
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
      "Updated the data?",
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
            Receipt Settings
          </HeaderImage>
        </View>

        <View
          style={{
            paddingHorizontal: normalize(20),
            paddingVertical: normalize(10),
          }}>
          {loginStore?.user_type === "M" ? (
            <ButtonPaper
              icon="cloud-upload-outline"
              mode="contained"
              onPress={handleReceiptSettingsUpdate}>
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
              return <MenuPaper menuArrOfObjects={receiptTypeArr} />
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
            title="GST"
            description={
              gstFlag === "Y"
                ? "Allowed"
                : gstFlag === "N"
                ? "Denied"
                : "Error Occurred!"
            }
            left={props => <List.Icon {...props} icon="account-cash-outline" />}
            right={props => {
              return <MenuPaper menuArrOfObjects={gstFlagArr} />
            }}
            descriptionStyle={{
              color: gstFlag === "Y" ? theme.colors.green : theme.colors.error,
            }}
          />
          <Divider />
          {gstFlag === "Y" && (
            <>
              <List.Item
                title="GST Type"
                description={
                  gstType === "E"
                    ? "Exclusive"
                    : gstType === "I"
                    ? "Inclusive"
                    : "Error Occurred!"
                }
                left={props => (
                  <List.Icon {...props} icon="account-cash-outline" />
                )}
                right={props => {
                  return <MenuPaper menuArrOfObjects={gstTypeArr} />
                }}
                descriptionStyle={{ color: theme.colors.primary }}
              />
              <Divider />
            </>
          )}
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
            title="Discount"
            description={
              discountFlag === "Y"
                ? "Allowed"
                : discountFlag === "N"
                ? "Denied"
                : "Error Occurred!"
            }
            left={props => (
              <List.Icon {...props} icon="label-percent-outline" />
            )}
            right={props => {
              return <MenuPaper menuArrOfObjects={discountSwitchArr} />
            }}
            descriptionStyle={{
              color:
                discountFlag === "Y" ? theme.colors.green : theme.colors.error,
            }}
          />
          <Divider />
          {discountFlag === "Y" && (
            <>
              <List.Item
                title="Discount Type"
                description={
                  discountType === "P"
                    ? "Percentage (%)"
                    : discountType === "A"
                    ? "Amount (₹)"
                    : "Error Occurred!"
                }
                left={props => <List.Icon {...props} icon="cash-minus" />}
                right={props => {
                  return <MenuPaper menuArrOfObjects={discountTypeArr} />
                }}
                descriptionStyle={{ color: theme.colors.primary }}
              />
              <Divider />
            </>
          )}
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
          {/* <List.Item
                        title="Cancel Bill"
                        description={cancelBillFlag === "Y" ? "Allowed" : cancelBillFlag === "N" ? "Denied" : "Error Occurred!"}
                        left={props => <List.Icon {...props} icon="cancel" />}
                        right={props => {
                            return (
                                <MenuPaper menuArrOfObjects={cancelBillSwitchArr} />
                            )
                        }}
                        descriptionStyle={{ color: cancelBillFlag === "Y" ? theme.colors.green : theme.colors.error }}
                    />
                    <Divider /> */}
        </View>
        {/* <View style={{ paddingHorizontal: normalize(20), paddingVertical: normalize(10) }}>
                    {loginStore?.user_type === "M" ? (
                        <ButtonPaper icon="cloud-upload-outline" mode="contained" onPress={handleReceiptSettingsUpdate}>
                            UPDATE
                        </ButtonPaper>
                    ) : (
                        <ButtonPaper disabled mode="elevated" onPress={() => console.log("UPDATE")}>
                            YOU CAN'T UPDATE
                        </ButtonPaper>
                    )}
                </View> */}
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
