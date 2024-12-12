import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import navigationRoutes from "../routes/navigationRoutes"
import ProfileScreen from "../screens/ProfileScreen"
import CalculateModeScreen from "../screens/CalculateModeScreen"
import CalculateModeBillScreen from "../screens/CalculateModeBillScreen"
import SaleReportCalculatorModeScreen from "../screens/SaleReportCalculatorModeScreen"
import PrintMain from "../screens/printer_connect_screens/PrintMain"

export default function CalculateNavigation() {
    const Stack = createNativeStackNavigator()

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name={navigationRoutes.calculateModeScreen}
                component={CalculateModeScreen}
            />
            {/* <Stack.Screen
                name={navigationRoutes.calculateModeBillScreen}
                component={CalculateModeBillScreen}
            /> */}
            <Stack.Screen
                name={navigationRoutes.saleReportCalculateModeScreen}
                component={SaleReportCalculatorModeScreen}
            />
            <Stack.Screen
                name={navigationRoutes.profileScreen}
                component={ProfileScreen}
            />
            <Stack.Screen name={navigationRoutes.printMain} component={PrintMain} />

        </Stack.Navigator>
    )
}
