// import { BluetoothEscposPrinter } from "react-native-bluetooth-escpos-printer"
class BluetoothEscposPrinter { }
import { fileStorage, loginStorage } from "../../storage/appStorage"
import { useContext } from "react"
import { AppStore } from "../../context/AppContext"
import {
  CalculatorShowBillData,
  CancelledBillsReportData,
  CancelledBillsReportResponse,
  CollectionReport,
  CreditReportResponseData,
  CustomerLedgerData,
  DaybookReportData,
  DueReportData,
  GstStatement,
  GstSummary,
  ItemReportData,
  ItemsData,
  ProductwiseSaleReportData,
  RecoveryAmountResponseData,
  RecoveryReportData,
  RefundReportData,
  SaleReport,
  SaleReportCalculateModeData,
  ShowBillData,
  StockReportResponse,
  UserwiseReportData,
} from "../../models/api_types"
import { gstFilterationAndTotals } from "../../utils/gstFilterTotal"
import { gstFilterationAndTotalForRePrint } from "../../utils/gstFilterTotalForRePrint"
import useCalculations from "../useCalculations"
import usePrintCalculations from "../usePrintCalculations"
import { AppStoreContext, Bill } from "../../models/custom_types"

import ThermalPrinterModule from 'react-native-thermal-printer';

