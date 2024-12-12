import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  View,
  Image,
  ToastAndroid,
} from "react-native"
import QRCode from "react-native-qrcode-svg"

import HeaderImage from "../components/HeaderImage"
import { blurReport, blurReportDark } from "../resources/images"
import { usePaperColorScheme } from "../theme/theme"
import { fileStorage } from "../storage/appStorage"
import { useEffect, useRef, useState } from "react"
import ButtonPaper from "../components/ButtonPaper"
import normalize, { SCREEN_WIDTH } from "react-native-normalize"
import { Text } from "react-native-paper"
import DialogBox from "../components/DialogBox"
import InputPaper from "../components/InputPaper"

function UPIGenerateScreen() {
  const theme = usePaperColorScheme()

  const vpaFileData = fileStorage.getString("vpa-data")
  const svgRef = useRef(null)
  const [vpaAddress, setVpaAddress] = useState<string>(() => vpaFileData ?? "")

  const [visible, setVisible] = useState(() => false)
  const [disabled, setDisabled] = useState(() => true)

  const showDialog = () => setVisible(true)
  const hideDialog = () => setVisible(false)

  const getDataURL = () => {
    svgRef.current.toDataURL(callback)
  }

  const callback = (dataURL: string) => {
    // console.log("Image Blob QR", dataURL)
    fileStorage.set("upi-blob", dataURL)
  }

  const onChangeVPAText = (vpa: string) => {
    // if (/^[a-zA-Z0-9.-]{2, 256}@[a-zA-Z][a-zA-Z]{2, 64}$/.test(vpa)) {
    setVpaAddress(vpa)
    // }
  }

  const handleSaveVPAAddress = () => {
    if (vpaAddress === undefined || vpaAddress === null || vpaAddress.length === 0) {
      ToastAndroid.show("Enter proper VPA Address", ToastAndroid.SHORT)
      return
    }
    console.log("handleSaveVPAAddress called.")

    // fileStorage.set("upi-data", `upi://pay?pa=${vpaAddress}`)
    fileStorage.set("vpa-data", `${vpaAddress}`)
    fileStorage.set("upi-data", `upi://pay?pa=${vpaAddress}`)
    getDataURL()
    ToastAndroid.show("Your UPI Address has been saved.", ToastAndroid.SHORT)
  }

  const removeLogo = () => {
    setVpaAddress(() => "")
    fileStorage.delete("vpa-data")
    fileStorage.delete("upi-data")
    fileStorage.delete("upi-blob")
    hideDialog()
  }

  useEffect(() => {
    if (vpaAddress.length > 0) {
      setDisabled(false)
    }
  }, [vpaAddress])

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={{ alignItems: "center" }}>
          <HeaderImage
            isBackEnabled
            imgLight={blurReport}
            imgDark={blurReportDark}
            borderRadius={30}
            blur={10}>
            Generate UPI
          </HeaderImage>
        </View>

        <DialogBox
          visible={visible}
          hide={hideDialog}
          onFailure={hideDialog}
          onSuccess={removeLogo}
          title="Remove UPI"
          btnSuccess="REMOVE">
          <Text variant="bodyMedium">
            Are you sure you want to remove UPI?
          </Text>
        </DialogBox>

        <View
          style={{
            backgroundColor: theme.colors.surfaceVariant,
            borderRadius: 40,
            width: SCREEN_WIDTH / 1.15,
            alignSelf: "center",
            marginTop: normalize(10),
          }}>
          <View
            style={{
              paddingHorizontal: normalize(29),
              paddingBottom: normalize(10),
              paddingTop: normalize(10),
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}>
            <View
              style={{
                width: "75%",
              }}>
              <InputPaper
                selectTextOnFocus
                label="Enter Your VPA Address"
                onChangeText={onChangeVPAText}
                value={vpaAddress}
                keyboardType="default"
                mode="flat"
                maxLength={100}
              />
            </View>
            <View
              style={{
                width: "20%",
              }}>
              <ButtonPaper
                mode="elevated"
                onPress={handleSaveVPAAddress}
                icon="content-save-outline"
                disabled={disabled}></ButtonPaper>
            </View>
          </View>

          <View style={{ padding: normalize(40) }}>
            <View
              style={{
                borderWidth: 6,
                borderStyle: "dashed",
                borderRadius: normalize(50),
                width: "100%",
                borderColor: theme.colors.secondary,
                padding: normalize(20),
                justifyContent: "center",
                alignItems: "center",
              }}>
              {vpaAddress.length > 0 && (
                <QRCode
                  size={150}
                  value={`upi://pay?pa=${vpaAddress}&pn=OmTraders`}
                  color={theme.colors.onBackground}
                  backgroundColor={theme.colors.surfaceVariant}
                  getRef={c => (svgRef.current = c)}
                />
              )}
            </View>
          </View>

          <View
            style={{
              paddingHorizontal: normalize(40),
              paddingBottom: normalize(10),
            }}>
            <ButtonPaper
              icon="trash-can-outline"
              mode="text"
              onPress={showDialog}
              textColor={theme.colors.error}
            // buttonColor={theme.colors.errorContainer}
            >
              Delete
            </ButtonPaper>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default UPIGenerateScreen

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },

  title: {
    textAlign: "center",
  },

  image: {
    width: "100%",
    minHeight: normalize(200),
    height: "auto",
    marginVertical: 10,
    borderWidth: 1,
  },
})
