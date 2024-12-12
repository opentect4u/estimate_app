import { StyleSheet, ScrollView, SafeAreaView, View, TextStyle, ViewStyle, TextInput, Alert, ToastAndroid, Dimensions } from "react-native"
import React, { useRef, useState } from 'react'
import normalize from "react-native-normalize"
import HeaderImage from "../components/HeaderImage"
import { mapBillToCalculatorSaleCreds } from "../utils/mapBillToCalculatorSaleCreds"
import useCalculatorSaleInsert from "../hooks/api/useCalculatorSaleInsert"
import { useBluetoothPrint } from "../hooks/printables/useBluetoothPrint"
import { textureBill, textureBillDark } from "../resources/images"
import { usePaperColorScheme } from "../theme/theme"
import { useNavigation } from "@react-navigation/native"
import { IconButton, Text, TouchableRipple } from "react-native-paper"
import { clearStates } from "../utils/clearStates"
import ButtonPaper from "../components/ButtonPaper"
import { Bill } from "../models/custom_types"
import { CalculatorSaleInsertCredentials, LoginDataMessage } from "../models/api_types"
import useCalculations from "../hooks/useCalculations"
import { loginStorage } from "../storage/appStorage"


const { width } = Dimensions.get('window')
const fontSize = width * 0.035

