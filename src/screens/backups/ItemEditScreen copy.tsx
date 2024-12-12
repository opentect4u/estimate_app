import {
  View,
  ScrollView,
  StyleSheet,
  PixelRatio,
  ToastAndroid,
} from "react-native"
import React, { useContext, useEffect, useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { List, Searchbar, Text } from "react-native-paper"
import normalize, { SCREEN_HEIGHT } from "react-native-normalize"
import HeaderImage from "../components/HeaderImage"
import { flowerHome, flowerHomeDark } from "../resources/images"
import ScrollableListContainer from "../components/ScrollableListContainer"
import ProductListSuggestion from "../components/ProductListSuggestion"
import { usePaperColorScheme } from "../theme/theme"
import DialogBox from "../components/DialogBox"
import InputPaper from "../components/InputPaper"
import { clearStates } from "../utils/clearStates"
import { ItemsData } from "../models/api_types"
import { loginStorage } from "../storage/appStorage"
import { useIsFocused } from "@react-navigation/native"
import useEditItem from "../hooks/api/useEditItem"
import { AppStore } from "../context/AppContext"
import AnimatedFABPaper from "../components/AnimatedFABPaper"

export default function ItemEditScreen() {
  const theme = usePaperColorScheme()
  const isFocused = useIsFocused()

  const { items, handleGetItems } = useContext(AppStore)

  const loginStore = JSON.parse(loginStorage.getString("login-data"))

  const { editItem } = useEditItem()

  const [visible, setVisible] = useState(() => false)
  const hideDialog = () => setVisible(() => false)
  const [visibleAdd, setVisibleAdd] = useState(() => false)
  const hideDialogAdd = () => setVisibleAdd(() => false)

  const [search, setSearch] = useState<string>(() => "")
  const [filteredItems, setFilteredItems] = useState<ItemsData[]>(() => [])

  const [isExtended, setIsExtended] = useState(() => true)

  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition = Math.floor(nativeEvent?.contentOffset?.y) ?? 0
    setIsExtended(currentScrollPosition <= 0)
  }

  const onChangeSearch = (query: string) => {
    setSearch(query)

    const filtered = items.filter((item: ItemsData) =>
      item?.item_name?.includes(query),
    )
    setFilteredItems(filtered)
    if (query === "") setFilteredItems(() => [])
  }

  const [product, setProduct] = useState<ItemsData>()

  const [price, setPrice] = useState<number>(() => product?.price)
  const [discount, setDiscount] = useState<number>(() => product?.discount || 0)
  const [CGST, setCGST] = useState<number>(() => product?.cgst || 0)
  const [SGST, setSGST] = useState<number>(() => product?.sgst || 0)

  const [hsnCode, setHsnCode] = useState<string>(() => "")
  const [productName, setProductName] = useState<string>(() => "")
  const [mrp, setMrp] = useState<number>(() => undefined)
  // const [discount, setDiscount] = useState(() => "")
  // const [CGST, setCGST] = useState<string>(() => "")
  // const [SGST, setSGST] = useState<string>(() => "")

  const handleUpdateProductDetails = async () => {
    await editItem(
      loginStore?.comp_id,
      product?.item_id,
      price,
      discount,
      CGST,
      SGST,
      loginStore?.user_name,
    )
      .then(res => {
        ToastAndroid.show("Product updated successfully.", ToastAndroid.SHORT)
      })
      .catch(err => {
        ToastAndroid.show(
          "Error while updating product details.",
          ToastAndroid.SHORT,
        )
      })
  }

  const onDialogFailure = () => {
    clearStates([setPrice, setDiscount, setCGST, setSGST], () => undefined)
    setSearch(() => "")
    setVisible(!visible)
  }

  const onDialogSuccecss = () => {
    handleUpdateProductDetails()
      .then(() => {
        clearStates(
          [setSearch, setPrice, setDiscount, setCGST, setSGST],
          () => "",
        )
        setVisible(!visible)
        setFilteredItems(() => [])

        ToastAndroid.show("Product Updated Successfully.", ToastAndroid.SHORT)
      })
      .catch(err => {
        ToastAndroid.show(
          "An error occurred while updating product",
          ToastAndroid.SHORT,
        )
      })
  }

  const onDialogFailureAdd = () => {
    clearStates([setDiscount, setCGST, setSGST], () => 0)
    clearStates([setHsnCode, setProductName], () => "")
    setMrp(() => undefined)
    setSearch(() => "")
    setVisibleAdd(!visibleAdd)
  }

  const onDialogSuccecssAdd = () => {
    clearStates(
      [
        setSearch,
        setHsnCode,
        setProductName,
        setMrp,
        setDiscount,
        setCGST,
        setSGST,
      ],
      () => "",
    )
    setVisibleAdd(!visibleAdd)
    // setFilteredItems(() => [])
  }

  const handleProductPressed = (item: ItemsData) => {
    setProduct(item)

    setPrice(item?.price)
    setDiscount(item?.discount)
    setCGST(item?.cgst)
    setSGST(item?.sgst)

    setVisible(!visible)
  }

  useEffect(() => {
    handleGetItems()
  }, [isFocused])

  return (
    <SafeAreaView
      style={[{ backgroundColor: theme.colors.background, height: "100%" }]}>
      <ScrollView keyboardShouldPersistTaps="handled" onScroll={onScroll}>
        <View style={{ alignItems: "center" }}>
          <HeaderImage
            isBackEnabled
            imgLight={flowerHome}
            imgDark={flowerHomeDark}
            borderRadius={30}
            blur={10}>
            Manage Products
          </HeaderImage>
        </View>
        <View style={{ padding: normalize(20) }}>
          {loginStore?.user_type === "M" ? (
            <Searchbar
              placeholder="Search Products"
              onChangeText={onChangeSearch}
              value={search}
              elevation={search && 2}
              // loading={search ? true : false}
              autoFocus
            />
          ) : (
            <Text
              variant="displayMedium"
              style={{
                alignSelf: "center",
                textAlign: "center",
                color: theme.colors.error,
              }}>
              You don't have permissions to edit anything!
            </Text>
          )}
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
                  unitPrice={item.price}
                />
              ))}
            </ScrollableListContainer>
          )}
        </View>
      </ScrollView>
      <DialogBox
        iconSize={40}
        visible={visible}
        hide={hideDialog}
        titleStyle={styles.title}
        btnSuccess="SAVE"
        onFailure={onDialogFailure}
        onSuccess={onDialogSuccecss}>
        <View
          style={{
            justifyContent: "space-between",
            minHeight: SCREEN_HEIGHT / 4,
            height: "auto",
          }}>
          <View style={{ alignItems: "center" }}>
            <View>
              <Text variant="titleLarge">Edit Item</Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 5,
            }}>
            <View style={{ width: "50%" }}>
              <Text variant="labelMedium">Item ID {product?.item_id}</Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 5,
            }}>
            <View style={{ width: "50%" }}>
              <InputPaper
                label="Price"
                onChangeText={(txt: number) => setPrice(txt)}
                value={price}
                keyboardType="numeric"
                mode="outlined"
              />
            </View>
            <View style={{ width: "50%" }}>
              <InputPaper
                label="Discount"
                onChangeText={(txt: number) => setDiscount(txt)}
                value={discount}
                keyboardType="numeric"
                mode="outlined"
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 5,
            }}>
            <View style={{ width: "50%" }}>
              <InputPaper
                label="CGST (%)"
                onChangeText={(txt: number) => setCGST(txt)}
                value={CGST}
                keyboardType="numeric"
                mode="outlined"
              />
            </View>
            <View style={{ width: "50%" }}>
              <InputPaper
                label="SGST (%)"
                onChangeText={(txt: number) => setSGST(txt)}
                value={SGST}
                keyboardType="numeric"
                mode="outlined"
              />
            </View>
          </View>
        </View>
      </DialogBox>
      <AnimatedFABPaper
        icon="plus"
        label="Add Product"
        onPress={() => setVisibleAdd(!visibleAdd)}
        extended={isExtended}
        animateFrom="right"
        iconMode="dynamic"
        customStyle={styles.fabStyle}
      />
      <DialogBox
        iconSize={40}
        visible={visibleAdd}
        hide={hideDialogAdd}
        titleStyle={styles.title}
        btnSuccess="SAVE"
        onFailure={onDialogFailureAdd}
        onSuccess={onDialogSuccecssAdd}>
        <View style={{ justifyContent: "space-between", height: 300 }}>
          <View style={{ alignItems: "center" }}>
            <View>
              <Text variant="titleLarge">Adding Product</Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 5,
            }}>
            <View style={{ width: "50%" }}>
              <Text variant="labelMedium">Sl No.</Text>
            </View>
            <View style={{ width: "50%" }}>
              <InputPaper
                label="HSN Code"
                onChangeText={(txt: string) => setHsnCode(txt)}
                value={hsnCode}
                keyboardType="default"
                autoFocus
                mode="outlined"
              />
            </View>
          </View>

          <View style={{ width: "100%" }}>
            <InputPaper
              label="Item Name"
              onChangeText={(txt: string) => setProductName(txt)}
              value={productName}
              keyboardType="default"
              mode="outlined"
            />
          </View>

          <View
            style={{
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
              marginLeft: 10,
              marginRight: 10,
            }}></View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 5,
            }}>
            <View style={{ width: "50%" }}>
              <InputPaper
                label="M.R.P."
                onChangeText={(txt: number) => setMrp(txt)}
                value={mrp}
                keyboardType="numeric"
                mode="outlined"
              />
            </View>
            <View style={{ width: "50%" }}>
              <InputPaper
                label="Discount"
                onChangeText={(txt: number) => setDiscount(txt)}
                value={discount}
                keyboardType="numeric"
                mode="outlined"
              />
            </View>
          </View>

          <View></View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 5,
            }}>
            <View style={{ width: "50%" }}>
              <InputPaper
                label="CGST (%)"
                onChangeText={(txt: number) => setCGST(txt)}
                value={CGST}
                keyboardType="numeric"
                mode="outlined"
              />
            </View>
            <View style={{ width: "50%" }}>
              <InputPaper
                label="SGST (%)"
                onChangeText={(txt: number) => setSGST(txt)}
                value={SGST}
                keyboardType="numeric"
                mode="outlined"
              />
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
