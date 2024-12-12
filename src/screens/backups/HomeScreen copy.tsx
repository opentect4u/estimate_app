import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  View,
  ToastAndroid,
  RefreshControl,
  Alert,
  Linking,
} from "react-native"
import React, { useCallback, useContext, useEffect, useState } from "react"
import AnimatedFABPaper from "../components/AnimatedFABPaper"
import {
  Button,
  Dialog,
  List,
  Portal,
  SegmentedButtons,
  Text,
} from "react-native-paper"
import { usePaperColorScheme } from "../theme/theme"
import HeaderImage from "../components/HeaderImage"
import { flowerHome, flowerHomeDark } from "../resources/images"
import navigationRoutes from "../routes/navigationRoutes"
import {
  CommonActions,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native"
import SurfacePaper from "../components/SurfacePaper"
import DialogBox from "../components/DialogBox"
import normalize, { SCREEN_WIDTH } from "react-native-normalize"
import ScrollableListContainer from "../components/ScrollableListContainer"
import { loginStorage } from "../storage/appStorage"
import { RecentBillsData, ShowBillData } from "../models/api_types"
import { AppStore } from "../context/AppContext"
import useBillSummary from "../hooks/api/useBillSummary"
import useRecentBills from "../hooks/api/useRecentBills"
import useShowBill from "../hooks/api/useShowBill"
import AddedProductList from "../components/AddedProductList"
import NetTotalForRePrints from "../components/NetTotalForRePrints"
import { useBluetoothPrint } from "../hooks/printables/useBluetoothPrint"
import useVersionCheck from "../hooks/api/useVersionCheck"
import DeviceInfo from "react-native-device-info"
import ButtonPaper from "../components/ButtonPaper"
import useCancelBill from "../hooks/api/useCancelBill"
import useCalculations from "../hooks/useCalculations"

function HomeScreen() {
  const theme = usePaperColorScheme()
  const navigation = useNavigation()
  const isFocused = useIsFocused()

  let version = DeviceInfo.getVersion()

  const { handleGetReceiptSettings, receiptSettings } = useContext(AppStore)

  const { fetchBillSummary } = useBillSummary()
  const { fetchRecentBills } = useRecentBills()
  const { fetchBill } = useShowBill()
  const { fetchVersionInfo } = useVersionCheck()
  const { rePrint, rePrintWithoutGst } = useBluetoothPrint()
  const { cancelBill } = useCancelBill()
  const { grandTotalCalculate } = useCalculations()

  const loginStore = JSON.parse(loginStorage.getString("login-data"))

  const [isExtended, setIsExtended] = useState<boolean>(() => true)

  const [totalBills, setTotalBills] = useState<number | undefined>(
    () => undefined,
  )
  const [amountCollected, setAmountCollected] = useState<number | undefined>(
    () => undefined,
  )
  const [recentBills, setRecentBills] = useState<RecentBillsData[]>(() => [])
  const [billedSaleData, setBilledSaleData] = useState<ShowBillData[]>(() => [])
  const [currentReceiptNo, setCurrentReceiptNo] = useState<number | undefined>(
    () => undefined,
  )
  const [gstFlag, setGstFlag] = useState<"Y" | "N">()

  const [refreshing, setRefreshing] = useState<boolean>(() => false)
  const [updateUrl, setUpdateUrl] = useState<string>()

  const [isLoading, setIsLoading] = useState(() => false)
  const [isDisabled, setIsDisabled] = useState(() => false)

  const [visible, setVisible] = useState<boolean>(() => false)
  const hideDialog = () => setVisible(() => false)

  const [visibleUpdatePortal, setVisibleUpdatePortal] = useState<boolean>(
    () => false,
  )
  const showDialogForAppUpdate = () => setVisibleUpdatePortal(true)
  const hideDialogForAppUpdate = () => setVisibleUpdatePortal(false)

  // const [segmentedButtonValue, setSegmentedButtonValue] = useState("")

  let today = new Date()
  let year = today.getFullYear()
  let month = ("0" + (today.getMonth() + 1)).slice(-2)
  let day = ("0" + today.getDate()).slice(-2)
  let formattedDate = year + "-" + month + "-" + day

  let netTotal = 0
  let totalDiscount = 0

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    handleGetReceiptSettings()
    handleGetBillSummary()
    handleGetRecentBills()
    setTimeout(() => {
      setRefreshing(false)
    }, 2000)
  }, [])

  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition = Math.floor(nativeEvent?.contentOffset?.y) ?? 0

    setIsExtended(currentScrollPosition <= 0)
  }

  const onDialogFailure = () => {
    setVisible(!visible)
  }

  const onDialogSuccecss = async () => {
    setVisible(!visible)

    // ToastAndroid.showWithGravityAndOffset(
    //   "Printing feature will be added in some days.",
    //   ToastAndroid.SHORT,
    //   ToastAndroid.CENTER,
    //   25,
    //   50,
    // )
    setIsDisabled(true)
    setIsLoading(true)
    await handleRePrintReceipt()
    setIsDisabled(false)
    setIsLoading(false)
  }

  const handleRePrintReceipt = async () => {
    if (billedSaleData.length > 0) {
      gstFlag === "N"
        ? rePrintWithoutGst(
            billedSaleData,
            netTotal,
            totalDiscount,
            billedSaleData[0]?.received_amt,
            billedSaleData[0]?.received_amt !== undefined
              ? billedSaleData[0]?.received_amt -
                  grandTotalCalculate(netTotal, totalDiscount)
              : 0,
            billedSaleData[0]?.cust_name,
            billedSaleData[0]?.phone_no,
            billedSaleData[0]?.receipt_no,
            billedSaleData[0]?.pay_mode,
          )
        : rePrint(
            billedSaleData,
            netTotal,
            totalDiscount,
            billedSaleData[0]?.received_amt,
            billedSaleData[0]?.received_amt !== undefined
              ? billedSaleData[0]?.received_amt -
                  grandTotalCalculate(netTotal, totalDiscount)
              : 0,
            billedSaleData[0]?.cust_name,
            billedSaleData[0]?.phone_no,
            billedSaleData[0]?.receipt_no,
            billedSaleData[0]?.pay_mode,
          )
    } else {
      ToastAndroid.show("Something went wrong!", ToastAndroid.SHORT)
      return
    }
  }

  const handleGetBillSummary = async () => {
    await fetchBillSummary(
      formattedDate,
      loginStore.comp_id,
      loginStore.br_id,
      loginStore.user_id,
    )
      .then(res => {
        setTotalBills(res?.data[0]?.total_bills)
        setAmountCollected(res?.data[0]?.amount_collected)
      })
      .catch(err => {
        ToastAndroid.show(
          "Check your internet connection or something went wrong in the server.",
          ToastAndroid.SHORT,
        )
        console.log("handleGetBillSummary - HomeScreen", err, formattedDate)
      })
  }

  const handleGetRecentBills = async () => {
    await fetchRecentBills(
      formattedDate,
      loginStore.comp_id,
      loginStore.br_id,
      loginStore.user_id,
    )
      .then(res => {
        setRecentBills(res)
      })
      .catch(err => {
        ToastAndroid.show(
          "Error during fetching recent bills.",
          ToastAndroid.SHORT,
        )
      })
  }

  const handleGetVersion = async () => {
    await fetchVersionInfo()
      .then(res => {
        if (parseFloat(res?.data[0]?.version_no) > parseFloat(version)) {
          showDialogForAppUpdate()
          // Alert.alert("UPDATE FOUND!", "Please update your app.")
        }
        setUpdateUrl(res?.data[0]?.url)
      })
      .catch(err => {
        ToastAndroid.show(
          "Error during getting version info.",
          ToastAndroid.SHORT,
        )
      })
  }

  useEffect(() => {
    handleGetBillSummary()
    handleGetRecentBills()

    handleGetVersion()
  }, [isFocused])

  const updateApp = () => {
    Linking.openURL(updateUrl)
  }

  const handleGetBill = async (rcptNo: number) => {
    await fetchBill(rcptNo)
      .then(res => {
        setBilledSaleData(res?.data)
        console.log("handleGetBill - HOMESCREEN - fetchBill", res?.data)
      })
      .catch(err => {
        ToastAndroid.show("Error during fetching old bill", ToastAndroid.SHORT)
      })
  }

  const handleRecentBillListClick = (rcptNo: number) => {
    setVisible(!visible)
    handleGetBill(rcptNo)
    setCurrentReceiptNo(rcptNo)
    setGstFlag(billedSaleData[0]?.gst_flag)
  }

  const handleCancellingBill = async (rcptNo: number) => {
    let res = await cancelBill(rcptNo, loginStore.user_id)

    if (res?.status === 1) {
      ToastAndroid.show(res?.data, ToastAndroid.SHORT)
      setVisible(!visible)
    }
    handleGetBillSummary()
    handleGetRecentBills()
    return
  }

  const handleCancelBill = (rcptNo: number) => {
    Alert.alert(
      "Cancelling Bill",
      `Are you sure you want to cancel this bill?`,
      [
        { text: "BACK", onPress: () => console.log("NOOOOOO") },
        { text: "CANCEL BILL", onPress: () => handleCancellingBill(rcptNo) },
      ],
      { cancelable: false },
    )
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        onScroll={onScroll}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={{ alignItems: "center" }}>
          <HeaderImage
            imgLight={flowerHome}
            imgDark={flowerHomeDark}
            borderRadius={30}
            blur={10}>
            Welcome Back, {loginStore.company_name}!
          </HeaderImage>
        </View>

        <Portal>
          <Dialog visible={visibleUpdatePortal} dismissable={false}>
            <Dialog.Title>UPDATE FOUND!</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">Please update your app.</Text>
            </Dialog.Content>
            <Dialog.Actions>
              {/* <Button onPress={hideDialog}>Cancel</Button> */}
              <Button onPress={updateApp}>Download</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        <View style={{ alignItems: "center" }}>
          <SurfacePaper
            smallWidthEnabled
            borderRadiusEnabled={false}
            paddingEnabled
            // heading="Summary"
            elevation={1}
            backgroundColor={theme.colors.surfaceVariant}
            style={{
              borderTopRightRadius: normalize(30),
              borderTopLeftRadius: normalize(30),
            }}>
            <View style={{ width: "100%", padding: normalize(15) }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}>
                <View>
                  <Text variant="titleLarge">Total Bills</Text>
                </View>
                <View>
                  <Text variant="titleLarge">{totalBills}</Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}>
                <View>
                  <Text variant="titleLarge">Amount Collected</Text>
                </View>
                <View>
                  <Text variant="titleLarge">₹{amountCollected}</Text>
                </View>
              </View>
            </View>
          </SurfacePaper>

          {/* <View style={{ width: SCREEN_WIDTH / 1.16, alignSelf: "center" }}>
            <SegmentedButtons
              value={segmentedButtonValue}
              onValueChange={setSegmentedButtonValue}
              buttons={[
                {
                  value: "cancel",
                  label: "Cancel Bill",
                  icon: "cancel",
                  checkedColor: theme.colors.primary,
                  uncheckedColor: theme.colors.primary,
                  onPress: () => navigation.dispatch(
                    CommonActions.navigate({
                      name: navigationRoutes.cancelBillScreen,
                    })
                  ),
                  style: { backgroundColor: theme.colors.primaryContainer, borderRadius: 0 }
                },
                {
                  value: "refund",
                  label: "Refund",
                  icon: "cash-refund",
                  checkedColor: theme.colors.orange,
                  uncheckedColor: theme.colors.orange,
                  onPress: () => console.log("REFUND"),
                  style: { backgroundColor: theme.colors.orangeContainer, borderRadius: 0 }
                },
              ]}
            />
          </View> */}

          <SurfacePaper
            smallWidthEnabled
            borderRadiusEnabled={false}
            paddingEnabled
            isBorderEnabled
            heading="Recent Bills"
            elevation={1}
            backgroundColor={theme.colors.tertiaryContainer}
            style={{
              borderBottomLeftRadius: normalize(30),
              borderBottomRightRadius: normalize(30),
            }}>
            <View style={{ width: "100%" }}>
              {recentBills?.map((item, i) => (
                <List.Item
                  key={i}
                  title={`Bill ${item?.receipt_no}`}
                  description={`₹${item?.net_amt}`}
                  onPress={() => handleRecentBillListClick(item?.receipt_no)}
                  left={props => <List.Icon {...props} icon="basket" />}
                  // right={props => (
                  //   <List.Icon {...props} icon="download" />
                  // )}
                />
              ))}
            </View>
            <View>
              <Button
                textColor={theme.colors.onPinkContainer}
                onPress={() =>
                  navigation.dispatch(
                    CommonActions.navigate({
                      name: navigationRoutes.allBillsScreen,
                    }),
                  )
                }>
                ALL BILLS
              </Button>
            </View>
          </SurfacePaper>
        </View>
      </ScrollView>

      <DialogBox
        iconSize={30}
        visible={visible}
        hide={hideDialog}
        titleStyle={styles.title}
        // btnSuccess="REPRINT"
        // onFailure={onDialogFailure}
        // onSuccess={onDialogSuccecss}
        title="Print Bill"
        disabled={isDisabled}
        loading={isLoading}
        // icon="printer-outline"
      >
        <ScrollableListContainer
          backgroundColor={theme.colors.surfaceVariant}
          height={250}
          width={300}>
          {billedSaleData?.map((item, i) => {
            // console.log("billedSaleData - item.item_name", item.item_name)
            // console.log("billedSaleData - item.qty", item.qty)
            // console.log("billedSaleData - item.price", item.price)
            netTotal += item.price * item.qty

            item?.discount_type === "P"
              ? (totalDiscount += item?.discount_amt)
              : (totalDiscount += item?.discount_amt * item?.qty)
            //@ts-ignore
            // totalDiscount += item?.discount_amt
            return (
              <AddedProductList
                disabled
                itemName={item.item_name}
                quantity={item.qty}
                // unit={item.unit}
                unitPrice={item.price}
                discount={
                  item?.discount_type === "P"
                    ? item?.dis_pertg
                    : item?.discount_amt
                }
                discountType={item?.discount_type}
                gstFlag={item?.gst_flag}
                key={i}
              />
            )
          })}
        </ScrollableListContainer>
        <NetTotalForRePrints
          width={300}
          backgroundColor={theme.colors.orangeContainer}
          addedProductsList={billedSaleData}
          netTotal={netTotal}
          textColor={theme.colors.onGreenContainer}
          totalDiscount={totalDiscount}
          disabled
        />
        {/* <View style={{ paddingTop: normalize(10) }}>
          <ButtonPaper icon="cancel" mode="contained-tonal" onPress={() => handleCancelBill(currentReceiptNo)} buttonColor={theme.colors.error} textColor={theme.colors.onError}>
            CANCEL BILL
          </ButtonPaper>
        </View> */}
      </DialogBox>
      <AnimatedFABPaper
        icon="plus"
        label="Bill"
        onPress={() =>
          navigation.dispatch(
            CommonActions.navigate({
              name: navigationRoutes.productsScreen,
            }),
          )
        }
        extended={isExtended}
        animateFrom="right"
        iconMode="dynamic"
        customStyle={styles.fabStyle}
      />
    </SafeAreaView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },

  title: {
    textAlign: "center",
  },

  bill: {
    margin: normalize(20),
    padding: normalize(10),
    // minHeight: 200,
    height: "auto",
    maxHeight: "auto",
    borderRadius: normalize(30),
    width: normalize(320),
    alignItems: "center",
  },

  fabStyle: {
    bottom: normalize(16),
    right: normalize(16),
    position: "absolute",
  },
})
