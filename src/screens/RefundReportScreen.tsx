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
import useSaleReport from "../hooks/api/useSaleReport"
import DatePicker from "react-native-date-picker"
import ButtonPaper from "../components/ButtonPaper"
import { useContext, useState } from "react"
import normalize from "react-native-normalize"
import { formattedDate } from "../utils/dateFormatter"
import { loginStorage } from "../storage/appStorage"
import { RefundReportCredentials, RefundReportData } from "../models/api_types"
import SurfacePaper from "../components/SurfacePaper"
import { useBluetoothPrint } from "../hooks/printables/useBluetoothPrint"
import { AppStore } from "../context/AppContext"
import useRefundReport from "../hooks/api/useRefundReport"
import { AppStoreContext } from "../models/custom_types"

function RefundReportScreen() {
  const theme = usePaperColorScheme()

  const loginStore = JSON.parse(loginStorage.getString("login-data"))

  const { receiptSettings } = useContext<AppStoreContext>(AppStore)

  const { fetchRefundReport } = useRefundReport()
  const { printRefundReport } = useBluetoothPrint()

  const [refundReport, setRefundReport] = useState<RefundReportData[]>(() => [])

  const [fromDate, setFromDate] = useState(() => new Date())
  const [toDate, setToDate] = useState(() => new Date())
  const [openFromDate, setOpenFromDate] = useState(() => false)
  const [openToDate, setOpenToDate] = useState(() => false)

  const [isLoading, setIsLoading] = useState(() => false)
  const [isDisabled, setIsDisabled] = useState(() => false)

  const formattedFromDate = formattedDate(fromDate)
  const formattedToDate = formattedDate(toDate)

  const handleGetRefundReport = async (
    fromDate: string,
    toDate: string,
    companyId: number,
    branchId: number,
    userId: string,
  ) => {
    if (fromDate > toDate) {
      ToastAndroid.show(
        "From date must be lower than To date.",
        ToastAndroid.SHORT,
      )
      return
    }

    setIsDisabled(true)
    setIsLoading(true)
    let refObj: RefundReportCredentials = {
      from_date: fromDate,
      to_date: toDate,
      comp_id: companyId,
      br_id: branchId,
      user_id: userId,
    }

    await fetchRefundReport(refObj)
      .then(res => {
        setRefundReport(res?.data)
        console.log("DDDDDDDDDDDDDDD", res?.data)
      })
      .catch(err => {
        ToastAndroid.show("Error fetching refund report.", ToastAndroid.SHORT)
      })
    setIsDisabled(false)
    setIsLoading(false)
  }

  const handlePrint = (
    refundReport: RefundReportData[],
    fromDate: string,
    toDate: string,
  ) => {
    if (refundReport.length !== 0) {
      printRefundReport(refundReport, fromDate, toDate)
    } else {
      ToastAndroid.show("No Refund Report Found!", ToastAndroid.SHORT)
      return
    }
  }

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
            Refund Report
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
              handleGetRefundReport(
                formattedFromDate,
                formattedToDate,
                loginStore.comp_id,
                loginStore.br_id,
                loginStore?.user_id,
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

        <SurfacePaper backgroundColor={theme.colors.surface}>
          <DataTable>
            <DataTable.Header>
              {/* <DataTable.Title>Name</DataTable.Title>
            <DataTable.Title>Phone</DataTable.Title> */}
              {/* <DataTable.Title>Tnx. Date</DataTable.Title> */}
              <DataTable.Title>Rcpt. No.</DataTable.Title>
              <DataTable.Title numeric>Qty.</DataTable.Title>
              <DataTable.Title numeric>Price</DataTable.Title>
              {receiptSettings?.gst_flag === "Y" && (
                <DataTable.Title numeric>GST</DataTable.Title>
              )}
              <DataTable.Title numeric>Dis.</DataTable.Title>
              <DataTable.Title numeric>Total Amt.</DataTable.Title>
            </DataTable.Header>

            {refundReport.map(item => {
              let totalGST: number = 0

              totalGST += item?.cgst_amt + item?.sgst_amt
              totalNetAmount += item?.net_amt
              totalQty += item?.no_of_items

              return (
                <DataTable.Row key={item?.refund_rcpt_no}>
                  {/* <DataTable.Cell>{item?.cust_name}</DataTable.Cell>
              <DataTable.Cell>{item?.phone_no}</DataTable.Cell> */}
                  {/* <DataTable.Cell>{new Date(item?.trn_date).toLocaleDateString("en-GB")}</DataTable.Cell> */}
                  <DataTable.Cell>
                    {item?.refund_rcpt_no
                      ?.toString()
                      ?.substring(item?.refund_rcpt_no?.toString()?.length - 4)}
                  </DataTable.Cell>
                  <DataTable.Cell numeric>{item?.no_of_items}</DataTable.Cell>
                  <DataTable.Cell numeric>{item?.price}</DataTable.Cell>
                  {receiptSettings?.gst_flag === "Y" && (
                    <DataTable.Cell numeric>{totalGST}</DataTable.Cell>
                  )}
                  <DataTable.Cell numeric>{item?.discount_amt}</DataTable.Cell>
                  <DataTable.Cell numeric>{item?.net_amt}</DataTable.Cell>
                </DataTable.Row>
              )
            })}
          </DataTable>
          <View style={{ padding: normalize(10) }}>
            <Text variant="labelMedium" style={{ color: theme.colors.purple }}>
              QUANTITY: {totalQty} TOTAL: ₹{totalNetAmount?.toFixed(2)}
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
            onPress={() =>
              handlePrint(refundReport, formattedFromDate, formattedToDate)
            }
            mode="contained-tonal">
            PRINT
          </ButtonPaper>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default RefundReportScreen

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },

  title: {
    textAlign: "center",
  },
})
