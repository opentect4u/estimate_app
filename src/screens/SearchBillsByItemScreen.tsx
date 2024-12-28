import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  View,
  ToastAndroid,
  PixelRatio,
  Alert,
} from "react-native"

import HeaderImage from "../components/HeaderImage"
import { blurReport, blurReportDark } from "../resources/images"
import { usePaperColorScheme } from "../theme/theme"
import { DataTable, Searchbar, Text } from "react-native-paper"
import DatePicker from "react-native-date-picker"
import ButtonPaper from "../components/ButtonPaper"
import { useEffect, useState } from "react"
import normalize from "react-native-normalize"
import { formattedDate } from "../utils/dateFormatter"
import { loginStorage } from "../storage/appStorage"
import {
  ItemsData,
  SearchBillsByItemCredentials,
  SearchBillsByItemData,
  ShowBillData,
} from "../models/api_types"
import SurfacePaper from "../components/SurfacePaper"
import { useBluetoothPrint } from "../hooks/printables/useBluetoothPrint"
import { useIsFocused } from "@react-navigation/native"
import useItems from "../hooks/api/useItems"
import ScrollableListContainer from "../components/ScrollableListContainer"
import ProductListSuggestion from "../components/ProductListSuggestion"
import useSearchBillsByItem from "../hooks/api/useSearchBillsByItem"
import useCalculations from "../hooks/useCalculations"
import useShowBill from "../hooks/api/useShowBill"
import DialogBoxForReprint from "../components/DialogBoxForReprint"
import useCancelBill from "../hooks/api/useCancelBill"

