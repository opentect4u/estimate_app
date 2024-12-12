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
import { RadioButton, Searchbar, Text } from "react-native-paper"
import HeaderImage from "../components/HeaderImage"
import {
    textureReport,
    textureReportDark,
} from "../resources/images"
import { usePaperColorScheme } from "../theme/theme"
import { useNavigation } from "@react-navigation/native"
import ButtonPaper from "../components/ButtonPaper"
import normalize, { SCREEN_HEIGHT } from "react-native-normalize"
import useShowBill from "../hooks/api/useShowBill"
import {
    RecoveryAmountCredentials,
    RecoveryAmountResponseData,
    RecoveryUpdateCredentials,
    ShowBillData,
} from "../models/api_types"
import { ezetapStorage, loginStorage } from "../storage/appStorage"
import { AppStore } from "../context/AppContext"
import { useBluetoothPrint } from "../hooks/printables/useBluetoothPrint"
import useCalculations from "../hooks/useCalculations"
import SurfacePaper from "../components/SurfacePaper"
import useRecoveryAmount from "../hooks/api/useRecoveryAmount"
import InputPaper from "../components/InputPaper"
import useRecoveryUpdate from "../hooks/api/useRecoveryUpdate"
import { AppStoreContext } from "../models/custom_types"
import useCancelBill from "../hooks/api/useCancelBill"
import RNEzetapSdk from "react-native-ezetap-sdk"

