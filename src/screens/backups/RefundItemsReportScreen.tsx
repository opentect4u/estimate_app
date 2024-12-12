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
import DatePicker from "react-native-date-picker"
import ButtonPaper from "../components/ButtonPaper"
import { useState } from "react"
import normalize from "react-native-normalize"
import { formattedDate } from "../utils/dateFormatter"
import { loginStorage } from "../storage/appStorage"
import {
  CancelledBillsReportCredentials,
  CancelledBillsReportResponse,
  CollectionReport,
} from "../models/api_types"
import SurfacePaper from "../components/SurfacePaper"
import { useBluetoothPrint } from "../hooks/printables/useBluetoothPrint"
import useCollectionReport from "../hooks/api/useCollectionReport"
import useCancelledBillsReport from "../hooks/api/useCancelledBillsReport"

function RefundItemsReportScreen() {
  const theme = usePaperColorScheme()

  const loginStore = JSON.parse(loginStorage.getString("login-data"))

  const { fetchCancelledBills } = useCancelledBillsReport()
  const { printCancelledBillsReport } = useBluetoothPrint()

  const [cancelledBillsReport, setCancelledBillsReport] = useState<
    CancelledBillsReportResponse[]
  >(() => [])

  const [fromDate, setFromDate] = useState(() => new Date())
  const [toDate, setToDate] = useState(() => new Date())
  const [openFromDate, setOpenFromDate] = useState(() => false)
  const [openToDate, setOpenToDate] = useState(() => false)

  const formattedFromDate = formattedDate(fromDate)
  const formattedToDate = formattedDate(toDate)

  const handleGetCollectionReport = async (
    fromDate: string,
    toDate: string,
  ) => {
    if (fromDate > toDate) {
      ToastAndroid.show(
        "From date must be lower than To date.",
        ToastAndroid.SHORT,
      )
      return
    }

    let cancelledBillsCredObject: CancelledBillsReportCredentials = {
      from_date: fromDate,
      to_date: toDate,
    }

    await fetchCancelledBills(cancelledBillsCredObject)
      .then(res => {
        setCancelledBillsReport(res)
        console.log("XXXXXXXXXXXXXXXXX", res)
      })
      .catch(err => {
        ToastAndroid.show("Error during fetching report.", ToastAndroid.SHORT)
      })
  }

  const handlePrint = (
    cancelledBills: CancelledBillsReportResponse[],
    fromDate: string,
    toDate: string,
  ) => {
    if (cancelledBills.length !== 0) {
      printCancelledBillsReport(cancelledBills, fromDate, toDate)
    } else {
      ToastAndroid.show("No Collection Report Found!", ToastAndroid.SHORT)
      return
    }
  }

  let totalSummary: number = 0
  let totalCancelled: number = 0

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
            Refund Items Report
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
            textColor={theme.colors.green}
            onPress={() => setOpenFromDate(true)}
            mode="text">
            FROM: {fromDate?.toLocaleDateString("en-GB")}
          </ButtonPaper>
          <ButtonPaper
            textColor={theme.colors.green}
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
              handleGetCollectionReport(formattedFromDate, formattedToDate)
            }
            mode="contained-tonal"
            buttonColor={theme.colors.green}
            textColor={theme.colors.onGreen}>
            SUBMIT
          </ButtonPaper>
        </View>

        <SurfacePaper backgroundColor={theme.colors.surface}>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Receipt No.</DataTable.Title>
              <DataTable.Title>Pay Mode</DataTable.Title>
              <DataTable.Title numeric>Net Amount</DataTable.Title>
            </DataTable.Header>

            {cancelledBillsReport?.map((item, i) => {
              totalSummary += item?.net_amt
              totalCancelled += 1

              return (
                <DataTable.Row key={i}>
                  <DataTable.Cell>{item?.receipt_no}</DataTable.Cell>
                  <DataTable.Cell>
                    {item?.pay_mode === "C"
                      ? "Cash"
                      : item?.pay_mode === "U"
                      ? "UPI"
                      : item?.pay_mode === "D"
                      ? "Card"
                      : ""}
                  </DataTable.Cell>
                  <DataTable.Cell numeric>{item?.net_amt}</DataTable.Cell>
                </DataTable.Row>
              )
            })}
          </DataTable>
          <View style={{ padding: normalize(10) }}>
            <Text
              variant="labelMedium"
              style={{ color: theme.colors.secondary }}>
              TOTAL CANCEL: {totalCancelled} TOTAL NET: ₹{totalSummary}
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
              handlePrint(
                cancelledBillsReport,
                formattedFromDate,
                formattedToDate,
              )
            }
            mode="contained-tonal">
            PRINT
          </ButtonPaper>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default RefundItemsReportScreen

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },

  title: {
    textAlign: "center",
  },
})
