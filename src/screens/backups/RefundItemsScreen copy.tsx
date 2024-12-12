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
import { CommonActions, useNavigation } from "@react-navigation/native"
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
import InputPaper from "../components/InputPaper"
import navigationRoutes from "../routes/navigationRoutes"

function RefundItemsScreen() {
  const theme = usePaperColorScheme()
  const navigation = useNavigation()

  // const loginStore = JSON.parse(loginStorage.getString("login-data"))

  // const { receiptSettings } = useContext(AppStore)

  const [search, setSearch] = useState<string>(() => "")
  const onChangeSearch = (query: string) => {
    setSearch(query)
  }

  // const [visible, setVisible] = useState(() => false)
  // const hideDialog = () => setVisible(() => false)

  // const [visible2, setVisible2] = useState(() => false)
  // const hideDialog2 = () => setVisible2(() => false)

  // const [fromDate, setFromDate] = useState(() => new Date())
  // const [toDate, setToDate] = useState(() => new Date())
  // const [openFromDate, setOpenFromDate] = useState(() => false)
  // const [openToDate, setOpenToDate] = useState(() => false)
  // const [currentReceiptNo, setCurrentReceiptNo] = useState<number | undefined>(() => undefined)
  // const [gstFlag, setGstFlag] = useState<"Y" | "N">()
  // const [discountType, setDiscountType] = useState<"P" | "A">()
  // const [quantity, setQuantity] = useState<number>(() => undefined)

  // const formattedFromDate = formattedDate(fromDate)
  // const formattedToDate = formattedDate(toDate)

  // const [billsArray, setBillsArray] = useState<SearchedBills[]>(() => [])
  // const [billedSaleData, setBilledSaleData] = useState<ShowBillData[]>(() => [])

  // const [refundedListData, setRefundedListData] = useState<ShowBillData[]>(() => [])

  // const { fetchSearchedBills } = useSearchBills()
  // const { cancelBill } = useCancelBill()
  // const { grandTotalCalculate } = useCalculations()

  const { fetchBill } = useShowBill()

  const handleGetBill = async (rcptNo: number) => {
    await fetchBill(rcptNo)
      .then(res => {
        if (res.status === 0) {
          ToastAndroid.show("No bills found.", ToastAndroid.SHORT)
          return
        }
        // setBilledSaleData(res?.data)

        navigation.dispatch(
          CommonActions.navigate({
            name: navigationRoutes.refundItemsDataScreen,
            params: {
              // billed_sale_data: billedSaleData
              billed_sale_data: res?.data,
            },
          }),
        )
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
    // setVisible(!visible)
    handleGetBill(rcptNo)
    // setCurrentReceiptNo(rcptNo)
    // setGstFlag(billedSaleData[0]?.gst_flag)
  }

  // const onDialogFailure = () => {
  //     setVisible(!visible)
  // }

  // const onDialogSuccecss = () => {
  //     setVisible(!visible)

  //     navigation.dispatch(
  //         CommonActions.navigate({
  //             name: navigationRoutes.refundItemsDataScreen,
  //             params: {
  //                 billed_sale_data: billedSaleData
  //             }
  //         })
  //     )
  // }

  // const handleRefundedListUpdate = (item: ShowBillData) => {
  //     setVisible2(!visible2)

  //     console.log("@@@@@@@@@@@@@@@@@@@@@@@@@", item)

  // }

  // const handleDialog2Success = (item: ShowBillData) => {
  //     setVisible2(!visible2)

  //     // item["qty"] = quantity
  //     // setBilledSaleData([...billedSaleData])

  //     // refundedListData.push(item)
  //     // setRefundedListData([...refundedListData])
  // }

  // let netTotal = 0
  // let totalDiscount = 0

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
            Refund Products
          </HeaderImage>
        </View>

        <View
          style={{
            paddingHorizontal: normalize(20),
            paddingBottom: normalize(10),
          }}>
          <View style={{ paddingBottom: normalize(10) }}>
            <Searchbar
              autoFocus
              placeholder="Search Bills"
              onChangeText={onChangeSearch}
              value={search}
              elevation={search && 2}
              keyboardType="numeric"
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

        {/* <View style={{ width: "100%" }}>
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
                </View> */}
      </ScrollView>
      {/* <DialogBox
                iconSize={40}
                visible={visible}
                hide={hideDialog}
                titleStyle={styles.title}
                onFailure={onDialogFailure}
                onSuccess={onDialogSuccecss}>
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
                                // onPress={() => handleRefundedListUpdate(item)}
                                itemName={item.item_name}
                                quantity={item.qty}
                                // unit={item.unit}
                                unitPrice={item.price}
                                discount={receiptSettings?.discount_type === "P" ? item?.dis_pertg : item?.discount_amt}
                                discountType={item?.discount_type}
                                gstFlag={item?.gst_flag}
                                key={i}
                            />
                        )
                    })}
                </ScrollableListContainer>
                <NetTotalForRePrints
                    width={300}
                    backgroundColor={theme.colors.orangeContainer}
                    addedProductsList={billedSaleData}
                    netTotal={netTotal}
                    textColor={theme.colors.onGreenContainer}
                    totalDiscount={totalDiscount}
                    disabled
                />
            </DialogBox> */}
    </SafeAreaView>
  )
}

export default RefundItemsScreen

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },

  title: {
    textAlign: "center",
  },
})
