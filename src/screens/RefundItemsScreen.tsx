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
import ButtonPaper from "../components/ButtonPaper"
import normalize from "react-native-normalize"
import useShowBill from "../hooks/api/useShowBill"
import navigationRoutes from "../routes/navigationRoutes"
import useRefundList from "../hooks/api/useRefundList"
import { RefundListCredentials } from "../models/api_types"
import { loginStorage } from "../storage/appStorage"
import { AppStore } from "../context/AppContext"
import { AppStoreContext } from "../models/custom_types"

function RefundItemsScreen() {
  const theme = usePaperColorScheme()
  const navigation = useNavigation()

  const loginStore = JSON.parse(loginStorage.getString("login-data"))

  const { receiptSettings } = useContext<AppStoreContext>(AppStore)

  const [search, setSearch] = useState<string>(() => "")
  const onChangeSearch = (query: string) => {
    if (/^\d*$/.test(query)) {
      setSearch(query)
    }
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

  const { fetchRefundList } = useRefundList()

  const handleGetBills = async (mobile: string) => {
    // await fetchBill(rcptNo).then(res => {
    //     if (res.status === 0) {
    //         ToastAndroid.show("No bills found.", ToastAndroid.SHORT)
    //         return
    //     }
    // setBilledSaleData(res?.data)

    // navigation.dispatch(
    //     CommonActions.navigate({
    //         name: navigationRoutes.refundItemsDataScreen,
    //         params: {
    //             // billed_sale_data: billedSaleData
    //             billed_sale_data: res?.data
    //         }
    //     })
    // )
    const reqCreds: RefundListCredentials = {
      comp_id: loginStore?.comp_id,
      br_id: loginStore?.br_id,
      phone_no: mobile,
      ref_days: receiptSettings?.refund_days,
    }

    await fetchRefundList(reqCreds)
      .then(res => {
        if (res?.length === 0) {
          ToastAndroid.show("No bills found.", ToastAndroid.SHORT)
          return
        }

        navigation.dispatch(
          CommonActions.navigate({
            name: navigationRoutes.receiptsAgainstMobileScreen,
            params: {
              customer_phone_number: search,
              bills_data: res,
            },
          }),
        )
      })
      .catch(err => {
        ToastAndroid.show("Error during fetching bills.", ToastAndroid.SHORT)
        return
      })

    // }).catch(err => {
    //     ToastAndroid.show("Error during fetching bills.", ToastAndroid.SHORT)
    //     return
    // })
  }

  const handleBillListClick = (mobile: string) => {
    if (!search || search.length !== 10) {
      ToastAndroid.show("Enter valid phone number.", ToastAndroid.SHORT)
      return
    }
    // setVisible(!visible)
    handleGetBills(mobile)
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
              // placeholder="Search Bills"
              placeholder="Mobile Number"
              onChangeText={onChangeSearch}
              value={search}
              elevation={search && 2}
              keyboardType="numeric"
              maxLength={10}
              style={{
                backgroundColor: theme.colors.secondaryContainer,
                color: theme.colors.onSecondaryContainer,
              }}
            // loading={search ? true : false}
            />
          </View>
          {/* <ButtonPaper onPress={() => handleGetBillsByDate(formattedFromDate, formattedToDate)} mode="contained-tonal">
                        SUBMIT
                    </ButtonPaper> */}
          <ButtonPaper
            onPress={() => handleBillListClick(search)}
            mode="contained-tonal"
            style={{
              backgroundColor: theme.colors.primaryContainer,
              color: theme.colors.onPrimaryContainer,
            }}>
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
