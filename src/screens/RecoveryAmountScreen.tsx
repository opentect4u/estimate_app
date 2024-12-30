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
import { IconButton, RadioButton, Searchbar, Text } from "react-native-paper"
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
import { Dropdown } from 'react-native-element-dropdown'
import useFetchCreditCustomers from "../hooks/api/useFetchCreditCustomers"

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

    const [custData, setCustData] = useState(() => [])

    const { fetchRecoveryDetails } = useRecoveryAmount()
    const { recoveryUpdate } = useRecoveryUpdate()
    const { fetchCreditCustomers } = useFetchCreditCustomers()


    const getCreditCustomer = async () => {
        const creds = {
            comp_id: loginStore?.comp_id,
        }

        await fetchCreditCustomers(creds).then(res => {
            console.log("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM", res?.data)
            setCustData(res?.data?.map((item, i) => (
                { label: `${item?.cust_name}\n${item?.phone_no}`, value: `${item?.phone_no}` }
            )))
        }).catch(err => {
            console.log("ERRRRRRRRRRRRRRRRRRRR", err)
        })
    }

    useEffect(() => {
        getCreditCustomer()
    }, [])

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
        if (!value || value.length !== 10) {
            ToastAndroid.show("Choose valid phone number.", ToastAndroid.SHORT)
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
            phone_no: value,
            received_amt: dueAmount,
            pay_mode: checked,
            user_id: loginStore?.user_id,

            ///////////////////////////////////////////

            customer_mobile: value || "",
            pay_txn_id: "",
            pay_amount: 0,
            pay_amount_original: 0,
            currency_code: "",
            payment_mode: "",
            pay_status: "",
            receipt_url: "",
        }

        await recoveryUpdate(recoverUpdateCreds)
            .then(async res => {
                // console.log("NEWWWW RESPONSE RCPT ID", res.recover_id)
                ToastAndroid.show("Amount Recovered Successfully!", ToastAndroid.SHORT)
                // printRecovery(res.recover_id, netAmt, dueAmount)

                setDueAmount(() => 0)
                await handleSearchClick(value)
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

    const handlePrint = async () => {
        await printRecoveryAmount(recoveryDetailsData, value)
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

    const [value, setValue] = useState("")

    // const data = [
    //     { label: 'Soumyadeep Mondal\n8910792003', value: '8910792003' },
    //     { label: 'Rupsha Chatterjee\n6295825458', value: '6295825458' },
    //     { label: 'Somnath Thakur\n7563884733', value: '7563884733' },
    //     { label: 'Shubham Samanta\n4344244533', value: '4344244533' },
    //     { label: 'Item 5', value: '5' },
    //     { label: 'Item 6', value: '6' },
    //     { label: 'Item 7', value: '7' },
    //     { label: 'Item 8', value: '8' },
    // ]

    // const data = 

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
                        isBackEnabled
                        showProductSearch={false}>
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
                        {/* <Searchbar
                            autoFocus
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
                        loading={search ? true : false}
                        /> */}

                        <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={custData}
                            search
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Customer"
                            searchPlaceholder="Search..."
                            value={value}
                            onChange={item => {
                                setValue(item.value);
                            }}
                            renderLeftIcon={() => (
                                <IconButton icon={"account-outline"} />
                            )}
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
                            onPress={() => handleSearchClick(value)}
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
                                {/* <RadioButton
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
                                </Text> */}
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
                                {/* <RadioButton
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
                                </Text> */}
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

    dropdown: {
        margin: 16,
        height: 50,
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
    },
    icon: {
        marginRight: 5,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },

})
