import {
  View,
  ScrollView,
  StyleSheet,
} from "react-native"
import React from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import HeaderImage from "../components/HeaderImage"
import { flowerHome, flowerHomeDark } from "../resources/images"
import { usePaperColorScheme } from "../theme/theme"
import {
  CommonActions,
  useNavigation,
} from "@react-navigation/native"
import ReportButtonsWrapper from "../components/ReportButtonsWrapper"
import ReportButton from "../components/ReportButton"
import { SETTINGS_MASTER_DATA } from "../data/ui/SETTINGS_MASTER_SCREEN"

export default function SettingsMasterScreen() {
  const theme = usePaperColorScheme()
  const navigation = useNavigation()

  return (
    <SafeAreaView
      style={[{ backgroundColor: theme.colors.background, height: "100%" }]}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={{ alignItems: "center" }}>
          <HeaderImage
            isBackEnabled
            // isBackCustom={true}
            // backPressed={backPressed}
            imgLight={flowerHome}
            imgDark={flowerHomeDark}
            borderRadius={30}
            blur={10}>
            Settings Master
          </HeaderImage>
        </View>

        <ReportButtonsWrapper>
          {
            SETTINGS_MASTER_DATA.map((item, index) => (
              <ReportButton
                key={index}
                text={item.text}
                color={index % 2 === 0 ? theme.colors.greenContainer : theme.colors.greenContainerTertiary}
                textColor={index % 2 === 0 ? theme.colors.onGreenContainer : theme.colors.onGreenContainerTertiary}
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
