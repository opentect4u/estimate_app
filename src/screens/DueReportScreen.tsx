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
import { DueReportCredentials, DueReportData } from "../models/api_types"
import SurfacePaper from "../components/SurfacePaper"
import { useBluetoothPrint } from "../hooks/printables/useBluetoothPrint"
import useCollectionReport from "../hooks/api/useCollectionReport"
import useDueReport from "../hooks/api/useDueReport"

function DueReportScreen() {
    const theme = usePaperColorScheme()

    const loginStore = JSON.parse(loginStorage.getString("login-data"))

    const { fetchDueReport } = useDueReport()
    const { printDueReport } = useBluetoothPrint()

    const [dueReport, setDueReport] = useState<DueReportData[]>(
        () => [],
    )

    // const [fromDate, setFromDate] = useState(() => new Date())
    const [toDate, setToDate] = useState(() => new Date())
    const [openFromDate, setOpenFromDate] = useState(() => false)
    const [openToDate, setOpenToDate] = useState(() => false)

    const [isLoading, setIsLoading] = useState(() => false)
    const [isDisabled, setIsDisabled] = useState(() => false)

    // const formattedFromDate = formattedDate(fromDate)
    const formattedToDate = formattedDate(toDate)

    const handleGetDueReport = async (
        // fromDate: string,
        toDate: string,
        companyId: number,
        branchId: number,
        // userId: string,
    ) => {
        setIsDisabled(true)
        setIsLoading(true)
        let dueReportCredObject: DueReportCredentials = {
            comp_id: companyId,
            br_id: branchId,
            date: toDate,
            // user_id: userId,
        }
        await fetchDueReport(dueReportCredObject)
            .then(res => {
                setDueReport(res?.data)
                console.log("XXXXXXXXXXXXXXXXX", res?.data)
            })
            .catch(err => {
                ToastAndroid.show("Error during fetching report.", ToastAndroid.SHORT)
            })
        setIsDisabled(false)
        setIsLoading(false)
    }

    const handlePrint = (
        dueRep: DueReportData[],
        date: string,
    ) => {
        if (dueRep.length !== 0) {
            printDueReport(dueRep, date)
        } else {
            ToastAndroid.show("No Due Report Found!", ToastAndroid.SHORT)
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
    let totalDue: number = 0

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
                        Due Report
                    </HeaderImage>
                </View>
                <View
                    style={{
                        padding: normalize(10),
                        flexDirection: "row",
                        justifyContent: "space-around",
                        alignItems: "center",
                    }}>
                    {/* <ButtonPaper
                        textColor={theme.colors.primary}
                        onPress={() => setOpenFromDate(true)}
                        mode="text">
                        FROM: {fromDate?.toLocaleDateString("en-GB")}
                    </ButtonPaper> */}
                    <ButtonPaper
                        textColor={theme.colors.primary}
                        onPress={() => setOpenToDate(true)}
                        mode="text">
                        DATE: {toDate?.toLocaleDateString("en-GB")}
                    </ButtonPaper>

                    {/* <DatePicker
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
                    /> */}
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
                            handleGetDueReport(
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
                            <DataTable.Title textStyle={titleTextStyle}>Customer</DataTable.Title>
                            <DataTable.Title textStyle={titleTextStyle}>Phone</DataTable.Title>
                            <DataTable.Title textStyle={titleTextStyle} numeric>Due Amt.</DataTable.Title>
                        </DataTable.Header>

                        {dueReport?.map((item, i) => {
                            // totalSummary += item?.net_amt
                            // totalBills += item?.no_of_rcpt
                            totalDue += item?.due_amt

                            return (
                                <DataTable.Row key={i}>
                                    <DataTable.Cell>{i + 1}</DataTable.Cell>
                                    <DataTable.Cell>
                                        {item?.cust_name}
                                    </DataTable.Cell>
                                    <DataTable.Cell>{item?.phone_no}</DataTable.Cell>
                                    <DataTable.Cell numeric>{item?.due_amt}</DataTable.Cell>
                                </DataTable.Row>
                            )
                        })}
                    </DataTable>
                    <View style={{ padding: normalize(10) }}>
                        <Text variant="labelMedium" style={{ color: theme.colors.primary }}>
                            TOTAL: {dueReport?.length}   DUE: ₹{totalDue}
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
                            handlePrint(dueReport, formattedToDate)
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

export default DueReportScreen

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
    },

    title: {
        textAlign: "center",
    },
})
