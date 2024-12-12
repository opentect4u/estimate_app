import { View, Text, ScrollView, StyleSheet } from "react-native"
import React from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import HeaderImage from "../components/HeaderImage"
import ReportButtonsWrapper from "../components/ReportButtonsWrapper"
import ReportButton from "../components/ReportButton"
import { usePaperColorScheme } from "../theme/theme"
import { blurReport, blurReportDark } from "../resources/images"
import { CommonActions, useNavigation } from "@react-navigation/native"
import navigationRoutes from "../routes/navigationRoutes"

export default function MasterChooseScreen() {
  const theme = usePaperColorScheme()
  const navigation = useNavigation()
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={{ alignItems: "center" }}>
          <HeaderImage
            imgLight={blurReport}
            imgDark={blurReportDark}
            borderRadius={30}
            blur={10}>
            Master
          </HeaderImage>
        </View>
        <ReportButtonsWrapper>
          <ReportButton
            text="Item Master"
            color={theme.colors.greenContainer}
            icon="billboard"
            onPress={() =>
              navigation.dispatch(
                CommonActions.navigate({
                  name: navigationRoutes.itemMasterScreen,
                }),
              )
            }
          />
          <ReportButton
            text="Storage Master"
            color={theme.colors.orangeContainer}
            icon="billboard"
            onPress={() => console.log("MASTER CHOOSE Pressed!")}
          />
        </ReportButtonsWrapper>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },

  title: {
    textAlign: "center",
  },
})
