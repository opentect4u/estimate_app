import React, { useContext, useEffect, useState } from "react"
import {
    StyleSheet,
    ScrollView,
    SafeAreaView,
    View,
    ToastAndroid,
    Alert
} from "react-native"
import { Divider, IconButton, List, Text } from "react-native-paper"
import HeaderImage from "../components/HeaderImage"
import {
    textureReport,
    textureReportDark,
} from "../resources/images"
import { usePaperColorScheme } from "../theme/theme"
import { CommonActions, useNavigation, useRoute } from "@react-navigation/native"
import { itemsContextStorage, loginStorage, productStorage } from "../storage/appStorage"
import { AppStore } from "../context/AppContext"
import { CategoryProductsScreenRouteProp } from "../models/route_types"
import { ItemsData, StockSearchCredentials } from "../models/api_types"
import normalize, { SCREEN_HEIGHT } from "react-native-normalize"
import AddRemove from "../components/AddRemove"
import useStockSearch from "../hooks/api/useStockSearch"
import DialogBox from "../components/DialogBox"
import { AppStoreContext } from "../models/custom_types"
import { clearStates } from "../utils/clearStates"
import InputPaper from "../components/InputPaper"
import navigationRoutes from "../routes/navigationRoutes"
import SnackBar from "../components/SnackBar"
import ButtonPaper from "../components/ButtonPaper"
import AnimatedFABPaper from "../components/AnimatedFABPaper"
import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler"

const LeftActions = () => (<View style={styles.leftAction}> <Text style={styles.actionText}>Left Action</Text> </View>);
const RightActions = () => (<View style={styles.rightAction}> <Text style={styles.actionText}>Right Action</Text> </View>);

