import React, { useContext, useEffect, useState, useRef } from "react"
import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  View,
  ToastAndroid,
  Alert,
} from "react-native"
import { IconButton, RadioButton, Searchbar, Text } from "react-native-paper"
import HeaderImage from "../components/HeaderImage"
import { textureBill, textureBillDark } from "../resources/images"
import { usePaperColorScheme } from "../theme/theme"
import {
  CommonActions,
  useNavigation,
  useRoute,
} from "@react-navigation/native"
import DialogBox from "../components/DialogBox"
import AddedProductList from "../components/AddedProductList"
import ButtonPaper from "../components/ButtonPaper"
import normalize, { SCREEN_HEIGHT, SCREEN_WIDTH } from "react-native-normalize"
import { loginStorage } from "../storage/appStorage"
import { RefundItemCredentials, ShowBillData } from "../models/api_types"
import { AppStore } from "../context/AppContext"
import InputPaper from "../components/InputPaper"
import {
  ReceiptsAgainstMobileScreenRouteProp,
  RefundItemsScreenRouteProp,
} from "../models/route_types"
import ScrollableListContainer from "../components/ScrollableListContainer"
import useCalculations from "../hooks/useCalculations"
import NetTotalForRePrints from "../components/NetTotalForRePrints"
import { gstFilterationAndTotalForRePrint } from "../utils/gstFilterTotalForRePrint"
import useRefundItems from "../hooks/api/useRefundItems"
import { mapRefundItemToFilteredItem } from "../utils/mapRefundItemToFilteredItem"
import navigationRoutes from "../routes/navigationRoutes"
import { useBluetoothPrint } from "../hooks/printables/useBluetoothPrint"
import SquircleBox from "../components/SquircleBox"
import { AppStoreContext } from "../models/custom_types"

