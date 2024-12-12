export type BasicResponse = {
  status: number
  data: string
}

export type LoginData = {
  suc: 0 | 1
  msg: LoginDataMessage
  otp: {
    msg: string
    otp: number
  }
  user: number
}

export type LoginDataMessage = {
  id: number
  comp_id: number
  company_name: string
  address: string
  br_id: number
  branch_name: string
  branch_address: string
  user_id: string
  user_name: string
  user_type: "U" | "A" | "M"
  phone_no: number
  email_id: string
  device_id: string
  password: string
  created_by: string
  created_dt: string
  active_flag: "Y" | "N"
  modified_by: string | null
  modified_dt: string | null
  location: number
  logo: string
  web_portal: "N"
  contact_person: string
  max_user: number
  login_flag: "Y" | "N"
  mode: "N" | "C"
}

export type UpdateLoginFlagCredentials = {
  "user_id": string
  // "comp_id": number
}

export type UpdateLoginFlagResponse = {
  "suc": number
  "msg": string
}

export type ReceiptSettingsData = {
  comp_id: number
  rcpt_type: "B" | "S" | "P"
  rcpt_flag: "Y" | "N"
  gst_flag: "N" | "Y"
  gst_type: "I" | "E"
  unit_flag: "Y" | "N"
  cust_inf: "Y" | "N"
  rcv_cash_flag: "Y" | "N"
  pay_mode: "Y" | "N"
  discount_flag: "Y" | "N"
  discount_type: "P" | "A"
  discount_position: "I" | "B"
  stock_flag: "Y" | "N"
  price_type: "A" | "M"
  refund_days: number
  created_by: string
  created_at: string
  modified_by: string
  modified_at: string
  header1: string
  on_off_flag1: "Y" | "N"
  header2: string
  on_off_flag2: "Y" | "N"
  footer1: string
  on_off_flag3: "Y" | "N"
  footer2: string
  on_off_flag4: "Y" | "N"
  kot_flag: "Y" | "N"
}

/**
 * @deprecated ReceiptSettingsEditCredentials
 */
export type ReceiptSettingsEditCredentials = {
  comp_id: number
  rcpt_type: "P" | "S" | "B"
  stock_flag: "Y" | "N"
  gst_flag: "Y" | "N"
  gst_type: "I" | "E"
  unit_flag?: "Y" | "N"
  cust_inf: "Y" | "N"
  pay_mode: "Y" | "N"
  discount_flag: "Y" | "N"
  discount_type: "P" | "A"
  price_type: "A" | "M"
  refund_days: number
  created_by: string
  modified_by: string
}

export type GeneralSettingsEditCredentials = {
  comp_id: number
  rcpt_type: "P" | "S" | "B"
  // rcpt_flag: "Y" | "N"
  rcv_cash_flag: "Y" | "N"
  stock_flag: "Y" | "N"
  unit_flag?: "Y" | "N"
  cust_inf: "Y" | "N"
  pay_mode: "Y" | "N"
  kot_flag: "Y" | "N"
  price_type: "A" | "M"
  refund_days: number
  modified_by: string
}

export type DiscountSettingsEditCredentials = {
  comp_id: number
  discount_flag: "Y" | "N"
  discount_type: "P" | "A"
  discount_position: "I" | "B"
  modified_by: string
}

export type GstSettingsEditCredentials = {
  comp_id: number
  gst_flag: "Y" | "N"
  gst_type: "I" | "E"
  modified_by: string
}

export type ItemsData = {
  id: number
  comp_id: number
  hsn_code: string
  item_name: string
  description: string
  container_id: number
  created_by: string
  created_dt: string
  modified_by: string
  modified_dt: string
  item_id: number
  price: number
  discount: number
  cgst: number
  sgst: number
  unit_id?: number
  unit_name?: string
  quantity?: number
  stock?: number
  bar_code?: string
  catg_id?: number
  category_name?: string
  item_img?: string,
}

export type UnitData = {
  sl_no: number
  comp_id: number
  unit_name: string
  created_by: string
  created_at: string
  modified_by: null
  modified_at: null
}

export type SaleInsertData = {
  status: number
  data: {
    status: number
    data: number
  }
  kot_no: {
    kot_no: number
  }
}

export type BillSummaryData = {
  status: number
  data: [
    {
      total_bills: number
      amount_collected: number
    },
  ]
}

