import React, { useState } from "react"
import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  View,
  ToastAndroid,
} from "react-native"
import { List, Searchbar } from "react-native-paper"
import HeaderImage from "../components/HeaderImage"
import { textureBill, textureBillDark } from "../resources/images"
import { usePaperColorScheme } from "../theme/theme"
import { useNavigation } from "@react-navigation/native"
import DialogBox from "../components/DialogBox"
import AddedProductList from "../components/AddedProductList"
import ScrollableListContainer from "../components/ScrollableListContainer"
import NetTotalButton from "../components/NetTotalButton"
import ButtonPaper from "../components/ButtonPaper"

type ProductsDataObject = {
  id: number
  item: string
  description: string
  quantity: number
  unit_price: number
  unit: string
}

function AllBillsScreen() {
  const theme = usePaperColorScheme()
  const navigation = useNavigation()

  const [search, setSearch] = useState<string>(() => "")
  const onChangeSearch = (query: string) => {
    setSearch(query)
  }

  const [addedProductsList, setAddedProductsList] = useState<
    ProductsDataObject[]
  >(() => [
    {
      id: 1,
      item: "Emami Rice Bran Oil",
      description: "Item description",
      unit_price: 240,
      quantity: 2,
      unit: "Lt",
    },
    {
      id: 2,
      item: "Lux Soap",
      description: "Item description",
      unit_price: 65,
      quantity: 9,
      unit: "Pc",
    },
    {
      id: 3,
      item: "Mung Daal",
      description: "Item description",
      unit_price: 160,
      quantity: 12,
      unit: "Kg",
    },
    {
      id: 4,
      item: "Cadbury Dairy Milk",
      description: "Item description",
      unit_price: 110,
      quantity: 7,
      unit: "Pc",
    },
    {
      id: 9,
      item: "Cadbury Dairy Milk",
      description: "Item description",
      unit_price: 110,
      quantity: 7,
      unit: "Pc",
    },
    {
      id: 78,
      item: "Cadbury Dairy Milk",
      description: "Item description",
      unit_price: 110,
      quantity: 7,
      unit: "Pc",
    },
    {
      id: 23,
      item: "Cadbury Dairy Milk",
      description: "Item description",
      unit_price: 110,
      quantity: 7,
      unit: "Pc",
    },
  ])

  let netTotal = 0

  const [visible, setVisible] = useState(() => false)
  const hideDialog = () => setVisible(() => false)

  const onDialogFailure = () => {
    setVisible(!visible)
  }

  const onDialogSuccecss = () => {
    setVisible(!visible)
    ToastAndroid.showWithGravityAndOffset(
      "Printing feature will be added in some days.",
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
      25,
      50,
    )
  }
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView>
        <View style={{ alignItems: "center" }}>
          <HeaderImage
            imgLight={textureBill}
            imgDark={textureBillDark}
            borderRadius={30}
            blur={10}
            isBackEnabled
            navigation={navigation}>
            My Bills
          </HeaderImage>
        </View>

        <View
          style={{
            padding: 20,
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
          }}>
          {/* <Searchbar
            placeholder="Search Bills"
            onChangeText={onChangeSearch}
            value={search}
            elevation={search && 2}
            // loading={search ? true : false}
          /> */}
          <ButtonPaper onPress={() => console.log("af")} mode="text">
            FROM
          </ButtonPaper>
          <ButtonPaper onPress={() => console.log("af")} mode="text">
            TO
          </ButtonPaper>
        </View>

        <View style={{ width: "100%" }}>
          {[...new Array(20).keys()].map((_, i) => (
            <List.Item
              key={i}
              title={`Bill ${i + 1}`}
              description={"Cadbury, Oil, Daal..."}
              onPress={() => setVisible(!visible)}
              left={props => <List.Icon {...props} icon="basket" />}
              // right={props => (
              //   <List.Icon {...props} icon="download" />
              // )}
            />
          ))}
        </View>
      </ScrollView>
      <DialogBox
        iconSize={40}
        visible={visible}
        hide={hideDialog}
        titleStyle={styles.title}
        btnSuccess="REPRINT"
        onFailure={onDialogFailure}
        onSuccess={onDialogSuccecss}
        title="Print Bill"
        icon="printer-outline">
        <ScrollableListContainer
          backgroundColor={theme.colors.surfaceVariant}
          width={300}
          height={200}>
          {addedProductsList.map(item => {
            netTotal += item.unit_price * item.quantity
            return (
              <AddedProductList
                key={item.id}
                itemName={item.item}
                quantity={item.quantity}
                unitPrice={item.unit_price}
                unit={item.unit}
              />
            )
          })}
        </ScrollableListContainer>
        <NetTotalButton
          width={300}
          backgroundColor={theme.colors.orangeContainer}
          netTotal={netTotal}
          textColor={theme.colors.onGreenContainer}
          totalDiscount={4}
          disabled
        />
      </DialogBox>
    </SafeAreaView>
  )
}

export default AllBillsScreen

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },

  title: {
    textAlign: "center",
  },
})
