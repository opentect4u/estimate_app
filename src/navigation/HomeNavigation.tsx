import { createNativeStackNavigator } from "@react-navigation/native-stack"
import navigationRoutes from "../routes/navigationRoutes"
import ProductsScreen from "../screens/ProductsScreen"
import HomeScreen from "../screens/HomeScreen"
import AllBillsScreen from "../screens/AllBillsScreen"
import CustomerDetailsFillScreen from "../screens/CustomerDetailsFillScreen"
import CancelBillScreen from "../screens/CancelBillScreen"
import CameraScreen from "../screens/CameraScreen"
import CategoriesScreen from "../screens/CategoriesScreen"
import CategoryProductsScreen from "../screens/CategoryProductsScreen"
import CategoryProductScreen from "../screens/CategoryProductScreen"
import CartScreen from "../screens/CartScreen"
import CalculateModeBillScreen from "../screens/CalculateModeBillScreen"

export default function HomeNavigation() {
  const Stack = createNativeStackNavigator()

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={navigationRoutes.homeScreen} component={HomeScreen} />
      <Stack.Screen
        name={navigationRoutes.productsScreen}
        component={ProductsScreen}
        options={{ animation: "fade_from_bottom" }}
      />
      <Stack.Screen
        name={navigationRoutes.categoriesScreen}
        component={CategoriesScreen}
        options={{ animation: "fade_from_bottom" }}
      />
      <Stack.Screen
        name={navigationRoutes.categoryProductsScreen}
        component={CategoryProductsScreen}
        options={{ animation: "simple_push" }}
      />
      <Stack.Screen
        name={navigationRoutes.categoryProductScreen}
        component={CategoryProductScreen}
        options={{ animation: "simple_push" }}
      />
      <Stack.Screen
        name={navigationRoutes.cartScreen}
        component={CartScreen}
        options={{ animation: "simple_push" }}
      />
      <Stack.Screen
        name={navigationRoutes.allBillsScreen}
        component={AllBillsScreen}
        options={{ animation: "slide_from_left" }}
      />
      <Stack.Screen
        name={navigationRoutes.customerDetailsFillScreen}
        component={CustomerDetailsFillScreen}
        options={{ animation: "flip" }}
      />
      <Stack.Screen
        name={navigationRoutes.cameraScreen}
        component={CameraScreen}
        options={{ animation: "flip" }}
      />
      {/* <Stack.Screen
        name={navigationRoutes.cancelBillScreen}
        component={CancelBillScreen}
        options={{ animation: "flip" }}
      /> */}
      <Stack.Screen
        name={navigationRoutes.calculateModeBillScreen}
        component={CalculateModeBillScreen}
      />

    </Stack.Navigator>
  )
}
