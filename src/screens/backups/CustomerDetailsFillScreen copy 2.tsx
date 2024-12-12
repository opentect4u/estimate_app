import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  View,
} from "react-native"
import { List, RadioButton, Text } from "react-native-paper"
import LinearGradient from "react-native-linear-gradient"
import normalize, { SCREEN_HEIGHT, SCREEN_WIDTH } from "react-native-normalize"
import { usePaperColorScheme } from "../theme/theme"
import InputPaper from "../components/InputPaper"
import { useContext, useEffect, useState } from "react"
import ButtonPaper from "../components/ButtonPaper"
import {
  CommonActions,
  useNavigation,
  useRoute,
} from "@react-navigation/native"
import HeaderImage from "../components/HeaderImage"
import { productHeader, productHeaderDark } from "../resources/images"
import { useBluetoothPrint } from "../hooks/printables/useBluetoothPrint"
import NetTotalButton from "../components/NetTotalButton"
import { AppStore } from "../context/AppContext"
import SquircleBox from "../components/SquircleBox"
import useSaleInsert from "../hooks/api/useSaleInsert"
import { loginStorage } from "../storage/appStorage"
import { FilteredItem } from "../models/custom_types"
import navigationRoutes from "../routes/navigationRoutes"
import { ProductsScreenRouteProp } from "../models/route_types"
import { mapItemToFilteredItem } from "../utils/mapItemToFilteredItem"
import { gstFilterationAndTotals } from "../utils/gstFilterTotal"
import useCalculations from "../hooks/useCalculations"
import useCustomerInfo from "../hooks/api/useCustomerInfo"
import useBillSms from "../hooks/api/useBillSms"
import {
  BillSmsCredentials,
  CustomerInfoCredentials,
} from "../models/api_types"
import MenuPaper from "../components/MenuPaper"

