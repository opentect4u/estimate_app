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
import { GstSettingsEditCredentials } from "../models/api_types"
import useGstSettings from "../hooks/api/useGstSettings"
import { AppStoreContext } from "../models/custom_types"

export default function GstSettingsScreen() {
  const theme = usePaperColorScheme()
  const isFocused = useIsFocused()
  const navigation = useNavigation()

  const loginStore = JSON.parse(loginStorage.getString("login-data"))

  const { receiptSettings, handleGetReceiptSettings } = useContext<AppStoreContext>(AppStore)

  const { editGstSettings } = useGstSettings()

  const [isLoading, setIsLoading] = useState(() => false)
  const [isDisabled, setIsDisabled] = useState(() => false)

  const [gstFlag, setGstFlag] = useState<"Y" | "N">(
    () => receiptSettings?.gst_flag,
  )
  const [gstType, setGstType] = useState<"I" | "E">(
    () => receiptSettings?.gst_type,
  )

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

  const handleReceiptSettingsUpdate = async () => {
    setIsDisabled(true)
    setIsLoading(true)
    let editedGstSettings: GstSettingsEditCredentials = {
      comp_id: loginStore?.comp_id,
      gst_flag: gstFlag,
      gst_type: gstType,
      modified_by: loginStore?.user_name,
    }

    await editGstSettings(editedGstSettings)
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
            GST Settings
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
