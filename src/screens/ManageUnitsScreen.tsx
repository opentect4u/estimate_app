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
  AddUnitCredentials,
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

export default function ManageUnitsScreen() {
  const theme = usePaperColorScheme()
  const isFocused = useIsFocused()

  const { units, handleGetUnits, receiptSettings } = useContext<AppStoreContext>(AppStore)

  const loginStore = JSON.parse(loginStorage.getString("login-data"))

  const { editUnit } = useEditUnit()
  const { sendAddedUnit } = useAddUnit()

  const [visible, setVisible] = useState(() => false)
  const hideDialog = () => setVisible(() => false)
  const [visibleAdd, setVisibleAdd] = useState(() => false)
  const hideDialogAdd = () => setVisibleAdd(() => false)

  const [search, setSearch] = useState<string>(() => "")
  const [filteredUnits, setFilteredUnits] = useState<UnitData[]>(() => [])

  const [isExtended, setIsExtended] = useState(() => true)

  const [unit, setUnit] = useState<string>(() => "")
  const [unitId, setUnitId] = useState<number>(() => undefined)
  const [unitName, setUnitName] = useState<string>(() => "")

  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition = Math.floor(nativeEvent?.contentOffset?.y) ?? 0
    setIsExtended(currentScrollPosition <= 0)
  }

  // const onChangeSearch = (query: string) => {
  //     setSearch(query)

  //     const filtered = units.filter((unit: UnitData) => unit?.unit_name?.includes(query))
  //     setFilteredUnits(filtered)
  //     if (query === "") setFilteredUnits(() => [])
  // }

  const onChangeSearch = (query: string) => {
    setSearch(query)

    // Convert the query to lowercase for a case-insensitive comparison
    const lowerCaseQuery = query.toLowerCase()

    const filtered = units.filter(
      (unit: UnitData) =>
        unit?.unit_name?.toLowerCase().includes(lowerCaseQuery), // Ensure case-insensitive search
    )

    setFilteredUnits(filtered)

    // If the query is empty, clear the filtered units
    if (query === "") {
      setFilteredUnits(() => [])
    }
  }

  const handleUpdateUnitDetails = async () => {
    let editUnitCreds: UnitEditCredentials = {
      comp_id: loginStore?.comp_id,
      sl_no: unitId,
      unit_name: unit,
      modified_by: loginStore?.user_name,
    }

    await editUnit(editUnitCreds)
      .then(res => {
        ToastAndroid.show("Unit updated successfully.", ToastAndroid.SHORT)
        handleGetUnits()
      })
      .catch(err => {
        ToastAndroid.show("Error while updating unit.", ToastAndroid.SHORT)
      })
  }

  const onDialogFailure = () => {
    clearStates([setUnit, setSearch], () => "")
    setUnitId(() => undefined)
    setVisible(!visible)
  }

  const onDialogSuccecss = () => {
    if (unit.length === 0) {
      ToastAndroid.show("Try adding some unit.", ToastAndroid.SHORT)
      return
    }
    handleUpdateUnitDetails()
      .then(() => {
        clearStates([setSearch, setUnit], () => "")
        setUnitId(() => undefined)
        setVisible(!visible)
        setFilteredUnits(() => [])
      })
      .catch(err => {
        ToastAndroid.show(
          "An error occurred while updating unit.",
          ToastAndroid.SHORT,
        )
      })
  }

  const onDialogFailureAdd = () => {
    clearStates([setSearch, setUnitName], () => "")
    setUnit(() => "")
    setVisibleAdd(!visibleAdd)
  }

  const onDialogSuccecssAdd = () => {
    handleAddUnit()
      .then(() => {
        clearStates([setUnitName], () => "")
        setUnit(() => "")
        setVisibleAdd(!visibleAdd)
      })
      .catch(err => {
        ToastAndroid.show("Something went wrong on server.", ToastAndroid.SHORT)
      })
  }

  const handleAddUnit = async () => {
    let addedUnitObject: AddUnitCredentials = {
      comp_id: loginStore?.comp_id,
      unit_name: unitName,
      created_by: loginStore?.user_name,
    }

    if (unitName.length === 0) {
      ToastAndroid.show("Add Unit Name.", ToastAndroid.SHORT)
      return
    }

    await sendAddedUnit(addedUnitObject)
      .then(res => {
        ToastAndroid.show("Unit has been added.", ToastAndroid.SHORT)
        handleGetUnits()
      })
      .catch(err => {
        ToastAndroid.show("Something went wrong on server", ToastAndroid.SHORT)
      })
  }

  const handleUnitPressed = (unit: UnitData) => {
    setUnit(unit?.unit_name)
    setUnitId(unit?.sl_no)
    setVisible(!visible)
  }

  useEffect(() => {
    handleGetUnits()
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
            Manage Units
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
              placeholder="Search Units"
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
              {filteredUnits.map(unit => (
                <ProductListSuggestion
                  key={unit.sl_no}
                  itemName={unit.unit_name}
                  onPress={() => handleUnitPressed(unit)}
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
              <Text variant="titleLarge">Edit Unit</Text>
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
                label="Unit"
                onChangeText={(txt: string) => setUnit(txt)}
                value={unit}
                keyboardType="default"
                mode="outlined"
              />
            </View>
          </View>
        </View>
      </DialogBox>
      {loginStore?.user_type === "M" && (
        <AnimatedFABPaper
          icon="weight-kilogram"
          label="Add Unit"
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
              <Text variant="titleLarge">Adding Unit</Text>
            </View>
          </View>

          <View style={{ width: "100%" }}>
            <InputPaper
              autoFocus
              label="Unit Name"
              onChangeText={(txt: string) => setUnitName(txt)}
              value={unitName}
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
