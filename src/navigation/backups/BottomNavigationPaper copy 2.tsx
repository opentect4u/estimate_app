import { useState } from "react"
import { BottomNavigation } from "react-native-paper"
import ReportsScreen from "../screens/ReportsScreen"
import HomeNavigation from "./HomeNavigation"
import { CommonActions, useNavigation } from "@react-navigation/native"
import navigationRoutes from "../routes/navigationRoutes"
import SettingsNavigation from "./SettingsNavigation"
// import { usePaperColorScheme } from '../theme/theme';

function BottomNavigationPaper() {
  // const theme = usePaperColorScheme()
  const navigation = useNavigation()

  const [index, setIndex] = useState(() => 0)
  const [routes] = useState([
    {
      key: "home",
      title: "Home",
      focusedIcon: "home",
      unfocusedIcon: "home-outline",
    },
    {
      key: "reports",
      title: "Reports",
      focusedIcon: "cash-multiple",
      unfocusedIcon: "cash",
    },
    {
      key: "settings",
      title: "Settings",
      focusedIcon: "cog",
      unfocusedIcon: "cog-outline",
    },
  ])

  const renderScene = BottomNavigation.SceneMap({
    home: HomeNavigation,
    reports: ReportsScreen,
    settings: SettingsNavigation,
  })

  return (
    <BottomNavigation
      navigationState={{ index, routes }} // this is not deprecated. It's vital.
      onIndexChange={setIndex}
      renderScene={renderScene}
      sceneAnimationEnabled
      sceneAnimationType="shifting"
      compact
      // onTabPress={() =>
      //   navigation.dispatch(
      //     CommonActions.reset({
      //       index: 0,
      //       routes: [
      //         {
      //           name: navigationRoutes.homeScreen,
      //         },
      //       ],
      //     }),
      //   )
      // }
      // theme={theme}
    />
  )
}

export default BottomNavigationPaper