function SearchBillsByItemScreen() {
  const isFocused = useIsFocused()
  const theme = usePaperColorScheme()

  const loginStore = JSON.parse(loginStorage.getString("login-data"))

  const { fetchItems } = useItems()
  const { fetchBillsByItem } = useSearchBillsByItem()
  // const { fetchItemReport } = useItemReport()
  // const { printItemReport } = useBluetoothPrint()
  const { cancelBill } = useCancelBill()
  const { fetchBill } = useShowBill()
  const {
    grandTotalCalculate,
    grandTotalWithGSTCalculate,
    grandTotalWithGSTInclCalculate,
  } = useCalculations()

  const { rePrintT } = useBluetoothPrint()

  const [visible, setVisible] = useState(() => false)
  const hideDialog = () => setVisible(() => false)

  const [search, setSearch] = useState<string>(() => "")
  const [filteredItems, setFilteredItems] = useState<ItemsData[]>(() => [])
  const [items, setItems] = useState<ItemsData[]>(() => [])
  const [productId, setProductId] = useState<number>()
  const [itemName, setItemName] = useState<string>(() => "")

  const [itemBillsData, setItemBillsData] = useState<SearchBillsByItemData[]>(
    () => [],
  )
  const [cancelledBillStatus, setCancelledBillStatus] = useState<"Y" | "N">()
  const [billedSaleData, setBilledSaleData] = useState<ShowBillData[]>(() => [])

  const [gstFlag, setGstFlag] = useState<"Y" | "N">()
  const [gstType, setGstType] = useState<"I" | "E">()

  const [fromDate, setFromDate] = useState(() => new Date())
  const [toDate, setToDate] = useState(() => new Date())
  const [openFromDate, setOpenFromDate] = useState(() => false)
  const [openToDate, setOpenToDate] = useState(() => false)
  const [currentReceiptNo, setCurrentReceiptNo] = useState<number | undefined>()

  const [isLoading, setIsLoading] = useState(() => false)
  const [isDisabled, setIsDisabled] = useState(() => false)

  const formattedFromDate = formattedDate(fromDate)
  const formattedToDate = formattedDate(toDate)

  const handleGetItems = async () => {
    const companyId = loginStore.comp_id
    let itemsData = await fetchItems(companyId)

    setItems(itemsData)
  }

  useEffect(() => {
    handleGetItems()
  }, [isFocused])

  // const onChangeSearch = (query: string) => {
  //     setSearch(query)

  //     const filtered = items.filter(item => item?.item_name?.includes(query))
  //     setFilteredItems(filtered)
  //     if (query === "") setFilteredItems(() => [])
  // }

  const onChangeSearch = (query: string) => {
    setSearch(query)

    // Convert the query to lowercase (or uppercase) for case-insensitive comparison
    const lowerCaseQuery = query.toLowerCase()

    const filtered = items.filter(
      (item: ItemsData) =>
        item?.item_name?.toLowerCase().includes(lowerCaseQuery), // Convert each item_name to lowercase (or uppercase) as well
    )
    setFilteredItems(filtered)

    // Clear the filtered items if the query is empty
    if (query === "") setFilteredItems(() => [])
  }

  const productDetails = (item: ItemsData) => {
    setProductId(item?.item_id)
    setItemName(item?.item_name)
    setSearch(() => "")
  }

  const handleGetBillsByItem = async (
    fromDate: string,
    toDate: string,
    productId: number,
  ) => {
    const fetchBillsByItemCreds: SearchBillsByItemCredentials = {
      comp_id: loginStore?.comp_id,
      br_id: loginStore?.br_id,
      from_date: fromDate,
      to_date: toDate,
      item_id: productId,
    }

    if (fromDate > toDate) {
      ToastAndroid.show(
        "From date must be lower than To date.",
        ToastAndroid.SHORT,
      )
      return
    }

    if (itemName.length === 0) {
      ToastAndroid.show("Try searching for a product.", ToastAndroid.SHORT)
      return
    }

    setIsDisabled(true)
    setIsLoading(true)
    await fetchBillsByItem(fetchBillsByItemCreds)
      .then(res => {
        setItemBillsData(res?.data)
        console.log("XXXXXXXXXXXXXXXXX", res?.data)

        if (res?.data?.length === 0) {
          ToastAndroid.show("No Estimates Found.", ToastAndroid.SHORT)
          return
        }
      })
      .catch(err => {
        ToastAndroid.show("Error fetching item estimates.", ToastAndroid.SHORT)
      })
    setIsDisabled(false)
    setIsLoading(false)
  }

  const handleGetBill = async (rcptNo: number) => {
    await fetchBill(rcptNo)
      .then(res => {
        setBilledSaleData(res?.data)
        setCancelledBillStatus(res?.cancel_flag)
      })
      .catch(err => {
        ToastAndroid.show("Error during fetching estimates.", ToastAndroid.SHORT)
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
      // gstFlag === "N"
      //   ? rePrintWithoutGst(
      //     billedSaleData,
      //     // netTotal,
      //     billedSaleData[0]?.tprice,
      //     // totalDiscount,
      //     billedSaleData[0]?.tdiscount_amt,
      //     billedSaleData[0]?.received_amt,
      //     billedSaleData[0]?.received_amt !== undefined
      //       ? billedSaleData[0]?.received_amt -
      //       grandTotalCalculate(billedSaleData[0]?.tprice, billedSaleData[0]?.tdiscount_amt)
      //       : 0,
      //     billedSaleData[0]?.cust_name,
      //     billedSaleData[0]?.phone_no,
      //     billedSaleData[0]?.receipt_no,
      //     billedSaleData[0]?.pay_mode,
      //     false,
      //     false,
      //     cancelFlag,
      //   )
      //   : gstType === "E"
      //     ? rePrint(
      //       billedSaleData,
      //       // netTotal,
      //       billedSaleData[0]?.tprice,
      //       // totalDiscount,
      //       billedSaleData[0]?.tdiscount_amt,
      //       billedSaleData[0]?.received_amt,
      //       billedSaleData[0]?.received_amt !== undefined
      //         ? billedSaleData[0]?.received_amt -
      //         parseFloat(
      //           grandTotalWithGSTCalculate(
      //             billedSaleData[0]?.tprice,
      //             billedSaleData[0]?.tdiscount_amt,
      //             billedSaleData[0]?.tcgst_amt * 2,
      //           ),
      //         )
      //         : 0,
      //       billedSaleData[0]?.cust_name,
      //       billedSaleData[0]?.phone_no,
      //       billedSaleData[0]?.receipt_no,
      //       billedSaleData[0]?.pay_mode,
      //       false,
      //       false,
      //       cancelFlag,
      //     )
      //     : rePrint(
      //       billedSaleData,
      //       // netTotal,
      //       billedSaleData[0]?.tprice,
      //       // totalDiscount,
      //       billedSaleData[0]?.tdiscount_amt,
      //       billedSaleData[0]?.received_amt,
      //       billedSaleData[0]?.received_amt !== undefined
      //         ? billedSaleData[0]?.received_amt -
      //         parseFloat(
      //           grandTotalWithGSTInclCalculate(billedSaleData[0]?.tprice, billedSaleData[0]?.tdiscount_amt),
      //         )
      //         : 0,
      //       billedSaleData[0]?.cust_name,
      //       billedSaleData[0]?.phone_no,
      //       billedSaleData[0]?.receipt_no,
      //       billedSaleData[0]?.pay_mode,
      //       false,
      //       false,
      //       cancelFlag,
      //     )
      rePrintT(
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
    } else {
      ToastAndroid.show("Something went wrong!", ToastAndroid.SHORT)
      return
    }
  }

  const handleCancellingBill = async (rcptNo: number) => {
    await cancelBill(rcptNo, loginStore.user_id).then(res => {
      if (res?.status === 1) {
        ToastAndroid.show(res?.data, ToastAndroid.SHORT)
        handleRePrintReceipt(true)
        setVisible(!visible)
      }
    }).catch(err => {
      ToastAndroid.show(`Error occurred during cancelling estimate. ${err}`, ToastAndroid.SHORT)
      setVisible(!visible)
    })
  }

  const handleCancelBill = (rcptNo: number) => {
    Alert.alert(
      "Cancelling Estimate",
      `Are you sure you want to cancel this estimate?`,
      [
        { text: "BACK", onPress: () => null },
        { text: "CANCEL ESTIMATE", onPress: () => handleCancellingBill(rcptNo) },
      ],
      { cancelable: false },
    )
  }

  let totalQty: number = 0
  let netTotal = 0
  let totalDiscount = 0

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={{ alignItems: "center" }}>
          <HeaderImage
            isBackEnabled
            imgLight={blurReport}
            imgDark={blurReportDark}
            borderRadius={30}
            blur={10}>
            Search By Item
          </HeaderImage>
        </View>
        <View
          style={{
            padding: normalize(10),
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
          }}>
          <ButtonPaper
            textColor={theme.colors.purple}
            onPress={() => setOpenFromDate(true)}
            mode="text">
            FROM: {fromDate?.toLocaleDateString("en-GB")}
          </ButtonPaper>
          <ButtonPaper
            textColor={theme.colors.purple}
            onPress={() => setOpenToDate(true)}
            mode="text">
            TO: {toDate?.toLocaleDateString("en-GB")}
          </ButtonPaper>

          <DatePicker
            modal
            mode="date"
            // minimumDate={toDate.setMonth(toDate.getMonth() - 1)}
            open={openFromDate}
            date={fromDate}
            onConfirm={date => {
              setOpenFromDate(false)
              setFromDate(date)
            }}
            onCancel={() => {
              setOpenFromDate(false)
            }}
          />
          <DatePicker
            modal
            mode="date"
            open={openToDate}
            date={toDate}
            onConfirm={date => {
              setOpenToDate(false)
              setToDate(date)
            }}
            onCancel={() => {
              setOpenToDate(false)
            }}
          />
        </View>

        <View
          style={{
            paddingHorizontal: normalize(25),
            paddingBottom: normalize(10),
          }}>
          <Searchbar
            style={{
              backgroundColor: theme.colors.purpleContainer,
              color: theme.colors.purple,
            }}
            placeholder="Search Products"
            onChangeText={onChangeSearch}
            value={search}
            elevation={search && 2}
            // loading={search ? true : false}
            autoFocus
          />
        </View>

        <View style={{ paddingBottom: normalize(10) }}>
          {search && (
            <ScrollableListContainer
              backgroundColor={theme.colors.surfaceVariant}>
              {filteredItems.map(item => (
                <ProductListSuggestion
                  key={item?.id}
                  itemName={item?.item_name}
                  onPress={() => productDetails(item)}
                  unitPrice={item?.price}
                />
              ))}
            </ScrollableListContainer>
          )}
        </View>

        <View
          style={{
            paddingHorizontal: normalize(20),
            paddingBottom: normalize(10),
          }}>
          <ButtonPaper
            onPress={() =>
              handleGetBillsByItem(
                formattedFromDate,
                formattedToDate,
                productId,
              )
            }
            mode="contained-tonal"
            buttonColor={theme.colors.purple}
            textColor={theme.colors.onPurple}
            loading={isLoading}
            disabled={isDisabled}>
            SUBMIT
          </ButtonPaper>
        </View>

        <SurfacePaper backgroundColor={theme.colors.surface}>
          <View style={{ padding: normalize(10) }}>
            <Text variant="bodyMedium">{itemName}</Text>
          </View>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Rcpt. No.</DataTable.Title>
              <DataTable.Title numeric>Qty.</DataTable.Title>
              <DataTable.Title numeric>Unit Price</DataTable.Title>
            </DataTable.Header>

            {itemBillsData.map((item, i) => {
              // totalNetAmount += item?.amount
              totalQty += item?.qty

              return (
                <DataTable.Row
                  key={i}
                  onPress={() => handleBillListClick(item?.receipt_no)}>
                  <DataTable.Cell>
                    {item?.receipt_no?.toString()}
                  </DataTable.Cell>
                  <DataTable.Cell numeric>{item?.qty}</DataTable.Cell>
                  <DataTable.Cell numeric>₹{item?.price}</DataTable.Cell>
                </DataTable.Row>
              )
            })}
          </DataTable>
          <View style={{ padding: normalize(10) }}>
            <Text variant="labelMedium" style={{ color: theme.colors.purple }}>
              QUANTITY: {totalQty}
            </Text>
          </View>
        </SurfacePaper>
        <View
          style={{
            paddingHorizontal: normalize(20),
            paddingBottom: normalize(10),
          }}>
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
            netTotalButtonColors={[theme.colors.purpleContainer, theme.colors.onPurpleContainer]}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SearchBillsByItemScreen

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },

  title: {
    textAlign: "center",
  },
})
