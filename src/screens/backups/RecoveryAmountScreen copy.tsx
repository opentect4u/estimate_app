import React, { useContext, useEffect, useState } from "react"
import {
    StyleSheet,
    ScrollView,
    SafeAreaView,
    View,
    ToastAndroid,
    ViewStyle,
    TextStyle,
    Alert,
} from "react-native"
import { DataTable, List, RadioButton, Searchbar, Text } from "react-native-paper"
import HeaderImage from "../components/HeaderImage"
import {
    textureBill,
    textureBillDark,
    textureReport,
    textureReportDark,
} from "../resources/images"
import { usePaperColorScheme } from "../theme/theme"
import { CommonActions, useNavigation } from "@react-navigation/native"
import ButtonPaper from "../components/ButtonPaper"
import normalize, { SCREEN_HEIGHT } from "react-native-normalize"
import useShowBill from "../hooks/api/useShowBill"
import {
    RecoveryAmountCredentials,
    RecoveryAmountResponseData,
    RecoveryUpdateCredentials,
    ShowBillData,
} from "../models/api_types"
import { loginStorage } from "../storage/appStorage"
import { AppStore } from "../context/AppContext"
import ScrollableListContainer from "../components/ScrollableListContainer"
import AddedProductList from "../components/AddedProductList"
import NetTotalForRePrints from "../components/NetTotalForRePrints"
import DialogBoxForReprint from "../components/DialogBoxForReprint"
import { useBluetoothPrint } from "../hooks/printables/useBluetoothPrint"
import useCalculations from "../hooks/useCalculations"
import SurfacePaper from "../components/SurfacePaper"
import useRecoveryAmount from "../hooks/api/useRecoveryAmount"
import DialogBox from "../components/DialogBox"
import InputPaper from "../components/InputPaper"
import MenuPaperWithoutRestriction from "../components/MenuPaperWithoutRestriction"
import SquircleBox from "../components/SquircleBox"
import useRecoveryUpdate from "../hooks/api/useRecoveryUpdate"
import { AppStoreContext } from "../models/custom_types"
import useCancelBill from "../hooks/api/useCancelBill"