function RefundItemsDataScreen() {
  const theme = usePaperColorScheme()
  const navigation = useNavigation()
  const { params } = useRoute<ReceiptsAgainstMobileScreenRouteProp>()

  const loginStore = JSON.parse(loginStorage.getString("login-data"))

  const { receiptSettings } = useContext<AppStoreContext>(AppStore)

  const {
    netTotalCalculate,
    netTotalWithGSTCalculate,
    grandTotalWithGSTCalculate,
    netTotalWithGSTInclCalculate,
    grandTotalCalculate,
    grandTotalWithGSTInclCalculate,
  } = useCalculations()
  const { rePrint, rePrintWithoutGst } = useBluetoothPrint()

  const { sendRefundItemDetails } = useRefundItems()

  const [checked, setChecked] = useState<"C" | "U" | "D">(() => "C")
  const [isLoading, setIsLoading] = useState(() => false)
  const [isDisabled, setIsDisabled] = useState(() => false)

  const [visible, setVisible] = useState(() => false)
  const hideDialog = () => setVisible(() => false)

  const [product, setProduct] = useState<ShowBillData>()
  const [quantity, setQuantity] = useState<number>()
  const [position, setPosition] = useState<number>()
  const [discountBillwise, setDiscountBillwise] = useState<number>(() => 0)

  const [cashAmount, setCashAmount] = useState<number | undefined>(
    () => undefined,
  )
  const [finalCashAmount, setFinalCashAmount] = useState<number | undefined>(
    () => undefined,
  )

  const [filteredItems, setFilteredItems] = useState<ShowBillData[]>(() => [])
  // const [billedSaleData, setBilledSaleData] = useState<ShowBillData[]>(() => params?.billed_sale_data)
  const [refundedData, setRefundedData] = useState<ShowBillData[]>(() => [])

  // const [refundedListData, setRefundedListData] = useState<ShowBillData[]>(() => [])

  const [editState, setEditState] = useState<boolean>(() => false)

  const searchProductRef = useRef(null)

  const [search, setSearch] = useState<string>(() => "")
  // const onChangeSearch = (query: string) => {
  //     setSearch(query)

  //     const filtered = params?.billed_sale_data?.filter((item: ShowBillData) => item?.item_name?.includes(query))
  //     setFilteredItems(filtered)
  //     if (query === "") setFilteredItems(() => [])
  // }

  const onChangeSearch = (query: string) => {
    setSearch(query)
    // Convert the query to lowercase for a case-insensitive comparison
    const lowerCaseQuery = query.toLowerCase()

    const filtered = params?.billed_sale_data?.filter(
      (item: ShowBillData) =>
        item?.item_name?.toLowerCase().includes(lowerCaseQuery), // Ensure case-insensitive search
    )

    setFilteredItems(filtered)

    // If the query is empty, clear the filtered items
    if (query === "") {
      setFilteredItems(() => [])
    }
  }

  const onDialogFailure = () => {
    setEditState(false)
    setSearch(() => "")
    setVisible(!visible)
  }

  const onDialogSuccecss = (item: ShowBillData) => {
    setEditState(false)

    if (quantity <= item?.qty && quantity > 0) {
      if (refundedData.some(it => it.item_id === item.item_id)) {
        ToastAndroid.show("Item already added.", ToastAndroid.SHORT)
        setSearch(() => "")
        return
      }

      setVisible(!visible)
      refundedData.push({
        ...item,
        qty: quantity,
        discount_amt: parseFloat(
          ((item?.discount_amt / item?.qty) * quantity).toFixed(2),
        ),
      })

      // dis_pertg: parseFloat(((item?.dis_pertg / item?.qty) * quantity).toFixed(2))
      setRefundedData(refundedData)
      setSearch(() => "")
    } else {
      ToastAndroid.show(
        "Quantity must be less than or equal to previous quantity.",
        ToastAndroid.SHORT,
      )
      return
    }
  }

  const onDialogSuccessChange = (item: ShowBillData) => {
    if (!quantity) {
      ToastAndroid.show("Add some quantity.", ToastAndroid.SHORT)
      return
    }
    onDialogSuccecss(item)
  }

  const handleEditRefundProduct = (item: ShowBillData) => {
    setEditState(true)

    setVisible(true)
    setProduct(item)
    setQuantity(item?.qty)
  }

  const onDialogEditSuccess = (item: ShowBillData) => {
    let newRefundedData = refundedData.filter(
      it => item?.item_id !== it.item_id,
    )

    if (quantity <= item?.qty && quantity > 0) {
      setVisible(!visible)
      newRefundedData.push({
        ...item,
        qty: quantity,
        discount_amt: parseFloat(
          ((item?.discount_amt / item?.qty) * quantity).toFixed(2),
        ),
      })

      setRefundedData(newRefundedData)
      setSearch(() => "")
      setEditState(false)
    } else {
      ToastAndroid.show(
        "Quantity must be less than or equal to previous quantity.",
        ToastAndroid.SHORT,
      )
      return
    }
  }

  const removeRefundProduct = (item: ShowBillData) => {
    Alert.alert("Remove", `Remove ${item?.item_name}?`, [
      { text: "NO", onPress: () => null },
      {
        text: "YES",
        onPress: () => {
          setRefundedData(
            refundedData.filter(i => i?.item_id !== item?.item_id),
          )
          hideDialog()
          setEditState(false)
        },
      },
    ])
  }

  useEffect(() => {
    console.log("##########################", params?.billed_sale_data)
    // console.log("##########################", netTotal)
    // console.log("##########@@@@@@@@@@@@@@@@", totalDiscount)
    // console.log("##########%%%%%%%%%%%%%%%%", totalGst)
  }, [])

  const handleRefundedListUpdate = (item: ShowBillData, pos: number) => {
    setProduct(item)
    setQuantity(item?.qty)
    setVisible(!visible)
    setPosition(pos)
  }

  const handleRefundItems = async () => {
    if (
      (refundedData[0]?.discount_position === "B" && discountBillwise < 0) ||
      parseFloat(
        grandTotalWithGSTCalculate(netTotal, totalDiscount, totalGstForView),
      ) < 0 ||
      parseFloat(grandTotalWithGSTInclCalculate(netTotal, totalDiscount)) < 0 ||
      grandTotalCalculate(netTotal, totalDiscount) < 0
    ) {
      ToastAndroid.show("Enter valid discount amount", ToastAndroid.SHORT)
      return
    }
    const loginStore = JSON.parse(loginStorage.getString("login-data"))

    let filteredData: RefundItemCredentials[]

    const { totalGST } = gstFilterationAndTotalForRePrint(
      refundedData,
      refundedData[0]?.gst_type,
    )

    filteredData = refundedData.map(item =>
      // mapRefundItemToFilteredItem(loginStore?.user_id, item, netTotal, totalDiscount, totalGst)
      mapRefundItemToFilteredItem(
        loginStore?.user_id,
        item,
        netTotal,
        totalDiscount,
        totalGST,
        checked,
        cashAmount,
      ),
    )

    setIsDisabled(true)
    setIsLoading(true)
    await sendRefundItemDetails(filteredData)
      .then(res => {
        ToastAndroid.show(
          `Items refunded! ~ Added to Stock. ${res?.data?.data}`,
          ToastAndroid.SHORT,
        )
        handlePrintRefundReceipt(res?.data?.data)
        navigation.dispatch(
          CommonActions.navigate({
            name: navigationRoutes.refundItemsScreen,
          }),
        )
      })
      .catch(err => {
        console.log("OOOOOOOOOOOOOOOOOOOOO", err)
        ToastAndroid.show("Some error while refunding!", ToastAndroid.SHORT)
      })
    setIsLoading(false)
    setIsDisabled(false)
  }

  const handleRefundSubmit = () => {
    Alert.alert("Refund", "Are you sure you want to refund?", [
      { text: "NO", onPress: () => console.log("Cancelled!") },
      { text: "YES", onPress: () => handleRefundItems() },
    ])
  }

  const handlePrintRefundReceipt = (refundRcptNo: number) => {
    if (refundedData.length > 0) {
      refundedData[0]?.gst_flag === "N"
        ? rePrintWithoutGst(
          refundedData,
          netTotal,
          totalDiscount,
          refundedData[0]?.received_amt,
          refundedData[0]?.received_amt !== undefined
            ? refundedData[0]?.received_amt -
            grandTotalCalculate(netTotal, totalDiscount)
            : 0,
          refundedData[0]?.cust_name,
          refundedData[0]?.phone_no,
          // refundedData[0]?.receipt_no,
          refundRcptNo,
          checked,
          true,
        )
        : refundedData[0]?.gst_type === "E"
          ? rePrint(
            refundedData,
            netTotal,
            totalDiscount,
            refundedData[0]?.received_amt,
            refundedData[0]?.received_amt !== undefined
              ? refundedData[0]?.received_amt -
              parseFloat(
                grandTotalWithGSTCalculate(
                  netTotal,
                  totalDiscount,
                  refundedData[0]?.tcgst_amt * 2,
                ),
              )
              : 0,
            refundedData[0]?.cust_name,
            refundedData[0]?.phone_no,
            // refundedData[0]?.receipt_no,
            refundRcptNo,
            checked,
            true,
          )
          : rePrint(
            refundedData,
            netTotal,
            totalDiscount,
            refundedData[0]?.received_amt,
            refundedData[0]?.received_amt !== undefined
              ? refundedData[0]?.received_amt -
              parseFloat(
                grandTotalWithGSTInclCalculate(netTotal, totalDiscount),
              )
              : 0,
            refundedData[0]?.cust_name,
            refundedData[0]?.phone_no,
            // refundedData[0]?.receipt_no,
            refundRcptNo,
            checked,
            true,
          )
    } else {
      ToastAndroid.show("Something went wrong!", ToastAndroid.SHORT)
      return
    }
  }

  useEffect(() => {
    if (receiptSettings?.gst_flag === "Y") {
      receiptSettings?.gst_type === "E"
        ? setFinalCashAmount(() =>
          cashAmount !== undefined
            ? cashAmount -
            parseFloat(
              grandTotalWithGSTCalculate(
                netTotal,
                totalDiscount,
                totalGstForView,
              ),
            )
            : 0,
        )
        : setFinalCashAmount(() =>
          cashAmount !== undefined
            ? cashAmount -
            parseFloat(
              grandTotalWithGSTInclCalculate(
                netTotal,
                totalDiscount,
              ),
            )
            : 0,
        )
    } else {
      setFinalCashAmount(() =>
        cashAmount !== undefined
          ? cashAmount -
          grandTotalCalculate(netTotal, totalDiscount)
          : 0,
      )
    }
  }, [cashAmount])

  let netTotal = 0
  let totalDiscount = 0
  let totalGstForView = 0

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
            Choose Products to Refund
          </HeaderImage>
        </View>

        <View
          style={{
            paddingHorizontal: normalize(20),
            paddingBottom: normalize(10),
          }}>
          {/* <ScrollableListContainer
                        backgroundColor={theme.colors.surfaceVariant}>
                        {billedSaleData?.map((item, i) => {
                            // netTotal += item.price * item.qty
                            // totalDiscount += (quantity == 0 ? 0 : item.discount_amt)

                            return (
                                <AddedProductList
                                    onPress={() => handleRefundedListUpdate(item, i)}
                                    itemName={item.item_name}
                                    quantity={item.qty}
                                    unitPrice={item.price}
                                    discount={quantity == 0 ? 0 : item.discount_amt}
                                    discountType={item?.discount_type}
                                    gstFlag={item?.gst_flag}
                                    key={i}
                                />
                            )
                        })}
                    </ScrollableListContainer> */}
          <View style={{
            paddingHorizontal: normalize(2),
            paddingBottom: normalize(10),
          }}>
            <Searchbar
              style={{
                backgroundColor: theme.colors.primaryContainer,
                color: theme.colors.onPrimaryContainer
              }}
              ref={searchProductRef}
              autoFocus
              placeholder="Search Products"
              onChangeText={onChangeSearch}
              value={search}
              elevation={search && 2}
              keyboardType="default"
            // loading={search ? true : false}
            />
          </View>

          <View style={{
            justifyContent: "center",
          }}>

            {search && (
              <ScrollableListContainer
                // width={SCREEN_WIDTH / 1.15}
                backgroundColor={theme.colors.surfaceVariant}>
                {filteredItems?.map((item, i) => {
                  // netTotal += item.price * item.qty
                  // totalDiscount += (quantity == 0 ? 0 : item.discount_amt)

                  return (
                    <AddedProductList
                      onPress={() => handleRefundedListUpdate(item, i)}
                      itemName={item.item_name}
                      quantity={item.qty}
                      unitPrice={item.price}
                      discount={
                        item?.discount_flag === "Y"
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
            )}
          </View>
        </View>

        {refundedData.length > 0 && (
          <View
            style={{
              paddingHorizontal: normalize(20),
              paddingBottom: normalize(10),
            }}>
            {/* <View
              style={{
                width: SCREEN_WIDTH / 3,
                height: normalize(50),
                backgroundColor: theme.colors.primaryContainer,
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center",
                borderTopLeftRadius: normalize(20),
                borderTopRightRadius: normalize(20),
                // borderColor: theme.colors.onPrimaryContainer,
                // borderStyle: "dashed",
                // borderWidth: 1
              }}>
              <Text variant="headlineMedium">Refund Items</Text>
            </View> */}
            <ScrollableListContainer
              // width={SCREEN_WIDTH / 1.15}
              backgroundColor={theme.colors.primaryContainer}>
              {refundedData?.map((item, i) => {
                netTotal += item.price * item.qty

                // let dis: number = item?.discount_type === "P" ? (item?.dis_pertg / 100) : item?.discount_amt
                item?.discount_position !== "B"
                  ? (totalDiscount += item?.discount_amt)
                  : // ? totalDiscount = item?.tdiscount_amt
                  (totalDiscount = discountBillwise)

                const { totalGST } = gstFilterationAndTotalForRePrint(
                  refundedData,
                  refundedData[0]?.gst_type,
                )
                totalGstForView = totalGST

                console.log("#######################", totalDiscount)

                // const { totalGST } = gstFilterationAndTotalForRePrint(refundedData)
                // totalGst = totalGST
                // item?.gst

                return (
                  <AddedProductList
                    // disabled
                    // onPress={() => removeRefundProduct(item)}
                    onPress={() => handleEditRefundProduct(item)}
                    itemName={item.item_name}
                    quantity={item.qty}
                    unitPrice={item.price}
                    discount={
                      item?.discount_flag === "Y"
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

            <View style={{
              backgroundColor: theme.colors.surfaceVariant,
              marginTop: normalize(10),
              padding: normalize(10),
              borderRadius: normalize(20),
              justifyContent: "space-between"
            }}>

              {receiptSettings?.pay_mode === "Y" && (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    marginRight: normalize(10),
                    marginTop: normalize(5),
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
                    CASH
                  </Text>
                  <RadioButton
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
                    CARD
                  </Text>
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

              {checked === "C" && (
                <View>
                  <View style={{ paddingHorizontal: normalize(20), paddingBottom: normalize(10) }}>
                    <InputPaper
                      label="Given Cash"
                      value={cashAmount}
                      onChangeText={(cash: number) => setCashAmount(cash)}
                      keyboardType="number-pad"
                      leftIcon="cash-multiple"
                      maxLength={8}
                      customStyle={{ marginBottom: normalize(10) }}
                    />
                  </View>
                  <SquircleBox
                    backgroundColor={theme.colors.surface}
                    textColor={theme.colors.onSurface}
                  // height={SCREEN_HEIGHT / 10}
                  >
                    RETURNED AMOUNT: ₹{finalCashAmount}
                  </SquircleBox>
                </View>
              )}

              {refundedData[0]?.discount_position === "B" && (
                <View
                  style={{
                    paddingHorizontal: SCREEN_WIDTH / 20,
                    paddingTop: 5,
                  }}>
                  <InputPaper
                    selectTextOnFocus
                    label={"Discount (₹)"}
                    onChangeText={(dis: number) => setDiscountBillwise(dis)}
                    value={discountBillwise}
                    keyboardType="numeric"
                    mode="flat"
                  />
                </View>
              )}
              <NetTotalForRePrints
                width={300}
                backgroundColor={theme.colors.onSurfaceVariant}
                addedProductsList={refundedData}
                netTotal={netTotal}
                textColor={theme.colors.surfaceVariant}
                totalDiscount={totalDiscount}
                disabled
              />
              {/* <View
                style={{
                  backgroundColor: theme.colors.background,
                  borderWidth: 2,
                  borderRadius: 10,
                  borderStyle: "dashed",
                  borderColor: theme.colors.onSurfaceVariant,
                  width: SCREEN_WIDTH / 1.26,
                  height: SCREEN_HEIGHT / 15,
                  alignSelf: "center",
                  margin: normalize(10),
                  justifyContent: "center",
                  alignItems: "center",
                }}> */}
              {/* <Text variant="titleMedium" style={{ textAlign: "center", color: theme.colors.onTertiaryContainer, textTransform: "uppercase" }}>Refund Amount: ₹{netTotalCalculate(netTotal, totalDiscount)}</Text> */}
              <View style={{
                margin: normalize(15),
              }}>


                <SquircleBox
                  backgroundColor={theme.colors.surface}
                  textColor={theme.colors.onSurface}
                // height={normalize(20)}
                >


                  {refundedData[0]?.gst_flag === "Y" ? (
                    refundedData[0]?.gst_type === "E" ? (
                      <Text
                        variant="titleMedium"
                        style={{
                          textAlign: "center",
                          color: theme.colors.onSurfaceVariant,
                          fontWeight: "800",
                        }}>
                        Refund Amount: ₹
                        {grandTotalWithGSTCalculate(
                          netTotal,
                          totalDiscount,
                          totalGstForView,
                        )}
                      </Text>
                    ) : (
                      <Text
                        variant="titleMedium"
                        style={{
                          textAlign: "center",
                          color: theme.colors.onPrimaryContainer,
                          fontWeight: "800",
                        }}>
                        Refund Amount: ₹
                        {grandTotalWithGSTInclCalculate(netTotal, totalDiscount)}
                      </Text>
                    )
                  ) : (
                    <Text
                      variant="titleMedium"
                      style={{
                        textAlign: "center",
                        color: theme.colors.onSurfaceVariant,
                        fontWeight: "800",
                      }}>
                      Refund Amount: ₹{grandTotalCalculate(netTotal, totalDiscount)}
                    </Text>
                  )}

                  {/* <Text variant="titleMedium" style={{ textAlign: "center", color: theme.colors.onTertiaryContainer, fontWeight: "800" }}>Refund Amount: ₹{grandTotalWithGSTCalculate(netTotal, totalDiscount, totalGst)} {refundedData[0]?.gst_flag === "Y" ? "(incl. GST)" : ""}</Text> */}
                  {/* </View> */}
                </SquircleBox>
              </View>
            </View>
          </View>
        )}



        <View style={{ paddingHorizontal: normalize(30) }}>
          <ButtonPaper
            mode="contained"
            onPress={handleRefundSubmit}
            loading={isLoading}
            disabled={isDisabled}>
            REFUND
          </ButtonPaper>
        </View>
      </ScrollView>
      <DialogBox
        hide={hideDialog}
        onFailure={onDialogFailure}
        onSuccess={
          !editState
            ? () => onDialogSuccessChange(product)
            : () => onDialogEditSuccess(product)
        }
        visible={visible}>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginBottom: normalize(10),
          }}>
          <Text variant="titleMedium" style={{ textAlign: "center" }}>
            {product?.item_name}
          </Text>
        </View>
        {editState ? (
          <View
            style={{
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
            }}>
            <View
              style={{
                width: "80%",
              }}>
              <InputPaper
                autoFocus
                keyboardType="numeric"
                label="Quantity"
                value={quantity}
                onChangeText={(txt: number) => setQuantity(txt)}
              />
            </View>
            <View
              style={{
                width: "20%",
              }}>
              <IconButton
                icon="trash-can-outline"
                onPress={() => removeRefundProduct(product)}
                iconColor={theme.colors.error}
              />
            </View>
          </View>
        ) : (
          <InputPaper
            autoFocus
            keyboardType="numeric"
            label="Quantity"
            value={quantity}
            onChangeText={(txt: number) => setQuantity(txt)}
          />
        )}

        {/* {editState && <IconButton icon="trash-can-outline" onPress={() => removeRefundProduct(product)} iconColor={theme.colors.error} />} */}
      </DialogBox>
    </SafeAreaView>
  )
}

export default RefundItemsDataScreen

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },

  title: {
    textAlign: "center",
  },
})
