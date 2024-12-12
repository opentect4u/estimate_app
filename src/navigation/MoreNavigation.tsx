import { createNativeStackNavigator } from "@react-navigation/native-stack"
import navigationRoutes from "../routes/navigationRoutes"
import MoreScreen from "../screens/MoreScreen"
import RefundItemsScreen from "../screens/RefundItemsScreen"
import RefundItemsDataScreen from "../screens/RefundItemsDataScreen"
import ReceiptsAgainstMobileScreen from "../screens/ReceiptsAgainstMobileScreen"
import SearchBillsByDateScreen from "../screens/SearchBillsByDateScreen"
import CancelBillsScreen from "../screens/CancelBillsScreen"
import SearchBillsByItemScreen from "../screens/SearchBillsByItemScreen"
import RefundReprintScreen from "../screens/RefundReprintScreen"
import RecoveryAmountScreen from "../screens/RecoveryAmountScreen"
import CategoryProductsScreen from "../screens/CategoryProductsScreen"

export default function MoreNavigation() {
  const Stack = createNativeStackNavigator()

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={navigationRoutes.moreScreen} component={MoreScreen} />
      {/* <Stack.Screen
                name={navigationRoutes.cancelBillScreen}
                component={CancelBillScreen}
            /> */}
      {/* <Stack.Screen
        name={navigationRoutes.refundItemsScreen}
        component={RefundItemsScreen}
      /> */}
      <Stack.Screen
        name={navigationRoutes.receiptsAgainstMobileScreen}
        component={ReceiptsAgainstMobileScreen}
      />
      {/* <Stack.Screen
        name={navigationRoutes.refundItemsDataScreen}
        component={RefundItemsDataScreen}
      /> */}
      <Stack.Screen
        name={navigationRoutes.searchBillsByDateScreen}
        component={SearchBillsByDateScreen}
      />
      <Stack.Screen
        name={navigationRoutes.cancelBillsScreen}
        component={CancelBillsScreen}
      />
      <Stack.Screen
        name={navigationRoutes.searchBillsByItemScreen}
        component={SearchBillsByItemScreen}
      />
      {/* <Stack.Screen
        name={navigationRoutes.refundReprintScreen}
        component={RefundReprintScreen}
      /> */}
      <Stack.Screen
        name={navigationRoutes.recoveryAmountScreen}
        component={RecoveryAmountScreen}
      />
      <Stack.Screen
        name={navigationRoutes.categoryProductsScreen}
        component={CategoryProductsScreen}
        options={{ animation: "simple_push" }}
      />
    </Stack.Navigator>
  )
}
