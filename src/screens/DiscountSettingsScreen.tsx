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
import { DiscountSettingsEditCredentials } from "../models/api_types"
import useDiscountSettings from "../hooks/api/useDiscountSettings"
import { AppStoreContext } from "../models/custom_types"

export default function DiscountSettingsScreen() {
  const theme = usePaperColorScheme()
  const isFocused = useIsFocused()
  const navigation = useNavigation()

  const loginStore = JSON.parse(loginStorage.getString("login-data"))

  const { receiptSettings, handleGetReceiptSettings } = useContext<AppStoreContext>(AppStore)

  const { editDiscountSettings } = useDiscountSettings()

  const [isLoading, setIsLoading] = useState(() => false)
  const [isDisabled, setIsDisabled] = useState(() => false)

  const [discountFlag, setDiscountFlag] = useState<"Y" | "N">(
    () => receiptSettings?.discount_flag,
  )
  const [discountType, setDiscountType] = useState<"P" | "A">(
    () => receiptSettings?.discount_type,
  )
  const [discountPosition, setDiscountPosition] = useState<"B" | "I">(
    () => receiptSettings?.discount_position,
  )
  // const [discountPosition, setDiscountPosition] = useState<"B" | "I">(() => "I")

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

  let discountPositionArr = [
    {
      icon: "shopping-outline",
      title: "Itemwise",
      func: () => setDiscountPosition("I"),
    },
    {
      icon: "receipt",
      title: "Billwise",
      func: () => setDiscountPosition("B"),
    },
  ]

  const handleReceiptSettingsUpdate = async () => {
    setIsDisabled(true)
    setIsLoading(true)
    let editedDiscountSettings: DiscountSettingsEditCredentials = {
      comp_id: loginStore?.comp_id,
      discount_flag: discountFlag,
      discount_type: discountType,
      discount_position: discountPosition,
      modified_by: loginStore?.user_name,
    }

    await editDiscountSettings(editedDiscountSettings)
      .then(res => {
        ToastAndroid.show("Discount Settings Updated!", ToastAndroid.SHORT)
        handleGetReceiptSettings()
        navigation.goBack()
      })
      .catch(err => {
        ToastAndroid.show(
          "Something went wrong while updating!",
          ToastAndroid.SHORT,
        )
      })
    setIsLoading(false)
    setIsDisabled(false)
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
            Discount Settings
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
              <List.Item
                title="Discount Position"
                description={
                  discountPosition === "I"
                    ? "Itemwise"
                    : discountPosition === "B"
                      ? "Billwise"
                      : "Error Occurred!"
                }
                left={props => <List.Icon {...props} icon="cash-marker" />}
                right={props => {
                  return <MenuPaper menuArrOfObjects={discountPositionArr} />
                }}
                descriptionStyle={{ color: theme.colors.primary }}
              />
              <Divider />
            </>
          )}
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
