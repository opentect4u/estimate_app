import React, { useContext, useState } from "react"
import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  View,
  ToastAndroid,
  Alert,
} from "react-native"
import { List, RadioButton, Searchbar, Text } from "react-native-paper"
import HeaderImage from "../components/HeaderImage"
import {
  textureReport,
  textureReportDark,
} from "../resources/images"
import { usePaperColorScheme } from "../theme/theme"
import { CommonActions, useNavigation } from "@react-navigation/native"
import ButtonPaper from "../components/ButtonPaper"
import normalize from "react-native-normalize"
import useShowBill from "../hooks/api/useShowBill"
import navigationRoutes from "../routes/navigationRoutes"
import useRefundList from "../hooks/api/useRefundList"
import {
  RefundListCredentials,
  SearchBillsByMobileCredentials,
  SearchBillsByMobileResponse,
  SearchBillsByMobileResponseData,
  ShowBillData,
} from "../models/api_types"
import { loginStorage } from "../storage/appStorage"
import { AppStore } from "../context/AppContext"
import useSearchBillsByMobile from "../hooks/api/useSearchBillsByMobile"
import DialogBox from "../components/DialogBox"
import ScrollableListContainer from "../components/ScrollableListContainer"
import AddedProductList from "../components/AddedProductList"
import NetTotalForRePrints from "../components/NetTotalForRePrints"
import DialogBoxForReprint from "../components/DialogBoxForReprint"
import { useBluetoothPrint } from "../hooks/printables/useBluetoothPrint"
import useCalculations from "../hooks/useCalculations"
import { AppStoreContext } from "../models/custom_types"
import useCancelBill from "../hooks/api/useCancelBill"

