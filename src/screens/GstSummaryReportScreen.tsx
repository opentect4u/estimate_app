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
import { GstStatement, GstSummary } from "../models/api_types"
import SurfacePaper from "../components/SurfacePaper"
import { useBluetoothPrint } from "../hooks/printables/useBluetoothPrint"
import useGstStatementReport from "../hooks/api/useGstStatementReport"
import useGstSummary from "../hooks/api/useGstSummaryReport"
import useGstSummaryReport from "../hooks/api/useGstSummaryReport"

function GstSummaryReportScreen() {
  const theme = usePaperColorScheme()

  const loginStore = JSON.parse(loginStorage.getString("login-data"))

  const { fetchGstSummary } = useGstSummaryReport()
  const { printGstSummary } = useBluetoothPrint()

  const [gstSummary, setGstSummary] = useState<GstSummary[]>(() => [])

  const [fromDate, setFromDate] = useState(() => new Date())
  const [toDate, setToDate] = useState(() => new Date())
  const [openFromDate, setOpenFromDate] = useState(() => false)
  const [openToDate, setOpenToDate] = useState(() => false)

  const [isLoading, setIsLoading] = useState(() => false)
  const [isDisabled, setIsDisabled] = useState(() => false)

  const formattedFromDate = formattedDate(fromDate)
  const formattedToDate = formattedDate(toDate)

  const handleGetSummaryReport = async (
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
    await fetchGstSummary(fromDate, toDate, companyId, branchId, userId)
      .then(res => {
        setGstSummary(res?.data)
        console.log("LLLLLLLLLLLLLLLL", res?.data)
      })
      .catch(err => {
        ToastAndroid.show(
          "Error fetching GST summary report.",
          ToastAndroid.SHORT,
        )
      })
    setIsDisabled(false)
    setIsLoading(false)
  }

  const handlePrint = (
    gstSummaryReport: GstSummary[],
    fromDate: string,
    toDate: string,
  ) => {
    if (gstSummaryReport.length !== 0) {
      printGstSummary(gstSummaryReport, fromDate, toDate)
    } else {
      ToastAndroid.show("No GST Summary Report Found!", ToastAndroid.SHORT)
      return
    }
  }

  let totalTax = 0

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
            GST Summary
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
              handleGetSummaryReport(
                formattedFromDate,
                formattedToDate,
                loginStore.comp_id,
                loginStore.br_id,
                loginStore?.user_id,
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
            <DataTable.Header>
              <DataTable.Title>GST (%)</DataTable.Title>
              <DataTable.Title numeric>CGST Amt.</DataTable.Title>
              <DataTable.Title numeric>SGST Amt.</DataTable.Title>
              <DataTable.Title numeric>Total Tax</DataTable.Title>
            </DataTable.Header>

            {gstSummary.map((item, i) => {
              totalTax += item?.total_tax
              return (
                <DataTable.Row key={i}>
                  <DataTable.Cell>{item?.cgst_prtg}</DataTable.Cell>
                  <DataTable.Cell numeric>{item?.cgst_amt}</DataTable.Cell>
                  <DataTable.Cell numeric>{item?.sgst_amt}</DataTable.Cell>
                  <DataTable.Cell numeric>{item?.total_tax}</DataTable.Cell>
                </DataTable.Row>
              )
            })}
          </DataTable>
          <View style={{ padding: normalize(10) }}>
            <Text variant="labelMedium" style={{ color: theme.colors.primary }}>
              TOTAL TAX: ₹{totalTax?.toFixed(2)}
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
              handlePrint(gstSummary, formattedFromDate, formattedToDate)
            }
            mode="contained-tonal">
            PRINT
          </ButtonPaper>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default GstSummaryReportScreen

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },

  title: {
    textAlign: "center",
  },
})
