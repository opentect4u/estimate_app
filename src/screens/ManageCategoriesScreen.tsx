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
import {
    flowerHome,
    flowerHomeDark,
    blurredBlue,
    blurredBlueDark,
} from "../resources/images"
import ScrollableListContainer from "../components/ScrollableListContainer"
import ProductListSuggestion from "../components/ProductListSuggestion"
import { usePaperColorScheme } from "../theme/theme"
import DialogBox from "../components/DialogBox"
import InputPaper from "../components/InputPaper"
import { clearStates } from "../utils/clearStates"
import {
    AddCategoryCredentials,
    AddUnitCredentials,
    CategoryEditCredentials,
    CategoryListData,
    UnitData,
    UnitEditCredentials,
} from "../models/api_types"
import { loginStorage } from "../storage/appStorage"
import { useIsFocused } from "@react-navigation/native"
import { AppStore } from "../context/AppContext"
import AnimatedFABPaper from "../components/AnimatedFABPaper"
import useAddUnit from "../hooks/api/useAddUnit"
import useEditUnit from "../hooks/api/useEditUnit"
import { AppStoreContext } from "../models/custom_types"
import useEditCategory from "../hooks/api/useEditCategory"
import useAddCategory from "../hooks/api/useAddCategory"

export default function ManageCategoriesScreen() {
    const theme = usePaperColorScheme()
    const isFocused = useIsFocused()

    const { categories, handleGetCategories, receiptSettings } = useContext<AppStoreContext>(AppStore)

    const loginStore = JSON.parse(loginStorage.getString("login-data"))

    const { editCategory } = useEditCategory()
    const { sendAddedCategory } = useAddCategory()

    const [visible, setVisible] = useState(() => false)
    const hideDialog = () => setVisible(() => false)
    const [visibleAdd, setVisibleAdd] = useState(() => false)
    const hideDialogAdd = () => setVisibleAdd(() => false)

    const [search, setSearch] = useState<string>(() => "")
    const [filteredCategories, setFilteredCategories] = useState<CategoryListData[]>(() => [])

    const [isExtended, setIsExtended] = useState(() => true)

    const [category, setCategory] = useState<string>(() => "")
    const [catId, setCatId] = useState<number>(() => undefined)
    const [categoryName, setCategoryName] = useState<string>(() => "")

    const onScroll = ({ nativeEvent }) => {
        const currentScrollPosition = Math.floor(nativeEvent?.contentOffset?.y) ?? 0
        setIsExtended(currentScrollPosition <= 0)
    }

    const onChangeSearch = (query: string) => {
        setSearch(query)

        // Convert the query to lowercase for a case-insensitive comparison
        const lowerCaseQuery = query.toLowerCase()

        const filtered = categories.filter(
            (cat: CategoryListData) =>
                cat?.category_name?.toLowerCase().includes(lowerCaseQuery), // Ensure case-insensitive search
        )

        setFilteredCategories(filtered)

        // If the query is empty, clear the filtered units
        if (query === "") {
            setFilteredCategories(() => [])
        }
    }

    const handleUpdateCategoryDetails = async () => {
        let editCatCreds: CategoryEditCredentials = {
            comp_id: loginStore?.comp_id,
            sl_no: catId,
            category_name: category,
            modified_by: loginStore?.user_name,
        }

        await editCategory(editCatCreds)
            .then(res => {
                ToastAndroid.show("Category updated successfully.", ToastAndroid.SHORT)
                handleGetCategories()
            })
            .catch(err => {
                ToastAndroid.show("Error while updating category.", ToastAndroid.SHORT)
            })
    }

    const onDialogFailure = () => {
        clearStates([setCategory, setSearch], () => "")
        setCatId(() => undefined)
        setVisible(!visible)
    }

    const onDialogSuccecss = () => {
        if (category.length === 0) {
            ToastAndroid.show("Try adding some category name.", ToastAndroid.SHORT)
            return
        }
        handleUpdateCategoryDetails()
            .then(() => {
                clearStates([setSearch, setCategory], () => "")
                setCatId(() => undefined)
                setVisible(!visible)
                setFilteredCategories(() => [])
            })
            .catch(err => {
                ToastAndroid.show(
                    "An error occurred while updating category.",
                    ToastAndroid.SHORT,
                )
            })
    }

    const onDialogFailureAdd = () => {
        clearStates([setSearch, setCategoryName], () => "")
        setCategory(() => "")
        setVisibleAdd(!visibleAdd)
    }

    const onDialogSuccecssAdd = () => {
        handleAddUnit()
            .then(() => {
                clearStates([setCategoryName], () => "")
                setCategory(() => "")
                setVisibleAdd(!visibleAdd)
            })
            .catch(err => {
                ToastAndroid.show("Something went wrong on server.", ToastAndroid.SHORT)
            })
    }

    const handleAddUnit = async () => {
        let addedCategoryObject: AddCategoryCredentials = {
            comp_id: loginStore?.comp_id,
            category_name: categoryName,
            created_by: loginStore?.user_name,
        }

        if (categoryName.length === 0) {
            ToastAndroid.show("Add Category Name.", ToastAndroid.SHORT)
            return
        }

        await sendAddedCategory(addedCategoryObject)
            .then(res => {
                ToastAndroid.show("Category has been added.", ToastAndroid.SHORT)
                handleGetCategories()
            })
            .catch(err => {
                ToastAndroid.show("Something went wrong on server while adding category.", ToastAndroid.SHORT)
            })
    }

    const handleCategoryPressed = (cat: CategoryListData) => {
        setCategory(cat?.category_name)
        setCatId(cat?.sl_no)
        setVisible(!visible)
    }

    useEffect(() => {
        handleGetCategories()
    }, [isFocused])

    return (
        <SafeAreaView
            style={[{ backgroundColor: theme.colors.background, height: "100%" }]}>
            <ScrollView keyboardShouldPersistTaps="handled" onScroll={onScroll}>
                <View style={{ alignItems: "center" }}>
                    <HeaderImage
                        isBackEnabled
                        imgLight={blurredBlue}
                        imgDark={blurredBlueDark}
                        borderRadius={30}
                        blur={10}>
                        Manage Categories
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
                                backgroundColor: theme.colors.primaryContainer,
                                color: theme.colors.onPrimaryContainer,
                            }}
                            placeholder="Search Categories"
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
                            {filteredCategories.map(cat => (
                                <ProductListSuggestion
                                    key={cat.sl_no}
                                    itemName={cat.category_name}
                                    onPress={() => handleCategoryPressed(cat)}
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
                <View style={{ justifyContent: "space-between", height: "auto" }}>
                    <View style={{ alignItems: "center" }}>
                        <View>
                            <Text variant="titleLarge">Edit Category</Text>
                        </View>
                    </View>

                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 5,
                        }}>
                        <View style={{ width: "100%" }}>
                            <InputPaper
                                autoFocus
                                label="Category"
                                onChangeText={(txt: string) => setCategory(txt)}
                                value={category}
                                keyboardType="default"
                                mode="outlined"
                                maxLength={18}
                            />
                        </View>
                    </View>
                </View>
            </DialogBox>
            {loginStore?.user_type === "M" && (
                <AnimatedFABPaper
                    icon="shape-plus"
                    label="Add Category"
                    onPress={() => setVisibleAdd(!visibleAdd)}
                    extended={isExtended}
                    animateFrom="right"
                    iconMode="dynamic"
                    customStyle={[styles.fabStyle]}
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
                <View style={{ justifyContent: "space-between", height: "auto" }}>
                    <View style={{ alignItems: "center" }}>
                        <View>
                            <Text variant="titleLarge">Add Category</Text>
                        </View>
                    </View>

                    <View style={{ width: "100%" }}>
                        <InputPaper
                            autoFocus
                            label="Category Name"
                            onChangeText={(txt: string) => setCategoryName(txt)}
                            value={categoryName}
                            keyboardType="default"
                            mode="outlined"
                            maxLength={30}
                        />
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
