export type BasicResponse = {
  status: number
  data: string
}

// export type RegisterData = {
//     status: number
//     data: string
// }

// export type VerifyActiveData = {
//     status: number
//     data: string
// }

// export type OtpData = {
//     status: number
//     data: string
// }

// export type CreatePinData = {
//     status: number
//     data: string
// }

export type LoginData = {
  suc: 0 | 1
  msg:
    | {
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
      }
    | ""
}

export type ReceiptSettingsData = {
  comp_id: number
  rcpt_type: "B" | "S" | "P"
  gst_flag: "N" | "Y"
  unit_flag: "Y" | "N"
  cust_inf: "Y" | "N"
  pay_mode: "Y" | "N"
  discount_flag: "Y" | "N"
  discount_type: "P" | "A"
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
}

export type ReceiptSettingsEditCredentials = {
  comp_id: number
  rcpt_type: "P" | "S" | "B"
  gst_flag: "Y" | "N"
  unit_flag?: "Y" | "N"
  cust_inf: "Y" | "N"
  pay_mode: "Y" | "N"
  discount_flag: "Y" | "N"
  discount_type: "P" | "A"
  price_type: "A" | "M"
  created_by: string
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
  pay_mode: "C" | "D" | "U"
  received_amt: number
  pay_dtls: string
  cust_name: string
  phone_no: string
  gst_flag?: "Y" | "N"
  discount_type?: "P" | "A"
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
  pay_mode: "C" | "D" | "U"
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
  created_by: string
}

export type ItemReportData = {
  status: number
  data: ItemReport[]
}

export type ItemReport = {
  receipt_no: number
  trn_date: string
  qty: number
  price: number
  discount_amt: number
  cgst_amt: number
  sgst_amt: number
  amount: number
  pay_mode: "C" | "U" | "D"
  item_name: string
  branch_name: string
}

export type CollectionReportData = {
  status: number
  data: CollectionReport[]
}

export type CollectionReport = {
  created_by: string
  pay_mode: "C" | "U" | "D"
  net_amt: number
  user_name: string
  no_of_bills: number
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

// export type HeaderFooterData = {
//     "status": number
//     "data": string
// }

export type ItemEditRequestCredentials = {
  comp_id: number
  item_id: number
  price: number
  discount: number
  cgst: number
  sgst: number
  modified_by: string
  unit_id?: number
  unit_name?: string
}

// export type ItemEditData = {
//     "status": number
//     "data": string
// }

export type UnitEditCredentials = {
  comp_id: number
  sl_no: number
  unit_name: string
  modified_by: string
}

// export type UnitEditResponse = {
//     "status": number
//     "data": string
// }

// export type ReceiptSettingsEditData = {
//     "status": number
//     "data": string
// }

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
  unit_name?: string
}

// export type AddedItemResponse = {
//     "status": number
//     "data": string
// }

export type AddUnitCredentials = {
  comp_id: number
  unit_name: string
  created_by: string
}

// export type AddedUnitResponse = {
//     "status": number
//     "data": string
// }

// export type CANCEL_BILL_RESPONSE = {
//     "status": number
//     "data": string
// }
