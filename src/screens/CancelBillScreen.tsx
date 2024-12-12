import React, { useContext, useState } from "react"
import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  View,
  ToastAndroid,
} from "react-native"
import { List, Searchbar } from "react-native-paper"
import HeaderImage from "../components/HeaderImage"
import { textureBill, textureBillDark } from "../resources/images"
import { usePaperColorScheme } from "../theme/theme"
import { useNavigation } from "@react-navigation/native"
import DialogBox from "../components/DialogBox"
import AddedProductList from "../components/AddedProductList"
import ScrollableListContainer from "../components/ScrollableListContainer"
import ButtonPaper from "../components/ButtonPaper"
import DatePicker from "react-native-date-picker"
import normalize from "react-native-normalize"
import useSearchBills from "../hooks/api/useSearchBills"
import { loginStorage } from "../storage/appStorage"
import { SearchedBills, ShowBillData } from "../models/api_types"
import { formattedDate } from "../utils/dateFormatter"
import useShowBill from "../hooks/api/useShowBill"
import { useBluetoothPrint } from "../hooks/printables/useBluetoothPrint"
import { AppStore } from "../context/AppContext"
import NetTotalForRePrints from "../components/NetTotalForRePrints"
import { Alert } from "react-native"
import useCancelBill from "../hooks/api/useCancelBill"
import useCalculations from "../hooks/useCalculations"
import { AppStoreContext } from "../models/custom_types"

/**
 * @deprecated CancelBillScreen
 */