export type RecentBillsData = {
  receipt_no: number
  trn_date: string
  price: number
  discount_amt: number
  cgst_amt: number
  sgst_amt: number
  amount: number
  round_off: number
  net_amt: number
  pay_mode: "C" | "D" | "U"
  received_amt: number
  pay_dtls: string
  cust_name: string
  phone_no: string
  created_by: string
  created_dt: string
  modified_by: null
  modified_dt: null
  gst_flag: "Y" | "N"
  discount_type: "P" | "A"
}

export type ShowBillResponseData = {
  status: number
  cancel_flag: "Y" | "N"
  data: ShowBillData[]
}

export type ShowBillData = {
  receipt_no: number
  comp_id: number
  br_id: number
  item_id: number
  trn_date: string
  price: number
  discount_amt: number
  cgst_amt: number
  sgst_amt: number
  qty: number
  created_by: string
  created_dt: string
  modified_by: null
  modified_dt: null
  item_name: string
  dis_pertg: number
  cgst_prtg: number
  sgst_prtg: number
  amount: number
  round_off: number
  net_amt: number
  pay_mode: "C" | "D" | "U" | "R"
  received_amt: number
  rcv_cash_flag: string
  pay_dtls: string
  cust_name: string
  phone_no: string
  gst_flag?: "Y" | "N"
  gst_type?: "E" | "I"
  discount_flag?: "Y" | "N"
  discount_type?: "P" | "A"
  discount_position: "B" | "I"
  tprice: number
  tdiscount_amt: number
  tcgst_amt: number
  tsgst_amt: number
  tcreated_by: string
  tcreated_dt: string
  tmodified_by: null
  tmodified_dt: null
}

export type ShowRefundBillResponse = {
  "status": number
  "data": ShowRefundBillData[]
}

export type ShowRefundBillData = {
  "receipt_no": number
  "refund_dt": string
  "refund_rcpt_no": number
  "comp_id": number
  "br_id": number
  "item_id": number
  "price": number
  "dis_pertg": number
  "discount_amt": number
  "cgst_prtg": number
  "cgst_amt": number
  "sgst_prtg": number
  "sgst_amt": number
  "qty": number
  "refund_by": string
  "refund_at": string
  "modified_by": null
  "modified_dt": null
  "tprice": number
  "tdiscount_amt": number
  "tcgst_amt": number
  "tsgst_amt": number
  "amount": number
  "round_off": number
  "net_amt": number
  "pay_mode": "C" | "D" | "U" | "R"
  "cust_name": string
  "phone_no": string
  "gst_flag": "Y" | "N"
  "discount_type": "A" | "P"
  "trefund_by": string
  "trefund_at": string
  "tmodified_by": null
  "tmodified_dt": null
  "item_name": string
  received_amt: number
  "gst_type": "I" | "E",
  "discount_flag": "Y" | "N",
  "discount_position": "I" | "B"
}

export type SearchBillsData = {
  status: 1
  data: SearchedBills[]
}

export type SearchedBills = {
  receipt_no: number
  trn_date: string
  price: number
  discount_amt: number
  cgst_amt: number
  sgst_amt: number
  amount: number
  round_off: number
  net_amt: number
  pay_mode: "C" | "D" | "U" | "R"
  received_amt: number
  pay_dtls: string
  cust_name: string
  phone_no: string
  created_by: string
  created_dt: string
  modified_by: null
  modified_dt: null
}

export type SaleReportData = {
  status: number
  data: SaleReport[]
}

export type SaleReport = {
  cust_name: string
  phone_no: string
  receipt_no: number
  trn_date: string
  no_of_items: number
  price: number
  discount_amt: number
  cgst_amt: number
  sgst_amt: number
  round_off: number
  net_amt: number
  pay_mode: "D" | "C" | "U" | "R"
  created_by: string
}

export type ProductwiseSaleReport = {
  status: number
  data: ProductwiseSaleReportData[]
}

export type ProductwiseSaleReportData = {
  "item_name": string,
  "item_id": number,
  "tot_item_qty": number,
  "unit_price": number,
  "tot_item_price": number,
  "stock": number
  "category_name": string,
  "unit_name": string,
  "selling_price": number,
  "tot_received_cash": number
}

// export type ItemReportData = {
//   status: number
//   data: ItemReport[]
// }

