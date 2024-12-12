import React from "react"
import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  View,
  ToastAndroid,
  TextStyle,
  ViewStyle,
} from "react-native"

import HeaderImage from "../components/HeaderImage"
import { greenRep, greenRepDark } from "../resources/images"
import { usePaperColorScheme } from "../theme/theme"
import { DataTable, Text } from "react-native-paper"
import DatePicker from "react-native-date-picker"
import ButtonPaper from "../components/ButtonPaper"
import { useContext, useState } from "react"
import normalize from "react-native-normalize"
import { formattedDate } from "../utils/dateFormatter"
import { loginStorage } from "../storage/appStorage"
import {
  BasicReportCredentials,
  CancelledBillsReportData
} from "../models/api_types"
import SurfacePaper from "../components/SurfacePaper"
import { useBluetoothPrint } from "../hooks/printables/useBluetoothPrint"
import useCancelledBillsReport from "../hooks/api/useCancelledBillsReport"
import { AppStoreContext } from "../models/custom_types"
import { AppStore } from "../context/AppContext"

function CancelledBillsReportScreen() {
  const theme = usePaperColorScheme()

  const { receiptSettings } = useContext<AppStoreContext>(AppStore)
  const loginStore = JSON.parse(loginStorage.getString("login-data") as string)

  const { fetchCancelledBills } = useCancelledBillsReport()
  const { printCancelledBillsReport } = useBluetoothPrint()

  const [cancelledBillsReport, setCancelledBillsReport] = useState<
    CancelledBillsReportData[]
  >(() => [])

  const [fromDate, setFromDate] = useState(() => new Date())
  const [toDate, setToDate] = useState(() => new Date())
  const [openFromDate, setOpenFromDate] = useState(() => false)
  const [openToDate, setOpenToDate] = useState(() => false)

  const [isLoading, setIsLoading] = useState(() => false)
  const [isDisabled, setIsDisabled] = useState(() => false)

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

    let cancelledBillsCredObject: BasicReportCredentials = {
      from_date: fromDate,
      to_date: toDate,
      comp_id: loginStore?.comp_id,
      br_id: loginStore?.br_id,
      // user_id: loginStore?.user_id
    }

    setIsDisabled(true)
    setIsLoading(true)
    await fetchCancelledBills(cancelledBillsCredObject)
      .then(res => {
        setCancelledBillsReport(res?.data)
        console.log("XXXXXXXXXXXXXXXXX", res?.data)
      })
      .catch(err => {
        ToastAndroid.show("Error during fetching report.", ToastAndroid.SHORT)
      })
    setIsDisabled(false)
    setIsLoading(false)
  }

  const handlePrint = (
    cancelledBills: CancelledBillsReportData[],
    fromDate: string,
    toDate: string,
  ) => {
    if (cancelledBills.length !== 0) {
      printCancelledBillsReport(cancelledBills, fromDate, toDate)
    } else {
      ToastAndroid.show("No Cancelled Report Found!", ToastAndroid.SHORT)
      return
    }
  }

  const titleTextStyle: TextStyle = {
    color: theme.colors.onGreenContainer
  }

  const titleStyle: ViewStyle = {
    backgroundColor: theme.colors.greenContainer
  }

  // let totalSummary: number = 0
  // let totalCancelled: number = 0
  let totalNetAmount: number = 0
  let totalQty: number = 0

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={{ alignItems: "center" }}>
          <HeaderImage
            isBackEnabled
            imgLight={greenRep}
            imgDark={greenRepDark}
            borderRadius={30}
            blur={10}>
            Cancelled Bills Report
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
            textColor={theme.colors.onGreen}
            disabled={isDisabled}
            loading={isLoading}>
            SUBMIT
          </ButtonPaper>
        </View>

        <SurfacePaper backgroundColor={theme.colors.surface}>
          <DataTable>
            <DataTable.Header style={titleStyle}>
              {/* <DataTable.Title>Name</DataTable.Title>
            <DataTable.Title>Phone</DataTable.Title> */}
              {/* <DataTable.Title>Tnx. Date</DataTable.Title> */}
              <DataTable.Title textStyle={titleTextStyle}>Rcpt. No.</DataTable.Title>
              {/* <DataTable.Title textStyle={titleTextStyle}>Pay Mode</DataTable.Title> */}
              <DataTable.Title textStyle={titleTextStyle}>Qty.</DataTable.Title>
              <DataTable.Title textStyle={titleTextStyle}>Price</DataTable.Title>
              {receiptSettings?.gst_flag === "Y" && (
                <DataTable.Title textStyle={titleTextStyle}>GST</DataTable.Title>
              )}
              {/* <DataTable.Title textStyle={titleTextStyle}>Dis.</DataTable.Title> */}
              <DataTable.Title textStyle={titleTextStyle}>Cancelled</DataTable.Title>
            </DataTable.Header>

            {cancelledBillsReport.map(item => {
              let totalGST: number = 0

              totalGST += item?.cgst_amt + item?.sgst_amt
              totalNetAmount += item?.net_amt
              totalQty += item?.no_of_items

              return (
                <DataTable.Row key={item?.receipt_no}>
                  {/* <DataTable.Cell>{item?.cust_name}</DataTable.Cell>
              <DataTable.Cell>{item?.phone_no}</DataTable.Cell> */}
                  {/* <DataTable.Cell>{new Date(item?.trn_date).toLocaleDateString("en-GB")}</DataTable.Cell> */}
                  <DataTable.Cell>
                    {item?.receipt_no
                      ?.toString()
                      ?.substring(item?.receipt_no?.toString()?.length - 4)}
                  </DataTable.Cell>
                  {/* <DataTable.Cell>
                    {
                      item?.pay_mode === "C"
                        ? "Cash"
                        : item?.pay_mode === "D"
                          ? "Card"
                          : item?.pay_mode === "U"
                            ? "UPI"
                            : item?.pay_mode === "R"
                              ? "Credit"
                              : "Some Error!"
                    }
                  </DataTable.Cell> */}
                  <DataTable.Cell>{item?.no_of_items}</DataTable.Cell>
                  <DataTable.Cell>{item?.price}</DataTable.Cell>
                  {receiptSettings?.gst_flag === "Y" && (
                    <DataTable.Cell>{totalGST}</DataTable.Cell>
                  )}
                  {/* <DataTable.Cell>{item?.discount_amt}</DataTable.Cell> */}
                  <DataTable.Cell>{item?.net_amt}</DataTable.Cell>
                </DataTable.Row>
              )
            })}
          </DataTable>
          <View style={{ padding: normalize(10) }}>
            <Text
              variant="labelMedium"
              style={{ color: theme.colors.secondary }}>
              TOTAL QTY: {totalQty}  TOTAL CANCELLED: ₹{totalNetAmount}
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

export default CancelledBillsReportScreen

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },

  title: {
    textAlign: "center",
  },
})
