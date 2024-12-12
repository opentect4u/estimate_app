import { StyleSheet, ToastAndroid, View } from 'react-native'
import React from 'react'
import Clipboard from "@react-native-clipboard/clipboard"
import { Dialog, IconButton, Portal, Text, TouchableRipple } from "react-native-paper"
import normalize, { SCREEN_HEIGHT } from "react-native-normalize"
import { usePaperColorScheme } from "../theme/theme"
import ScrollableListContainer from "./ScrollableListContainer"
import ButtonPaper from './ButtonPaper'
import { CalculatorShowBillData } from '../models/api_types'
import CalculateModeBill from './CalculateModeBill'

type DialogForBillsInCalculatorModeProps = {
    visible: boolean
    hide: () => void
    currentReceiptNumber?: number
    showCalculatedBillData: CalculatorShowBillData[]
    onDialogFailure?: () => void
    onDialogSuccecss?: () => void
}

const DialogForBillsInCalculatorMode = ({
    visible,
    hide,
    currentReceiptNumber = 0,
    showCalculatedBillData,
    onDialogFailure,
    onDialogSuccecss
}: DialogForBillsInCalculatorModeProps) => {
    const theme = usePaperColorScheme()

    const copyToClipboard = (value: string) => {
        Clipboard.setString(value)
        ToastAndroid.show(`Copied: ${value}`, ToastAndroid.SHORT)
    }

    let totalQty: number = 0
    // let totalPrice: number = 0
    // let netTotal: number = 0

    return (
        <Portal>
            <Dialog
                visible={visible}
                onDismiss={hide}
                theme={theme}
                dismissable={false}
                style={{
                    padding: normalize(15),
                    height: SCREEN_HEIGHT / 1.9,
                    maxHeight: SCREEN_HEIGHT / 2.1
                }}
            >
                <View style={{
                    marginTop: normalize(0)
                }}>
                    <View style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <Text
                            style={{ textAlign: "center", color: theme.colors.primary }}
                            variant="headlineMedium">
                            {showCalculatedBillData[0]?.receipt_no}
                        </Text>
                        <IconButton icon="content-copy" onPress={() => copyToClipboard(currentReceiptNumber.toString())} size={20} />
                    </View>
                </View>
                <ScrollableListContainer backgroundColor={theme.colors.surfaceVariant} width={300}>

                    <CalculateModeBill
                        billArray={showCalculatedBillData}
                    />

                </ScrollableListContainer>
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
                        icon="printer-outline"
                        mode="text"
                        onPress={onDialogSuccecss}
                        textColor={theme.colors.primary}>
                        Reprint
                    </ButtonPaper>
                </View>
            </Dialog>
        </Portal>
    )
}

export default DialogForBillsInCalculatorMode

const styles = StyleSheet.create({})