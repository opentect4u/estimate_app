import { StyleSheet, View } from "react-native"
import React from "react"
import LottieView from "lottie-react-native"
import anim from "../animations/no_internet_2.json"
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "react-native-normalize"
import { usePaperColorScheme } from "../theme/theme"
import HeaderImage from "../components/HeaderImage"
import { textureBill, textureBillDark } from "../resources/images"

const NoInternetScreen = () => {
  const theme = usePaperColorScheme()
  return (
    <View
      style={{
        justifyContent: "space-between",
        alignItems: "center",
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        backgroundColor: theme.colors.background,
      }}>
      <View style={{ alignItems: "center" }}>
        <HeaderImage
          imgLight={textureBill}
          imgDark={textureBillDark}
          borderRadius={30}
          blur={10}
          showProductSearch={false}>
          Turn on Internet
        </HeaderImage>
      </View>
      <LottieView
        source={anim}
        autoPlay
        loop
        resizeMode="cover"
        style={{
          width: 300,
          height: 300,
          position: "absolute",
          top: SCREEN_HEIGHT / 2.5,
        }}
      />
    </View>
  )
}

export default NoInternetScreen

const styles = StyleSheet.create({})
