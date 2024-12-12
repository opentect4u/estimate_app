import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { usePaperColorScheme } from "../theme/theme"
import SettingsNavigation from "./SettingsNavigation"
import HomeNavigation from "./HomeNavigation"
import ReportsNavigation from "./ReportsNavigation"
import MoreNavigation from "./MoreNavigation"

const Tab = createMaterialBottomTabNavigator()

function BottomNavigationPaper() {
  const theme = usePaperColorScheme()
  return (
    <Tab.Navigator
      theme={theme}
      initialRouteName="Home"
      activeColor={theme.colors.primary}
      inactiveColor={theme.colors.onSurface}
      barStyle={{ backgroundColor: theme.colors.primaryContainer, margin: 10, borderWidth: 6, borderRadius: 20, borderColor: theme.colors.primaryContainer }}
      style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}>
      <Tab.Screen
        name="Home"
        component={HomeNavigation}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, focused }) =>
            !focused ? (
              <MaterialCommunityIcons
                name="home-outline"
                color={color}
                size={26}
              />
            ) : (
              <MaterialCommunityIcons name="home" color={color} size={26} />
            ),
        }}
      />
      <Tab.Screen
        name="Reports"
        component={ReportsNavigation}
        options={{
          tabBarLabel: "Reports",
          tabBarIcon: ({ color, focused }) =>
            !focused ? (
              <MaterialCommunityIcons name="cash" color={color} size={26} />
            ) : (
              <MaterialCommunityIcons
                name="cash-multiple"
                color={color}
                size={26}
              />
            ),
        }}
      />
      <Tab.Screen
        name="More"
        component={MoreNavigation}
        options={{
          tabBarLabel: "More",
          tabBarIcon: ({ color, focused }) =>
            !focused ? (
              <MaterialCommunityIcons name="menu" color={color} size={26} />
            ) : (
              <MaterialCommunityIcons
                name="menu-open"
                color={color}
                size={26}
              />
            ),
          // tabBarIcon: ({ color, focused }) => (
          //   !focused ? <MaterialCommunityIcons name="dots-vertical-circle-outline" color={color} size={26} /> : <MaterialCommunityIcons name="dots-vertical-circle" color={color} size={26} />
          // ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsNavigation}
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ color, focused }) =>
            !focused ? (
              <MaterialCommunityIcons
                name="cog-outline"
                color={color}
                size={26}
              />
            ) : (
              <MaterialCommunityIcons name="cog" color={color} size={26} />
            ),
        }}
      />
    </Tab.Navigator>
  )
}

export default BottomNavigationPaper
