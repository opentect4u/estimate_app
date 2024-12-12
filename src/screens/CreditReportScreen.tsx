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
import { CreditReportResponseData, SaleReport } from "../models/api_types"
import SurfacePaper from "../components/SurfacePaper"
import { useBluetoothPrint } from "../hooks/printables/useBluetoothPrint"
import { AppStore } from "../context/AppContext"
import useCreditReport from "../hooks/api/useCreditReport"
import { AppStoreContext } from "../models/custom_types"

function CreditReportScreen() {
    const theme = usePaperColorScheme()

    const loginStore = JSON.parse(loginStorage.getString("login-data"))

    const { receiptSettings } = useContext<AppStoreContext>(AppStore)

    const { fetchCreditReport } = useCreditReport()
    const { printCreditReport } = useBluetoothPrint()

    const [creditReport, setCreditReport] = useState<CreditReportResponseData[]>(() => [])

    const [fromDate, setFromDate] = useState(() => new Date())
    const [toDate, setToDate] = useState(() => new Date())
    const [openFromDate, setOpenFromDate] = useState(() => false)
    const [openToDate, setOpenToDate] = useState(() => false)

    const [isLoading, setIsLoading] = useState(() => false)
    const [isDisabled, setIsDisabled] = useState(() => false)

    const formattedFromDate = formattedDate(fromDate)
    const formattedToDate = formattedDate(toDate)

    const handleGetCreditReport = async (
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
        await fetchCreditReport(fromDate, toDate, companyId, branchId, userId)
            .then(res => {
                setCreditReport(res?.data)
                console.log("DDDDDDDDDDDDDDD", res?.data)
            })
            .catch(err => {
                ToastAndroid.show("Error fetching sale report.", ToastAndroid.SHORT)
            })
        setIsDisabled(false)
        setIsLoading(false)
    }

    const handlePrint = (
        creditReport: CreditReportResponseData[],
        fromDate: string,
        toDate: string,
    ) => {
        if (creditReport.length !== 0) {
            printCreditReport(creditReport, fromDate, toDate)
        } else {
            ToastAndroid.show("No Credit Report Found!", ToastAndroid.SHORT)
            return
        }
    }

    let totalNetAmount: number = 0
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
                        Credit Report
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
                            handleGetCreditReport(
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
                    <ScrollView horizontal>
                        <DataTable style={{
                            width: 400,
                        }}>
                            <DataTable.Header style={{
                                backgroundColor: theme.colors.purpleContainer,
                            }}>
                                <DataTable.Title textStyle={{
                                    color: theme.colors.onPurpleContainer
                                }}>
                                    Date
                                </DataTable.Title>
                                <DataTable.Title textStyle={{
                                    color: theme.colors.onPurpleContainer
                                }} numberOfLines={2}>
                                    Mobile
                                </DataTable.Title>
                                <DataTable.Title textStyle={{
                                    color: theme.colors.onPurpleContainer
                                }}>
                                    Rcpt No.
                                </DataTable.Title>
                                <DataTable.Title textStyle={{
                                    color: theme.colors.onPurpleContainer
                                }}>
                                    Amt.
                                </DataTable.Title>
                                <DataTable.Title textStyle={{
                                    color: theme.colors.onPurpleContainer
                                }}>
                                    Paid Amt.
                                </DataTable.Title>
                                <DataTable.Title textStyle={{
                                    color: theme.colors.onPurpleContainer
                                }}>
                                    Due Amt.
                                </DataTable.Title>
                            </DataTable.Header>

                            {creditReport.map(item => {
                                totalDue += item?.due_amt
                                totalNetAmount += item?.net_amt
                                return (
                                    <DataTable.Row key={item?.receipt_no}>
                                        <DataTable.Cell
                                            onPress={() => ToastAndroid.show(`${new Date(item?.trn_date).toLocaleDateString("en-GB")}`, ToastAndroid.SHORT)}>
                                            {new Date(item?.trn_date).toLocaleDateString("en-GB")}
                                        </DataTable.Cell>
                                        <DataTable.Cell
                                            onPress={() => ToastAndroid.show(`${item?.phone_no}`, ToastAndroid.SHORT)}>
                                            {item?.phone_no}
                                        </DataTable.Cell>
                                        <DataTable.Cell
                                            onPress={() => ToastAndroid.show(`${item?.receipt_no?.toString()}`, ToastAndroid.SHORT)}>
                                            {item?.receipt_no
                                                ?.toString()
                                                ?.substring(item?.receipt_no?.toString()?.length - 4)}
                                        </DataTable.Cell>

                                        <DataTable.Cell>{item?.net_amt}</DataTable.Cell>

                                        <DataTable.Cell>{item?.paid_amt}</DataTable.Cell>
                                        <DataTable.Cell>{item?.due_amt}</DataTable.Cell>
                                    </DataTable.Row>
                                )
                            })}
                        </DataTable>
                    </ScrollView>
                    <View style={{ padding: normalize(10) }}>
                        <Text variant="labelMedium" style={{ color: theme.colors.purple }}>
                            TOTAL NET: ₹{totalNetAmount}  TOTAL DUE: ₹{totalDue?.toFixed(2)}
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
                            handlePrint(creditReport, formattedFromDate, formattedToDate)
                            // ToastAndroid.show("Printing feature will be added in the future.", ToastAndroid.SHORT)
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

export default CreditReportScreen

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
    },

    title: {
        textAlign: "center",
    },
})
