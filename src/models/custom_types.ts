import { CategoryListData, ItemsData, LoginDataMessage, ReceiptSettingsData, UnitData } from "./api_types"

export type FilteredItem = {
  comp_id: number
  br_id: number
  item_id: number
  price: number
  discount_amt: number
  cgst_amt?: number
  sgst_amt?: number
  qty: number
  tprice: number
  tdiscount_amt: number
  amount: number
  round_off: number
  net_amt: number
  pay_mode: string
  received_amt: string
  pay_dtls: string
  cust_name: string
  phone_no: string
  created_by: string
  dis_pertg: number
  cgst_prtg: number
  sgst_prtg: number
  gst_flag: "Y" | "N"
  gst_type: "E" | "I"
  discount_type: "P" | "A"
  discount_flag: "Y" | "N"
  rcpt_type: "P" | "S" | "B"
  discount_position: "B" | "I"
  cust_info_flag: number
  stock_flag: "Y" | "N"
  "kot_flag": string
  "table_no": number
  "rcv_cash_flag": string
}

export type AppStoreContext = {
  isLogin: boolean
  otp: number
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>
  handleLogin: (loginText: string, passwordText: string) => Promise<void>
  // loginDataMessage: LoginDataMessage
  handleLogout: () => Promise<void>
  receiptSettings: ReceiptSettingsData
  handleGetReceiptSettings: () => Promise<void>
  items: ItemsData[]
  handleGetItems: () => Promise<void>
  categories: CategoryListData[]
  handleGetCategories: () => Promise<void>
  units: UnitData[]
  handleGetUnits: () => Promise<void>
  init?: () => Promise<void>
}

export type Bill = {
  id: number,
  qty: number,
  price: number,
  total: number
}