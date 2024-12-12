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
import { RecoveryReportCredentials, RecoveryReportData } from "../models/api_types"
import SurfacePaper from "../components/SurfacePaper"
import { useBluetoothPrint } from "../hooks/printables/useBluetoothPrint"
import useRecoveryReport from "../hooks/api/useRecoveryReport"

function RecoveryReportScreen() {
    const theme = usePaperColorScheme()

    const loginStore = JSON.parse(loginStorage.getString("login-data"))

    const { fetchRecoveryReport } = useRecoveryReport()
    const { printRecoveryReport } = useBluetoothPrint()

    const [recoveryReport, setRecoveryReport] = useState<RecoveryReportData[]>(
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

    const handleGetDueReport = async (
        fromDate: string,
        toDate: string,
        companyId: number,
        branchId: number,
        // userId: string,
    ) => {
        setIsDisabled(true)
        setIsLoading(true)
        let recoveryReportCredObject: RecoveryReportCredentials = {
            comp_id: companyId,
            br_id: branchId,
            from_date: fromDate,
            to_date: toDate,
            // user_id: userId,
        }
        await fetchRecoveryReport(recoveryReportCredObject)
            .then(res => {
                setRecoveryReport(res?.data)
                console.log("XXXXXXXXXXXXXXXXX", res?.data)
            })
            .catch(err => {
                ToastAndroid.show("Error during fetching report.", ToastAndroid.SHORT)
            })
        setIsDisabled(false)
        setIsLoading(false)
    }

    const handlePrint = (
        recReport: RecoveryReportData[],
        fromDate: string,
        toDate: string,
    ) => {
        if (recReport.length !== 0) {
            printRecoveryReport(recReport, fromDate, toDate)
        } else {
            ToastAndroid.show("No Recovery Report Found!", ToastAndroid.SHORT)
            return
        }
    }

    const titleTextStyle: TextStyle = {
        color: theme.colors.onPrimaryContainer
    }

    const titleStyle: ViewStyle = {
        backgroundColor: theme.colors.primaryContainer
    }

    let totalRecoverAmt: number = 0

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
                        Recovery Report
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
                            handleGetDueReport(
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
                            <DataTable.Title textStyle={titleTextStyle}>Recover Dt.</DataTable.Title>
                            <DataTable.Title textStyle={titleTextStyle}>Customer</DataTable.Title>
                            <DataTable.Title textStyle={titleTextStyle}>Phone</DataTable.Title>
                            <DataTable.Title textStyle={titleTextStyle} numeric>Recovery Amt.</DataTable.Title>
                        </DataTable.Header>

                        {recoveryReport?.map((item, i) => {
                            // totalSummary += item?.net_amt
                            // totalBills += item?.no_of_rcpt
                            totalRecoverAmt += item?.recovery_amt

                            return (
                                <DataTable.Row key={i}>
                                    <DataTable.Cell>{item?.recover_dt}</DataTable.Cell>
                                    <DataTable.Cell>
                                        {item?.cust_name}
                                    </DataTable.Cell>
                                    <DataTable.Cell>{item?.phone_no}</DataTable.Cell>
                                    <DataTable.Cell numeric>{item?.recovery_amt}</DataTable.Cell>
                                </DataTable.Row>
                            )
                        })}
                    </DataTable>
                    <View style={{ padding: normalize(10) }}>
                        <Text variant="labelMedium" style={{ color: theme.colors.primary }}>
                            TOTAL: {recoveryReport?.length}   RECOVERY AMT: ₹{totalRecoverAmt}
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
                            handlePrint(recoveryReport, formattedFromDate, formattedToDate)
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

export default RecoveryReportScreen

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
    },

    title: {
        textAlign: "center",
    },
})