export const useBluetoothPrint = () => {
  const { receiptSettings } = useContext<AppStoreContext>(AppStore)
  const {
    netTotalWithGSTCalculate,
    roundingOffWithGSTCalculate,
    grandTotalWithGSTCalculate,
    roundingOffCalculate,
    grandTotalCalculate,
    netTotalCalculate,

    totalAmountWithGSTInclCalculate,
    netTotalWithGSTInclCalculate,
    roundingOffWithGSTInclCalculate,
    grandTotalWithGSTInclCalculate,
  } = useCalculations()

  const {
    calculatePercentDiscountPerProduct,
    calculateAmountAfterPercentDiscountPerProduct,
    calculateAmountDiscountPerProduct,
    calculateAmountAfterAmountDiscountPerProduct,
  } = usePrintCalculations()

  // async function printReceipt(
  //   addedProducts: ItemsData[],
  //   netTotal: number,
  //   totalDiscountAmount: number,
  //   cashAmount?: number,
  //   returnedAmt?: number,
  //   customerName?: string,
  //   customerPhone?: string,
  //   rcptNo?: number,
  //   paymentMode?: string,
  //   kotNo?: number,
  //   tableNo?: number,
  // ) {
  //   const loginStore = JSON.parse(loginStorage.getString("login-data"))
  //   const fileStore = fileStorage.getString("file-data")
  //   const upiStore = fileStorage.getString("upi-blob")
  //   const upiData = fileStorage.getString("upi-data")

  //   const shopName: string = loginStore?.company_name?.toString()
  //   const address: string = loginStore?.address?.toString()
  //   const location: string = loginStore?.branch_name?.toString()
  //   const shopMobile: string = loginStore?.phone_no?.toString()
  //   const shopEmail: string = loginStore?.email_id?.toString()
  //   const cashier: string = loginStore?.user_name?.toString()

  //   // let { totalCGST_5, totalCGST_12, totalCGST_18, totalCGST_28, totalSGST_5, totalSGST_12, totalSGST_18, totalSGST_28, totalGST } = gstFilterationAndTotals(addedProducts)

  //   let gstTotals = gstFilterationAndTotals(
  //     addedProducts,
  //     receiptSettings?.gst_type,
  //   )
  //   let { totalGST } = gstTotals // Destructure totalGST for separate handling

  //   // Filter keys for CGST and SGST display
  //   const gstKeys = Object.keys(gstTotals).filter(
  //     key => key.includes("totalCGST") || key.includes("totalSGST"),
  //   )

  //   let totalQuantities: number = 0
  //   let totalAmountAfterDiscount: number = 0

  //   try {
  //     let columnWidths = [11, 1, 18]
  //     let columnWidthsHeader = [8, 1, 21]
  //     let columnWidthsProductsHeaderAndBody = [8, 4, 6, 5, 7]
  //     let columnWidthsProductsHeaderAndBodyWithoutDiscount = [8, 6, 7, 8]
  //     // let columnWidthsProductsHeaderAndBody = [18, 3, 4, 3, 4]
  //     let columnWidthsItemTotal = [18, 12]
  //     let columnWidthIfNameIsBig = [32]
  //     let columnWidthForKot = [10, 22]

  //     // let newColumnWidths: number[] = [9, 9, 6, 7]







  //     if (receiptSettings?.kot_flag === "Y") {
  //       if (tableNo) {
  //         await BluetoothEscposPrinter.printText(shopName.toUpperCase(), {
  //           align: "center",
  //           widthtimes: 1.2,
  //           heigthtimes: 2,
  //         })

  //         await BluetoothEscposPrinter.printText("\n", {})
  //         await BluetoothEscposPrinter.printText("-------------------------", {})
  //         await BluetoothEscposPrinter.printText("\n", {})

  //         await BluetoothEscposPrinter.printColumn(
  //           columnWidthForKot,
  //           [
  //             BluetoothEscposPrinter.ALIGN.LEFT,
  //             BluetoothEscposPrinter.ALIGN.RIGHT,
  //           ],
  //           ["KOT NO.", `${kotNo}`],
  //           {},
  //         )

  //         await BluetoothEscposPrinter.printColumn(
  //           columnWidthForKot,
  //           [
  //             BluetoothEscposPrinter.ALIGN.LEFT,
  //             BluetoothEscposPrinter.ALIGN.RIGHT,
  //           ],
  //           ["TABLE NO.", `${tableNo}`],
  //           {},
  //         )

  //         await BluetoothEscposPrinter.printColumn(
  //           columnWidthForKot,
  //           [
  //             BluetoothEscposPrinter.ALIGN.LEFT,
  //             BluetoothEscposPrinter.ALIGN.RIGHT,
  //           ],
  //           ["DT.", `${new Date().toLocaleString("en-GB")}`],
  //           {},
  //         )

  //         // await BluetoothEscposPrinter.printText("\n", {})
  //         await BluetoothEscposPrinter.printText("-------------------------", {})
  //         await BluetoothEscposPrinter.printText("\n", {})

  //         await BluetoothEscposPrinter.printColumn(
  //           columnWidthForKot,
  //           [
  //             BluetoothEscposPrinter.ALIGN.LEFT,
  //             BluetoothEscposPrinter.ALIGN.RIGHT,
  //           ],
  //           ["ITEM", `QTY`],
  //           {},
  //         )

  //         for (const item of addedProducts) {
  //           if (item?.item_name?.length > 10) {
  //             await BluetoothEscposPrinter.printColumn(
  //               columnWidthIfNameIsBig,
  //               [
  //                 BluetoothEscposPrinter.ALIGN.LEFT,
  //               ],
  //               [`${item?.item_name}`],
  //               {},
  //             )
  //             await BluetoothEscposPrinter.printColumn(
  //               columnWidthIfNameIsBig,
  //               [
  //                 BluetoothEscposPrinter.ALIGN.RIGHT,
  //               ],
  //               [`${item?.quantity}`],
  //               {},
  //             )
  //             // await BluetoothEscposPrinter.printText("\n", {})
  //             // await BluetoothEscposPrinter.printText(`${item.quantity}`, { align: "right" })
  //           } else {
  //             await BluetoothEscposPrinter.printColumn(
  //               columnWidthForKot,
  //               [
  //                 BluetoothEscposPrinter.ALIGN.LEFT,
  //                 BluetoothEscposPrinter.ALIGN.RIGHT,
  //               ],
  //               [`${item?.item_name}`, `${item?.quantity}`],
  //               {},
  //             )
  //           }
  //         }

  //         await BluetoothEscposPrinter.printText("\n", {})
  //         await BluetoothEscposPrinter.printText("-------------------------", {})
  //         await BluetoothEscposPrinter.printText("\n\n\n", {})
  //       }
  //     }








  //     if (fileStore?.length > 0) {
  //       await BluetoothEscposPrinter.printerAlign(
  //         BluetoothEscposPrinter.ALIGN.CENTER,
  //       )
  //       const options = {
  //         width: 250, // Assuming 58mm paper width with 8 dots/mm resolution (58mm * 8dots/mm = 384 dots)
  //         left: 50, // No left padding
  //         // align: "CENTER"
  //       }

  //       // Print the image
  //       await BluetoothEscposPrinter.printPic(fileStore, options)
  //     }

  //     await BluetoothEscposPrinter.printerAlign(
  //       BluetoothEscposPrinter.ALIGN.CENTER,
  //     )
  //     await BluetoothEscposPrinter.printText(shopName.toUpperCase(), {
  //       align: "center",
  //       widthtimes: 1.2,
  //       heigthtimes: 2,
  //     })
  //     await BluetoothEscposPrinter.printText("\n", {})
  //     // await BluetoothEscposPrinter.printText("hasifughaf", { align: "center" })

  //     if (receiptSettings?.on_off_flag1 === "Y") {
  //       await BluetoothEscposPrinter.printText(receiptSettings?.header1, {})
  //       await BluetoothEscposPrinter.printText("\n", {})
  //     }

  //     if (receiptSettings?.on_off_flag2 === "Y") {
  //       await BluetoothEscposPrinter.printText(receiptSettings?.header2, {})
  //     }
  //     await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printText("RECEIPT", {
  //       align: "center",
  //     })

  //     await BluetoothEscposPrinter.printText("\n", {})

  //     // await BluetoothEscposPrinter.printText("------------------------", {
  //     //   align: "center",
  //     // })

  //     // await BluetoothEscposPrinter.printText("\n", {})
  //     // await BluetoothEscposPrinter.printText(address, {
  //     //   align: "center",
  //     // })
  //     // await BluetoothEscposPrinter.printText("\n", {})
  //     // await BluetoothEscposPrinter.printText(location, {
  //     //   align: "center",
  //     // })
  //     // await BluetoothEscposPrinter.printText("\n", {})
  //     // await BluetoothEscposPrinter.printText("------------------------", {
  //     //   align: "center",
  //     // })
  //     // await BluetoothEscposPrinter.printText("\n", {})

  //     // // await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT)

  //     // await BluetoothEscposPrinter.printColumn(
  //     //   columnWidthsHeader,
  //     //   [
  //     //     BluetoothEscposPrinter.ALIGN.LEFT,
  //     //     BluetoothEscposPrinter.ALIGN.CENTER,
  //     //     BluetoothEscposPrinter.ALIGN.RIGHT,
  //     //   ],
  //     //   ["MOBILE", ":", shopMobile],
  //     //   {},
  //     // )
  //     // await BluetoothEscposPrinter.printColumn(
  //     //   columnWidthsHeader,
  //     //   [
  //     //     BluetoothEscposPrinter.ALIGN.LEFT,
  //     //     BluetoothEscposPrinter.ALIGN.CENTER,
  //     //     BluetoothEscposPrinter.ALIGN.RIGHT,
  //     //   ],
  //     //   ["EMAIL", ":", shopEmail],
  //     //   {},
  //     // )
  //     // await BluetoothEscposPrinter.printColumn(
  //     //     columnWidthsHeader,
  //     //     [
  //     //         BluetoothEscposPrinter.ALIGN.LEFT,
  //     //         BluetoothEscposPrinter.ALIGN.CENTER,
  //     //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //     //     ],
  //     //     ["SITE", ":", "SHOPNAME.COM"],
  //     //     {},
  //     // )

  //     await BluetoothEscposPrinter.printText("------------------------", {
  //       align: "center",
  //     })
  //     await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printColumn(
  //       columnWidthsHeader,
  //       [
  //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         BluetoothEscposPrinter.ALIGN.CENTER,
  //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //       ],
  //       ["RCPT.NO", ":", rcptNo?.toString()],
  //       {},
  //     )
  //     await BluetoothEscposPrinter.printColumn(
  //       columnWidthsHeader,
  //       [
  //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         BluetoothEscposPrinter.ALIGN.CENTER,
  //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //       ],
  //       ["DATE", ":", `${new Date().toLocaleString("en-GB")}`],
  //       {},
  //     )
  //     await BluetoothEscposPrinter.printColumn(
  //       columnWidthsHeader,
  //       [
  //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         BluetoothEscposPrinter.ALIGN.CENTER,
  //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //       ],
  //       ["CASHIER", ":", cashier],
  //       {},
  //     )

  //     await BluetoothEscposPrinter.printText("------------------------", {
  //       align: "center",
  //     })
  //     await BluetoothEscposPrinter.printText("\n", {})

  //     if (customerName.length !== 0 || customerPhone.length !== 0) {
  //       receiptSettings?.cust_inf === "Y" &&
  //         (await BluetoothEscposPrinter.printColumn(
  //           columnWidthsHeader,
  //           [
  //             BluetoothEscposPrinter.ALIGN.LEFT,
  //             BluetoothEscposPrinter.ALIGN.CENTER,
  //             BluetoothEscposPrinter.ALIGN.RIGHT,
  //           ],
  //           ["NAME", ":", customerName],
  //           {},
  //         ))
  //       await BluetoothEscposPrinter.printColumn(
  //         columnWidthsHeader,
  //         [
  //           BluetoothEscposPrinter.ALIGN.LEFT,
  //           BluetoothEscposPrinter.ALIGN.CENTER,
  //           BluetoothEscposPrinter.ALIGN.RIGHT,
  //         ],
  //         ["PHONE", ":", customerPhone],
  //         {},
  //       )
  //       await BluetoothEscposPrinter.printText("------------------------", {
  //         align: "center",
  //       })
  //       await BluetoothEscposPrinter.printText("\n", {})
  //     }



  //     await BluetoothEscposPrinter.printerAlign(
  //       BluetoothEscposPrinter.ALIGN.CENTER,
  //     )

  //     receiptSettings?.discount_flag === "Y" &&
  //       receiptSettings?.discount_position !== "B"
  //       ? await BluetoothEscposPrinter.printColumn(
  //         columnWidthsProductsHeaderAndBody,
  //         [
  //           BluetoothEscposPrinter.ALIGN.LEFT,
  //           BluetoothEscposPrinter.ALIGN.LEFT,
  //           BluetoothEscposPrinter.ALIGN.CENTER,
  //           BluetoothEscposPrinter.ALIGN.RIGHT,
  //           BluetoothEscposPrinter.ALIGN.RIGHT,
  //         ],
  //         ["ITEM", "QTY", "PRICE", "DIS.", "AMT"],
  //         {},
  //       )
  //       : await BluetoothEscposPrinter.printColumn(
  //         columnWidthsProductsHeaderAndBodyWithoutDiscount,
  //         [
  //           BluetoothEscposPrinter.ALIGN.LEFT,
  //           BluetoothEscposPrinter.ALIGN.LEFT,
  //           BluetoothEscposPrinter.ALIGN.RIGHT,
  //           BluetoothEscposPrinter.ALIGN.RIGHT,
  //         ],
  //         ["ITEM", "QTY", "PRICE", "AMT"],
  //         {},
  //       )

  //     await BluetoothEscposPrinter.printText("------------------------", {
  //       align: "center",
  //     })

  //     await BluetoothEscposPrinter.printText("\n", {})

  //     for (const item of addedProducts) {
  //       //@ts-ignore
  //       totalQuantities += parseInt(item?.quantity)
  //       // receiptSettings?.discount_type === "P" && receiptSettings?.discount_position !== "B"
  //       //     ? totalAmountAfterDiscount += ((item?.price * item?.quantity) - ((item?.price * item?.quantity * item?.discount) / 100))
  //       //     : totalAmountAfterDiscount += ((item?.price * item?.quantity) - (item?.quantity * item?.discount))

  //       if (item?.item_name?.length >= 8) {
  //         await BluetoothEscposPrinter.printColumn(
  //           columnWidthIfNameIsBig,
  //           [BluetoothEscposPrinter.ALIGN.LEFT],
  //           [item?.item_name],
  //           {},
  //         )

  //         receiptSettings?.discount_flag === "Y" &&
  //           receiptSettings?.discount_position !== "B"
  //           ? receiptSettings?.discount_type === "P"
  //             ? await BluetoothEscposPrinter.printColumn(
  //               columnWidthsProductsHeaderAndBody,
  //               [
  //                 BluetoothEscposPrinter.ALIGN.LEFT,
  //                 BluetoothEscposPrinter.ALIGN.LEFT,
  //                 BluetoothEscposPrinter.ALIGN.CENTER,
  //                 BluetoothEscposPrinter.ALIGN.RIGHT,
  //                 BluetoothEscposPrinter.ALIGN.RIGHT,
  //               ],
  //               //@ts-ignore
  //               [
  //                 "",
  //                 item?.quantity.toString(),
  //                 item?.price.toString(),
  //                 calculatePercentDiscountPerProduct(
  //                   item?.price,
  //                   item?.quantity,
  //                   item?.discount,
  //                 ),
  //                 calculateAmountAfterPercentDiscountPerProduct(
  //                   item?.price,
  //                   item?.quantity,
  //                   item?.discount,
  //                 ),
  //               ],
  //               // ["", item?.quantity.toString(), item?.price.toString(), parseFloat((parseFloat(item?.price) * parseFloat(item?.quantity) * parseFloat(item?.discount)) / 100).toFixed(1), `${parseFloat((parseFloat(item?.price) * parseFloat(item?.quantity)) - ((parseFloat(item?.price) * parseFloat(item?.quantity) * parseFloat(item?.discount)) / 100)).toFixed(1)}`],
  //               {},
  //             )
  //             : await BluetoothEscposPrinter.printColumn(
  //               columnWidthsProductsHeaderAndBody,
  //               [
  //                 BluetoothEscposPrinter.ALIGN.LEFT,
  //                 BluetoothEscposPrinter.ALIGN.LEFT,
  //                 BluetoothEscposPrinter.ALIGN.CENTER,
  //                 BluetoothEscposPrinter.ALIGN.RIGHT,
  //                 BluetoothEscposPrinter.ALIGN.RIGHT,
  //               ],
  //               //@ts-ignore
  //               [
  //                 "",
  //                 item?.quantity.toString(),
  //                 item?.price.toString(),
  //                 calculateAmountDiscountPerProduct(
  //                   item?.quantity,
  //                   item?.discount,
  //                 ),
  //                 calculateAmountAfterAmountDiscountPerProduct(
  //                   item?.price,
  //                   item?.quantity,
  //                   item?.discount,
  //                 ),
  //               ],
  //               // ["", item?.quantity.toString(), item?.price.toString(), parseFloat(item?.discount).toFixed(1), `${parseFloat((parseFloat(item?.price) * parseFloat(item?.quantity)) - (parseFloat(item?.quantity) * parseFloat(item?.discount))).toFixed(1)}`],
  //               {},
  //             )
  //           : await BluetoothEscposPrinter.printColumn(
  //             columnWidthsProductsHeaderAndBodyWithoutDiscount,
  //             [
  //               BluetoothEscposPrinter.ALIGN.LEFT,
  //               BluetoothEscposPrinter.ALIGN.LEFT,
  //               BluetoothEscposPrinter.ALIGN.RIGHT,
  //               BluetoothEscposPrinter.ALIGN.RIGHT,
  //             ],
  //             //@ts-ignore
  //             [
  //               "",
  //               item?.quantity.toString(),
  //               item?.price.toString(),
  //               calculateAmountAfterAmountDiscountPerProduct(
  //                 item?.price,
  //                 item?.quantity,
  //                 0,
  //               ),
  //             ],
  //             // : await BluetoothEscposPrinter.printColumn(
  //             //     columnWidthsProductsHeaderAndBody,
  //             //     [
  //             //         BluetoothEscposPrinter.ALIGN.LEFT,
  //             //         BluetoothEscposPrinter.ALIGN.LEFT,
  //             //         BluetoothEscposPrinter.ALIGN.CENTER,
  //             //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //             //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //             //     ],
  //             //     //@ts-ignore
  //             //     ["", item?.quantity.toString(), item?.price.toString(), calculateAmountDiscountPerProduct(item?.quantity, 0), calculateAmountAfterAmountDiscountPerProduct(item?.price, item?.quantity, 0)],
  //             // ["", item?.quantity.toString(), item?.price.toString(), parseFloat(item?.discount).toFixed(1), `${parseFloat((parseFloat(item?.price) * parseFloat(item?.quantity)) - (parseFloat(item?.quantity) * parseFloat(item?.discount))).toFixed(1)}`],
  //             {},
  //           )

  //         console.log("#####################################", item)
  //         console.log(
  //           "############++++++++++++++++++#######",
  //           (item?.price * item?.quantity - item?.discount).toFixed(2),
  //         )

  //         // await BluetoothEscposPrinter.printColumn(
  //         //     columnWidthsProductsHeaderAndBody,
  //         //     [
  //         //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         //         BluetoothEscposPrinter.ALIGN.CENTER,
  //         //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //         //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //         //     ],
  //         //     ["", item?.quantity.toString(), item?.price.toString(), (((item?.price * item?.quantity * item?.discount) / 100).toFixed(2)).toString(), `${((item?.price * item?.quantity) - ((item?.price * item?.quantity * item?.discount) / 100)).toFixed(2).toString()}`],
  //         //     {},
  //         // )
  //       } else {
  //         receiptSettings?.discount_flag === "Y"
  //           ? receiptSettings?.discount_type === "P"
  //             ? await BluetoothEscposPrinter.printColumn(
  //               columnWidthsProductsHeaderAndBody,
  //               [
  //                 BluetoothEscposPrinter.ALIGN.LEFT,
  //                 BluetoothEscposPrinter.ALIGN.LEFT,
  //                 BluetoothEscposPrinter.ALIGN.CENTER,
  //                 BluetoothEscposPrinter.ALIGN.RIGHT,
  //                 BluetoothEscposPrinter.ALIGN.RIGHT,
  //               ],
  //               //@ts-ignore
  //               [
  //                 item?.item_name,
  //                 item?.quantity.toString(),
  //                 item?.price.toString(),
  //                 calculatePercentDiscountPerProduct(
  //                   item?.price,
  //                   item?.quantity,
  //                   item?.discount,
  //                 ),
  //                 calculateAmountAfterPercentDiscountPerProduct(
  //                   item?.price,
  //                   item?.quantity,
  //                   item?.discount,
  //                 ),
  //               ],
  //               {},
  //             )
  //             : await BluetoothEscposPrinter.printColumn(
  //               columnWidthsProductsHeaderAndBody,
  //               [
  //                 BluetoothEscposPrinter.ALIGN.LEFT,
  //                 BluetoothEscposPrinter.ALIGN.LEFT,
  //                 BluetoothEscposPrinter.ALIGN.CENTER,
  //                 BluetoothEscposPrinter.ALIGN.RIGHT,
  //                 BluetoothEscposPrinter.ALIGN.RIGHT,
  //               ],
  //               //@ts-ignore
  //               [
  //                 item?.item_name,
  //                 item?.quantity.toString(),
  //                 item?.price.toString(),
  //                 calculateAmountDiscountPerProduct(
  //                   item?.quantity,
  //                   item?.discount,
  //                 ),
  //                 calculateAmountAfterAmountDiscountPerProduct(
  //                   item?.price,
  //                   item?.quantity,
  //                   item?.discount,
  //                 ),
  //               ],
  //               {},
  //             )
  //           : await BluetoothEscposPrinter.printColumn(
  //             columnWidthsProductsHeaderAndBodyWithoutDiscount,
  //             [
  //               BluetoothEscposPrinter.ALIGN.LEFT,
  //               BluetoothEscposPrinter.ALIGN.LEFT,
  //               BluetoothEscposPrinter.ALIGN.RIGHT,
  //               BluetoothEscposPrinter.ALIGN.RIGHT,
  //             ],
  //             //@ts-ignore
  //             [
  //               item?.item_name,
  //               item?.quantity.toString(),
  //               item?.price.toString(),
  //               calculateAmountAfterAmountDiscountPerProduct(
  //                 item?.price,
  //                 item?.quantity,
  //                 0,
  //               ),
  //             ],
  //             {},
  //           )
  //         // : await BluetoothEscposPrinter.printColumn(
  //         //     columnWidthsProductsHeaderAndBody,
  //         //     [
  //         //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         //         BluetoothEscposPrinter.ALIGN.CENTER,
  //         //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //         //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //         //     ],
  //         //     //@ts-ignore
  //         //     [item?.item_name, item?.quantity.toString(), item?.price.toString(), calculateAmountDiscountPerProduct(item?.quantity, 0), calculateAmountAfterAmountDiscountPerProduct(item?.price, item?.quantity, 0)],
  //         //     {},
  //         // )

  //         // await BluetoothEscposPrinter.printColumn(
  //         //     columnWidthsProductsHeaderAndBody,
  //         //     [
  //         //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         //         BluetoothEscposPrinter.ALIGN.CENTER,
  //         //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //         //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //         //     ],
  //         //     [item?.item_name, item?.quantity.toString(), item?.price.toString(), (((item?.price * item?.quantity * item?.discount) / 100).toFixed(2)).toString(), `${(item?.price * item?.quantity).toString()}`],
  //         //     {},
  //         // )
  //         await BluetoothEscposPrinter.printText("\n", {})
  //       }
  //     }

  //     // await BluetoothEscposPrinter.printText("\n", {})
  //     await BluetoothEscposPrinter.printText("------------------------", {
  //       align: "center",
  //     })

  //     await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printColumn(
  //       columnWidthsItemTotal,
  //       [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
  //       [
  //         `ITEM: ${addedProducts?.length?.toString()} QTY: ${totalQuantities.toString()}`,
  //         `AMT: ${netTotal?.toFixed(2)}`,
  //       ],
  //       {},
  //     )
  //     // await BluetoothEscposPrinter.printText("\n", {})

  //     // receiptSettings?.gst_type === "E"
  //     //     ? await BluetoothEscposPrinter.printColumn(
  //     //         columnWidths,
  //     //         [
  //     //             BluetoothEscposPrinter.ALIGN.LEFT,
  //     //             BluetoothEscposPrinter.ALIGN.CENTER,
  //     //             BluetoothEscposPrinter.ALIGN.RIGHT,
  //     //         ],
  //     //         // ["TOTAL", ":", `${(netTotal - totalDiscountAmount + totalGST).toFixed(2)}`],
  //     //         ["TOTAL", ":", `${netTotalWithGSTCalculate(netTotal, totalDiscountAmount, totalGST)}`],
  //     //         {},
  //     //     )
  //     //     : await BluetoothEscposPrinter.printColumn(
  //     //         columnWidths,
  //     //         [
  //     //             BluetoothEscposPrinter.ALIGN.LEFT,
  //     //             BluetoothEscposPrinter.ALIGN.CENTER,
  //     //             BluetoothEscposPrinter.ALIGN.RIGHT,
  //     //         ],
  //     //         // ["TOTAL", ":", `${(netTotal - totalDiscountAmount + totalGST).toFixed(2)}`],
  //     //         ["TOTAL", ":", `${totalAmountWithGSTInclCalculate(netTotal, totalGST)}`],
  //     //         {},
  //     //     )

  //     gstKeys.map(
  //       async key =>
  //         await BluetoothEscposPrinter.printColumn(
  //           columnWidths,
  //           [
  //             BluetoothEscposPrinter.ALIGN.LEFT,
  //             BluetoothEscposPrinter.ALIGN.CENTER,
  //             BluetoothEscposPrinter.ALIGN.RIGHT,
  //           ],
  //           [
  //             `${key.includes("CGST") ? "CGST" : "SGST"} @${key
  //               .replace(/total(CGST|SGST)_/, "")
  //               .replace("_", ".")}%`,
  //             ":",
  //             gstTotals[key].toFixed(2),
  //           ],
  //           {},
  //         ),
  //     )

  //     await BluetoothEscposPrinter.printColumn(
  //       columnWidths,
  //       [
  //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         BluetoothEscposPrinter.ALIGN.CENTER,
  //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //       ],
  //       ["TOTAL GST", ":", totalGST.toFixed(2).toString()],
  //       {},
  //     )

  //     receiptSettings?.discount_flag === "Y" &&
  //       (await BluetoothEscposPrinter.printColumn(
  //         columnWidths,
  //         [
  //           BluetoothEscposPrinter.ALIGN.LEFT,
  //           BluetoothEscposPrinter.ALIGN.CENTER,
  //           BluetoothEscposPrinter.ALIGN.RIGHT,
  //         ],
  //         //@ts-ignore
  //         ["DISCOUNT", ":", parseFloat(totalDiscountAmount).toFixed(2)],
  //         {},
  //       ))

  //     receiptSettings?.gst_type === "E"
  //       ? await BluetoothEscposPrinter.printColumn(
  //         columnWidths,
  //         [
  //           BluetoothEscposPrinter.ALIGN.LEFT,
  //           BluetoothEscposPrinter.ALIGN.CENTER,
  //           BluetoothEscposPrinter.ALIGN.RIGHT,
  //         ],
  //         // ["TOTAL", ":", `${(netTotal - totalDiscountAmount + totalGST).toFixed(2)}`],
  //         [
  //           "TOTAL",
  //           ":",
  //           `${netTotalWithGSTCalculate(
  //             netTotal,
  //             totalDiscountAmount,
  //             totalGST,
  //           )}`,
  //         ],
  //         {},
  //       )
  //       : await BluetoothEscposPrinter.printColumn(
  //         columnWidths,
  //         [
  //           BluetoothEscposPrinter.ALIGN.LEFT,
  //           BluetoothEscposPrinter.ALIGN.CENTER,
  //           BluetoothEscposPrinter.ALIGN.RIGHT,
  //         ],
  //         // ["TOTAL", ":", `${(netTotal - totalDiscountAmount + totalGST).toFixed(2)}`],
  //         [
  //           "TOTAL",
  //           ":",
  //           `${netTotalWithGSTInclCalculate(netTotal, totalDiscountAmount)}`,
  //         ],
  //         {},
  //       )
  //     // : await BluetoothEscposPrinter.printColumn(
  //     //     columnWidths,
  //     //     [
  //     //         BluetoothEscposPrinter.ALIGN.LEFT,
  //     //         BluetoothEscposPrinter.ALIGN.CENTER,
  //     //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //     //     ],
  //     //     // ["TOTAL", ":", `${(netTotal - totalDiscountAmount + totalGST).toFixed(2)}`],
  //     //     ["TOTAL", ":", `${totalAmountWithGSTInclCalculate(netTotal, totalGST)}`],
  //     //     {},
  //     // )

  //     // receiptSettings?.gst_flag === "Y"
  //     //     && await BluetoothEscposPrinter.printColumn(
  //     //         columnWidths,
  //     //         [
  //     //             BluetoothEscposPrinter.ALIGN.LEFT,
  //     //             BluetoothEscposPrinter.ALIGN.CENTER,
  //     //             BluetoothEscposPrinter.ALIGN.RIGHT,
  //     //         ],
  //     //         ["TOTAL GST", ":", (totalGST).toFixed(2).toString()],
  //     //         {},
  //     //     )

  //     receiptSettings?.gst_type === "E"
  //       ? await BluetoothEscposPrinter.printColumn(
  //         columnWidths,
  //         [
  //           BluetoothEscposPrinter.ALIGN.LEFT,
  //           BluetoothEscposPrinter.ALIGN.CENTER,
  //           BluetoothEscposPrinter.ALIGN.RIGHT,
  //         ],
  //         // ["ROUND OFF", ":", `${(Math.round(parseFloat((netTotal - totalDiscountAmount + totalGST).toFixed(2))) - parseFloat((netTotal - totalDiscountAmount + totalGST).toFixed(2))).toFixed(2)}`],
  //         [
  //           "ROUND OFF",
  //           ":",
  //           `${roundingOffWithGSTCalculate(
  //             netTotal,
  //             totalDiscountAmount,
  //             totalGST,
  //           )}`,
  //         ],
  //         {},
  //       )
  //       : await BluetoothEscposPrinter.printColumn(
  //         columnWidths,
  //         [
  //           BluetoothEscposPrinter.ALIGN.LEFT,
  //           BluetoothEscposPrinter.ALIGN.CENTER,
  //           BluetoothEscposPrinter.ALIGN.RIGHT,
  //         ],
  //         // ["ROUND OFF", ":", `${(Math.round(parseFloat((netTotal - totalDiscountAmount + totalGST).toFixed(2))) - parseFloat((netTotal - totalDiscountAmount + totalGST).toFixed(2))).toFixed(2)}`],
  //         [
  //           "ROUND OFF",
  //           ":",
  //           `${roundingOffWithGSTInclCalculate(
  //             netTotal,
  //             totalDiscountAmount,
  //           )}`,
  //         ],
  //         {},
  //       )

  //     // await BluetoothEscposPrinter.printColumn(
  //     //     columnWidths,
  //     //     [
  //     //         BluetoothEscposPrinter.ALIGN.LEFT,
  //     //         BluetoothEscposPrinter.ALIGN.CENTER,
  //     //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //     //     ],
  //     //     // ["NET AMT", ":", `${Math.round(parseFloat((netTotal - totalDiscountAmount + totalGST).toFixed(2)))}`],
  //     //     ["NET AMT", ":", `${grandTotalWithGSTCalculate(netTotal, totalDiscountAmount, totalGST)}`],
  //     //     {},
  //     // )

  //     receiptSettings?.gst_type === "E"
  //       ? await BluetoothEscposPrinter.printColumn(
  //         columnWidths,
  //         [
  //           BluetoothEscposPrinter.ALIGN.LEFT,
  //           BluetoothEscposPrinter.ALIGN.CENTER,
  //           BluetoothEscposPrinter.ALIGN.RIGHT,
  //         ],
  //         // ["NET AMT", ":", `${Math.round(parseFloat((netTotal - totalDiscountAmount + totalGST).toFixed(2)))}`],
  //         [
  //           "NET AMT",
  //           ":",
  //           `${grandTotalWithGSTCalculate(
  //             netTotal,
  //             totalDiscountAmount,
  //             totalGST,
  //           )}`,
  //         ],
  //         {},
  //       )
  //       : await BluetoothEscposPrinter.printColumn(
  //         columnWidths,
  //         [
  //           BluetoothEscposPrinter.ALIGN.LEFT,
  //           BluetoothEscposPrinter.ALIGN.CENTER,
  //           BluetoothEscposPrinter.ALIGN.RIGHT,
  //         ],
  //         // ["NET AMT", ":", `${Math.round(parseFloat((netTotal - totalDiscountAmount + totalGST).toFixed(2)))}`],
  //         [
  //           "NET AMT",
  //           ":",
  //           `${grandTotalWithGSTInclCalculate(
  //             netTotal,
  //             totalDiscountAmount,
  //           )}`,
  //         ],
  //         {},
  //       )

  //     // await BluetoothEscposPrinter.printText("\n", {})
  //     await BluetoothEscposPrinter.printText("------------------------", {
  //       align: "center",
  //     })
  //     await BluetoothEscposPrinter.printText("\n", {})
  //     if (receiptSettings?.rcv_cash_flag === "Y") {
  //       if (paymentMode === "C") {
  //         await BluetoothEscposPrinter.printText("PAYMENT MODE", {
  //           align: "center",
  //         })
  //         await BluetoothEscposPrinter.printText("\n", {})
  //         await BluetoothEscposPrinter.printText(
  //           `CASH RECEIVED:       ${cashAmount}`,
  //           { align: "center" },
  //         )
  //         await BluetoothEscposPrinter.printText("\n", {})
  //         await BluetoothEscposPrinter.printText(
  //           `RETURNED AMT:        ${returnedAmt}`,
  //           { align: "center" },
  //         )

  //         await BluetoothEscposPrinter.printText("\n", {})
  //         await BluetoothEscposPrinter.printText("------------------------", {
  //           align: "center",
  //         })
  //         await BluetoothEscposPrinter.printText("\n", {})
  //       }

  //     } else {
  //       await BluetoothEscposPrinter.printText(
  //         `TOTAL AMT:        ${Math.abs(returnedAmt)}`,
  //         { align: "center" },
  //       )

  //       await BluetoothEscposPrinter.printText("\n", {})
  //       await BluetoothEscposPrinter.printText("------------------------", {
  //         align: "center",
  //       })
  //       await BluetoothEscposPrinter.printText("\n", {})
  //     }
  //     if (paymentMode === "R") {
  //       await BluetoothEscposPrinter.printText("PAYMENT MODE", {
  //         align: "center",
  //       })
  //       await BluetoothEscposPrinter.printText("\n", {})
  //       await BluetoothEscposPrinter.printText(
  //         `CASH RECEIVED:       ${cashAmount}`,
  //         { align: "center" },
  //       )
  //       await BluetoothEscposPrinter.printText("\n", {})
  //       await BluetoothEscposPrinter.printText(
  //         `DUE AMT:        ${Math.abs(returnedAmt)}`,
  //         { align: "center" },
  //       )

  //       await BluetoothEscposPrinter.printText("\n", {})
  //       await BluetoothEscposPrinter.printText("------------------------", {
  //         align: "center",
  //       })
  //       await BluetoothEscposPrinter.printText("\n", {})
  //     }
  //     if (paymentMode === "D") {
  //       // await BluetoothEscposPrinter.printText(
  //       //     `RECEIVED:       ${Math.round(parseFloat((netTotal - totalDiscountAmount + totalGST).toFixed(2)))} [CARD]`,
  //       //     { align: "center" },
  //       // )
  //       receiptSettings?.gst_type === "E"
  //         ? await BluetoothEscposPrinter.printText(
  //           `RECEIVED:       ${grandTotalWithGSTCalculate(
  //             netTotal,
  //             totalDiscountAmount,
  //             totalGST,
  //           )} [CARD]`,
  //           { align: "center" },
  //         )
  //         : await BluetoothEscposPrinter.printText(
  //           `RECEIVED:       ${grandTotalWithGSTInclCalculate(
  //             netTotal,
  //             totalDiscountAmount,
  //           )} [CARD]`,
  //           { align: "center" },
  //         )
  //       await BluetoothEscposPrinter.printText("\n", {})
  //       await BluetoothEscposPrinter.printText("------------------------", {
  //         align: "center",
  //       })
  //       await BluetoothEscposPrinter.printText("\n", {})
  //     }
  //     if (paymentMode === "U") {
  //       receiptSettings?.gst_type === "E"
  //         ? await BluetoothEscposPrinter.printText(
  //           `RECEIVED:       ${grandTotalWithGSTCalculate(
  //             netTotal,
  //             totalDiscountAmount,
  //             totalGST,
  //           )} [UPI]`,
  //           { align: "center" },
  //         )
  //         : await BluetoothEscposPrinter.printText(
  //           `RECEIVED:       ${grandTotalWithGSTInclCalculate(
  //             netTotal,
  //             totalDiscountAmount,
  //           )} [UPI]`,
  //           { align: "center" },
  //         )
  //       await BluetoothEscposPrinter.printText("\n", {})
  //       await BluetoothEscposPrinter.printText("------------------------", {
  //         align: "center",
  //       })

  //       if (upiData?.length > 0) {
  //         BluetoothEscposPrinter.printQRCode(
  //           `${upiData}&am=${receiptSettings?.gst_type === "E"
  //             ? grandTotalWithGSTCalculate(netTotal, totalDiscountAmount, totalGST)
  //             : grandTotalWithGSTInclCalculate(netTotal, totalDiscountAmount)
  //           }`,
  //           250,
  //           BluetoothEscposPrinter.ERROR_CORRECTION.L,
  //         )
  //       }
  //       await BluetoothEscposPrinter.printText("\n", {})
  //       // await BluetoothEscposPrinter.printText("------------------------", {
  //       //   align: "center",
  //       // })
  //     }

  //     if (receiptSettings?.on_off_flag3 === "Y") {
  //       await BluetoothEscposPrinter.printText(receiptSettings?.footer1, {})
  //       await BluetoothEscposPrinter.printText("\n", {})
  //     }
  //     if (receiptSettings?.on_off_flag4 === "Y") {
  //       await BluetoothEscposPrinter.printText(receiptSettings?.footer2, {})
  //     }
  //     await BluetoothEscposPrinter.printText("\n", {})

  //     // await BluetoothEscposPrinter.printText(
  //     //     "THANK YOU, VISIT AGAIN!",
  //     //     { align: "center" },
  //     // )
  //     // await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printText("------X------", {
  //       textAlign: "center",
  //     })
  //     await BluetoothEscposPrinter.printText("\n\r\n\r\n\r", {})
  //   } catch (e) {
  //     console.log(e.message || "ERROR")
  //   }
  // }

  // async function printReceiptWithoutGst(
  //   addedProducts: ItemsData[],
  //   netTotal: number,
  //   totalDiscountAmount: number,
  //   cashAmount?: number,
  //   returnedAmt?: number,
  //   customerName?: string,
  //   customerPhone?: string,
  //   rcptNo?: number,
  //   paymentMode?: string,
  //   kotNo?: number,
  //   tableNo?: number,
  // ) {
  //   const loginStore = JSON.parse(loginStorage.getString("login-data"))
  //   const fileStore = fileStorage.getString("file-data")
  //   const upiStore = fileStorage.getString("upi-blob")
  //   const upiData = fileStorage.getString("upi-data")

  //   const shopName: string = loginStore?.company_name?.toString()
  //   const address: string = loginStore?.address?.toString()
  //   const location: string = loginStore?.branch_name?.toString()
  //   const shopMobile: string = loginStore?.phone_no?.toString()
  //   const shopEmail: string = loginStore?.email_id?.toString()
  //   const cashier: string = loginStore?.user_name?.toString()

  //   let totalQuantities: number = 0
  //   let totalAmountAfterDiscount: number = 0

  //   try {
  //     let columnWidths = [11, 1, 18]
  //     let columnWidthsHeader = [8, 1, 21]
  //     let columnWidthsProductsHeaderAndBody = [8, 4, 6, 5, 7]
  //     let columnWidthsProductsHeaderAndBodyWithoutDiscount = [8, 6, 7, 8]
  //     // let columnWidthsProductsHeaderAndBody = [18, 3, 4, 3, 4]
  //     let columnWidthsItemTotal = [18, 12]
  //     let columnWidthIfNameIsBig = [32]
  //     let columnWidthForKot = [10, 22]

  //     // let newColumnWidths: number[] = [9, 9, 6, 7]






  //     if (receiptSettings?.kot_flag === "Y") {
  //       await BluetoothEscposPrinter.printText(shopName.toUpperCase(), {
  //         align: "center",
  //         widthtimes: 1.2,
  //         heigthtimes: 2,
  //       })

  //       await BluetoothEscposPrinter.printText("\n", {})
  //       await BluetoothEscposPrinter.printText("-------------------------", {})
  //       await BluetoothEscposPrinter.printText("\n", {})

  //       await BluetoothEscposPrinter.printColumn(
  //         columnWidthForKot,
  //         [
  //           BluetoothEscposPrinter.ALIGN.LEFT,
  //           BluetoothEscposPrinter.ALIGN.RIGHT,
  //         ],
  //         ["KOT NO.", `${kotNo}`],
  //         {},
  //       )

  //       await BluetoothEscposPrinter.printColumn(
  //         columnWidthForKot,
  //         [
  //           BluetoothEscposPrinter.ALIGN.LEFT,
  //           BluetoothEscposPrinter.ALIGN.RIGHT,
  //         ],
  //         ["TABLE NO.", `${tableNo}`],
  //         {},
  //       )

  //       await BluetoothEscposPrinter.printColumn(
  //         columnWidthForKot,
  //         [
  //           BluetoothEscposPrinter.ALIGN.LEFT,
  //           BluetoothEscposPrinter.ALIGN.RIGHT,
  //         ],
  //         ["DT.", `${new Date().toLocaleString("en-GB")}`],
  //         {},
  //       )

  //       // await BluetoothEscposPrinter.printText("\n", {})
  //       await BluetoothEscposPrinter.printText("-------------------------", {})
  //       await BluetoothEscposPrinter.printText("\n", {})

  //       await BluetoothEscposPrinter.printColumn(
  //         columnWidthForKot,
  //         [
  //           BluetoothEscposPrinter.ALIGN.LEFT,
  //           BluetoothEscposPrinter.ALIGN.RIGHT,
  //         ],
  //         ["ITEM", `QTY`],
  //         {},
  //       )

  //       for (const item of addedProducts) {
  //         if (item?.item_name?.length > 10) {
  //           await BluetoothEscposPrinter.printColumn(
  //             columnWidthIfNameIsBig,
  //             [
  //               BluetoothEscposPrinter.ALIGN.LEFT,
  //             ],
  //             [`${item?.item_name}`],
  //             {},
  //           )
  //           await BluetoothEscposPrinter.printColumn(
  //             columnWidthIfNameIsBig,
  //             [
  //               BluetoothEscposPrinter.ALIGN.RIGHT,
  //             ],
  //             [`${item?.quantity}`],
  //             {},
  //           )
  //           // await BluetoothEscposPrinter.printText("\n", {})
  //           // await BluetoothEscposPrinter.printText(`${item.quantity}`, { align: "right" })
  //         } else {
  //           await BluetoothEscposPrinter.printColumn(
  //             columnWidthForKot,
  //             [
  //               BluetoothEscposPrinter.ALIGN.LEFT,
  //               BluetoothEscposPrinter.ALIGN.RIGHT,
  //             ],
  //             [`${item?.item_name}`, `${item?.quantity}`],
  //             {},
  //           )
  //         }
  //       }

  //       await BluetoothEscposPrinter.printText("\n", {})
  //       await BluetoothEscposPrinter.printText("-------------------------", {})
  //       await BluetoothEscposPrinter.printText("\n\n\n", {})


  //     }







  //     if (fileStore?.length > 0) {
  //       await BluetoothEscposPrinter.printerAlign(
  //         BluetoothEscposPrinter.ALIGN.CENTER,
  //       )
  //       const options = {
  //         width: 250, // Assuming 58mm paper width with 8 dots/mm resolution (58mm * 8dots/mm = 384 dots)
  //         left: 50, // No left padding
  //         // align: "CENTER"
  //       }

  //       // Print the image
  //       await BluetoothEscposPrinter.printPic(fileStore, options)
  //     }

  //     await BluetoothEscposPrinter.printerAlign(
  //       BluetoothEscposPrinter.ALIGN.CENTER,
  //     )
  //     await BluetoothEscposPrinter.printText(shopName.toUpperCase(), {
  //       align: "center",
  //       widthtimes: 1.2,
  //       heigthtimes: 2,
  //     })
  //     await BluetoothEscposPrinter.printText("\n", {})
  //     // await BluetoothEscposPrinter.printText("hasifughaf", { align: "center" })

  //     if (receiptSettings?.on_off_flag1 === "Y") {
  //       await BluetoothEscposPrinter.printText(receiptSettings?.header1, {})
  //       await BluetoothEscposPrinter.printText("\n", {})
  //     }

  //     if (receiptSettings?.on_off_flag2 === "Y") {
  //       await BluetoothEscposPrinter.printText(receiptSettings?.header2, {})
  //     }
  //     await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printText("RECEIPT", {
  //       align: "center",
  //     })

  //     await BluetoothEscposPrinter.printText("\n", {})

  //     // await BluetoothEscposPrinter.printText("------------------------", {
  //     //   align: "center",
  //     // })

  //     // await BluetoothEscposPrinter.printText("\n", {})
  //     // await BluetoothEscposPrinter.printText(address, {
  //     //   align: "center",
  //     // })
  //     // await BluetoothEscposPrinter.printText("\n", {})
  //     // await BluetoothEscposPrinter.printText(location, {
  //     //   align: "center",
  //     // })
  //     // await BluetoothEscposPrinter.printText("\n", {})
  //     // await BluetoothEscposPrinter.printText("------------------------", {
  //     //   align: "center",
  //     // })
  //     // await BluetoothEscposPrinter.printText("\n", {})

  //     // // await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT)

  //     // await BluetoothEscposPrinter.printColumn(
  //     //   columnWidthsHeader,
  //     //   [
  //     //     BluetoothEscposPrinter.ALIGN.LEFT,
  //     //     BluetoothEscposPrinter.ALIGN.CENTER,
  //     //     BluetoothEscposPrinter.ALIGN.RIGHT,
  //     //   ],
  //     //   ["MOBILE", ":", shopMobile],
  //     //   {},
  //     // )
  //     // await BluetoothEscposPrinter.printColumn(
  //     //   columnWidthsHeader,
  //     //   [
  //     //     BluetoothEscposPrinter.ALIGN.LEFT,
  //     //     BluetoothEscposPrinter.ALIGN.CENTER,
  //     //     BluetoothEscposPrinter.ALIGN.RIGHT,
  //     //   ],
  //     //   ["EMAIL", ":", shopEmail],
  //     //   {},
  //     // )
  //     // await BluetoothEscposPrinter.printColumn(
  //     //     columnWidthsHeader,
  //     //     [
  //     //         BluetoothEscposPrinter.ALIGN.LEFT,
  //     //         BluetoothEscposPrinter.ALIGN.CENTER,
  //     //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //     //     ],
  //     //     ["SITE", ":", "SHOPNAME.COM"],
  //     //     {},
  //     // )

  //     await BluetoothEscposPrinter.printText("------------------------", {
  //       align: "center",
  //     })
  //     await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printColumn(
  //       columnWidthsHeader,
  //       [
  //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         BluetoothEscposPrinter.ALIGN.CENTER,
  //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //       ],
  //       ["RCPT.NO", ":", rcptNo?.toString()],
  //       {},
  //     )
  //     await BluetoothEscposPrinter.printColumn(
  //       columnWidthsHeader,
  //       [
  //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         BluetoothEscposPrinter.ALIGN.CENTER,
  //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //       ],
  //       ["DATE", ":", `${new Date().toLocaleString("en-GB")}`],
  //       {},
  //     )
  //     await BluetoothEscposPrinter.printColumn(
  //       columnWidthsHeader,
  //       [
  //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         BluetoothEscposPrinter.ALIGN.CENTER,
  //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //       ],
  //       ["CASHIER", ":", cashier],
  //       {},
  //     )

  //     await BluetoothEscposPrinter.printText("------------------------", {
  //       align: "center",
  //     })
  //     await BluetoothEscposPrinter.printText("\n", {})

  //     if (customerName.length !== 0 || customerPhone.length !== 0) {
  //       receiptSettings?.cust_inf === "Y" &&
  //         (await BluetoothEscposPrinter.printColumn(
  //           columnWidthsHeader,
  //           [
  //             BluetoothEscposPrinter.ALIGN.LEFT,
  //             BluetoothEscposPrinter.ALIGN.CENTER,
  //             BluetoothEscposPrinter.ALIGN.RIGHT,
  //           ],
  //           ["NAME", ":", customerName],
  //           {},
  //         ))
  //       await BluetoothEscposPrinter.printColumn(
  //         columnWidthsHeader,
  //         [
  //           BluetoothEscposPrinter.ALIGN.LEFT,
  //           BluetoothEscposPrinter.ALIGN.CENTER,
  //           BluetoothEscposPrinter.ALIGN.RIGHT,
  //         ],
  //         ["PHONE", ":", customerPhone],
  //         {},
  //       )
  //       await BluetoothEscposPrinter.printText("------------------------", {
  //         align: "center",
  //       })

  //       await BluetoothEscposPrinter.printText("\n", {})
  //     }

  //     await BluetoothEscposPrinter.printerAlign(
  //       BluetoothEscposPrinter.ALIGN.CENTER,
  //     )

  //     receiptSettings?.discount_flag === "Y" &&
  //       receiptSettings?.discount_position !== "B"
  //       ? await BluetoothEscposPrinter.printColumn(
  //         columnWidthsProductsHeaderAndBody,
  //         [
  //           BluetoothEscposPrinter.ALIGN.LEFT,
  //           BluetoothEscposPrinter.ALIGN.LEFT,
  //           BluetoothEscposPrinter.ALIGN.CENTER,
  //           BluetoothEscposPrinter.ALIGN.RIGHT,
  //           BluetoothEscposPrinter.ALIGN.RIGHT,
  //         ],
  //         ["ITEM", "QTY", "PRICE", "DIS.", "AMT"],
  //         {},
  //       )
  //       : await BluetoothEscposPrinter.printColumn(
  //         columnWidthsProductsHeaderAndBodyWithoutDiscount,
  //         [
  //           BluetoothEscposPrinter.ALIGN.LEFT,
  //           BluetoothEscposPrinter.ALIGN.LEFT,
  //           BluetoothEscposPrinter.ALIGN.RIGHT,
  //           BluetoothEscposPrinter.ALIGN.RIGHT,
  //         ],
  //         ["ITEM", "QTY", "PRICE", "AMT"],
  //         {},
  //       )

  //     await BluetoothEscposPrinter.printText("------------------------", {
  //       align: "center",
  //     })

  //     await BluetoothEscposPrinter.printText("\n", {})

  //     for (const item of addedProducts) {
  //       //@ts-ignore
  //       totalQuantities += parseInt(item?.quantity)
  //       // receiptSettings?.discount_type === "P"
  //       //     ? totalAmountAfterDiscount += ((item?.price * item?.quantity) - ((item?.price * item?.quantity * item?.discount) / 100))
  //       //     : totalAmountAfterDiscount += ((item?.price * item?.quantity) - (item?.quantity * item?.discount))

  //       console.log("##########@@@@@@@@@@@@@@@", item)

  //       if (item?.item_name?.length >= 8) {
  //         await BluetoothEscposPrinter.printColumn(
  //           columnWidthIfNameIsBig,
  //           [BluetoothEscposPrinter.ALIGN.LEFT],
  //           [item?.item_name],
  //           {},
  //         )

  //         receiptSettings?.discount_flag === "Y" &&
  //           receiptSettings?.discount_position !== "B"
  //           ? receiptSettings?.discount_type === "P"
  //             ? await BluetoothEscposPrinter.printColumn(
  //               columnWidthsProductsHeaderAndBody,
  //               [
  //                 BluetoothEscposPrinter.ALIGN.LEFT,
  //                 BluetoothEscposPrinter.ALIGN.LEFT,
  //                 BluetoothEscposPrinter.ALIGN.CENTER,
  //                 BluetoothEscposPrinter.ALIGN.RIGHT,
  //                 BluetoothEscposPrinter.ALIGN.RIGHT,
  //               ],
  //               //@ts-ignore
  //               [
  //                 "",
  //                 item?.quantity.toString(),
  //                 item?.price.toString(),
  //                 calculatePercentDiscountPerProduct(
  //                   item?.price,
  //                   item?.quantity,
  //                   item?.discount,
  //                 ),
  //                 calculateAmountAfterPercentDiscountPerProduct(
  //                   item?.price,
  //                   item?.quantity,
  //                   item?.discount,
  //                 ),
  //               ],
  //               {},
  //             )
  //             : await BluetoothEscposPrinter.printColumn(
  //               columnWidthsProductsHeaderAndBody,
  //               [
  //                 BluetoothEscposPrinter.ALIGN.LEFT,
  //                 BluetoothEscposPrinter.ALIGN.LEFT,
  //                 BluetoothEscposPrinter.ALIGN.CENTER,
  //                 BluetoothEscposPrinter.ALIGN.RIGHT,
  //                 BluetoothEscposPrinter.ALIGN.RIGHT,
  //               ],
  //               //@ts-ignore
  //               [
  //                 "",
  //                 item?.quantity.toString(),
  //                 item?.price.toString(),
  //                 calculateAmountDiscountPerProduct(
  //                   item?.quantity,
  //                   item?.discount,
  //                 ),
  //                 calculateAmountAfterAmountDiscountPerProduct(
  //                   item?.price,
  //                   item?.quantity,
  //                   item?.discount,
  //                 ),
  //               ],
  //               {},
  //             )
  //           : await BluetoothEscposPrinter.printColumn(
  //             columnWidthsProductsHeaderAndBodyWithoutDiscount,
  //             [
  //               BluetoothEscposPrinter.ALIGN.LEFT,
  //               BluetoothEscposPrinter.ALIGN.LEFT,
  //               BluetoothEscposPrinter.ALIGN.RIGHT,
  //               BluetoothEscposPrinter.ALIGN.RIGHT,
  //             ],
  //             //@ts-ignore
  //             [
  //               "",
  //               item?.quantity.toString(),
  //               item?.price.toString(),
  //               calculateAmountAfterAmountDiscountPerProduct(
  //                 item?.price,
  //                 item?.quantity,
  //                 0,
  //               ),
  //             ],
  //             {},
  //           )
  //         // : await BluetoothEscposPrinter.printColumn(
  //         //     columnWidthsProductsHeaderAndBody,
  //         //     [
  //         //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         //         BluetoothEscposPrinter.ALIGN.CENTER,
  //         //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //         //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //         //     ],
  //         //     //@ts-ignore
  //         //     ["", item?.quantity.toString(), item?.price.toString(), calculateAmountDiscountPerProduct(item?.quantity, 0), calculateAmountAfterAmountDiscountPerProduct(item?.price, item?.quantity, 0)],
  //         //     {},
  //         // )

  //         // await BluetoothEscposPrinter.printColumn(
  //         //     columnWidthsProductsHeaderAndBody,
  //         //     [
  //         //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         //         BluetoothEscposPrinter.ALIGN.CENTER,
  //         //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //         //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //         //     ],
  //         //     ["", item?.quantity.toString(), item?.price.toString(), (((item?.price * item?.quantity * item?.discount) / 100).toFixed(2)).toString(), `${((item?.price * item?.quantity) - ((item?.price * item?.quantity * item?.discount) / 100)).toFixed(2).toString()}`],
  //         //     {},
  //         // )
  //       } else {
  //         receiptSettings?.discount_flag === "Y"
  //           ? receiptSettings?.discount_type === "P"
  //             ? await BluetoothEscposPrinter.printColumn(
  //               columnWidthsProductsHeaderAndBody,
  //               [
  //                 BluetoothEscposPrinter.ALIGN.LEFT,
  //                 BluetoothEscposPrinter.ALIGN.LEFT,
  //                 BluetoothEscposPrinter.ALIGN.CENTER,
  //                 BluetoothEscposPrinter.ALIGN.RIGHT,
  //                 BluetoothEscposPrinter.ALIGN.RIGHT,
  //               ],
  //               //@ts-ignore
  //               [
  //                 item?.item_name,
  //                 item?.quantity.toString(),
  //                 item?.price.toString(),
  //                 calculatePercentDiscountPerProduct(
  //                   item?.price,
  //                   item?.quantity,
  //                   item?.discount,
  //                 ),
  //                 calculateAmountAfterPercentDiscountPerProduct(
  //                   item?.price,
  //                   item?.quantity,
  //                   item?.discount,
  //                 ),
  //               ],
  //               {},
  //             )
  //             : await BluetoothEscposPrinter.printColumn(
  //               columnWidthsProductsHeaderAndBody,
  //               [
  //                 BluetoothEscposPrinter.ALIGN.LEFT,
  //                 BluetoothEscposPrinter.ALIGN.LEFT,
  //                 BluetoothEscposPrinter.ALIGN.CENTER,
  //                 BluetoothEscposPrinter.ALIGN.RIGHT,
  //                 BluetoothEscposPrinter.ALIGN.RIGHT,
  //               ],
  //               //@ts-ignore
  //               [
  //                 item?.item_name,
  //                 item?.quantity.toString(),
  //                 item?.price.toString(),
  //                 calculateAmountDiscountPerProduct(
  //                   item?.quantity,
  //                   item?.discount,
  //                 ),
  //                 calculateAmountAfterAmountDiscountPerProduct(
  //                   item?.price,
  //                   item?.quantity,
  //                   item?.discount,
  //                 ),
  //               ],
  //               {},
  //             )
  //           : await BluetoothEscposPrinter.printColumn(
  //             columnWidthsProductsHeaderAndBodyWithoutDiscount,
  //             [
  //               BluetoothEscposPrinter.ALIGN.LEFT,
  //               BluetoothEscposPrinter.ALIGN.LEFT,
  //               BluetoothEscposPrinter.ALIGN.RIGHT,
  //               BluetoothEscposPrinter.ALIGN.RIGHT,
  //             ],
  //             //@ts-ignore
  //             [
  //               item?.item_name,
  //               item?.quantity.toString(),
  //               item?.price.toString(),
  //               calculateAmountAfterAmountDiscountPerProduct(
  //                 item?.price,
  //                 item?.quantity,
  //                 0,
  //               ),
  //             ],
  //             {},
  //           )
  //         // : await BluetoothEscposPrinter.printColumn(
  //         //     columnWidthsProductsHeaderAndBody,
  //         //     [
  //         //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         //         BluetoothEscposPrinter.ALIGN.CENTER,
  //         //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //         //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //         //     ],
  //         //     //@ts-ignore
  //         //     [item?.item_name, item?.quantity.toString(), item?.price.toString(), calculateAmountDiscountPerProduct(item?.quantity, 0), calculateAmountAfterAmountDiscountPerProduct(item?.price, item?.quantity, 0)],
  //         //     {},
  //         // )

  //         // await BluetoothEscposPrinter.printColumn(
  //         //     columnWidthsProductsHeaderAndBody,
  //         //     [
  //         //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         //         BluetoothEscposPrinter.ALIGN.CENTER,
  //         //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //         //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //         //     ],
  //         //     [item?.item_name, item?.quantity.toString(), item?.price.toString(), (((item?.price * item?.quantity * item?.discount) / 100).toFixed(2)).toString(), `${(item?.price * item?.quantity).toString()}`],
  //         //     {},
  //         // )
  //         // await BluetoothEscposPrinter.printText("\n", {})
  //       }
  //     }

  //     // await BluetoothEscposPrinter.printText("\n", {})
  //     await BluetoothEscposPrinter.printText("------------------------", {
  //       align: "center",
  //     })

  //     await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printColumn(
  //       columnWidthsItemTotal,
  //       [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
  //       [
  //         `ITEM: ${addedProducts?.length?.toString()} QTY: ${totalQuantities.toString()}`,
  //         `AMT: ${netTotal?.toFixed(2)}`,
  //       ],
  //       {},
  //     )
  //     // await BluetoothEscposPrinter.printText("\n", {})

  //     receiptSettings?.discount_flag === "Y" &&
  //       (await BluetoothEscposPrinter.printColumn(
  //         columnWidths,
  //         [
  //           BluetoothEscposPrinter.ALIGN.LEFT,
  //           BluetoothEscposPrinter.ALIGN.CENTER,
  //           BluetoothEscposPrinter.ALIGN.RIGHT,
  //         ],
  //         //@ts-ignore
  //         ["DISCOUNT", ":", parseFloat(totalDiscountAmount).toFixed(2)],
  //         {},
  //       ))
  //     await BluetoothEscposPrinter.printColumn(
  //       columnWidths,
  //       [
  //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         BluetoothEscposPrinter.ALIGN.CENTER,
  //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //       ],
  //       ["TOTAL", ":", netTotalCalculate(netTotal, totalDiscountAmount)],
  //       {},
  //     )
  //     await BluetoothEscposPrinter.printColumn(
  //       columnWidths,
  //       [
  //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         BluetoothEscposPrinter.ALIGN.CENTER,
  //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //       ],
  //       // ["ROUND OFF", ":", `${(Math.round(parseFloat((netTotal - totalDiscountAmount).toFixed(2))) - parseFloat((netTotal - totalDiscountAmount).toFixed(2))).toFixed(2)}`],
  //       [
  //         "ROUND OFF",
  //         ":",
  //         `${roundingOffCalculate(netTotal, totalDiscountAmount)}`,
  //       ],
  //       {},
  //     )
  //     await BluetoothEscposPrinter.printColumn(
  //       columnWidths,
  //       [
  //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         BluetoothEscposPrinter.ALIGN.CENTER,
  //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //       ],
  //       // ["NET AMT", ":", `${Math.round(parseFloat((netTotal - totalDiscountAmount).toFixed(2)))}`],
  //       [
  //         "NET AMT",
  //         ":",
  //         `${grandTotalCalculate(netTotal, totalDiscountAmount)}`,
  //       ],
  //       {},
  //     )

  //     // await BluetoothEscposPrinter.printText("\n", {})
  //     await BluetoothEscposPrinter.printText("------------------------", {
  //       align: "center",
  //     })
  //     await BluetoothEscposPrinter.printText("\n", {})
  //     if (receiptSettings?.rcv_cash_flag === "Y") {
  //       if (paymentMode === "C") {
  //         await BluetoothEscposPrinter.printText("PAYMENT MODE", {
  //           align: "center",
  //         })
  //         await BluetoothEscposPrinter.printText("\n", {})
  //         await BluetoothEscposPrinter.printText(
  //           `CASH RECEIVED:       ${cashAmount}`,
  //           { align: "center" },
  //         )
  //         await BluetoothEscposPrinter.printText("\n", {})
  //         await BluetoothEscposPrinter.printText(
  //           `RETURNED AMT:        ${returnedAmt}`,
  //           { align: "center" },
  //         )

  //         await BluetoothEscposPrinter.printText("\n", {})
  //         await BluetoothEscposPrinter.printText("------------------------", {
  //           align: "center",
  //         })
  //         await BluetoothEscposPrinter.printText("\n", {})
  //       }
  //     } else {
  //       // await BluetoothEscposPrinter.printText("\n", {})
  //       await BluetoothEscposPrinter.printText(
  //         `TOTAL AMT:        ${Math.abs(returnedAmt)}`,
  //         { align: "center" },
  //       )

  //       await BluetoothEscposPrinter.printText("\n", {})
  //       await BluetoothEscposPrinter.printText("------------------------", {
  //         align: "center",
  //       })
  //       await BluetoothEscposPrinter.printText("\n", {})
  //     }

  //     if (paymentMode === "R") {
  //       await BluetoothEscposPrinter.printText("PAYMENT MODE", {
  //         align: "center",
  //       })
  //       await BluetoothEscposPrinter.printText("\n", {})
  //       await BluetoothEscposPrinter.printText(
  //         `CASH RECEIVED:       ${cashAmount}`,
  //         { align: "center" },
  //       )
  //       await BluetoothEscposPrinter.printText("\n", {})
  //       await BluetoothEscposPrinter.printText(
  //         `DUE AMT:        ${Math.abs(returnedAmt)}`,
  //         { align: "center" },
  //       )

  //       await BluetoothEscposPrinter.printText("\n", {})
  //       await BluetoothEscposPrinter.printText("------------------------", {
  //         align: "center",
  //       })
  //       await BluetoothEscposPrinter.printText("\n", {})
  //     }

  //     if (paymentMode === "D") {
  //       await BluetoothEscposPrinter.printText(
  //         `RECEIVED:       ${grandTotalCalculate(
  //           netTotal,
  //           totalDiscountAmount,
  //         )} [CARD]`,
  //         { align: "center" },
  //       )
  //       await BluetoothEscposPrinter.printText("\n", {})
  //       await BluetoothEscposPrinter.printText("------------------------", {
  //         align: "center",
  //       })
  //       await BluetoothEscposPrinter.printText("\n", {})
  //     }

  //     if (paymentMode === "U") {
  //       await BluetoothEscposPrinter.printText(
  //         `RECEIVED:       ${grandTotalCalculate(
  //           netTotal,
  //           totalDiscountAmount,
  //         )} [UPI]`,
  //         { align: "center" },
  //       )
  //       await BluetoothEscposPrinter.printText("\n", {})
  //       await BluetoothEscposPrinter.printText("------------------------", {
  //         align: "center",
  //       })

  //       if (upiData?.length > 0) {
  //         BluetoothEscposPrinter.printQRCode(
  //           `${upiData}&am=${grandTotalCalculate(netTotal, totalDiscountAmount)}`,
  //           250,
  //           BluetoothEscposPrinter.ERROR_CORRECTION.L,
  //         )
  //       }
  //       await BluetoothEscposPrinter.printText("\n", {})
  //       // await BluetoothEscposPrinter.printText("------------------------", {
  //       //   align: "center",
  //       // })
  //     }
  //     // await BluetoothEscposPrinter.printText("\n", {})

  //     if (receiptSettings?.on_off_flag3 === "Y") {
  //       await BluetoothEscposPrinter.printText(receiptSettings?.footer1, {})
  //       await BluetoothEscposPrinter.printText("\n", {})
  //     }
  //     if (receiptSettings?.on_off_flag4 === "Y") {
  //       await BluetoothEscposPrinter.printText(receiptSettings?.footer2, {})
  //     }
  //     await BluetoothEscposPrinter.printText("\n", {})

  //     // await BluetoothEscposPrinter.printText(
  //     //     "THANK YOU, VISIT AGAIN!",
  //     //     { align: "center" },
  //     // )
  //     // await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printText("------X------", {})
  //     await BluetoothEscposPrinter.printText("\n\r\n\r\n\r", {})
  //   } catch (e) {
  //     console.log(e.message || "ERROR")
  //   }
  // }

  const printReceiptT = async (
    addedProducts: ItemsData[],
    netTotal: number,
    totalDiscountAmount: number,
    cashAmount?: number,
    returnedAmt?: number,
    customerName?: string,
    customerPhone?: string,
    rcptNo?: number,
    paymentMode?: string,
  ) => {
    let totalQuantities: number = 0
    // let totalAmountAfterDiscount: number = 0

    let text =
      `[C]ESTIMATE\n` +
      `[C]=============================\n` +
      `[L]RCPT. NO.[R]${rcptNo?.toString()}\n` +
      `[L]RCPT. DATE[R]${new Date().toLocaleDateString("en-GB")}\n` +
      `[C]=============================\n` +
      `[L]Item[C]Qty[R]Amount\n` +
      `[C]=============================\n`;

    for (const item of addedProducts) {
      totalQuantities += +item?.quantity
      text += `[L]${item?.item_name?.slice(0, 10)}[C]${item?.quantity}[R]${+item?.price * +item?.quantity}\n`
    }

    text += `[C]=============================\n` +

      // `[L]Item[C]Qty[R]Amount\n` +
      `[L]${addedProducts?.length}[C]${totalQuantities}[R]${netTotal?.toFixed(2)}\n` +
      `[C]=============================\n` +
      `[L]ROUND OFF[R]${roundingOffCalculate(netTotal, 0)}\n`;

    if (paymentMode === "C") {
      text += `[L]CASH RECEIVED[R]${cashAmount}\n` +
        `[L]RETURN[R]${returnedAmt}\n`;
    }
    if (paymentMode === "R") {
      text += `[L]CASH RECEIVED[R]${cashAmount}\n` +
        `[L]DUE AMOUNT[R]${Math.abs(returnedAmt)}\n`;
    }

    text += `[L]Pay Mode[R]${paymentMode === "C" ? "Cash" : paymentMode === "R" ? "Credit" : paymentMode === "U" ? "UPI" : "Err"}\n` +

      `[L]GRAND AMT[R]${grandTotalCalculate(netTotal, 0).toFixed(2)}\n` +
      `[C]==============X===============\n\n\n` +
      `[C]                                \n\n`;

    await ThermalPrinterModule.printBluetooth({
      payload: text,
      printerNbrCharactersPerLine: 32,
      printerDpi: 120,
      printerWidthMM: 58,
      mmFeedPaper: 25,
    }).then(res => {
      console.log("RES", res)
    }).catch(err => {
      console.log("ERR", err)
    })
  }

  const rePrintT = async (
    addedProducts: ShowBillData[],
    netTotal: number,
    totalDiscountAmount: number,
    cashAmount?: number,
    returnedAmt?: number,
    customerName?: string,
    customerPhone?: string,
    rcptNo?: number,
    paymentMode?: string,
    isRefunded?: boolean,
    isRefundedDuplicate?: boolean,
    cancelFlag?: boolean
  ) => {
    let totalQuantities: number = 0
    // let totalAmountAfterDiscount: number = 0

    let text =
      `[C]ESTIMATE ${cancelFlag ? "(CANCELLED)" : "(DUPLICATE)"}\n` +
      // `[C]==========DUPLICATE==========\n` +
      `[C]=============================\n` +
      `[L]RCPT. NO.[R]${rcptNo?.toString()}\n` +
      `[L]RCPT. DATE[R]${new Date().toLocaleDateString("en-GB")}\n` +
      `[C]=============================\n` +
      `[L]Item[C]Qty[R]Amount\n` +
      `[C]=============================\n`;

    for (const item of addedProducts) {
      totalQuantities += +item?.qty
      text += `[L]${item?.item_name?.slice(0, 10)}[C]${item?.qty}[R]${+item?.price * +item?.qty}\n`
    }

    text += `[C]=============================\n` +

      // `[L]Item[C]Qty[R]Amount\n` +
      `[L]${addedProducts?.length}[C]${totalQuantities}[R]${netTotal?.toFixed(2)}\n` +
      `[C]=============================\n` +
      `[L]ROUND OFF[R]${roundingOffCalculate(netTotal, 0)}\n`;

    if (paymentMode === "C") {
      text += `[L]CASH RECEIVED[R]${cashAmount}\n` +
        `[L]RETURN[R]${returnedAmt}\n`;
    }
    if (paymentMode === "R") {
      text += `[L]CASH RECEIVED[R]${cashAmount}\n` +
        `[L]DUE AMOUNT[R]${Math.abs(returnedAmt)}\n`;
    }

    text += `[L]GRAND AMT[R]${grandTotalCalculate(netTotal, 0).toFixed(2)}\n` +
      `[C]==============X===============\n\n\n` +
      `[C]                                \n\n`;

    await ThermalPrinterModule.printBluetooth({
      payload: text,
      printerNbrCharactersPerLine: 32,
      printerDpi: 120,
      printerWidthMM: 58,
      mmFeedPaper: 25,
    }).then(res => {
      console.log("RES", res)
    }).catch(err => {
      console.log("ERR", err)
    })
  }

  const printProductwiseSaleReport = async (
    reportData: ProductwiseSaleReportData[],
    fromDate: string,
    toDate: string,
  ) => {
    let text =
      `[C]PRODUCTWISE SALE\n` +
      `[C]PRINT AT: ${new Date().toLocaleString("en-GB")}\n` +
      `[C]=============================\n` +
      `[L]FROM: ${new Date(fromDate)?.toLocaleDateString("en-GB")}[R]TO: ${new Date(toDate)?.toLocaleDateString("en-GB")}\n` +
      `[C]=============================\n` +
      // `[L]RCPT. DATE[R]${new Date().toLocaleDateString("en-GB")}\n` +
      `[L]Item[R]Quantity\n` +
      `[L]Unit Price[R]Net\n` +
      `[C]=============================\n`;

    let totQty = 0;
    let totNet = 0;
    let totAvgPrice = 0;

    for (const item of reportData) {
      totQty += item?.tot_item_qty;
      totNet += item?.tot_item_price;

      text += `[L]${item?.item_name}[R]${item?.tot_item_qty} ${item?.unit_name?.charAt(0)}\n` +
        `[L]${item?.unit_price}[R]${item?.tot_item_price}\n` +
        `[C]-----------------------------\n`;
    }

    text += `[C]=============================\n` +
      `[L]Total Qty[R]${totQty}\n` +
      `[L]Total Amt[R]${totNet}\n` +
      `[L]No of Items[R]${reportData?.length}\n` +
      // `[L]Cash Receive[R]${reportData[0]?.tot_received_cash}\n` +
      `[C]==============X===============\n\n\n` +
      `[C]                                \n\n`;

    await ThermalPrinterModule.printBluetooth({
      payload: text,
      printerNbrCharactersPerLine: 32,
      printerDpi: 120,
      printerWidthMM: 58,
      mmFeedPaper: 25,
    }).then(res => {
      console.log("RES", res)
    }).catch(err => {
      console.log("ERR", err)
    })
  }

  const printSaleReport = async (
    reportData: SaleReport[],
    fromDate: string,
    toDate: string,
  ) => {

    // ["SL.", "QTY", "PRC", "DIS", "", "NET"],
    let text =
      `[C]SALE REPORT\n` +
      `[C]PRINT AT: ${new Date().toLocaleString("en-GB")}\n` +
      `[C]=============================\n` +
      `[L]FROM: ${new Date(fromDate)?.toLocaleDateString("en-GB")}[R]TO: ${new Date(toDate)?.toLocaleDateString("en-GB")}\n` +
      `[C]=============================\n` +
      // `[L]RCPT. DATE[R]${new Date().toLocaleDateString("en-GB")}\n` +
      `[L]Rcpt No[C]Mode[R]Qty\n` +
      `[L]Price[R]Total\n` +
      `[C]=============================\n`;

    for (const item of reportData) {
      text += `[L]${item?.receipt_no?.toString()?.slice(-5)}[C]${item?.pay_mode === "C" ? "Cash" : item?.pay_mode === "U" ? "UPI" : item?.pay_mode === "R" ? "Credit" : "Err"}[R]${item?.no_of_items}\n` +
        `[L]${item?.price}[R]${item?.net_amt}\n` +
        `[C]-----------------------------\n`;
    }

    text += `[C]=============================\n` +
      `[L]Rows Count[R]${reportData?.length}\n` +
      `[C]==============X===============\n\n\n` +
      `[C]                                \n\n`;

    await ThermalPrinterModule.printBluetooth({
      payload: text,
      printerNbrCharactersPerLine: 32,
      printerDpi: 120,
      printerWidthMM: 58,
      mmFeedPaper: 25,
    }).then(res => {
      console.log("RES", res)
    }).catch(err => {
      console.log("ERR", err)
    })
  }

  const printSaleSummaryReport = async (
    reportData: CollectionReport[],
    fromDate: string,
    toDate: string,
  ) => {

    // ["MODE", "RCPTs", "NET", "CNCL"],
    let text =
      `[C]SALE SUMMARY\n` +
      `[C]PRINT AT: ${new Date().toLocaleString("en-GB")}\n` +
      `[C]=============================\n` +
      `[L]FROM: ${new Date(fromDate)?.toLocaleDateString("en-GB")}[R]TO: ${new Date(toDate)?.toLocaleDateString("en-GB")}\n` +
      `[C]=============================\n` +
      // `[L]RCPT. DATE[R]${new Date().toLocaleDateString("en-GB")}\n` +
      `[L]Mode[C]Receipt[R]Net\n` +
      `[L]Due[R]Recovery\n` +
      `[C]=============================\n`;

    let totCashReceive = 0;
    let totCashReceipts = 0;
    let totDueAmt = 0;
    for (const item of reportData) {
      totCashReceive += item?.net_amt
      // totCashReceipts += item?.no_of_rcpt
      totDueAmt += item?.due_amt

      text += `[L]${item?.pay_mode === "C" ? "Cash" : item?.pay_mode === "U" ? "UPI" : item?.pay_mode === "R" ? "Credit" : item?.pay_mode === "Z" ? "Recovery" : "Err"}[C]${item?.pay_mode === "Z" ? "---" : item?.no_of_rcpt}[R]${item?.net_amt}\n` +
        `[L]${item?.due_amt}[R]${item?.recover_amt}\n` +
        `-------------------------------\n`;
    }

    text += `[C]=============================\n` +
      `[L]Rows Count[R]${reportData?.length}\n` +
      `[L]Total Net[R]${totCashReceive}\n` +
      `[L]Total Due[R]${totDueAmt}\n` +
      `[C]==============X===============\n\n\n` +
      `[C]                                \n\n`;

    await ThermalPrinterModule.printBluetooth({
      payload: text,
      printerNbrCharactersPerLine: 32,
      printerDpi: 120,
      printerWidthMM: 58,
      mmFeedPaper: 25,
    }).then(res => {
      console.log("RES", res)
    }).catch(err => {
      console.log("ERR", err)
    })
  }

  const printCancelledBillsReport = async (
    reportData: CancelledBillsReportData[],
    fromDate: string,
    toDate: string,
  ) => {
    // ["SL.", "QTY", "PRC", "DIS", "GST", "NET"],
    let text =
      `[C]CANCELLED REPORT\n` +
      `[C]PRINT AT: ${new Date().toLocaleString("en-GB")}\n` +
      `[C]=============================\n` +
      `[L]FROM: ${new Date(fromDate)?.toLocaleDateString("en-GB")}[R]TO: ${new Date(toDate)?.toLocaleDateString("en-GB")}\n` +
      `[C]=============================\n` +
      // `[L]RCPT. DATE[R]${new Date().toLocaleDateString("en-GB")}\n` +
      `[L]Sl.[C]Qty[C]Price[R]Net\n` +
      `[C]=============================\n`;

    let i = 1
    let totalNet = 0
    for (const item of reportData) {
      totalNet += item?.net_amt;

      text += `[L]${i++}[C]${item?.no_of_items}[C]${item?.price}[R]${item?.net_amt}\n` +
        `[C]-----------------------------\n`;
    }

    text += `[C]=============================\n` +
      `[L]Rows Count[R]${reportData?.length}\n` +
      `[L]Total Cancelled[R]${totalNet}\n` +
      `[C]==============X===============\n\n\n` +
      `[C]                                \n\n`;

    await ThermalPrinterModule.printBluetooth({
      payload: text,
      printerNbrCharactersPerLine: 32,
      printerDpi: 120,
      printerWidthMM: 58,
      mmFeedPaper: 25,
    }).then(res => {
      console.log("RES", res)
    }).catch(err => {
      console.log("ERR", err)
    })
  }

  const printCreditReport = async (
    reportData: CreditReportResponseData[],
    fromDate: string,
    toDate: string,
  ) => {
    // ["Rcpt No.", "Amount", "Paid Amt.", "Due Amt."],
    let text =
      `[C]CREDIT REPORT\n` +
      `[C]PRINT AT: ${new Date().toLocaleString("en-GB")}\n` +
      `[C]==============================\n` +
      `[L]FROM: ${new Date(fromDate)?.toLocaleDateString("en-GB")}[R]TO: ${new Date(toDate)?.toLocaleDateString("en-GB")}\n` +
      `[C]==============================\n` +
      // `[L]RCPT. DATE[R]${new Date().toLocaleDateString("en-GB")}\n` +
      `[L]RCPT[C]Amt[C]Paid[R]Due\n` +
      `[C]==============================\n`;

    let totalNet = 0;
    let totalPaid = 0;
    let totalDue = 0;
    for (const item of reportData) {

      totalNet += item?.net_amt;
      totalPaid += item?.paid_amt;
      totalDue += item?.due_amt;

      text += `[L]${item?.receipt_no?.toString()?.slice(-5)}[C]${item?.net_amt}[C]${item?.paid_amt}[R]${item?.due_amt}\n`;
    }


    text += `[C]==============================\n` +
      `[L]TOTAL:[C]${totalNet}[C]${totalPaid}[R]${totalDue}\n` +
      `[L]Rows Count[R]${reportData?.length}\n` +
      // `[L]Total Net[R]${totalNet}\n` +
      // `[L]Total Paid[R]${totalPaid}\n` +
      // `[L]Total Due[R]${totalDue}\n` +
      `[C]==============X===============\n\n\n` +
      `[C]                                \n\n`;

    await ThermalPrinterModule.printBluetooth({
      payload: text,
      printerNbrCharactersPerLine: 32,
      printerDpi: 120,
      printerWidthMM: 58,
      mmFeedPaper: 25,
    }).then(res => {
      console.log("RES", res)
    }).catch(err => {
      console.log("ERR", err)
    })
  }

  const printCustomerLedger = async (
    cusLed: CustomerLedgerData[]
  ) => {
    // ["R. DT", "PAID", "DUE", "BAL"],
    let text =
      `[C]CUSTOMER LEDGER\n` +
      `[C]PRINT AT: ${new Date().toLocaleString("en-GB")}\n` +
      `[C]==============================\n` +
      // `[L]FROM: ${new Date(fromDate)?.toLocaleDateString("en-GB")}[R]TO: ${new Date(toDate)?.toLocaleDateString("en-GB")}\n` +
      // `[C]=============================\n` +
      // `[L]RCPT. DATE[R]${new Date().toLocaleDateString("en-GB")}\n` +
      `[L]Rec Dt[C]Paid[C]Due[R]Bal\n` +
      `[C]==============================\n`;

    let totalPaid = 0;
    let totalDue = 0;
    let totalbalance = 0;

    for (const item of cusLed) {
      totalPaid += item?.paid_amt
      totalDue += item?.due_amt
      totalbalance += item?.balance

      text += `[L]${new Date(item?.recover_dt)?.toLocaleDateString("en-GB")}[C]${item?.paid_amt}[C]${item?.due_amt}[R]${item?.balance}\n`;
    }

    text += `[C]==============================\n` +
      `[L]TOTAL:[C]${totalPaid}[C]${totalDue}[R]${totalbalance}\n` +
      `[L]Rows Count[R]${cusLed?.length}\n` +
      `[C]==============X===============\n\n\n` +
      `[C]                                \n\n`;

    await ThermalPrinterModule.printBluetooth({
      payload: text,
      printerNbrCharactersPerLine: 32,
      printerDpi: 120,
      printerWidthMM: 58,
      mmFeedPaper: 25,
    }).then(res => {
      console.log("RES", res)
    }).catch(err => {
      console.log("ERR", err)
    })
  }

  const printUserwiseReport = async (
    reportData: UserwiseReportData[],
    fromDate: string,
    toDate: string,
  ) => {
    // ["USER", "RCPTs", "NET", "CNCL"],
    let text =
      `[C]USERWISE REPORT\n` +
      `[C]PRINT AT: ${new Date().toLocaleString("en-GB")}\n` +
      `[C]=============================\n` +
      `[L]FROM: ${new Date(fromDate)?.toLocaleDateString("en-GB")}[R]TO: ${new Date(toDate)?.toLocaleDateString("en-GB")}\n` +
      `[C]=============================\n` +
      // `[L]RCPT. DATE[R]${new Date().toLocaleDateString("en-GB")}\n` +
      `[L]User[C]Rcpts[C]Net[R]Cncl\n` +
      `[C]=============================\n`;

    let totalNet = 0;
    let totalCan = 0;

    for (const item of reportData) {
      // totalDue += item?.cancelled_amt

      text += `[L]${item?.user_name?.slice(0, 5)}[C]${item?.no_of_receipts}[C]${item?.net_amt}[R]${item?.cancelled_amt}\n`;
    }

    text += `[C]=============================\n` +
      `[L]Rows Count[R]${reportData?.length}\n` +
      // `[L]Total Due[R]${totalDue}\n` +
      `[C]==============X===============\n\n\n` +
      `[C]                                \n\n`;

    await ThermalPrinterModule.printBluetooth({
      payload: text,
      printerNbrCharactersPerLine: 32,
      printerDpi: 120,
      printerWidthMM: 58,
      mmFeedPaper: 25,
    }).then(res => {
      console.log("RES", res)
    }).catch(err => {
      console.log("ERR", err)
    })
  }

  const printDueReport = async (
    reportData: DueReportData[],
    date: string,
  ) => {
    // ["Sl.", "NAME", "PH", "DUE"],
    let text =
      `[C]DUE REPORT\n` +
      `[C]PRINT AT: ${new Date().toLocaleString("en-GB")}\n` +
      `[C]=============================\n` +
      `[C]DATE: ${new Date(date)?.toLocaleDateString("en-GB")}\n` +
      `[C]=============================\n` +
      // `[L]RCPT. DATE[R]${new Date().toLocaleDateString("en-GB")}\n` +
      `[L]Sl.[C]Name[C]Phone[R]Due\n` +
      `[C]=============================\n`;

    let i = 1
    for (const item of reportData) {
      text += `[L]${i++}[C]${item?.cust_name?.slice(0, 5)}[C]${item?.phone_no}[R]${item?.due_amt}\n`;
    }

    text += `[C]=============================\n` +
      `[L]Rows Count[R]${reportData?.length}\n` +
      `[C]==============X===============\n\n\n` +
      `[C]                                \n\n`;

    await ThermalPrinterModule.printBluetooth({
      payload: text,
      printerNbrCharactersPerLine: 32,
      printerDpi: 120,
      printerWidthMM: 58,
      mmFeedPaper: 25,
    }).then(res => {
      console.log("RES", res)
    }).catch(err => {
      console.log("ERR", err)
    })
  }

  const printRecoveryAmount = async (recAmt: RecoveryAmountResponseData[], phone: string) => {
    let text =
      `[C]RECOVERY DETAILS\n` +
      `[C]PRINT AT: ${new Date().toLocaleString("en-GB")}\n` +
      `[C]=============================\n` +

      `[L]PHONE:[R]${phone}\n` +
      `[L]TOTAL DUE[R]${recAmt[0]?.net_amt - recAmt[0]?.paid_amt}\n` +
      `[L]TOTAL PAID[R]${recAmt[0]?.paid_amt}\n` +
      `[C]==============X===============\n\n\n` +
      `[C]                                \n\n`;

    await ThermalPrinterModule.printBluetooth({
      payload: text,
      printerNbrCharactersPerLine: 32,
      printerDpi: 120,
      printerWidthMM: 58,
      mmFeedPaper: 25,
    }).then(res => {
      console.log("RES", res)
    }).catch(err => {
      console.log("ERR", err)
    })
  }

  // async function rePrintWithoutGst(
  //   addedProducts: ShowBillData[],
  //   netTotal: number,
  //   totalDiscountAmount: number,
  //   cashAmount?: number,
  //   returnedAmt?: number,
  //   customerName?: string,
  //   customerPhone?: string,
  //   rcptNo?: number,
  //   paymentMode?: string,
  //   isRefunded?: boolean,
  //   isRefundedDuplicate?: boolean,
  //   cancelFlag?: boolean
  // ) {
  //   const loginStore = JSON.parse(loginStorage.getString("login-data"))
  //   const fileStore = fileStorage.getString("file-data")

  //   const shopName: string = loginStore?.company_name?.toString()
  //   const address: string = loginStore?.address?.toString()
  //   const location: string = loginStore?.branch_name?.toString()
  //   const shopMobile: string = loginStore?.phone_no?.toString()
  //   const shopEmail: string = loginStore?.email_id?.toString()
  //   const cashier: string = loginStore?.user_name?.toString()

  //   let totalQuantities: number = 0
  //   let totalAmountAfterDiscount: number = 0

  //   try {
  //     let columnWidths = [11, 1, 18]
  //     let columnWidthsHeader = [8, 1, 21]
  //     let columnWidthsProductsHeaderAndBody = [8, 4, 6, 5, 7]
  //     let columnWidthsProductsHeaderAndBodyWithoutDiscount = [8, 6, 7, 8]
  //     // let columnWidthsProductsHeaderAndBody = [18, 3, 4, 3, 4]
  //     let columnWidthsItemTotal = [18, 12]
  //     let columnWidthIfNameIsBig = [32]

  //     // let newColumnWidths: number[] = [9, 9, 6, 7]

  //     if (fileStore?.length > 0) {
  //       await BluetoothEscposPrinter.printerAlign(
  //         BluetoothEscposPrinter.ALIGN.CENTER,
  //       )
  //       const options = {
  //         width: 250, // Assuming 58mm paper width with 8 dots/mm resolution (58mm * 8dots/mm = 384 dots)
  //         left: 50, // No left padding
  //         // align: "CENTER"
  //       }

  //       // Print the image
  //       await BluetoothEscposPrinter.printPic(fileStore, options)
  //     }

  //     await BluetoothEscposPrinter.printerAlign(
  //       BluetoothEscposPrinter.ALIGN.CENTER,
  //     )
  //     await BluetoothEscposPrinter.printText(shopName.toUpperCase(), {
  //       align: "center",
  //       widthtimes: 1.2,
  //       heigthtimes: 2,
  //     })
  //     await BluetoothEscposPrinter.printText("\n", {})
  //     // await BluetoothEscposPrinter.printText("hasifughaf", { align: "center" })

  //     if (receiptSettings?.on_off_flag1 === "Y") {
  //       await BluetoothEscposPrinter.printText(receiptSettings?.header1, {})
  //       await BluetoothEscposPrinter.printText("\n", {})
  //     }

  //     if (receiptSettings?.on_off_flag2 === "Y") {
  //       await BluetoothEscposPrinter.printText(receiptSettings?.header2, {})
  //     }
  //     await BluetoothEscposPrinter.printText("\n", {})

  //     if (!cancelFlag) {
  //       !isRefunded
  //         ? await BluetoothEscposPrinter.printText("DUPLICATE RECEIPT", {
  //           align: "center",
  //         })
  //         : !isRefundedDuplicate
  //           ? await BluetoothEscposPrinter.printText("REFUND RECEIPT", {
  //             align: "center",
  //           })
  //           : await BluetoothEscposPrinter.printText("DUPLICATE REFUND RECEIPT", {
  //             align: "center",
  //           })
  //     }

  //     cancelFlag
  //       && await BluetoothEscposPrinter.printText("CANCELLED BILL", {
  //         align: "center",
  //       })

  //     // await BluetoothEscposPrinter.printText("\n", {})

  //     // await BluetoothEscposPrinter.printText("------------------------", {
  //     //   align: "center",
  //     // })

  //     // await BluetoothEscposPrinter.printText("\n", {})
  //     // await BluetoothEscposPrinter.printText(address, {
  //     //   align: "center",
  //     // })
  //     // await BluetoothEscposPrinter.printText("\n", {})
  //     // await BluetoothEscposPrinter.printText(location, {
  //     //   align: "center",
  //     // })
  //     await BluetoothEscposPrinter.printText("\n", {})
  //     // await BluetoothEscposPrinter.printText("------------------------", {
  //     //   align: "center",
  //     // })
  //     // await BluetoothEscposPrinter.printText("\n", {})

  //     // // await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT)

  //     // await BluetoothEscposPrinter.printColumn(
  //     //   columnWidthsHeader,
  //     //   [
  //     //     BluetoothEscposPrinter.ALIGN.LEFT,
  //     //     BluetoothEscposPrinter.ALIGN.CENTER,
  //     //     BluetoothEscposPrinter.ALIGN.RIGHT,
  //     //   ],
  //     //   ["MOBILE", ":", shopMobile],
  //     //   {},
  //     // )
  //     // await BluetoothEscposPrinter.printColumn(
  //     //   columnWidthsHeader,
  //     //   [
  //     //     BluetoothEscposPrinter.ALIGN.LEFT,
  //     //     BluetoothEscposPrinter.ALIGN.CENTER,
  //     //     BluetoothEscposPrinter.ALIGN.RIGHT,
  //     //   ],
  //     //   ["EMAIL", ":", shopEmail],
  //     //   {},
  //     // )
  //     // await BluetoothEscposPrinter.printColumn(
  //     //     columnWidthsHeader,
  //     //     [
  //     //         BluetoothEscposPrinter.ALIGN.LEFT,
  //     //         BluetoothEscposPrinter.ALIGN.CENTER,
  //     //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //     //     ],
  //     //     ["SITE", ":", "SHOPNAME.COM"],
  //     //     {},
  //     // )

  //     await BluetoothEscposPrinter.printText("------------------------", {
  //       align: "center",
  //     })
  //     await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printColumn(
  //       columnWidthsHeader,
  //       [
  //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         BluetoothEscposPrinter.ALIGN.CENTER,
  //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //       ],
  //       ["RCPT.NO", ":", rcptNo?.toString()],
  //       {},
  //     )
  //     await BluetoothEscposPrinter.printColumn(
  //       columnWidthsHeader,
  //       [
  //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         BluetoothEscposPrinter.ALIGN.CENTER,
  //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //       ],
  //       ["DATE", ":", `${new Date().toLocaleString("en-GB")}`],
  //       {},
  //     )
  //     await BluetoothEscposPrinter.printColumn(
  //       columnWidthsHeader,
  //       [
  //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         BluetoothEscposPrinter.ALIGN.CENTER,
  //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //       ],
  //       ["CASHIER", ":", cashier],
  //       {},
  //     )

  //     await BluetoothEscposPrinter.printText("------------------------", {
  //       align: "center",
  //     })
  //     await BluetoothEscposPrinter.printText("\n", {})

  //     // if (customerName.length !== 0 || customerPhone.length !== 0) {
  //     // receiptSettings?.cust_inf === "Y" &&
  //     if (addedProducts[0]?.phone_no !== "0000000000") {
  //       await BluetoothEscposPrinter.printColumn(
  //         columnWidthsHeader,
  //         [
  //           BluetoothEscposPrinter.ALIGN.LEFT,
  //           BluetoothEscposPrinter.ALIGN.CENTER,
  //           BluetoothEscposPrinter.ALIGN.RIGHT,
  //         ],
  //         ["NAME", ":", customerName],
  //         {},
  //       )
  //       await BluetoothEscposPrinter.printColumn(
  //         columnWidthsHeader,
  //         [
  //           BluetoothEscposPrinter.ALIGN.LEFT,
  //           BluetoothEscposPrinter.ALIGN.CENTER,
  //           BluetoothEscposPrinter.ALIGN.RIGHT,
  //         ],
  //         ["PHONE", ":", customerPhone],
  //         {},
  //       )
  //     }

  //     // }

  //     await BluetoothEscposPrinter.printText("------------------------", {
  //       align: "center",
  //     })

  //     await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printerAlign(
  //       BluetoothEscposPrinter.ALIGN.CENTER,
  //     )

  //     addedProducts[0]?.discount_flag === "Y" &&
  //       addedProducts[0]?.discount_position !== "B"
  //       ? await BluetoothEscposPrinter.printColumn(
  //         columnWidthsProductsHeaderAndBody,
  //         [
  //           BluetoothEscposPrinter.ALIGN.LEFT,
  //           BluetoothEscposPrinter.ALIGN.LEFT,
  //           BluetoothEscposPrinter.ALIGN.CENTER,
  //           BluetoothEscposPrinter.ALIGN.RIGHT,
  //           BluetoothEscposPrinter.ALIGN.RIGHT,
  //         ],
  //         ["ITEM", "QTY", "PRICE", "DIS.", "AMT"],
  //         {},
  //       )
  //       : await BluetoothEscposPrinter.printColumn(
  //         columnWidthsProductsHeaderAndBodyWithoutDiscount,
  //         [
  //           BluetoothEscposPrinter.ALIGN.LEFT,
  //           BluetoothEscposPrinter.ALIGN.LEFT,
  //           BluetoothEscposPrinter.ALIGN.RIGHT,
  //           BluetoothEscposPrinter.ALIGN.RIGHT,
  //         ],
  //         ["ITEM", "QTY", "PRICE", "AMT"],
  //         {},
  //       )

  //     await BluetoothEscposPrinter.printText("------------------------", {
  //       align: "center",
  //     })

  //     await BluetoothEscposPrinter.printText("\n", {})

  //     for (const item of addedProducts) {
  //       //@ts-ignore
  //       totalQuantities += parseInt(item?.qty)
  //       let discountType: "P" | "A" = addedProducts[0]?.discount_type
  //       let discountFlag: "Y" | "N" = addedProducts[0]?.discount_flag
  //       let discountPosition: "B" | "I" = addedProducts[0]?.discount_position

  //       // discountType === "P"
  //       //     ? totalAmountAfterDiscount += ((item?.price * item?.qty) - ((item?.price * item?.qty * item?.discount_amt) / 100))
  //       //     : totalAmountAfterDiscount += ((item?.price * item?.qty) - (item?.qty * item?.discount_amt))

  //       if (item?.item_name?.length >= 8) {
  //         await BluetoothEscposPrinter.printColumn(
  //           columnWidthIfNameIsBig,
  //           [BluetoothEscposPrinter.ALIGN.LEFT],
  //           [item?.item_name],
  //           {},
  //         )

  //         discountFlag === "Y" && discountPosition !== "B"
  //           ? discountType === "P"
  //             ? await BluetoothEscposPrinter.printColumn(
  //               columnWidthsProductsHeaderAndBody,
  //               [
  //                 BluetoothEscposPrinter.ALIGN.LEFT,
  //                 BluetoothEscposPrinter.ALIGN.LEFT,
  //                 BluetoothEscposPrinter.ALIGN.CENTER,
  //                 BluetoothEscposPrinter.ALIGN.RIGHT,
  //                 BluetoothEscposPrinter.ALIGN.RIGHT,
  //               ],
  //               //@ts-ignore
  //               [
  //                 "",
  //                 item?.qty.toString(),
  //                 item?.price.toString(),
  //                 calculatePercentDiscountPerProduct(
  //                   item?.price,
  //                   item?.qty,
  //                   item?.dis_pertg,
  //                 ),
  //                 calculateAmountAfterPercentDiscountPerProduct(
  //                   item?.price,
  //                   item?.qty,
  //                   item?.dis_pertg,
  //                 ),
  //               ],
  //               {},
  //             )
  //             : await BluetoothEscposPrinter.printColumn(
  //               columnWidthsProductsHeaderAndBody,
  //               [
  //                 BluetoothEscposPrinter.ALIGN.LEFT,
  //                 BluetoothEscposPrinter.ALIGN.LEFT,
  //                 BluetoothEscposPrinter.ALIGN.CENTER,
  //                 BluetoothEscposPrinter.ALIGN.RIGHT,
  //                 BluetoothEscposPrinter.ALIGN.RIGHT,
  //               ],
  //               [
  //                 "",
  //                 item?.qty.toString(),
  //                 item?.price.toString(),
  //                 calculateAmountDiscountPerProduct(
  //                   item?.qty,
  //                   item?.discount_amt,
  //                 ),
  //                 calculateAmountAfterAmountDiscountPerProduct(
  //                   item?.price,
  //                   item?.qty,
  //                   item?.discount_amt,
  //                 ),
  //               ],
  //               {},
  //             )
  //           : await BluetoothEscposPrinter.printColumn(
  //             columnWidthsProductsHeaderAndBodyWithoutDiscount,
  //             [
  //               BluetoothEscposPrinter.ALIGN.LEFT,
  //               BluetoothEscposPrinter.ALIGN.LEFT,
  //               BluetoothEscposPrinter.ALIGN.RIGHT,
  //               BluetoothEscposPrinter.ALIGN.RIGHT,
  //             ],
  //             [
  //               "",
  //               item?.qty.toString(),
  //               item?.price.toString(),
  //               calculateAmountAfterAmountDiscountPerProduct(
  //                 item?.price,
  //                 item?.qty,
  //                 0,
  //               ),
  //             ],
  //             {},
  //           )
  //         // : await BluetoothEscposPrinter.printColumn(
  //         //     columnWidthsProductsHeaderAndBody,
  //         //     [
  //         //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         //         BluetoothEscposPrinter.ALIGN.CENTER,
  //         //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //         //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //         //     ],
  //         //     ["", item?.qty.toString(), item?.price.toString(), calculateAmountDiscountPerProduct(item?.qty, 0), calculateAmountAfterAmountDiscountPerProduct(item?.price, item?.qty, 0)],
  //         //     {},
  //         // )

  //         // await BluetoothEscposPrinter.printColumn(
  //         //     columnWidthsProductsHeaderAndBody,
  //         //     [
  //         //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         //         BluetoothEscposPrinter.ALIGN.CENTER,
  //         //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //         //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //         //     ],
  //         //     ["", item?.qty.toString(), item?.price.toString(), (((item?.price * item?.qty * item?.discount_amt) / 100).toFixed(2)).toString(), `${((item?.price * item?.qty) - ((item?.price * item?.qty * item?.discount_amt) / 100)).toFixed(2).toString()}`],
  //         //     {},
  //         // )
  //       } else {
  //         discountFlag === "Y" && discountPosition !== "B"
  //           ? discountType === "P"
  //             ? await BluetoothEscposPrinter.printColumn(
  //               columnWidthsProductsHeaderAndBody,
  //               [
  //                 BluetoothEscposPrinter.ALIGN.LEFT,
  //                 BluetoothEscposPrinter.ALIGN.LEFT,
  //                 BluetoothEscposPrinter.ALIGN.CENTER,
  //                 BluetoothEscposPrinter.ALIGN.RIGHT,
  //                 BluetoothEscposPrinter.ALIGN.RIGHT,
  //               ],
  //               //@ts-ignore
  //               [
  //                 item?.item_name,
  //                 item?.qty.toString(),
  //                 item?.price.toString(),
  //                 calculatePercentDiscountPerProduct(
  //                   item?.price,
  //                   item?.qty,
  //                   item?.dis_pertg,
  //                 ),
  //                 calculateAmountAfterPercentDiscountPerProduct(
  //                   item?.price,
  //                   item?.qty,
  //                   item?.dis_pertg,
  //                 ),
  //               ],
  //               {},
  //             )
  //             : await BluetoothEscposPrinter.printColumn(
  //               columnWidthsProductsHeaderAndBody,
  //               [
  //                 BluetoothEscposPrinter.ALIGN.LEFT,
  //                 BluetoothEscposPrinter.ALIGN.LEFT,
  //                 BluetoothEscposPrinter.ALIGN.CENTER,
  //                 BluetoothEscposPrinter.ALIGN.RIGHT,
  //                 BluetoothEscposPrinter.ALIGN.RIGHT,
  //               ],
  //               //@ts-ignore
  //               [
  //                 item?.item_name,
  //                 item?.qty.toString(),
  //                 item?.price.toString(),
  //                 calculateAmountDiscountPerProduct(
  //                   item?.qty,
  //                   item?.discount_amt,
  //                 ),
  //                 calculateAmountAfterAmountDiscountPerProduct(
  //                   item?.price,
  //                   item?.qty,
  //                   item?.discount_amt,
  //                 ),
  //               ],
  //               {},
  //             )
  //           : await BluetoothEscposPrinter.printColumn(
  //             columnWidthsProductsHeaderAndBodyWithoutDiscount,
  //             [
  //               BluetoothEscposPrinter.ALIGN.LEFT,
  //               BluetoothEscposPrinter.ALIGN.LEFT,
  //               BluetoothEscposPrinter.ALIGN.RIGHT,
  //               BluetoothEscposPrinter.ALIGN.RIGHT,
  //             ],
  //             //@ts-ignore
  //             [
  //               item?.item_name,
  //               item?.qty.toString(),
  //               item?.price.toString(),
  //               calculateAmountAfterAmountDiscountPerProduct(
  //                 item?.price,
  //                 item?.qty,
  //                 0,
  //               ),
  //             ],
  //             {},
  //           )
  //         // : await BluetoothEscposPrinter.printColumn(
  //         //     columnWidthsProductsHeaderAndBody,
  //         //     [
  //         //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         //         BluetoothEscposPrinter.ALIGN.CENTER,
  //         //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //         //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //         //     ],
  //         //     //@ts-ignore
  //         //     [item?.item_name, item?.qty.toString(), item?.price.toString(), calculateAmountDiscountPerProduct(item?.qty, 0), calculateAmountAfterAmountDiscountPerProduct(item?.price, item?.qty, 0)],
  //         //     {},
  //         // )

  //         // await BluetoothEscposPrinter.printColumn(
  //         //     columnWidthsProductsHeaderAndBody,
  //         //     [
  //         //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         //         BluetoothEscposPrinter.ALIGN.CENTER,
  //         //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //         //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //         //     ],
  //         //     [item?.item_name, item?.qty.toString(), item?.price.toString(), (((item?.price * item?.qty * item?.discount_amt) / 100).toFixed(2)).toString(), `${(item?.price * item?.qty).toString()}`],
  //         //     {},
  //         // )
  //         // await BluetoothEscposPrinter.printText("\n", {})
  //       }
  //     }

  //     // await BluetoothEscposPrinter.printText("\n", {})
  //     await BluetoothEscposPrinter.printText("------------------------", {
  //       align: "center",
  //     })

  //     await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printColumn(
  //       columnWidthsItemTotal,
  //       [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
  //       [
  //         `ITEM: ${addedProducts?.length?.toString()} QTY: ${totalQuantities.toString()}`,
  //         `AMT: ${netTotal?.toFixed(2)}`,
  //       ],
  //       {},
  //     )
  //     // await BluetoothEscposPrinter.printText("\n", {})

  //     addedProducts[0]?.discount_flag === "Y" &&
  //       (await BluetoothEscposPrinter.printColumn(
  //         columnWidths,
  //         [
  //           BluetoothEscposPrinter.ALIGN.LEFT,
  //           BluetoothEscposPrinter.ALIGN.CENTER,
  //           BluetoothEscposPrinter.ALIGN.RIGHT,
  //         ],
  //         //@ts-ignore
  //         ["DISCOUNT", ":", parseFloat(totalDiscountAmount).toFixed(2)],
  //         {},
  //       ))
  //     await BluetoothEscposPrinter.printColumn(
  //       columnWidths,
  //       [
  //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         BluetoothEscposPrinter.ALIGN.CENTER,
  //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //       ],
  //       // ["TOTAL", ":", `${(netTotal - totalDiscountAmount).toFixed(2)}`],
  //       ["TOTAL", ":", `${netTotalCalculate(netTotal, totalDiscountAmount)}`],
  //       {},
  //     )
  //     await BluetoothEscposPrinter.printColumn(
  //       columnWidths,
  //       [
  //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         BluetoothEscposPrinter.ALIGN.CENTER,
  //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //       ],
  //       // ["ROUND OFF", ":", `${(Math.round(parseFloat((netTotal - totalDiscountAmount).toFixed(2))) - parseFloat((netTotal - totalDiscountAmount).toFixed(2))).toFixed(2)}`],
  //       [
  //         "ROUND OFF",
  //         ":",
  //         `${roundingOffCalculate(netTotal, totalDiscountAmount)}`,
  //       ],
  //       {},
  //     )
  //     await BluetoothEscposPrinter.printColumn(
  //       columnWidths,
  //       [
  //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         BluetoothEscposPrinter.ALIGN.CENTER,
  //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //       ],
  //       // ["NET AMT", ":", `${Math.round(parseFloat((netTotal - totalDiscountAmount).toFixed(2)))}`],
  //       [
  //         "NET AMT",
  //         ":",
  //         `${grandTotalCalculate(netTotal, totalDiscountAmount)}`,
  //       ],
  //       {},
  //     )

  //     // await BluetoothEscposPrinter.printText("\n", {})
  //     await BluetoothEscposPrinter.printText("------------------------", {
  //       align: "center",
  //     })
  //     await BluetoothEscposPrinter.printText("\n", {})

  //     if (!cancelFlag) {
  //       if (addedProducts[0]?.rcv_cash_flag === "Y") {
  //         if (!isRefunded && paymentMode === "C") {
  //           await BluetoothEscposPrinter.printText("PAYMENT MODE", {
  //             align: "center",
  //           })
  //           await BluetoothEscposPrinter.printText("\n", {})
  //           await BluetoothEscposPrinter.printText(
  //             `CASH RECEIVED:       ${cashAmount}`,
  //             { align: "center" },
  //           )
  //           await BluetoothEscposPrinter.printText("\n", {})
  //           await BluetoothEscposPrinter.printText(
  //             `RETURNED AMT:        ${returnedAmt}`,
  //             { align: "center" },
  //           )

  //           await BluetoothEscposPrinter.printText("\n", {})
  //           await BluetoothEscposPrinter.printText("------------------------", {
  //             align: "center",
  //           })
  //           await BluetoothEscposPrinter.printText("\n", {})
  //         }
  //       } else {
  //         // await BluetoothEscposPrinter.printText("\n", {})
  //         await BluetoothEscposPrinter.printText(
  //           `TOTAL AMT:        ${Math.abs(returnedAmt)}`,
  //           { align: "center" },
  //         )

  //         await BluetoothEscposPrinter.printText("\n", {})
  //         await BluetoothEscposPrinter.printText("------------------------", {
  //           align: "center",
  //         })
  //         await BluetoothEscposPrinter.printText("\n", {})
  //       }
  //     }

  //     if (!cancelFlag) {
  //       // await BluetoothEscposPrinter.printText("\n", {})
  //       if (paymentMode === "U") {
  //         await BluetoothEscposPrinter.printText(
  //           `RECEIVED:       ${grandTotalCalculate(
  //             netTotal,
  //             totalDiscountAmount,
  //           )} [UPI]`,
  //           { align: "center" },
  //         )
  //         await BluetoothEscposPrinter.printText("\n", {})
  //         await BluetoothEscposPrinter.printText("------------------------", {
  //           align: "center",
  //         })
  //         await BluetoothEscposPrinter.printText("\n", {})
  //       }
  //       if (paymentMode === "D") {
  //         await BluetoothEscposPrinter.printText(
  //           `RECEIVED:       ${grandTotalCalculate(
  //             netTotal,
  //             totalDiscountAmount,
  //           )} [CARD]`,
  //           { align: "center" },
  //         )
  //         await BluetoothEscposPrinter.printText("\n", {})
  //         await BluetoothEscposPrinter.printText("------------------------", {
  //           align: "center",
  //         })
  //         await BluetoothEscposPrinter.printText("\n", {})
  //       }
  //       if (paymentMode === "R") {
  //         await BluetoothEscposPrinter.printText("PAYMENT MODE", {
  //           align: "center",
  //         })
  //         await BluetoothEscposPrinter.printText("\n", {})
  //         await BluetoothEscposPrinter.printText(
  //           `CASH RECEIVED:       ${cashAmount}`,
  //           { align: "center" },
  //         )
  //         await BluetoothEscposPrinter.printText("\n", {})
  //         await BluetoothEscposPrinter.printText(
  //           `DUE AMT:        ${Math.abs(returnedAmt)}`,
  //           { align: "center" },
  //         )

  //         await BluetoothEscposPrinter.printText("\n", {})
  //         await BluetoothEscposPrinter.printText("------------------------", {
  //           align: "center",
  //         })
  //         await BluetoothEscposPrinter.printText("\n", {})
  //       }
  //     }

  //     if (isRefunded)
  //       await BluetoothEscposPrinter.printText(
  //         `REFUNDED AMT:    ${grandTotalCalculate(
  //           netTotal,
  //           totalDiscountAmount,
  //         )}`,
  //         { align: "center" },
  //       )

  //     if (receiptSettings?.on_off_flag3 === "Y") {
  //       // await BluetoothEscposPrinter.printText("\n", {})
  //       await BluetoothEscposPrinter.printText(receiptSettings?.footer1, {})
  //       await BluetoothEscposPrinter.printText("\n", {})
  //     }
  //     if (receiptSettings?.on_off_flag4 === "Y") {
  //       await BluetoothEscposPrinter.printText(receiptSettings?.footer2, {})
  //       await BluetoothEscposPrinter.printText("\n", {})
  //     }

  //     // await BluetoothEscposPrinter.printText(
  //     //     "THANK YOU, VISIT AGAIN!",
  //     //     { align: "center" },
  //     // )
  //     // await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printText("------X------", {})
  //     await BluetoothEscposPrinter.printText("\n\r\n\r\n\r", {})
  //   } catch (e) {
  //     console.log(e.message || "ERROR")
  //   }
  // }

  // async function rePrint(
  //   addedProducts: ShowBillData[],
  //   netTotal: number,
  //   totalDiscountAmount: number,
  //   cashAmount?: number,
  //   returnedAmt?: number,
  //   customerName?: string,
  //   customerPhone?: string,
  //   rcptNo?: number,
  //   paymentMode?: string,
  //   isRefunded?: boolean,
  //   isRefundedDuplicate?: boolean,
  //   cancelFlag?: boolean
  // ) {
  //   console.log(
  //     "SSSSSSSSSSSSSSSS==================SSSSSSSSSSSSSSSSSS CALLED rePrint",
  //   )

  //   const loginStore = JSON.parse(loginStorage.getString("login-data"))
  //   const fileStore = fileStorage.getString("file-data")

  //   const shopName: string = loginStore?.company_name?.toString()
  //   const address: string = loginStore?.address?.toString()
  //   const location: string = loginStore?.branch_name?.toString()
  //   const shopMobile: string = loginStore?.phone_no?.toString()
  //   const shopEmail: string = loginStore?.email_id?.toString()
  //   const cashier: string = loginStore?.user_name?.toString()

  //   // let { totalCGST_5, totalCGST_12, totalCGST_18, totalCGST_28, totalSGST_5, totalSGST_12, totalSGST_18, totalSGST_28, totalGST } = gstFilterationAndTotalForRePrint(addedProducts)

  //   let gstTotals = gstFilterationAndTotalForRePrint(
  //     addedProducts,
  //     addedProducts[0]?.gst_type,
  //   )
  //   let { totalGST } = gstTotals // Destructure totalGST for separate handling

  //   // Filter keys for CGST and SGST display
  //   const gstKeys = Object.keys(gstTotals).filter(
  //     key => key.includes("totalCGST") || key.includes("totalSGST"),
  //   )

  //   let totalQuantities: number = 0
  //   let totalAmountAfterDiscount: number = 0

  //   try {
  //     let columnWidths = [11, 1, 18]
  //     let columnWidthsHeader = [8, 1, 21]
  //     let columnWidthsProductsHeaderAndBody = [8, 4, 6, 5, 7]
  //     let columnWidthsProductsHeaderAndBodyWithoutDiscount = [8, 6, 7, 8]
  //     // let columnWidthsProductsHeaderAndBody = [18, 3, 4, 3, 4]
  //     let columnWidthsItemTotal = [18, 12]
  //     let columnWidthIfNameIsBig = [32]

  //     // let newColumnWidths: number[] = [9, 9, 6, 7]

  //     if (fileStore?.length > 0) {
  //       await BluetoothEscposPrinter.printerAlign(
  //         BluetoothEscposPrinter.ALIGN.CENTER,
  //       )
  //       const options = {
  //         width: 210, // Assuming 58mm paper width with 8 dots/mm resolution (58mm * 8dots/mm = 384 dots)
  //         left: 50, // No left padding
  //         // align: "CENTER"
  //       }

  //       // Print the image
  //       await BluetoothEscposPrinter.printPic(fileStore, options)
  //     }

  //     await BluetoothEscposPrinter.printerAlign(
  //       BluetoothEscposPrinter.ALIGN.CENTER,
  //     )
  //     await BluetoothEscposPrinter.printText(shopName.toUpperCase(), {
  //       align: "center",
  //       widthtimes: 1.2,
  //       heigthtimes: 2,
  //     })
  //     await BluetoothEscposPrinter.printText("\n", {})
  //     // await BluetoothEscposPrinter.printText("hasifughaf", { align: "center" })

  //     if (receiptSettings?.on_off_flag1 === "Y") {
  //       await BluetoothEscposPrinter.printText(receiptSettings?.header1, {})
  //       await BluetoothEscposPrinter.printText("\n", {})
  //     }

  //     if (receiptSettings?.on_off_flag2 === "Y") {
  //       await BluetoothEscposPrinter.printText(receiptSettings?.header2, {})
  //     }
  //     await BluetoothEscposPrinter.printText("\n", {})

  //     if (!cancelFlag) {
  //       !isRefunded
  //         ? await BluetoothEscposPrinter.printText("DUPLICATE RECEIPT", {
  //           align: "center",
  //         })
  //         : !isRefundedDuplicate
  //           ? await BluetoothEscposPrinter.printText("REFUND RECEIPT", {
  //             align: "center",
  //           })
  //           : await BluetoothEscposPrinter.printText("DUPLICATE REFUND RECEIPT", {
  //             align: "center",
  //           })
  //     }

  //     cancelFlag
  //       && await BluetoothEscposPrinter.printText("CANCELLED BILL", {
  //         align: "center",
  //       })

  //     // await BluetoothEscposPrinter.printText("\n", {})

  //     // await BluetoothEscposPrinter.printText("------------------------", {
  //     //   align: "center",
  //     // })

  //     // await BluetoothEscposPrinter.printText("\n", {})
  //     // await BluetoothEscposPrinter.printText(address, {
  //     //   align: "center",
  //     // })
  //     // await BluetoothEscposPrinter.printText("\n", {})
  //     // await BluetoothEscposPrinter.printText(location, {
  //     //   align: "center",
  //     // })
  //     await BluetoothEscposPrinter.printText("\n", {})
  //     // await BluetoothEscposPrinter.printText("------------------------", {
  //     //   align: "center",
  //     // })
  //     // await BluetoothEscposPrinter.printText("\n", {})

  //     // // await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT)

  //     // await BluetoothEscposPrinter.printColumn(
  //     //   columnWidthsHeader,
  //     //   [
  //     //     BluetoothEscposPrinter.ALIGN.LEFT,
  //     //     BluetoothEscposPrinter.ALIGN.CENTER,
  //     //     BluetoothEscposPrinter.ALIGN.RIGHT,
  //     //   ],
  //     //   ["MOBILE", ":", shopMobile],
  //     //   {},
  //     // )
  //     // await BluetoothEscposPrinter.printColumn(
  //     //   columnWidthsHeader,
  //     //   [
  //     //     BluetoothEscposPrinter.ALIGN.LEFT,
  //     //     BluetoothEscposPrinter.ALIGN.CENTER,
  //     //     BluetoothEscposPrinter.ALIGN.RIGHT,
  //     //   ],
  //     //   ["EMAIL", ":", shopEmail],
  //     //   {},
  //     // )
  //     // await BluetoothEscposPrinter.printColumn(
  //     //     columnWidthsHeader,
  //     //     [
  //     //         BluetoothEscposPrinter.ALIGN.LEFT,
  //     //         BluetoothEscposPrinter.ALIGN.CENTER,
  //     //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //     //     ],
  //     //     ["SITE", ":", "SHOPNAME.COM"],
  //     //     {},
  //     // )

  //     await BluetoothEscposPrinter.printText("------------------------", {
  //       align: "center",
  //     })
  //     await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printColumn(
  //       columnWidthsHeader,
  //       [
  //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         BluetoothEscposPrinter.ALIGN.CENTER,
  //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //       ],
  //       ["RCPT.NO", ":", rcptNo?.toString()],
  //       {},
  //     )
  //     await BluetoothEscposPrinter.printColumn(
  //       columnWidthsHeader,
  //       [
  //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         BluetoothEscposPrinter.ALIGN.CENTER,
  //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //       ],
  //       ["DATE", ":", `${new Date().toLocaleString("en-GB")}`],
  //       {},
  //     )
  //     await BluetoothEscposPrinter.printColumn(
  //       columnWidthsHeader,
  //       [
  //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         BluetoothEscposPrinter.ALIGN.CENTER,
  //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //       ],
  //       ["CASHIER", ":", cashier],
  //       {},
  //     )

  //     await BluetoothEscposPrinter.printText("------------------------", {
  //       align: "center",
  //     })
  //     await BluetoothEscposPrinter.printText("\n", {})

  //     if (customerName.length !== 0 || customerPhone.length !== 0) {
  //       receiptSettings?.cust_inf === "Y" &&
  //         (await BluetoothEscposPrinter.printColumn(
  //           columnWidthsHeader,
  //           [
  //             BluetoothEscposPrinter.ALIGN.LEFT,
  //             BluetoothEscposPrinter.ALIGN.CENTER,
  //             BluetoothEscposPrinter.ALIGN.RIGHT,
  //           ],
  //           ["NAME", ":", customerName],
  //           {},
  //         ))
  //       await BluetoothEscposPrinter.printColumn(
  //         columnWidthsHeader,
  //         [
  //           BluetoothEscposPrinter.ALIGN.LEFT,
  //           BluetoothEscposPrinter.ALIGN.CENTER,
  //           BluetoothEscposPrinter.ALIGN.RIGHT,
  //         ],
  //         ["PHONE", ":", customerPhone],
  //         {},
  //       )
  //     }

  //     await BluetoothEscposPrinter.printText("------------------------", {
  //       align: "center",
  //     })

  //     await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printerAlign(
  //       BluetoothEscposPrinter.ALIGN.CENTER,
  //     )

  //     addedProducts[0]?.discount_flag === "Y" &&
  //       addedProducts[0]?.discount_position !== "B"
  //       ? await BluetoothEscposPrinter.printColumn(
  //         columnWidthsProductsHeaderAndBody,
  //         [
  //           BluetoothEscposPrinter.ALIGN.LEFT,
  //           BluetoothEscposPrinter.ALIGN.LEFT,
  //           BluetoothEscposPrinter.ALIGN.CENTER,
  //           BluetoothEscposPrinter.ALIGN.RIGHT,
  //           BluetoothEscposPrinter.ALIGN.RIGHT,
  //         ],
  //         ["ITEM", "QTY", "PRICE", "DIS.", "AMT"],
  //         {},
  //       )
  //       : await BluetoothEscposPrinter.printColumn(
  //         columnWidthsProductsHeaderAndBodyWithoutDiscount,
  //         [
  //           BluetoothEscposPrinter.ALIGN.LEFT,
  //           BluetoothEscposPrinter.ALIGN.LEFT,
  //           BluetoothEscposPrinter.ALIGN.RIGHT,
  //           BluetoothEscposPrinter.ALIGN.RIGHT,
  //         ],
  //         ["ITEM", "QTY", "PRICE", "AMT"],
  //         {},
  //       )

  //     await BluetoothEscposPrinter.printText("------------------------", {
  //       align: "center",
  //     })

  //     await BluetoothEscposPrinter.printText("\n", {})

  //     for (const item of addedProducts) {
  //       //@ts-ignore
  //       totalQuantities += parseInt(item?.qty)
  //       let discountType: "P" | "A" = addedProducts[0]?.discount_type
  //       let discountFlag: "N" | "Y" = addedProducts[0]?.discount_flag
  //       let discountPosition: "B" | "I" = addedProducts[0]?.discount_position

  //       // discountType === "P"
  //       //     ? totalAmountAfterDiscount += ((item?.price * item?.qty) - ((item?.price * item?.qty * item?.dis_pertg) / 100))
  //       //     : totalAmountAfterDiscount += ((item?.price * item?.qty) - (item?.qty * item?.discount_amt))

  //       if (item?.item_name?.length >= 8) {
  //         await BluetoothEscposPrinter.printColumn(
  //           columnWidthIfNameIsBig,
  //           [BluetoothEscposPrinter.ALIGN.LEFT],
  //           [item?.item_name],
  //           {},
  //         )

  //         discountFlag === "Y" && discountPosition !== "B"
  //           ? discountType === "P"
  //             ? await BluetoothEscposPrinter.printColumn(
  //               columnWidthsProductsHeaderAndBody,
  //               [
  //                 BluetoothEscposPrinter.ALIGN.LEFT,
  //                 BluetoothEscposPrinter.ALIGN.LEFT,
  //                 BluetoothEscposPrinter.ALIGN.CENTER,
  //                 BluetoothEscposPrinter.ALIGN.RIGHT,
  //                 BluetoothEscposPrinter.ALIGN.RIGHT,
  //               ],
  //               //@ts-ignore
  //               [
  //                 "",
  //                 item?.qty.toString(),
  //                 item?.price.toString(),
  //                 calculatePercentDiscountPerProduct(
  //                   item?.price,
  //                   item?.qty,
  //                   item?.dis_pertg,
  //                 ),
  //                 calculateAmountAfterPercentDiscountPerProduct(
  //                   item?.price,
  //                   item?.qty,
  //                   item?.dis_pertg,
  //                 ),
  //               ],
  //               {},
  //             )
  //             : await BluetoothEscposPrinter.printColumn(
  //               columnWidthsProductsHeaderAndBody,
  //               [
  //                 BluetoothEscposPrinter.ALIGN.LEFT,
  //                 BluetoothEscposPrinter.ALIGN.LEFT,
  //                 BluetoothEscposPrinter.ALIGN.CENTER,
  //                 BluetoothEscposPrinter.ALIGN.RIGHT,
  //                 BluetoothEscposPrinter.ALIGN.RIGHT,
  //               ],
  //               //@ts-ignore
  //               [
  //                 "",
  //                 item?.qty.toString(),
  //                 item?.price.toString(),
  //                 calculateAmountDiscountPerProduct(
  //                   item?.qty,
  //                   item?.discount_amt,
  //                 ),
  //                 calculateAmountAfterAmountDiscountPerProduct(
  //                   item?.price,
  //                   item?.qty,
  //                   item?.discount_amt,
  //                 ),
  //               ],
  //               {},
  //             )
  //           : await BluetoothEscposPrinter.printColumn(
  //             columnWidthsProductsHeaderAndBodyWithoutDiscount,
  //             [
  //               BluetoothEscposPrinter.ALIGN.LEFT,
  //               BluetoothEscposPrinter.ALIGN.LEFT,
  //               BluetoothEscposPrinter.ALIGN.RIGHT,
  //               BluetoothEscposPrinter.ALIGN.RIGHT,
  //             ],
  //             //@ts-ignore
  //             [
  //               "",
  //               item?.qty.toString(),
  //               item?.price.toString(),
  //               calculateAmountAfterAmountDiscountPerProduct(
  //                 item?.price,
  //                 item?.qty,
  //                 0,
  //               ),
  //             ],
  //             {},
  //           )
  //         // : await BluetoothEscposPrinter.printColumn(
  //         //     columnWidthsProductsHeaderAndBody,
  //         //     [
  //         //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         //         BluetoothEscposPrinter.ALIGN.CENTER,
  //         //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //         //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //         //     ],
  //         //     //@ts-ignore
  //         //     ["", item?.qty.toString(), item?.price.toString(), calculateAmountDiscountPerProduct(item?.qty, 0), calculateAmountAfterAmountDiscountPerProduct(item?.price, item?.qty, 0)],
  //         //     {},
  //         // )

  //         // await BluetoothEscposPrinter.printColumn(
  //         //     columnWidthsProductsHeaderAndBody,
  //         //     [
  //         //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         //         BluetoothEscposPrinter.ALIGN.CENTER,
  //         //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //         //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //         //     ],
  //         //     ["", item?.qty.toString(), item?.price.toString(), (((item?.price * item?.qty * item?.dis_pertg) / 100).toFixed(2)).toString(), `${((item?.price * item?.qty) - ((item?.price * item?.qty * item?.dis_pertg) / 100)).toFixed(2).toString()}`],
  //         //     {},
  //         // )
  //       } else {
  //         discountFlag === "Y" && discountPosition !== "B"
  //           ? discountType === "P"
  //             ? await BluetoothEscposPrinter.printColumn(
  //               columnWidthsProductsHeaderAndBody,
  //               [
  //                 BluetoothEscposPrinter.ALIGN.LEFT,
  //                 BluetoothEscposPrinter.ALIGN.LEFT,
  //                 BluetoothEscposPrinter.ALIGN.CENTER,
  //                 BluetoothEscposPrinter.ALIGN.RIGHT,
  //                 BluetoothEscposPrinter.ALIGN.RIGHT,
  //               ],
  //               //@ts-ignore
  //               [
  //                 item?.item_name,
  //                 item?.qty.toString(),
  //                 item?.price.toString(),
  //                 calculatePercentDiscountPerProduct(
  //                   item?.price,
  //                   item?.qty,
  //                   item?.dis_pertg,
  //                 ),
  //                 calculateAmountAfterPercentDiscountPerProduct(
  //                   item?.price,
  //                   item?.qty,
  //                   item?.dis_pertg,
  //                 ),
  //               ],
  //               {},
  //             )
  //             : await BluetoothEscposPrinter.printColumn(
  //               columnWidthsProductsHeaderAndBody,
  //               [
  //                 BluetoothEscposPrinter.ALIGN.LEFT,
  //                 BluetoothEscposPrinter.ALIGN.LEFT,
  //                 BluetoothEscposPrinter.ALIGN.CENTER,
  //                 BluetoothEscposPrinter.ALIGN.RIGHT,
  //                 BluetoothEscposPrinter.ALIGN.RIGHT,
  //               ],
  //               //@ts-ignore
  //               [
  //                 item?.item_name,
  //                 item?.qty.toString(),
  //                 item?.price.toString(),
  //                 calculateAmountDiscountPerProduct(
  //                   item?.qty,
  //                   item?.discount_amt,
  //                 ),
  //                 calculateAmountAfterAmountDiscountPerProduct(
  //                   item?.price,
  //                   item?.qty,
  //                   item?.discount_amt,
  //                 ),
  //               ],
  //               {},
  //             )
  //           : await BluetoothEscposPrinter.printColumn(
  //             columnWidthsProductsHeaderAndBodyWithoutDiscount,
  //             [
  //               BluetoothEscposPrinter.ALIGN.LEFT,
  //               BluetoothEscposPrinter.ALIGN.LEFT,
  //               BluetoothEscposPrinter.ALIGN.RIGHT,
  //               BluetoothEscposPrinter.ALIGN.RIGHT,
  //             ],
  //             //@ts-ignore
  //             [
  //               item?.item_name,
  //               item?.qty.toString(),
  //               item?.price.toString(),
  //               calculateAmountAfterAmountDiscountPerProduct(
  //                 item?.price,
  //                 item?.qty,
  //                 0,
  //               ),
  //             ],
  //             {},
  //           )
  //         // : await BluetoothEscposPrinter.printColumn(
  //         //     columnWidthsProductsHeaderAndBody,
  //         //     [
  //         //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         //         BluetoothEscposPrinter.ALIGN.CENTER,
  //         //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //         //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //         //     ],
  //         //     //@ts-ignore
  //         //     [item?.item_name, item?.qty.toString(), item?.price.toString(), calculateAmountDiscountPerProduct(item?.qty, 0), calculateAmountAfterAmountDiscountPerProduct(item?.price, item?.qty, 0)],
  //         //     {},
  //         // )

  //         // await BluetoothEscposPrinter.printColumn(
  //         //     columnWidthsProductsHeaderAndBody,
  //         //     [
  //         //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         //         BluetoothEscposPrinter.ALIGN.CENTER,
  //         //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //         //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //         //     ],
  //         //     [item?.item_name, item?.qty.toString(), item?.price.toString(), (((item?.price * item?.qty * item?.dis_pertg) / 100).toFixed(2)).toString(), `${(item?.price * item?.qty).toString()}`],
  //         //     {},
  //         // )
  //         // await BluetoothEscposPrinter.printText("\n", {})
  //       }
  //     }

  //     // await BluetoothEscposPrinter.printText("\n", {})
  //     await BluetoothEscposPrinter.printText("------------------------", {
  //       align: "center",
  //     })

  //     await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printColumn(
  //       columnWidthsItemTotal,
  //       [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
  //       [
  //         `ITEM: ${addedProducts?.length?.toString()} QTY: ${totalQuantities.toString()}`,
  //         `AMT: ${netTotal?.toFixed(2)}`,
  //       ],
  //       {},
  //     )
  //     // await BluetoothEscposPrinter.printText("\n", {})

  //     // addedProducts[0]?.gst_type === "E"
  //     //     ? await BluetoothEscposPrinter.printColumn(
  //     //         columnWidths,
  //     //         [
  //     //             BluetoothEscposPrinter.ALIGN.LEFT,
  //     //             BluetoothEscposPrinter.ALIGN.CENTER,
  //     //             BluetoothEscposPrinter.ALIGN.RIGHT,
  //     //         ],
  //     //         // ["TOTAL", ":", `${(netTotal - totalDiscountAmount + totalGST).toFixed(2)}`],
  //     //         ["TOTAL", ":", `${netTotalWithGSTCalculate(netTotal, totalDiscountAmount, totalGST)}`],
  //     //         {},
  //     //     )
  //     //     : await BluetoothEscposPrinter.printColumn(
  //     //         columnWidths,
  //     //         [
  //     //             BluetoothEscposPrinter.ALIGN.LEFT,
  //     //             BluetoothEscposPrinter.ALIGN.CENTER,
  //     //             BluetoothEscposPrinter.ALIGN.RIGHT,
  //     //         ],
  //     //         // ["TOTAL", ":", `${(netTotal - totalDiscountAmount + totalGST).toFixed(2)}`],
  //     //         ["TOTAL", ":", `${totalAmountWithGSTInclCalculate(netTotal, totalGST)}`],
  //     //         {},
  //     //     )

  //     // addedProducts[0]?.gst_type === "I" &&
  //     //     await BluetoothEscposPrinter.printColumn(
  //     //         columnWidths,
  //     //         [
  //     //             BluetoothEscposPrinter.ALIGN.LEFT,
  //     //             BluetoothEscposPrinter.ALIGN.CENTER,
  //     //             BluetoothEscposPrinter.ALIGN.RIGHT,
  //     //         ],
  //     //         // ["TOTAL", ":", `${(netTotal - totalDiscountAmount + totalGST).toFixed(2)}`],
  //     //         ["TOTAL (Excl GST)", ":", `${totalAmountWithGSTInclCalculate(netTotal, totalGST)}`],
  //     //         {},
  //     //     )

  //     addedProducts[0]?.gst_flag === "Y" &&
  //       gstKeys.map(
  //         async key =>
  //           await BluetoothEscposPrinter.printColumn(
  //             columnWidths,
  //             [
  //               BluetoothEscposPrinter.ALIGN.LEFT,
  //               BluetoothEscposPrinter.ALIGN.CENTER,
  //               BluetoothEscposPrinter.ALIGN.RIGHT,
  //             ],
  //             [
  //               `${key.includes("CGST") ? "CGST" : "SGST"} @${key
  //                 .replace(/total(CGST|SGST)_/, "")
  //                 .replace("_", ".")}%`,
  //               ":",
  //               gstTotals[key].toFixed(2).toString(),
  //             ],
  //             {},
  //           ),
  //       )

  //     addedProducts[0]?.gst_flag === "Y" &&
  //       (await BluetoothEscposPrinter.printColumn(
  //         columnWidths,
  //         [
  //           BluetoothEscposPrinter.ALIGN.LEFT,
  //           BluetoothEscposPrinter.ALIGN.CENTER,
  //           BluetoothEscposPrinter.ALIGN.RIGHT,
  //         ],
  //         ["TOTAL GST", ":", totalGST.toFixed(2).toString()],
  //         {},
  //       ))

  //     addedProducts[0]?.discount_flag === "Y" &&
  //       (await BluetoothEscposPrinter.printColumn(
  //         columnWidths,
  //         [
  //           BluetoothEscposPrinter.ALIGN.LEFT,
  //           BluetoothEscposPrinter.ALIGN.CENTER,
  //           BluetoothEscposPrinter.ALIGN.RIGHT,
  //         ],
  //         //@ts-ignore
  //         ["DISCOUNT", ":", parseFloat(totalDiscountAmount).toFixed(2)],
  //         {},
  //       ))

  //     addedProducts[0]?.gst_type === "E"
  //       ? await BluetoothEscposPrinter.printColumn(
  //         columnWidths,
  //         [
  //           BluetoothEscposPrinter.ALIGN.LEFT,
  //           BluetoothEscposPrinter.ALIGN.CENTER,
  //           BluetoothEscposPrinter.ALIGN.RIGHT,
  //         ],
  //         // ["TOTAL", ":", `${(netTotal - totalDiscountAmount + totalGST).toFixed(2)}`],
  //         [
  //           "TOTAL",
  //           ":",
  //           `${netTotalWithGSTCalculate(
  //             netTotal,
  //             totalDiscountAmount,
  //             totalGST,
  //           )}`,
  //         ],
  //         {},
  //       )
  //       : await BluetoothEscposPrinter.printColumn(
  //         columnWidths,
  //         [
  //           BluetoothEscposPrinter.ALIGN.LEFT,
  //           BluetoothEscposPrinter.ALIGN.CENTER,
  //           BluetoothEscposPrinter.ALIGN.RIGHT,
  //         ],
  //         // ["TOTAL", ":", `${(netTotal - totalDiscountAmount + totalGST).toFixed(2)}`],
  //         [
  //           "TOTAL",
  //           ":",
  //           `${netTotalWithGSTInclCalculate(netTotal, totalDiscountAmount)}`,
  //         ],
  //         {},
  //       )
  //     // : await BluetoothEscposPrinter.printColumn(
  //     //     columnWidths,
  //     //     [
  //     //         BluetoothEscposPrinter.ALIGN.LEFT,
  //     //         BluetoothEscposPrinter.ALIGN.CENTER,
  //     //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //     //     ],
  //     //     // ["TOTAL", ":", `${(netTotal - totalDiscountAmount + totalGST).toFixed(2)}`],
  //     //     ["TOTAL", ":", `${totalAmountWithGSTInclCalculate(netTotal, totalGST)}`],
  //     //     {},
  //     // )

  //     // addedProducts[0]?.gst_flag === "Y"
  //     //     && await BluetoothEscposPrinter.printColumn(
  //     //         columnWidths,
  //     //         [
  //     //             BluetoothEscposPrinter.ALIGN.LEFT,
  //     //             BluetoothEscposPrinter.ALIGN.CENTER,
  //     //             BluetoothEscposPrinter.ALIGN.RIGHT,
  //     //         ],
  //     //         ["TOTAL GST", ":", (totalGST).toFixed(2).toString()],
  //     //         {},
  //     //     )

  //     addedProducts[0]?.gst_type === "E"
  //       ? await BluetoothEscposPrinter.printColumn(
  //         columnWidths,
  //         [
  //           BluetoothEscposPrinter.ALIGN.LEFT,
  //           BluetoothEscposPrinter.ALIGN.CENTER,
  //           BluetoothEscposPrinter.ALIGN.RIGHT,
  //         ],
  //         // ["ROUND OFF", ":", `${(Math.round(parseFloat((netTotal - totalDiscountAmount + totalGST).toFixed(2))) - parseFloat((netTotal - totalDiscountAmount + totalGST).toFixed(2))).toFixed(2)}`],
  //         [
  //           "ROUND OFF",
  //           ":",
  //           `${roundingOffWithGSTCalculate(
  //             netTotal,
  //             totalDiscountAmount,
  //             totalGST,
  //           )}`,
  //         ],
  //         {},
  //       )
  //       : await BluetoothEscposPrinter.printColumn(
  //         columnWidths,
  //         [
  //           BluetoothEscposPrinter.ALIGN.LEFT,
  //           BluetoothEscposPrinter.ALIGN.CENTER,
  //           BluetoothEscposPrinter.ALIGN.RIGHT,
  //         ],
  //         // ["ROUND OFF", ":", `${(Math.round(parseFloat((netTotal - totalDiscountAmount + totalGST).toFixed(2))) - parseFloat((netTotal - totalDiscountAmount + totalGST).toFixed(2))).toFixed(2)}`],
  //         [
  //           "ROUND OFF",
  //           ":",
  //           `${roundingOffWithGSTInclCalculate(
  //             netTotal,
  //             totalDiscountAmount,
  //           )}`,
  //         ],
  //         {},
  //       )

  //     // await BluetoothEscposPrinter.printColumn(
  //     //     columnWidths,
  //     //     [
  //     //         BluetoothEscposPrinter.ALIGN.LEFT,
  //     //         BluetoothEscposPrinter.ALIGN.CENTER,
  //     //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //     //     ],
  //     //     // ["NET AMT", ":", `${Math.round(parseFloat((netTotal - totalDiscountAmount + totalGST).toFixed(2)))}`],
  //     //     ["NET AMT", ":", `${grandTotalWithGSTCalculate(netTotal, totalDiscountAmount, totalGST)}`],
  //     //     {},
  //     // )

  //     addedProducts[0]?.gst_type === "E"
  //       ? await BluetoothEscposPrinter.printColumn(
  //         columnWidths,
  //         [
  //           BluetoothEscposPrinter.ALIGN.LEFT,
  //           BluetoothEscposPrinter.ALIGN.CENTER,
  //           BluetoothEscposPrinter.ALIGN.RIGHT,
  //         ],
  //         // ["NET AMT", ":", `${Math.round(parseFloat((netTotal - totalDiscountAmount + totalGST).toFixed(2)))}`],
  //         [
  //           "NET AMT",
  //           ":",
  //           `${grandTotalWithGSTCalculate(
  //             netTotal,
  //             totalDiscountAmount,
  //             totalGST,
  //           )}`,
  //         ],
  //         {},
  //       )
  //       : await BluetoothEscposPrinter.printColumn(
  //         columnWidths,
  //         [
  //           BluetoothEscposPrinter.ALIGN.LEFT,
  //           BluetoothEscposPrinter.ALIGN.CENTER,
  //           BluetoothEscposPrinter.ALIGN.RIGHT,
  //         ],
  //         // ["NET AMT", ":", `${Math.round(parseFloat((netTotal - totalDiscountAmount + totalGST).toFixed(2)))}`],
  //         [
  //           "NET AMT",
  //           ":",
  //           `${grandTotalWithGSTInclCalculate(
  //             netTotal,
  //             totalDiscountAmount,
  //           )}`,
  //         ],
  //         {},
  //       )

  //     // await BluetoothEscposPrinter.printText("\n", {})
  //     await BluetoothEscposPrinter.printText("------------------------", {
  //       align: "center",
  //     })
  //     !cancelFlag && await BluetoothEscposPrinter.printText("\n", {})

  //     if (!cancelFlag) {
  //       if (addedProducts[0]?.rcv_cash_flag === "Y") {
  //         if (!isRefunded && paymentMode === "C") {
  //           await BluetoothEscposPrinter.printText("PAYMENT MODE", {
  //             align: "center",
  //           })
  //           await BluetoothEscposPrinter.printText("\n", {})
  //           await BluetoothEscposPrinter.printText(
  //             `CASH RECEIVED:       ${cashAmount}`,
  //             { align: "center" },
  //           )
  //           await BluetoothEscposPrinter.printText("\n", {})
  //           await BluetoothEscposPrinter.printText(
  //             `RETURNED AMT:        ${returnedAmt}`,
  //             { align: "center" },
  //           )

  //           await BluetoothEscposPrinter.printText("\n", {})
  //           await BluetoothEscposPrinter.printText("------------------------", {
  //             align: "center",
  //           })
  //         }
  //       } else {
  //         await BluetoothEscposPrinter.printText("\n", {})
  //         await BluetoothEscposPrinter.printText(
  //           `TOTAL AMT:        ${Math.abs(returnedAmt)}`,
  //           { align: "center" },
  //         )

  //         await BluetoothEscposPrinter.printText("\n", {})
  //         await BluetoothEscposPrinter.printText("------------------------", {
  //           align: "center",
  //         })
  //         await BluetoothEscposPrinter.printText("\n", {})
  //       }
  //     }


  //     if (!cancelFlag) {
  //       await BluetoothEscposPrinter.printText("\n", {})

  //       if (paymentMode === "R") {
  //         await BluetoothEscposPrinter.printText("PAYMENT MODE", {
  //           align: "center",
  //         })
  //         await BluetoothEscposPrinter.printText("\n", {})
  //         await BluetoothEscposPrinter.printText(
  //           `CASH RECEIVED:       ${cashAmount}`,
  //           { align: "center" },
  //         )
  //         await BluetoothEscposPrinter.printText("\n", {})
  //         await BluetoothEscposPrinter.printText(
  //           `DUE AMT:        ${Math.abs(returnedAmt)}`,
  //           { align: "center" },
  //         )

  //         await BluetoothEscposPrinter.printText("\n", {})
  //         await BluetoothEscposPrinter.printText("------------------------", {
  //           align: "center",
  //         })
  //         await BluetoothEscposPrinter.printText("\n", {})
  //       }

  //       if (paymentMode === "D") {
  //         await BluetoothEscposPrinter.printText(
  //           `RECEIVED:       ${grandTotalCalculate(
  //             netTotal,
  //             totalDiscountAmount,
  //           )} [CARD]`,
  //           { align: "center" },
  //         )
  //         await BluetoothEscposPrinter.printText("\n", {})
  //         await BluetoothEscposPrinter.printText("------------------------", {
  //           align: "center",
  //         })
  //         await BluetoothEscposPrinter.printText("\n", {})
  //       }

  //       if (paymentMode === "U") {
  //         receiptSettings?.gst_type === "E"
  //           ? await BluetoothEscposPrinter.printText(
  //             `RECEIVED:       ${grandTotalWithGSTCalculate(
  //               netTotal,
  //               totalDiscountAmount,
  //               totalGST,
  //             )} [UPI]`,
  //             { align: "center" },
  //           )
  //           : await BluetoothEscposPrinter.printText(
  //             `RECEIVED:       ${grandTotalWithGSTInclCalculate(
  //               netTotal,
  //               totalDiscountAmount,
  //             )} [UPI]`,
  //             { align: "center" },
  //           )
  //         await BluetoothEscposPrinter.printText("\n", {})
  //         await BluetoothEscposPrinter.printText("------------------------", {
  //           align: "center",
  //         })
  //       }
  //     }



  //     if (isRefunded)
  //       addedProducts[0]?.gst_type === "E"
  //         ? await BluetoothEscposPrinter.printText(
  //           `REFUNDED AMT:    ${grandTotalWithGSTCalculate(
  //             netTotal,
  //             totalDiscountAmount,
  //             totalGST,
  //           )}`,
  //           { align: "center" },
  //         )
  //         : await BluetoothEscposPrinter.printText(
  //           `REFUNDED AMT:    ${grandTotalWithGSTInclCalculate(
  //             netTotal,
  //             totalDiscountAmount,
  //           )}`,
  //           { align: "center" },
  //         )
  //     await BluetoothEscposPrinter.printText("\n", {})

  //     if (receiptSettings?.on_off_flag3 === "Y") {
  //       await BluetoothEscposPrinter.printText(receiptSettings?.footer1, {})
  //       await BluetoothEscposPrinter.printText("\n", {})
  //     }
  //     if (receiptSettings?.on_off_flag4 === "Y") {
  //       await BluetoothEscposPrinter.printText(receiptSettings?.footer2, {})
  //     }
  //     await BluetoothEscposPrinter.printText("\n", {})

  //     // await BluetoothEscposPrinter.printText(
  //     //     "THANK YOU, VISIT AGAIN!",
  //     //     { align: "center" },
  //     // )
  //     // await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printText("------X------", {})
  //     await BluetoothEscposPrinter.printText("\n\r\n\r\n\r", {})
  //   } catch (e) {
  //     console.log(e.message || "ERROR")
  //   }
  // }

  // async function printSaleReport(
  //   saleReport: SaleReport[],
  //   fromDate: string,
  //   toDate: string,
  // ) {
  //   const loginStore = JSON.parse(loginStorage.getString("login-data"))
  //   const fileStore = fileStorage.getString("file-data")

  //   const shopName: string = loginStore?.company_name?.toString()
  //   const address: string = loginStore?.address?.toString()
  //   const location: string = loginStore?.branch_name?.toString()
  //   const shopMobile: string = loginStore?.phone_no?.toString()
  //   const shopEmail: string = loginStore?.email_id?.toString()
  //   // const cashier: string = loginStore?.user_name?.toString()

  //   let totalQuantities: number = 0
  //   let totalPrice: number = 0
  //   let totalDiscount: number = 0
  //   let totalGSTs: number = 0
  //   let totalNet: number = 0
  //   let slNo: number = 0

  //   try {
  //     let columnWidths = [11, 1, 18]
  //     let columnWidthsHeader = [8, 1, 21]
  //     let columnWidthsProductsHeaderAndBody = [5, 4, 7, 6, 6, 4] // 0 in hand
  //     // let columnWidthsProductsHeaderAndBody = [18, 3, 4, 3, 4]
  //     let columnWidthsTotals = [15, 15]
  //     let columnWidthIfNameIsBig = [32]

  //     // let newColumnWidths: number[] = [9, 9, 6, 7]

  //     if (fileStore?.length > 0) {
  //       await BluetoothEscposPrinter.printerAlign(
  //         BluetoothEscposPrinter.ALIGN.CENTER,
  //       )
  //       const options = {
  //         width: 250, // Assuming 58mm paper width with 8 dots/mm resolution (58mm * 8dots/mm = 384 dots)
  //         left: 50, // No left padding
  //         // align: "CENTER"
  //       }

  //       // Print the image
  //       await BluetoothEscposPrinter.printPic(fileStore, options)
  //     }

  //     await BluetoothEscposPrinter.printerAlign(
  //       BluetoothEscposPrinter.ALIGN.CENTER,
  //     )
  //     await BluetoothEscposPrinter.printText(shopName.toUpperCase(), {
  //       align: "center",
  //       widthtimes: 1.2,
  //       heigthtimes: 2,
  //     })
  //     await BluetoothEscposPrinter.printText("\n", {})
  //     // await BluetoothEscposPrinter.printText("hasifughaf", { align: "center" })

  //     // if (receiptSettings?.on_off_flag1 === "Y") {
  //     //     await BluetoothEscposPrinter.printText(receiptSettings?.header1, {})
  //     //     await BluetoothEscposPrinter.printText("\n", {})
  //     // }

  //     // if (receiptSettings?.on_off_flag2 === "Y") {
  //     //     await BluetoothEscposPrinter.printText(receiptSettings?.header2, {})
  //     // }
  //     // await BluetoothEscposPrinter.printText("\n", {})
  //     await BluetoothEscposPrinter.printText("------------------------", {
  //       align: "center",
  //     })

  //     await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printText("SALE REPORT", {
  //       align: "center",
  //     })

  //     await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printText("------------------------", {
  //       align: "center",
  //     })

  //     await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printText(
  //       `From: ${new Date(fromDate).toLocaleDateString(
  //         "en-GB",
  //       )}  To: ${new Date(toDate).toLocaleDateString("en-GB")}`,
  //       {},
  //     )

  //     await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printText("------------------------", {
  //       align: "center",
  //     })

  //     // await BluetoothEscposPrinter.printText("\n", {})
  //     // await BluetoothEscposPrinter.printText(address, {
  //     //   align: "center",
  //     // })
  //     // await BluetoothEscposPrinter.printText("\n", {})
  //     // await BluetoothEscposPrinter.printText(location, {
  //     //   align: "center",
  //     // })
  //     // await BluetoothEscposPrinter.printText("\n", {})

  //     // await BluetoothEscposPrinter.printText("------------------------", {
  //     //   align: "center",
  //     // })
  //     await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printerAlign(
  //       BluetoothEscposPrinter.ALIGN.CENTER,
  //     )

  //     receiptSettings?.gst_flag === "Y"
  //       ? await BluetoothEscposPrinter.printColumn(
  //         columnWidthsProductsHeaderAndBody,
  //         [
  //           BluetoothEscposPrinter.ALIGN.LEFT,
  //           BluetoothEscposPrinter.ALIGN.LEFT,
  //           BluetoothEscposPrinter.ALIGN.LEFT,
  //           BluetoothEscposPrinter.ALIGN.RIGHT,
  //           BluetoothEscposPrinter.ALIGN.RIGHT,
  //           BluetoothEscposPrinter.ALIGN.RIGHT,
  //         ],
  //         ["SL.", "QTY", "PRC", "DIS", "GST", "NET"],
  //         {},
  //       )
  //       : await BluetoothEscposPrinter.printColumn(
  //         columnWidthsProductsHeaderAndBody,
  //         [
  //           BluetoothEscposPrinter.ALIGN.LEFT,
  //           BluetoothEscposPrinter.ALIGN.LEFT,
  //           BluetoothEscposPrinter.ALIGN.LEFT,
  //           BluetoothEscposPrinter.ALIGN.RIGHT,
  //           BluetoothEscposPrinter.ALIGN.RIGHT,
  //           BluetoothEscposPrinter.ALIGN.RIGHT,
  //         ],
  //         ["SL.", "QTY", "PRC", "DIS", "", "NET"],
  //         {},
  //       )

  //     await BluetoothEscposPrinter.printText("------------------------", {
  //       align: "center",
  //     })

  //     await BluetoothEscposPrinter.printText("\n", {})

  //     for (const item of saleReport) {
  //       let totalGST: number = 0

  //       totalGST += item?.cgst_amt + item?.sgst_amt
  //       totalQuantities += item?.no_of_items
  //       totalPrice += item?.price
  //       totalDiscount += item?.discount_amt
  //       totalGSTs += totalGST
  //       totalNet += item?.net_amt + item?.round_off
  //       slNo++

  //       receiptSettings?.gst_flag === "Y"
  //         ? await BluetoothEscposPrinter.printColumn(
  //           columnWidthsProductsHeaderAndBody,
  //           [
  //             BluetoothEscposPrinter.ALIGN.LEFT,
  //             BluetoothEscposPrinter.ALIGN.LEFT,
  //             BluetoothEscposPrinter.ALIGN.LEFT,
  //             BluetoothEscposPrinter.ALIGN.RIGHT,
  //             BluetoothEscposPrinter.ALIGN.RIGHT,
  //             BluetoothEscposPrinter.ALIGN.RIGHT,
  //           ],
  //           [
  //             slNo.toString(),
  //             // item?.receipt_no
  //             //   ?.toString()
  //             //   ?.substring(item?.receipt_no?.toString()?.length - 4),
  //             item?.no_of_items?.toString(),
  //             item?.price?.toFixed(2)?.toString(),
  //             item?.discount_amt?.toString(),
  //             totalGST?.toString(),
  //             (item?.net_amt + item?.round_off)?.toString(),
  //           ],
  //           {},
  //         )
  //         : await BluetoothEscposPrinter.printColumn(
  //           columnWidthsProductsHeaderAndBody,
  //           [
  //             BluetoothEscposPrinter.ALIGN.LEFT,
  //             BluetoothEscposPrinter.ALIGN.LEFT,
  //             BluetoothEscposPrinter.ALIGN.LEFT,
  //             BluetoothEscposPrinter.ALIGN.RIGHT,
  //             BluetoothEscposPrinter.ALIGN.RIGHT,
  //             BluetoothEscposPrinter.ALIGN.RIGHT,
  //           ],
  //           [
  //             slNo.toString(),
  //             // item?.receipt_no
  //             //   ?.toString()
  //             //   ?.substring(item?.receipt_no?.toString()?.length - 4),
  //             item?.no_of_items?.toString(),
  //             item?.price?.toFixed(2)?.toString(),
  //             item?.discount_amt?.toString(),
  //             "",
  //             (item?.net_amt + item?.round_off)?.toString(),
  //           ],
  //           {},
  //         )
  //     }

  //     // await BluetoothEscposPrinter.printText("\n", {})
  //     await BluetoothEscposPrinter.printText("------------------------", {
  //       align: "center",
  //     })

  //     await BluetoothEscposPrinter.printText("\n", {})

  //     // await BluetoothEscposPrinter.printColumn(
  //     //     columnWidthsProductsHeaderAndBody,
  //     //     [
  //     //         BluetoothEscposPrinter.ALIGN.LEFT,
  //     //         BluetoothEscposPrinter.ALIGN.LEFT,
  //     //         BluetoothEscposPrinter.ALIGN.LEFT,
  //     //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //     //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //     //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //     //     ],
  //     //     ["TOT", totalQuantities.toFixed(2).toString(), totalPrice?.toFixed(2)?.toString(), totalDiscount?.toString(), totalGSTs?.toFixed(2)?.toString(), totalNet?.toFixed(2)?.toString()],
  //     //     {},
  //     // )

  //     await BluetoothEscposPrinter.printColumn(
  //       columnWidthsTotals,
  //       [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
  //       [
  //         `QTY: ${totalQuantities.toString()}`,
  //         `PRICE: ${totalPrice?.toFixed(2)?.toString()}`,
  //       ],
  //       {},
  //     )

  //     receiptSettings?.gst_flag === "Y"
  //       ? await BluetoothEscposPrinter.printColumn(
  //         columnWidthsTotals,
  //         [
  //           BluetoothEscposPrinter.ALIGN.LEFT,
  //           BluetoothEscposPrinter.ALIGN.RIGHT,
  //         ],
  //         [
  //           `DISC: ${totalDiscount?.toFixed(2)?.toString()}`,
  //           `GST: ${totalGSTs?.toFixed(2)?.toString()}`,
  //         ],
  //         {},
  //       )
  //       : await BluetoothEscposPrinter.printColumn(
  //         columnWidthIfNameIsBig,
  //         [BluetoothEscposPrinter.ALIGN.CENTER],
  //         [`DISC: ${totalDiscount?.toFixed(2)?.toString()}`],
  //         {},
  //       )

  //     // await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printText("------------------------", {
  //       align: "center",
  //     })

  //     await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printText(
  //       `NET TOTAL:   ${totalNet?.toFixed(2)?.toString()}`,
  //       { align: "center" },
  //     )

  //     await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printText("------------------------", {
  //       align: "center",
  //     })
  //     // await BluetoothEscposPrinter.printText("\n", {})

  //     // if (receiptSettings?.on_off_flag3 === "Y") {
  //     //     await BluetoothEscposPrinter.printText(receiptSettings?.footer1, {})
  //     //     await BluetoothEscposPrinter.printText("\n", {})
  //     // }
  //     // if (receiptSettings?.on_off_flag4 === "Y") {
  //     //     await BluetoothEscposPrinter.printText(receiptSettings?.footer2, {})
  //     // }
  //     // await BluetoothEscposPrinter.printText("\n", {})

  //     // await BluetoothEscposPrinter.printText(
  //     //     "THANK YOU, VISIT AGAIN!",
  //     //     { align: "center" },
  //     // )

  //     await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printText("------X------", {})
  //     await BluetoothEscposPrinter.printText("\n\r\n\r\n\r", {})
  //   } catch (e) {
  //     console.log(e.message || "ERROR")
  //   }
  // }

  async function printCollectionReport(
    collectionReport: CollectionReport[],
    fromDate: string,
    toDate: string,
  ) {
    const loginStore = JSON.parse(loginStorage.getString("login-data"))
    const fileStore = fileStorage.getString("file-data")

    const shopName: string = loginStore?.company_name?.toString()
    const address: string = loginStore?.address?.toString()
    const location: string = loginStore?.branch_name?.toString()
    const shopMobile: string = loginStore?.phone_no?.toString()
    const shopEmail: string = loginStore?.email_id?.toString()
    // const cashier: string = loginStore?.user_name?.toString()

    let totalNet: number = 0
    let totalCancelled: number = 0

    try {
      let columnWidths = [11, 1, 18]
      let columnWidthsHeader = [8, 1, 21]
      // let columnWidthsProductsHeaderAndBody = [5, 4, 8, 6, 4, 4] // 1 in hand
      // let columnWidthsProductsHeaderAndBody = [18, 3, 4, 3, 4]
      let columnWidthsHeaderBody = [8, 7, 8, 9]
      let columnWidthsTotals = [15, 15]
      let columnWidthIfNameIsBig = [32]

      // let newColumnWidths: number[] = [9, 9, 6, 7]

      if (fileStore?.length > 0) {
        await BluetoothEscposPrinter.printerAlign(
          BluetoothEscposPrinter.ALIGN.CENTER,
        )
        const options = {
          width: 250, // Assuming 58mm paper width with 8 dots/mm resolution (58mm * 8dots/mm = 384 dots)
          left: 50, // No left padding
          // align: "CENTER"
        }

        // Print the image
        await BluetoothEscposPrinter.printPic(fileStore, options)
      }

      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.CENTER,
      )
      await BluetoothEscposPrinter.printText(shopName.toUpperCase(), {
        align: "center",
        widthtimes: 1.2,
        heigthtimes: 2,
      })
      await BluetoothEscposPrinter.printText("\n", {})
      // await BluetoothEscposPrinter.printText("hasifughaf", { align: "center" })

      // if (receiptSettings?.on_off_flag1 === "Y") {
      //     await BluetoothEscposPrinter.printText(receiptSettings?.header1, {})
      //     await BluetoothEscposPrinter.printText("\n", {})
      // }

      // if (receiptSettings?.on_off_flag2 === "Y") {
      //     await BluetoothEscposPrinter.printText(receiptSettings?.header2, {})
      // }
      // await BluetoothEscposPrinter.printText("\n", {})
      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText("SALE SUMMARY", {
        align: "center",
      })

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText(
        `From: ${new Date(fromDate).toLocaleDateString(
          "en-GB",
        )}  To: ${new Date(toDate).toLocaleDateString("en-GB")}`,
        {},
      )

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })

      // await BluetoothEscposPrinter.printText("\n", {})
      // await BluetoothEscposPrinter.printText(address, {
      //   align: "center",
      // })
      // await BluetoothEscposPrinter.printText("\n", {})
      // await BluetoothEscposPrinter.printText(location, {
      //   align: "center",
      // })
      // await BluetoothEscposPrinter.printText("\n", {})

      // await BluetoothEscposPrinter.printText("------------------------", {
      //   align: "center",
      // })
      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.CENTER,
      )
      await BluetoothEscposPrinter.printColumn(
        columnWidthsHeaderBody,
        [
          BluetoothEscposPrinter.ALIGN.LEFT,
          BluetoothEscposPrinter.ALIGN.CENTER,
          BluetoothEscposPrinter.ALIGN.CENTER,
          BluetoothEscposPrinter.ALIGN.RIGHT,
        ],
        ["MODE", "RCPTs", "NET", "CNCL"],
        {},
      )

      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })

      await BluetoothEscposPrinter.printText("\n", {})

      for (const item of collectionReport) {
        totalNet += item?.net_amt
        totalCancelled += item?.can_amt

        await BluetoothEscposPrinter.printColumn(
          columnWidthsHeaderBody,
          [
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.CENTER,
            BluetoothEscposPrinter.ALIGN.CENTER,
            BluetoothEscposPrinter.ALIGN.RIGHT,
          ],
          [
            item?.pay_mode === "C"
              ? "Cash"
              : item?.pay_mode === "U"
                ? "UPI"
                : item?.pay_mode === "D"
                  ? "Card"
                  : "Credit",
            item?.no_of_rcpt?.toString(),
            item?.net_amt?.toFixed(2),
            item?.can_amt?.toFixed(2),
          ],
          {},
        )
      }

      // await BluetoothEscposPrinter.printText("\n", {})
      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })

      // await BluetoothEscposPrinter.printText("\n", {})

      // await BluetoothEscposPrinter.printText("------------------------", {
      //   align: "center",
      // })

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText(
        `NET TOTAL:   ${totalNet?.toFixed(2)}`,
        { align: "center" },
      )
      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText(
        `TOTAL CANCELLED:   ${totalCancelled?.toFixed(2)}`,
        { align: "center" },
      )

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })
      // await BluetoothEscposPrinter.printText("\n", {})

      // if (receiptSettings?.on_off_flag3 === "Y") {
      //     await BluetoothEscposPrinter.printText(receiptSettings?.footer1, {})
      //     await BluetoothEscposPrinter.printText("\n", {})
      // }
      // if (receiptSettings?.on_off_flag4 === "Y") {
      //     await BluetoothEscposPrinter.printText(receiptSettings?.footer2, {})
      // }
      // await BluetoothEscposPrinter.printText("\n", {})

      // await BluetoothEscposPrinter.printText(
      //     "THANK YOU, VISIT AGAIN!",
      //     { align: "center" },
      // )

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText("------X------", {})
      await BluetoothEscposPrinter.printText("\n\r\n\r\n\r", {})
    } catch (e) {
      console.log(e.message || "ERROR")
    }
  }

  async function printItemReport(
    itemReport: ItemReportData[],
    fromDate: string,
    toDate: string,
  ) {
    // ToastAndroid.show("Printing Item Reports will be added in some days.", ToastAndroid.SHORT)

    const loginStore = JSON.parse(loginStorage.getString("login-data"))
    const fileStore = fileStorage.getString("file-data")

    const shopName: string = loginStore?.company_name?.toString()
    const address: string = loginStore?.address?.toString()
    const location: string = loginStore?.branch_name?.toString()
    const shopMobile: string = loginStore?.phone_no?.toString()
    const shopEmail: string = loginStore?.email_id?.toString()
    // const cashier: string = loginStore?.user_name?.toString()

    let total: number = 0
    let totalQty: number = 0
    let slNo: number = 0

    try {
      let columnWidths = [11, 1, 18]
      let columnWidthsHeader = [8, 1, 21]
      // let columnWidthsProductsHeaderAndBody = [5, 4, 8, 6, 4, 4] // 1 in hand
      // let columnWidthsProductsHeaderAndBody = [18, 3, 4, 3, 4]
      // let columnWidthsHeaderBody = [12, 10, 10]
      let columnWidthsHeaderBody = [5, 12, 6, 5]
      let columnWidthsTotals = [15, 15]
      let columnWidthIfNameIsBig = [32]

      // let newColumnWidths: number[] = [9, 9, 6, 7]

      if (fileStore?.length > 0) {
        await BluetoothEscposPrinter.printerAlign(
          BluetoothEscposPrinter.ALIGN.CENTER,
        )
        const options = {
          width: 250, // Assuming 58mm paper width with 8 dots/mm resolution (58mm * 8dots/mm = 384 dots)
          left: 50, // No left padding
          // align: "CENTER"
        }

        // Print the image
        await BluetoothEscposPrinter.printPic(fileStore, options)
      }

      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.CENTER,
      )
      await BluetoothEscposPrinter.printText(shopName.toUpperCase(), {
        align: "center",
        widthtimes: 1.2,
        heigthtimes: 2,
      })
      await BluetoothEscposPrinter.printText("\n", {})
      // await BluetoothEscposPrinter.printText("hasifughaf", { align: "center" })

      // if (receiptSettings?.on_off_flag1 === "Y") {
      //     await BluetoothEscposPrinter.printText(receiptSettings?.header1, {})
      //     await BluetoothEscposPrinter.printText("\n", {})
      // }

      // if (receiptSettings?.on_off_flag2 === "Y") {
      //     await BluetoothEscposPrinter.printText(receiptSettings?.header2, {})
      // }
      // await BluetoothEscposPrinter.printText("\n", {})
      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText("ITEM REPORT", {
        align: "center",
      })

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText(
        `From: ${new Date(fromDate).toLocaleDateString(
          "en-GB",
        )}  To: ${new Date(toDate).toLocaleDateString("en-GB")}`,
        {},
      )

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })

      // await BluetoothEscposPrinter.printText("\n", {})
      // await BluetoothEscposPrinter.printText(address, {
      //   align: "center",
      // })
      // await BluetoothEscposPrinter.printText("\n", {})
      // await BluetoothEscposPrinter.printText(location, {
      //   align: "center",
      // })
      // await BluetoothEscposPrinter.printText("\n", {})

      // await BluetoothEscposPrinter.printText("------------------------", {
      //   align: "center",
      // })

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.CENTER,
      )
      await BluetoothEscposPrinter.printColumn(
        columnWidthsHeaderBody,
        [
          BluetoothEscposPrinter.ALIGN.LEFT,
          BluetoothEscposPrinter.ALIGN.LEFT,
          BluetoothEscposPrinter.ALIGN.RIGHT,
          BluetoothEscposPrinter.ALIGN.RIGHT,
        ],
        ["SL.", "Item", "QTY", "PRC"],
        {},
      )

      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })

      await BluetoothEscposPrinter.printText("\n", {})

      for (const item of itemReport) {
        total += item?.price
        totalQty += item?.qty
        slNo++

        await BluetoothEscposPrinter.printColumn(
          columnWidthsHeaderBody,
          [
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.RIGHT,
            BluetoothEscposPrinter.ALIGN.RIGHT,
          ],
          [
            slNo?.toString(),
            item?.item_name?.toString()?.slice(0, 14),
            item?.qty?.toString(),
            item?.price?.toString(),
          ],
          {},
        )
      }

      // await BluetoothEscposPrinter.printText("\n", {})
      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText(
        `TOTAL: ${total?.toFixed(2)?.toString()} TOT QTY: ${totalQty}`,
        { align: "center" },
      )

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })
      // await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText("------X------", {})
      await BluetoothEscposPrinter.printText("\n\r\n\r\n\r", {})
    } catch (e) {
      console.log(e.message || "ERROR")
    }
  }

  async function printGstStatement(
    gstStatement: GstStatement[],
    fromDate: string,
    toDate: string,
  ) {
    const loginStore = JSON.parse(loginStorage.getString("login-data"))
    const fileStore = fileStorage.getString("file-data")

    const shopName: string = loginStore?.company_name?.toString()
    const address: string = loginStore?.address?.toString()
    const location: string = loginStore?.branch_name?.toString()
    const shopMobile: string = loginStore?.phone_no?.toString()
    const shopEmail: string = loginStore?.email_id?.toString()
    // const cashier: string = loginStore?.user_name?.toString()

    let totalCGST: number = 0
    let totalSGST: number = 0
    let totalTaxes: number = 0

    try {
      let columnWidths = [11, 1, 18]
      let columnWidthsHeader = [8, 1, 21]
      // let columnWidthsProductsHeaderAndBody = [5, 4, 8, 6, 4, 4] // 1 in hand
      // let columnWidthsProductsHeaderAndBody = [5, 5, 5, 8, 8] // 1 in hand
      let columnWidthsProductsHeaderAndBody = [8, 5, 5, 8] // 6 in hand
      // let columnWidthsProductsHeaderAndBody = [18, 3, 4, 3, 4]
      let columnWidthsTotals = [15, 15]
      let columnWidthIfNameIsBig = [32]

      // let newColumnWidths: number[] = [9, 9, 6, 7]

      if (fileStore?.length > 0) {
        await BluetoothEscposPrinter.printerAlign(
          BluetoothEscposPrinter.ALIGN.CENTER,
        )
        const options = {
          width: 250, // Assuming 58mm paper width with 8 dots/mm resolution (58mm * 8dots/mm = 384 dots)
          left: 50, // No left padding
          // align: "CENTER"
        }

        // Print the image
        await BluetoothEscposPrinter.printPic(fileStore, options)
      }

      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.CENTER,
      )
      await BluetoothEscposPrinter.printText(shopName.toUpperCase(), {
        align: "center",
        widthtimes: 1.2,
        heigthtimes: 2,
      })
      await BluetoothEscposPrinter.printText("\n", {})
      // await BluetoothEscposPrinter.printText("hasifughaf", { align: "center" })

      // if (receiptSettings?.on_off_flag1 === "Y") {
      //     await BluetoothEscposPrinter.printText(receiptSettings?.header1, {})
      //     await BluetoothEscposPrinter.printText("\n", {})
      // }

      // if (receiptSettings?.on_off_flag2 === "Y") {
      //     await BluetoothEscposPrinter.printText(receiptSettings?.header2, {})
      // }
      // await BluetoothEscposPrinter.printText("\n", {})
      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText("GST STATEMENT", {
        align: "center",
      })

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText(
        `From: ${new Date(fromDate).toLocaleDateString(
          "en-GB",
        )}  To: ${new Date(toDate).toLocaleDateString("en-GB")}`,
        {},
      )

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })

      // await BluetoothEscposPrinter.printText("\n", {})
      // await BluetoothEscposPrinter.printText(address, {
      //   align: "center",
      // })
      // await BluetoothEscposPrinter.printText("\n", {})
      // await BluetoothEscposPrinter.printText(location, {
      //   align: "center",
      // })
      // await BluetoothEscposPrinter.printText("\n", {})

      // await BluetoothEscposPrinter.printText("------------------------", {
      //   align: "center",
      // })
      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.CENTER,
      )
      await BluetoothEscposPrinter.printColumn(
        columnWidthsProductsHeaderAndBody,
        [
          BluetoothEscposPrinter.ALIGN.LEFT,
          BluetoothEscposPrinter.ALIGN.LEFT,
          BluetoothEscposPrinter.ALIGN.CENTER,
          BluetoothEscposPrinter.ALIGN.RIGHT,
          // BluetoothEscposPrinter.ALIGN.RIGHT,
        ],
        // ["RCPT", "CGST", "SGST", "TOT_TAX", "TAX_AMT"],
        ["RCPT", "CGST", "SGST", "TOT_TAX"],
        {},
      )

      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })

      await BluetoothEscposPrinter.printText("\n", {})

      for (const item of gstStatement) {
        totalCGST += item?.cgst_amt
        totalSGST += item?.sgst_amt
        totalTaxes += item?.total_tax

        await BluetoothEscposPrinter.printColumn(
          columnWidthsProductsHeaderAndBody,
          [
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.CENTER,
            BluetoothEscposPrinter.ALIGN.RIGHT,
            // BluetoothEscposPrinter.ALIGN.RIGHT,
          ],
          // [item?.receipt_no?.toString()?.substring(item?.receipt_no?.toString()?.length - 4), item?.cgst_amt?.toString(), item?.sgst_amt?.toString(), item?.total_tax?.toString(), item?.taxable_amt?.toString()],
          [
            item?.receipt_no
              ?.toString()
              ?.substring(item?.receipt_no?.toString()?.length - 4),
            item?.cgst_amt?.toString(),
            item?.sgst_amt?.toString(),
            item?.total_tax?.toString(),
          ],
          {},
        )
      }

      // await BluetoothEscposPrinter.printText("\n", {})
      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printColumn(
        columnWidthsTotals,
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        [
          `CGST: ${totalCGST?.toFixed(2)?.toString()}`,
          `SGST: ${totalSGST?.toFixed(2)?.toString()}`,
        ],
        {},
      )
      // await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText(
        `Total Taxes: ${totalTaxes?.toFixed(2)?.toString()}`,
        {},
      )

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })

      // if (receiptSettings?.on_off_flag3 === "Y") {
      //     await BluetoothEscposPrinter.printText(receiptSettings?.footer1, {})
      //     await BluetoothEscposPrinter.printText("\n", {})
      // }
      // if (receiptSettings?.on_off_flag4 === "Y") {
      //     await BluetoothEscposPrinter.printText(receiptSettings?.footer2, {})
      // }
      // await BluetoothEscposPrinter.printText("\n", {})

      // await BluetoothEscposPrinter.printText(
      //     "THANK YOU, VISIT AGAIN!",
      //     { align: "center" },
      // )

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText("------X------", {})
      await BluetoothEscposPrinter.printText("\n\r\n\r\n\r", {})
    } catch (e) {
      console.log(e.message || "ERROR")
    }
  }

  async function printGstSummary(
    gstSummary: GstSummary[],
    fromDate: string,
    toDate: string,
  ) {
    const loginStore = JSON.parse(loginStorage.getString("login-data"))
    const fileStore = fileStorage.getString("file-data")

    const shopName: string = loginStore?.company_name?.toString()
    const address: string = loginStore?.address?.toString()
    const location: string = loginStore?.branch_name?.toString()
    const shopMobile: string = loginStore?.phone_no?.toString()
    const shopEmail: string = loginStore?.email_id?.toString()
    // const cashier: string = loginStore?.user_name?.toString()

    let totalCGSTP: number = 0
    let totalCGST: number = 0
    let totalSGST: number = 0
    let totalTaxes: number = 0

    try {
      let columnWidths = [11, 1, 18]
      let columnWidthsHeader = [8, 1, 21]
      // let columnWidthsProductsHeaderAndBody = [5, 4, 8, 6, 4, 4] // 1 in hand
      // let columnWidthsProductsHeaderAndBody = [5, 5, 5, 8, 8] // 1 in hand
      let columnWidthsProductsHeaderAndBody = [8, 7, 7, 8] // 2 in hand
      // let columnWidthsProductsHeaderAndBody = [18, 3, 4, 3, 4]
      let columnWidthsTotals = [15, 15]
      let columnWidthIfNameIsBig = [32]

      // let newColumnWidths: number[] = [9, 9, 6, 7]

      if (fileStore?.length > 0) {
        await BluetoothEscposPrinter.printerAlign(
          BluetoothEscposPrinter.ALIGN.CENTER,
        )
        const options = {
          width: 250, // Assuming 58mm paper width with 8 dots/mm resolution (58mm * 8dots/mm = 384 dots)
          left: 50, // No left padding
          // align: "CENTER"
        }

        // Print the image
        await BluetoothEscposPrinter.printPic(fileStore, options)
      }

      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.CENTER,
      )
      await BluetoothEscposPrinter.printText(shopName.toUpperCase(), {
        align: "center",
        widthtimes: 1.2,
        heigthtimes: 2,
      })
      await BluetoothEscposPrinter.printText("\n", {})
      // await BluetoothEscposPrinter.printText("hasifughaf", { align: "center" })

      // if (receiptSettings?.on_off_flag1 === "Y") {
      //     await BluetoothEscposPrinter.printText(receiptSettings?.header1, {})
      //     await BluetoothEscposPrinter.printText("\n", {})
      // }

      // if (receiptSettings?.on_off_flag2 === "Y") {
      //     await BluetoothEscposPrinter.printText(receiptSettings?.header2, {})
      // }
      // await BluetoothEscposPrinter.printText("\n", {})
      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText("GST SUMMARY", {
        align: "center",
      })

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText(
        `From: ${new Date(fromDate).toLocaleDateString(
          "en-GB",
        )}  To: ${new Date(toDate).toLocaleDateString("en-GB")}`,
        {},
      )

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })

      // await BluetoothEscposPrinter.printText("\n", {})
      // await BluetoothEscposPrinter.printText(address, {
      //   align: "center",
      // })
      // await BluetoothEscposPrinter.printText("\n", {})
      // await BluetoothEscposPrinter.printText(location, {
      //   align: "center",
      // })
      // await BluetoothEscposPrinter.printText("\n", {})

      // await BluetoothEscposPrinter.printText("------------------------", {
      //   align: "center",
      // })
      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.CENTER,
      )
      await BluetoothEscposPrinter.printColumn(
        columnWidthsProductsHeaderAndBody,
        [
          BluetoothEscposPrinter.ALIGN.LEFT,
          BluetoothEscposPrinter.ALIGN.LEFT,
          BluetoothEscposPrinter.ALIGN.CENTER,
          BluetoothEscposPrinter.ALIGN.RIGHT,
          // BluetoothEscposPrinter.ALIGN.RIGHT,
        ],
        // ["RCPT", "CGST", "SGST", "TOT_TAX", "TAX_AMT"],
        ["PRTG", "CGST", "SGST", "TOT_TAX"],
        {},
      )

      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })

      await BluetoothEscposPrinter.printText("\n", {})

      for (const item of gstSummary) {
        totalCGSTP += item?.cgst_prtg
        totalCGST += item?.cgst_amt
        totalSGST += item?.sgst_amt
        totalTaxes += item?.total_tax

        await BluetoothEscposPrinter.printColumn(
          columnWidthsProductsHeaderAndBody,
          [
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.CENTER,
            BluetoothEscposPrinter.ALIGN.RIGHT,
            // BluetoothEscposPrinter.ALIGN.RIGHT,
          ],
          // [item?.receipt_no?.toString()?.substring(item?.receipt_no?.toString()?.length - 4), item?.cgst_amt?.toString(), item?.sgst_amt?.toString(), item?.total_tax?.toString(), item?.taxable_amt?.toString()],
          [
            `${item?.cgst_prtg?.toString()}%`,
            item?.cgst_amt?.toString(),
            item?.sgst_amt?.toString(),
            item?.total_tax?.toString(),
          ],
          {},
        )
      }

      // await BluetoothEscposPrinter.printText("\n", {})
      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printColumn(
        columnWidthsTotals,
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        [
          `CGST: ${totalCGST?.toFixed(2)?.toString()}`,
          `SGST: ${totalSGST?.toFixed(2)?.toString()}`,
        ],
        {},
      )
      // await BluetoothEscposPrinter.printColumn(
      //     columnWidthsTotals,
      //     [
      //         BluetoothEscposPrinter.ALIGN.LEFT,
      //         BluetoothEscposPrinter.ALIGN.RIGHT,
      //     ],
      //     [``, `Total Tax: ${totalTaxes?.toString()}`],
      //     {},
      // )
      // await BluetoothEscposPrinter.printText("\n", {})
      await BluetoothEscposPrinter.printText(
        `Total Tax: ${totalTaxes?.toFixed(2)?.toString()}`,
        { align: "center" },
      )
      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })

      // await BluetoothEscposPrinter.printText("\n", {})
      // if (receiptSettings?.on_off_flag3 === "Y") {
      //     await BluetoothEscposPrinter.printText(receiptSettings?.footer1, {})
      //     await BluetoothEscposPrinter.printText("\n", {})
      // }
      // if (receiptSettings?.on_off_flag4 === "Y") {
      //     await BluetoothEscposPrinter.printText(receiptSettings?.footer2, {})
      // }
      // await BluetoothEscposPrinter.printText("\n", {})

      // await BluetoothEscposPrinter.printText(
      //     "THANK YOU, VISIT AGAIN!",
      //     { align: "center" },
      // )

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText("------X------", {})
      await BluetoothEscposPrinter.printText("\n\r\n\r\n\r", {})
    } catch (e) {
      console.log(e.message || "ERROR")
    }
  }

  async function printStockReport(stockReport: StockReportResponse[]) {
    const loginStore = JSON.parse(loginStorage.getString("login-data"))
    const fileStore = fileStorage.getString("file-data")

    const shopName: string = loginStore?.company_name?.toString()
    const address: string = loginStore?.address?.toString()
    const location: string = loginStore?.branch_name?.toString()
    const shopMobile: string = loginStore?.phone_no?.toString()
    const shopEmail: string = loginStore?.email_id?.toString()
    // const cashier: string = loginStore?.user_name?.toString()

    // let totalCGSTP: number = 0
    // let totalCGST: number = 0
    // let totalSGST: number = 0
    // let totalTaxes: number = 0
    let totalQty: number = 0
    let totalGrossStock: number = 0

    try {
      let columnWidths = [11, 1, 18]
      let columnWidthsHeader = [8, 1, 21]
      // let columnWidthsProductsHeaderAndBody = [5, 4, 8, 6, 4, 4] // 1 in hand
      // let columnWidthsProductsHeaderAndBody = [5, 5, 5, 8, 8] // 1 in hand
      // let columnWidthsProductsHeaderAndBody = [8, 7, 7, 8] // 2 in hand
      let columnWidthsProductsHeaderAndBody = [19, 9] // 2 in hand
      // let columnWidthsProductsHeaderAndBody = [18, 3, 4, 3, 4]
      let columnWidthsTotals = [15, 15]
      let columnWidthIfNameIsBig = [32]

      // let newColumnWidths: number[] = [9, 9, 6, 7]

      if (fileStore?.length > 0) {
        await BluetoothEscposPrinter.printerAlign(
          BluetoothEscposPrinter.ALIGN.CENTER,
        )
        const options = {
          width: 250, // Assuming 58mm paper width with 8 dots/mm resolution (58mm * 8dots/mm = 384 dots)
          left: 50, // No left padding
          // align: "CENTER"
        }

        // Print the image
        await BluetoothEscposPrinter.printPic(fileStore, options)
      }

      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.CENTER,
      )
      await BluetoothEscposPrinter.printText(shopName.toUpperCase(), {
        align: "center",
        widthtimes: 1.2,
        heigthtimes: 2,
      })
      await BluetoothEscposPrinter.printText("\n", {})
      // await BluetoothEscposPrinter.printText("hasifughaf", { align: "center" })

      // if (receiptSettings?.on_off_flag1 === "Y") {
      //     await BluetoothEscposPrinter.printText(receiptSettings?.header1, {})
      //     await BluetoothEscposPrinter.printText("\n", {})
      // }

      // if (receiptSettings?.on_off_flag2 === "Y") {
      //     await BluetoothEscposPrinter.printText(receiptSettings?.header2, {})
      // }
      // await BluetoothEscposPrinter.printText("\n", {})
      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText("STOCK REPORT", {
        align: "center",
      })

      await BluetoothEscposPrinter.printText("\n", {})

      // await BluetoothEscposPrinter.printText(`From: ${new Date(fromDate).toLocaleDateString("en-GB")}  To: ${new Date(toDate).toLocaleDateString("en-GB")}`, {})

      // await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })

      // await BluetoothEscposPrinter.printText("\n", {})
      // await BluetoothEscposPrinter.printText(address, {
      //   align: "center",
      // })
      // await BluetoothEscposPrinter.printText("\n", {})
      // await BluetoothEscposPrinter.printText(location, {
      //   align: "center",
      // })
      // await BluetoothEscposPrinter.printText("\n", {})

      // await BluetoothEscposPrinter.printText("------------------------", {
      //   align: "center",
      // })
      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.CENTER,
      )
      await BluetoothEscposPrinter.printColumn(
        columnWidthsProductsHeaderAndBody,
        [
          BluetoothEscposPrinter.ALIGN.LEFT,
          BluetoothEscposPrinter.ALIGN.RIGHT,
          // BluetoothEscposPrinter.ALIGN.RIGHT,
        ],
        // ["RCPT", "CGST", "SGST", "TOT_TAX", "TAX_AMT"],
        ["Product", "Stock"],
        {},
      )

      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })

      await BluetoothEscposPrinter.printText("\n", {})

      for (const item of stockReport) {
        totalQty += 1
        totalGrossStock += item?.stock

        await BluetoothEscposPrinter.printColumn(
          columnWidthsProductsHeaderAndBody,
          [
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.RIGHT,
            // BluetoothEscposPrinter.ALIGN.RIGHT,
          ],
          [
            `${totalQty}. ${item?.item_name?.toString()?.slice(0, 14)}`,
            `${item?.stock?.toString()} ${item?.unit_name?.toString() || ""}`,
          ],
          {},
        )
      }

      // await BluetoothEscposPrinter.printText("\n", {})
      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printColumn(
        columnWidthsTotals,
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        [
          `TOTAL QTY: ${totalQty?.toString()}`,
          `TOTAL GROSS: ${totalGrossStock?.toString()}`,
        ],
        {},
      )
      // await BluetoothEscposPrinter.printColumn(
      //     columnWidthsTotals,
      //     [
      //         BluetoothEscposPrinter.ALIGN.LEFT,
      //         BluetoothEscposPrinter.ALIGN.RIGHT,
      //     ],
      //     [``, `Total Tax: ${totalTaxes?.toString()}`],
      //     {},
      // )
      // await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })

      // await BluetoothEscposPrinter.printText("\n", {})
      // if (receiptSettings?.on_off_flag3 === "Y") {
      //     await BluetoothEscposPrinter.printText(receiptSettings?.footer1, {})
      //     await BluetoothEscposPrinter.printText("\n", {})
      // }
      // if (receiptSettings?.on_off_flag4 === "Y") {
      //     await BluetoothEscposPrinter.printText(receiptSettings?.footer2, {})
      // }
      // await BluetoothEscposPrinter.printText("\n", {})

      // await BluetoothEscposPrinter.printText(
      //     "THANK YOU, VISIT AGAIN!",
      //     { align: "center" },
      // )

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText("------X------", {})
      await BluetoothEscposPrinter.printText("\n\r\n\r\n\r", {})
    } catch (e) {
      console.log(e.message || "ERROR")
    }
  }

  // async function printUserwiseReport(
  //   userwiseReport: UserwiseReportData[],
  //   fromDate: string,
  //   toDate: string,
  // ) {
  //   const loginStore = JSON.parse(loginStorage.getString("login-data"))
  //   const fileStore = fileStorage.getString("file-data")

  //   const shopName: string = loginStore?.company_name?.toString()
  //   const address: string = loginStore?.address?.toString()
  //   const location: string = loginStore?.branch_name?.toString()
  //   const shopMobile: string = loginStore?.phone_no?.toString()
  //   const shopEmail: string = loginStore?.email_id?.toString()
  //   // const cashier: string = loginStore?.user_name?.toString()

  //   let totalNet: number = 0
  //   let totalCancelled: number = 0

  //   try {
  //     let columnWidths = [11, 1, 18]
  //     let columnWidthsHeader = [8, 1, 21]
  //     // let columnWidthsProductsHeaderAndBody = [5, 4, 8, 6, 4, 4] // 1 in hand
  //     // let columnWidthsProductsHeaderAndBody = [18, 3, 4, 3, 4]
  //     let columnWidthsHeaderBody = [8, 7, 8, 9]
  //     let columnWidthsTotals = [15, 15]
  //     let columnWidthIfNameIsBig = [32]

  //     // let newColumnWidths: number[] = [9, 9, 6, 7]

  //     if (fileStore?.length > 0) {
  //       await BluetoothEscposPrinter.printerAlign(
  //         BluetoothEscposPrinter.ALIGN.CENTER,
  //       )
  //       const options = {
  //         width: 250, // Assuming 58mm paper width with 8 dots/mm resolution (58mm * 8dots/mm = 384 dots)
  //         left: 50, // No left padding
  //         // align: "CENTER"
  //       }

  //       // Print the image
  //       await BluetoothEscposPrinter.printPic(fileStore, options)
  //     }

  //     await BluetoothEscposPrinter.printerAlign(
  //       BluetoothEscposPrinter.ALIGN.CENTER,
  //     )
  //     await BluetoothEscposPrinter.printText(shopName.toUpperCase(), {
  //       align: "center",
  //       widthtimes: 1.2,
  //       heigthtimes: 2,
  //     })
  //     await BluetoothEscposPrinter.printText("\n", {})
  //     // await BluetoothEscposPrinter.printText("hasifughaf", { align: "center" })

  //     // if (receiptSettings?.on_off_flag1 === "Y") {
  //     //     await BluetoothEscposPrinter.printText(receiptSettings?.header1, {})
  //     //     await BluetoothEscposPrinter.printText("\n", {})
  //     // }

  //     // if (receiptSettings?.on_off_flag2 === "Y") {
  //     //     await BluetoothEscposPrinter.printText(receiptSettings?.header2, {})
  //     // }
  //     // await BluetoothEscposPrinter.printText("\n", {})
  //     await BluetoothEscposPrinter.printText("------------------------", {
  //       align: "center",
  //     })

  //     await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printText("USERWISE REPORT", {
  //       align: "center",
  //     })

  //     await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printText("------------------------", {
  //       align: "center",
  //     })

  //     await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printText(
  //       `From: ${new Date(fromDate).toLocaleDateString(
  //         "en-GB",
  //       )}  To: ${new Date(toDate).toLocaleDateString("en-GB")}`,
  //       {},
  //     )

  //     await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printText("------------------------", {
  //       align: "center",
  //     })

  //     // await BluetoothEscposPrinter.printText("\n", {})
  //     // await BluetoothEscposPrinter.printText(address, {
  //     //   align: "center",
  //     // })
  //     // await BluetoothEscposPrinter.printText("\n", {})
  //     // await BluetoothEscposPrinter.printText(location, {
  //     //   align: "center",
  //     // })
  //     // await BluetoothEscposPrinter.printText("\n", {})

  //     // await BluetoothEscposPrinter.printText("------------------------", {
  //     //   align: "center",
  //     // })
  //     await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printerAlign(
  //       BluetoothEscposPrinter.ALIGN.CENTER,
  //     )
  //     await BluetoothEscposPrinter.printColumn(
  //       columnWidthsHeaderBody,
  //       [
  //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         BluetoothEscposPrinter.ALIGN.CENTER,
  //         BluetoothEscposPrinter.ALIGN.CENTER,
  //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //       ],
  //       ["USER", "RCPTs", "NET", "CNCL"],
  //       {},
  //     )

  //     await BluetoothEscposPrinter.printText("------------------------", {
  //       align: "center",
  //     })

  //     await BluetoothEscposPrinter.printText("\n", {})

  //     for (const item of userwiseReport) {
  //       totalNet += item?.net_amt
  //       totalCancelled += item?.cancelled_amt

  //       await BluetoothEscposPrinter.printColumn(
  //         columnWidthsHeaderBody,
  //         [
  //           BluetoothEscposPrinter.ALIGN.LEFT,
  //           BluetoothEscposPrinter.ALIGN.CENTER,
  //           BluetoothEscposPrinter.ALIGN.CENTER,
  //           BluetoothEscposPrinter.ALIGN.RIGHT,
  //         ],
  //         [
  //           item?.user_name?.toString(),
  //           item?.no_of_receipts?.toString(),
  //           item?.net_amt?.toFixed(2),
  //           item?.cancelled_amt?.toFixed(2),
  //         ],
  //         {},
  //       )
  //     }

  //     // await BluetoothEscposPrinter.printText("\n", {})
  //     await BluetoothEscposPrinter.printText("------------------------", {
  //       align: "center",
  //     })

  //     // await BluetoothEscposPrinter.printText("\n", {})

  //     // await BluetoothEscposPrinter.printText("------------------------", {
  //     //   align: "center",
  //     // })

  //     // await BluetoothEscposPrinter.printText("\n", {})

  //     // await BluetoothEscposPrinter.printText(
  //     //   `NET TOTAL:   ${totalNet?.toFixed(2)}`,
  //     //   { align: "center" },
  //     // )
  //     // await BluetoothEscposPrinter.printText("\n", {})

  //     // await BluetoothEscposPrinter.printText(
  //     //   `TOTAL CANCELLED:   ${totalCancelled?.toFixed(2)}`,
  //     //   { align: "center" },
  //     // )

  //     // await BluetoothEscposPrinter.printText("\n", {})

  //     // await BluetoothEscposPrinter.printText("------------------------", {
  //     //   align: "center",
  //     // })
  //     // await BluetoothEscposPrinter.printText("\n", {})

  //     // if (receiptSettings?.on_off_flag3 === "Y") {
  //     //     await BluetoothEscposPrinter.printText(receiptSettings?.footer1, {})
  //     //     await BluetoothEscposPrinter.printText("\n", {})
  //     // }
  //     // if (receiptSettings?.on_off_flag4 === "Y") {
  //     //     await BluetoothEscposPrinter.printText(receiptSettings?.footer2, {})
  //     // }
  //     // await BluetoothEscposPrinter.printText("\n", {})

  //     // await BluetoothEscposPrinter.printText(
  //     //     "THANK YOU, VISIT AGAIN!",
  //     //     { align: "center" },
  //     // )

  //     await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printText("------X------", {})
  //     await BluetoothEscposPrinter.printText("\n\r\n\r\n\r", {})
  //   } catch (e) {
  //     console.log(e.message || "ERROR")
  //   }
  // }

  // async function printCancelledBillsReport(
  //   cancelledBills: CancelledBillsReportData[],
  //   fromDate: string,
  //   toDate: string,
  // ) {
  //   const loginStore = JSON.parse(loginStorage.getString("login-data"))
  //   const fileStore = fileStorage.getString("file-data")

  //   const shopName: string = loginStore?.company_name?.toString()
  //   const address: string = loginStore?.address?.toString()
  //   const location: string = loginStore?.branch_name?.toString()
  //   const shopMobile: string = loginStore?.phone_no?.toString()
  //   const shopEmail: string = loginStore?.email_id?.toString()
  //   // const cashier: string = loginStore?.user_name?.toString()

  //   let totalNet: number = 0
  //   let totalGst: number = 0
  //   let totalDis: number = 0
  //   let slNo: number = 0

  //   try {
  //     let columnWidths = [11, 1, 18]
  //     let columnWidthsHeader = [8, 1, 21]
  //     // let columnWidthsProductsHeaderAndBody = [5, 4, 8, 6, 4, 4] // 1 in hand
  //     // let columnWidthsProductsHeaderAndBody = [18, 3, 4, 3, 4]
  //     // let columnWidthsHeaderBody = [12, 10, 10]
  //     let columnWidthsProductsHeaderAndBody = [5, 4, 7, 6, 6, 4]
  //     let columnWidthsTotals = [15, 15]
  //     let columnWidthIfNameIsBig = [32]

  //     // let newColumnWidths: number[] = [9, 9, 6, 7]

  //     if (fileStore?.length > 0) {
  //       await BluetoothEscposPrinter.printerAlign(
  //         BluetoothEscposPrinter.ALIGN.CENTER,
  //       )
  //       const options = {
  //         width: 250, // Assuming 58mm paper width with 8 dots/mm resolution (58mm * 8dots/mm = 384 dots)
  //         left: 50, // No left padding
  //         // align: "CENTER"
  //       }

  //       // Print the image
  //       await BluetoothEscposPrinter.printPic(fileStore, options)
  //     }

  //     await BluetoothEscposPrinter.printerAlign(
  //       BluetoothEscposPrinter.ALIGN.CENTER,
  //     )
  //     await BluetoothEscposPrinter.printText(shopName.toUpperCase(), {
  //       align: "center",
  //       widthtimes: 1.2,
  //       heigthtimes: 2,
  //     })
  //     await BluetoothEscposPrinter.printText("\n", {})
  //     // await BluetoothEscposPrinter.printText("hasifughaf", { align: "center" })

  //     // if (receiptSettings?.on_off_flag1 === "Y") {
  //     //     await BluetoothEscposPrinter.printText(receiptSettings?.header1, {})
  //     //     await BluetoothEscposPrinter.printText("\n", {})
  //     // }

  //     // if (receiptSettings?.on_off_flag2 === "Y") {
  //     //     await BluetoothEscposPrinter.printText(receiptSettings?.header2, {})
  //     // }
  //     // await BluetoothEscposPrinter.printText("\n", {})
  //     await BluetoothEscposPrinter.printText("------------------------", {
  //       align: "center",
  //     })

  //     await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printText("CANCELLED BILLS REPORT", {
  //       align: "center",
  //     })

  //     await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printText("------------------------", {
  //       align: "center",
  //     })

  //     await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printText(
  //       `From: ${new Date(fromDate).toLocaleDateString(
  //         "en-GB",
  //       )}  To: ${new Date(toDate).toLocaleDateString("en-GB")}`,
  //       {},
  //     )

  //     await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printText("------------------------", {
  //       align: "center",
  //     })

  //     // await BluetoothEscposPrinter.printText("\n", {})
  //     // await BluetoothEscposPrinter.printText(address, {
  //     //   align: "center",
  //     // })
  //     // await BluetoothEscposPrinter.printText("\n", {})
  //     // await BluetoothEscposPrinter.printText(location, {
  //     //   align: "center",
  //     // })
  //     // await BluetoothEscposPrinter.printText("\n", {})

  //     // await BluetoothEscposPrinter.printText("------------------------", {
  //     //   align: "center",
  //     // })
  //     await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printerAlign(
  //       BluetoothEscposPrinter.ALIGN.CENTER,
  //     )
  //     await BluetoothEscposPrinter.printColumn(
  //       columnWidthsProductsHeaderAndBody,
  //       [
  //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //       ],
  //       ["SL.", "QTY", "PRC", "DIS", "GST", "NET"],
  //       {},
  //     )

  //     await BluetoothEscposPrinter.printText("------------------------", {
  //       align: "center",
  //     })

  //     await BluetoothEscposPrinter.printText("\n", {})

  //     for (const item of cancelledBills) {
  //       totalNet += item?.net_amt
  //       totalGst += item?.cgst_amt + item?.sgst_amt
  //       totalDis += item?.discount_amt
  //       slNo++
  //       await BluetoothEscposPrinter.printColumn(
  //         columnWidthsProductsHeaderAndBody,
  //         [
  //           BluetoothEscposPrinter.ALIGN.LEFT,
  //           BluetoothEscposPrinter.ALIGN.LEFT,
  //           BluetoothEscposPrinter.ALIGN.LEFT,
  //           BluetoothEscposPrinter.ALIGN.RIGHT,
  //           BluetoothEscposPrinter.ALIGN.RIGHT,
  //           BluetoothEscposPrinter.ALIGN.RIGHT,
  //         ],
  //         [
  //           slNo.toString(),
  //           item?.no_of_items?.toString(),
  //           item?.price?.toString(),
  //           item?.discount_amt?.toString(),
  //           (item?.cgst_amt + item?.sgst_amt)?.toString(),
  //           item?.net_amt?.toString()
  //         ],
  //         {},
  //       )
  //     }

  //     // await BluetoothEscposPrinter.printText("\n", {})
  //     await BluetoothEscposPrinter.printText("------------------------", {
  //       align: "center",
  //     })

  //     // await BluetoothEscposPrinter.printText("\n", {})

  //     // await BluetoothEscposPrinter.printText("------------------------", {
  //     //   align: "center",
  //     // })

  //     await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printText(
  //       `TOTAL CANCELLED:   ${totalNet?.toFixed(2)?.toString()}`,
  //       { align: "center" },
  //     )
  //     await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printText(
  //       `GST:   ${totalGst?.toFixed(2)?.toString()}   DISC:   ${totalDis?.toFixed(2)?.toString()}`,
  //       { align: "center" },
  //     )

  //     await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printText("------------------------", {
  //       align: "center",
  //     })
  //     // await BluetoothEscposPrinter.printText("\n", {})

  //     // if (receiptSettings?.on_off_flag3 === "Y") {
  //     //     await BluetoothEscposPrinter.printText(receiptSettings?.footer1, {})
  //     //     await BluetoothEscposPrinter.printText("\n", {})
  //     // }
  //     // if (receiptSettings?.on_off_flag4 === "Y") {
  //     //     await BluetoothEscposPrinter.printText(receiptSettings?.footer2, {})
  //     // }
  //     // await BluetoothEscposPrinter.printText("\n", {})

  //     // await BluetoothEscposPrinter.printText(
  //     //     "THANK YOU, VISIT AGAIN!",
  //     //     { align: "center" },
  //     // )

  //     await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printText("------X------", {})
  //     await BluetoothEscposPrinter.printText("\n\r\n\r\n\r", {})
  //   } catch (e) {
  //     console.log(e.message || "ERROR")
  //   }
  // }

  async function printRefundReport(
    refundReport: RefundReportData[],
    fromDate: string,
    toDate: string,
  ) {
    const loginStore = JSON.parse(loginStorage.getString("login-data"))
    const fileStore = fileStorage.getString("file-data")

    const shopName: string = loginStore?.company_name?.toString()
    const address: string = loginStore?.address?.toString()
    const location: string = loginStore?.branch_name?.toString()
    const shopMobile: string = loginStore?.phone_no?.toString()
    const shopEmail: string = loginStore?.email_id?.toString()
    // const cashier: string = loginStore?.user_name?.toString()

    let totalQuantities: number = 0
    let totalPrice: number = 0
    let totalDiscount: number = 0
    let totalGSTs: number = 0
    let totalNet: number = 0

    try {
      let columnWidths = [11, 1, 18]
      let columnWidthsHeader = [8, 1, 21]
      let columnWidthsProductsHeaderAndBody = [5, 4, 7, 6, 6, 4] // 0 in hand
      // let columnWidthsProductsHeaderAndBody = [18, 3, 4, 3, 4]
      let columnWidthsTotals = [15, 15]
      let columnWidthIfNameIsBig = [32]

      // let newColumnWidths: number[] = [9, 9, 6, 7]

      if (fileStore?.length > 0) {
        await BluetoothEscposPrinter.printerAlign(
          BluetoothEscposPrinter.ALIGN.CENTER,
        )
        const options = {
          width: 250, // Assuming 58mm paper width with 8 dots/mm resolution (58mm * 8dots/mm = 384 dots)
          left: 50, // No left padding
          // align: "CENTER"
        }

        // Print the image
        await BluetoothEscposPrinter.printPic(fileStore, options)
      }

      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.CENTER,
      )
      await BluetoothEscposPrinter.printText(shopName.toUpperCase(), {
        align: "center",
        widthtimes: 1.2,
        heigthtimes: 2,
      })
      await BluetoothEscposPrinter.printText("\n", {})
      // await BluetoothEscposPrinter.printText("hasifughaf", { align: "center" })

      // if (receiptSettings?.on_off_flag1 === "Y") {
      //     await BluetoothEscposPrinter.printText(receiptSettings?.header1, {})
      //     await BluetoothEscposPrinter.printText("\n", {})
      // }

      // if (receiptSettings?.on_off_flag2 === "Y") {
      //     await BluetoothEscposPrinter.printText(receiptSettings?.header2, {})
      // }
      // await BluetoothEscposPrinter.printText("\n", {})
      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText("REFUND REPORT", {
        align: "center",
      })

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText(
        `From: ${new Date(fromDate).toLocaleDateString(
          "en-GB",
        )}  To: ${new Date(toDate).toLocaleDateString("en-GB")}`,
        {},
      )

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })

      await BluetoothEscposPrinter.printText("\n", {})
      await BluetoothEscposPrinter.printText(address, {
        align: "center",
      })
      await BluetoothEscposPrinter.printText("\n", {})
      await BluetoothEscposPrinter.printText(location, {
        align: "center",
      })
      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })
      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.CENTER,
      )

      receiptSettings?.gst_flag === "Y"
        ? await BluetoothEscposPrinter.printColumn(
          columnWidthsProductsHeaderAndBody,
          [
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.RIGHT,
            BluetoothEscposPrinter.ALIGN.RIGHT,
            BluetoothEscposPrinter.ALIGN.RIGHT,
          ],
          ["RCPT", "QTY", "PRC", "DIS", "GST", "NET"],
          {},
        )
        : await BluetoothEscposPrinter.printColumn(
          columnWidthsProductsHeaderAndBody,
          [
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.RIGHT,
            BluetoothEscposPrinter.ALIGN.RIGHT,
            BluetoothEscposPrinter.ALIGN.RIGHT,
          ],
          ["RCPT", "QTY", "PRC", "DIS", "", "NET"],
          {},
        )

      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })

      await BluetoothEscposPrinter.printText("\n", {})

      for (const item of refundReport) {
        let totalGST: number = 0

        totalGST += item?.cgst_amt + item?.sgst_amt
        totalQuantities += item?.no_of_items
        totalPrice += item?.price
        totalDiscount += item?.discount_amt
        totalGSTs += totalGST
        totalNet += item?.net_amt + item?.round_off

        receiptSettings?.gst_flag === "Y"
          ? await BluetoothEscposPrinter.printColumn(
            columnWidthsProductsHeaderAndBody,
            [
              BluetoothEscposPrinter.ALIGN.LEFT,
              BluetoothEscposPrinter.ALIGN.LEFT,
              BluetoothEscposPrinter.ALIGN.LEFT,
              BluetoothEscposPrinter.ALIGN.RIGHT,
              BluetoothEscposPrinter.ALIGN.RIGHT,
              BluetoothEscposPrinter.ALIGN.RIGHT,
            ],
            [
              item?.refund_rcpt_no
                ?.toString()
                ?.substring(item?.refund_rcpt_no?.toString()?.length - 4),
              item?.no_of_items?.toString(),
              item?.price?.toFixed(2)?.toString(),
              item?.discount_amt?.toString(),
              totalGST?.toString(),
              (item?.net_amt + item?.round_off)?.toString(),
            ],
            {},
          )
          : await BluetoothEscposPrinter.printColumn(
            columnWidthsProductsHeaderAndBody,
            [
              BluetoothEscposPrinter.ALIGN.LEFT,
              BluetoothEscposPrinter.ALIGN.LEFT,
              BluetoothEscposPrinter.ALIGN.LEFT,
              BluetoothEscposPrinter.ALIGN.RIGHT,
              BluetoothEscposPrinter.ALIGN.RIGHT,
              BluetoothEscposPrinter.ALIGN.RIGHT,
            ],
            [
              item?.refund_rcpt_no
                ?.toString()
                ?.substring(item?.refund_rcpt_no?.toString()?.length - 4),
              item?.no_of_items?.toString(),
              item?.price?.toFixed(2)?.toString(),
              item?.discount_amt?.toString(),
              "",
              (item?.net_amt + item?.round_off)?.toString(),
            ],
            {},
          )
      }

      await BluetoothEscposPrinter.printText("\n", {})
      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })

      await BluetoothEscposPrinter.printText("\n", {})

      // await BluetoothEscposPrinter.printColumn(
      //     columnWidthsProductsHeaderAndBody,
      //     [
      //         BluetoothEscposPrinter.ALIGN.LEFT,
      //         BluetoothEscposPrinter.ALIGN.LEFT,
      //         BluetoothEscposPrinter.ALIGN.LEFT,
      //         BluetoothEscposPrinter.ALIGN.RIGHT,
      //         BluetoothEscposPrinter.ALIGN.RIGHT,
      //         BluetoothEscposPrinter.ALIGN.RIGHT,
      //     ],
      //     ["TOT", totalQuantities.toFixed(2).toString(), totalPrice?.toFixed(2)?.toString(), totalDiscount?.toString(), totalGSTs?.toFixed(2)?.toString(), totalNet?.toFixed(2)?.toString()],
      //     {},
      // )

      await BluetoothEscposPrinter.printColumn(
        columnWidthsTotals,
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        [
          `QTY: ${totalQuantities.toString()}`,
          `PRICE: ${totalPrice?.toFixed(2)?.toString()}`,
        ],
        {},
      )

      receiptSettings?.gst_flag === "Y"
        ? await BluetoothEscposPrinter.printColumn(
          columnWidthsTotals,
          [
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.RIGHT,
          ],
          [
            `DISC: ${totalDiscount?.toFixed(2)?.toString()}`,
            `GST: ${totalGSTs?.toFixed(2)?.toString()}`,
          ],
          {},
        )
        : await BluetoothEscposPrinter.printColumn(
          columnWidthIfNameIsBig,
          [BluetoothEscposPrinter.ALIGN.CENTER],
          [`DISC: ${totalDiscount?.toFixed(2)?.toString()}`],
          {},
        )

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText(
        `NET TOTAL:   ${totalNet?.toFixed(2)?.toString()}`,
        { align: "center" },
      )

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })
      await BluetoothEscposPrinter.printText("\n", {})

      // if (receiptSettings?.on_off_flag3 === "Y") {
      //     await BluetoothEscposPrinter.printText(receiptSettings?.footer1, {})
      //     await BluetoothEscposPrinter.printText("\n", {})
      // }
      // if (receiptSettings?.on_off_flag4 === "Y") {
      //     await BluetoothEscposPrinter.printText(receiptSettings?.footer2, {})
      // }
      // await BluetoothEscposPrinter.printText("\n", {})

      // await BluetoothEscposPrinter.printText(
      //     "THANK YOU, VISIT AGAIN!",
      //     { align: "center" },
      // )

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText("------X------", {})
      await BluetoothEscposPrinter.printText("\n\r\n\r\n\r", {})
    } catch (e) {
      console.log(e.message || "ERROR")
    }
  }

  // async function printCreditReport(
  //   creditReport: CreditReportResponseData[],
  //   fromDate: string,
  //   toDate: string,
  // ) {
  //   const loginStore = JSON.parse(loginStorage.getString("login-data"))
  //   const fileStore = fileStorage.getString("file-data")

  //   const shopName: string = loginStore?.company_name?.toString()
  //   const address: string = loginStore?.address?.toString()
  //   const location: string = loginStore?.branch_name?.toString()
  //   const shopMobile: string = loginStore?.phone_no?.toString()
  //   const shopEmail: string = loginStore?.email_id?.toString()
  //   // const cashier: string = loginStore?.user_name?.toString()

  //   let totalNet: number = 0
  //   let totalDue: number = 0

  //   try {
  //     let columnWidths = [11, 1, 18]
  //     let columnWidthsHeader = [8, 1, 21]
  //     // let columnWidthsProductsHeaderAndBody = [5, 4, 7, 6, 6, 4] // 0 in hand
  //     let columnWidthsProductsHeaderAndBody = [11, 8, 6, 7] // 0 in hand
  //     // let columnWidthsProductsHeaderAndBody = [18, 3, 4, 3, 4]
  //     let columnWidthsTotals = [15, 15]
  //     let columnWidthIfNameIsBig = [32]

  //     // let newColumnWidths: number[] = [9, 9, 6, 7]

  //     if (fileStore?.length > 0) {
  //       await BluetoothEscposPrinter.printerAlign(
  //         BluetoothEscposPrinter.ALIGN.CENTER,
  //       )
  //       const options = {
  //         width: 250, // Assuming 58mm paper width with 8 dots/mm resolution (58mm * 8dots/mm = 384 dots)
  //         left: 50, // No left padding
  //         // align: "CENTER"
  //       }

  //       // Print the image
  //       await BluetoothEscposPrinter.printPic(fileStore, options)
  //     }

  //     await BluetoothEscposPrinter.printerAlign(
  //       BluetoothEscposPrinter.ALIGN.CENTER,
  //     )
  //     await BluetoothEscposPrinter.printText(shopName.toUpperCase(), {
  //       align: "center",
  //       widthtimes: 1.2,
  //       heigthtimes: 2,
  //     })
  //     await BluetoothEscposPrinter.printText("\n", {})
  //     // await BluetoothEscposPrinter.printText("hasifughaf", { align: "center" })

  //     // if (receiptSettings?.on_off_flag1 === "Y") {
  //     //     await BluetoothEscposPrinter.printText(receiptSettings?.header1, {})
  //     //     await BluetoothEscposPrinter.printText("\n", {})
  //     // }

  //     // if (receiptSettings?.on_off_flag2 === "Y") {
  //     //     await BluetoothEscposPrinter.printText(receiptSettings?.header2, {})
  //     // }
  //     // await BluetoothEscposPrinter.printText("\n", {})
  //     await BluetoothEscposPrinter.printText("------------------------", {
  //       align: "center",
  //     })

  //     await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printText("CREDIT REPORT", {
  //       align: "center",
  //     })

  //     await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printText("------------------------", {
  //       align: "center",
  //     })

  //     await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printText(
  //       `From: ${new Date(fromDate).toLocaleDateString(
  //         "en-GB",
  //       )}  To: ${new Date(toDate).toLocaleDateString("en-GB")}`,
  //       {},
  //     )

  //     await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printText("------------------------", {
  //       align: "center",
  //     })

  //     // await BluetoothEscposPrinter.printText("\n", {})
  //     // await BluetoothEscposPrinter.printText(address, {
  //     //   align: "center",
  //     // })
  //     // await BluetoothEscposPrinter.printText("\n", {})
  //     // await BluetoothEscposPrinter.printText(location, {
  //     //   align: "center",
  //     // })
  //     // await BluetoothEscposPrinter.printText("\n", {})

  //     // await BluetoothEscposPrinter.printText("------------------------", {
  //     //   align: "center",
  //     // })
  //     await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printerAlign(
  //       BluetoothEscposPrinter.ALIGN.CENTER,
  //     )

  //     await BluetoothEscposPrinter.printColumn(
  //       columnWidthsProductsHeaderAndBody,
  //       [
  //         // BluetoothEscposPrinter.ALIGN.LEFT,
  //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //         // BluetoothEscposPrinter.ALIGN.RIGHT,
  //       ],
  //       ["Rcpt No.", "Amount", "Paid Amt.", "Due Amt."],
  //       {},
  //     )

  //     await BluetoothEscposPrinter.printText("------------------------", {
  //       align: "center",
  //     })

  //     await BluetoothEscposPrinter.printText("\n", {})

  //     for (const item of creditReport) {
  //       totalNet += item?.net_amt
  //       totalDue += item?.due_amt
  //       // let totalGST: number = 0

  //       // totalGST += item?.cgst_amt + item?.sgst_amt
  //       // totalQuantities += item?.no_of_items
  //       // totalPrice += item?.price
  //       // totalDiscount += item?.discount_amt
  //       // totalGSTs += totalGST
  //       // totalNet += item?.net_amt + item?.round_off

  //       await BluetoothEscposPrinter.printColumn(
  //         columnWidthsProductsHeaderAndBody,
  //         [
  //           BluetoothEscposPrinter.ALIGN.LEFT,
  //           BluetoothEscposPrinter.ALIGN.LEFT,
  //           BluetoothEscposPrinter.ALIGN.RIGHT,
  //           BluetoothEscposPrinter.ALIGN.RIGHT,
  //         ],
  //         [
  //           item?.receipt_no
  //             ?.toString(),
  //           item?.net_amt?.toString(),
  //           item?.paid_amt?.toFixed(2),
  //           item?.due_amt?.toString(),
  //         ],
  //         {},
  //       )
  //     }

  //     // await BluetoothEscposPrinter.printText("\n", {})
  //     await BluetoothEscposPrinter.printText("------------------------", {
  //       align: "center",
  //     })

  //     await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printColumn(
  //       columnWidthsTotals,
  //       [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
  //       [
  //         `TOTAL NET: ${totalNet.toString()}`,
  //         `TOTAL DUE: ${totalDue?.toFixed(2)}`,
  //       ],
  //       {},
  //     )

  //     // await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printText("------------------------", {
  //       align: "center",
  //     })

  //     // await BluetoothEscposPrinter.printText("\n", {})

  //     // if (receiptSettings?.on_off_flag3 === "Y") {
  //     //     await BluetoothEscposPrinter.printText(receiptSettings?.footer1, {})
  //     //     await BluetoothEscposPrinter.printText("\n", {})
  //     // }
  //     // if (receiptSettings?.on_off_flag4 === "Y") {
  //     //     await BluetoothEscposPrinter.printText(receiptSettings?.footer2, {})
  //     // }
  //     // await BluetoothEscposPrinter.printText("\n", {})

  //     // await BluetoothEscposPrinter.printText(
  //     //     "THANK YOU, VISIT AGAIN!",
  //     //     { align: "center" },
  //     // )

  //     await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printText("------X------", {})
  //     await BluetoothEscposPrinter.printText("\n\r\n\r\n\r", {})
  //   } catch (e) {
  //     console.log(e.message || "ERROR")
  //   }
  // }

  async function printRecovery(rcptNo: number, dueAmt: number, receivedAmt: number) {
    const loginStore = JSON.parse(loginStorage.getString("login-data"))
    const fileStore = fileStorage.getString("file-data")

    const shopName: string = loginStore?.company_name?.toString()
    const address: string = loginStore?.address?.toString()
    const location: string = loginStore?.branch_name?.toString()
    const shopMobile: string = loginStore?.phone_no?.toString()
    const shopEmail: string = loginStore?.email_id?.toString()
    // const cashier: string = loginStore?.user_name?.toString()

    let totalNet: number = 0
    let totalDue: number = 0

    try {
      let columnWidths = [11, 1, 18]
      let columnWidthsHeader = [8, 1, 21]
      // let columnWidthsProductsHeaderAndBody = [5, 4, 7, 6, 6, 4] // 0 in hand
      let columnWidthsProductsHeaderAndBody = [11, 8, 6, 7] // 0 in hand
      // let columnWidthsProductsHeaderAndBody = [18, 3, 4, 3, 4]
      let columnWidthsTotals = [15, 15]
      let columnWidthIfNameIsBig = [32]

      // let newColumnWidths: number[] = [9, 9, 6, 7]

      if (fileStore?.length > 0) {
        await BluetoothEscposPrinter.printerAlign(
          BluetoothEscposPrinter.ALIGN.CENTER,
        )
        const options = {
          width: 250, // Assuming 58mm paper width with 8 dots/mm resolution (58mm * 8dots/mm = 384 dots)
          left: 50, // No left padding
          // align: "CENTER"
        }

        // Print the image
        await BluetoothEscposPrinter.printPic(fileStore, options)
      }

      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.CENTER,
      )
      await BluetoothEscposPrinter.printText(shopName.toUpperCase(), {
        align: "center",
        widthtimes: 1.2,
        heigthtimes: 2,
      })
      await BluetoothEscposPrinter.printText("\n", {})
      // await BluetoothEscposPrinter.printText("hasifughaf", { align: "center" })

      // if (receiptSettings?.on_off_flag1 === "Y") {
      //     await BluetoothEscposPrinter.printText(receiptSettings?.header1, {})
      //     await BluetoothEscposPrinter.printText("\n", {})
      // }

      // if (receiptSettings?.on_off_flag2 === "Y") {
      //     await BluetoothEscposPrinter.printText(receiptSettings?.header2, {})
      // }
      // await BluetoothEscposPrinter.printText("\n", {})
      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText("RECOVERY RECEIPT", {
        align: "center",
      })

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })

      await BluetoothEscposPrinter.printText("\n", {})
      await BluetoothEscposPrinter.printText(address, {
        align: "center",
      })
      await BluetoothEscposPrinter.printText("\n", {})
      await BluetoothEscposPrinter.printText(location, {
        align: "center",
      })
      await BluetoothEscposPrinter.printText("\n", {})
      await BluetoothEscposPrinter.printColumn(
        columnWidthsTotals,
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        [
          `Rcpt No.`,
          `${rcptNo.toString()}`,
        ],
        {},
      )

      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })
      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.CENTER,
      )

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printColumn(
        columnWidthsTotals,
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        [
          `DUE AMT: ${dueAmt}`,
          `RECEIVED: ${receivedAmt}`,
        ],
        {},
      )

      await BluetoothEscposPrinter.printText("\n", {})

      //@ts-ignore
      await BluetoothEscposPrinter.printText(`DUE: ${(parseFloat(dueAmt) - parseFloat(receivedAmt)).toFixed(2)}`, {
        align: "center",
      })

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText("------X------", {})
      await BluetoothEscposPrinter.printText("\n\r\n\r\n\r", {})
    } catch (e) {
      console.log(e.message || "ERROR")
    }
  }

  async function printDaybookReport(daybookReport: DaybookReportData[], fromDate: string, toDate: string) {
    const loginStore = JSON.parse(loginStorage.getString("login-data"))
    const fileStore = fileStorage.getString("file-data")

    const shopName: string = loginStore?.company_name?.toString()
    const address: string = loginStore?.address?.toString()
    const location: string = loginStore?.branch_name?.toString()
    const shopMobile: string = loginStore?.phone_no?.toString()
    const shopEmail: string = loginStore?.email_id?.toString()
    // const cashier: string = loginStore?.user_name?.toString()

    let totalNet: number = 0
    let totalCancelled: number = 0
    let slNo: number = 0

    try {
      let columnWidths = [11, 1, 18]
      let columnWidthsHeader = [8, 1, 21]
      // let columnWidthsProductsHeaderAndBody = [5, 4, 8, 6, 4, 4] // 1 in hand
      // let columnWidthsProductsHeaderAndBody = [18, 3, 4, 3, 4]
      // let columnWidthsHeaderBody = [12, 10, 10]
      let columnWidthsHeaderBody = [5, 9, 9, 9]
      let columnWidthsTotals = [15, 15]
      let columnWidthIfNameIsBig = [32]

      // let newColumnWidths: number[] = [9, 9, 6, 7]

      if (fileStore?.length > 0) {
        await BluetoothEscposPrinter.printerAlign(
          BluetoothEscposPrinter.ALIGN.CENTER,
        )
        const options = {
          width: 250, // Assuming 58mm paper width with 8 dots/mm resolution (58mm * 8dots/mm = 384 dots)
          left: 50, // No left padding
          // align: "CENTER"
        }

        // Print the image
        await BluetoothEscposPrinter.printPic(fileStore, options)
      }

      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.CENTER,
      )
      await BluetoothEscposPrinter.printText(shopName.toUpperCase(), {
        align: "center",
        widthtimes: 1.2,
        heigthtimes: 2,
      })
      await BluetoothEscposPrinter.printText("\n", {})
      // await BluetoothEscposPrinter.printText("hasifughaf", { align: "center" })

      // if (receiptSettings?.on_off_flag1 === "Y") {
      //     await BluetoothEscposPrinter.printText(receiptSettings?.header1, {})
      //     await BluetoothEscposPrinter.printText("\n", {})
      // }

      // if (receiptSettings?.on_off_flag2 === "Y") {
      //     await BluetoothEscposPrinter.printText(receiptSettings?.header2, {})
      // }
      // await BluetoothEscposPrinter.printText("\n", {})
      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText("DAYBOOK REPORT", {
        align: "center",
      })

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText(
        `From: ${new Date(fromDate).toLocaleDateString(
          "en-GB",
        )}  To: ${new Date(toDate).toLocaleDateString("en-GB")}`,
        {},
      )

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })

      // await BluetoothEscposPrinter.printText("\n", {})
      // await BluetoothEscposPrinter.printText(address, {
      //   align: "center",
      // })
      // await BluetoothEscposPrinter.printText("\n", {})
      // await BluetoothEscposPrinter.printText(location, {
      //   align: "center",
      // })
      // await BluetoothEscposPrinter.printText("\n", {})

      // await BluetoothEscposPrinter.printText("------------------------", {
      //   align: "center",
      // })
      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.CENTER,
      )
      await BluetoothEscposPrinter.printColumn(
        columnWidthsHeaderBody,
        [
          BluetoothEscposPrinter.ALIGN.LEFT,
          BluetoothEscposPrinter.ALIGN.CENTER,
          BluetoothEscposPrinter.ALIGN.CENTER,
          BluetoothEscposPrinter.ALIGN.RIGHT,
        ],
        ["SL.", "RCPT", "NET", "CNCLD"],
        {},
      )

      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })

      await BluetoothEscposPrinter.printText("\n", {})

      for (const item of daybookReport) {
        totalNet += item?.net_amt
        totalCancelled += item?.cancelled_amt
        slNo++

        await BluetoothEscposPrinter.printColumn(
          columnWidthsHeaderBody,
          [
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.CENTER,
            BluetoothEscposPrinter.ALIGN.CENTER,
            BluetoothEscposPrinter.ALIGN.RIGHT,
          ],
          [
            slNo.toString(),
            item?.receipt_no?.toString()?.substring(item?.receipt_no?.toString()?.length - 4),
            item?.net_amt?.toFixed(2),
            item?.cancelled_amt?.toFixed(2),
          ],
          {},
        )
      }

      // await BluetoothEscposPrinter.printText("\n", {})
      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })

      // await BluetoothEscposPrinter.printText("\n", {})

      // await BluetoothEscposPrinter.printText("------------------------", {
      //   align: "center",
      // })

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText(
        `NET TOTAL:   ${totalNet?.toFixed(2)?.toString()}`,
        { align: "center" },
      )
      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText(
        `TOTAL CANCELLED:   ${totalCancelled?.toFixed(2)?.toString()}`,
        { align: "center" },
      )

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })
      // await BluetoothEscposPrinter.printText("\n", {})

      // if (receiptSettings?.on_off_flag3 === "Y") {
      //     await BluetoothEscposPrinter.printText(receiptSettings?.footer1, {})
      //     await BluetoothEscposPrinter.printText("\n", {})
      // }
      // if (receiptSettings?.on_off_flag4 === "Y") {
      //     await BluetoothEscposPrinter.printText(receiptSettings?.footer2, {})
      // }
      // await BluetoothEscposPrinter.printText("\n", {})

      // await BluetoothEscposPrinter.printText(
      //     "THANK YOU, VISIT AGAIN!",
      //     { align: "center" },
      // )

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText("------X------", {})
      await BluetoothEscposPrinter.printText("\n\r\n\r\n\r", {})
    } catch (e) {
      console.log(e.message || "ERROR")
    }
  }

  // async function printDueReport(
  //   dueReport: DueReportData[],
  //   date: string,
  // ) {
  //   const loginStore = JSON.parse(loginStorage.getString("login-data"))
  //   const fileStore = fileStorage.getString("file-data")

  //   const shopName: string = loginStore?.company_name?.toString()
  //   const address: string = loginStore?.address?.toString()
  //   const location: string = loginStore?.branch_name?.toString()
  //   const shopMobile: string = loginStore?.phone_no?.toString()
  //   const shopEmail: string = loginStore?.email_id?.toString()
  //   // const cashier: string = loginStore?.user_name?.toString()

  //   let totalQuantities: number = 0
  //   let totalPrice: number = 0
  //   let totalDiscount: number = 0
  //   let totalGSTs: number = 0
  //   let totalNet: number = 0

  //   try {
  //     let columnWidths = [11, 1, 18]
  //     let columnWidthsHeader = [8, 1, 21]
  //     // let columnWidthsProductsHeaderAndBody = [5, 4, 7, 6, 6, 4] // 0 in hand
  //     let columnWidthsProductsHeaderAndBody = [4, 8, 8, 8]
  //     // let columnWidthsTotals = [15, 15]
  //     let columnWidthsTotals = [32]
  //     let columnWidthIfNameIsBig = [32]

  //     // let newColumnWidths: number[] = [9, 9, 6, 7]

  //     if (fileStore?.length > 0) {
  //       await BluetoothEscposPrinter.printerAlign(
  //         BluetoothEscposPrinter.ALIGN.CENTER,
  //       )
  //       const options = {
  //         width: 250, // Assuming 58mm paper width with 8 dots/mm resolution (58mm * 8dots/mm = 384 dots)
  //         left: 50, // No left padding
  //         // align: "CENTER"
  //       }

  //       // Print the image
  //       await BluetoothEscposPrinter.printPic(fileStore, options)
  //     }

  //     await BluetoothEscposPrinter.printerAlign(
  //       BluetoothEscposPrinter.ALIGN.CENTER,
  //     )
  //     await BluetoothEscposPrinter.printText(shopName.toUpperCase(), {
  //       align: "center",
  //       widthtimes: 1.2,
  //       heigthtimes: 2,
  //     })
  //     await BluetoothEscposPrinter.printText("\n", {})
  //     // await BluetoothEscposPrinter.printText("hasifughaf", { align: "center" })

  //     // if (receiptSettings?.on_off_flag1 === "Y") {
  //     //     await BluetoothEscposPrinter.printText(receiptSettings?.header1, {})
  //     //     await BluetoothEscposPrinter.printText("\n", {})
  //     // }

  //     // if (receiptSettings?.on_off_flag2 === "Y") {
  //     //     await BluetoothEscposPrinter.printText(receiptSettings?.header2, {})
  //     // }
  //     // await BluetoothEscposPrinter.printText("\n", {})
  //     await BluetoothEscposPrinter.printText("------------------------", {
  //       align: "center",
  //     })

  //     await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printText("DUE REPORT", {
  //       align: "center",
  //     })

  //     await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printText("------------------------", {
  //       align: "center",
  //     })

  //     await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printText(
  //       `Date: ${new Date(date).toLocaleDateString(
  //         "en-GB",
  //       )}`,
  //       {},
  //     )

  //     await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printText("------------------------", {
  //       align: "center",
  //     })

  //     // await BluetoothEscposPrinter.printText("\n", {})
  //     // await BluetoothEscposPrinter.printText(address, {
  //     //   align: "center",
  //     // })
  //     // await BluetoothEscposPrinter.printText("\n", {})
  //     // await BluetoothEscposPrinter.printText(location, {
  //     //   align: "center",
  //     // })
  //     // await BluetoothEscposPrinter.printText("\n", {})

  //     // await BluetoothEscposPrinter.printText("------------------------", {
  //     //   align: "center",
  //     // })
  //     await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printerAlign(
  //       BluetoothEscposPrinter.ALIGN.CENTER,
  //     )

  //     await BluetoothEscposPrinter.printColumn(
  //       columnWidthsProductsHeaderAndBody,
  //       [
  //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //       ],
  //       ["Sl.", "NAME", "PH", "DUE"],
  //       {},
  //     )

  //     await BluetoothEscposPrinter.printText("------------------------", {
  //       align: "center",
  //     })

  //     await BluetoothEscposPrinter.printText("\n", {})

  //     let i = 0
  //     let totalDue = 0
  //     for (const item of dueReport) {
  //       i++
  //       totalDue += item?.due_amt
  //       await BluetoothEscposPrinter.printColumn(
  //         columnWidthsProductsHeaderAndBody,
  //         [
  //           BluetoothEscposPrinter.ALIGN.LEFT,
  //           BluetoothEscposPrinter.ALIGN.LEFT,
  //           BluetoothEscposPrinter.ALIGN.RIGHT,
  //           BluetoothEscposPrinter.ALIGN.RIGHT,
  //         ],
  //         [
  //           i?.toString(),
  //           item?.cust_name,
  //           item?.phone_no,
  //           item?.due_amt?.toString()
  //         ],
  //         {},
  //       )
  //     }

  //     await BluetoothEscposPrinter.printText("------------------------", {
  //       align: "center",
  //     })

  //     await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printColumn(
  //       columnWidthsTotals,
  //       [BluetoothEscposPrinter.ALIGN.CENTER],
  //       [
  //         `TOTAL DUE: ${totalDue.toString()}`,
  //       ],
  //       {},
  //     )

  //     await BluetoothEscposPrinter.printText("------------------------", {
  //       align: "center",
  //     })
  //     await BluetoothEscposPrinter.printText("\n", {})

  //     // if (receiptSettings?.on_off_flag3 === "Y") {
  //     //     await BluetoothEscposPrinter.printText(receiptSettings?.footer1, {})
  //     //     await BluetoothEscposPrinter.printText("\n", {})
  //     // }
  //     // if (receiptSettings?.on_off_flag4 === "Y") {
  //     //     await BluetoothEscposPrinter.printText(receiptSettings?.footer2, {})
  //     // }
  //     // await BluetoothEscposPrinter.printText("\n", {})

  //     // await BluetoothEscposPrinter.printText(
  //     //     "THANK YOU, VISIT AGAIN!",
  //     //     { align: "center" },
  //     // )

  //     // await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printText("------X------", {})
  //     await BluetoothEscposPrinter.printText("\n\r\n\r\n\r", {})
  //   } catch (e) {
  //     console.log(e.message || "ERROR")
  //   }
  // }

  // async function printCustomerLedger(
  //   cusLed: CustomerLedgerData[]
  // ) {
  //   const loginStore = JSON.parse(loginStorage.getString("login-data"))
  //   const fileStore = fileStorage.getString("file-data")

  //   const shopName: string = loginStore?.company_name?.toString()
  //   const address: string = loginStore?.address?.toString()
  //   const location: string = loginStore?.branch_name?.toString()
  //   const shopMobile: string = loginStore?.phone_no?.toString()
  //   const shopEmail: string = loginStore?.email_id?.toString()
  //   // const cashier: string = loginStore?.user_name?.toString()

  //   let totalQuantities: number = 0
  //   let totalPrice: number = 0
  //   let totalDiscount: number = 0
  //   let totalGSTs: number = 0
  //   let totalNet: number = 0

  //   try {
  //     let columnWidths = [11, 1, 18]
  //     let columnWidthsHeader = [8, 1, 21]
  //     // let columnWidthsProductsHeaderAndBody = [5, 4, 7, 6, 6, 4] // 0 in hand
  //     let columnWidthsProductsHeaderAndBody = [11, 6, 6, 7]
  //     // let columnWidthsTotals = [15, 15]
  //     let columnWidthsTotals = [32]
  //     let columnWidthIfNameIsBig = [32]

  //     // let newColumnWidths: number[] = [9, 9, 6, 7]

  //     if (fileStore?.length > 0) {
  //       await BluetoothEscposPrinter.printerAlign(
  //         BluetoothEscposPrinter.ALIGN.CENTER,
  //       )
  //       const options = {
  //         width: 250, // Assuming 58mm paper width with 8 dots/mm resolution (58mm * 8dots/mm = 384 dots)
  //         left: 50, // No left padding
  //         // align: "CENTER"
  //       }

  //       // Print the image
  //       await BluetoothEscposPrinter.printPic(fileStore, options)
  //     }

  //     await BluetoothEscposPrinter.printerAlign(
  //       BluetoothEscposPrinter.ALIGN.CENTER,
  //     )
  //     await BluetoothEscposPrinter.printText(shopName.toUpperCase(), {
  //       align: "center",
  //       widthtimes: 1.2,
  //       heigthtimes: 2,
  //     })
  //     await BluetoothEscposPrinter.printText("\n", {})
  //     // await BluetoothEscposPrinter.printText("hasifughaf", { align: "center" })

  //     // if (receiptSettings?.on_off_flag1 === "Y") {
  //     //     await BluetoothEscposPrinter.printText(receiptSettings?.header1, {})
  //     //     await BluetoothEscposPrinter.printText("\n", {})
  //     // }

  //     // if (receiptSettings?.on_off_flag2 === "Y") {
  //     //     await BluetoothEscposPrinter.printText(receiptSettings?.header2, {})
  //     // }
  //     // await BluetoothEscposPrinter.printText("\n", {})
  //     await BluetoothEscposPrinter.printText("------------------------", {
  //       align: "center",
  //     })

  //     await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printText("CUSTOMER LEDGER", {
  //       align: "center",
  //     })

  //     await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printText("------------------------", {
  //       align: "center",
  //     })

  //     await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printText(
  //       `NAME: ${cusLed[0]?.cust_name}`,
  //       {},
  //     )
  //     await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printText(
  //       `PH.: ${cusLed[0]?.phone_no?.toString()}`,
  //       {},
  //     )

  //     await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printText("------------------------", {
  //       align: "center",
  //     })

  //     // await BluetoothEscposPrinter.printText("\n", {})
  //     // await BluetoothEscposPrinter.printText(address, {
  //     //   align: "center",
  //     // })
  //     // await BluetoothEscposPrinter.printText("\n", {})
  //     // await BluetoothEscposPrinter.printText(location, {
  //     //   align: "center",
  //     // })
  //     // await BluetoothEscposPrinter.printText("\n", {})

  //     // await BluetoothEscposPrinter.printText("------------------------", {
  //     //   align: "center",
  //     // })
  //     await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printerAlign(
  //       BluetoothEscposPrinter.ALIGN.CENTER,
  //     )

  //     await BluetoothEscposPrinter.printColumn(
  //       columnWidthsProductsHeaderAndBody,
  //       [
  //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //       ],
  //       ["R. DT", "PAID", "DUE", "BAL"],
  //       {},
  //     )

  //     await BluetoothEscposPrinter.printText("------------------------", {
  //       align: "center",
  //     })

  //     await BluetoothEscposPrinter.printText("\n", {})

  //     let totalDue = 0
  //     for (const item of cusLed) {
  //       totalDue += item?.due_amt
  //       await BluetoothEscposPrinter.printColumn(
  //         columnWidthsProductsHeaderAndBody,
  //         [
  //           BluetoothEscposPrinter.ALIGN.LEFT,
  //           BluetoothEscposPrinter.ALIGN.LEFT,
  //           BluetoothEscposPrinter.ALIGN.RIGHT,
  //           BluetoothEscposPrinter.ALIGN.RIGHT,
  //         ],
  //         [
  //           item?.recover_dt,
  //           item?.paid_amt?.toString(),
  //           item?.due_amt?.toString(),
  //           item?.balance?.toString(),
  //         ],
  //         {},
  //       )
  //     }

  //     await BluetoothEscposPrinter.printText("------------------------", {
  //       align: "center",
  //     })

  //     await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printColumn(
  //       columnWidthsTotals,
  //       [BluetoothEscposPrinter.ALIGN.CENTER],
  //       [
  //         `TOTAL DUE: ${totalDue.toString()}`,
  //       ],
  //       {},
  //     )

  //     await BluetoothEscposPrinter.printText("------------------------", {
  //       align: "center",
  //     })
  //     await BluetoothEscposPrinter.printText("\n", {})

  //     // if (receiptSettings?.on_off_flag3 === "Y") {
  //     //     await BluetoothEscposPrinter.printText(receiptSettings?.footer1, {})
  //     //     await BluetoothEscposPrinter.printText("\n", {})
  //     // }
  //     // if (receiptSettings?.on_off_flag4 === "Y") {
  //     //     await BluetoothEscposPrinter.printText(receiptSettings?.footer2, {})
  //     // }
  //     // await BluetoothEscposPrinter.printText("\n", {})

  //     // await BluetoothEscposPrinter.printText(
  //     //     "THANK YOU, VISIT AGAIN!",
  //     //     { align: "center" },
  //     // )

  //     // await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printText("------X------", {})
  //     await BluetoothEscposPrinter.printText("\n\r\n\r\n\r", {})
  //   } catch (e) {
  //     console.log(e.message || "ERROR")
  //   }
  // }

  async function printRecoveryReport(
    recoveryReport: RecoveryReportData[],
    fromDate: string,
    toDate: string,
  ) {
    const loginStore = JSON.parse(loginStorage.getString("login-data"))
    const fileStore = fileStorage.getString("file-data")

    const shopName: string = loginStore?.company_name?.toString()
    const address: string = loginStore?.address?.toString()
    const location: string = loginStore?.branch_name?.toString()
    const shopMobile: string = loginStore?.phone_no?.toString()
    const shopEmail: string = loginStore?.email_id?.toString()
    // const cashier: string = loginStore?.user_name?.toString()

    let totalNet: number = 0
    let totalDue: number = 0

    try {
      let columnWidths = [11, 1, 18]
      let columnWidthsHeader = [8, 1, 21]
      // let columnWidthsProductsHeaderAndBody = [5, 4, 7, 6, 6, 4] // 0 in hand
      let columnWidthsProductsHeaderAndBody = [11, 8, 6, 7] // 0 in hand
      // let columnWidthsProductsHeaderAndBody = [18, 3, 4, 3, 4]
      // let columnWidthsTotals = [15, 15]
      let columnWidthsTotals = [32]
      let columnWidthIfNameIsBig = [32]

      // let newColumnWidths: number[] = [9, 9, 6, 7]

      if (fileStore?.length > 0) {
        await BluetoothEscposPrinter.printerAlign(
          BluetoothEscposPrinter.ALIGN.CENTER,
        )
        const options = {
          width: 250, // Assuming 58mm paper width with 8 dots/mm resolution (58mm * 8dots/mm = 384 dots)
          left: 50, // No left padding
          // align: "CENTER"
        }

        // Print the image
        await BluetoothEscposPrinter.printPic(fileStore, options)
      }

      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.CENTER,
      )
      await BluetoothEscposPrinter.printText(shopName.toUpperCase(), {
        align: "center",
        widthtimes: 1.2,
        heigthtimes: 2,
      })
      await BluetoothEscposPrinter.printText("\n", {})
      // await BluetoothEscposPrinter.printText("hasifughaf", { align: "center" })

      // if (receiptSettings?.on_off_flag1 === "Y") {
      //     await BluetoothEscposPrinter.printText(receiptSettings?.header1, {})
      //     await BluetoothEscposPrinter.printText("\n", {})
      // }

      // if (receiptSettings?.on_off_flag2 === "Y") {
      //     await BluetoothEscposPrinter.printText(receiptSettings?.header2, {})
      // }
      // await BluetoothEscposPrinter.printText("\n", {})
      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText("RECOVERY REPORT", {
        align: "center",
      })

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText(
        `From: ${new Date(fromDate).toLocaleDateString(
          "en-GB",
        )}  To: ${new Date(toDate).toLocaleDateString("en-GB")}`,
        {},
      )

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })

      // await BluetoothEscposPrinter.printText("\n", {})
      // await BluetoothEscposPrinter.printText(address, {
      //   align: "center",
      // })
      // await BluetoothEscposPrinter.printText("\n", {})
      // await BluetoothEscposPrinter.printText(location, {
      //   align: "center",
      // })
      // await BluetoothEscposPrinter.printText("\n", {})

      // await BluetoothEscposPrinter.printText("------------------------", {
      //   align: "center",
      // })
      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.CENTER,
      )

      await BluetoothEscposPrinter.printColumn(
        columnWidthsProductsHeaderAndBody,
        [
          // BluetoothEscposPrinter.ALIGN.LEFT,
          BluetoothEscposPrinter.ALIGN.LEFT,
          BluetoothEscposPrinter.ALIGN.LEFT,
          BluetoothEscposPrinter.ALIGN.RIGHT,
          BluetoothEscposPrinter.ALIGN.RIGHT,
          // BluetoothEscposPrinter.ALIGN.RIGHT,
        ],
        ["R. DT.", "NAME", "PHONE", "R. AMT"],
        {},
      )

      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })

      await BluetoothEscposPrinter.printText("\n", {})

      let totalRecover = 0
      for (const item of recoveryReport) {
        totalRecover += item?.recovery_amt

        await BluetoothEscposPrinter.printColumn(
          columnWidthsProductsHeaderAndBody,
          [
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.RIGHT,
            BluetoothEscposPrinter.ALIGN.RIGHT,
          ],
          [
            item?.recover_dt,
            item?.cust_name,
            item?.phone_no,
            item?.recovery_amt?.toString(),
          ],
          {},
        )
      }

      // await BluetoothEscposPrinter.printText("\n", {})
      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printColumn(
        columnWidthsTotals,
        [BluetoothEscposPrinter.ALIGN.CENTER],
        [
          `TOTAL RECOVER: ${totalRecover.toString()}`,
        ],
        {},
      )

      // await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })

      // await BluetoothEscposPrinter.printText("\n", {})

      // if (receiptSettings?.on_off_flag3 === "Y") {
      //     await BluetoothEscposPrinter.printText(receiptSettings?.footer1, {})
      //     await BluetoothEscposPrinter.printText("\n", {})
      // }
      // if (receiptSettings?.on_off_flag4 === "Y") {
      //     await BluetoothEscposPrinter.printText(receiptSettings?.footer2, {})
      // }
      // await BluetoothEscposPrinter.printText("\n", {})

      // await BluetoothEscposPrinter.printText(
      //     "THANK YOU, VISIT AGAIN!",
      //     { align: "center" },
      // )

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText("------X------", {})
      await BluetoothEscposPrinter.printText("\n\r\n\r\n\r", {})
    } catch (e) {
      console.log(e.message || "ERROR")
    }
  }


  async function printBillCalculateMode(receiptNumber: number, bill: Bill[], totalQty: number, totalPrice: number) {
    const loginStore = JSON.parse(loginStorage.getString("login-data"))
    const fileStore = fileStorage.getString("file-data")

    const shopName: string = loginStore?.company_name?.toString()

    try {
      let columnWidths = [11, 1, 18]
      let columnWidthsHeader = [8, 1, 21]
      // let columnWidthsProductsHeaderAndBody = [5, 4, 8, 6, 4, 4] // 1 in hand
      // let columnWidthsProductsHeaderAndBody = [5, 5, 5, 8, 8] // 1 in hand
      let columnWidthsProductsHeaderAndBody = [8, 7, 7, 8] // 2 in hand
      // let columnWidthsProductsHeaderAndBody = [19, 9] // 2 in hand
      // let columnWidthsProductsHeaderAndBody = [18, 3, 4, 3, 4]
      let columnWidthsTotals = [15, 15]
      let columnWidthIfNameIsBig = [32]

      // let newColumnWidths: number[] = [9, 9, 6, 7]

      if (fileStore?.length > 0) {
        await BluetoothEscposPrinter.printerAlign(
          BluetoothEscposPrinter.ALIGN.CENTER,
        )
        const options = {
          width: 250, // Assuming 58mm paper width with 8 dots/mm resolution (58mm * 8dots/mm = 384 dots)
          left: 50, // No left padding
          // align: "CENTER"
        }

        // Print the image
        await BluetoothEscposPrinter.printPic(fileStore, options)
      }

      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.CENTER,
      )
      await BluetoothEscposPrinter.printText(shopName.toUpperCase(), {
        align: "center",
        widthtimes: 1.2,
        heigthtimes: 2,
      })
      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText("RECEIPT", {
        align: "center",
      })

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printColumn(
        columnWidthsTotals,
        [
          BluetoothEscposPrinter.ALIGN.LEFT,
          BluetoothEscposPrinter.ALIGN.RIGHT,
        ],
        ["RCPT. NO.", `${receiptNumber?.toString()}`],
        {},
      )

      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.CENTER,
      )
      await BluetoothEscposPrinter.printColumn(
        columnWidthsProductsHeaderAndBody,
        [
          BluetoothEscposPrinter.ALIGN.LEFT,
          BluetoothEscposPrinter.ALIGN.CENTER,
          BluetoothEscposPrinter.ALIGN.CENTER,
          BluetoothEscposPrinter.ALIGN.RIGHT,
        ],
        ["S NO.", "QTY", "RATE", "AMOUNT"],
        {},
      )

      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })

      await BluetoothEscposPrinter.printText("\n", {})

      for (const item of bill) {
        await BluetoothEscposPrinter.printColumn(
          columnWidthsProductsHeaderAndBody,
          [
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.CENTER,
            BluetoothEscposPrinter.ALIGN.CENTER,
            BluetoothEscposPrinter.ALIGN.RIGHT,
          ],
          [
            `${item?.id?.toString()}`, `${item?.qty?.toString()}`,
            `${item?.price?.toString()}`, `${item?.total?.toString()}`,
          ],
          {},
        )
      }

      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printColumn(
        columnWidthsTotals,
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        [
          `QTY: ${totalQty?.toString()}`,
          `NET: ${totalPrice?.toString()}`,
        ],
        {},
      )

      await BluetoothEscposPrinter.printColumn(
        columnWidthsTotals,
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        [
          `GRAND: ${(totalPrice + parseFloat(roundingOffCalculate(totalPrice, 0)))?.toFixed(2)}`,
          `ROUND: ${roundingOffCalculate(totalPrice, 0)}`,
        ],
        {},
      )

      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })

      // await BluetoothEscposPrinter.printText("\n", {})
      // if (receiptSettings?.on_off_flag3 === "Y") {
      //     await BluetoothEscposPrinter.printText(receiptSettings?.footer1, {})
      //     await BluetoothEscposPrinter.printText("\n", {})
      // }
      // if (receiptSettings?.on_off_flag4 === "Y") {
      //     await BluetoothEscposPrinter.printText(receiptSettings?.footer2, {})
      // }
      // await BluetoothEscposPrinter.printText("\n", {})

      // await BluetoothEscposPrinter.printText(
      //     "THANK YOU, VISIT AGAIN!",
      //     { align: "center" },
      // )

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText("------X------", {})
      await BluetoothEscposPrinter.printText("\n\r\n\r\n\r", {})
    } catch (e) {
      console.log(e.message || "ERROR")
    }
  }

  async function printDuplicateBillCalculateMode(bill: CalculatorShowBillData[]) {
    const loginStore = JSON.parse(loginStorage.getString("login-data"))
    const fileStore = fileStorage.getString("file-data")

    const shopName: string = loginStore?.company_name?.toString()

    try {
      let columnWidths = [11, 1, 18]
      let columnWidthsHeader = [8, 1, 21]
      // let columnWidthsProductsHeaderAndBody = [5, 4, 8, 6, 4, 4] // 1 in hand
      // let columnWidthsProductsHeaderAndBody = [5, 5, 5, 8, 8] // 1 in hand
      let columnWidthsProductsHeaderAndBody = [8, 7, 7, 8] // 2 in hand
      // let columnWidthsProductsHeaderAndBody = [19, 9] // 2 in hand
      // let columnWidthsProductsHeaderAndBody = [18, 3, 4, 3, 4]
      let columnWidthsTotals = [15, 15]
      let columnWidthIfNameIsBig = [32]

      // let newColumnWidths: number[] = [9, 9, 6, 7]

      if (fileStore?.length > 0) {
        await BluetoothEscposPrinter.printerAlign(
          BluetoothEscposPrinter.ALIGN.CENTER,
        )
        const options = {
          width: 250, // Assuming 58mm paper width with 8 dots/mm resolution (58mm * 8dots/mm = 384 dots)
          left: 50, // No left padding
          // align: "CENTER"
        }

        // Print the image
        await BluetoothEscposPrinter.printPic(fileStore, options)
      }

      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.CENTER,
      )
      await BluetoothEscposPrinter.printText(shopName.toUpperCase(), {
        align: "center",
        widthtimes: 1.2,
        heigthtimes: 2,
      })
      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText("DUPLICATE RECEIPT", {
        align: "center",
      })

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printColumn(
        columnWidthsTotals,
        [
          BluetoothEscposPrinter.ALIGN.LEFT,
          BluetoothEscposPrinter.ALIGN.RIGHT,
        ],
        ["RCPT. NO.", `${bill[0]?.receipt_no?.toString()}`],
        {},
      )

      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.CENTER,
      )
      await BluetoothEscposPrinter.printColumn(
        columnWidthsProductsHeaderAndBody,
        [
          BluetoothEscposPrinter.ALIGN.LEFT,
          BluetoothEscposPrinter.ALIGN.CENTER,
          BluetoothEscposPrinter.ALIGN.CENTER,
          BluetoothEscposPrinter.ALIGN.RIGHT,
        ],
        ["S NO.", "QTY", "RATE", "AMOUNT"],
        {},
      )

      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })

      await BluetoothEscposPrinter.printText("\n", {})

      let i = 0
      let totalQty = 0
      for (const item of bill) {
        i++
        totalQty += item?.qty
        await BluetoothEscposPrinter.printColumn(
          columnWidthsProductsHeaderAndBody,
          [
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.CENTER,
            BluetoothEscposPrinter.ALIGN.CENTER,
            BluetoothEscposPrinter.ALIGN.RIGHT,
          ],
          [
            `${i?.toString()}`, `${item?.qty?.toString()}`,
            `${item?.price?.toString()}`, `${item?.qty * item?.price}`,
          ],
          {},
        )
      }

      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printColumn(
        columnWidthsTotals,
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        [
          `QTY: ${totalQty?.toString()}`,
          `NET: ${bill[0]?.tprice?.toString()}`,
        ],
        {},
      )

      await BluetoothEscposPrinter.printColumn(
        columnWidthsTotals,
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        [
          `GRAND: ${bill[0]?.net_amt?.toString()}`,
          `ROUND: ${bill[0]?.round_off?.toString()}`,
        ],
        {},
      )

      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })

      // await BluetoothEscposPrinter.printText("\n", {})
      // if (receiptSettings?.on_off_flag3 === "Y") {
      //     await BluetoothEscposPrinter.printText(receiptSettings?.footer1, {})
      //     await BluetoothEscposPrinter.printText("\n", {})
      // }
      // if (receiptSettings?.on_off_flag4 === "Y") {
      //     await BluetoothEscposPrinter.printText(receiptSettings?.footer2, {})
      // }
      // await BluetoothEscposPrinter.printText("\n", {})

      // await BluetoothEscposPrinter.printText(
      //     "THANK YOU, VISIT AGAIN!",
      //     { align: "center" },
      // )

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText("------X------", {})
      await BluetoothEscposPrinter.printText("\n\r\n\r\n\r", {})
    } catch (e) {
      console.log(e.message || "ERROR")
    }
  }

  async function printSaleReportCalculateMode(report: SaleReportCalculateModeData[], fromDate: string, toDate: string) {
    const loginStore = JSON.parse(loginStorage.getString("login-data"))
    const fileStore = fileStorage.getString("file-data")

    const shopName: string = loginStore?.company_name?.toString()

    try {
      let columnWidths = [11, 1, 18]
      let columnWidthsHeader = [8, 1, 21]
      // let columnWidthsProductsHeaderAndBody = [5, 4, 8, 6, 4, 4] // 1 in hand
      // let columnWidthsProductsHeaderAndBody = [5, 5, 5, 8, 8] // 1 in hand
      let columnWidthsProductsHeaderAndBody = [8, 7, 7, 8] // 2 in hand
      // let columnWidthsProductsHeaderAndBody = [19, 9] // 2 in hand
      // let columnWidthsProductsHeaderAndBody = [18, 3, 4, 3, 4]
      let columnWidthsTotals = [15, 15]
      let columnWidthIfNameIsBig = [32]

      // let newColumnWidths: number[] = [9, 9, 6, 7]

      if (fileStore?.length > 0) {
        await BluetoothEscposPrinter.printerAlign(
          BluetoothEscposPrinter.ALIGN.CENTER,
        )
        const options = {
          width: 250, // Assuming 58mm paper width with 8 dots/mm resolution (58mm * 8dots/mm = 384 dots)
          left: 50, // No left padding
          // align: "CENTER"
        }

        // Print the image
        await BluetoothEscposPrinter.printPic(fileStore, options)
      }

      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.CENTER,
      )
      await BluetoothEscposPrinter.printText(shopName.toUpperCase(), {
        align: "center",
        widthtimes: 1.2,
        heigthtimes: 2,
      })
      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText("SALE REPORT", {
        align: "center",
      })

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText(
        `From: ${new Date(fromDate).toLocaleDateString(
          "en-GB",
        )}  To: ${new Date(toDate).toLocaleDateString("en-GB")}`,
        {},
      )

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.CENTER,
      )
      await BluetoothEscposPrinter.printColumn(
        columnWidthsProductsHeaderAndBody,
        [
          BluetoothEscposPrinter.ALIGN.LEFT,
          BluetoothEscposPrinter.ALIGN.CENTER,
          BluetoothEscposPrinter.ALIGN.CENTER,
          BluetoothEscposPrinter.ALIGN.RIGHT,
        ],
        ["RCPT", "ITEMS", "RATE", "AMOUNT"],
        {},
      )

      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })

      await BluetoothEscposPrinter.printText("\n", {})

      let i = 0
      let totalQty = 0
      let totalNet = 0
      for (const item of report) {
        i++
        totalQty += item?.no_of_items
        totalNet += item?.net_amt
        await BluetoothEscposPrinter.printColumn(
          columnWidthsProductsHeaderAndBody,
          [
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.CENTER,
            BluetoothEscposPrinter.ALIGN.CENTER,
            BluetoothEscposPrinter.ALIGN.RIGHT,
          ],
          [
            `${item?.receipt_no
              ?.toString()
              ?.substring(item?.receipt_no?.toString()?.length - 4)}`, `${item?.no_of_items?.toString()}`,
            `${item?.price?.toString()}`, `${item?.net_amt}`,
          ],
          {},
        )
      }

      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printColumn(
        columnWidthsTotals,
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        [
          `QTY: ${totalQty?.toString()}`,
          `NET: ${totalNet?.toString()}`,
        ],
        {},
      )

      await BluetoothEscposPrinter.printText("------------------------", {
        align: "center",
      })

      await BluetoothEscposPrinter.printText("\n", {})

      await BluetoothEscposPrinter.printText("------X------", {})
      await BluetoothEscposPrinter.printText("\n\r\n\r\n\r", {})
    } catch (e) {
      console.log(e.message || "ERROR")
    }
  }

  // async function printRecoveryAmount(recAmt: RecoveryAmountResponseData[]) {
  //   const loginStore = JSON.parse(loginStorage.getString("login-data"))
  //   const fileStore = fileStorage.getString("file-data")

  //   const shopName: string = loginStore?.company_name?.toString()
  //   const address: string = loginStore?.address?.toString()
  //   const location: string = loginStore?.branch_name?.toString()
  //   const shopMobile: string = loginStore?.phone_no?.toString()
  //   const shopEmail: string = loginStore?.email_id?.toString()
  //   // const cashier: string = loginStore?.user_name?.toString()

  //   let totalNet: number = 0
  //   let totalDue: number = 0

  //   try {
  //     let columnWidths = [11, 1, 18]
  //     let columnWidthsHeader = [8, 1, 21]
  //     // let columnWidthsProductsHeaderAndBody = [5, 4, 7, 6, 6, 4] // 0 in hand
  //     let columnWidthsProductsHeaderAndBody = [11, 8, 6, 7] // 0 in hand
  //     // let columnWidthsProductsHeaderAndBody = [18, 3, 4, 3, 4]
  //     // let columnWidthsTotals = [15, 15]
  //     let columnWidthsTotals = [32]
  //     let columnWidthIfNameIsBig = [32]

  //     // let newColumnWidths: number[] = [9, 9, 6, 7]

  //     if (fileStore?.length > 0) {
  //       await BluetoothEscposPrinter.printerAlign(
  //         BluetoothEscposPrinter.ALIGN.CENTER,
  //       )
  //       const options = {
  //         width: 250, // Assuming 58mm paper width with 8 dots/mm resolution (58mm * 8dots/mm = 384 dots)
  //         left: 50, // No left padding
  //         // align: "CENTER"
  //       }

  //       // Print the image
  //       await BluetoothEscposPrinter.printPic(fileStore, options)
  //     }

  //     await BluetoothEscposPrinter.printerAlign(
  //       BluetoothEscposPrinter.ALIGN.CENTER,
  //     )
  //     await BluetoothEscposPrinter.printText(shopName.toUpperCase(), {
  //       align: "center",
  //       widthtimes: 1.2,
  //       heigthtimes: 2,
  //     })
  //     await BluetoothEscposPrinter.printText("\n", {})
  //     // await BluetoothEscposPrinter.printText("hasifughaf", { align: "center" })

  //     // if (receiptSettings?.on_off_flag1 === "Y") {
  //     //     await BluetoothEscposPrinter.printText(receiptSettings?.header1, {})
  //     //     await BluetoothEscposPrinter.printText("\n", {})
  //     // }

  //     // if (receiptSettings?.on_off_flag2 === "Y") {
  //     //     await BluetoothEscposPrinter.printText(receiptSettings?.header2, {})
  //     // }
  //     // await BluetoothEscposPrinter.printText("\n", {})
  //     await BluetoothEscposPrinter.printText("------------------------", {
  //       align: "center",
  //     })

  //     await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printText("RECOVERY", {
  //       align: "center",
  //     })

  //     await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printText("------------------------", {
  //       align: "center",
  //     })

  //     await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printText(
  //       `DATE: ${new Date().toLocaleDateString(
  //         "en-GB",
  //       )}`,
  //       {},
  //     )

  //     await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printText("------------------------", {
  //       align: "center",
  //     })

  //     await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printText(
  //       `TOTAL PAID: ${recAmt[0]?.paid_amt}`,
  //       {},
  //     )

  //     await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printText(
  //       `TOTAL DUE: ${recAmt[0]?.net_amt - recAmt[0]?.paid_amt}`,
  //       {},
  //     )

  //     await BluetoothEscposPrinter.printText("\n", {})
  //     await BluetoothEscposPrinter.printText("------------------------", {
  //       align: "center",
  //     })

  //     // await BluetoothEscposPrinter.printText("\n", {})

  //     // if (receiptSettings?.on_off_flag3 === "Y") {
  //     //     await BluetoothEscposPrinter.printText(receiptSettings?.footer1, {})
  //     //     await BluetoothEscposPrinter.printText("\n", {})
  //     // }
  //     // if (receiptSettings?.on_off_flag4 === "Y") {
  //     //     await BluetoothEscposPrinter.printText(receiptSettings?.footer2, {})
  //     // }
  //     // await BluetoothEscposPrinter.printText("\n", {})

  //     // await BluetoothEscposPrinter.printText(
  //     //     "THANK YOU, VISIT AGAIN!",
  //     //     { align: "center" },
  //     // )

  //     await BluetoothEscposPrinter.printText("\n", {})

  //     await BluetoothEscposPrinter.printText("------X------", {})
  //     await BluetoothEscposPrinter.printText("\n\r\n\r\n\r", {})
  //   } catch (e) {
  //     console.log(e.message || "ERROR")
  //   }
  // }

  return {
    // printReceipt,
    // printReceiptWithoutGst,
    // rePrint,
    // rePrintWithoutGst,
    printSaleReport,
    printCollectionReport,
    printItemReport,
    printGstStatement,
    printGstSummary,
    printStockReport,
    printUserwiseReport,
    printCancelledBillsReport,
    printRefundReport,
    printCreditReport,
    printRecovery,
    printDaybookReport,
    printDueReport,
    printCustomerLedger,
    printRecoveryReport,
    printBillCalculateMode,
    printDuplicateBillCalculateMode,
    printSaleReportCalculateMode,
    printRecoveryAmount,



    ////////////////////////////////////
    printReceiptT,
    rePrintT,
    printProductwiseSaleReport,
    printSaleSummaryReport
  }
}
