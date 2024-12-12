import useCalculations from "../hooks/useCalculations"
import { RefundItemCredentials, ShowBillData } from "../models/api_types"

export function mapRefundItemToFilteredItem(
  userId: string,
  refundItem: ShowBillData,
  netTotal: number,
  totalDiscount: number,
  totalGST: number,
  payMode: "C" | "D" | "U",
  cashAmt?: number
): RefundItemCredentials {
  const {
    netTotalWithGSTInclCalculate,
    netTotalWithGSTCalculate,
    grandTotalCalculate,
  } = useCalculations()
  const {
    cgst_amt,
    sgst_amt,
    comp_id,
    discount_amt,
    dis_pertg,
    item_id,
    qty,
    price,
    br_id,
    cgst_prtg,
    sgst_prtg,
    cust_name,
    phone_no,
    // pay_mode,
    discount_type,
    gst_flag,
    receipt_no,
    gst_type,
    discount_position,
    discount_flag
  } = refundItem

  // const cgstAmt = gst_flag === "N" ? 0 : cgst_amt
  // const sgstAmt = gst_flag === "N" ? 0 : sgst_amt

  let cgstAmt = 0
  let sgstAmt = 0

  let priceBeforeGst = 0

  if (refundItem.gst_flag === "Y") {
    if (refundItem.gst_type === "E") {
      cgstAmt = (price * qty * cgst_prtg) / 100
      sgstAmt = (price * qty * sgst_prtg) / 100
    } else {
      priceBeforeGst = price / (1 + (cgst_prtg + sgst_prtg) / 100)
      cgstAmt = sgstAmt = ((price - priceBeforeGst) * qty) / 2
    }
  } else {
    cgstAmt = sgstAmt = 0
  }

  // const discountAmt = discount_type === "P" ?
  //     parseFloat((((price * qty * discount_amt) / 100).toFixed(2))) :
  //     parseFloat((discount_amt).toFixed(2))

  const discountAmt = parseFloat(discount_amt.toFixed(2))

  // const discountAmt = refundItem.discount_flag === "Y"
  //     ? refundItem.discount_type === "P"
  //         ? parseFloat((((price * qty * dis_pertg) / 100).toFixed(2)))
  //         :
  //         // parseFloat(discount.toFixed(2))
  //         //@ts-ignore
  //         parseFloat(discount_amt)
  //     : 0

  // let amount = gst_flag !== "N" ? parseFloat((netTotal - totalDiscount + totalGST).toFixed(2)) : parseFloat((totalDiscount - totalDiscount).toFixed(2))

  let amount: number = 0
  if (refundItem.gst_flag !== "N") {
    if (refundItem.gst_type === "E") {
      // amount = parseFloat((params?.net_total - params?.total_discount + totalGST).toFixed(2))
      amount = parseFloat(
        netTotalWithGSTCalculate(netTotal, totalDiscount, totalGST),
      )
    } else {
      // amount = parseFloat((netTotal - totalDiscount).toFixed(2))
      amount = parseFloat(netTotalWithGSTInclCalculate(netTotal, totalDiscount))
    }
  } else {
    // amount = parseFloat((netTotal - totalDiscount).toFixed(2))
    amount = grandTotalCalculate(netTotal, totalDiscount)
  }

  // const amount = parseFloat((params?.net_total - params?.total_discount).toFixed(2))
  const roundOff = parseFloat((Math.round(amount) - amount).toFixed(2))
  const netAmt = Math.round(amount)

  return {
    user_id: userId,
    cgst_amt: cgstAmt,
    sgst_amt: sgstAmt,
    comp_id: comp_id,
    discount_amt: discountAmt,
    item_id: item_id,
    qty: qty,
    price: price,
    br_id: br_id,
    tprice: parseFloat(netTotal?.toFixed(2)),
    //@ts-ignore
    tdiscount_amt: parseFloat(parseFloat(totalDiscount)?.toFixed(2)),
    tot_refund_amt: amount,
    round_off: roundOff,
    net_amt: netAmt,
    pay_mode: payMode,
    cust_name: cust_name,
    phone_no: phone_no,
    dis_pertg: discount_type === "P" ? dis_pertg : discount_amt,
    cgst_prtg: cgst_prtg || 0,
    sgst_prtg: sgst_prtg || 0,
    gst_flag: gst_flag,
    discount_type: discount_type,
    receipt_no: receipt_no,
    discount_flag: discount_flag,
    discount_position: discount_position,
    gst_type: gst_type,
    received_amt: cashAmt?.toString() || (0).toString(),
  }
}
