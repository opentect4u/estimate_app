import {
  View,
  ScrollView,
  StyleSheet,
  PixelRatio,
  ToastAndroid,
  Alert,
} from "react-native"
import React, { useContext, useEffect, useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { List, Searchbar, Text } from "react-native-paper"
import normalize, { SCREEN_HEIGHT, SCREEN_WIDTH } from "react-native-normalize"
import HeaderImage from "../components/HeaderImage"
import { flowerHome, flowerHomeDark } from "../resources/images"
import ScrollableListContainer from "../components/ScrollableListContainer"
import ProductListSuggestion from "../components/ProductListSuggestion"
import { usePaperColorScheme } from "../theme/theme"
import DialogBox from "../components/DialogBox"
import InputPaper from "../components/InputPaper"
import { clearStates } from "../utils/clearStates"
import {
  AddItemCredentials,
  ItemEditRequestCredentials,
  ItemsData,
} from "../models/api_types"
import { loginStorage } from "../storage/appStorage"
import { useIsFocused } from "@react-navigation/native"
import useEditItem from "../hooks/api/useEditItem"
import { AppStore } from "../context/AppContext"
import AnimatedFABPaper from "../components/AnimatedFABPaper"
import useAddItem from "../hooks/api/useAddItem"
import MenuPaper from "../components/MenuPaper"
import { AppStoreContext } from "../models/custom_types"
// import * as ImagePicker from 'react-native-image-picker'
// import ButtonPaper from "../components/ButtonPaper"

export default function ManageProductsScreen() {
  const theme = usePaperColorScheme()
  const isFocused = useIsFocused()

  const { items, handleGetItems, units, handleGetUnits, categories, handleGetCategories, receiptSettings } =
    useContext<AppStoreContext>(AppStore)

  const loginStore = JSON.parse(loginStorage.getString("login-data"))

  const { editItem } = useEditItem()
  const { sendAddedItem } = useAddItem()

  const [visible, setVisible] = useState(() => false)
  const hideDialog = () => setVisible(() => false)
  const [visibleAdd, setVisibleAdd] = useState(() => false)
  const hideDialogAdd = () => setVisibleAdd(() => false)

  const [search, setSearch] = useState<string>(() => "")
  const [filteredItems, setFilteredItems] = useState<ItemsData[]>(() => [])

  const [isExtended, setIsExtended] = useState(() => true)

  const [product, setProduct] = useState<ItemsData>()

  const [price, setPrice] = useState<number>(() => product?.price)
  const [discount, setDiscount] = useState<number>(() => product?.discount || 0)
  const [CGST, setCGST] = useState<number>(() => product?.cgst || 0)
  const [SGST, setSGST] = useState<number>(() => product?.sgst || 0)

  const [hsnCode, setHsnCode] = useState<string>(() => "0")
  const [productName, setProductName] = useState<string>(
    () => product?.item_name || "",
  )

  const [unitName, setUnitName] = useState<string>(() => "") // not sent to api (adding product)
  const [unitId, setUnitId] = useState<number>(() => undefined)

  const [categoryName, setCategoryName] = useState<string>(() => "") // not sent to api (adding product)
  const [categoryId, setCategoryId] = useState<number>(() => undefined)

  let unitMenuArr = []
  for (const unit of units) {
    unitMenuArr.push({
      title: unit?.unit_name,
      func: () => handleSetUnitNameAndId(unit?.unit_name, unit?.sl_no),
    })
  }

  let categoryMenuArr = []
  for (const category of categories) {
    categoryMenuArr.push({
      title: category?.category_name,
      func: () => handleSetCategoryNameAndId(category?.category_name, category?.sl_no),
    })
  }

  const handleSetUnitNameAndId = (unitName: string, unitId: number) => {
    setUnitName(unitName)
    setUnitId(unitId)
  }

  const handleSetCategoryNameAndId = (catName: string, catId: number) => {
    setCategoryName(catName)
    setCategoryId(catId)
  }

  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition = Math.floor(nativeEvent?.contentOffset?.y) ?? 0
    setIsExtended(currentScrollPosition <= 0)
  }

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


  ///////////////////////////////////////////////////
  ///////////////////////////////////////////////////
  ///////////////////////////////////////////////////

  // const [imageUri, setImageUri] = useState<string | null>(null);
  // const [imageData, setImageData] = useState<string | null>(null);



  // const handleChoosePhoto = () => {
  //   ImagePicker.launchImageLibrary({ mediaType: 'photo' }, (response) => {
  //     if (response.didCancel) {
  //       console.log('User cancelled image picker');
  //     } else if (response.errorMessage) {
  //       console.log('ImagePicker Error: ', response.errorMessage);
  //     } else if (response.assets && response.assets.length > 0) {
  //       const asset = response.assets[0];
  //       if (asset.fileSize && asset.fileSize > 20480) {
  //         Alert.alert('Error', 'Image size exceeds 20KB. Please choose a smaller image.');
  //       } else {
  //         setImageUri(asset.uri);
  //         setImageData(asset.base64 || null);
  //       }
  //     }
  //   });
  // };



  const handleUpdateProductDetails = async () => {
    let editedItemObject: ItemEditRequestCredentials = {
      comp_id: loginStore?.comp_id,
      item_id: product?.item_id,
      price: price,
      discount: discount,
      cgst: CGST,
      sgst: SGST,
      modified_by: loginStore?.user_name,
      unit_id: unitId,
      catg_id: categoryId,
      // unit_name: unitName
      item_name: productName,
      // item_img: imageData
    }

    await editItem(editedItemObject)
      .then(res => {
        ToastAndroid.show("Product updated successfully.", ToastAndroid.SHORT)
        handleGetItems()
        handleGetUnits()
        handleGetCategories()
      })
      .catch(err => {
        ToastAndroid.show(
          "Error while updating product details.",
          ToastAndroid.SHORT,
        )
      })
  }

  const onDialogFailure = () => {
    clearStates([setDiscount, setCGST, setSGST], () => 0)
    clearStates([setPrice, setUnitId, setCategoryId], () => undefined)
    clearStates([setSearch, setUnitName, setProductName, setCategoryName], () => "")
    setVisible(!visible)
  }

  const onDialogSuccecss = () => {
    if (price <= 0) {
      ToastAndroid.show("Try adding some price.", ToastAndroid.SHORT)
      return
    }
    handleUpdateProductDetails()
      .then(() => {
        clearStates(
          [
            setSearch,
            setDiscount,
            setCGST,
            setSGST,
            setUnitName,
            setCategoryName,
            setProductName,
          ],
          () => "",
        )
        clearStates([setPrice, setUnitId, setCategoryId], () => undefined)
        setVisible(!visible)
        setFilteredItems(() => [])
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
    clearStates([setSearch, setHsnCode, setProductName, setUnitName], () => "")
    clearStates([setPrice, setUnitId, setCategoryId], () => undefined)
    setVisibleAdd(!visibleAdd)
  }

  const onDialogSuccecssAdd = () => {
    handleAddProduct()
      .then(() => {
        clearStates([setHsnCode, setProductName, setUnitName], () => "")
        clearStates([setDiscount, setCGST, setSGST], () => 0)
        clearStates([setPrice, setUnitId, setCategoryId], () => undefined)
        setVisibleAdd(!visibleAdd)
      })
      .catch(err => {
        ToastAndroid.show("Something went wrong on server.", ToastAndroid.SHORT)
      })
  }

  const handleAddProduct = async () => {
    let addedProductObject: AddItemCredentials = {
      comp_id: loginStore?.comp_id,
      hsn_code: hsnCode,
      item_name: productName,
      // created_by: loginStore?.user_name,
      created_by: loginStore?.user_id,
      price: price,
      discount: discount,
      cgst: CGST,
      sgst: SGST,
      // unit_name: unitName,
      unit_id: unitId || 0,
      catg_id: categoryId,

      br_id: loginStore?.br_id,
    }

    // if (hsnCode.length === 0 || productName.length === 0) {
    //     ToastAndroid.show("Add Product Name and HSN Code", ToastAndroid.SHORT)
    //     return
    // }
    if (productName.length === 0) {
      ToastAndroid.show("Add Product Name and HSN Code.", ToastAndroid.SHORT)
      return
    }

    if (!categoryId) {
      ToastAndroid.show("Add Category ID.", ToastAndroid.SHORT)
      return
    }

    await sendAddedItem(addedProductObject)
      .then(res => {
        ToastAndroid.show("Product has been added.", ToastAndroid.SHORT)
        handleGetItems()
        handleGetUnits()
        handleGetCategories()
        // console.log("########################", addedProductObject)
      })
      .catch(err => {
        ToastAndroid.show("Something went wrong on server", ToastAndroid.SHORT)
        // console.log("########################", addedProductObject)
      })
  }

  const handleProductPressed = (item: ItemsData) => {
    setProduct(item)

    setPrice(item?.price)
    setDiscount(item?.discount)
    setCGST(item?.cgst)
    setSGST(item?.sgst)
    setProductName(item?.item_name)
    handleSetUnitNameAndId(item?.unit_name, item?.unit_id)
    handleSetCategoryNameAndId(item?.category_name, item?.catg_id)

    setVisible(!visible)
  }

  useEffect(() => {
    handleGetItems()
    handleGetUnits()
    handleGetCategories()
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
        <View
          style={{
            paddingHorizontal: normalize(25),
            paddingBottom: normalize(10),
          }}>
          {loginStore?.user_type === "M" ? (
            <Searchbar
              style={{
                backgroundColor: theme.colors.tertiaryContainer,
                color: theme.colors.onTertiaryContainer,
              }}
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
            minHeight: SCREEN_HEIGHT / 3.2,
            height: "auto",
          }}>
          {/* <View style={{ alignItems: "center" }}>
                        <View>
                            <Text variant="titleLarge">Edit Product</Text>
                        </View>
                    </View> */}

          <View style={{ alignItems: "center" }}>
            <View>
              <Text
                style={{ color: theme.colors.primary }}
                variant="titleLarge">
                {product?.item_name}
              </Text>
            </View>
            <View style={{ width: "50%" }}>
              <Text
                style={{ textAlign: "center", color: theme.colors.secondary }}
                variant="labelMedium">
                Item ID. {product?.item_id}
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 5,
            }}>
            {/* <View style={{ width: "50%" }}>
                            <Text variant="labelMedium">Item ID. {product?.item_id}</Text>
                        </View> */}
            <View
              style={{
                width: "70%",
                alignSelf: "center",
                justifyContent: "center",
              }}>
              <InputPaper
                label="Product Name"
                onChangeText={(txt: string) => setProductName(txt)}
                value={productName}
                keyboardType="default"
                mode="outlined"
                maxLength={30}
              />
            </View>
            <View
              style={{
                width: "30%",
                alignSelf: "center",
                justifyContent: "center",
              }}>
              {/* {
                                receiptSettings?.unit_flag === "Y"
                                && <MenuPaper title={unitName || "Unit"} menuArrOfObjects={unitMenuArr} />
                            } */}
              <MenuPaper
                title={unitName || "Unit"}
                menuArrOfObjects={unitMenuArr}
                customStyle={{ borderRadius: 4 }}
                textColor={theme.colors.primary}
                mode="outlined"
              />
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginVertical: 5,
            }}>
            <View
              style={{
                width: "100%",
                alignSelf: "center",
                justifyContent: "center",
              }}>
              <MenuPaper
                title={categoryName || "Category"}
                menuArrOfObjects={categoryMenuArr}
                customStyle={{ borderRadius: 4 }}
                textColor={theme.colors.primary}
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
            <View style={{ width: "100%", gap: 5 }}>
              <InputPaper
                label="Price"
                onChangeText={(txt: number) => setPrice(txt)}
                value={price}
                keyboardType="numeric"
                mode="outlined"
              />
              {/* <View style={{ width: "100%" }}>
                <ButtonPaper mode="outlined" onPress={() => null}>
                  Add Photo
                </ButtonPaper>
              </View> */}
            </View>
            {/* <View style={{ width: "50%" }}>
              <InputPaper
                label={
                  receiptSettings?.discount_type === "A"
                    ? "Discount (₹)"
                    : "Discount (%)"
                }
                onChangeText={(txt: number) => setDiscount(txt)}
                value={discount}
                keyboardType="numeric"
                mode="outlined"
              />
            </View> */}
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 5,
            }}>
            {/* {receiptSettings?.gst_flag === "Y" && ( */}
            {/* <View style={{ width: "50%" }}>
              <InputPaper
                label="CGST (%)"
                onChangeText={(txt: number) => setCGST(txt)}
                value={CGST}
                keyboardType="numeric"
                mode="outlined"
              />
            </View> */}
            {/* )} */}

            {/* {receiptSettings?.gst_flag === "Y" && ( */}
            {/* <View style={{ width: "50%" }}>
              <InputPaper
                label="SGST (%)"
                onChangeText={(txt: number) => setSGST(txt)}
                value={SGST}
                keyboardType="numeric"
                mode="outlined"
              />
            </View> */}
            {/* )} */}
          </View>
        </View>
      </DialogBox>
      {loginStore?.user_type === "M" && (
        <AnimatedFABPaper
          icon="basket-plus-outline"
          label="Add Product"
          onPress={() => setVisibleAdd(!visibleAdd)}
          extended={isExtended}
          animateFrom="right"
          iconMode="dynamic"
          customStyle={styles.fabStyle}
        />
      )}
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
              <Text variant="titleLarge">Add Product</Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 5,
            }}>
            {/* <View style={{ width: "50%" }}>
                            <Text variant="labelMedium">Sl No.</Text>
                        </View> */}
            <View
              style={
                // receiptSettings?.unit_flag === "Y"
                //     ? { width: "50%" }
                //     : { width: "100%" }
                { width: "50%" }
              }>
              <InputPaper
                selectTextOnFocus
                label="HSN Code"
                onChangeText={(txt: string) => setHsnCode(txt)}
                value={hsnCode}
                keyboardType="numeric"
                autoFocus
                mode="outlined"
              />
            </View>
            {/* {
                            receiptSettings?.unit_flag === "Y"
                            && <View style={{ width: "50%", alignItems: "center", justifyContent: "center" }}>
                                {receiptSettings?.unit_flag === "Y" ? <MenuPaper title={unitName || "Unit"} menuArrOfObjects={unitMenuArr} /> : <Text variant="labelSmall">Unit Off</Text>}
                            </View>
                        } */}
            <View
              style={{
                width: "50%",
                alignItems: "center",
                justifyContent: "center",
              }}>
              <MenuPaper
                title={unitName || "Unit"}
                menuArrOfObjects={unitMenuArr}
                customStyle={{ borderRadius: 4 }}
                textColor={theme.colors.primary}
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
            <View style={{ width: "60%" }}>
              <InputPaper
                label="Product Name"
                onChangeText={(txt: string) => setProductName(txt)}
                value={productName}
                keyboardType="default"
                mode="outlined"
                maxLength={30}
              />
            </View>

            <View style={{ width: "40%" }}>
              <MenuPaper
                title={categoryName || "Category"}
                menuArrOfObjects={categoryMenuArr}
                customStyle={{ borderRadius: 4 }}
                textColor={theme.colors.primary}
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
                label="M.R.P."
                onChangeText={(txt: number) => setPrice(txt)}
                value={price}
                keyboardType="numeric"
                mode="outlined"
              />
            </View>
            <View style={{ width: "50%" }}>
              <InputPaper
                selectTextOnFocus
                label={
                  receiptSettings?.discount_type === "A"
                    ? "Discount (₹)"
                    : "Discount (%)"
                }
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
            {/* {receiptSettings?.gst_flag === "Y" && ( */}
            <View style={{ width: "50%" }}>
              <InputPaper
                selectTextOnFocus
                label="CGST (%)"
                onChangeText={(txt: number) => setCGST(txt)}
                value={CGST}
                keyboardType="numeric"
                mode="outlined"
              />
            </View>
            {/* )} */}

            {/* {receiptSettings?.gst_flag === "Y" && ( */}
            <View style={{ width: "50%" }}>
              <InputPaper
                selectTextOnFocus
                label="SGST (%)"
                onChangeText={(txt: number) => setSGST(txt)}
                value={SGST}
                keyboardType="numeric"
                mode="outlined"
              />
            </View>
            {/* )} */}
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
