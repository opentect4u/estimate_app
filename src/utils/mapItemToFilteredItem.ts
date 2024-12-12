import useCalculations from "../hooks/useCalculations"
import { ItemsData, ReceiptSettingsData } from "../models/api_types"
import { FilteredItem } from "../models/custom_types"
import { ProductsScreenRouteProp } from "../models/route_types"

export function mapItemToFilteredItem(
  item: ItemsData,
  receiptSettings: ReceiptSettingsData,
  branchId: string,
  params: any,
  checked: string,
  cashAmount: number,
  customerName: string,
  customerMobileNumber: string,
  createdBy: string,
  totalGST: number,
  gstFlag: "Y" | "N",
  gstType: "E" | "I",
  discountFlag: "Y" | "N",
  discountType: "P" | "A",
  discountPosition: "B" | "I",
  receiptType: "P" | "S" | "B",
  customerInfoFlag: number,
  stockFlag: "Y" | "N",

  discountBillwise: number
): FilteredItem {
  const {
    netTotalWithGSTInclCalculate,
    netTotalWithGSTCalculate,
    grandTotalCalculate,
    roundingOffCalculate
  } = useCalculations()
  const { cgst, sgst, comp_id, discount, item_id, quantity, price } = item

  // const cgstAmt = receiptSettings?.gst_flag === "N" ? 0 : (price * quantity * cgst / 100)
  // const sgstAmt = receiptSettings?.gst_flag === "N" ? 0 : (price * quantity * sgst / 100)
  let cgstAmt = 0
  let sgstAmt = 0

  let priceBeforeGst = 0

  if (receiptSettings?.gst_flag === "Y") {
    if (receiptSettings?.gst_type === "E") {
      cgstAmt = (price * quantity * cgst) / 100
      sgstAmt = (price * quantity * sgst) / 100
    } else {
      priceBeforeGst = price / (1 + (cgst + sgst) / 100)
      cgstAmt = sgstAmt = ((price - priceBeforeGst) * quantity) / 2
    }
  } else {
    cgstAmt = sgstAmt = 0
  }

  const discountAmt =
    receiptSettings?.discount_flag === "Y" &&
      receiptSettings?.discount_position !== "B"
      ? receiptSettings?.discount_type === "P"
        ? parseFloat(((price * quantity * discount) / 100).toFixed(2))
        : // parseFloat(discount.toFixed(2))
        //@ts-ignore
        parseFloat(discount)
      : 0

  let amount: number = 0
  if (receiptSettings?.gst_flag !== "N") {
    if (receiptSettings?.gst_type === "E") {
      // amount = parseFloat((params?.net_total - params?.total_discount + totalGST).toFixed(2))
      amount = parseFloat(
        netTotalWithGSTCalculate(
          parseFloat(params?.net_total),
          receiptSettings?.discount_position !== "B"
            ? parseFloat(params?.total_discount)
            : receiptSettings?.discount_type === "A"
              //@ts-ignore
              ? parseFloat(discountBillwise)
              //@ts-ignore
              : parseFloat(params?.net_total * discountBillwise) / 100,
          totalGST,
        ),
      )
    } else {
      // amount = parseFloat((params?.net_total - params?.total_discount).toFixed(2))
      amount = parseFloat(
        netTotalWithGSTInclCalculate(
          parseFloat(params?.net_total),
          receiptSettings?.discount_position !== "B"
            ? parseFloat(params?.total_discount)
            //@ts-ignore
            : receiptSettings?.discount_type === "A"
              //@ts-ignore
              ? parseFloat(discountBillwise)
              //@ts-ignore
              : parseFloat(params?.net_total * discountBillwise) / 100,
        ),
      )
    }
  } else {
    // amount = parseFloat((params?.net_total - params?.total_discount).toFixed(2))
    amount = grandTotalCalculate(
      parseFloat(params?.net_total),
      receiptSettings?.discount_position !== "B"
        ? parseFloat(params?.total_discount)
        //@ts-ignore
        : receiptSettings?.discount_type === "A"
          //@ts-ignore
          ? parseFloat(discountBillwise)
          //@ts-ignore
          : parseFloat(params?.net_total * discountBillwise) / 100,
    )
  }

  // let amount = receiptSettings?.gst_flag !== "N" ? parseFloat((params?.net_total - params?.total_discount + totalGST).toFixed(2)) : parseFloat((params?.net_total - params?.total_discount).toFixed(2))

  // const amount = parseFloat((params?.net_total - params?.total_discount).toFixed(2))
  const roundOff = parseFloat((Math.round(amount) - amount).toFixed(2))
  // console.log("LSLSLSLSOIEDJDS", roundOff)
  const netAmt = Math.round(amount)

  return {
    cgst_amt: cgstAmt,
    sgst_amt: sgstAmt,
    comp_id: comp_id,
    discount_amt: discountAmt,
    item_id: item_id,
    qty: quantity,
    price: price,
    // price: price * quantity,
    br_id: parseInt(branchId),
    tprice: parseFloat(params?.net_total?.toFixed(2)), // total price of all the items (td_receipt table)
    tdiscount_amt: receiptSettings?.discount_position !== "B"
      ? parseFloat(parseFloat(params?.total_discount)?.toFixed(2))
      //@ts-ignore
      : receiptSettings?.discount_type === "A"
        //@ts-ignore
        ? parseFloat(parseFloat(discountBillwise).toFixed(2))
        //@ts-ignore
        : parseFloat(parseFloat(parseFloat(params?.net_total) * parseFloat(discountBillwise) / 100).toFixed(2)),
    amount: amount,
    round_off: +roundOff,
    net_amt: netAmt,
    pay_mode: checked,
    received_amt: cashAmount?.toString() || (0).toString(),
    pay_dtls:
      receiptSettings?.discount_type === "P" ? "something P" : "something A",
    cust_name: customerName,
    phone_no: customerMobileNumber,
    created_by: createdBy?.toString(),
    dis_pertg: receiptSettings?.discount_type === "P" ? discount : 0,
    cgst_prtg: receiptSettings?.gst_flag === "Y" ? cgst : 0,
    sgst_prtg: receiptSettings?.gst_flag === "Y" ? sgst : 0,
    gst_flag: gstFlag,
    gst_type: gstType,
    discount_flag: discountFlag,
    discount_type: discountType,
    discount_position: discountPosition,
    rcpt_type: receiptType,
    cust_info_flag: customerInfoFlag,
    stock_flag: stockFlag,
    kot_flag: receiptSettings?.kot_flag,
    table_no: params.table_no || (0).toString(),
    rcv_cash_flag: receiptSettings?.rcv_cash_flag
  }
}
