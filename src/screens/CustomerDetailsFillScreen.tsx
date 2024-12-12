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
  useIsFocused,
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
import { ezetapStorage, fileStorage, itemsContextStorage, loginStorage } from "../storage/appStorage"
import { AppStoreContext, FilteredItem } from "../models/custom_types"
import navigationRoutes from "../routes/navigationRoutes"
import { ProductsScreenRouteProp } from "../models/route_types"
import { mapItemToFilteredItem } from "../utils/mapItemToFilteredItem"
import { gstFilterationAndTotals } from "../utils/gstFilterTotal"
import useCalculations from "../hooks/useCalculations"
import useCustomerInfo from "../hooks/api/useCustomerInfo"
import useSendTxnDetails from "../hooks/api/useSendTxnDetails"
// import useBillSms from "../hooks/api/useBillSms"
import {
  BillSmsCredentials,
  CustomerInfoCredentials,
  LoginData,
  LoginDataMessage,
  TxnDetailsCreds,
} from "../models/api_types"
import useBillSms2 from "../hooks/api/useBillSms2"
import QRCode from "react-native-qrcode-svg"
import RNEzetapSdk from "react-native-ezetap-sdk"

const CustomerDetailsFillScreen = () => {
  const isFocused = useIsFocused()
  const navigation = useNavigation()
  const { params } = useRoute<ProductsScreenRouteProp>()
  const theme = usePaperColorScheme()

  const loginStore = JSON.parse(loginStorage.getString("login-data")) as LoginDataMessage
  const upiData = fileStorage.getString("upi-data")

  const { receiptSettings, init } = useContext<AppStoreContext>(AppStore)

  const { totalGST } = gstFilterationAndTotals(
    params?.added_products,
    receiptSettings?.gst_type,
  )

  const { printReceiptT } = useBluetoothPrint()
  const {
    grandTotalCalculate,
    grandTotalWithGSTCalculate,
    grandTotalWithGSTInclCalculate,
  } = useCalculations()
  const { sendSaleDetails } = useSaleInsert()
  const { fetchCustomerInfo } = useCustomerInfo()
  // const { sendBillSms } = useBillSms()
  // const { sendBillSms } = useBillSms2()
  const { sendTxnDetails } = useSendTxnDetails()

  const [customerName, setCustomerName] = useState<string>(() => "")
  const [customerMobileNumber, setCustomerMobileNumber] = useState<string>(
    () => "",
  )
  const [cashAmount, setCashAmount] = useState<number>(
    () => grandTotalCalculate(
      params?.net_total,
      0,
    ),
  )
  const [finalCashAmount, setFinalCashAmount] = useState<number>(
    () => 0,
  )
  const [discountBillwise, setDiscountBillwise] = useState<number>(() => 0)

  var receiptNumber: number | undefined = undefined
  let kotNumber: number | undefined = undefined

  const [checked, setChecked] = useState<string>(() => "C")
  const [isLoading, setIsLoading] = useState(() => false)
  const [isDisabled, setIsDisabled] = useState(() => false)

  const [customerInfoFlag, setCustomerInfoFlag] = useState<number>(() => 0)

  // let paymentModeOptionsArr = [
  //   { icon: "cash", title: "Cash", func: () => setChecked("C") },
  //   { icon: "credit-card-outline", title: "Card", func: () => setChecked("D") },
  //   { icon: "contactless-payment", title: "UPI", func: () => setChecked("U") },
  //   { icon: "credit-card-clock-outline", title: "Credit", func: () => setChecked("R") },
  // ]

  useEffect(() => {
    // if (receiptSettings?.gst_flag === "Y") {
    //   receiptSettings?.gst_type === "E"
    //     ? setFinalCashAmount(() =>
    //       cashAmount !== undefined
    //         ? cashAmount -
    //         parseFloat(
    //           grandTotalWithGSTCalculate(
    //             params?.net_total,
    //             receiptSettings?.discount_position !== "B"
    //               ? params?.total_discount
    //               : receiptSettings?.discount_type === "A"
    //                 ? discountBillwise
    //                 : (params?.net_total * discountBillwise) / 100,
    //             totalGST,
    //           ),
    //         )
    //         : 0,
    //     )
    //     : setFinalCashAmount(() =>
    //       cashAmount !== undefined
    //         ? cashAmount -
    //         parseFloat(
    //           grandTotalWithGSTInclCalculate(
    //             params?.net_total,
    //             receiptSettings?.discount_position !== "B"
    //               ? params?.total_discount
    //               : receiptSettings?.discount_type === "A"
    //                 ? discountBillwise
    //                 : (params?.net_total * discountBillwise) / 100,
    //           ),
    //         )
    //         : 0,
    //     )
    // } else {
    //   setFinalCashAmount(() =>
    //     cashAmount !== undefined
    //       ? cashAmount -
    //       grandTotalCalculate(
    //         params?.net_total,
    //         receiptSettings?.discount_position !== "B"
    //           ? params?.total_discount
    //           : receiptSettings?.discount_type === "A"
    //             ? discountBillwise
    //             : (params?.net_total * discountBillwise) / 100,
    //       )
    //       : 0,
    //   )
    // }
    setFinalCashAmount(() =>
      cashAmount !== undefined
        ? cashAmount -
        grandTotalCalculate(
          params?.net_total,
          0,
        )
        : 0,
    )
  }, [cashAmount, discountBillwise, isFocused])

  useEffect(() => {
    if (customerMobileNumber.length === 10) {
      handleGetCustomerInfo()
    }
  }, [customerMobileNumber])

  // useEffect(() => {
  //   if (receiptSettings?.rcv_cash_flag === "N") {
  //     setCashAmount(Math.abs(finalCashAmount))

  //     console.log("TTTSSSSSGGGGGDDDDDD", cashAmount)
  //   }
  // }, [isFocused])

  const handleGetCustomerInfo = async () => {
    let fetchCustInfCreds: CustomerInfoCredentials = {
      comp_id: loginStore?.comp_id,
      phone_no: customerMobileNumber,
    }

    await fetchCustomerInfo(fetchCustInfCreds)
      .then(res => {
        setCustomerName(res?.data[0]?.cust_name)
        setCustomerInfoFlag(() => 1)
        if (res?.data?.length === 0) {
          setCustomerName("")
          setCustomerInfoFlag(() => 0)
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

  // const handleDiscountBillwise = (dis: number) => {
  //   setDiscountBillwise(dis)
  // }

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

        discountBillwise || 0
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

          // navigation.dispatch(
          //   CommonActions.navigate({
          //     name: navigationRoutes.categoriesScreen,
          //   }),
          // )
          navigation.dispatch(
            CommonActions.navigate({
              name: navigationRoutes.homeScreen,
            }),
          )

          // if (receiptSettings?.rcpt_type !== "P") {
          //   let sendBillSmsCreds: BillSmsCredentials = {
          //     comp_id: loginStore?.comp_id,
          //     phone: customerMobileNumber,
          //     receipt_no: receiptNumber,
          //   }
          // sendBillSms(sendBillSmsCreds)
          //   .then(res => {
          //     if (res?.suc === 1) {
          //       ToastAndroid.show("SMS Sent to customer.", ToastAndroid.SHORT)
          //     }
          //   })
          //   .catch(err => {
          //     ToastAndroid.show(
          //       "Some error occurred while sending bill sms.",
          //       ToastAndroid.SHORT,
          //     )
          //   })
          // }
        } else {
          Alert.alert("Fail", "Something Went Wrong!")
        }
      })
      .catch(err => {
        Alert.alert("Fail", "Error while sending sale details!!!!!")
        console.log("EEEEEEEEEERRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR", err)
      })
  }

  const handlePrintReceipt = async (printFlag = false) => {
    // pass conditonal grand total after - now just written net_total
    // if (discountBillwise > params?.net_total) {
    //   ToastAndroid.show("Enter valid Bill Discount!", ToastAndroid.SHORT)
    //   return
    // }

    if (receiptSettings?.rcv_cash_flag === "Y") {
      if (
        checked === "C" &&
        (cashAmount === undefined || cashAmount === 0 || finalCashAmount < 0)
      ) {
        ToastAndroid.show("Add valid cash amount.", ToastAndroid.SHORT)
        return
      }
    }

    if (
      checked === "R" &&
      (cashAmount === undefined || finalCashAmount > 0)
    ) {
      ToastAndroid.show("Add valid cash amount.", ToastAndroid.SHORT)
      return
    }

    if (checked === "R" && finalCashAmount === 0) {
      ToastAndroid.show("Changing Payment mode to Cash...", ToastAndroid.SHORT)
      setChecked(() => "C")
      return
    }

    if (checked === "R" && customerMobileNumber.length < 10) {
      ToastAndroid.show("Valid Mobile Number is mandatory for Credit Mode.", ToastAndroid.SHORT)
      return
    }

    if (checked === "R" && customerName.length === 0) {
      ToastAndroid.show("Valid Customer Name is mandatory for Credit Mode.", ToastAndroid.SHORT)
      return
    }

    // if (customerMobileNumber.length === 0) {
    //   ToastAndroid.show("Customer mobile is mandatory.", ToastAndroid.SHORT)
    //   return
    // }

    setIsDisabled(true)
    setIsLoading(true)
    await handleSendSaleData()
    console.log("Sending data and printing receipts...")


    const receiptFunction =
      receiptSettings?.gst_flag === "N" ? printReceiptT : printReceiptT

    if (printFlag) {
      if (receiptSettings?.rcpt_type !== "S") {
        receiptFunction(
          params?.added_products,
          params?.net_total,
          0, // discount
          cashAmount,
          finalCashAmount,
          customerName,
          customerMobileNumber,
          receiptNumber,
          checked,
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
    }



    itemsContextStorage.clearAll()

    setIsLoading(false)
    setIsDisabled(false)
  }

  // const handlePrintReceipt = async (printFlag = false) => {
  //   // pass conditonal grand total after - now just written net_total
  //   if (discountBillwise > params?.net_total) {
  //     ToastAndroid.show("Enter valid Bill Discount!", ToastAndroid.SHORT)
  //     return
  //   }

  //   if (receiptSettings?.rcv_cash_flag === "Y") {
  //     if (
  //       checked === "C" &&
  //       (cashAmount === undefined || cashAmount === 0 || finalCashAmount < 0)
  //     ) {
  //       ToastAndroid.show("Add valid cash amount.", ToastAndroid.SHORT)
  //       return
  //     }
  //   }

  //   if (
  //     checked === "R" &&
  //     (cashAmount === undefined || finalCashAmount > 0)
  //   ) {
  //     ToastAndroid.show("Add valid cash amount.", ToastAndroid.SHORT)
  //     return
  //   }

  //   if (checked === "R" && finalCashAmount === 0) {
  //     ToastAndroid.show("Changing Payment mode to Cash...", ToastAndroid.SHORT)
  //     setChecked(() => "C")
  //     return
  //   }

  //   if (checked === "R" && customerMobileNumber.length < 10) {
  //     ToastAndroid.show("Valid Mobile Number is mandatory for Credit Mode.", ToastAndroid.SHORT)
  //     return
  //   }

  //   // if (customerMobileNumber.length === 0) {
  //   //   ToastAndroid.show("Customer mobile is mandatory.", ToastAndroid.SHORT)
  //   //   return
  //   // }

  //   setIsDisabled(true)
  //   setIsLoading(true)
  //   await handleSendSaleData()
  //   console.log("Sending data and printing receipts...")


  //   const receiptFunction =
  //     receiptSettings?.gst_flag === "N" ? printReceiptWithoutGst : printReceipt

  //   if (printFlag) {
  //     if (receiptSettings?.rcpt_type !== "S") {
  //       receiptFunction(
  //         params?.added_products,
  //         params?.net_total,
  //         //@ts-ignore
  //         // parseFloat(params?.total_discount),
  //         receiptSettings?.discount_position !== "B"
  //           //@ts-ignore
  //           ? parseFloat(params?.total_discount)
  //           : receiptSettings?.discount_type === "A"
  //             //@ts-ignore
  //             ? parseFloat(discountBillwise)
  //             //@ts-ignore
  //             : parseFloat((params?.net_total * discountBillwise) / 100),
  //         cashAmount,
  //         finalCashAmount,
  //         customerName,
  //         customerMobileNumber,
  //         receiptNumber,
  //         checked,
  //         kotNumber,
  //         params?.table_no
  //       )

  //       console.log(
  //         "=================+++++++++++++++++++ params?.added_products",
  //         params?.added_products,
  //       )
  //       console.log(
  //         "=================+++++++++++++++++++ params?.net_total",
  //         params?.net_total,
  //       )
  //       console.log(
  //         "=================+++++++++++++++++++ parseFloat(params?.total_discount)",
  //         //@ts-ignore
  //         parseFloat(params?.total_discount),
  //       )
  //       console.log("=================+++++++++++++++++++ cashAmount", cashAmount)
  //       console.log(
  //         "=================+++++++++++++++++++ finalCashAmount",
  //         finalCashAmount,
  //       )
  //       console.log(
  //         "=================+++++++++++++++++++ customerName",
  //         customerName,
  //       )
  //       console.log(
  //         "=================+++++++++++++++++++ customerMobileNumber",
  //         customerMobileNumber,
  //       )
  //       console.log(
  //         "=================+++++++++++++++++++ receiptNumber",
  //         receiptNumber,
  //       )
  //       console.log("=================+++++++++++++++++++ checked", checked)
  //     }
  //   }



  //   itemsContextStorage.clearAll()

  //   setIsLoading(false)
  //   setIsDisabled(false)
  // }

  // const handlePrintReceipt = async (flag?: boolean) => {
  //   console.log(flag)
  //   printReceiptT(
  //     params?.added_products,
  //     params?.net_total,
  //     //@ts-ignore
  //     // parseFloat(params?.total_discount),
  //     receiptSettings?.discount_position !== "B"
  //       //@ts-ignore
  //       ? parseFloat(params?.total_discount)
  //       : receiptSettings?.discount_type === "A"
  //         //@ts-ignore
  //         ? parseFloat(discountBillwise)
  //         //@ts-ignore
  //         : parseFloat((params?.net_total * discountBillwise) / 100),
  //     cashAmount,
  //     finalCashAmount,
  //     customerName,
  //     customerMobileNumber,
  //     receiptNumber,
  //     checked,
  //     kotNumber,
  //     params?.table_no
  //   )
  // }




  //////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////

  // useEffect(() => {
  //   init()
  // }, [])

  var tnxResponse

  const handleRazorpayClient = async () => {
    let json = {
      username: "9903044748",
      amount: +cashAmount,
      externalRefNumber: "",
    }

    let jsonUPI = {
      username: "9903044748",
      amount: params?.net_total,
      externalRefNumber: "",
    }

    // Convert json object to string
    let jsonString = JSON.stringify(checked !== "U" ? json : jsonUPI)

    // await RNEzetapSdk.initialize(jsonString)
    //   .then(res => {
    //     console.log(">>>>>>>>>>>>>>>>>", res)
    //   })
    //   .catch(err => {
    //     console.log("<<<<<<<<<<<<<<<<<", err)
    //   })

    // var res = await RNEzetapSdk.prepareDevice()
    // console.log("RAZORPAY===PREPARE DEVICE", res)

    await RNEzetapSdk.pay(jsonString)
      .then(res => {
        console.log(">>>>>>>>>>>>>>>>>", res)

        // if (res?.status == "success") {
        //   handleSave()
        //   Alert.alert("Txn ID", res?.txnId)
        // } else {
        //   Alert.alert("Error in Tnx", res?.error)
        // }
        tnxResponse = res
        // setTnxResponse(res)
      })
      .catch(err => {
        console.log("<<<<<<<<<<<<<<<<<", err)
      })
  }

  const initializePaymentRequest = async () => {
    // var withAppKey =
    //   '{"userName":' +
    //   "9903044748" +
    //   ',"demoAppKey":"a40c761a-b664-4bc6-ab5a-bf073aa797d5","prodAppKey":"a40c761a-b664-4bc6-ab5a-bf073aa797d5","merchantName":"SYNERGIC_SOFTEK_SOLUTIONS","appMode":"DEMO","currencyCode":"INR","captureSignature":false,"prepareDevice":false}'
    // var response = await RNEzetapSdk.initialize(withAppKey)
    // console.log(response)
    // var jsonData = JSON.parse(response)

    let razorpayInitializationJson = JSON.parse(
      ezetapStorage.getString("ezetap-initialization-json"),
    )

    console.log("MMMMMMSSSSSSSSSSSS", razorpayInitializationJson)

    if (razorpayInitializationJson.status == "success") {
      await handleRazorpayClient()
        .then(async res => {
          console.log("###################", res)
          // var res = await RNEzetapSdk.close()
          // console.log("CLOSEEEEE TNXXXXX", res)
          // var json = JSON.parse(res)
        })
        .catch(err => {
          console.log("==================", err)
        })
    } else {
      console.log("XXXXXXXXXXXXXXXXXXX ELSE PART")
    }
  }

  const handleSaveBillRazorpay = async (flag?: boolean) => {
    await initializePaymentRequest()
      .then(async () => {
        console.log(
          "TRANSACTION RES DATA================",
          tnxResponse,
        )
        if (JSON.parse(tnxResponse)?.status === "success") {

          await handlePrintReceipt(flag)

          const creds: TxnDetailsCreds = {
            receipt_no: receiptNumber?.toString(),
            pay_txn_id: JSON.parse(tnxResponse)?.result?.txn?.txnId,
            pay_amount: +JSON.parse(tnxResponse)?.result?.txn?.amount,
            pay_amount_original: +JSON.parse(tnxResponse)?.result?.txn?.amountOriginal,
            currency_code: JSON.parse(tnxResponse)?.result?.txn?.currencyCode,
            payment_mode: JSON.parse(tnxResponse)?.result?.txn?.paymentMode,
            pay_status: JSON.parse(tnxResponse)?.result?.txn?.status,
            receipt_url: JSON.parse(tnxResponse)?.result?.receipt?.receiptUrl,
            created_by: loginStore?.user_id
          }

          console.log("::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::", creds)

          await sendTxnDetails(creds).then(res => {
            console.log("Txn details sent done.", res)
          }).catch(err => {
            console.log("Txn send failed.", err)
          })

        } else {
          console.log("tnxResponse value error...")
        }
      })
      .catch(err => {
        console.error("TNX Response Error!", err)

        console.log(
          "PPPPPPPPPPPPKKKKKKKKKKKKK",
          ezetapStorage.contains("ezetap-initialization-json"),
          ezetapStorage.getString("ezetap-initialization-json"),
        )
      })
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
              {/* {receiptSettings?.cust_inf === "Y"
                ? "Customer Details & Print"
                : "Print"} */}
              Payment & Print
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
              buttonColor={theme.colors.tertiaryContainer}
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
              textColor={theme.colors.onTertiaryContainer}>
              SEARCH PRODUCTS
            </ButtonPaper>
          </View> */}

          <View style={{
            backgroundColor: theme.colors.surfaceVariant,
            borderRadius: 35,
            width: SCREEN_WIDTH / 1.15,
            alignSelf: "center",
            marginTop: normalize(2),
            padding: 10,
            // height: "auto",
            // paddingVertical: normalize(15),
            justifyContent: "center",
            alignItems: "center"
          }}>
            {/* {receiptSettings?.discount_flag === "Y" && receiptSettings?.discount_position === "B" && (
              <View
                style={{
                  paddingHorizontal: SCREEN_WIDTH / 20,
                }}>
                <InputPaper
                  selectTextOnFocus
                  label={
                    receiptSettings?.discount_type === "A"
                      ? "Discount (₹)"
                      : "Discount (%)"
                  }
                  onChangeText={handleDiscountBillwise}
                  value={discountBillwise}
                  keyboardType="numeric"
                  mode="flat"
                />
              </View>
            )} */}
            <NetTotalButton
              width={290}
              disabled
              backgroundColor={theme.colors.onSurfaceVariant}
              textColor={theme.colors.surfaceVariant}
              addedProductsList={params?.added_products}
              netTotal={params?.net_total}
              // totalDiscount={
              //   receiptSettings?.discount_position !== "B"
              //     ? params?.total_discount
              //     : receiptSettings?.discount_type === "A"
              //       ? discountBillwise
              //       : (params?.net_total * discountBillwise) / 100
              // }
              totalDiscount={0}
            />
          </View>

          <View
            style={{
              backgroundColor: theme.colors.surfaceVariant,
              borderRadius: 40,
              width: SCREEN_WIDTH / 1.15,
              alignSelf: "center",
              marginTop: normalize(10),
              marginBottom: normalize(10),
            }}>
            <View style={{ justifyContent: "center" }}>
              <View
                style={{
                  paddingHorizontal: normalize(20),
                  paddingVertical: normalize(5),
                  marginVertical: SCREEN_HEIGHT / 100,
                  gap: 2
                }}>
                {checked === "R" && <InputPaper
                  label="Enter Mobile"
                  value={customerMobileNumber}
                  onChangeText={onChangeCustomerMobileNumber}
                  keyboardType="number-pad"
                  leftIcon="card-account-phone-outline"
                  maxLength={10}
                />}
                {checked === "R" && <InputPaper
                  selectTextOnFocus
                  label="Enter Name"
                  value={customerName}
                  onChangeText={(customerName: string) =>
                    setCustomerName(customerName)
                  }
                  keyboardType="default"
                  leftIcon="account-circle-outline"
                  maxLength={18}
                  customStyle={{ marginBottom: normalize(2) }}
                />}
                {/* {receiptSettings?.cust_inf === "Y" && (
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
                    customStyle={{ marginBottom: normalize(2) }}
                  />
                )} */}
              </View>
            </View>

            {receiptSettings?.pay_mode === "Y" && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  // marginRight: normalize(18),
                  // marginLeft: normalize(4),
                  marginVertical: normalize(5),
                  marginHorizontal: normalize(25),
                  flexWrap: "wrap"
                }}>
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
                    Cash
                  </Text>
                </View>
                {/* <View style={styles.eachRadioBtn}>
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
                </View> */}

                <View style={styles.eachRadioBtn}>
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
                </View>

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
                    Credit
                  </Text>
                </View>

                {/* <List.Item
                  style={{ width: "100%" }}
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
                    return <MenuPaperWithoutRestriction menuArrOfObjects={paymentModeOptionsArr} customStyle={{ backgroundColor: theme.colors.surface }} textColor={theme.colors.onSurface} />
                  }}
                  descriptionStyle={{
                    color: theme.colors.purple,
                  }}
                /> */}
              </View>
            )}

            <View style={{ paddingVertical: normalize(10) }}></View>

            {checked === "C" && (
              <View>
                <View style={{ paddingHorizontal: normalize(20), paddingBottom: normalize(12) }}>
                  <InputPaper
                    selectTextOnFocus
                    label="Received"
                    value={
                      // receiptSettings?.rcv_cash_flag === "N"
                      //   ? Math.abs(finalCashAmount)
                      //   : cashAmount
                      cashAmount
                    }
                    onChangeText={(cash: number) => setCashAmount(cash)}
                    keyboardType="number-pad"
                    leftIcon="cash-multiple"
                    maxLength={8}
                    customStyle={{ marginBottom: normalize(10) }}
                    disabled={receiptSettings?.rcv_cash_flag === "N"}
                  />
                </View>
                {
                  receiptSettings?.rcv_cash_flag === "Y" &&
                  <SquircleBox
                    backgroundColor={theme.colors.surface}
                    textColor={theme.colors.onSurface}
                    height={SCREEN_HEIGHT / 15}>
                    RETURNED AMOUNT: ₹{finalCashAmount}
                  </SquircleBox>
                }
              </View>
            )}

            {checked === "R" && (
              <View>
                <View style={{ paddingHorizontal: normalize(20), paddingBottom: normalize(12) }}>
                  <InputPaper
                    selectTextOnFocus
                    label="Received Amount"
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
                  height={SCREEN_HEIGHT / 15}>
                  DUE AMOUNT: ₹{Math.abs(finalCashAmount)}
                </SquircleBox>
              </View>
            )}

            {/* {
              checked === "U" && upiData !== undefined && (
                <View>
                  <View style={{ paddingHorizontal: normalize(20), paddingBottom: normalize(12), alignSelf: "center" }}>
                    {
                      receiptSettings?.gst_flag === "Y"
                        ? <QRCode
                          size={150}
                          value={`${upiData}&am=${receiptSettings?.gst_type === "E"
                            ? grandTotalWithGSTCalculate(
                              params?.net_total,
                              receiptSettings?.discount_position !== "B"
                                ? params?.total_discount
                                : receiptSettings?.discount_type === "A"
                                  ? discountBillwise
                                  : (params?.net_total * discountBillwise) / 100,
                              totalGST,
                            )
                            : grandTotalWithGSTInclCalculate(
                              params?.net_total,
                              receiptSettings?.discount_position !== "B"
                                ? params?.total_discount
                                : receiptSettings?.discount_type === "A"
                                  ? discountBillwise
                                  : (params?.net_total * discountBillwise) / 100,
                            )
                            }`}
                          color={theme.colors.onBackground}
                          backgroundColor={theme.colors.surfaceVariant}
                        />
                        : <QRCode
                          size={150}
                          value={`${upiData}&am=${grandTotalCalculate(
                            params?.net_total,
                            receiptSettings?.discount_position !== "B"
                              ? params?.total_discount
                              : receiptSettings?.discount_type === "A"
                                ? discountBillwise
                                : (params?.net_total * discountBillwise) / 100,
                          )}`}
                          color={theme.colors.onBackground}
                          backgroundColor={theme.colors.surfaceVariant}
                        />
                    }

                  </View>
                </View>
              )
            } */}

            <View style={{ padding: normalize(20), flexDirection: "row", gap: 10, alignSelf: "center" }}>
              {checked !== "U" ? <ButtonPaper
                mode="contained"
                buttonColor={theme.colors.primary}
                textColor={theme.colors.onPrimary}
                onPress={() => handlePrintReceipt(true)}
                icon="cloud-print-outline"
                loading={isLoading}
                disabled={isDisabled}>
                SAVE / PRINT
              </ButtonPaper>
                : <ButtonPaper
                  mode="contained"
                  buttonColor={theme.colors.primary}
                  textColor={theme.colors.onPrimary}
                  onPress={() => handleSaveBillRazorpay(true)}
                  icon="cloud-print-outline"
                  loading={isLoading}
                  disabled={isDisabled}>
                  SAVE / PRINT
                </ButtonPaper>}
              {/* {checked !== "U" ? <ButtonPaper
                mode="contained"
                buttonColor={theme.colors.purple}
                textColor={theme.colors.onPurple}
                onPress={() => handlePrintReceipt()}
                icon="content-save-outline"
                loading={isLoading}
                disabled={isDisabled}>
                SAVE
              </ButtonPaper>
                : <ButtonPaper
                  mode="contained"
                  buttonColor={theme.colors.purple}
                  textColor={theme.colors.onPurple}
                  onPress={() => handleSaveBillRazorpay()}
                  icon="content-save-outline"
                  loading={isLoading}
                  disabled={isDisabled}>
                  SAVE
                </ButtonPaper>} */}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default CustomerDetailsFillScreen

const styles = StyleSheet.create({
  eachRadioBtn: {
    justifyContent: "center",
    alignItems: "center"
  }
})
