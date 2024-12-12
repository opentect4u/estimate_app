import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  View,
  ToastAndroid,
  TextStyle,
  ViewStyle,
} from "react-native"

import HeaderImage from "../../components/HeaderImage"
import { blurReport, blurReportDark } from "../../resources/images"
import { usePaperColorScheme } from "../../theme/theme"
import { DataTable, List, Text } from "react-native-paper"
import useSaleReport from "../../hooks/api/useSaleReport"
import DatePicker from "react-native-date-picker"
import ButtonPaper from "../../components/ButtonPaper"
import { useContext, useState } from "react"
import normalize, { SCREEN_HEIGHT } from "react-native-normalize"
import { formattedDate } from "../../utils/dateFormatter"
import { loginStorage } from "../../storage/appStorage"
import { BasicReportCredentials, ProductwiseSaleReportData, SaleReport } from "../../models/api_types"
import SurfacePaper from "../../components/SurfacePaper"
import { useBluetoothPrint } from "../../hooks/printables/useBluetoothPrint"
import { AppStore } from "../../context/AppContext"
import { AppStoreContext } from "../../models/custom_types"
import useProductwiseSaleReport from "../../hooks/api/useProductwiseSaleReport"

function ProductwiseSaleReportScreen() {
  const theme = usePaperColorScheme()

  const loginStore = JSON.parse(loginStorage.getString("login-data"))

  const { receiptSettings } = useContext<AppStoreContext>(AppStore)

  const { fetchProductwiseSaleReport } = useProductwiseSaleReport()
  const { printProductwiseSaleReport } = useBluetoothPrint()

  const [productwiseSaleReport, setProductwiseSaleReport] = useState<ProductwiseSaleReportData[]>(() => [])

  const [fromDate, setFromDate] = useState(() => new Date())
  const [toDate, setToDate] = useState(() => new Date())
  const [openFromDate, setOpenFromDate] = useState(() => false)
  const [openToDate, setOpenToDate] = useState(() => false)

  const [isLoading, setIsLoading] = useState(() => false)
  const [isDisabled, setIsDisabled] = useState(() => false)

  const formattedFromDate = formattedDate(fromDate)
  const formattedToDate = formattedDate(toDate)

  const handleGetSaleReport = async (
    fromDate: string,
    toDate: string,
    companyId: number,
    branchId: number,
    // userId: string,
  ) => {
    if (fromDate > toDate) {
      ToastAndroid.show(
        "From date must be lower than To date.",
        ToastAndroid.SHORT,
      )
      return
    }
    const saleCreds: BasicReportCredentials = {
      from_date: fromDate,
      to_date: toDate,
      comp_id: companyId,
      br_id: branchId,
    }
    setIsDisabled(true)
    setIsLoading(true)
    // await fetchSaleReport(saleCreds)
    //   .then(res => {
    //     setSaleReport(res?.data)
    //     console.log("DDDDDDDDDDDDDDD", res?.data)
    //   })
    //   .catch(err => {
    //     ToastAndroid.show("Error fetching sale report.", ToastAndroid.SHORT)
    //   })
    await fetchProductwiseSaleReport(saleCreds)
      .then(res => {
        setProductwiseSaleReport(res?.data)
        console.log("DDDDDDDDDDDDDDD", res?.data)
      })
      .catch(err => {
        ToastAndroid.show("Error fetching sale report.", ToastAndroid.SHORT)
      })
    setIsDisabled(false)
    setIsLoading(false)
  }

  const handlePrint = (
    saleReport: ProductwiseSaleReportData[],
    fromDate: string,
    toDate: string,
  ) => {
    if (saleReport.length !== 0) {
      printProductwiseSaleReport(saleReport, fromDate, toDate)
    } else {
      ToastAndroid.show("No Report Found!", ToastAndroid.SHORT)
      return
    }
  }

  // const titleTextStyle: TextStyle = {
  //   color: theme.colors.onPurpleContainer
  // }

  // const titleStyle: ViewStyle = {
  //   backgroundColor: theme.colors.purpleContainer
  // }

  let totalNetAmount: number = 0
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
            Productwise Sale Report
          </HeaderImage>
        </View>
        <View
          style={{
            padding: normalize(10),
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
          }}>
          <ButtonPaper
            textColor={theme.colors.purple}
            onPress={() => setOpenFromDate(true)}
            mode="text">
            FROM: {fromDate?.toLocaleDateString("en-GB")}
          </ButtonPaper>
          <ButtonPaper
            textColor={theme.colors.purple}
            onPress={() => setOpenToDate(true)}
            mode="text">
            TO: {toDate?.toLocaleDateString("en-GB")}
          </ButtonPaper>

          <DatePicker
            modal
            mode="date"
            // minimumDate={toDate.setMonth(toDate.getMonth() - 1)}
            open={openFromDate}
            date={fromDate}
            onConfirm={date => {
              setOpenFromDate(false)
              setFromDate(date)
            }}
            onCancel={() => {
              setOpenFromDate(false)
            }}
          />
          <DatePicker
            modal
            mode="date"
            open={openToDate}
            date={toDate}
            onConfirm={date => {
              setOpenToDate(false)
              setToDate(date)
            }}
            onCancel={() => {
              setOpenToDate(false)
            }}
          />
        </View>

        <View
          style={{
            paddingHorizontal: normalize(20),
            paddingBottom: normalize(10),
          }}>
          <ButtonPaper
            onPress={() =>
              handleGetSaleReport(
                formattedFromDate,
                formattedToDate,
                loginStore.comp_id,
                loginStore.br_id,
                // loginStore?.user_id,
              )
            }
            mode="contained-tonal"
            buttonColor={theme.colors.purple}
            textColor={theme.colors.onPurple}
            loading={isLoading}
            disabled={isDisabled}>
            SUBMIT
          </ButtonPaper>
        </View>

        <View style={{
          paddingHorizontal: normalize(25),
          paddingBottom: normalize(10),
          maxHeight: SCREEN_HEIGHT / 1.85,
        }}>
          <ScrollView nestedScrollEnabled>
            {
              productwiseSaleReport?.map((item, i) => (
                <List.Item
                  key={i}
                  title={({ ellipsizeMode }) => <Text>{item?.tot_item_qty}{item?.unit_name?.charAt(0)} x {item?.item_name}</Text>}
                  description={<View>
                    <Text style={{
                      color: theme.colors.green
                    }}>Price: ₹{item?.unit_price}</Text>
                    <Text style={{
                      color: theme.colors.purple
                    }}>Category: {item?.category_name}</Text>
                  </View>}
                  right={props => {
                    return <Text>₹{item?.tot_item_price}</Text>
                  }}
                // descriptionStyle={{
                //     color: theme.colors.green
                // }}
                />
              ))
            }
          </ScrollView>
          {/* <View style={{ padding: normalize(10) }}>
            <Text variant="labelMedium" style={{ color: theme.colors.purple }}>
              QUANTITY: {totalQty} TOTAL: ₹{totalNetAmount?.toFixed(2)}
            </Text>
          </View> */}
        </View>
        <View
          style={{
            paddingHorizontal: normalize(20),
            paddingBottom: normalize(10),
          }}>
          <ButtonPaper
            icon={"cloud-print-outline"}
            onPress={() =>
              handlePrint(productwiseSaleReport, formattedFromDate, formattedToDate)
            }
            mode="contained-tonal"
            buttonColor={theme.colors.purpleContainer}
            textColor={theme.colors.onPurpleContainer}>
            PRINT
          </ButtonPaper>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ProductwiseSaleReportScreen

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },

  title: {
    textAlign: "center",
  },
})
