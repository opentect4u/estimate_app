import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  View,
  PixelRatio,
  ToastAndroid,
} from "react-native"
import { Searchbar, Text } from "react-native-paper"
import HeaderImage from "../components/HeaderImage"
import { productHeader, productHeaderDark } from "../resources/images"
import { usePaperColorScheme } from "../theme/theme"
import { useContext, useEffect, useRef, useState } from "react"
import DialogBox from "../components/DialogBox"
import {
  CommonActions,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native"
import InputPaper from "../components/InputPaper"
import normalize, { SCREEN_HEIGHT, SCREEN_WIDTH } from "react-native-normalize"
import ProductListSuggestion from "../components/ProductListSuggestion"
import AddedProductList from "../components/AddedProductList"
import ScrollableListContainer from "../components/ScrollableListContainer"
import NetTotalButton from "../components/NetTotalButton"
import { clearStates } from "../utils/clearStates"
import {
  ItemsData,
  StockSearchCredentials,
  StockUpdateCredentials,
} from "../models/api_types"
import ButtonPaper from "../components/ButtonPaper"
import navigationRoutes from "../routes/navigationRoutes"
import { AppStore } from "../context/AppContext"
import { loginStorage } from "../storage/appStorage"
import useStockSearch from "../hooks/api/useStockSearch"
import useStockUpdate from "../hooks/api/useStockUpdate"

function ProductsScreen() {
  const navigation = useNavigation()
  const isFocused = useIsFocused()

  const theme = usePaperColorScheme()

  const { receiptSettings, items, handleGetItems } = useContext(AppStore)

  const loginStore = JSON.parse(loginStorage.getString("login-data"))

  const searchProductRef = useRef(null)

  const { fetchStock } = useStockSearch()

  const [visible, setVisible] = useState(() => false)
  const hideDialog = () => setVisible(() => false)
  const [editState, setEditState] = useState<boolean>(() => false)

  const [search, setSearch] = useState<string>(() => "")
  const [filteredItems, setFilteredItems] = useState<ItemsData[]>(() => [])

  const [product, setProduct] = useState<ItemsData>()
  const [quantity, setQuantity] = useState<number>()
  const [discountState, setDiscountState] = useState<number>(() => 0)
  const [price, setPrice] = useState<number>(() => product?.price)
  const [stock, setStock] = useState<number>()
  const [updatedStock, setUpdatedStock] = useState<number>()
  const [discountBillwise, setDiscountBillwise] = useState<number>(() => 0)

  const [addedProductsList, setAddedProductsList] = useState<ItemsData[]>(
    () => [],
  )

  let totalPrice = 0
  let totalDiscountedAmount = 0
  let discountWithQtyMultiplier = 0

  useEffect(() => {
    handleGetItems()
  }, [isFocused])

  // const onChangeSearch = (query: string) => {
  //   setSearch(query)

  //   const filtered = items.filter((item: ItemsData) => item?.item_name?.includes(query))
  //   setFilteredItems(filtered)
  //   if (query === "") setFilteredItems(() => [])
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

  const handleFetchStock = async (itemId: number) => {
    let fetchedStockObject: StockSearchCredentials = {
      comp_id: loginStore?.comp_id,
      br_id: loginStore?.br_id,
      // user_id: loginStore?.user_id,
      item_id: itemId,
    }

    console.log(
      "BRRRRRRRRRR IDDDDDDDDDDDDD loginStore?.br_id",
      loginStore?.br_id,
    )

    await fetchStock(fetchedStockObject)
      .then(res => {
        console.log("handleFetchStock fetchStock", res)
        setStock(res?.stock)
      })
      .catch(err => {
        console.log("Something went wrong in handleFetchStock!", err)
      })
  }

  const productDetails = (item: ItemsData) => {
    setProduct(item)

    setDiscountState(item?.discount)
    setPrice(item?.price)
    handleFetchStock(item?.item_id)
    setVisible(!visible)
  }

  const productEditAndDelete = (item: ItemsData) => {
    setEditState(true)

    setProduct(item)
    setQuantity(item?.quantity)
    setDiscountState(item?.discount)
    setPrice(item?.price)
    setVisible(!visible)
  }

  const handleOnDelete = (product: ItemsData) => {
    setAddedProductsList(prevData =>
      prevData?.filter((item, index) => item.id !== product.id),
    )

    setVisible(!visible)
    setEditState(false)
  }

  const onDialogFailure = () => {
    setEditState(false)
    setSearch(() => "")
    clearStates([setQuantity, setStock, setUpdatedStock], () => undefined)

    setVisible(!visible)
  }

  const onDialogSuccecss = () => {
    let isFoundDuplicate = false
    setEditState(false)

    console.log("OK PRODUCT: ", product?.item_name)

    for (let item of addedProductsList) {
      if (item?.id === product?.id) {
        ToastAndroid.show(
          "Item already exists. Please edit from the list.",
          ToastAndroid.LONG,
        )
        isFoundDuplicate = true
        break
      }
    }

    if (!isFoundDuplicate) {
      addProducts()

      discountState > 0
        ? setDiscountState(() => discountState)
        : setDiscountState(() => product?.discount)
      price > 0 ? setPrice(() => price) : setPrice(() => product?.price)

      clearStates([setSearch], () => "")
      setQuantity(() => undefined)
      clearStates(
        [setPrice, setDiscountState, setStock, setUpdatedStock],
        () => undefined,
      )
      setVisible(!visible)
      setFilteredItems(() => [])
    }
    console.log("asiurweagsaygeutseygfsdytfgsydtfse", quantity)

    if (searchProductRef.current) {
      searchProductRef.current.focus()
    }
  }

  const onDialogSuccessChange = () => {
    if (receiptSettings?.stock_flag === "Y") {
      if (
        quantity <= 0 ||
        typeof quantity === "undefined" ||
        Number.isNaN(quantity) ||
        updatedStock <= 0
      ) {
        ToastAndroid.show("Try adding valid numbers!", ToastAndroid.SHORT)
        return
      }
    } else {
      if (
        quantity <= 0 ||
        typeof quantity === "undefined" ||
        Number.isNaN(quantity)
      ) {
        ToastAndroid.show("Try adding valid numbers!", ToastAndroid.SHORT)
        return
      }
    }

    if (receiptSettings?.discount_type === "P") {
      if (discountState > 100) {
        ToastAndroid.show(
          "Discount cannot be greater than 100%.",
          ToastAndroid.SHORT,
        )
        return
      }
    } else if (product.price * quantity < discountState) {
      ToastAndroid.show("Give valid Discount Amount.", ToastAndroid.SHORT)
      return
    }

    if (receiptSettings?.stock_flag === "Y") {
      if (stock === undefined || stock === null) {
        ToastAndroid.show(
          "No stock availabe. Add stock for this product.",
          ToastAndroid.SHORT,
        )
        return
      }
    }

    onDialogSuccecss()
  }

  const onDialogUpdate = (product: ItemsData) => {
    setEditState(false)
    console.log("OK PRODUCT UPDATE: ", product?.item_name)

    let filteredSingleProductArray = addedProductsList?.filter(
      (item, index) => item?.id === product?.id,
    )

    filteredSingleProductArray[0]["quantity"] = quantity
    filteredSingleProductArray[0]["discount"] = discountState
    filteredSingleProductArray[0]["price"] = price

    discountState > 0
      ? setDiscountState(() => discountState)
      : setDiscountState(() => product?.discount)
    price > 0 ? setPrice(() => price) : setPrice(() => product?.price)

    setProduct(filteredSingleProductArray[0])

    clearStates([setSearch], () => "")
    setQuantity(() => undefined)
    clearStates([setPrice, setDiscountState], () => 0)
    setVisible(!visible)
    setFilteredItems(() => [])
  }

  const onDialogUpdateChange = (product: ItemsData) => {
    if (
      quantity <= 0 ||
      typeof quantity === "undefined" ||
      Number.isNaN(quantity) ||
      updatedStock <= 0
    ) {
      ToastAndroid.show("Try adding valid numbers!", ToastAndroid.SHORT)
      return
    }

    if (
      price <= 0 ||
      typeof price === "undefined" ||
      price.toString() === "NaN"
    ) {
      ToastAndroid.show("Try adding valid price.", ToastAndroid.SHORT)
      return
    }

    if (receiptSettings?.discount_type === "P" && discountState > 100) {
      ToastAndroid.show(
        "Discount cannot be greater than 100%.",
        ToastAndroid.SHORT,
      )
      return
    }

    if (
      receiptSettings?.discount_type === "P" ||
      product.price * quantity >= discountState
    ) {
      onDialogUpdate(product)
      return
    }

    ToastAndroid.show("Give valid Discount Amount.", ToastAndroid.SHORT)
  }

  const addProducts = () => {
    // addedProductsList.push(product)
    addedProductsList.unshift(product)
    product["quantity"] = quantity
    if (discountState > 0) product["discount"] = discountState
    if (price > 0) product["price"] = price
    setAddedProductsList([...addedProductsList])
    console.log("==========ADDED PRODUCTS LIST==========", addedProductsList)
  }

  useEffect(() => {
    //@ts-ignore
    setUpdatedStock(parseInt(stock) - parseInt(quantity))
  }, [quantity])

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <DialogBox
        iconSize={40}
        visible={visible}
        hide={hideDialog}
        titleStyle={styles.title}
        btnSuccess={!editState ? "ADD" : "UPDATE"}
        onFailure={onDialogFailure}
        onSuccess={
          !editState
            ? onDialogSuccessChange
            : () => onDialogUpdateChange(product)
        }>
        <View style={styles.modalContainer}>
          <View style={{ alignItems: "center" }}>
            <View>
              <Text
                variant="titleLarge"
                style={{ color: theme.colors.primary }}>
                {product?.item_name}
              </Text>
            </View>
          </View>

          <View
            style={{
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
              // marginHorizontal: SCREEN_WIDTH / 10
            }}>
            <View>
              <Text variant="labelMedium">PRODUCT ID</Text>
            </View>
            <View>
              <Text variant="labelMedium">{product?.id}</Text>
            </View>
          </View>

          {receiptSettings?.unit_flag === "Y" && (
            <View
              style={{
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
                // marginHorizontal: SCREEN_WIDTH / 10
              }}>
              <View>
                <Text variant="labelMedium">UNIT</Text>
              </View>
              <View>
                <Text variant="labelMedium">{product?.unit_name || ""}</Text>
              </View>
            </View>
          )}

          <View
            style={{
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
              // marginHorizontal: SCREEN_WIDTH / 10
            }}>
            {receiptSettings?.price_type === "A" ? (
              <>
                <View>
                  <Text variant="labelMedium">UNIT PRICE</Text>
                </View>
                <View>
                  <Text variant="labelMedium">₹{product?.price}</Text>
                </View>
              </>
            ) : (
              <View style={{ width: "100%" }}>
                <InputPaper
                  label="Unit Price"
                  onChangeText={(txt: number) => setPrice(txt)}
                  value={price}
                  keyboardType="numeric"
                  autoFocus={true}
                  mode="outlined"
                />
              </View>
            )}
          </View>

          {receiptSettings?.stock_flag === "Y" && (
            <View
              style={{
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
                // marginHorizontal: SCREEN_WIDTH / 10
              }}>
              <View>
                <Text variant="labelMedium">STOCK AVAILABLE</Text>
              </View>
              <View>
                <Text variant="labelMedium">{updatedStock || stock}</Text>
              </View>
            </View>
          )}

          {receiptSettings?.gst_flag === "Y" && (
            <View
              style={{
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "column",
                // marginHorizontal: SCREEN_WIDTH / 10
              }}>
              <View
                style={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexDirection: "row",
                  width: "100%",
                }}>
                <View>
                  <Text variant="labelMedium">CGST</Text>
                </View>
                <View>
                  <Text variant="labelMedium">{product?.cgst || ""}%</Text>
                </View>
              </View>
              <View
                style={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexDirection: "row",
                  width: "100%",
                }}>
                <View>
                  <Text variant="labelMedium">SGST</Text>
                </View>
                <View>
                  <Text variant="labelMedium">{product?.sgst || ""}%</Text>
                </View>
              </View>
            </View>
          )}

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 5,
            }}>
            <View
              style={
                receiptSettings?.discount_flag === "Y" &&
                receiptSettings?.discount_position !== "B"
                  ? { width: "50%" }
                  : { width: "100%" }
              }>
              <InputPaper
                label={`Quantity (${
                  (receiptSettings?.unit_flag === "Y" && product?.unit_name) ||
                  ""
                })`}
                onChangeText={(txt: number) => setQuantity(txt)}
                value={quantity}
                keyboardType="numeric"
                autoFocus={true}
                mode="outlined"
              />
            </View>
            {receiptSettings?.discount_flag === "Y" &&
              receiptSettings?.discount_position !== "B" && (
                <View style={{ width: "50%" }}>
                  <InputPaper
                    selectTextOnFocus
                    label={
                      receiptSettings?.discount_type === "A"
                        ? "Discount (₹)"
                        : "Discount (%)"
                    }
                    onChangeText={(dis: number) => setDiscountState(dis)}
                    value={discountState}
                    keyboardType="numeric"
                    mode="outlined"
                  />
                </View>
              )}
          </View>
          {editState && (
            <View
              style={{ marginBottom: normalize(-10), marginTop: normalize(5) }}>
              <ButtonPaper
                mode="text"
                textColor={theme.colors.purple}
                icon="trash-can-outline"
                onPress={() => handleOnDelete(product)}>
                DELETE ITEM
              </ButtonPaper>
            </View>
          )}
        </View>
      </DialogBox>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={{ alignItems: "center" }}>
          <HeaderImage
            imgLight={productHeader}
            imgDark={productHeaderDark}
            borderRadius={30}
            blur={10}
            isBackEnabled>
            My Products
          </HeaderImage>
        </View>

        <View
          style={{
            paddingHorizontal: normalize(25),
            paddingBottom: normalize(10),
          }}>
          <Searchbar
            ref={searchProductRef}
            placeholder="Search Products"
            onChangeText={onChangeSearch}
            value={search}
            elevation={search && 2}
            // loading={search ? true : false}
            autoFocus
          />
        </View>

        <View style={{ paddingBottom: PixelRatio.roundToNearestPixel(10) }}>
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

          {addedProductsList.length > 0 && !search && (
            <>
              <ScrollableListContainer
                backgroundColor={theme.colors.pinkContainer}>
                {addedProductsList.map(item => {
                  totalPrice += item?.price * item["quantity"]

                  receiptSettings?.discount_flag === "Y"
                    ? receiptSettings?.discount_position === "I"
                      ? receiptSettings?.discount_type === "A"
                        ? //@ts-ignore
                          (totalDiscountedAmount += parseFloat(
                            item["discount"] * item["quantity"],
                          ))
                        : (totalDiscountedAmount += parseFloat(
                            (
                              (item?.price *
                                item["quantity"] *
                                item["discount"]) /
                              100
                            ).toFixed(2),
                          ))
                      : receiptSettings?.discount_type === "A"
                      ? (totalDiscountedAmount = discountBillwise)
                      : (totalDiscountedAmount += parseFloat(
                          (
                            (item?.price *
                              item["quantity"] *
                              discountBillwise) /
                            100
                          ).toFixed(2),
                        ))
                    : (totalDiscountedAmount = 0)

                  console.log("totalDiscount", totalDiscountedAmount)

                  return (
                    <AddedProductList
                      key={item?.id}
                      itemName={item?.item_name}
                      quantity={item["quantity"]}
                      unitPrice={item["price"]}
                      discount={
                        receiptSettings?.discount_flag === "Y"
                          ? item["discount"]
                          : 0
                      }
                      unit={item["unit_name"]}
                      onPress={() => productEditAndDelete(item)}
                    />
                  )
                })}
              </ScrollableListContainer>

              {receiptSettings?.discount_position === "B" && (
                <View
                  style={{
                    paddingHorizontal: SCREEN_WIDTH / 10.5,
                    paddingTop: 14,
                  }}>
                  <InputPaper
                    selectTextOnFocus
                    label={
                      receiptSettings?.discount_type === "A"
                        ? "Discount (₹)"
                        : "Discount (%)"
                    }
                    onChangeText={(dis: number) => setDiscountBillwise(dis)}
                    value={discountBillwise}
                    keyboardType="numeric"
                    mode="flat"
                  />
                </View>
              )}
            </>
          )}

          {/* {
            receiptSettings?.discount_position === "B"
            && <InputPaper
              label={"Discount"}
              onChangeText={(dis: number) => setDiscountBillwise(dis)}
              value={discountBillwise}
              keyboardType="numeric"
              mode="outlined"
            />
          } */}

          {totalPrice > 0 && (
            <>
              <NetTotalButton
                disabled
                // backgroundColor={theme.colors.greenContainer}
                backgroundColor={theme.colors.primaryContainer}
                textColor={theme.colors.onPrimaryContainer}
                addedProductsList={addedProductsList}
                netTotal={totalPrice}
                totalDiscount={totalDiscountedAmount}
                onPress={() =>
                  ToastAndroid.showWithGravityAndOffset(
                    "Printing feature will be added in some days.",
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER,
                    25,
                    50,
                  )
                }
              />
              <View
                style={{
                  paddingTop: normalize(15),
                  width: SCREEN_WIDTH / 1.16,
                  alignSelf: "center",
                  justifyContent: "center",
                }}>
                <ButtonPaper
                  mode="text"
                  textColor={theme.colors.purple}
                  onPress={() =>
                    navigation.dispatch(
                      CommonActions.navigate({
                        name: navigationRoutes.customerDetailsFillScreen,
                        params: {
                          added_products: addedProductsList,
                          net_total: totalPrice,
                          total_discount: totalDiscountedAmount,
                        },
                      }),
                    )
                  }
                  icon={"arrow-right-thick"}>
                  PRINT RECEIPT
                </ButtonPaper>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ProductsScreen

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  title: {
    textAlign: "center",
  },
  modalContainer: {
    justifyContent: "space-between",
    minHeight: normalize(230),
    height: "auto",
  },
})
