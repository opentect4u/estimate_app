import { createNativeStackNavigator } from "@react-navigation/native-stack"
import navigationRoutes from "../routes/navigationRoutes"
import ReportsScreen from "../screens/ReportsScreen"
import SaleReportScreen from "../screens/SaleReportScreen"
import SaleSummaryScreen from "../screens/SaleSummaryScreen"
import CancelledBillsReportScreen from "../screens/CancelledBillsReport"
import CreditReportScreen from "../screens/CreditReportScreen"
import UserwiseReportScreen from "../screens/UserwiseReportScreen"
import CustomerLedgerScreen from "../screens/CustomerLedgerScreen"
import DueReportScreen from "../screens/DueReportScreen"
import ProductwiseSaleReportScreen from "../screens/reports/ProductwiseSaleReportScreen"
import CategoryProductsScreen from "../screens/CategoryProductsScreen"
// import ItemReportScreen from "../screens/ItemReportScreen"
// import GstStatementReportScreen from "../screens/GstStatementReportScreen"
// import GstSummaryReportScreen from "../screens/GstSummaryReportScreen"
// import StockReportScreen from "../screens/StockReportScreen"
// import RefundReportScreen from "../screens/RefundReportScreen"
// import DaybookReportScreen from "../screens/DaybookReportScreen"
// import RecoveryReportScreen from "../screens/RecoveryReportScreen"

export default function ReportsNavigation() {
  const Stack = createNativeStackNavigator()

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name={navigationRoutes.reportsScreen}
        component={ReportsScreen}
      />
      {/* <Stack.Screen
        name={navigationRoutes.saleReportScreen}
        component={SaleReportScreen}
      /> */}
      <Stack.Screen
        name={navigationRoutes.saleSummaryScreen}
        component={SaleSummaryScreen}
      />
      {/* <Stack.Screen
        name={navigationRoutes.itemReportScreen}
        component={ItemReportScreen}
      /> */}
      {/* <Stack.Screen
        name={navigationRoutes.gstStatementReportScreen}
        component={GstStatementReportScreen}
      />
      <Stack.Screen
        name={navigationRoutes.gstSummaryReportScreen}
        component={GstSummaryReportScreen}
      />
      <Stack.Screen
        name={navigationRoutes.stockReportScreen}
        component={StockReportScreen}
      /> */}
      <Stack.Screen
        name={navigationRoutes.cancelledBillsReportScreen}
        component={CancelledBillsReportScreen}
      />
      {/* <Stack.Screen
        name={navigationRoutes.refundReportScreen}
        component={RefundReportScreen}
      /> */}
      {/* <Stack.Screen
        name={navigationRoutes.creditReportScreen}
        component={CreditReportScreen}
      /> */}
      {/* <Stack.Screen
        name={navigationRoutes.daybookReportScreen}
        component={DaybookReportScreen}
      /> */}
      <Stack.Screen
        name={navigationRoutes.userwiseReportScreen}
        component={UserwiseReportScreen}
      />
      <Stack.Screen
        name={navigationRoutes.customerLedgerScreen}
        component={CustomerLedgerScreen}
      />
      <Stack.Screen
        name={navigationRoutes.dueReportScreen}
        component={DueReportScreen}
      />
      {/* <Stack.Screen
        name={navigationRoutes.recoveryReportScreen}
        component={RecoveryReportScreen}
      /> */}
      <Stack.Screen
        name={navigationRoutes.productwiseSaleReportScreen}
        component={ProductwiseSaleReportScreen}
      />
      <Stack.Screen
        name={navigationRoutes.categoryProductsScreen}
        component={CategoryProductsScreen}
        options={{ animation: "simple_push" }}
      />
    </Stack.Navigator>
  )
}
