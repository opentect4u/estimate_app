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
import useSaleReport from "../hooks/api/useSaleReport"
import useDaybookReport from "../hooks/api/useDaybookReport"
import DatePicker from "react-native-date-picker"
import ButtonPaper from "../components/ButtonPaper"
import { useContext, useState } from "react"
import normalize from "react-native-normalize"
import { formattedDate } from "../utils/dateFormatter"
import { loginStorage } from "../storage/appStorage"
import { BasicReportCredentials, DaybookReportData, SaleReport } from "../models/api_types"
import SurfacePaper from "../components/SurfacePaper"
import { useBluetoothPrint } from "../hooks/printables/useBluetoothPrint"
import { AppStore } from "../context/AppContext"
import { AppStoreContext } from "../models/custom_types"

function DaybookReportScreen() {
    const theme = usePaperColorScheme()

    const loginStore = JSON.parse(loginStorage.getString("login-data"))

    const { receiptSettings } = useContext<AppStoreContext>(AppStore)

    // const { fetchSaleReport } = useSaleReport()
    const { fetchDaybookReport } = useDaybookReport()
    const { printDaybookReport } = useBluetoothPrint()

    const [daybookReport, setDaybookReportReport] = useState<DaybookReportData[]>(() => [])

    const [fromDate, setFromDate] = useState(() => new Date())
    const [toDate, setToDate] = useState(() => new Date())
    const [openFromDate, setOpenFromDate] = useState(() => false)
    const [openToDate, setOpenToDate] = useState(() => false)

    const [isLoading, setIsLoading] = useState(() => false)
    const [isDisabled, setIsDisabled] = useState(() => false)

    const formattedFromDate = formattedDate(fromDate)
    const formattedToDate = formattedDate(toDate)

    const handleGetDaybookReport = async (
        fromDate: string,
        toDate: string
    ) => {
        const creds: BasicReportCredentials = {
            from_date: fromDate,
            to_date: toDate,
            comp_id: loginStore?.comp_id,
            br_id: loginStore?.br_id,
            // user_id: loginStore?.user_id
        }
        if (fromDate > toDate) {
            ToastAndroid.show(
                "From date must be lower than To date.",
                ToastAndroid.SHORT,
            )
            return
        }
        setIsDisabled(true)
        setIsLoading(true)
        await fetchDaybookReport(creds)
            .then(res => {
                setDaybookReportReport(res?.data)
                console.log("DDDDDDDDDDDDDDD", res?.data)
            })
            .catch(err => {
                ToastAndroid.show("Error fetching daybook report.", ToastAndroid.SHORT)
            })
        setIsDisabled(false)
        setIsLoading(false)
    }

    const handlePrint = (
        daybookReport: DaybookReportData[],
        fromDate: string,
        toDate: string,
    ) => {
        if (daybookReport.length !== 0) {
            printDaybookReport(daybookReport, fromDate, toDate)
        } else {
            ToastAndroid.show("No Daybook Report Found!", ToastAndroid.SHORT)
            return
        }
    }

    const titleTextStyle: TextStyle = {
        color: theme.colors.onPurpleContainer
    }

    const titleStyle: ViewStyle = {
        backgroundColor: theme.colors.purpleContainer
    }

    let totalNetAmount: number = 0
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
                        Daybook Report
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
                            handleGetDaybookReport(
                                formattedFromDate,
                                formattedToDate
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
                    <ScrollView horizontal>
                        <DataTable style={{
                            width: 430,
                        }}>
                            <DataTable.Header style={titleStyle}>
                                {/* <DataTable.Title>Name</DataTable.Title>
              <DataTable.Title>Phone</DataTable.Title> */}
                                <DataTable.Title>Sl. No.</DataTable.Title>
                                <DataTable.Title textStyle={titleTextStyle}>Rcpt. No.</DataTable.Title>
                                <DataTable.Title textStyle={titleTextStyle}>Net Amt.</DataTable.Title>
                                <DataTable.Title textStyle={titleTextStyle}>Cancel Amt.</DataTable.Title>
                            </DataTable.Header>

                            {daybookReport.map((item, index) => {
                                totalNetAmount += item?.net_amt
                                totalCancelled += item?.cancelled_amt

                                return (
                                    <DataTable.Row key={index}>
                                        <DataTable.Cell>
                                            {index + 1}
                                        </DataTable.Cell>
                                        <DataTable.Cell>
                                            {item?.receipt_no
                                                ?.toString()
                                                ?.substring(item?.receipt_no?.toString()?.length - 4)}
                                        </DataTable.Cell>
                                        <DataTable.Cell>
                                            {item?.net_amt}
                                        </DataTable.Cell>
                                        <DataTable.Cell>{item?.cancelled_amt}</DataTable.Cell>
                                    </DataTable.Row>
                                )
                            })}
                        </DataTable>
                    </ScrollView>
                    <View style={{ padding: normalize(10) }}>
                        <Text variant="labelMedium" style={{ color: theme.colors.purple }}>
                            TOTAL NET: {totalNetAmount?.toFixed(2)}  CANCELLED: ₹{totalCancelled?.toFixed(2)}
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
                            handlePrint(daybookReport, formattedFromDate, formattedToDate)
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

export default DaybookReportScreen

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
    },

    title: {
        textAlign: "center",
    },
})
