import React, { useContext, useEffect, useState } from "react"
import {
    StyleSheet,
    ScrollView,
    SafeAreaView,
    View,
    Alert,
    ToastAndroid,
} from "react-native"
import { ActivityIndicator, Text } from "react-native-paper"
import HeaderImage from "../components/HeaderImage"
import {
    textureReport,
    textureReportDark,
} from "../resources/images"
import { usePaperColorScheme } from "../theme/theme"
import { CommonActions, useIsFocused, useNavigation } from "@react-navigation/native"
import { itemsContextStorage, productStorage } from "../storage/appStorage"
import { AppStore } from "../context/AppContext"
import ReportButtonsWrapper from "../components/ReportButtonsWrapper"
import ReportButton from "../components/ReportButton"
import navigationRoutes from "../routes/navigationRoutes"
import { ItemsData } from "../models/api_types"
import { AppStoreContext } from "../models/custom_types"
import SnackBar from "../components/SnackBar"
import LoadingOverlay from "../components/LoadingOverlay"
import { clearStates } from "../utils/clearStates"
import SurfacePaper from "../components/SurfacePaper"
import AnimatedFABPaper from "../components/AnimatedFABPaper"
import normalize from "react-native-normalize"
import ButtonPaper from "../components/ButtonPaper"

function CategoriesScreen() {
    const theme = usePaperColorScheme()
    const navigation = useNavigation()
    const isFocused = useIsFocused()

    const { categories, handleGetCategories } = useContext<AppStoreContext>(AppStore)

    let itemsStore: ItemsData[]
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

    console.log("CATTTTT TESTTTTT DATAAAAA +++++=====", itemsStore)
    const [addedProducts, setAddedProducts] = useState<ItemsData[]>()
    const [totalPrice, setTotalPrice] = useState(() => 0)
    const [totalDiscountedAmount, setTotalDiscountedAmount] = useState(() => 0)
    const [clear, setClear] = useState(() => false)
    const [loading, setLoading] = useState(() => false)

    useEffect(() => {
        setAddedProducts(itemsStore)
        setTotalPrice(totalAmountStore)
        setTotalDiscountedAmount(totalDiscountedAmountStore)
    }, [isFocused])

    const getCategories = async () => {
        setLoading(true)
        await handleGetCategories()
        setLoading(false)
    }

    useEffect(() => {
        getCategories()
    }, [])

    const onPress = (catgId: number, catgName: string, catgPhoto?: string) => {
        console.log("CATEGORY: ", catgId)

        navigation.dispatch(
            CommonActions.navigate(
                {
                    name: navigationRoutes.categoryProductsScreen,
                    params: {
                        category_id: catgId,
                        category_name: catgName,
                        category_photo: catgPhoto
                    }
                }
            )
        )
    }

    const handleClear = () => {
        Alert.alert("Clear cart?", "Do you want to clear cart?", [
            { text: "NO", onPress: () => null },
            {
                text: "YES", onPress: () => {
                    setClear(!clear)
                    setAddedProducts([])
                    clearStates([setTotalPrice, setTotalDiscountedAmount], () => 0)
                    itemsContextStorage.clearAll()
                }
            }
        ])

    }

    const handlePressBillScreen = () => {
        navigation.dispatch(
            CommonActions.navigate({
                name: navigationRoutes.cartScreen,
                params: {
                    added_products: itemsStore,
                    net_total: totalAmountStore,
                    total_discount: totalDiscountedAmount,
                    // table_no: tableNo,
                },
            }),
        )
        // navigation.dispatch(
        //     CommonActions.navigate({
        //         name: navigationRoutes.customerDetailsFillScreen,
        //         params: {
        //             added_products: itemsStore,
        //             net_total: totalAmountStore,
        //             total_discount: totalDiscountedAmount,
        //             // table_no: tableNo,
        //         },
        //     }),
        // )
    }

    const handleGoToCartScreen = () => {
        navigation.dispatch(
            CommonActions.navigate({
                name: navigationRoutes.cartScreen,
                params: {
                    added_products: addedProducts,
                    net_total: totalPrice,
                    total_discount: totalDiscountedAmount,
                    // table_no: tableNo,
                },
            }),
        )
    }

    const handleMemOut = () => {
        if (productStorage.getAllKeys().length !== 0) {
            const productsStore = JSON.parse(productStorage.getString("products-data"))
            console.log("Mem Out=============>>>", productsStore)
            itemsContextStorage.set("items-data", JSON.stringify(productsStore))

            productStorage.clearAll()

            navigation.dispatch(
                CommonActions.navigate({
                    name: navigationRoutes.cartScreen,
                    params: {
                        added_products: productsStore,
                        net_total: totalPrice,
                        total_discount: totalDiscountedAmount,
                        // table_no: tableNo,
                    },
                }),
            )
        } else {
            ToastAndroid.show("There's no data available.", ToastAndroid.SHORT)
            return
        }
    }

    const onGetHoldBillOut = () => {
        Alert.alert("Get Bill", "Are you sure you want to get this bill?", [
            { text: "No", onPress: () => null },
            { text: "Yes", onPress: handleMemOut }
        ])
    }

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{
                height: "auto",
                paddingBottom: "20%"
            }}>
                <View style={{ alignItems: "center" }}>
                    <HeaderImage
                        imgLight={textureReport}
                        imgDark={textureReportDark}
                        borderRadius={30}
                        blur={10}
                        isBackEnabled>
                        Categories
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

                {categories.length !== 0
                    ? <ReportButtonsWrapper>
                        <ReportButton
                            text={"All Items"}
                            color={theme.colors.vanillaSecondaryContainer}
                            textColor={theme.colors.onVanillaContainer}
                            icon={"hexagon-multiple-outline"}
                            // withImage
                            // imageSource={item?.catg_picture}
                            // imageSourceObject={cate}
                            onPress={() => onPress(0, "All Items")}
                        />
                        {
                            categories?.map((item, index) => (
                                <ReportButton
                                    key={index}
                                    text={item?.category_name}
                                    color={index % 2 === 0 ? theme.colors.vanillaContainer : theme.colors.vanillaSecondaryContainer}
                                    textColor={index % 2 === 0 ? theme.colors.onVanillaSecondaryContainer : theme.colors.onVanillaContainer}
                                    icon={"hexagon-multiple-outline"}
                                    // withImage
                                    // imageSource={item?.catg_picture}
                                    // imageSourceObject={cate}
                                    onPress={() => onPress(item?.sl_no, item?.category_name, item?.catg_picture)}
                                />
                            ))
                        }
                    </ReportButtonsWrapper>
                    : <SurfacePaper
                        borderRadiusEnabled
                        backgroundColor={theme.colors.vanillaTertiaryContainer}
                        elevation={2}
                        paddingEnabled
                        smallWidthEnabled
                        style={{ padding: 15 }}>
                        <Text
                            variant="titleLarge"
                            style={{
                                alignSelf: "center",
                                textAlign: "center",
                                color: theme.colors.onVanillaTertiaryContainer,
                            }}>
                            No categories found!
                        </Text>
                    </SurfacePaper>
                }
            </ScrollView>

            {loading && <LoadingOverlay />}

            {
                productStorage?.contains("products-data") && <AnimatedFABPaper
                    icon="restart"
                    label="Get"
                    onPress={onGetHoldBillOut}
                    // extended={isExtended}
                    animateFrom="right"
                    iconMode="dynamic"
                    customStyle={styles.fabStyle}
                    variant="primary"
                // disabled={!isDataAvailable}
                />
            }

            {
                addedProducts?.length !== 0 &&
                <View style={{
                    position: "absolute",
                    top: "87.2%",
                    alignSelf: "center",
                }}>
                    <SnackBar totAmt={totalPrice?.toFixed(2)} handleBtn1Press={handlePressBillScreen} handleBtn2Press={handleClear} handleBtn3Press={handleGoToCartScreen} disableNext={!totalPrice} cartItemQty={addedProducts?.length} disableCart={!totalPrice} />
                </View>
            }
        </SafeAreaView>
    )
}

export default CategoriesScreen

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
    },

    title: {
        textAlign: "center",
    },

    fabStyle: {
        bottom: normalize(100),
        right: normalize(16),
        position: "absolute",
    },
})