function CartScreen() {
    const theme = usePaperColorScheme()
    const navigation = useNavigation()
    const { receiptSettings } = useContext<AppStoreContext>(AppStore)
    const { params } = useRoute<CategoryProductsScreenRouteProp>()

    const loginStore = JSON.parse(loginStorage.getString("login-data"))
    let itemsStore: []
    let totalAmountStore: number
    let totalDiscountedAmountStore: number

    try {
        const itemsData = itemsContextStorage.getString("items-data")
        const totalAmountData = itemsContextStorage.getString("total-amount-data")
        const totalDiscountedAmountData = itemsContextStorage.getString("total-discount-data")

        itemsStore = itemsData ? JSON.parse(itemsData) : []
        totalAmountStore = totalAmountData ? parseFloat(totalAmountData) : 0
        totalDiscountedAmountStore = totalDiscountedAmountData ? parseFloat(totalDiscountedAmountData) : 0
    } catch (error) {
        console.error("Failed to parse items-data:", error)
        itemsStore = []
        totalAmountStore = 0
        totalDiscountedAmountStore = 0
    }

    const { fetchStock } = useStockSearch()

    const [visible, setVisible] = useState(() => false)
    const hideDialog = () => setVisible(() => false)

    const [product, setProduct] = useState<ItemsData>()
    const [quantity, setQuantity] = useState<number>()
    const [discountState, setDiscountState] = useState<number>(() => 0)
    const [price, setPrice] = useState<number>(() => product?.price)
    const [stock, setStock] = useState<number>()
    const [updatedStock, setUpdatedStock] = useState<number>()
    const [addedProductsList, setAddedProductsList] = useState<ItemsData[]>(
        () => params?.added_products,
    )
    // const [disableAddButton, setDisableAddButton] = useState(() => false)

    const [totalPrice, setTotalPrice] = useState(() => totalAmountStore | 0)
    const [totalDiscountedAmount, setTotalDiscountedAmount] = useState(() => totalDiscountedAmountStore | 0)

    const [isDataAvailable, setIsDataAvailable] = useState<boolean>(false)

    const handleFetchStock = async (itemId: number) => {
        let fetchedStockObject: StockSearchCredentials = {
            comp_id: loginStore?.comp_id,
            br_id: loginStore?.br_id,
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
        setQuantity(
            addedProductsList?.find(i => i.item_id === item?.item_id)?.quantity || 0
        )
        handleFetchStock(item?.item_id)
        setVisible(!visible)
    }

    const onDialogFailure = () => {
        clearStates([setQuantity, setStock, setUpdatedStock], () => undefined)

        setVisible(!visible)
    }

    const onDialogSuccecss = (item: ItemsData) => {
        setAddedProductsList(prevList => {
            const existingItemIndex = prevList.findIndex(product => product.id === item.id)
            if (existingItemIndex !== -1) {
                // Item exists, create a new array with updated quantity
                const updatedList = [...prevList]
                updatedList[existingItemIndex] = {
                    ...updatedList[existingItemIndex],
                    price: price > 0 ? price : product?.price,
                    //@ts-ignore
                    quantity: parseInt(quantity),
                    //@ts-ignore
                    discount: parseInt(discountState)
                }
                return updatedList
            } else {
                // Item doesn't exist, add it with quantity 1
                //@ts-ignore
                return [...prevList, {
                    ...item,
                    //@ts-ignore
                    quantity: parseInt(quantity),
                    //@ts-ignore
                    discount: parseFloat(discountState) > 0 ? parseFloat(discountState) : parseFloat(product?.discount),
                    price: price > 0 ? price : product?.price,
                }]
            }
        })
        setVisible(!visible)
    }

    const onDialogSuccessChange = (item: ItemsData) => {
        if (receiptSettings?.stock_flag === "Y") {
            if (
                quantity <= 0 ||
                typeof quantity === "undefined" ||
                Number.isNaN(quantity) ||
                updatedStock < 0
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
                    "No stock available. Add stock for this product.",
                    ToastAndroid.SHORT,
                )
                return
            }
        }

        onDialogSuccecss(item)
    }

    useEffect(() => {
        //@ts-ignore
        setUpdatedStock(parseInt(stock) - parseInt(quantity))
    }, [quantity])

    const countTotalAmountAndTotalDiscount = () => {
        const { totalAmount, totalDiscount } = addedProductsList.reduce((acc, item) => {
            const itemTotalPrice = item?.price * item["quantity"]
            let itemDiscount = 0

            if (receiptSettings?.discount_flag === "Y") {
                if (receiptSettings?.discount_position === "I") {
                    if (receiptSettings?.discount_type === "A") {
                        itemDiscount = (item["quantity"] * item["discount"])
                    } else {
                        itemDiscount = (item?.price * item["quantity"] * item["discount"]) / 100
                    }
                }
            }

            return {
                totalAmount: acc.totalAmount + itemTotalPrice,
                totalDiscount: acc.totalDiscount + itemDiscount,
            }
        }, { totalAmount: 0, totalDiscount: 0 })

        setTotalPrice(totalAmount)
        setTotalDiscountedAmount(totalDiscount)

        console.log("TOT DISSSSS ====>", totalDiscount)
        itemsContextStorage.set("total-amount-data", totalAmount?.toString())
        itemsContextStorage.set("total-discount-data", totalDiscount?.toString())
    }

    useEffect(() => {
        countTotalAmountAndTotalDiscount()
        console.log("TESTTTT DATAAAA ====> BEFORE EMPTYING", addedProductsList)
        itemsContextStorage.set("items-data", JSON.stringify(addedProductsList))

        if (addedProductsList?.length === 0) {
            navigation.dispatch(
                CommonActions.navigate({
                    name: navigationRoutes.categoriesScreen
                })
            )
        }
    }, [addedProductsList])

    const handleOnDelete = (product: ItemsData) => {
        setAddedProductsList(prevData =>
            prevData?.filter((item, index) => item.item_id !== product.item_id),
        )

        setVisible(!visible)
    }

    const handlePressBillScreen = () => {
        navigation.dispatch(
            CommonActions.navigate({
                name: navigationRoutes.customerDetailsFillScreen,
                params: {
                    added_products: addedProductsList,
                    net_total: totalPrice,
                    total_discount: totalDiscountedAmount,
                    // table_no: tableNo,
                },
            }),
        )
    }

    const add = (item: ItemsData) => {
        handleFetchStock(item?.item_id)
        setAddedProductsList(prevList => {
            const existingItemIndex = prevList.findIndex(product => product.id === item.id)
            if (existingItemIndex !== -1) {
                // Item exists, create a new array with updated quantity
                const updatedList = [...prevList]
                updatedList[existingItemIndex] = {
                    ...updatedList[existingItemIndex],
                    //@ts-ignore
                    quantity: parseInt(updatedList[existingItemIndex].quantity || 0) + 1,
                }
                return updatedList
            } else {
                // Item doesn't exist, add it with quantity 1
                return [...prevList, { ...item, quantity: 1 }]
            }
        })
    }

    const remove = (item: ItemsData) => {
        setAddedProductsList(prevList => {
            const existingItemIndex = prevList.findIndex(product => product.id === item.id)
            if (existingItemIndex !== -1) {
                if (prevList[existingItemIndex].quantity > 1) {
                    // Item exists and quantity is greater than 1, create a new array with updated quantity
                    const updatedList = [...prevList]
                    updatedList[existingItemIndex] = {
                        ...updatedList[existingItemIndex],
                        quantity: updatedList[existingItemIndex].quantity - 1,
                    }
                    return updatedList
                } else {
                    // Item exists and quantity is 1, remove the item from the list
                    return prevList.filter(product => product.id !== item.id)
                }
            } else {
                return prevList
            }
        })
    }

    const handleClear = () => {
        Alert.alert("Clear cart?", "Do you want to clear cart?", [
            { text: "NO", onPress: () => null },
            {
                text: "YES", onPress: () => {
                    setAddedProductsList(() => [])
                    itemsContextStorage.clearAll()
                    navigation.dispatch(
                        CommonActions.navigate({
                            name: navigationRoutes.categoriesScreen
                        })
                    )
                }
            }
        ])
    }

    // Find the quantity for each item
    const getQuantity = (itemId: number) => {
        const item = addedProductsList.find(product => product.item_id === itemId)
        return item ? item.quantity : 0
    }

    const handleMemorize = () => {
        if (productStorage.getAllKeys().length === 0) {
            productStorage.set("products-data", JSON.stringify([...addedProductsList]))
            setAddedProductsList(() => [])
            setIsDataAvailable(true)

            itemsContextStorage.clearAll()
            console.log("Memorization success...")
        } else {
            Alert.alert("Maximum Limit Exceed!", "You can't hold more than 1.", [
                { text: "Close", onPress: () => null }
            ])
        }

        console.log("ADDED PRODUCTS LIST==============>>", addedProductsList)
    }

    const onHoldClick = () => {
        Alert.alert("Hold Bill", "Are you sure you want to hold this bill?", [
            { text: "No", onPress: () => null },
            { text: "Yes", onPress: handleMemorize }
        ])
    }

    // const handleMemOut = () => {
    //     if (productStorage.getAllKeys().length !== 0) {
    //         const productsStore = JSON.parse(productStorage.getString("products-data"))
    //         console.log("Mem Out=============>>>", productsStore)
    //         itemsContextStorage.set("items-data", JSON.stringify(productsStore))
    //         setAddedProductsList(productsStore)

    //         productStorage.clearAll()
    //         setIsDataAvailable(false)
    //     } else {
    //         ToastAndroid.show("There's no data available.", ToastAndroid.SHORT)
    //         return
    //     }

    //     console.log("ADDED PRODUCTS LIST==============>>", addedProductsList)
    // }

    // const onGetHoldBillOut = () => {
    //     Alert.alert("Get Bill", "Are you sure you want to get this bill?", [
    //         { text: "No", onPress: () => null },
    //         { text: "Yes", onPress: handleMemOut }
    //     ])
    // }

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView keyboardShouldPersistTaps="handled">
                <View style={{ alignItems: "center" }}>
                    <HeaderImage
                        imgLight={textureReport}
                        imgDark={textureReportDark}
                        borderRadius={30}
                        blur={10}
                        isBackEnabled>
                        Your Cart
                    </HeaderImage>
                </View>

                {/* <View
                    style={{
                        alignSelf: "center",
                        width: "85%",
                        marginTop: -9,
                        paddingBottom: normalize(10),
                    }}>
                    <ButtonPaper
                        icon="magnify-scan"
                        mode="contained"
                        buttonColor={theme.colors.vanillaContainer}
                        onPress={() => navigation.dispatch(
                            CommonActions.navigate(
                                {
                                    name: navigationRoutes.categoryProductsScreen,
                                    params: {
                                        category_id: 0,
                                        category_name: "All Items",
                                        category_photo: ""
                                    }
                                }
                            )
                        )}
                        textColor={theme.colors.onVanillaContainer}>
                        SEARCH PRODUCTS
                    </ButtonPaper>
                </View> */}

                <View style={{
                    paddingHorizontal: normalize(25),
                    paddingBottom: normalize(10),
                    maxHeight: SCREEN_HEIGHT / 1.85,
                }}>
                    <ScrollView style={{
                        // borderWidth: 2,
                        // borderColor: theme.colors.vanillaSecondary,
                        // borderStyle: "dashed",
                        // borderRadius: 20,
                        marginBottom: normalize(10),
                        padding: 10
                    }} nestedScrollEnabled>
                        {
                            addedProductsList?.map((item, i) => (
                                <View key={i}>
                                    <>
                                        <List.Item
                                            onPress={() => productDetails(item)}
                                            title={({ ellipsizeMode }) => <Text ellipsizeMode="tail">{item?.item_name}</Text>}
                                            description={<View>
                                                <Text style={{
                                                    color: theme.colors.green
                                                }}>₹{item?.price}</Text>
                                                <Text style={{
                                                    color: theme.colors.purple
                                                }}>Total: ₹{+item?.price * +item?.quantity}</Text>
                                            </View>}
                                            right={props => {
                                                return <AddRemove value={getQuantity(item?.item_id)} add={() => add(item)} remove={() => remove(item)} key={item?.item_id} isAddDisabled={receiptSettings?.stock_flag === "Y" && getQuantity(item?.item_id) === item?.stock} />
                                            }}
                                        // descriptionStyle={{
                                        //     color: theme.colors.green
                                        // }}
                                        />
                                        {/* <IconButton icon={"trash-can-outline"} iconColor={theme.colors.error} style={{
                                            alignSelf: "flex-start",
                                            marginTop: -15,
                                            left: -1
                                        }} onPress={() => null} /> */}
                                        <Divider />
                                    </>

                                </View>
                            ))
                        }
                    </ScrollView>


                    {/* <View style={{
                        paddingHorizontal: normalize(13),
                    }}>
                        <List.Item
                            title={({ ellipsizeMode }) => <Text ellipsizeMode="tail">Nsfsdf</Text>}
                            description={`Total`}
                            right={props => {
                                return <Text>dgusdg</Text>
                            }}
                            descriptionStyle={{
                                color: theme.colors.green
                            }}
                        />
                    </View> */}
                    <View>
                        <ButtonPaper mode="text" textColor={theme.colors.error} icon={"hand-back-left-outline"} onPress={onHoldClick}>
                            Hold
                        </ButtonPaper>
                    </View>
                </View>
            </ScrollView>

            {/* {
                isDataAvailable && <AnimatedFABPaper
                    icon="restart"
                    label="Get"
                    onPress={onGetHoldBillOut}
                    // extended={isExtended}
                    animateFrom="right"
                    iconMode="dynamic"
                    customStyle={styles.fabStyle}
                    variant="primary"
                    disabled={!isDataAvailable}
                />
            } */}

            <View style={{
                position: "absolute",
                top: "87.2%",
                alignSelf: "center"
            }}>
                <SnackBar totAmt={totalPrice?.toFixed(2)} handleBtn1Press={handlePressBillScreen} handleBtn2Press={handleClear} disableNext={!totalPrice} hideCart />
            </View>

            <DialogBox
                iconSize={40}
                visible={visible}
                hide={hideDialog}
                titleStyle={styles.title}
                btnSuccess={"ADD"}
                onFailure={onDialogFailure}
                onSuccess={() => onDialogSuccessChange(product)}>
                <View style={styles.modalContainer}>
                    {/* <View style={{ alignItems: "center" }}>
                        <View>
                            <Text
                                variant="titleLarge"
                                style={{ color: theme.colors.primary }}>
                                {product?.item_name}
                            </Text>
                        </View>
                    </View> */}

                    {/* <View
                        style={{
                            borderWidth: 1,
                            borderColor: theme.colors.primary,
                            margin: 10,
                            borderRadius: 10,
                            borderStyle: "dashed",
                        }}>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: 5,
                                // borderBottomWidth: 1,
                                borderColor: theme.colors.primary,
                            }}>
                            <Text variant="labelMedium">PRODUCT ID</Text>
                            <Text variant="labelMedium">{product?.id}</Text>
                        </View>

                        {receiptSettings?.unit_flag === "Y" && (
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    padding: 5,
                                }}>
                                <Text variant="labelMedium">UNIT</Text>
                                <Text variant="labelMedium">{product?.unit_name || ""}</Text>
                            </View>
                        )}
                    </View> */}

                    {/* <View
                        style={
                            receiptSettings?.price_type === "A" && {
                                borderWidth: 1,
                                borderColor: theme.colors.primary,
                                margin: 10,
                                borderRadius: 10,
                                borderStyle: "dashed",
                            }
                        }>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: 5,
                            }}>
                            {receiptSettings?.price_type === "A" ? (
                                <>
                                    <Text variant="labelMedium">UNIT PRICE</Text>
                                    <Text variant="labelMedium">₹{product?.price}</Text>
                                </>
                            ) : (
                                <View
                                    style={{
                                        flex: 1,
                                        justifyContent: "center",
                                        paddingHorizontal: 5,
                                    }}>
                                    <InputPaper
                                        selectTextOnFocus
                                        label="Unit Price"
                                        onChangeText={(txt: number) => setPrice(txt)}
                                        value={price}
                                        keyboardType="numeric"
                                        // autoFocus={true}
                                        mode="outlined"
                                    />
                                </View>
                            )}
                        </View>
                    </View> */}

                    {/* {receiptSettings?.stock_flag === "Y" && (
                        <View
                            style={{
                                borderWidth: 1,
                                borderColor: theme.colors.primary,
                                margin: 10,
                                borderRadius: 10,
                                borderStyle: "dashed",
                            }}>
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    padding: 5,
                                }}>
                                <Text variant="labelMedium">STOCK AVAILABLE</Text>
                                <Text variant="labelMedium">{updatedStock || stock}</Text>
                            </View>
                        </View>
                    )} */}

                    {/* {receiptSettings?.gst_flag === "Y" && (
                        <View
                            style={{
                                borderWidth: 1,
                                borderColor: theme.colors.primary,
                                margin: 10,
                                borderRadius: 10,
                                borderStyle: "dashed",
                            }}>
                            <View style={{ flexDirection: "column", width: "100%" }}>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: 5,
                                        borderColor: theme.colors.primary,
                                        borderStyle: "dashed",
                                    }}>
                                    <Text variant="labelMedium">CGST</Text>
                                    <Text variant="labelMedium">{product?.cgst || ""}%</Text>
                                </View>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: 5,
                                    }}>
                                    <Text variant="labelMedium">SGST</Text>
                                    <Text variant="labelMedium">{product?.sgst || ""}%</Text>
                                </View>
                            </View>
                        </View>
                    )} */}

                    {/* <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginHorizontal: 7,
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
                                selectTextOnFocus
                                label={`Quantity (${(receiptSettings?.unit_flag === "Y" && product?.unit_name) ||
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
                    </View> */}

                    <View
                        style={
                            receiptSettings?.discount_flag === "Y" &&
                                receiptSettings?.discount_position !== "B"
                                ? { width: "50%" }
                                : { width: "100%" }
                        }>
                        <InputPaper
                            selectTextOnFocus
                            label={`Quantity (${(receiptSettings?.unit_flag === "Y" && product?.unit_name) ||
                                ""
                                })`}
                            onChangeText={(txt: number) => setQuantity(txt)}
                            value={quantity}
                            keyboardType="numeric"
                            autoFocus={true}
                            mode="outlined"
                        />
                    </View>
                    {addedProductsList.some(i => i.item_id === product?.item_id) &&
                        <View
                            style={{
                                marginBottom: normalize(-15),
                                marginTop: normalize(10),
                                paddingHorizontal: normalize(10),
                            }}>
                            <ButtonPaper
                                mode="text"
                                textColor={theme.colors.onPurple}
                                buttonColor={theme.colors.purple}
                                icon="trash-can-outline"
                                onPress={() => handleOnDelete(product)}>
                                REMOVE ITEM
                            </ButtonPaper>
                        </View>
                    }
                </View>
            </DialogBox>
        </SafeAreaView>
    )
}

export default CartScreen

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
    },

    title: {
        textAlign: "center",
    },

    modalContainer: {
        justifyContent: "space-between",
        // minHeight: normalize(230),
        height: "auto",
    },

    fabStyle: {
        bottom: normalize(100),
        right: normalize(16),
        position: "absolute",
    },

    text: { fontSize: 24, fontWeight: 'bold' },
    leftAction: { flex: 1, backgroundColor: 'green', justifyContent: 'center', },
    rightAction: { flex: 1, backgroundColor: 'red', justifyContent: 'center', },
    actionText: { color: '#fff', fontSize: 16, padding: 20 }
}
)
