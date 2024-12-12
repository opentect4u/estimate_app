import { Dimensions, StyleSheet, View } from 'react-native'
import React from 'react'
import normalize from 'react-native-normalize'
import { Text } from 'react-native-paper'
import { CalculatorShowBillData } from '../models/api_types'

type CalculateModeBillProps = {
    isActionEnabled?: boolean
    billArray: CalculatorShowBillData[]
}

const { width } = Dimensions.get('window')
const fontSize = width * 0.035

const CalculateModeBill = ({ isActionEnabled = false, billArray }: CalculateModeBillProps) => {
    let totalQty = 0

    return (
        <View style={{
            justifyContent: "center",
            alignSelf: "center",
            padding: normalize(15)
        }}>
            <View><Text style={styles.dividerEqual}>==================================</Text></View>
            <View style={{
                flexDirection: "row",
                justifyContent: "space-between",

            }}>
                <Text>S NO.</Text>
                <Text>QTY</Text>
                <Text>RATE</Text>
                <Text>AMOUNT</Text>
            </View>
            <View><Text style={styles.dividerEqual}>==================================</Text></View>
            {billArray.map((bill, i) => {
                totalQty += bill?.qty
                return (
                    <View style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: 2
                    }} key={i}>
                        <Text>{i + 1}.</Text>
                        <Text>{bill?.qty}</Text>
                        <Text>{bill?.price}</Text>
                        <Text>{(bill?.qty * bill?.price)?.toFixed(2)}</Text>
                    </View>
                )
            })}
            <View><Text style={styles.dividerEqual}>==================================</Text></View>
            <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
            }}>
                <Text>ITEMS: {billArray?.length}</Text>
                <Text>QTY: {totalQty}</Text>
                <Text>TOTAL: ₹{billArray[0]?.tprice}</Text>
            </View>
            <View><Text style={styles.dividerEqual}>==================================</Text></View>
            <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
            }}>
                <Text>NET TOTAL: ₹{billArray[0]?.net_amt}</Text>
                <Text>ROUNDING OFF: {billArray[0]?.round_off}</Text>
            </View>
            <View><Text style={styles.dividerEqual}>==================================</Text></View>
        </View>
    )
}

export default CalculateModeBill

const styles = StyleSheet.create({
    dividerEqual: {
        textAlign: "center",
        fontSize: fontSize,
    }
})