function CalculateModeBillScreen() {
    const qtyRef = useRef(null)

    const navigation = useNavigation()
    const theme = usePaperColorScheme()

    const { roundingOffCalculate } = useCalculations()
    const { printBillCalculateMode } = useBluetoothPrint()
    const { calcSendSaleDetails } = useCalculatorSaleInsert()

    const [qty, setQty] = useState<string>()
    const [price, setPrice] = useState<string>()
    const [billArray, setBillArray] = useState<Bill[]>(() => [])

    let receiptNumber: number | undefined = undefined

    const addBillSection: ViewStyle = {
        // marginTop: 10,
        flexDirection: "row",
        justifyContent: "space-around",
        width: "90%",
        alignItems: "center",
        alignSelf: "center",
        marginHorizontal: normalize(25),
        padding: normalize(10),
        flexWrap: "wrap",
        borderColor: theme.colors.primaryContainer,
        backgroundColor: theme.colors.primaryContainer,
        // borderStyle: "dashed",
        borderWidth: 3,
        borderRadius: normalize(100),
        bottom: normalize(6),
        paddingRight: normalize(5)
    }

    const handleAddBills = () => {
        if (+qty > 0 && +price > 0) {
            const newBill: Bill = {
                id: billArray.length + 1,
                qty: +qty,
                price: +price,
                total: parseFloat((+qty * +price)?.toFixed(2))
            }

            setBillArray((prevBills) => [...prevBills, newBill])
            if (qtyRef.current) {
                qtyRef.current.focus()
            }
        }

        clearStates([setQty, setPrice], () => "")
    }

    const handleRemoveBill = (bill: Bill) => {
        Alert.alert("Remove", `Are you sure you want to remove ${bill?.id}?`, [
            { "text": "Yes", onPress: () => setBillArray(billArray?.filter(item => item?.id !== bill?.id)) },
            { "text": "No", onPress: () => null },
        ])
    }

    // const handleEditBill = (bill: Bill) => {
    //     setQty(bill?.qty?.toString())
    //     setPrice(bill?.price?.toString())
    //     setBillArray(billArray?.filter(item => item?.id !== bill?.id))
    // }

    const handleReset = () => {
        Alert.alert("Reset", `Are you sure you want to reset this bill?`, [
            {
                "text": "Yes", onPress: () => {
                    setBillArray(() => [])
                    clearStates([setQty, setPrice], () => "")
                }
            },
            { "text": "No", onPress: () => null },
        ])
    }

    const sendSaleDetails = async () => {
        const loginStore = JSON.parse(loginStorage.getString("login-data")) as LoginDataMessage

        const compId = loginStore?.comp_id
        const branchId = loginStore.br_id
        const createdBy = loginStore.user_id

        const saleData: CalculatorSaleInsertCredentials[] = billArray?.map(bill => mapBillToCalculatorSaleCreds(
            compId,
            branchId,
            createdBy,
            bill,
            totalPrice,
            parseFloat(roundingOffCalculate(totalPrice, 0)),
            parseFloat((totalPrice + parseFloat(roundingOffCalculate(totalPrice, 0)))?.toFixed(2))
        ))

        const res = await calcSendSaleDetails(saleData)
        receiptNumber = res?.data?.data
    }

    const handlePrint = (totalQty: number, totalPrice: number) => {
        sendSaleDetails().then(() => {
            printBillCalculateMode(receiptNumber, billArray, totalQty, totalPrice).then(() => {
                setBillArray(() => [])
                clearStates([setQty, setPrice], () => "")
                ToastAndroid.show("Bill printed successfully.", ToastAndroid.SHORT)
            }).catch(err => {
                ToastAndroid.show("Error while printing Calculated Bill.", ToastAndroid.SHORT)
            })
        }).catch(err => {
            ToastAndroid.show("Some error while sending sale details in Calculator Mode!", ToastAndroid.SHORT)
        })

    }

    let totalQty: number = 0
    let totalPrice: number = 0
    // let netTotal: number = 0

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView keyboardShouldPersistTaps="handled">
                <View style={{ alignItems: "center" }}>
                    <HeaderImage
                        imgLight={textureBill}
                        imgDark={textureBillDark}
                        isBackEnabled
                        borderRadius={30}
                        blur={10}>
                        Calculate Bill
                    </HeaderImage>
                </View>

                <View style={addBillSection}>
                    <TextInput ref={qtyRef} placeholder="Qty." onChangeText={(q: string) => setQty(q)} value={qty} keyboardType="numeric" clearTextOnFocus maxLength={4} autoFocus style={{
                        backgroundColor: theme.colors.surface,
                        width: "20%",
                        borderRadius: normalize(15),
                        borderTopLeftRadius: normalize(50),
                        borderBottomLeftRadius: normalize(50),
                        fontFamily: "ProductSans-Medium",
                        fontSize: normalize(18),
                        fontWeight: "700",
                        padding: normalize(10),
                        color: theme.colors.onSurface
                    }} placeholderTextColor={theme.colors.onSurface} cursorColor={theme.colors.onSurface} />

                    <Text variant="displaySmall">×</Text>

                    <TextInput placeholder="Price" onChangeText={(p: string) => setPrice(p)} value={price} keyboardType="numeric" clearTextOnFocus maxLength={6} style={{
                        backgroundColor: theme.colors.surface,
                        width: "20%",
                        borderRadius: normalize(13),
                        fontFamily: "ProductSans-Medium",
                        fontSize: normalize(18),
                        fontWeight: "700",
                        padding: normalize(10),
                        color: theme.colors.onSurface
                    }} placeholderTextColor={theme.colors.onSurface} cursorColor={theme.colors.onSurface} />

                    <Text variant="displaySmall">=</Text>

                    <Text variant="headlineLarge" >₹{parseFloat((+qty * +price)?.toFixed(2)) || 0}</Text>

                    <IconButton icon="arrow-bottom-right" size={30} mode="contained" style={{
                        backgroundColor: theme.colors.primary,
                        borderRadius: normalize(15),
                        borderBottomRightRadius: normalize(50),
                        borderTopRightRadius: normalize(50),
                    }} iconColor={theme.colors.onPrimary} onPress={handleAddBills} />
                </View>

                {
                    billArray?.length > 0
                    && <>
                        <View style={{
                            justifyContent: "center",
                            alignSelf: "center",
                        }}>
                            <View><Text style={styles.equalStyle}>========================================</Text></View>
                            <View style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                            }}>
                                <Text>S NO.</Text>
                                <Text>QTY</Text>
                                <Text>RATE</Text>
                                <Text>AMOUNT</Text>
                                <Text>ACTION</Text>
                            </View>
                            <View><Text style={styles.equalStyle}>========================================</Text></View>
                            {billArray.map((bill, i) => {
                                totalQty += bill?.qty
                                totalPrice += bill?.total
                                return (
                                    <View style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: 2
                                    }} key={i}>
                                        <>
                                            <Text>{bill?.id}.</Text>
                                            <Text>{bill?.qty}</Text>
                                            <Text>{bill?.price}</Text>
                                            <Text>{bill?.total}</Text>
                                            <Text><IconButton icon="trash-can-outline" iconColor={theme.colors.error} onPress={() => handleRemoveBill(bill)} /></Text>
                                        </>
                                    </View>
                                )
                            })}
                            <View><Text style={styles.equalStyle}>========================================</Text></View>
                            <View style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                            }}>
                                <Text>ITEMS: {billArray?.length}</Text>
                                <Text>QTY: {totalQty}</Text>
                                <Text>TOTAL: ₹{totalPrice?.toFixed(2)}</Text>
                            </View>
                            <View><Text style={styles.equalStyle}>========================================</Text></View>
                            <View style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                            }}>
                                <Text>NET TOTAL: ₹{(totalPrice + parseFloat(roundingOffCalculate(totalPrice, 0)))?.toFixed(2)}</Text>
                                <Text>ROUND OFF: {roundingOffCalculate(totalPrice, 0)}</Text>
                            </View>
                            <View><Text style={styles.equalStyle}>========================================</Text></View>
                        </View>

                        {/* <CalculateModeBill
                            isActionEnabled={true}
                            billArray={billArray}
                        /> */}

                        <View style={{
                            marginTop: 15,
                            marginBottom: 15,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-around"
                        }}>
                            <ButtonPaper mode="outlined" onPress={handleReset} style={{
                                alignSelf: "center",
                            }} textColor={theme.colors.error}>Reset</ButtonPaper>

                            <ButtonPaper mode="contained" onPress={() => handlePrint(totalQty, totalPrice)} style={{
                                alignSelf: "center"
                            }} icon="cloud-print-outline">Save/Print</ButtonPaper>
                        </View>
                    </>
                }

            </ScrollView>
        </SafeAreaView>
    )
}

export default CalculateModeBillScreen

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        // height: SCREEN_HEIGHT
    },
    title: {
        textAlign: "center",
    },
    billItem: {
        margin: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
    },
    equalStyle: {
        textAlign: "center",
        fontSize: fontSize,
    }
})
