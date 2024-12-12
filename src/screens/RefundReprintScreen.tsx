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
import { RefundReportCredentials, RefundReportData, ShowRefundBillData } from "../models/api_types"
import SurfacePaper from "../components/SurfacePaper"
import { useBluetoothPrint } from "../hooks/printables/useBluetoothPrint"
import { AppStore } from "../context/AppContext"
import useRefundReport from "../hooks/api/useRefundReport"
import useShowRefundBill from "../hooks/api/useShowRefundBill"
import DialogBoxForReprint from "../components/DialogBoxForReprint"
import ScrollableListContainer from "../components/ScrollableListContainer"
import AddedProductList from "../components/AddedProductList"
import NetTotalForRePrints from "../components/NetTotalForRePrints"
import useCalculations from "../hooks/useCalculations"
import { AppStoreContext } from "../models/custom_types"

function RefundReprintScreen() {
    const theme = usePaperColorScheme()

    const loginStore = JSON.parse(loginStorage.getString("login-data"))

    const { receiptSettings } = useContext<AppStoreContext>(AppStore)

    const { fetchRefundReport } = useRefundReport()
    const { fetchRefundBill } = useShowRefundBill()
    const { printRefundReport, rePrintWithoutGst, rePrint } = useBluetoothPrint()
    const {
        grandTotalCalculate,
        grandTotalWithGSTCalculate,
        grandTotalWithGSTInclCalculate,
    } = useCalculations()

    const [refundReport, setRefundReport] = useState<RefundReportData[]>(() => [])
    const [refundedData, setRefundedData] = useState<ShowRefundBillData[]>(() => [])
    const [currentRefundReceiptNo, setCurrentRefundReceiptNo] = useState<number | undefined>(
        () => undefined,
    )

    const [fromDate, setFromDate] = useState(() => new Date())
    const [toDate, setToDate] = useState(() => new Date())
    const [openFromDate, setOpenFromDate] = useState(() => false)
    const [openToDate, setOpenToDate] = useState(() => false)

    const [visible, setVisible] = useState<boolean>(() => false)
    const hideDialog = () => setVisible(() => false)

    const [checked, setChecked] = useState<string>(() => "C")
    const [isLoading, setIsLoading] = useState(() => false)
    const [isDisabled, setIsDisabled] = useState(() => false)

    const formattedFromDate = formattedDate(fromDate)
    const formattedToDate = formattedDate(toDate)

    const [gstFlag, setGstFlag] = useState<"Y" | "N">()
    const [gstType, setGstType] = useState<"I" | "E">()

    let netTotal = 0
    let totalDiscount = 0

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

    // const handlePrint = (
    //     refundReport: RefundReportData[],
    //     fromDate: string,
    //     toDate: string,
    // ) => {
    //     if (refundReport.length !== 0) {
    //         printRefundReport(refundReport, fromDate, toDate)
    //     } else {
    //         ToastAndroid.show("No Refund Report Found!", ToastAndroid.SHORT)
    //         return
    //     }
    // }


    const handleGetRefundedBill = async (rfRcptNo: number) => {
        await fetchRefundBill(rfRcptNo)
            .then(res => {
                setRefundedData(res?.data)
                console.log("handleGetBill - HOMESCREEN - fetchBill", res?.data)
            })
            .catch(err => {
                ToastAndroid.show("Error during fetching old bill", ToastAndroid.SHORT)
            })
    }

    const handleClickRefundReceipt = (rfRcptNo: number) => {
        setVisible(!visible)
        handleGetRefundedBill(rfRcptNo)
        setCurrentRefundReceiptNo(rfRcptNo)
        setGstFlag(refundedData[0]?.gst_flag)
        setGstType(refundedData[0]?.gst_type)
    }

    const onDialogFailure = () => {
        setVisible(!visible)
    }

    const onDialogSuccecss = () => {
        setVisible(!visible)

        // ToastAndroid.showWithGravityAndOffset(
        //   "Printing feature will be added in some days.",
        //   ToastAndroid.SHORT,
        //   ToastAndroid.CENTER,
        //   25,
        //   50,
        // )
        handleRePrintRefundReceipt()
    }

    const handleRePrintRefundReceipt = () => {
        if (refundedData.length > 0) {
            refundedData[0]?.gst_flag === "N"
                ? rePrintWithoutGst(
                    //@ts-ignore
                    refundedData,
                    netTotal,
                    totalDiscount,
                    refundedData[0]?.received_amt,
                    refundedData[0]?.received_amt !== undefined
                        ? refundedData[0]?.received_amt -
                        grandTotalCalculate(netTotal, totalDiscount)
                        : 0,
                    refundedData[0]?.cust_name,
                    refundedData[0]?.phone_no,
                    // refundedData[0]?.receipt_no,
                    currentRefundReceiptNo,
                    checked,
                    true,
                    true
                )
                : refundedData[0]?.gst_type === "E"
                    ? rePrint(
                        //@ts-ignore
                        refundedData,
                        netTotal,
                        totalDiscount,
                        refundedData[0]?.received_amt,
                        refundedData[0]?.received_amt !== undefined
                            ? refundedData[0]?.received_amt -
                            parseFloat(
                                grandTotalWithGSTCalculate(
                                    netTotal,
                                    totalDiscount,
                                    refundedData[0]?.tcgst_amt * 2,
                                ),
                            )
                            : 0,
                        refundedData[0]?.cust_name,
                        refundedData[0]?.phone_no,
                        // refundedData[0]?.receipt_no,
                        currentRefundReceiptNo,
                        checked,
                        true,
                        true
                    )
                    : rePrint(
                        //@ts-ignore
                        refundedData,
                        netTotal,
                        totalDiscount,
                        refundedData[0]?.received_amt,
                        refundedData[0]?.received_amt !== undefined
                            ? refundedData[0]?.received_amt -
                            parseFloat(
                                grandTotalWithGSTInclCalculate(netTotal, totalDiscount),
                            )
                            : 0,
                        refundedData[0]?.cust_name,
                        refundedData[0]?.phone_no,
                        // refundedData[0]?.receipt_no,
                        currentRefundReceiptNo,
                        checked,
                        true,
                        true
                    )
        } else {
            ToastAndroid.show("Something went wrong!", ToastAndroid.SHORT)
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
                        Refund Reprint
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
                                <DataTable.Row key={item?.refund_rcpt_no} onPress={() => handleClickRefundReceipt(item?.refund_rcpt_no)}>
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
                    {/* <View style={{ padding: normalize(10) }}>
                        <Text variant="labelMedium" style={{ color: theme.colors.purple }}>
                            QUANTITY: {totalQty} TOTAL: ₹{totalNetAmount?.toFixed(2)}
                        </Text>
                    </View> */}
                </SurfacePaper>
                <View
                    style={{
                        paddingHorizontal: normalize(20),
                        paddingBottom: normalize(10),
                    }}>
                    {/* <ButtonPaper
                        icon={"cloud-print-outline"}
                        onPress={() =>
                            handlePrint(refundReport, formattedFromDate, formattedToDate)
                        }
                        mode="contained-tonal">
                        PRINT
                    </ButtonPaper> */}
                </View>
            </ScrollView>





            <DialogBoxForReprint
                iconSize={30}
                visible={visible}
                hide={hideDialog}
                titleStyle={styles.title}
            // title="Print Bill"
            >
                <View style={{ paddingBottom: 5 }}>
                    <Text
                        style={{ textAlign: "center", color: theme.colors.primary }}
                        variant="bodyLarge">
                        {currentRefundReceiptNo}
                    </Text>
                    <Text
                        style={{ textAlign: "center", color: theme.colors.secondary }}
                        variant="bodyLarge">
                        {new Date(refundedData[0]?.refund_dt).toLocaleString("en-GB")}
                    </Text>
                    <View
                        style={{
                            borderWidth: 1,
                            borderStyle: "dashed",
                            width: "80%",
                            borderColor: theme.colors.secondary,
                            alignSelf: "center",
                        }}></View>
                    {refundedData[0]?.cust_name && (
                        <Text
                            style={{ textAlign: "center", color: theme.colors.primary }}
                            variant="bodyLarge">
                            {refundedData[0]?.cust_name}
                        </Text>
                    )}
                    <Text
                        style={{ textAlign: "center", color: theme.colors.secondary }}
                        variant="bodyLarge">
                        {refundedData[0]?.phone_no}
                    </Text>
                </View>
                <ScrollableListContainer
                    backgroundColor={theme.colors.surfaceVariant}
                    height={250}
                    width={300}>
                    {refundedData?.map((item, i) => {
                        // console.log("billedSaleData - item.item_name", item.item_name)
                        // console.log("billedSaleData - item.qty", item.qty)
                        // console.log("billedSaleData - item.price", item.price)
                        netTotal += item.price * item.qty

                        // item?.discount_type === "P"
                        //   ? totalDiscount += item?.discount_amt
                        //   : totalDiscount += item?.discount_amt * item?.qty

                        // item?.discount_type === "P"
                        //   ? totalDiscount += item?.tdiscount_amt

                        //   : totalDiscount += item?.tdiscount_amt

                        totalDiscount = item?.tdiscount_amt
                        console.log(
                            "$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$",
                            totalDiscount,
                        )
                        //@ts-ignore
                        // totalDiscount += item?.discount_amt
                        return (
                            <AddedProductList
                                disabled
                                itemName={item.item_name}
                                quantity={item.qty}
                                // unit={item.unit}
                                unitPrice={item.price}
                                discount={
                                    item?.discount_flag === "Y" && item?.discount_position !== "B"
                                        ? item?.discount_type === "P"
                                            ? item?.dis_pertg
                                            : item?.discount_amt
                                        : 0
                                }
                                discountType={item?.discount_type}
                                gstFlag={item?.gst_flag}
                                key={i}
                            />
                        )
                    })}
                </ScrollableListContainer>
                <NetTotalForRePrints
                    width={300}
                    backgroundColor={theme.colors.pinkContainer}
                    //@ts-ignore
                    addedProductsList={refundedData}
                    netTotal={netTotal}
                    textColor={theme.colors.onPinkContainer}
                    totalDiscount={totalDiscount}
                    disabled
                />
                {/* <View style={{ paddingTop: normalize(10) }}>
          <ButtonPaper icon="cancel" mode="contained-tonal" onPress={() => handleCancelBill(currentReceiptNo)} buttonColor={theme.colors.error} textColor={theme.colors.onError}>
            CANCEL BILL
          </ButtonPaper>
        </View> */}
                <View
                    style={{
                        justifyContent: "space-between",
                        flexDirection: "row",
                        paddingTop: 10,
                    }}>
                    <ButtonPaper
                        mode="text"
                        onPress={onDialogFailure}
                        textColor={theme.colors.error}>
                        Cancel
                    </ButtonPaper>
                    <ButtonPaper
                        mode="text"
                        onPress={onDialogSuccecss}
                        disabled={isDisabled}
                        loading={isLoading}
                        textColor={theme.colors.primary}>
                        Reprint
                    </ButtonPaper>
                </View>
            </DialogBoxForReprint>





        </SafeAreaView>
    )
}

export default RefundReprintScreen

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
    },

    title: {
        textAlign: "center",
    },
})