// export type ItemReport = {
//   receipt_no: number
//   trn_date: string
//   qty: number
//   price: number
//   discount_amt: number
//   cgst_amt: number
//   sgst_amt: number
//   amount: number
//   pay_mode: "C" | "D" | "U" | "R"
//   item_name: string
//   branch_name: string
// }

export type ItemReportCredentials = {
  "from_date": string
  "to_date": string
  "comp_id": number
  "br_id": number
}

export type ItemReportResponse = {
  "status": number
  "data": ItemReportData[]
}

export type ItemReportData = {
  "price": number
  "qty": number
  "item_id": number
  "item_name": string
}

export type CollectionReportCredentials = {
  from_date: string
  to_date: string
  comp_id: number
  br_id: number
  // user_id: string
}

export type CollectionReport = {
  pay_mode: "C" | "D" | "U" | "R" | "Z"
  net_amt: number
  no_of_rcpt: number
  can_amt: number
  due_amt: number
  recover_amt: number
}

export type CollectionReportResponse = {
  status: number
  data: CollectionReport[]
}

export type UserwiseReportCredentials = {
  from_date: string
  to_date: string
  comp_id: number
  br_id: number
  user_id: string
}

export type UserwiseReportResponse = {
  "status": number
  "data": UserwiseReportData[]
}

export type UserwiseReportData = {
  "created_by": string
  "net_amt": number
  "cancelled_amt": number
  "no_of_receipts": number
  "user_name": string
}

export type CustomerLedgerCredentials = {
  "comp_id": number
  "br_id": number
  "phone_no": string
}

export type CustomerLedgerResponse = {
  "status": 1,
  "data": CustomerLedgerData[]
}

export type CustomerLedgerData = {
  "cust_name": string
  "phone_no": string
  "recover_dt": string
  "paid_amt": number
  "due_amt": number
  "balance": number
}

export type DueReportCredentials = {
  "comp_id": number
  "br_id": number
  "date": string
}

export type DueReportResponse = {
  "status": 1,
  "data": DueReportData[]
}

export type DueReportData = {
  "cust_name": string
  "phone_no": string
  "due_amt": number
}

export type RecoveryReportCredentials = {
  "comp_id": number
  "br_id": number
  "from_date": string
  "to_date": string
}

export type RecoveryReportResponse = {
  "status": 1,
  "data": RecoveryReportData[]
}

export type RecoveryReportData = {
  "cust_name": string
  "phone_no": string
  "recover_dt": string
  "recovery_amt": number
}

export type GstStatementData = {
  status: number
  data: GstStatement[]
}

export type GstStatement = {
  receipt_no: number
  trn_date: string
  taxable_amt: number
  cgst_amt: number
  sgst_amt: number
  total_tax: number
  net_amt: number
}

export type GstSummaryData = {
  status: number
  data: GstSummary[]
}

export type GstSummary = {
  cgst_prtg: number
  cgst_amt: number
  sgst_amt: number
  total_tax: number
}

export type ItemEditRequestCredentials = {
  comp_id: number
  item_id: number
  price: number
  discount: number
  cgst: number
  sgst: number
  modified_by: string
  unit_id?: number
  catg_id?: number
  // unit_name?: string
  item_name?: string
  item_img?: any
}

export type UnitEditCredentials = {
  comp_id: number
  sl_no: number
  unit_name: string
  modified_by: string
}

export type VersionCheck = {
  status: number
  data: VersionCheckData[]
}

export type VersionCheckData = {
  sl_no: number
  version_no: string
  url: string
}

export type AddItemCredentials = {
  comp_id: number
  hsn_code: string
  item_name: string
  created_by: string
  price: number
  discount: number
  cgst: number
  sgst: number
  unit_id?: number
  catg_id?: number
  // unit_name?: string
  br_id: number
}

export type AddUnitCredentials = {
  comp_id: number
  unit_name: string
  created_by: string
}

export type StockSearchCredentials = {
  comp_id: number
  br_id: number
  item_id: number
  // user_id: string
}

export type StockSearchResponse = {
  stock: number
}

export type StockUpdateCredentials = {
  comp_id: number
  br_id: number
  item_id: number
  user_id: string
  added_stock: number
  removed_stock: number
}

export type StockReportCredentials = {
  comp_id: number
  br_id: number
}