function RecoveryAmountScreen() {
    const theme = usePaperColorScheme()
    const navigation = useNavigation()

    const loginStore = JSON.parse(loginStorage.getString("login-data"))

    const { receiptSettings } = useContext<AppStoreContext>(AppStore)
    const { rePrint, rePrintWithoutGst, printRecovery } = useBluetoothPrint()
    const {
        grandTotalCalculate,
        grandTotalWithGSTCalculate,
        grandTotalWithGSTInclCalculate,
    } = useCalculations()
    const { cancelBill } = useCancelBill()

    const [visible, setVisible] = useState(() => false)
    const hideDialog = () => setVisible(() => false)

    const [visibleDue, setVisibleDue] = useState(() => false)
    const hideDialogDue = () => setVisibleDue(() => false)

    const [currentReceiptNo, setCurrentReceiptNo] = useState<number | undefined>(
        () => undefined,
    )
    const [cancelledBillStatus, setCancelledBillStatus] = useState<"Y" | "N">()
    const [gstFlag, setGstFlag] = useState<"Y" | "N">()
    const [gstType, setGstType] = useState<"I" | "E">()
    const [discountType, setDiscountType] = useState<"P" | "A">()
    const [dueAmount, setDueAmount] = useState<number>()
    const [dueAmountMemory, setDueAmountMemory] = useState<number>()
    const [netAmt, setNetAmt] = useState<number>()

    const [billedSaleData, setBilledSaleData] = useState<ShowBillData[]>(() => [])
    const [fetchedBillsData, setFetchedBillsData] = useState<
        RecoveryAmountResponseData[]
    >(() => [])

    const [isLoading, setIsLoading] = useState(() => false)
    const [isDisabled, setIsDisabled] = useState(() => false)

    const [search, setSearch] = useState<string>(() => "")
    const onChangeSearch = (query: string) => {
        if (/^\d*$/.test(query)) {
            setSearch(query)
        }
    }

    const [checked, setChecked] = useState<string>(() => "C")
    let paymentModeOptionsArr = [
        { icon: "cash", title: "Cash", func: () => setChecked("C") },
        { icon: "credit-card-outline", title: "Card", func: () => setChecked("D") },
        { icon: "contactless-payment", title: "UPI", func: () => setChecked("U") },
        // { icon: "credit-card-clock-outline", title: "Credit", func: () => setChecked("R") },
    ]

    const { fetchBill } = useShowBill()
    // const { fetchSearchedBills } = useSearchBillsByMobile()
    const { fetchRecoveryAmountBills } = useRecoveryAmount()
    const { recoveryUpdate } = useRecoveryUpdate()

    const handleGetBills = async (mobile: string) => {
        setIsDisabled(true)
        setIsLoading(true)
        const reqCreds: RecoveryAmountCredentials = {
            comp_id: loginStore?.comp_id,
            br_id: loginStore?.br_id,
            phone_no: mobile,
        }

        console.log(
            "comp_id br_id phone_no",
            loginStore?.comp_id,
            loginStore?.br_id,
            mobile,
        )

        await fetchRecoveryAmountBills(reqCreds)
            .then(res => {
                if (res?.data?.length === 0) {
                    ToastAndroid.show("No bills found.", ToastAndroid.SHORT)
                    return
                }

                console.log("UUUUUUUUUUUUUUUUUUUUUU=================", res?.data)
                setFetchedBillsData(res?.data)
            })
            .catch(err => {
                ToastAndroid.show("Error during fetching bills...", ToastAndroid.SHORT)
                console.log("EEEEEEEEEEEERRRRRRRRRRRRRRRRRRRR", err)
            })

        setIsDisabled(false)
        setIsLoading(false)
    }

    const handleSearchClick = (mobile: string) => {
        if (!search || search.length !== 10) {
            ToastAndroid.show("Enter valid phone number.", ToastAndroid.SHORT)
            return
        }
        // setVisible(!visible)
        handleGetBills(mobile)
        // setCurrentReceiptNo(rcptNo)
        // setGstFlag(billedSaleData[0]?.gst_flag)
    }

    const handleGetBill = async (rcptNo: number) => {
        await fetchBill(rcptNo)
            .then(res => {
                setBilledSaleData(res?.data)
                setCancelledBillStatus(res?.cancel_flag)
            })
            .catch(err => {
                ToastAndroid.show("Error during fetching bills.", ToastAndroid.SHORT)
            })
    }

    const handleBillListClick = (rcptNo: number) => {
        setVisible(!visible)
        handleGetBill(rcptNo)
        setCurrentReceiptNo(rcptNo)
        setGstFlag(billedSaleData[0]?.gst_flag)
        setGstType(billedSaleData[0]?.gst_type)
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
        handleRePrintReceipt(false)
    }

    const handleRePrintReceipt = (cancelFlag: boolean) => {
        if (billedSaleData.length > 0) {
            gstFlag === "N"
                ? rePrintWithoutGst(
                    billedSaleData,
                    // netTotal,
                    billedSaleData[0]?.tprice,
                    // totalDiscount,
                    billedSaleData[0]?.tdiscount_amt,
                    billedSaleData[0]?.received_amt,
                    billedSaleData[0]?.received_amt !== undefined
                        ? billedSaleData[0]?.received_amt -
                        grandTotalCalculate(billedSaleData[0]?.tprice, billedSaleData[0]?.tdiscount_amt)
                        : 0,
                    billedSaleData[0]?.cust_name,
                    billedSaleData[0]?.phone_no,
                    billedSaleData[0]?.receipt_no,
                    billedSaleData[0]?.pay_mode,
                    false,
                    false,
                    cancelFlag,
                )
                : gstType === "E"
                    ? rePrint(
                        billedSaleData,
                        // netTotal,
                        billedSaleData[0]?.tprice,
                        // totalDiscount,
                        billedSaleData[0]?.tdiscount_amt,
                        billedSaleData[0]?.received_amt,
                        billedSaleData[0]?.received_amt !== undefined
                            ? billedSaleData[0]?.received_amt -
                            parseFloat(
                                grandTotalWithGSTCalculate(
                                    billedSaleData[0]?.tprice, billedSaleData[0]?.tdiscount_amt,
                                    billedSaleData[0]?.tcgst_amt * 2,
                                ),
                            )
                            : 0,
                        billedSaleData[0]?.cust_name,
                        billedSaleData[0]?.phone_no,
                        billedSaleData[0]?.receipt_no,
                        billedSaleData[0]?.pay_mode,
                        false,
                        false,
                        cancelFlag,
                    )
                    : rePrint(
                        billedSaleData,
                        // netTotal,
                        billedSaleData[0]?.tprice,
                        // totalDiscount,
                        billedSaleData[0]?.tdiscount_amt,
                        billedSaleData[0]?.received_amt,
                        billedSaleData[0]?.received_amt !== undefined
                            ? billedSaleData[0]?.received_amt -
                            parseFloat(
                                grandTotalWithGSTInclCalculate(billedSaleData[0]?.tprice, billedSaleData[0]?.tdiscount_amt),
                            )
                            : 0,
                        billedSaleData[0]?.cust_name,
                        billedSaleData[0]?.phone_no,
                        billedSaleData[0]?.receipt_no,
                        billedSaleData[0]?.pay_mode,
                        false,
                        false,
                        cancelFlag,
                    )
        } else {
            ToastAndroid.show("Something went wrong!", ToastAndroid.SHORT)
            return
        }
    }

    const handleDueClick = (dueAmt: number, rcptNo: number, netAmt?: number) => {
        setVisibleDue(!visibleDue)
        setDueAmount(dueAmt)
        setDueAmountMemory(dueAmt)
        setCurrentReceiptNo(rcptNo)
        setNetAmt(netAmt)
    }

    const onDialogDueSuccess = async () => {
        if (dueAmount > dueAmountMemory) {
            ToastAndroid.show("Please provide valid amount!", ToastAndroid.SHORT)
            return
        }

        const recoverUpdateCreds: RecoveryUpdateCredentials = {
            receipt_no: currentReceiptNo,
            received_amt: dueAmount,
            pay_mode: checked,
            user_id: loginStore?.user_id
        }

        await recoveryUpdate(recoverUpdateCreds)
            .then(res => {
                console.log("NEWWWW RESPONSE RCPT ID", res.recover_id)
                ToastAndroid.show("Amount Recovered Successfully!", ToastAndroid.SHORT)
                // printRecovery(res.recover_id, netAmt, dueAmount)

                setVisibleDue(!visibleDue)
                handleSearchClick(search)
            })
            .catch(err => {
                ToastAndroid.show("Something went wrong while recovering amount.", ToastAndroid.SHORT)
                console.log("EERRRRRRR", err)
            })
    }

    const handleCancellingBill = async (rcptNo: number) => {
        await cancelBill(rcptNo, loginStore.user_id).then(res => {
            if (res?.status === 1) {
                ToastAndroid.show(res?.data, ToastAndroid.SHORT)
                handleRePrintReceipt(true)
                setVisible(!visible)
            }
        }).catch(err => {
            ToastAndroid.show(`Error occurred during cancelling bill. ${err}`, ToastAndroid.SHORT)
            setVisible(!visible)
        })
    }

    const handleCancelBill = (rcptNo: number) => {
        Alert.alert(
            "Cancelling Bill",
            `Are you sure you want to cancel this bill?`,
            [
                { text: "BACK", onPress: () => null },
                { text: "CANCEL BILL", onPress: () => handleCancellingBill(rcptNo) },
            ],
            { cancelable: false },
        )
    }

    const headerStyle: ViewStyle = {
        backgroundColor: theme.colors.vanillaSecondaryContainer
    }

    const headerTextStyle: TextStyle = {
        color: theme.colors.onVanillaSecondaryContainer
    }

    const cellTextStyle1: TextStyle = {
        color: theme.colors.vanilla
    }

    const cellTextStyle2: TextStyle = {
        color: theme.colors.vanillaTertiary,
        backgroundColor: theme.colors.vanillaTertiaryContainer,
        minWidth: 50,
        borderRadius: 30,
        textAlign: "center",
        fontWeight: "bold"
    }

    const cellTextStyle3: TextStyle = {
        color: theme.colors.onErrorContainer,
        backgroundColor: theme.colors.errorContainer,
        minWidth: 50,
        borderRadius: 30,
        textAlign: "center",
        fontWeight: "bold"
    }

    let netTotal: number = 0
    let totalDiscount: number = 0

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView keyboardShouldPersistTaps="handled">
                <View style={{ alignItems: "center" }}>
                    <HeaderImage
                        imgLight={textureReport}
                        imgDark={textureReportDark}
                        borderRadius={30}
                        blur={10}
                        isBackEnabled>
                        Recovery Amount
                    </HeaderImage>
                </View>

                <View
                    style={{
                        paddingHorizontal: normalize(20),
                        paddingBottom: normalize(10),
                    }}>
                    <View
                        style={{
                            paddingHorizontal: normalize(10),
                            paddingBottom: normalize(10),
                        }}>
                        <Searchbar
                            autoFocus
                            // placeholder="Search Bills"
                            placeholder="Mobile Number"
                            onChangeText={onChangeSearch}
                            value={search}
                            elevation={search && 2}
                            keyboardType="numeric"
                            maxLength={10}
                            style={{
                                backgroundColor: theme.colors.vanillaSecondaryContainer,
                                color: theme.colors.onVanillaSecondaryContainer,
                            }}
                        // loading={search ? true : false}
                        />
                    </View>
                    {/* <ButtonPaper onPress={() => handleGetBillsByDate(formattedFromDate, formattedToDate)} mode="contained-tonal">
                        SUBMIT
                    </ButtonPaper> */}
                    <View
                        style={{
                            paddingHorizontal: normalize(10),
                        }}>
                        <ButtonPaper
                            onPress={() => handleSearchClick(search)}
                            mode="contained-tonal"
                            buttonColor={theme.colors.vanillaContainer}
                            loading={isLoading}
                            disabled={isDisabled}>
                            SUBMIT
                        </ButtonPaper>
                    </View>
                </View>

                <SurfacePaper backgroundColor={theme.colors.surface}>
                    <DataTable>
                        <DataTable.Header style={headerStyle}>
                            <DataTable.Title textStyle={headerTextStyle}>Rcpt. No.</DataTable.Title>
                            <DataTable.Title textStyle={headerTextStyle}>Date</DataTable.Title>
                            <DataTable.Title textStyle={headerTextStyle} numeric>Net Amt.</DataTable.Title>
                            <DataTable.Title textStyle={headerTextStyle} numeric>Due Amt.</DataTable.Title>
                            <DataTable.Title textStyle={headerTextStyle}>{""}</DataTable.Title>
                        </DataTable.Header>

                        {fetchedBillsData.map((item, i) => {
                            return (
                                <DataTable.Row key={i}>
                                    <DataTable.Cell textStyle={cellTextStyle1} onPress={() => handleBillListClick(item?.receipt_no)}>
                                        {item?.receipt_no?.toString()}
                                    </DataTable.Cell>
                                    <DataTable.Cell>
                                        {new Date(item?.trn_date).toLocaleDateString("en-GB")}
                                    </DataTable.Cell>
                                    <DataTable.Cell numeric>₹{item?.net_amt}</DataTable.Cell>
                                    <DataTable.Cell textStyle={cellTextStyle3} numeric>₹{item?.due_amt}</DataTable.Cell>
                                    <DataTable.Cell onPress={() => handleDueClick(item?.due_amt, item?.receipt_no, item?.net_amt)} textStyle={cellTextStyle2} numeric>
                                        Get
                                    </DataTable.Cell>
                                </DataTable.Row>
                            )
                        })}
                    </DataTable>
                </SurfacePaper>
            </ScrollView>


            <DialogBox
                hide={hideDialogDue}
                visible={visibleDue}
                btnSuccess="Submit"
                btnFail="Close"
                onSuccess={onDialogDueSuccess}
                onFailure={hideDialogDue}
            >
                <View>
                    <InputPaper label="Received Amount" onChangeText={(e: number) => setDueAmount(e)} value={dueAmount} keyboardType="numeric" selectTextOnFocus />
                </View>

                {/* <View
                    style={{
                        // width: 300,
                        // marginRight: 60
                    }}>
                    <List.Item
                        style={{ width: "100%" }}
                        title="Payment"
                        description={
                            checked === "C"
                                ? "Cash"
                                : checked === "D"
                                    ? "Card"
                                    : checked === "U"
                                        ? "UPI"
                                        : "Error Occurred"
                        }
                        left={props => <List.Icon {...props} icon="contactless-payment-circle-outline" />}
                        right={props => {
                            return <MenuPaperWithoutRestriction menuArrOfObjects={paymentModeOptionsArr} customStyle={{ backgroundColor: theme.colors.surface }} textColor={theme.colors.onSurface} />
                        }}
                        descriptionStyle={{
                            color: theme.colors.purple,
                        }}
                    />
                </View> */}
                {receiptSettings?.pay_mode === "Y" && (
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginRight: normalize(15),
                            // marginLeft: normalize(4),
                            marginVertical: normalize(10),
                            flexWrap: "wrap"
                        }}>
                        <RadioButton
                            value="C"
                            status={checked === "C" ? "checked" : "unchecked"}
                            color={theme.colors.onTertiaryContainer}
                            onPress={() => setChecked("C")}
                        />
                        <Text
                            variant="labelLarge"
                            style={
                                checked === "C" && {
                                    color: theme.colors.onTertiaryContainer,
                                }
                            }>
                            Cash
                        </Text>
                        <RadioButton
                            value="D"
                            status={checked === "D" ? "checked" : "unchecked"}
                            color={theme.colors.onTertiaryContainer}
                            onPress={() => setChecked("D")}
                        />
                        <Text
                            variant="labelLarge"
                            style={
                                checked === "D" && {
                                    color: theme.colors.onTertiaryContainer,
                                }
                            }>
                            Card
                        </Text>
                        <RadioButton
                            value="U"
                            status={checked === "U" ? "checked" : "unchecked"}
                            color={theme.colors.onTertiaryContainer}
                            onPress={() => setChecked("U")}
                        />
                        <Text
                            variant="labelLarge"
                            style={
                                checked === "U" && {
                                    color: theme.colors.onTertiaryContainer,
                                }
                            }>
                            UPI
                        </Text>
                    </View>
                )}
            </DialogBox>




            {/* <DialogBoxForReprint
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
                        {currentReceiptNo}
                    </Text>
                    <Text
                        style={{ textAlign: "center", color: theme.colors.secondary }}
                        variant="bodyLarge">
                        {new Date(billedSaleData[0]?.created_dt).toLocaleString("en-GB")}
                    </Text>
                    <View
                        style={{
                            borderWidth: 1,
                            borderStyle: "dashed",
                            width: "80%",
                            borderColor: theme.colors.secondary,
                            alignSelf: "center",
                        }}></View>
                    {billedSaleData[0]?.cust_name && (
                        <Text
                            style={{ textAlign: "center", color: theme.colors.primary }}
                            variant="bodyLarge">
                            {billedSaleData[0]?.cust_name}
                        </Text>
                    )}
                    <Text
                        style={{ textAlign: "center", color: theme.colors.secondary }}
                        variant="bodyLarge">
                        {billedSaleData[0]?.phone_no}
                    </Text>
                </View>
                <ScrollableListContainer
                    backgroundColor={theme.colors.surfaceVariant}
                    height={250}
                    width={300}>
                    {billedSaleData?.map((item, i) => {
                        netTotal += item.price * item.qty

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
                    backgroundColor={theme.colors.vanillaContainer}
                    textColor={theme.colors.onVanillaContainer}
                    addedProductsList={billedSaleData}
                    netTotal={netTotal}
                    totalDiscount={totalDiscount}
                    disabled
                />
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
                        textColor={theme.colors.primary}>
                        Reprint
                    </ButtonPaper>
                </View>
            </DialogBoxForReprint> */}

            <DialogBoxForReprint
                iconSize={30}
                visible={visible}
                hide={hideDialog}
                titleStyle={styles.title}

                currentReceiptNo={currentReceiptNo}
                billedSaleData={billedSaleData}
                handleCancelBill={handleCancelBill}
                cancelledBillStatus={cancelledBillStatus}

                onDialogFailure={onDialogFailure}
                onDialogSuccecss={onDialogSuccecss}
            />


        </SafeAreaView>
    )
}

export default RecoveryAmountScreen

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
    },

    title: {
        textAlign: "center",
    },
})
