import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  View,
  ToastAndroid,
} from "react-native"

import HeaderImage from "../components/HeaderImage"
import { blurReport, blurReportDark } from "../resources/images"
import { usePaperColorScheme } from "../theme/theme"
import { DataTable, Text } from "react-native-paper"
import ButtonPaper from "../components/ButtonPaper"
import { useContext, useState } from "react"
import normalize from "react-native-normalize"
import { loginStorage } from "../storage/appStorage"
import {
  StockReportCredentials,
  StockReportResponse,
} from "../models/api_types"
import SurfacePaper from "../components/SurfacePaper"
import { useBluetoothPrint } from "../hooks/printables/useBluetoothPrint"
import { useIsFocused } from "@react-navigation/native"
import useStockReport from "../hooks/api/useStockReport"
import { AppStore } from "../context/AppContext"
import { AppStoreContext } from "../models/custom_types"

function StockReportScreen() {
  const isFocused = useIsFocused()
  const theme = usePaperColorScheme()

  const loginStore = JSON.parse(loginStorage.getString("login-data"))

  const { receiptSettings } = useContext<AppStoreContext>(AppStore)
  const { fetchStockReport } = useStockReport()
  const { printStockReport } = useBluetoothPrint()

  const [stockReport, setStockReport] = useState<StockReportResponse[]>(
    () => [],
  )

  const [isLoading, setIsLoading] = useState(() => false)
  const [isDisabled, setIsDisabled] = useState(() => false)

  const handleGetStockReport = async () => {
    setIsDisabled(true)
    setIsLoading(true)
    let stockReportCredsObject: StockReportCredentials = {
      br_id: loginStore?.br_id,
      comp_id: loginStore?.comp_id,
    }
    await fetchStockReport(stockReportCredsObject)
      .then(res => {
        setStockReport(res)
        console.log("XXXXXXXXXXXXXXXXX", res)
      })
      .catch(err => {
        ToastAndroid.show("Error fetching stock report.", ToastAndroid.SHORT)
      })
    setIsDisabled(false)
    setIsLoading(false)
  }

  const handlePrint = (stockReport: StockReportResponse[]) => {
    if (stockReport.length !== 0) {
      printStockReport(stockReport)
    } else {
      ToastAndroid.show("No Report Found!", ToastAndroid.SHORT)
      return
    }
  }

  let totalGrossStock: number = 0
  let totalQty: number = 0

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={{ alignItems: "center" }}>
          <HeaderImage
            isBackEnabled
            imgLight={blurReport}
            imgDark={blurReportDark}
            borderRadius={30}
            blur={10}>
            Stock Report
          </HeaderImage>
        </View>

        {receiptSettings?.stock_flag === "Y" ? (
          <>
            <View
              style={{
                paddingHorizontal: normalize(20),
                paddingBottom: normalize(10),
              }}>
              <ButtonPaper
                onPress={handleGetStockReport}
                mode="contained-tonal"
                buttonColor={theme.colors.primary}
                textColor={theme.colors.onPrimary}
                loading={isLoading}
                disabled={isDisabled}>
                SUBMIT
              </ButtonPaper>
            </View>

            <SurfacePaper backgroundColor={theme.colors.surface}>
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>Product</DataTable.Title>
                  <DataTable.Title numeric>Stock</DataTable.Title>
                </DataTable.Header>

                {stockReport.map((item, i) => {
                  // totalNetAmount += item?.amount
                  totalQty += 1
                  totalGrossStock += item?.stock

                  return (
                    <DataTable.Row key={i}>
                      <DataTable.Cell>{item?.item_name}</DataTable.Cell>
                      <DataTable.Cell numeric>{item?.stock}</DataTable.Cell>
                    </DataTable.Row>
                  )
                })}
              </DataTable>
              <View style={{ padding: normalize(10) }}>
                <Text
                  variant="labelMedium"
                  style={{ color: theme.colors.primary }}>
                  QUANTITY: {totalQty} TOTAL STOCK: {totalGrossStock}
                </Text>
              </View>
            </SurfacePaper>

            <View
              style={{
                paddingHorizontal: normalize(20),
                paddingBottom: normalize(10),
              }}>
              <ButtonPaper
                icon={"cloud-print-outline"}
                onPress={() => handlePrint(stockReport)}
                mode="contained-tonal">
                PRINT
              </ButtonPaper>
            </View>
          </>
        ) : (
          <SurfacePaper
            backgroundColor={theme.colors.pinkContainer}
            elevation={2}
            paddingEnabled
            smallWidthEnabled
            style={{ padding: 15 }}>
            <Text
              variant="titleLarge"
              style={{
                alignSelf: "center",
                textAlign: "center",
                color: theme.colors.onPinkContainer,
              }}>
              Inventory is off. Allow Inventory from Settings to use this
              feature.
            </Text>
          </SurfacePaper>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default StockReportScreen

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },

  title: {
    textAlign: "center",
  },
})
