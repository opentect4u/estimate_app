import { createNativeStackNavigator } from "@react-navigation/native-stack"
import navigationRoutes from "../routes/navigationRoutes"
import SettingsScreen from "../screens/SettingsScreen"
import PrintMain from "../screens/printer_connect_screens/PrintMain"
import HeaderFooterScreen from "../screens/HeaderFooterScreen"
import ManageProductsScreen from "../screens/ManageProductsScreen"
// import ReceiptSettingsEditScreen from "../screens/ReceiptSettingsEditScreen"
import LogoUploadScreen from "../screens/LogoUploadScreen"
import ProfileScreen from "../screens/ProfileScreen"
// import ChangePinScreen from "../screens/ChangePinScreen"
import ManageUnitsScreen from "../screens/ManageUnitsScreen"
import InventoryScreen from "../screens/InventoryScreen"
import SettingsMasterScreen from "../screens/SettingsMasterScreen"
import GeneralSettingsScreen from "../screens/GeneralSettingsScreen"
import DiscountSettingsScreen from "../screens/DiscountSettingsScreen"
import GstSettingsScreen from "../screens/GstSettingsScreen"
import UPIGenerateScreen from "../screens/UPIGenerateScreen"
import ManageCategoriesScreen from "../screens/ManageCategoriesScreen"
import CategoryProductsScreen from "../screens/CategoryProductsScreen"

export default function SettingsNavigation() {
  const Stack = createNativeStackNavigator()

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name={navigationRoutes.settingsScreen}
        component={SettingsScreen}
      />
      {/* <Stack.Screen
        name={navigationRoutes.masterChooseScreen}
        component={MasterChooseScreen}
      /> */}
      {/* <Stack.Screen
        name={navigationRoutes.itemMasterScreen}
        component={ItemMasterScreen}
      /> */}
      {/* <Stack.Screen
        name={navigationRoutes.headerFooterScreen}
        component={HeaderFooterScreen}
      /> */}
      {/* <Stack.Screen
        name={navigationRoutes.manageProductsScreen}
        component={ManageProductsScreen}
      /> */}
      {/* <Stack.Screen
        name={navigationRoutes.manageCategoriesScreen}
        component={ManageCategoriesScreen}
      /> */}
      {/* <Stack.Screen
        name={navigationRoutes.manageUnitsScreen}
        component={ManageUnitsScreen}
      /> */}
      {/* <Stack.Screen
        name={navigationRoutes.inventoryScreen}
        component={InventoryScreen}
      /> */}
      {/* <Stack.Screen
        name={navigationRoutes.receiptSettingsEditScreen}
        component={ReceiptSettingsEditScreen}
      /> */}
      <Stack.Screen
        name={navigationRoutes.settingsMasterScreen}
        component={SettingsMasterScreen}
      />
      {/* <Stack.Screen
        name={navigationRoutes.logoUploadScreen}
        component={LogoUploadScreen}
      /> */}
      {/* <Stack.Screen name={navigationRoutes.printMain} component={PrintMain} /> */}
      <Stack.Screen
        name={navigationRoutes.profileScreen}
        component={ProfileScreen}
      />
      <Stack.Screen
        name={navigationRoutes.generalSettingsScreen}
        component={GeneralSettingsScreen}
      />
      {/* <Stack.Screen
        name={navigationRoutes.discountSettingsScreen}
        component={DiscountSettingsScreen}
      />
      <Stack.Screen
        name={navigationRoutes.gstSettingsScreen}
        component={GstSettingsScreen}
      /> */}
      {/* <Stack.Screen
        name={navigationRoutes.upiGenerateScreen}
        component={UPIGenerateScreen}
      /> */}
      {/* <Stack.Screen
        name={navigationRoutes.changePinScreen}
        component={ChangePinScreen}
      /> */}

      <Stack.Screen
        name={navigationRoutes.categoryProductsScreen}
        component={CategoryProductsScreen}
        options={{ animation: "simple_push" }}
      />
    </Stack.Navigator>
  )
}
