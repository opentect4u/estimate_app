import { StyleSheet, ScrollView, SafeAreaView, View, Image } from "react-native"
// import {
//   ImageLibraryOptions,
//   ImagePickerResponse,
//   launchImageLibrary,
// } from "react-native-image-picker"

import HeaderImage from "../components/HeaderImage"
import { blurReport, blurReportDark } from "../resources/images"
import { usePaperColorScheme } from "../theme/theme"
import { fileStorage } from "../storage/appStorage"
import { useState } from "react"
import ButtonPaper from "../components/ButtonPaper"
import normalize from "react-native-normalize"
import { Button, Dialog, Portal, Text } from "react-native-paper"
import DialogBox from "../components/DialogBox"

function LogoUploadScreen() {
  const theme = usePaperColorScheme()

  const [imgSrcUri, setImgSrcUri] = useState<string>()

  const [visible, setVisible] = useState(() => false)

  const showDialog = () => setVisible(true)
  const hideDialog = () => setVisible(false)

  // const selectLogo = () => {
  //   const options: ImageLibraryOptions = {
  //     mediaType: "photo",
  //     includeBase64: true,
  //   }

  //   launchImageLibrary(options, (response: ImagePickerResponse) => {
  //     if (response.didCancel) {
  //       console.log("User cancelled image picker")
  //       fileStorage.clearAll()
  //     } else if (response.errorCode) {
  //       console.log("ImagePicker Error: ", response.errorMessage)
  //       fileStorage.clearAll()
  //     } else {
  //       const fileStore = fileStorage.getString("file-data")
  //       const fileStoreUri = fileStorage.getString("file-uri")

  //       if (fileStore?.length || fileStoreUri?.length > 0) {
  //         fileStorage.clearAll()
  //       }

  //       const source = response?.assets[0]?.base64
  //       const srcUri = response?.assets[0]?.uri
  //       // const fileSize = response?.assets[0]?.fileSize

  //       setImgSrcUri(srcUri)

  //       fileStorage.set("file-data", source?.toString())
  //       fileStorage.set("file-uri", srcUri?.toString())

  //       // console.log("ashdguasydguasdguyasdasd", fileStore)
  //       // console.log("ashdguasydguasdgufddstgdtgrgdfgdfgdffyasdasd", imgSrcUri)
  //       console.log(
  //         "ashdguasydguasdgufddstgdtgrgdfgdfgdffyasdasd",
  //         source?.toString(),
  //       )
  //     }
  //   })
  // }

  const removeLogo = () => {
    setImgSrcUri("")
    fileStorage.delete("file-data")
    fileStorage.delete("file-uri")
    hideDialog()
  }

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
            Logo Upload
          </HeaderImage>
        </View>

        <DialogBox
          visible={visible}
          hide={hideDialog}
          onFailure={hideDialog}
          onSuccess={removeLogo}
          title="Remove Logo"
          btnSuccess="REMOVE">
          <Text variant="bodyMedium">
            Are you sure you want to remove logo?
          </Text>
        </DialogBox>

        <View
          style={{
            paddingHorizontal: normalize(25),
            paddingBottom: normalize(10),
          }}>
          {/* <ButtonPaper mode="contained" onPress={selectLogo}>
            UPLOAD
          </ButtonPaper> */}
        </View>

        <View
          style={{
            paddingHorizontal: normalize(30),
            paddingVertical: normalize(20),
          }}>
          <View
            style={{
              borderWidth: 6,
              borderStyle: "dashed",
              borderRadius: normalize(50),
              width: "100%",
              padding: normalize(20),
              borderColor: theme.colors.secondary,
            }}>
            <Image
              style={styles.image}
              // source={{ uri: imgSrcUri }}
              source={{
                uri:
                  fileStorage?.getString("file-uri") === undefined
                    ? imgSrcUri
                    : fileStorage?.getString("file-uri"),
              }}
              resizeMode="contain"
            />
          </View>
        </View>

        <View style={{ paddingHorizontal: normalize(20) }}>
          <ButtonPaper
            icon="trash-can-outline"
            mode="text"
            onPress={showDialog}
            textColor={theme.colors.error}>
            Delete
          </ButtonPaper>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default LogoUploadScreen

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