function CancelBillScreen() {
  const theme = usePaperColorScheme()
  const navigation = useNavigation()

  const loginStore = JSON.parse(loginStorage.getString("login-data"))

  const { receiptSettings } = useContext<AppStoreContext>(AppStore)

  const [search, setSearch] = useState<string>(() => "")
  const onChangeSearch = (query: string) => {
    setSearch(query)
  }

  const [visible, setVisible] = useState(() => false)
  const hideDialog = () => setVisible(() => false)

  const [fromDate, setFromDate] = useState(() => new Date())
  const [toDate, setToDate] = useState(() => new Date())
  const [openFromDate, setOpenFromDate] = useState(() => false)
  const [openToDate, setOpenToDate] = useState(() => false)
  const [currentReceiptNo, setCurrentReceiptNo] = useState<number | undefined>(
    () => undefined,
  )
  const [gstFlag, setGstFlag] = useState<"Y" | "N">()
  const [discountType, setDiscountType] = useState<"P" | "A">()

  const formattedFromDate = formattedDate(fromDate)
  const formattedToDate = formattedDate(toDate)

  const [billsArray, setBillsArray] = useState<SearchedBills[]>(() => [])
  const [billedSaleData, setBilledSaleData] = useState<ShowBillData[]>(() => [])

  const { fetchSearchedBills } = useSearchBills()
  const { fetchBill } = useShowBill()
  const { cancelBill } = useCancelBill()
  const { grandTotalCalculate } = useCalculations()

  const { rePrint, rePrintWithoutGst } = useBluetoothPrint()

  const handleGetBill = async (rcptNo: number) => {
    await fetchBill(rcptNo)
      .then(res => {
        if (res.status === 0) {
          ToastAndroid.show("No bills found.", ToastAndroid.SHORT)
          return
        }
        setBilledSaleData(res?.data)

        setVisible(!visible)
        setCurrentReceiptNo(rcptNo)
        setGstFlag(res.data[0]?.gst_flag)
      })
      .catch(err => {
        ToastAndroid.show("Error during fetching bills.", ToastAndroid.SHORT)
        return
      })
  }

  const handleBillListClick = (rcptNo: number) => {
    if (!search || search.length !== 10) {
      ToastAndroid.show("Enter valid receipt number.", ToastAndroid.SHORT)
      return
    }
    handleGetBill(rcptNo)
    // setVisible(!visible)
    // setCurrentReceiptNo(rcptNo)
    // setGstFlag(billedSaleData[0]?.gst_flag)
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
    handleRePrintReceipt()
  }

  const handleRePrintReceipt = () => {
    if (billedSaleData.length > 0) {
      gstFlag === "N"
        ? rePrintWithoutGst(
          billedSaleData,
          netTotal,
          totalDiscount,
          billedSaleData[0]?.received_amt,
          billedSaleData[0]?.received_amt !== undefined
            ? billedSaleData[0]?.received_amt -
            grandTotalCalculate(netTotal, totalDiscount)
            : 0,
          billedSaleData[0]?.cust_name,
          billedSaleData[0]?.phone_no,
          billedSaleData[0]?.receipt_no,
          billedSaleData[0]?.pay_mode,
        )
        : rePrint(
          billedSaleData,
          netTotal,
          totalDiscount,
          billedSaleData[0]?.received_amt,
          billedSaleData[0]?.received_amt !== undefined
            ? billedSaleData[0]?.received_amt -
            grandTotalCalculate(netTotal, totalDiscount)
            : 0,
          billedSaleData[0]?.cust_name,
          billedSaleData[0]?.phone_no,
          billedSaleData[0]?.receipt_no,
          billedSaleData[0]?.pay_mode,
        )
    } else {
      ToastAndroid.show("Something went wrong!", ToastAndroid.SHORT)
      return
    }
  }

  // const handleGetBillsByDate = async (fromDate: string, toDate: string) => {
  //     let billResponseData = await fetchSearchedBills(fromDate, toDate, loginStore.comp_id, loginStore.br_id, loginStore.user_id)
  //     console.log("$$$$$$$$$########", billResponseData)
  //     // console.log("$$$$$$$$$######## loginStore.comp_id", loginStore.comp_id)
  //     // console.log("$$$$$$$$$######## loginStore.br_id", loginStore.br_id)
  //     // console.log("$$$$$$$$$######## loginStore.user_id", loginStore.user_id)
  //     setBillsArray(billResponseData?.data)
  // }

  const handleCancellingBill = async (rcptNo: number) => {
    let res = await cancelBill(rcptNo, loginStore.user_id)

    if (res?.status === 1) {
      ToastAndroid.show(res?.data, ToastAndroid.SHORT)
      setVisible(!visible)
    }
    return
  }

  const handleCancelBill = (rcptNo: number) => {
    Alert.alert(
      "Cancelling Bill",
      `Are you sure you want to cancel this bill?`,
      [
        {
          text: "BACK",
          onPress: () =>
            ToastAndroid.show(
              "Operation cancelled by user.",
              ToastAndroid.SHORT,
            ),
        },
        { text: "CANCEL BILL", onPress: () => handleCancellingBill(rcptNo) },
      ],
      { cancelable: false },
    )
  }

  let netTotal = 0
  let totalDiscount = 0

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={{ alignItems: "center" }}>
          <HeaderImage
            imgLight={textureBill}
            imgDark={textureBillDark}
            borderRadius={30}
            blur={10}
            isBackEnabled>
            Cancel Bill
          </HeaderImage>
        </View>

        <View
          style={{
            paddingHorizontal: normalize(20),
            paddingBottom: normalize(10),
          }}>
          <View style={{ paddingBottom: normalize(10) }}>
            <Searchbar
              keyboardType="numeric"
              autoFocus
              placeholder="Search Bills"
              onChangeText={onChangeSearch}
              value={search}
              elevation={search && 2}
            // loading={search ? true : false}
            />
          </View>
          {/* <ButtonPaper onPress={() => handleGetBillsByDate(formattedFromDate, formattedToDate)} mode="contained-tonal">
                        SUBMIT
                    </ButtonPaper> */}
          <ButtonPaper
            onPress={() => handleBillListClick(parseInt(search))}
            mode="contained-tonal">
            SUBMIT
          </ButtonPaper>
        </View>

        <View style={{ width: "100%" }}>
          {billsArray?.map((item, i) => (
            <List.Item
              key={i}
              title={`Bill ${item?.receipt_no}`}
              description={`₹${item?.net_amt}`}
              onPress={() => handleBillListClick(item?.receipt_no)}
              left={props => <List.Icon {...props} icon="basket" />}
            // right={props => (
            //   <List.Icon {...props} icon="download" />
            // )}
            />
          ))}
        </View>
      </ScrollView>
      <DialogBox
        iconSize={40}
        visible={visible}
        hide={hideDialog}
        titleStyle={styles.title}
        btnSuccess="REPRINT"
        onFailure={onDialogFailure}
        onSuccess={onDialogSuccecss}
      // title="Print Bill"
      // icon="printer-outline"
      >
        <ScrollableListContainer
          backgroundColor={theme.colors.surfaceVariant}
          width={300}
          height={200}>
          {billedSaleData.map((item, i) => {
            netTotal += item.price * item.qty
            totalDiscount += parseFloat(item?.discount_amt?.toFixed(2))

            // setDiscountType(item?.discount_type)
            // setGstFlag(item?.gst_flag)

            return (
              <AddedProductList
                disabled
                itemName={item.item_name}
                quantity={item.qty}
                // unit={item.unit}
                unitPrice={item.price}
                discount={
                  receiptSettings?.discount_type === "P"
                    ? item?.dis_pertg
                    : item?.discount_amt
                }
                discountType={item?.discount_type}
                gstFlag={item?.gst_flag}
                key={i}
              />
            )
          })}
        </ScrollableListContainer>
        <View style={{ paddingTop: normalize(10) }}>
          <ButtonPaper
            icon="cancel"
            mode="contained-tonal"
            onPress={() => handleCancelBill(currentReceiptNo)}
            buttonColor={theme.colors.error}
            textColor={theme.colors.onError}>
            CANCEL BILL
          </ButtonPaper>
        </View>
        <NetTotalForRePrints
          width={300}
          backgroundColor={theme.colors.orangeContainer}
          addedProductsList={billedSaleData}
          netTotal={netTotal}
          textColor={theme.colors.onGreenContainer}
          totalDiscount={totalDiscount}
          disabled
        />
      </DialogBox>
    </SafeAreaView>
  )
}

export default CancelBillScreen

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },

  title: {
    textAlign: "center",
  },
})
