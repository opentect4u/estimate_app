import {
  View,
  ScrollView,
  StyleSheet,
  PixelRatio,
  ToastAndroid,
} from "react-native"
import React, { useContext, useEffect, useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { Switch, Text } from "react-native-paper"
import AnimatedFABPaper from "../components/AnimatedFABPaper"
import normalize, { SCREEN_HEIGHT, SCREEN_WIDTH } from "react-native-normalize"
import HeaderImage from "../components/HeaderImage"
import { flowerHome, flowerHomeDark } from "../resources/images"
import { usePaperColorScheme } from "../theme/theme"
import DialogBox from "../components/DialogBox"
import InputPaper from "../components/InputPaper"
import { loginStorage } from "../storage/appStorage"
import { AppStore } from "../context/AppContext"
import useEditHeaderFooter from "../hooks/api/useEditHeaderFooter"
import { useIsFocused } from "@react-navigation/native"
import { AppStoreContext } from "../models/custom_types"

const MAX_LENGTH = 25

export default function HeaderFooterScreen() {
  const isFocused = useIsFocused()
  const theme = usePaperColorScheme()

  const loginStore = JSON.parse(loginStorage.getString("login-data"))
  const { receiptSettings, handleGetReceiptSettings } = useContext<AppStoreContext>(AppStore)

  const [isExtended, setIsExtended] = useState(() => true)

  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition = Math.floor(nativeEvent?.contentOffset?.y) ?? 0
    setIsExtended(currentScrollPosition <= 0)
  }

  const [visible, setVisible] = useState(() => false)
  const hideDialog = () => setVisible(() => false)

  const [isHeader1On, setIsHeader1On] = useState(() =>
    receiptSettings?.on_off_flag1 === "Y" ? true : false,
  )
  const onToggleSwitchH1 = () => setIsHeader1On(!isHeader1On)
  const [isHeader2On, setIsHeader2On] = useState(() =>
    receiptSettings?.on_off_flag2 === "Y" ? true : false,
  )
  const onToggleSwitchH2 = () => setIsHeader2On(!isHeader2On)
  const [isFooter1On, setIsFooter1On] = useState(() =>
    receiptSettings?.on_off_flag3 === "Y" ? true : false,
  )
  const onToggleSwitchF1 = () => setIsFooter1On(!isFooter1On)
  const [isFooter2On, setIsFooter2On] = useState(() =>
    receiptSettings?.on_off_flag4 === "Y" ? true : false,
  )
  const onToggleSwitchF2 = () => setIsFooter2On(!isFooter2On)

  const [header1, setHeader1] = useState<string>(
    () => receiptSettings?.header1 || "",
  )
  const [header2, setHeader2] = useState<string>(
    () => receiptSettings?.header2 || "",
  )
  const [footer1, setFooter1] = useState<string>(
    () => receiptSettings?.footer1 || "",
  )
  const [footer2, setFooter2] = useState<string>(
    () => receiptSettings?.footer2 || "",
  )

  const { editHeaderFooter } = useEditHeaderFooter()

  useEffect(() => {
    handleGetReceiptSettings()
  }, [isFocused])

  const onDialogFailure = () => {
    setVisible(!visible)
  }

  const onDialogSuccecss = () => {
    handleEditHeaderFooter()
    setVisible(!visible)
  }

  const handleEditHeaderFooter = async () => {
    await editHeaderFooter(
      loginStore?.comp_id,
      header1,
      header2,
      footer1,
      footer2,
      isHeader1On ? "Y" : "N",
      isHeader2On ? "Y" : "N",
      isFooter1On ? "Y" : "N",
      isFooter2On ? "Y" : "N",
      loginStore?.user_name,
    )
      .then(res => {
        ToastAndroid.show(`${res?.data}`, ToastAndroid.SHORT)
      })
      .catch(err => {
        ToastAndroid.show(
          `Something went wrong while updating... ${err}`,
          ToastAndroid.SHORT,
        )
      })
  }

  const remainingChars = (maxChars: number, text: string) =>
    maxChars - text.length

  return (
    <SafeAreaView
      style={[{ backgroundColor: theme.colors.background, height: "100%" }]}>
      <ScrollView onScroll={onScroll}>
        <View style={{ alignItems: "center" }}>
          <HeaderImage
            isBackEnabled
            imgLight={flowerHome}
            imgDark={flowerHomeDark}
            borderRadius={30}
            blur={10}>
            Headers and Footers
          </HeaderImage>
        </View>

        <View
          style={{
            padding: normalize(25),
            justifyContent: "space-between",
            minHeight: SCREEN_HEIGHT / 2.28,
            height: "auto",
            width: SCREEN_WIDTH / 1.16,
            backgroundColor: theme.colors.purpleContainer,
            alignSelf: "center",
            borderRadius: normalize(20),
          }}>
          <View style={{ alignItems: "flex-end" }}>
            <View>
              <Text
                variant="displaySmall"
                style={{ color: theme.colors.onPurpleContainer }}>
                HEADERS
              </Text>
            </View>
            <View>
              <Text
                variant="titleLarge"
                style={[
                  styles.textStyle,
                  { borderColor: theme.colors.onPurpleContainer },
                ]}>
                1. {receiptSettings?.header1}
              </Text>
              <Text
                variant="titleLarge"
                style={[
                  styles.textStyle,
                  { borderColor: theme.colors.onPurpleContainer },
                ]}>
                2. {receiptSettings?.header2}
              </Text>
            </View>
          </View>
          <View style={{ alignItems: "flex-start" }}>
            <View>
              <Text
                variant="displaySmall"
                style={{ color: theme.colors.onPurpleContainer }}>
                FOOTERS
              </Text>
            </View>
            <View>
              <Text
                variant="titleLarge"
                style={[
                  styles.textStyle,
                  { borderColor: theme.colors.onPurpleContainer },
                ]}>
                1. {receiptSettings?.footer1}
              </Text>
              <Text
                variant="titleLarge"
                style={[
                  styles.textStyle,
                  { borderColor: theme.colors.onPurpleContainer },
                ]}>
                2. {receiptSettings?.footer2}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      {loginStore?.user_type === "M" && (
        <AnimatedFABPaper
          icon="content-save-edit-outline"
          label="EDIT"
          onPress={() => setVisible(!visible)}
          extended={isExtended}
          animateFrom="right"
          iconMode="dynamic"
          customStyle={styles.fabStyle}
        />
      )}
      <DialogBox
        icon="content-save-edit-outline"
        iconSize={40}
        visible={visible}
        hide={hideDialog}
        titleStyle={styles.title}
        btnSuccess="UPDATE"
        onFailure={onDialogFailure}
        onSuccess={onDialogSuccecss}>
        <View style={{ justifyContent: "space-between", height: 300 }}>
          <View style={{ alignItems: "center" }}>
            <View>
              <Text variant="titleLarge">Edit Header/Footer</Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 5,
            }}>
            <View style={{ width: "70%" }}>
              <InputPaper
                label={`Header 1 (${remainingChars(
                  MAX_LENGTH,
                  header1,
                )}/${MAX_LENGTH})`}
                onChangeText={(txt: string) => setHeader1(txt)}
                value={header1}
                keyboardType="default"
                maxLength={MAX_LENGTH}
                autoFocus
                mode="outlined"
              />
            </View>
            <View style={{ width: "30%" }}>
              <Switch value={isHeader1On} onValueChange={onToggleSwitchH1} />
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 5,
            }}>
            <View style={{ width: "70%" }}>
              <InputPaper
                label={`Header 2 (${remainingChars(
                  MAX_LENGTH,
                  header2,
                )}/${MAX_LENGTH})`}
                onChangeText={(txt: string) => setHeader2(txt)}
                value={header2}
                keyboardType="default"
                maxLength={MAX_LENGTH}
                mode="outlined"
              />
            </View>
            <View style={{ width: "30%" }}>
              <Switch value={isHeader2On} onValueChange={onToggleSwitchH2} />
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 5,
            }}>
            <View style={{ width: "70%" }}>
              <InputPaper
                label={`Footer 1 (${remainingChars(
                  MAX_LENGTH,
                  footer1,
                )}/${MAX_LENGTH})`}
                onChangeText={(txt: string) => setFooter1(txt)}
                value={footer1}
                keyboardType="default"
                maxLength={MAX_LENGTH}
                mode="outlined"
              />
            </View>
            <View style={{ width: "30%" }}>
              <Switch value={isFooter1On} onValueChange={onToggleSwitchF1} />
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 5,
            }}>
            <View style={{ width: "70%" }}>
              <InputPaper
                label={`Footer 2 (${remainingChars(
                  MAX_LENGTH,
                  footer2,
                )}/${MAX_LENGTH})`}
                onChangeText={(txt: string) => setFooter2(txt)}
                value={footer2}
                keyboardType="default"
                maxLength={MAX_LENGTH}
                mode="outlined"
              />
            </View>
            <View style={{ width: "30%" }}>
              <Switch value={isFooter2On} onValueChange={onToggleSwitchF2} />
            </View>
          </View>
        </View>
      </DialogBox>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  fabStyle: {
    bottom: normalize(16),
    right: normalize(16),
    position: "absolute",
  },
  title: {
    textAlign: "center",
  },
  textStyle: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: normalize(10),
    padding: normalize(8),
    marginVertical: normalize(5),
  },
})
