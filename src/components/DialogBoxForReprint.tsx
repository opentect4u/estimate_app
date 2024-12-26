import { PropsWithChildren, useState } from "react"
import { Dialog, Portal, Button, Text, TouchableRipple } from "react-native-paper"
import Clipboard from "@react-native-clipboard/clipboard"
import { usePaperColorScheme } from "../theme/theme"
import { Alert, Pressable, ToastAndroid, View } from "react-native"
import ScrollableListContainer from "./ScrollableListContainer"
import AddedProductList from "./AddedProductList"
import NetTotalForRePrints from "./NetTotalForRePrints"
import ButtonPaper from "./ButtonPaper"
import normalize from "react-native-normalize"
import { ShowBillData } from "../models/api_types"
import useCancelBill from "../hooks/api/useCancelBill"
import { loginStorage } from "../storage/appStorage"

type DialogBoxProps = {
  visible: boolean
  hide: () => void
  title?: string
  btnFail?: string
  btnSuccess?: string
  icon?: string
  iconSize?: number
  titleStyle?: {}
  buttonSuccessIcon?: string
  dismissable?: boolean
  currentReceiptNo?: number
  billedSaleData?: ShowBillData[]
  cancelledBillStatus?: string
  netTotalButtonColors?: Array<string>
  handleCancelBill?: (rcptNo: number) => void

  onDialogFailure?: () => void
  onDialogSuccecss?: () => void
}

export default function DialogBoxForReprint({
  children,
  visible,
  icon,
  iconSize,
  title,
  titleStyle,
  hide,
  dismissable = false,
  cancelledBillStatus,
  currentReceiptNo,
  billedSaleData = [],
  netTotalButtonColors = [],
  handleCancelBill,
  onDialogFailure,
  onDialogSuccecss
}: PropsWithChildren<DialogBoxProps>) {
  const theme = usePaperColorScheme()

  let netTotal = 0,
    totalDiscount = 0

  // const handleCancellingBill = async (rcptNo: number) => {
  //   await cancelBill(rcptNo, loginStore.user_id).then(res => {
  //     if (res?.status === 1) {
  //       ToastAndroid.show(res?.data, ToastAndroid.SHORT)
  //       setVisible(!visible)
  //     }
  //   }).catch(err => {
  //     ToastAndroid.show(`Error occurred during cancelling bill. ${err}`, ToastAndroid.SHORT)
  //     setVisible(!visible)
  //   })

  //   handleGetBillSummary()
  //   handleGetRecentBills()
  // }

  // const handleCancelBill = (rcptNo: number) => {
  //   Alert.alert(
  //     "Cancelling Bill",
  //     `Are you sure you want to cancel this bill?`,
  //     [
  //       { text: "BACK", onPress: () => null },
  //       { text: "CANCEL BILL", onPress: () => handleCancellingBill(rcptNo) },
  //     ],
  //     { cancelable: false },
  //   )
  // }

  const copyToClipboard = (value: string) => {
    Clipboard.setString(value)
    ToastAndroid.show(`Copied: ${value}`, ToastAndroid.SHORT)
  }

  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={hide}
        theme={theme}
        dismissable={dismissable}>
        {icon && <Dialog.Icon icon={icon} size={iconSize} />}
        {title && <Dialog.Title style={titleStyle}>{title}</Dialog.Title>}
        <Dialog.Content>
          <View style={{ paddingBottom: 5 }}>
            <TouchableRipple onPress={() => copyToClipboard(currentReceiptNo.toString())}>
              <Text
                style={{ textAlign: "center", color: theme.colors.primary }}
                variant="bodyLarge">
                RCPT. NO. {currentReceiptNo}
              </Text>
            </TouchableRipple>
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
            {/* {billedSaleData[0]?.cust_name && (
              <Text
                style={{ textAlign: "center", color: theme.colors.primary }}
                variant="bodyLarge">
                {billedSaleData[0]?.cust_name}
              </Text>
            )}
            <TouchableRipple onPress={() => copyToClipboard(billedSaleData[0]?.phone_no)}>
              <Text
                style={{ textAlign: "center", color: theme.colors.secondary }}
                variant="bodyLarge">
                {billedSaleData[0]?.phone_no}
              </Text>
            </TouchableRipple> */}
            <Text
              style={{ textAlign: "center", color: theme.colors.peach }}
              variant="bodyLarge">
              Payment Mode: {`[${billedSaleData[0]?.pay_mode === "C" ? "Cash" : billedSaleData[0]?.pay_mode === "D" ? "Card" : billedSaleData[0]?.pay_mode === "U" ? "UPI" : billedSaleData[0]?.pay_mode === "R" ? "Credit" : billedSaleData[0]?.pay_mode === null ? "Pay Off" : "Error!"}]`}
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
            backgroundColor={netTotalButtonColors[0] || theme.colors.pinkContainer}
            addedProductsList={billedSaleData}
            netTotal={netTotal}
            textColor={netTotalButtonColors[1] || theme.colors.onPinkContainer}
            totalDiscount={totalDiscount}
            disabled
          />
          <View style={{ paddingTop: normalize(10) }}>
            <ButtonPaper icon="cancel" mode="contained-tonal" onPress={() => handleCancelBill(currentReceiptNo)} buttonColor={theme.colors.error} textColor={theme.colors.onError} disabled={cancelledBillStatus === "Y"}>
              CANCEL ESTIMATE
            </ButtonPaper>
          </View>
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
        </Dialog.Content>
      </Dialog>
    </Portal>
  )
}
