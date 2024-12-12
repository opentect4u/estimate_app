import {
  View,
  ScrollView,
  StyleSheet,
  PixelRatio,
  ToastAndroid,
} from "react-native"
import React, { useContext, useEffect, useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { Searchbar, Text } from "react-native-paper"
import normalize, { SCREEN_HEIGHT } from "react-native-normalize"
import HeaderImage from "../components/HeaderImage"
import { productHeader, productHeaderDark } from "../resources/images"
import ScrollableListContainer from "../components/ScrollableListContainer"
import ProductListSuggestion from "../components/ProductListSuggestion"
import { usePaperColorScheme } from "../theme/theme"
import DialogBox from "../components/DialogBox"
import InputPaper from "../components/InputPaper"
import { clearStates } from "../utils/clearStates"
import {
  ItemsData,
  StockSearchCredentials,
  StockUpdateCredentials,
} from "../models/api_types"
import { loginStorage } from "../storage/appStorage"
import { useIsFocused } from "@react-navigation/native"
import { AppStore } from "../context/AppContext"
import useStockSearch from "../hooks/api/useStockSearch"
import useStockUpdate from "../hooks/api/useStockUpdate"
import SurfacePaper from "../components/SurfacePaper"
import { AppStoreContext } from "../models/custom_types"

export default function InventoryScreen() {
  const theme = usePaperColorScheme()
  const isFocused = useIsFocused()

  const loginStore = JSON.parse(loginStorage.getString("login-data"))

  const { items, handleGetItems, units, handleGetUnits, receiptSettings } =
    useContext<AppStoreContext>(AppStore)

  const { fetchStock } = useStockSearch()
  const { updateStock } = useStockUpdate()

  const [product, setProduct] = useState<ItemsData>()
  const [stock, setStock] = useState<number>()
  const [addedStock, setAddedStock] = useState<number>(() => 0)
  const [removedStock, setRemovedStock] = useState<number>(() => 0)
  const [updatedStock, setUpdatedStock] = useState<number>()

  const [search, setSearch] = useState<string>(() => "")
  const [filteredItems, setFilteredItems] = useState<ItemsData[]>(() => [])

  const [visibleAdd, setVisibleAdd] = useState<boolean>(() => false)
  const hideDialogAdd = () => setVisibleAdd(() => false)

  // const onChangeSearch = (query: string) => {
  //     setSearch(query)

  //     const filtered = items.filter((item: ItemsData) => item?.item_name?.includes(query))
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

  const handleProductPressed = (item: ItemsData) => {
    setProduct(item)
    handleFetchStock(item?.item_id).then(() => {
      setVisibleAdd(!visibleAdd)
    })
  }

  const handleFetchStock = async (itemId: number) => {
    let fetchedStockObject: StockSearchCredentials = {
      comp_id: loginStore?.comp_id,
      br_id: loginStore?.br_id,
      // user_id: loginStore?.user_id,
      item_id: itemId,
    }

    await fetchStock(fetchedStockObject)
      .then(res => {
        console.log("handleFetchStock fetchStock", res)
        setStock(res?.stock)
      })
      .catch(err => {
        console.log("Something went wrong in handleFetchStock!", err)
      })
  }

  const handleUpdateStock = async (
    itemId: number,
    addedStock: number,
    removedStock: number,
  ) => {
    let updatedStockObject: StockUpdateCredentials = {
      comp_id: loginStore?.comp_id,
      br_id: loginStore?.br_id,
      user_id: loginStore?.user_id,
      item_id: itemId,
      added_stock: addedStock,
      removed_stock: removedStock,
    }

    await updateStock(updatedStockObject)
      .then(res => {
        ToastAndroid.show(res?.data, ToastAndroid.SHORT)
        setVisibleAdd(!visibleAdd)
        handleGetItems()
      })
      .catch(err => {
        ToastAndroid.show(
          "Something went wrong while updating stock.",
          ToastAndroid.SHORT,
        )
      })
  }

  const onDialogFailureAdd = () => {
    clearStates(
      [setStock, setAddedStock, setRemovedStock, setUpdatedStock],
      () => 0,
    )
    setVisibleAdd(!visibleAdd)
  }

  const onDialogSuccecssAdd = () => {
    if (
      addedStock < 0 ||
      addedStock === undefined ||
      removedStock < 0 ||
      removedStock === undefined ||
      Number.isNaN(updatedStock)
    ) {
      ToastAndroid.show("Try adding some Stock.", ToastAndroid.SHORT)
      return
    }
    if (updatedStock < 0) {
      ToastAndroid.show("Add valid stock.", ToastAndroid.SHORT)
      return
    }
    handleUpdateStock(product?.item_id, addedStock, removedStock).then(() => {
      clearStates(
        [setStock, setAddedStock, setRemovedStock, setUpdatedStock],
        () => 0,
      )
      setVisibleAdd(!visibleAdd)
    })
  }

  useEffect(() => {
    setUpdatedStock(
      //@ts-ignore
      parseFloat(stock) + parseFloat(addedStock) - parseFloat(removedStock),
    )
  }, [addedStock, removedStock])

  useEffect(() => {
    handleGetItems()
    handleGetUnits()
  }, [isFocused])

  return (
    <SafeAreaView
      style={[{ backgroundColor: theme.colors.background, height: "100%" }]}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={{ alignItems: "center" }}>
          <HeaderImage
            isBackEnabled
            imgLight={productHeader}
            imgDark={productHeaderDark}
            borderRadius={30}
            blur={10}>
            Inventory
          </HeaderImage>
        </View>

        <View
          style={{
            paddingHorizontal: normalize(25),
            paddingBottom: normalize(10),
          }}>
          {loginStore?.user_type === "M" ? (
            receiptSettings?.stock_flag === "Y" ? (
              <Searchbar
                placeholder="Search Products"
                onChangeText={onChangeSearch}
                value={search}
                elevation={search && 2}
                // loading={search ? true : false}
                autoFocus
              />
            ) : (
              // : <Text variant="displayMedium" style={{ alignSelf: "center", textAlign: "center", color: theme.colors.pink }}>Inventory is off. Allow Inventory to use this feature.</Text>
              <SurfacePaper
                backgroundColor={theme.colors.pinkContainer}
                elevation={2}
                paddingEnabled
                smallWidthEnabled
                style={{ padding: 15 }}>
                <Text
                  variant="titleLarge"
                  style={{
                    alignSelf: "center",
                    textAlign: "center",
                    color: theme.colors.onPinkContainer,
                  }}>
                  Inventory is off. Allow Inventory from Settings to use this
                  feature.
                </Text>
              </SurfacePaper>
            )
          ) : (
            // <Text variant="displayMedium" style={{ alignSelf: "center", textAlign: "center", color: theme.colors.error }}>You don't have permissions to edit anything!</Text>
            <SurfacePaper
              backgroundColor={theme.colors.pinkContainer}
              elevation={2}
              paddingEnabled
              smallWidthEnabled
              style={{ padding: 15 }}>
              <Text
                variant="titleLarge"
                style={{
                  alignSelf: "center",
                  textAlign: "center",
                  color: theme.colors.onPinkContainer,
                }}>
                You don't have permissions to edit anything!
              </Text>
            </SurfacePaper>
          )}

          {/* {loginStore?.user_type !== "M" && (
                        <Text variant="displayMedium" style={{ alignSelf: "center", textAlign: "center", color: theme.colors.error }}>You don't have permissions to edit anything!</Text>
                    )}
                    {receiptSettings?.stock_flag === "Y" && loginStore?.user_type === "M" ? (
                        <Searchbar
                            placeholder="Search Products"
                            onChangeText={onChangeSearch}
                            value={search}
                            elevation={search && 2}
                            // loading={search ? true : false}
                            autoFocus
                        />
                    ) : (
                        <Text variant="displayMedium" style={{ alignSelf: "center", textAlign: "center", color: theme.colors.pink }}>Inventory is off. Turn on to use Inventory.</Text>
                    )} */}
        </View>

        <View style={{ paddingBottom: PixelRatio.roundToNearestPixel(10) }}>
          {search && (
            <ScrollableListContainer
              backgroundColor={theme.colors.surfaceVariant}>
              {filteredItems.map(item => (
                <ProductListSuggestion
                  key={item.id}
                  itemName={item.item_name}
                  onPress={() => handleProductPressed(item)}
                  // unitPrice={item.price}
                  stock={item.stock}
                  unit={item?.unit_name}
                />
              ))}
            </ScrollableListContainer>
          )}
        </View>
      </ScrollView>
      <DialogBox
        iconSize={40}
        visible={visibleAdd}
        hide={hideDialogAdd}
        titleStyle={styles.title}
        btnSuccess="SAVE"
        onFailure={onDialogFailureAdd}
        onSuccess={onDialogSuccecssAdd}>
        <View
          style={{
            justifyContent: "space-between",
            minHeight: normalize(200),
            height: "auto",
          }}>
          <View style={{ alignItems: "center" }}>
            <View>
              <Text variant="titleLarge">Updating Stock</Text>
            </View>
          </View>

          <View style={{ alignItems: "center" }}>
            <View>
              <Text variant="titleMedium">{product?.item_name}</Text>
            </View>
          </View>

          {receiptSettings?.unit_flag === "Y" && (
            <View
              style={{
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
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
            }}>
            <View>
              <Text variant="labelMedium">STOCK AVAILABLE</Text>
            </View>
            <View>
              <Text variant="labelMedium">{stock}</Text>
            </View>
          </View>

          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              gap: 5,
            }}>
            <View style={{ width: "50%" }}>
              <InputPaper
                selectTextOnFocus
                autoFocus
                label="Add"
                onChangeText={(txt: number) => setAddedStock(txt)}
                value={addedStock}
                keyboardType="numeric"
                mode="outlined"
                maxLength={6}
              />
            </View>
            <View style={{ width: "50%" }}>
              <InputPaper
                selectTextOnFocus
                label="Less"
                onChangeText={(txt: number) => setRemovedStock(txt)}
                value={removedStock}
                keyboardType="numeric"
                mode="outlined"
                maxLength={6}
              />
            </View>
          </View>

          <View
            style={{
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
            }}>
            <View>
              <Text variant="labelLarge">UPDATED STOCK</Text>
            </View>
            <View>
              <Text variant="bodyMedium" style={{ color: theme.colors.green }}>
                {updatedStock || stock}
              </Text>
            </View>
          </View>
        </View>
      </DialogBox>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  fabStyle: {
    bottom: normalize(16),
    right: normalize(16),
    position: "absolute",
  },
  title: {
    textAlign: "center",
  },
})