const CustomerDetailsFillScreen = () => {
  const navigation = useNavigation()
  const { params } = useRoute<ProductsScreenRouteProp>()
  const theme = usePaperColorScheme()

  const loginStore = JSON.parse(loginStorage.getString("login-data"))

  const { receiptSettings } = useContext(AppStore)

  const { totalGST } = gstFilterationAndTotals(
    params?.added_products,
    receiptSettings?.gst_type,
  )

  const { printReceipt, printReceiptWithoutGst } = useBluetoothPrint()
  const {
    grandTotalCalculate,
    grandTotalWithGSTCalculate,
    grandTotalWithGSTInclCalculate,
  } = useCalculations()
  const { sendSaleDetails } = useSaleInsert()
  const { fetchCustomerInfo } = useCustomerInfo()
  const { sendBillSms } = useBillSms()

  const [customerName, setCustomerName] = useState<string>(() => "")
  const [customerMobileNumber, setCustomerMobileNumber] = useState<string>(
    () => "",
  )
  const [cashAmount, setCashAmount] = useState<number | undefined>(
    () => undefined,
  )
  const [finalCashAmount, setFinalCashAmount] = useState<number | undefined>(
    () => undefined,
  )
  let receiptNumber: number | undefined = undefined
  let kotNumber: number | undefined = undefined

  const [checked, setChecked] = useState<string>(() => "C")
  const [isLoading, setIsLoading] = useState(() => false)
  const [isDisabled, setIsDisabled] = useState(() => false)

  const [customerInfoFlag, setcustomerInfoFlag] = useState<number>()

  let paymentModeOptionsArr = [
    { icon: "cash", title: "Cash", func: () => setChecked("C") },
    { icon: "credit-card-outline", title: "Card", func: () => setChecked("D") },
    { icon: "contactless-payment", title: "UPI", func: () => setChecked("U") },
    { icon: "credit-card-clock-outline", title: "Credit", func: () => setChecked("R") },
  ]

  useEffect(() => {
    if (receiptSettings?.gst_flag === "Y") {
      receiptSettings?.gst_type === "E"
        ? setFinalCashAmount(() =>
          cashAmount !== undefined
            ? cashAmount -
            parseFloat(
              grandTotalWithGSTCalculate(
                params?.net_total,
                params?.total_discount,
                totalGST,
              ),
            )
            : 0,
        )
        : setFinalCashAmount(() =>
          cashAmount !== undefined
            ? cashAmount -
            parseFloat(
              grandTotalWithGSTInclCalculate(
                params?.net_total,
                params?.total_discount,
              ),
            )
            : 0,
        )
    } else {
      setFinalCashAmount(() =>
        cashAmount !== undefined
          ? cashAmount -
          grandTotalCalculate(params?.net_total, params?.total_discount)
          : 0,
      )
    }
  }, [cashAmount])

  useEffect(() => {
    if (customerMobileNumber.length === 10) {
      handleGetCustomerInfo()
    }
  }, [customerMobileNumber])

  const handleGetCustomerInfo = async () => {
    let fetchCustInfCreds: CustomerInfoCredentials = {
      comp_id: loginStore?.comp_id,
      phone_no: customerMobileNumber,
    }

    await fetchCustomerInfo(fetchCustInfCreds)
      .then(res => {
        setCustomerName(res?.data[0]?.cust_name)
        setcustomerInfoFlag(() => 1)
        if (res?.data?.length === 0) {
          setCustomerName("New Customer")
          setcustomerInfoFlag(() => 0)
        }
      })
      .catch(err => {
        ToastAndroid.show(
          "Some error occurred while fetching Customer Name!",
          ToastAndroid.SHORT,
        )
      })
  }

  const onChangeCustomerMobileNumber = (mobile: string) => {
    if (/^\d*$/.test(mobile)) {
      setCustomerMobileNumber(mobile)
    }
  }

  const handleSendSaleData = async () => {
    const loginStore = JSON.parse(loginStorage.getString("login-data"))
    const branchId = loginStore.br_id
    const createdBy = loginStore.user_id

    let filteredData: FilteredItem[]

    filteredData = (params?.added_products).map(item =>
      mapItemToFilteredItem(
        item,
        receiptSettings,
        branchId,
        params,
        checked,
        cashAmount,
        customerName,
        customerMobileNumber,
        createdBy,
        totalGST,
        receiptSettings?.gst_flag,
        receiptSettings?.gst_type,
        receiptSettings?.discount_flag,
        receiptSettings?.discount_type,
        receiptSettings?.discount_position,
        receiptSettings?.rcpt_type,
        customerInfoFlag,
        receiptSettings?.stock_flag,
      ),
    )

    console.log("filteredData - handleSendSaleData", filteredData)
    await sendSaleDetails(filteredData)
      .then(res => {
        console.log("filteredData====filteredData", filteredData)

        console.log("res.data.status===================", res.data.status)
        if (res.data.status === 1) {
          receiptNumber = res?.data?.data
          kotNumber = res?.kot_no?.kot_no

          console.log(
            "=========== receiptNumber = res?.data?.data ============",
            receiptNumber,
          )
          console.log(
            "=========== kotNumber = res?.kot_no ============",
            kotNumber,
          )

          Alert.alert("Success", "Bill Uploaded Successfully.")

          navigation.dispatch(
            CommonActions.navigate({
              name: navigationRoutes.homeScreen,
            }),
          )

          if (receiptSettings?.rcpt_type !== "P") {
            let sendBillSmsCreds: BillSmsCredentials = {
              comp_id: loginStore?.comp_id,
              phone: customerMobileNumber,
              receipt_no: receiptNumber,
            }
            sendBillSms(sendBillSmsCreds)
              .then(res => {
                if (res?.suc === 1) {
                  ToastAndroid.show("SMS Sent to customer.", ToastAndroid.SHORT)
                }
              })
              .catch(err => {
                ToastAndroid.show(
                  "Some error occurred while sending bill sms.",
                  ToastAndroid.SHORT,
                )
              })
          }
        } else {
          Alert.alert("Fail", "Something Went Wrong!")
        }
      })
      .catch(err => {
        Alert.alert("Fail", "Error while sending sale details!!!!!")
        console.log("EEEEEEEEEERRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR", err)
      })
  }

  const handlePrintReceipt = async () => {
    if (
      checked === "C" &&
      (cashAmount === undefined || cashAmount === 0 || finalCashAmount < 0)
    ) {
      ToastAndroid.show("Add valid cash amount.", ToastAndroid.SHORT)
      return
    }

    if (customerMobileNumber.length === 0) {
      ToastAndroid.show("Customer mobile is mandatory.", ToastAndroid.SHORT)
      return
    }

    setIsDisabled(true)
    setIsLoading(true)
    await handleSendSaleData()
    console.log("Sending data and printing receipts...")

    const receiptFunction =
      receiptSettings?.gst_flag === "N" ? printReceiptWithoutGst : printReceipt

    if (receiptSettings?.rcpt_type !== "S") {
      receiptFunction(
        params?.added_products,
        params?.net_total,
        //@ts-ignore
        parseFloat(params?.total_discount),
        cashAmount,
        finalCashAmount,
        customerName,
        customerMobileNumber,
        receiptNumber,
        checked,
        kotNumber,
        params?.table_no
      )

      console.log(
        "=================+++++++++++++++++++ params?.added_products",
        params?.added_products,
      )
      console.log(
        "=================+++++++++++++++++++ params?.net_total",
        params?.net_total,
      )
      console.log(
        "=================+++++++++++++++++++ parseFloat(params?.total_discount)",
        //@ts-ignore
        parseFloat(params?.total_discount),
      )
      console.log("=================+++++++++++++++++++ cashAmount", cashAmount)
      console.log(
        "=================+++++++++++++++++++ finalCashAmount",
        finalCashAmount,
      )
      console.log(
        "=================+++++++++++++++++++ customerName",
        customerName,
      )
      console.log(
        "=================+++++++++++++++++++ customerMobileNumber",
        customerMobileNumber,
      )
      console.log(
        "=================+++++++++++++++++++ receiptNumber",
        receiptNumber,
      )
      console.log("=================+++++++++++++++++++ checked", checked)
    }

    console.log("params?.added_products", params?.added_products)
    setIsLoading(false)
    setIsDisabled(false)
  }

  return (
    <SafeAreaView>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View
          style={{
            backgroundColor: theme.colors.background,
            minHeight: SCREEN_HEIGHT,
            height: "auto",
          }}>
          <View style={{ alignItems: "center" }}>
            <HeaderImage
              imgLight={productHeader}
              imgDark={productHeaderDark}
              borderRadius={30}
              blur={10}
              isBackEnabled>
              {receiptSettings?.cust_inf === "Y"
                ? "Customer Details & Print"
                : "Print"}
            </HeaderImage>
          </View>
          {/* <View style={{ padding: normalize(20) }}>
                        <Text variant='displayMedium' style={{ color: theme.colors.onPrimary, textAlign: 'center' }}>Customer Details</Text>
                    </View> */}

          <View
            style={{
              marginTop: normalize(-21),
            }}>
            <NetTotalButton
              disabled
              backgroundColor={theme.colors.primaryContainer}
              textColor={theme.colors.onPrimaryContainer}
              addedProductsList={params?.added_products}
              netTotal={params?.net_total}
              totalDiscount={params?.total_discount}
            />
          </View>

          <View
            style={{
              backgroundColor: theme.colors.surfaceVariant,
              borderRadius: 40,
              width: SCREEN_WIDTH / 1.15,
              alignSelf: "center",
              marginTop: normalize(10),
            }}>
            <View style={{ justifyContent: "center" }}>
              <View
                style={{
                  paddingHorizontal: normalize(20),
                  paddingVertical: normalize(5),
                  marginVertical: SCREEN_HEIGHT / 100,
                }}>
                <InputPaper
                  label="Enter Mobile"
                  value={customerMobileNumber}
                  onChangeText={onChangeCustomerMobileNumber}
                  keyboardType="number-pad"
                  leftIcon="card-account-phone-outline"
                  maxLength={10}
                />
                {receiptSettings?.cust_inf === "Y" && (
                  <InputPaper
                    selectTextOnFocus
                    label="Enter Name (Optional)"
                    value={customerName}
                    onChangeText={(customerName: string) =>
                      setCustomerName(customerName)
                    }
                    keyboardType="default"
                    leftIcon="account-circle-outline"
                    maxLength={18}
                    customStyle={{ marginBottom: normalize(10) }}
                  />
                )}
              </View>
            </View>

            {receiptSettings?.pay_mode === "Y" && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  // marginRight: normalize(20),
                  // marginLeft: normalize(9),
                  // marginTop: normalize(5),
                  flexWrap: "wrap"
                }}>
                {/* <RadioButton
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
                  Cash
                </Text>
                <RadioButton
                  value="D"
                  status={checked === "D" ? "checked" : "unchecked"}
                  color={theme.colors.onTertiaryContainer}
                  onPress={() => setChecked("D")}
                />
                <Text
                  variant="labelLarge"
                  style={
                    checked === "D" && {
                      color: theme.colors.onTertiaryContainer,
                    }
                  }>
                  Card
                </Text>
                <RadioButton
                  value="U"
                  status={checked === "U" ? "checked" : "unchecked"}
                  color={theme.colors.onTertiaryContainer}
                  onPress={() => setChecked("U")}
                />
                <Text
                  variant="labelLarge"
                  style={
                    checked === "U" && {
                      color: theme.colors.onTertiaryContainer,
                    }
                  }>
                  UPI
                </Text>
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
                  Credit
                </Text> */}
                <List.Item
                  title="Payment Mode"
                  description={
                    checked === "C"
                      ? "Cash"
                      : checked === "D"
                        ? "Card"
                        : checked === "U"
                          ? "UPI"
                          : checked === "R"
                            ? "Credit"
                            : "Error Occurred"
                  }
                  left={props => <List.Icon {...props} icon="contactless-payment-circle-outline" />}
                  right={props => {
                    return <MenuPaper menuArrOfObjects={paymentModeOptionsArr} />
                  }}
                  descriptionStyle={{
                    color: theme.colors.green,
                  }}
                />
              </View>
            )}

            {checked === "C" && (
              <View>
                <View style={{ padding: normalize(20) }}>
                  <InputPaper
                    label="Received Cash"
                    value={cashAmount}
                    onChangeText={(cash: number) => setCashAmount(cash)}
                    keyboardType="number-pad"
                    leftIcon="cash-multiple"
                    maxLength={8}
                    customStyle={{ marginBottom: normalize(10) }}
                  />
                </View>
                <SquircleBox
                  backgroundColor={theme.colors.surface}
                  textColor={theme.colors.onSurface}
                  height={SCREEN_HEIGHT / 10}>
                  RETURNED AMOUNT: ₹{finalCashAmount}
                </SquircleBox>
              </View>
            )}

            <View style={{ padding: normalize(20) }}>
              <ButtonPaper
                mode="contained"
                buttonColor={theme.colors.primary}
                textColor={theme.colors.primaryContainer}
                onPress={handlePrintReceipt}
                icon="cloud-print-outline"
                loading={isLoading}
                disabled={isDisabled}>
                PRINT
              </ButtonPaper>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default CustomerDetailsFillScreen

const styles = StyleSheet.create({})
