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
  CollectionReport,
  CollectionReportCredentials,
} from "../models/api_types"
import SurfacePaper from "../components/SurfacePaper"
import { useBluetoothPrint } from "../hooks/printables/useBluetoothPrint"
import useCollectionReport from "../hooks/api/useCollectionReport"

function SaleSummaryScreen() {
  const theme = usePaperColorScheme()

  const loginStore = JSON.parse(loginStorage.getString("login-data"))

  const { fetchCollectionReport } = useCollectionReport()
  const { printSaleSummaryReport } = useBluetoothPrint()

  const [collectionReport, setCollectionReport] = useState<CollectionReport[]>(
    () => [],
  )

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
    setIsDisabled(true)
    setIsLoading(true)
    let collectionReportCredObject: CollectionReportCredentials = {
      from_date: fromDate,
      to_date: toDate,
      comp_id: companyId,
      br_id: branchId,
      // user_id: userId,
    }
    await fetchCollectionReport(collectionReportCredObject)
      .then(res => {
        setCollectionReport(res?.data)
        console.log("XXXXXXXXXXXXXXXXX", res?.data)
      })
      .catch(err => {
        ToastAndroid.show("Error during fetching report.", ToastAndroid.SHORT)
      })
    setIsDisabled(false)
    setIsLoading(false)
  }

  const handlePrint = (
    collectionReport: CollectionReport[],
    fromDate: string,
    toDate: string,
  ) => {
    if (collectionReport.length !== 0) {
      printSaleSummaryReport(collectionReport, fromDate, toDate)
    } else {
      ToastAndroid.show("No Sale Summary Found!", ToastAndroid.SHORT)
      return
    }
  }

  const titleTextStyle: TextStyle = {
    color: theme.colors.onPrimaryContainer
  }

  const titleStyle: ViewStyle = {
    backgroundColor: theme.colors.primaryContainer
  }

  let totalSummary: number = 0
  let totalBills: number = 0
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
            Sale Summary
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
            textColor={theme.colors.primary}
            onPress={() => setOpenFromDate(true)}
            mode="text">
            FROM: {fromDate?.toLocaleDateString("en-GB")}
          </ButtonPaper>
          <ButtonPaper
            textColor={theme.colors.primary}
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
              handleGetCollectionReport(
                formattedFromDate,
                formattedToDate,
                loginStore.comp_id,
                loginStore.br_id,
                // loginStore?.user_id,
              )
            }
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
            <DataTable.Header style={titleStyle}>
              {/* <DataTable.Title textStyle={titleTextStyle}>Created By</DataTable.Title> */}
              <DataTable.Title textStyle={titleTextStyle}>Sl. No.</DataTable.Title>
              <DataTable.Title textStyle={titleTextStyle}>Pay Mode</DataTable.Title>
              <DataTable.Title textStyle={titleTextStyle} numeric>RCPTs</DataTable.Title>
              <DataTable.Title textStyle={titleTextStyle} numeric>Net Amt.</DataTable.Title>
              <DataTable.Title textStyle={titleTextStyle} numeric>Due</DataTable.Title>
              <DataTable.Title textStyle={titleTextStyle} numeric>Recov.</DataTable.Title>
              {/* <DataTable.Title textStyle={titleTextStyle} numeric>Cncl Amt.</DataTable.Title> */}
            </DataTable.Header>

            {collectionReport?.map((item, i) => {
              totalSummary += item?.net_amt
              totalBills += item?.no_of_rcpt
              totalCancelled += item?.can_amt

              return (
                <DataTable.Row key={i}>
                  {/* <DataTable.Cell>{item?.user_name}</DataTable.Cell> */}
                  <DataTable.Cell>{i + 1}</DataTable.Cell>
                  <DataTable.Cell>
                    {item?.pay_mode === "C"
                      ? "Cash"
                      : item?.pay_mode === "U"
                        ? "UPI"
                        : item?.pay_mode === "D"
                          ? "Card"
                          : item?.pay_mode === "R"
                            ? "Credit"
                            : item?.pay_mode === "Z"
                              ? "Recovery" : "Err"}
                  </DataTable.Cell>
                  <DataTable.Cell numeric>{item?.pay_mode === "Z" ? "---" : item?.no_of_rcpt}</DataTable.Cell>
                  <DataTable.Cell numeric>{item?.net_amt}</DataTable.Cell>
                  <DataTable.Cell numeric>{item?.due_amt}</DataTable.Cell>
                  <DataTable.Cell numeric>{item?.recover_amt}</DataTable.Cell>
                  {/* <DataTable.Cell numeric>{item?.can_amt}</DataTable.Cell> */}
                </DataTable.Row>
              )
            })}
          </DataTable>
          <View style={{ padding: normalize(10) }}>
            <Text variant="labelMedium" style={{ color: theme.colors.primary }}>
              TOTAL: {totalBills} Total NET: ₹{totalSummary?.toFixed(2)}
              {/* CANCELLED: ₹{totalCancelled} */}
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
              handlePrint(collectionReport, formattedFromDate, formattedToDate)
            }
            mode="contained-tonal"
            buttonColor={theme.colors.primaryContainer}
            textColor={theme.colors.onPrimaryContainer}>
            PRINT
          </ButtonPaper>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SaleSummaryScreen

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },

  title: {
    textAlign: "center",
  },
})