export type StockReportResponse = {
  item_id: number
  item_name: string
  unit_name: string
  stock: number
  created_by: string
  created_dt: null
  modified_by: string
  modified_dt: string
}

export type BasicReportCredentials = {
  "from_date": string
  "to_date": string
  "comp_id": number
  "br_id": number
  // "user_id": string
}

export type CancelledBillsReportResponse = {
  "status": number
  "data": CancelledBillsReportData[]
}

export type CancelledBillsReportData = {
  "cust_name": string
  "phone_no": string
  "receipt_no": number
  "trn_date": string
  "no_of_items": number
  "price": number
  "discount_amt": number
  "cgst_amt": number
  "sgst_amt": number
  "round_off": number
  "net_amt": number
  "pay_mode": "U" | "R" | "C" | "D"
  "created_by": string
}

export type DaybookReportResponse = {
  "status": number
  "data": DaybookReportData[]
}

export type DaybookReportData = {
  "receipt_no": number
  "trn_date": string
  "pay_mode": string
  "net_amt": number
  "cancelled_amt": number
  "created_by": string
  "cancelled_by": string
}

export type RefundItemCredentials = {
  user_id: string
  receipt_no: number
  comp_id: number
  br_id: number
  item_id: number
  price: number
  dis_pertg: number
  discount_amt: number
  cgst_prtg: number
  cgst_amt: number
  sgst_prtg: number
  sgst_amt: number
  qty: number
  tprice: number
  tdiscount_amt: number
  tot_refund_amt: number
  round_off: number
  net_amt: number
  pay_mode: "C" | "D" | "U" | "R"
  cust_name: string
  phone_no: string
  gst_flag: "Y" | "N"
  discount_type: "P" | "A"
  received_amt: string
  "gst_type": "I" | "E"
  "discount_flag": "Y" | "N"
  "discount_position": "I" | "B"
}

/**
 * data.data means refund rcpt no
 */
export type RefundItemResponse = {
  status: number
  data: {
    status: number
    data: number
  }
}

export type RefundListCredentials = {
  comp_id: number
  br_id: number
  phone_no: string
  ref_days: number
}

export type RefundListResponse = {
  receipt_no: number
  trn_date: string
  net_amt: number
  phone_no: string
}

export type RefundReportCredentials = {
  from_date: string
  to_date: string
  comp_id: number
  br_id: number
  user_id: string
}

export type RefundReportResponse = {
  status: number
  data: RefundReportData[]
}

export type RefundReportData = {
  cust_name: string
  phone_no: string
  refund_rcpt_no: number
  refund_dt: string
  no_of_items: number
  price: number
  discount_amt: number
  cgst_amt: number
  sgst_amt: number
  round_off: number
  net_amt: number
  refund_by: string
}

export type CustomerInfoCredentials = {
  comp_id: number
  phone_no: string
}

export type CustomerInfoResponse = {
  status: number
  data:
  | [
    {
      cust_name: string
    },
  ]
  | []
}

export type SendOtpCredentials = {
  phone: string
  comp_id: number
}

export type SendOtpResponse = {
  suc: number
  msg: string
  otp: number
}

export type BillSmsCredentials = {
  comp_id: number
  receipt_no: number
  phone: string
}

export type BillSmsResponse = {
  suc: number
  msg: string
}

export type SearchBillsByMobileCredentials = {
  comp_id: number
  br_id: number
  phone_no: string
}

export type SearchBillsByMobileResponse = {
  status: number
  data: SearchBillsByMobileResponseData[]
}

export type SearchBillsByMobileResponseData = {
  receipt_no: number
  trn_date: string
  net_amt: number
  phone_no: string
}

export type CommonSearchResponseData = {
  receipt_no: number
  trn_date: string
  net_amt: number
}










export type SearchBillsByReceiptCredentials = {
  comp_id: number
  br_id: number
  receipt_no: number
}

export type SearchBillsResponse = {
  status: number
  data: SearchBillsByReceiptAndCustomerNameResponseData[]
}

export type SearchBillsByReceiptAndCustomerNameResponseData = {
  receipt_no: number
  trn_date: string
  net_amt: number
  pay_mode: string
}

export type SearchBillsByCustomerNameCredentials = {
  comp_id: number
  br_id: number
  cust_name: string
}









