import { StyleSheet, ScrollView, SafeAreaView, View, Linking } from "react-native"
import React from 'react'
import { CALCULATE_SCREEN_DATA } from "../data/ui/CALCULATE_SCREEN"
import HeaderImage from "../components/HeaderImage"
import { textureBill, textureBillDark, moneyCalc, blurredBlue, blurredBlueDark } from "../resources/images"
import normalize from "react-native-normalize"
import ReportButtonsWrapper from "../components/ReportButtonsWrapper"
import ReportButton from "../components/ReportButton"
import { usePaperColorScheme } from "../theme/theme"
import { CommonActions, useNavigation } from "@react-navigation/native"

function CalculateModeScreen() {
  const navigation = useNavigation()
  const theme = usePaperColorScheme()

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView>
        <View style={{ alignItems: "center" }}>
          <HeaderImage
            imgLight={blurredBlue}
            imgDark={blurredBlueDark}
            borderRadius={30}
            blur={10}>
            Calculate
          </HeaderImage>
        </View>
        <ReportButtonsWrapper>
          {
            CALCULATE_SCREEN_DATA.map((item, index) => (
              <ReportButton
                key={index}
                text={item.text}
                color={index % 2 === 0 ? theme.colors.primaryContainer : theme.colors.secondaryContainer}
                textColor={index % 2 === 0 ? theme.colors.onPrimaryContainer : theme.colors.onSecondaryContainer}
                icon={item.icon}
                onPress={() => navigation.dispatch(
                  CommonActions.navigate({
                    name: item.route
                  })
                )}
              />
            ))
          }
        </ReportButtonsWrapper>
      </ScrollView>
    </SafeAreaView>
  )
}

export default CalculateModeScreen

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  title: {
    textAlign: "center",
  },
  fabStyle: {
    bottom: normalize(16),
    right: normalize(16),
    position: "absolute",
  },
})