function SearchBillsByMobileNumberScreen() {
  const theme = usePaperColorScheme()
  const navigation = useNavigation()

  const loginStore = JSON.parse(loginStorage.getString("login-data"))

  const { receiptSettings } = useContext<AppStoreContext>(AppStore)
  const { rePrint, rePrintWithoutGst } = useBluetoothPrint()
  const {
    grandTotalCalculate,
    grandTotalWithGSTCalculate,
    grandTotalWithGSTInclCalculate,
  } = useCalculations()
  const { cancelBill } = useCancelBill()
  const { fetchBill } = useShowBill()
  const { fetchSearchedBills } = useSearchBillsByMobile()

  const [visible, setVisible] = useState(() => false)
  const hideDialog = () => setVisible(() => false)

  const [currentReceiptNo, setCurrentReceiptNo] = useState<number | undefined>(
    () => undefined,
  )
  const [cancelledBillStatus, setCancelledBillStatus] = useState<"Y" | "N">()
  const [gstFlag, setGstFlag] = useState<"Y" | "N">()
  const [gstType, setGstType] = useState<"I" | "E">()
  const [discountType, setDiscountType] = useState<"P" | "A">()

  const [billedSaleData, setBilledSaleData] = useState<ShowBillData[]>(() => [])
  const [fetchedBillsData, setFetchedBillsData] = useState<
    SearchBillsByMobileResponseData[]
  >(() => [])

  const [checked, setChecked] = useState<string>(() => "R")
  const [isLoading, setIsLoading] = useState(() => false)
  const [isDisabled, setIsDisabled] = useState(() => false)

  const [search, setSearch] = useState<string>(() => "")
  const onChangeSearch = (query: string) => {
    if (/^\d*$/.test(query)) {
      setSearch(query)
    }
  }

  const handleGetBills = async (mobile: string) => {
    setIsDisabled(true)
    setIsLoading(true)
    const reqCreds: SearchBillsByMobileCredentials = {
      comp_id: loginStore?.comp_id,
      br_id: loginStore?.br_id,
      phone_no: mobile,
    }

    console.log(
      "comp_id br_id phone_no",
      loginStore?.comp_id,
      loginStore?.br_id,
      mobile,
    )

    await fetchSearchedBills(reqCreds)
      .then(res => {
        if (res?.data?.length === 0) {
          ToastAndroid.show("No bills found.", ToastAndroid.SHORT)
          return
        }

        console.log("UUUUUUUUUUUUUUUUUUUUUU=================", res?.data)
        setFetchedBillsData(res?.data)
        // navigation.dispatch(
        //     CommonActions.navigate({
        //         name: navigationRoutes.receiptsAgainstMobileScreen,
        //         params: {
        //             customer_phone_number: search,
        //             bills_data: res
        //         }
        //     })
        // )
      })
      .catch(err => {
        ToastAndroid.show("Error during fetching bills...", ToastAndroid.SHORT)
        console.log("EEEEEEEEEEEERRRRRRRRRRRRRRRRRRRR", err)
      })

    setIsDisabled(false)
    setIsLoading(false)
  }

  const handleSearchClick = (mobile: string) => {
    if (!search || search.length !== 10) {
      ToastAndroid.show("Enter valid phone number.", ToastAndroid.SHORT)
      return
    }
    // setVisible(!visible)
    handleGetBills(mobile)
    // setCurrentReceiptNo(rcptNo)
    // setGstFlag(billedSaleData[0]?.gst_flag)
  }

  const handleGetBill = async (rcptNo: number) => {
    await fetchBill(rcptNo)
      .then(res => {
        setBilledSaleData(res?.data)
        setCancelledBillStatus(res?.cancel_flag)
      })
      .catch(err => {
        ToastAndroid.show("Error during fetching bills.", ToastAndroid.SHORT)
      })
  }

  const handleBillListClick = (rcptNo: number) => {
    setVisible(!visible)
    handleGetBill(rcptNo)
    setCurrentReceiptNo(rcptNo)
    setGstFlag(billedSaleData[0]?.gst_flag)
    setGstType(billedSaleData[0]?.gst_type)
  }

  const onDialogFailure = () => {
    setVisible(!visible)
  }

  const onDialogSuccecss = () => {
    setVisible(!visible)
    // ToastAndroid.showWithGravityAndOffset(
    //   "Printing feature will be added in some days.",
    //   ToastAndroid.SHORT,
    //   ToastAndroid.CENTER,
    //   25,
    //   50,
    // )
    handleRePrintReceipt()
  }

  const handleRePrintReceipt = () => {
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
        : gstType === "E"
          ? rePrint(
            billedSaleData,
            netTotal,
            totalDiscount,
            billedSaleData[0]?.received_amt,
            billedSaleData[0]?.received_amt !== undefined
              ? billedSaleData[0]?.received_amt -
              parseFloat(
                grandTotalWithGSTCalculate(
                  netTotal,
                  totalDiscount,
                  billedSaleData[0]?.tcgst_amt * 2,
                ),
              )
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
              parseFloat(
                grandTotalWithGSTInclCalculate(netTotal, totalDiscount),
              )
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

  const handleCancellingBill = async (rcptNo: number) => {
    await cancelBill(rcptNo, loginStore.user_id).then(res => {
      if (res?.status === 1) {
        ToastAndroid.show(res?.data, ToastAndroid.SHORT)
        setVisible(!visible)
      }
    }).catch(err => {
      ToastAndroid.show(`Error occurred during cancelling bill. ${err}`, ToastAndroid.SHORT)
      setVisible(!visible)
    })
  }

  const handleCancelBill = (rcptNo: number) => {
    Alert.alert("Cancelling Bill", `Are you sure you want to cancel this bill?`, [
      { text: "BACK", onPress: () => ToastAndroid.show("Operation cancelled by user.", ToastAndroid.SHORT) },
      { text: "CANCEL BILL", onPress: () => handleCancellingBill(rcptNo) },
    ],
      { cancelable: false },
    )
  }

  let netTotal: number = 0
  let totalDiscount: number = 0

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
            Search By <Text style={{
              textDecorationLine: "underline",
              textDecorationStyle: "dashed",
              textTransform: "uppercase",
            }}>Mobile</Text>
          </HeaderImage>
        </View>

        <View
          style={{
            paddingHorizontal: normalize(20),
            paddingBottom: normalize(10),
          }}>



          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              // marginRight: normalize(18),
              // marginLeft: normalize(4),
              marginBottom: normalize(20),
              marginHorizontal: normalize(25),
              flexWrap: "wrap"
            }}>
            <View style={styles.eachRadioBtn}>
              <RadioButton
                value="R"
                status={checked === "R" ? "checked" : "unchecked"}
                color={theme.colors.onTertiaryContainer}
                onPress={() => setChecked("R")}
              />
              <Text
                variant="labelLarge"
                style={
                  checked === "R" && {
                    color: theme.colors.onTertiaryContainer,
                  }
                }>
                Receipt No.
              </Text>
            </View>

            <View style={styles.eachRadioBtn}>
              <RadioButton
                value="M"
                status={checked === "M" ? "checked" : "unchecked"}
                color={theme.colors.onTertiaryContainer}
                onPress={() => setChecked("M")}
              />
              <Text
                variant="labelLarge"
                style={
                  checked === "M" && {
                    color: theme.colors.onTertiaryContainer,
                  }
                }>
                Mobile No.
              </Text>
            </View>

            <View style={styles.eachRadioBtn}>
              <RadioButton
                value="C"
                status={checked === "C" ? "checked" : "unchecked"}
                color={theme.colors.onTertiaryContainer}
                onPress={() => setChecked("C")}
              />
              <Text
                variant="labelLarge"
                style={
                  checked === "C" && {
                    color: theme.colors.onTertiaryContainer,
                  }
                }>
                Customer
              </Text>
            </View>
          </View>







          <View
            style={{
              paddingHorizontal: normalize(10),
              paddingBottom: normalize(10),
            }}>
            <Searchbar
              autoFocus
              // placeholder="Search Bills"
              placeholder="Mobile Number"
              onChangeText={onChangeSearch}
              value={search}
              elevation={search && 2}
              keyboardType="numeric"
              maxLength={10}
              style={{
                backgroundColor: theme.colors.vanillaSecondaryContainer,
                color: theme.colors.onVanillaSecondaryContainer,
              }}
            // loading={search ? true : false}
            />
          </View>
          {/* <ButtonPaper onPress={() => handleGetBillsByDate(formattedFromDate, formattedToDate)} mode="contained-tonal">
                        SUBMIT
                    </ButtonPaper> */}
          <View
            style={{
              paddingHorizontal: normalize(10),
            }}>
            <ButtonPaper
              onPress={() => handleSearchClick(search)}
              mode="contained-tonal"
              buttonColor={theme.colors.vanillaContainer}
              loading={isLoading}
              disabled={isDisabled}>
              SUBMIT
            </ButtonPaper>
          </View>
        </View>

        <View style={{ width: "100%" }}>
          {fetchedBillsData?.map((item, i) => (
            <List.Item
              titleStyle={{
                color: theme.colors.vanilla,
              }}
              descriptionStyle={{
                color: theme.colors.vanillaSecondary,
              }}
              key={i}
              title={`${item?.trn_date}`}
              description={`${item?.receipt_no}`}
              onPress={() => handleBillListClick(item?.receipt_no)}
              left={props => <List.Icon {...props} icon="basket" />}
              right={props => (
                <Text
                  variant="bodyMedium"
                  {...props}
                  style={{ color: theme.colors.vanillaTertiary }}>
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



      <DialogBoxForReprint
        iconSize={30}
        visible={visible}
        hide={hideDialog}
        titleStyle={styles.title}

        currentReceiptNo={currentReceiptNo}
        billedSaleData={billedSaleData}
        handleCancelBill={handleCancelBill}
        cancelledBillStatus={cancelledBillStatus}
        netTotalButtonColors={[theme.colors.vanillaContainer, theme.colors.onVanillaContainer]}

        onDialogFailure={onDialogFailure}
        onDialogSuccecss={onDialogSuccecss}
      />



    </SafeAreaView>
  )
}

export default SearchBillsByMobileNumberScreen

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },

  title: {
    textAlign: "center",
  },

  eachRadioBtn: {
    justifyContent: "center",
    alignItems: "center"
  }
})
