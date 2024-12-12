import { BASE_URL, BASE_URL_SMS } from "./config"

export const ADDRESSES = {
  /**
   * @deprecated REGISTER
   */
  REGISTER: `${BASE_URL}/api/verify_phone`,
  /**
   * @deprecated VERIFY_ACTIVE
   */
  VERIFY_ACTIVE: `${BASE_URL}/api/verify_active`,
  /**
   * @deprecated OTP
   */
  OTP: `${BASE_URL}/api/otp`,
  /**
   * @deprecated CREATE_PIN
   */
  CREATE_PIN: `${BASE_URL}/api/create_pin`,

  // LOGIN: `${BASE_URL}/api/login`,
  LOGIN: `${BASE_URL}/api/user_login`,
  UPDATE_LOGIN_FLAG: `${BASE_URL}/api/update_login_status`,
  RECEIPT_SETTINGS: `${BASE_URL}/api/receipt_settings`,
  ITEMS: `${BASE_URL}/api/items`,
  CATEGORY_LIST: `${BASE_URL}/api/category_list`,
  CATEGORY_ITEM_LIST: `${BASE_URL}/api/categorywise_item_list`,
  EDIT_CATEGORY: `${BASE_URL}/api/edit_category`,
  ADD_CATEGORY: `${BASE_URL}/api/add_category`,
  UNITS: `${BASE_URL}/api/units`,
  SALE_INSERT: `${BASE_URL}/api/saleinsert`,
  BILL_SUMMARY: `${BASE_URL}/api/billsummary`,
  RECENT_BILLS: `${BASE_URL}/api/recent_bills`,
  SHOW_BILL: `${BASE_URL}/api/show_bill`,
  SHOW_REFUND_BILL: `${BASE_URL}/api/show_refund_bill`,
  SEARCH_BILLS: `${BASE_URL}/api/search_bills`,
  SEARCH_BILLS_BY_MOBILE: `${BASE_URL}/api/search_bill_by_phone`,
  SEARCH_BILLS_BY_RECEIPT: `${BASE_URL}/api/search_bill_by_receipt`,
  SEARCH_BILLS_BY_CUSTOMER_NAME: `${BASE_URL}/api/search_bill_by_name`,
  SEARCH_BILLS_BY_ITEM: `${BASE_URL}/api/billsearch_by_item`,
  SALE_REPORT: `${BASE_URL}/api/sale_report`,
  COLLECTION_REPORT: `${BASE_URL}/api/collection_report`,
  ITEM_REPORT: `${BASE_URL}/api/item_report`,
  STOCK_REPORT: `${BASE_URL}/api/stock_report`,
  DAYBOOK_REPORT: `${BASE_URL}/api/daybook_report`,
  CANCELLED_BILLS_REPORT: `${BASE_URL}/api/cancel_report`,
  USERWISE_REPORT: `${BASE_URL}/api/userwise_report`,
  CUSTOMER_LEDGER: `${BASE_URL}/api/customer_ledger`,
  DUE_REPORT: `${BASE_URL}/api/due_report`,
  RECOVERY_REPORT: `${BASE_URL}/api/recovery_report`,
  GST_STATEMENT: `${BASE_URL}/api/gst_statement`,
  GST_SUMMARY: `${BASE_URL}/api/gst_summary`,
  EDIT_HEADER_FOOTER: `${BASE_URL}/api/edit_header_footer`,
  EDIT_ITEM: `${BASE_URL}/api/edit_item`,
  EDIT_UNIT: `${BASE_URL}/api/edit_unit`,
  ADD_ITEM: `${BASE_URL}/api/add_item`,
  ADD_UNIT: `${BASE_URL}/api/add_unit`,
  STOCK: `${BASE_URL}/api/stock`,
  STOCK_UPDATE: `${BASE_URL}/api/update_stock`,
  SEARCH_BY_BARCODE: `${BASE_URL}/api/search_by_barcode`,
  CALCULATOR_SALE_INSERT: `${BASE_URL}/api/calculator/saleinsert`,
  CALCULATOR_SHOW_BILL: `${BASE_URL}/api/calculator/show_bill`,
  CALCULATOR_SALE_REPORT: `${BASE_URL}/api/calculator/sale_report`,

  PRODUCTWISE_SALE_REPORT: `${BASE_URL}/api/productwise_report`,

  /**
   * @deprecated @var EDIT_RECEIPT_SETTINGS
   */
  EDIT_RECEIPT_SETTINGS: `${BASE_URL}/api/edit_rcp_settings`,

  EDIT_GENERAL_SETTINGS: `${BASE_URL}/api/edit_general_settings`,
  EDIT_DISCOUNT_SETTINGS: `${BASE_URL}/api/edit_discount_settings`,
  EDIT_GST_SETTINGS: `${BASE_URL}/api/edit_gst_settings`,
  APP_VERSION: `${BASE_URL}/api/app_version`,

  /**
   * @deprecated @var CANCEL_BILL
   */
  CANCEL_BILL: `${BASE_URL}/api/cancel_bill`,

  CANCEL_BILL_TWO: `${BASE_URL}/api/cancel_bill_two`,
  REFUND_LIST: `${BASE_URL}/api/refund_list`,
  REFUND_ITEMS: `${BASE_URL}/api/refund_item`,
  REFUND_BILL_REPORT: `${BASE_URL}/api/refund_bill_report`,
  CREDIT_REPORT: `${BASE_URL}/api/credit_report`,
  CUSTOMER_INFORMATION: `${BASE_URL}/api/cust_info`,
  RECOVERY_AMOUNT: `${BASE_URL}/api/recovery_amount`,
  RECOVERY_UPDATE: `${BASE_URL}/api/recovery_update`,
  LOGOUT: `${BASE_URL}/api/logout`,

  SEND_TXN_DETAILS: `${BASE_URL}/api/add_txn_dtls`,

  /**
   * @deprecated @var SEND_OTP
   */
  SEND_OTP: `${BASE_URL_SMS}/api/send_otp`,
  /**
   * @deprecated @var BILL_SMS
  */
  BILL_SMS: `${BASE_URL_SMS}/api/bill_sms`,

  SEND_OTP2: `${BASE_URL_SMS}/sms_api/send_otp.php`,
  BILL_SMS2: `${BASE_URL_SMS}/sms_api/bill_sms.php`,
}