export type SearchBillsByItemCredentials = {
  comp_id: number
  br_id: number
  item_id: number
  from_date: string
  to_date: string
}

export type SearchBillsByItemResponse = {
  status: number
  data: SearchBillsByItemData[]
}

export type SearchBillsByItemData = {
  receipt_no: number
  item_id: number
  qty: number
  price: number
  item_name: string
}

export type CreditReportResponse = {
  "status": number
  "data": CreditReportResponseData[]
}

export type CreditReportResponseData = {
  "trn_date": string
  "phone_no": string
  "receipt_no": number
  "net_amt": number
  "paid_amt": number
  "due_amt": number
}

export type RecoveryAmountCredentials = {
  "comp_id": number
  "br_id": number
  "phone_no": string
}

export type RecoveryAmountResponse = {
  "status": number
  "data": RecoveryAmountResponseData[]
}

// export type RecoveryAmountResponseData = {
//   "receipt_no": number
//   "trn_date": string
//   "net_amt": number
//   "received_amt": number
//   "due_amt": number
// }
export type RecoveryAmountResponseData = {
  "net_amt": number
  "paid_amt": number
}

// export type RecoveryUpdateCredentials = {
//   "receipt_no": number
//   "received_amt": number
//   "pay_mode": string
//   "user_id": string
// }
export type RecoveryUpdateCredentials = {
  "comp_id": number
  "br_id": number
  "phone_no": string
  "received_amt": number
  "pay_mode": string
  "user_id": string

  customer_mobile: string
  pay_txn_id: string
  pay_amount: number
  pay_amount_original: number
  currency_code: string
  payment_mode: string
  pay_status: string
  receipt_url: string
}

// export type RecoveryUpdateResponse = {
//   "status": number
//   "recover_id": number
//   "msg": "data inserted and updated successfully"
// }
export type RecoveryUpdateResponse = {
  "status": number
  "msg": string
}

export type LogoutCredentials = {
  "comp_id": number
  "br_id": number
  "user_id": string
}

export type LogoutResponse = {
  "status": number
  "data": string
}

export type SearchByBarcodeCredentials = {
  "comp_id": number
  "bar_code": string
}

export type SearchByBarcodeResponse = {
  "status": number
  "msg": ItemsData[]
}

export type CategoryListData = {
  "sl_no": number
  "category_name": string
  "catg_picture"?: string
}

export type CategoryListResponse = {
  "status": number
  "msg": CategoryListData[]
}

export type CategoryItemListCredentials = {
  "comp_id": number
  "br_id": number
  "catg_id": number
}

export type CategoryItemListResponse = {
  "status": number
  "msg": ItemsData[]
}

export type CategoryEditCredentials = {
  comp_id: number
  sl_no: number
  category_name: string
  modified_by: string
}

export type AddCategoryCredentials = {
  "comp_id": number
  "category_name": string
  "created_by": string
}

export type CalculatorSaleInsertCredentials = {
  "comp_id": number
  "br_id": number
  "price": number
  "qty": number
  "tprice": number
  "round_off": number
  "net_amt": number
  "created_by": string
}

export type CalculatorSaleInsertResponse = {
  "status": number
  "data": {
    "status": number
    // rcpt no `data`.
    "data": number
  }
}

export type CalculatorShowBillResponse = {
  "status": number
  "data": CalculatorShowBillData[]
}

export type CalculatorShowBillData = {
  "receipt_no": number
  "comp_id": number
  "br_id": number
  "trn_date": string
  "price": number
  "qty": number
  "created_by": string
  "created_dt": string
  "modified_by": null
  "modified_dt": null
  "tprice": number
  "round_off": number
  "net_amt": number
  "tcreated_by": string
  "tcreated_dt": string
  "tmodified_by": null
  "tmodified_dt": null
}

export type SaleReportCalculateModeResponse = {
  "status": number
  "data": SaleReportCalculateModeData[]
}

export type SaleReportCalculateModeData = {
  "receipt_no": number
  "trn_date": string
  "no_of_items": number
  "price": number
  "round_off": number
  "net_amt": number
  "created_by": string
}

export type TxnDetailsCreds = {
  "receipt_no": string
  "pay_txn_id": string
  "pay_amount": number
  "pay_amount_original": number
  "currency_code": string
  "payment_mode": string
  "pay_status": string
  "receipt_url": string
  "created_by": string
}