function RecoveryAmountScreen() {
    const theme = usePaperColorScheme()
    const navigation = useNavigation()

    const loginStore = JSON.parse(loginStorage.getString("login-data"))

    const { receiptSettings } = useContext<AppStoreContext>(AppStore)
    const { printRecoveryAmount } = useBluetoothPrint()

    const [dueAmount, setDueAmount] = useState<number>()

    const [recoveryDetailsData, setRecoveryDetailsData] = useState<
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

    const { fetchRecoveryDetails } = useRecoveryAmount()
    const { recoveryUpdate } = useRecoveryUpdate()

    const handleGetDetails = async (mobile: string) => {
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

        await fetchRecoveryDetails(reqCreds)
            .then(res => {
                if (res?.data?.length === 0) {
                    ToastAndroid.show("No Due found.", ToastAndroid.SHORT)
                    return
                }

                console.log("UUUUUUUUUUUUUUUUUUUUUU=================", res?.data)
                setRecoveryDetailsData(res?.data)
            })
            .catch(err => {
                ToastAndroid.show("Error during fetching bills...", ToastAndroid.SHORT)
                console.log("EEEEEEEEEEEERRRRRRRRRRRRRRRRRRRR", err)
            })

        setIsDisabled(false)
        setIsLoading(false)
    }

    const handleSearchClick = async (mobile: string) => {
        if (!search || search.length !== 10) {
            ToastAndroid.show("Enter valid phone number.", ToastAndroid.SHORT)
            return
        }
        // setVisible(!visible)
        await handleGetDetails(mobile)
        // setCurrentReceiptNo(rcptNo)
        // setGstFlag(billedSaleData[0]?.gst_flag)
    }

    // const handleDueClick = (dueAmt: number, netAmt?: number) => {
    //     setVisibleDue(!visibleDue)
    //     setDueAmount(dueAmt)
    //     setDueAmountMemory(dueAmt)
    //     setNetAmt(netAmt)
    // }

    const getDueAmount = async (tnxResponse?: string) => {
        if ((dueAmount > (recoveryDetailsData[0]?.net_amt - recoveryDetailsData[0]?.paid_amt) || dueAmount === 0)) {
            ToastAndroid.show("Please provide valid amount!", ToastAndroid.SHORT)
            return
        }

        const recoverUpdateCreds: RecoveryUpdateCredentials = {
            comp_id: loginStore?.comp_id,
            br_id: loginStore?.br_id,
            phone_no: search,
            received_amt: dueAmount,
            pay_mode: checked,
            user_id: loginStore?.user_id,

            ///////////////////////////////////////////

            customer_mobile: search || "",
            pay_txn_id: JSON.parse(tnxResponse)?.pay_txn_id || "",
            pay_amount: JSON.parse(tnxResponse)?.pay_amount || 0,
            pay_amount_original: JSON.parse(tnxResponse)?.pay_amount_original || 0,
            currency_code: JSON.parse(tnxResponse)?.currency_code || "",
            payment_mode: JSON.parse(tnxResponse)?.payment_mode || "",
            pay_status: JSON.parse(tnxResponse)?.pay_status || "",
            receipt_url: JSON.parse(tnxResponse)?.receipt_url || "",
        }

        await recoveryUpdate(recoverUpdateCreds)
            .then(async res => {
                // console.log("NEWWWW RESPONSE RCPT ID", res.recover_id)
                ToastAndroid.show("Amount Recovered Successfully!", ToastAndroid.SHORT)
                // printRecovery(res.recover_id, netAmt, dueAmount)

                setDueAmount(() => 0)
                await handleSearchClick(search)
            })
            .catch(err => {
                ToastAndroid.show("Something went wrong while recovering amount.", ToastAndroid.SHORT)
                console.log("EERRRRRRR", err)
            })
    }

    const handleGetDueAmount = () => {
        Alert.alert("Recover amount?", `Are you sure you want to recover ${dueAmount} ruppees?`, [
            { text: "Cancel", onPress: () => null },
            { text: "Yes", onPress: async () => await getDueAmount() }
        ])
    }



    ///////////////////////////////////////////////
    ///////////////////////////////////////////////


    var tnxResponse

    const handleRazorpayClient = async () => {
        let json = {
            username: "9903044748",
            amount: +dueAmount,
            externalRefNumber: "",
        }

        // Convert json object to string
        let jsonString = JSON.stringify(json)

        // await RNEzetapSdk.initialize(jsonString)
        //   .then(res => {
        //     console.log(">>>>>>>>>>>>>>>>>", res)
        //   })
        //   .catch(err => {
        //     console.log("<<<<<<<<<<<<<<<<<", err)
        //   })

        // var res = await RNEzetapSdk.prepareDevice()
        // console.log("RAZORPAY===PREPARE DEVICE", res)

        await RNEzetapSdk.pay(jsonString)
            .then(res => {
                console.log(">>>>>>>>>>>>>>>>>", res)

                // if (res?.status == "success") {
                //   handleSave()
                //   Alert.alert("Txn ID", res?.txnId)
                // } else {
                //   Alert.alert("Error in Tnx", res?.error)
                // }
                tnxResponse = res
                // setTnxResponse(res)
            })
            .catch(err => {
                console.log("<<<<<<<<<<<<<<<<<", err)
            })
    }

    const initializePaymentRequest = async () => {
        // var withAppKey =
        //   '{"userName":' +
        //   "9903044748" +
        //   ',"demoAppKey":"a40c761a-b664-4bc6-ab5a-bf073aa797d5","prodAppKey":"a40c761a-b664-4bc6-ab5a-bf073aa797d5","merchantName":"SYNERGIC_SOFTEK_SOLUTIONS","appMode":"DEMO","currencyCode":"INR","captureSignature":false,"prepareDevice":false}'
        // var response = await RNEzetapSdk.initialize(withAppKey)
        // console.log(response)
        // var jsonData = JSON.parse(response)

        let razorpayInitializationJson = JSON.parse(
            ezetapStorage.getString("ezetap-initialization-json"),
        )

        console.log("MMMMMMSSSSSSSSSSSS", razorpayInitializationJson)

        if (razorpayInitializationJson.status == "success") {
            await handleRazorpayClient()
                .then(async res => {
                    console.log("###################", res)
                    // var res = await RNEzetapSdk.close()
                    // console.log("CLOSEEEEE TNXXXXX", res)
                    // var json = JSON.parse(res)
                })
                .catch(err => {
                    console.log("==================", err)
                })
        } else {
            console.log("XXXXXXXXXXXXXXXXXXX ELSE PART")
        }
    }

    const handleSaveRecoveryUPI = async () => {
        await initializePaymentRequest()
            .then(async () => {
                console.log(
                    "TRANSACTION RES DATA================",
                    tnxResponse,
                )
                if (JSON.parse(tnxResponse)?.status === "success") {

                    await getDueAmount(tnxResponse)
                    // await handlePrintReceipt(flag)

                    // const creds: TxnDetailsCreds = {
                    //   receipt_no: receiptNumber?.toString(),
                    //   pay_txn_id: JSON.parse(tnxResponse)?.result?.txn?.txnId,
                    //   pay_amount: +JSON.parse(tnxResponse)?.result?.txn?.amount,
                    //   pay_amount_original: +JSON.parse(tnxResponse)?.result?.txn?.amountOriginal,
                    //   currency_code: JSON.parse(tnxResponse)?.result?.txn?.currencyCode,
                    //   payment_mode: JSON.parse(tnxResponse)?.result?.txn?.paymentMode,
                    //   pay_status: JSON.parse(tnxResponse)?.result?.txn?.status,
                    //   receipt_url: JSON.parse(tnxResponse)?.result?.receipt?.receiptUrl,
                    //   created_by: loginStore?.user_id
                    // }

                    // console.log("::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::", creds)

                    // await sendTxnDetails(creds).then(res => {
                    //   console.log("Txn details sent done.", res)
                    // }).catch(err => {
                    //   console.log("Txn send failed.", err)
                    // })

                } else {
                    console.log("tnxResponse value error...")
                }
            })
            .catch(err => {
                console.error("TNX Response Error!", err)

                //   console.log(
                //     "PPPPPPPPPPPPKKKKKKKKKKKKK",
                //     ezetapStorage.contains("ezetap-initialization-json"),
                //     ezetapStorage.getString("ezetap-initialization-json"),
                //   )
            })
    }

    const handleGetDueAmountUPI = () => {
        Alert.alert("Recover amount?", `Are you sure you want to recover ${dueAmount} ruppees?`, [
            { text: "Cancel", onPress: () => null },
            { text: "Yes", onPress: async () => await handleSaveRecoveryUPI() }
        ])
    }

    const handlePrint = async () => {
        await printRecoveryAmount(recoveryDetailsData, search)
    }

    const cellTextStyle2: TextStyle = {
        color: theme.colors.vanillaTertiary,
        backgroundColor: theme.colors.vanillaTertiaryContainer,
        minWidth: 50,
        borderRadius: 10,
        textAlign: "center",
        fontWeight: "bold",
        padding: 5
    }

    const cellTextStyle3: TextStyle = {
        color: theme.colors.onErrorContainer,
        backgroundColor: theme.colors.errorContainer,
        minWidth: 50,
        borderRadius: 10,
        textAlign: "center",
        fontWeight: "bold",
        padding: 5
    }

    const cellTextStyle4: TextStyle = {
        color: theme.colors.onPrimaryContainer,
        backgroundColor: theme.colors.primaryContainer,
        minWidth: 50,
        borderRadius: 10,
        textAlign: "center",
        fontWeight: "bold",
        padding: 5
    }

    const ViewTextStyle: ViewStyle = {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        padding: 5,
        alignItems: "center",
        borderWidth: 2,
        borderColor: theme.colors.vanilla,
        borderStyle: "dotted",
        borderRadius: 10,
    }

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
                            selectionColor={theme.colors.vanilla}
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

                {recoveryDetailsData?.length > 0
                    &&
                    (recoveryDetailsData[0]?.net_amt > recoveryDetailsData[0]?.paid_amt)
                    && <SurfacePaper backgroundColor={theme.colors.vanillaSurfaceLow} elevation={1} borderRadiusEnabled smallWidthEnabled style={{
                        padding: normalize(15),
                        height: "auto",
                        minHeight: SCREEN_HEIGHT / 3,
                        justifyContent: 'space-evenly',
                        gap: 5
                        // borderWidth: 2,
                        // borderStyle: "dashed",
                        // borderColor: theme.colors.vanilla
                    }}>
                        {/* <View style={ViewTextStyle}>
                            <Text variant="titleLarge">TOTAL NET</Text>
                            <Text variant="titleLarge" style={{ textAlign: "center" }}>:</Text>
                            <Text variant="titleLarge" style={cellTextStyle2}>₹{recoveryDetailsData[0]?.net_amt}</Text>
                        </View> */}
                        <View style={ViewTextStyle}>
                            <Text variant="titleLarge">TOTAL PAID</Text>
                            <Text variant="titleLarge" style={{ textAlign: "center" }}>:</Text>
                            <Text variant="titleLarge" style={cellTextStyle4}>₹{recoveryDetailsData[0]?.paid_amt}</Text>
                        </View>
                        <View style={ViewTextStyle}>
                            <Text variant="titleLarge">TOTAL DUE</Text>
                            <Text variant="titleLarge" style={{ textAlign: "center" }}>:</Text>
                            <Text variant="titleLarge" style={cellTextStyle3}>₹{recoveryDetailsData[0]?.net_amt - recoveryDetailsData[0]?.paid_amt}</Text>
                        </View>

                        {receiptSettings?.pay_mode === "Y" && (
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-around",
                                    alignItems: "center",
                                    width: "100%",
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
                                {/* <RadioButton
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
                                </Text> */}
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

                        <View style={{
                            width: "100%",
                            marginBottom: normalize(5)
                        }}>
                            <InputPaper
                                label="Received Amount"
                                onChangeText={(e: number) => setDueAmount(e)} value={dueAmount} keyboardType="numeric"
                                customStyle={{
                                    backgroundColor: theme.colors.vanillaSurfaceLow
                                }}
                                selectTextOnFocus
                                clearTextOnFocus
                            />
                        </View>

                        <View style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            gap: 10
                        }}>
                            {checked === "C" ?
                                <ButtonPaper
                                    onPress={handleGetDueAmount}
                                    mode="elevated"
                                    textColor={theme.colors.vanilla}
                                    icon={"arrow-u-down-left"}
                                    style={{
                                        backgroundColor: theme.colors.vanillaSurface
                                    }}
                                    disabled={!dueAmount}>
                                    Get Due Amount
                                </ButtonPaper>
                                : checked === "U" ? <ButtonPaper
                                    onPress={handleGetDueAmountUPI}
                                    mode="elevated"
                                    textColor={theme.colors.vanilla}
                                    icon={"arrow-u-down-left"}
                                    style={{
                                        backgroundColor: theme.colors.vanillaSurface
                                    }}
                                    disabled={!dueAmount}>
                                    Get Due Amount
                                </ButtonPaper>
                                    : <Text>No proper checked flag got. Contact to developer.</Text>
                            }
                            <ButtonPaper
                                onPress={handlePrint}
                                mode="elevated"
                                textColor={theme.colors.vanilla}
                                icon={"cloud-print-outline"}
                                style={{
                                    backgroundColor: theme.colors.vanillaSurface
                                }}>
                                Print
                            </ButtonPaper>
                        </View>

                    </SurfacePaper>
                }
            </ScrollView>

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
