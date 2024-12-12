import { StyleSheet, ScrollView, SafeAreaView, View } from "react-native"

import { MORE_SCREEN_DATA } from "../data/ui/MORE_SCREEN"
import HeaderImage from "../components/HeaderImage"
import { textureBill, textureBillDark } from "../resources/images"
import { usePaperColorScheme } from "../theme/theme"
import ReportButton from "../components/ReportButton"
import ReportButtonsWrapper from "../components/ReportButtonsWrapper"
import { CommonActions, useNavigation } from "@react-navigation/native"

function MoreScreen() {
  const navigation = useNavigation()
  const theme = usePaperColorScheme()

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={{ alignItems: "center" }}>
          <HeaderImage
            imgLight={textureBill}
            imgDark={textureBillDark}
            borderRadius={30}
            blur={10}>
            Essentials
          </HeaderImage>
        </View>
        <ReportButtonsWrapper>
          {
            MORE_SCREEN_DATA.map((item, index) => (
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
                )
                }
              />
            ))
          }
        </ReportButtonsWrapper>
      </ScrollView>
    </SafeAreaView>
  )
}

export default MoreScreen

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },

  title: {
    textAlign: "center",
  },
})
