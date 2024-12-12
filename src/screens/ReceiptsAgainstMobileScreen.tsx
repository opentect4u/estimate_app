import React, { useContext, useState } from "react"
import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  View,
  ToastAndroid,
} from "react-native"
import { List, Text } from "react-native-paper"
import HeaderImage from "../components/HeaderImage"
import { textureBill, textureBillDark } from "../resources/images"
import { usePaperColorScheme } from "../theme/theme"
import {
  CommonActions,
  useNavigation,
  useRoute,
} from "@react-navigation/native"
import { loginStorage } from "../storage/appStorage"
import { SearchedBills, ShowBillData } from "../models/api_types"
import useShowBill from "../hooks/api/useShowBill"
import { AppStore } from "../context/AppContext"
import { RefundItemsScreenRouteProp } from "../models/route_types"
import navigationRoutes from "../routes/navigationRoutes"
import { AppStoreContext } from "../models/custom_types"

function ReceiptsAgainstMobileScreen() {
  const theme = usePaperColorScheme()
  const navigation = useNavigation()

  const { params } = useRoute<RefundItemsScreenRouteProp>()

  const loginStore = JSON.parse(loginStorage.getString("login-data"))

  const { receiptSettings } = useContext<AppStoreContext>(AppStore)

  const [visible, setVisible] = useState(() => false)
  const hideDialog = () => setVisible(() => false)

  const [currentReceiptNo, setCurrentReceiptNo] = useState<number | undefined>(
    () => undefined,
  )
  const [gstFlag, setGstFlag] = useState<"Y" | "N">()

  const [billsArray, setBillsArray] = useState<SearchedBills[]>(() => [])
  const [billedSaleData, setBilledSaleData] = useState<ShowBillData[]>(() => [])

  const { fetchBill } = useShowBill()

  const handleGetBill = async (rcptNo: number) => {
    await fetchBill(rcptNo)
      .then(res => {
        setBilledSaleData(res?.data)

        navigation.dispatch(
          CommonActions.navigate({
            name: navigationRoutes.refundItemsDataScreen,
            params: {
              // billed_sale_data: billedSaleData
              billed_sale_data: res?.data,
            },
          }),
        )
      })
      .catch(err => {
        ToastAndroid.show("Error during fetching bills.", ToastAndroid.SHORT)
      })
  }

  const handleBillListClick = async (rcptNo: number) => {
    handleGetBill(rcptNo)
  }
  // 8910792003
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
            isBackEnabled>
            Receipts for {params?.customer_phone_number}
          </HeaderImage>
        </View>

        <View style={{ width: "100%" }}>
          {/* {billsArray?.map((item, i) => (
            <List.Item
              key={i}
              title={`Bill ${item?.receipt_no}`}
              description={`₹${item?.net_amt}`}
              onPress={() => handleBillListClick(item?.receipt_no)}
              left={props => <List.Icon {...props} icon="basket" />}
            // right={props => (
            //   <List.Icon {...props} icon="download" />
            // )}
            />
          ))} */}
          {params?.bills_data?.map((item, i) => (
            <List.Item
              key={i}
              title={`${item?.trn_date}`}
              description={`${item?.receipt_no}`}
              onPress={() => handleBillListClick(item?.receipt_no)}
              left={props => <List.Icon {...props} icon="basket" />}
              right={props => (
                <Text variant="bodyMedium" {...props}>
                  ₹{item?.net_amt}
                </Text>
              )}
            // right={props => (
            //   <List.Icon {...props} icon="download" />
            // )}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ReceiptsAgainstMobileScreen

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },

  title: {
    textAlign: "center",
  },
})
