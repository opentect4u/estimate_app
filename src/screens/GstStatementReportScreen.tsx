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
import { GstStatement } from "../models/api_types"
import SurfacePaper from "../components/SurfacePaper"
import { useBluetoothPrint } from "../hooks/printables/useBluetoothPrint"
import useGstStatementReport from "../hooks/api/useGstStatementReport"

function GstStatementReportScreen() {
  const theme = usePaperColorScheme()

  const loginStore = JSON.parse(loginStorage.getString("login-data"))

  const { fetchGstStatement } = useGstStatementReport()
  const { printGstStatement } = useBluetoothPrint()

  const [gstStatement, setGstStatement] = useState<GstStatement[]>(() => [])

  const [fromDate, setFromDate] = useState(() => new Date())
  const [toDate, setToDate] = useState(() => new Date())
  const [openFromDate, setOpenFromDate] = useState(() => false)
  const [openToDate, setOpenToDate] = useState(() => false)

  const [isLoading, setIsLoading] = useState(() => false)
  const [isDisabled, setIsDisabled] = useState(() => false)

  const formattedFromDate = formattedDate(fromDate)
  const formattedToDate = formattedDate(toDate)

  const handleGetGstReport = async (
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
    await fetchGstStatement(fromDate, toDate, companyId, branchId, userId)
      .then(res => {
        setGstStatement(res?.data)
        console.log("WWWWWWWWWWWWWW", res?.data)
      })
      .catch(err => {
        ToastAndroid.show("Error fetching GST report.", ToastAndroid.SHORT)
      })
    setIsDisabled(false)
    setIsLoading(false)
  }

  const handlePrint = (
    gstStatementReport: GstStatement[],
    fromDate: string,
    toDate: string,
  ) => {
    if (gstStatementReport.length !== 0) {
      printGstStatement(gstStatementReport, fromDate, toDate)
    } else {
      ToastAndroid.show("No GST Statement Report Found!", ToastAndroid.SHORT)
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
            GST Statement
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
              handleGetGstReport(
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
              <DataTable.Title>Rcpt No.</DataTable.Title>
              <DataTable.Title numeric>CGST</DataTable.Title>
              <DataTable.Title numeric>SGST</DataTable.Title>
              <DataTable.Title numeric>Total Tax</DataTable.Title>
              <DataTable.Title numeric>Taxable Amt.</DataTable.Title>
              {/* <DataTable.Title numeric>Net Amount</DataTable.Title> */}
            </DataTable.Header>

            {gstStatement.map((item, i) => {
              totalTax += item?.total_tax
              return (
                <DataTable.Row key={i}>
                  <DataTable.Cell>
                    {item?.receipt_no
                      ?.toString()
                      ?.substring(item?.receipt_no?.toString()?.length - 4)}
                  </DataTable.Cell>
                  <DataTable.Cell numeric>{item?.cgst_amt}</DataTable.Cell>
                  <DataTable.Cell numeric>{item?.sgst_amt}</DataTable.Cell>
                  <DataTable.Cell numeric>{item?.total_tax}</DataTable.Cell>
                  <DataTable.Cell numeric>{item?.taxable_amt}</DataTable.Cell>
                  {/* <DataTable.Cell numeric>{item?.net_amt}</DataTable.Cell> */}
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
              handlePrint(gstStatement, formattedFromDate, formattedToDate)
            }
            mode="contained-tonal">
            PRINT
          </ButtonPaper>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default GstStatementReportScreen

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },

  title: {
    textAlign: "center",
  },
})
