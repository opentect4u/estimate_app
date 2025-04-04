from pydantic import BaseModel, Field
from datetime import date, datetime
from typing import Annotated, Union, Optional

class CreatePIN(BaseModel):
    PIN:str
    phone_no:str
class SessionData(BaseModel):
    id: str

class UserLogin(BaseModel):
    user_id:str
    # PIN:str

class LoginStatus(BaseModel):
    user_id:str

class Login(BaseModel):
    user_id:str
    password:str

class Receipt(BaseModel):
    comp_id:int
    br_id:int
    item_id:int
    price:float
    dis_pertg:float
    discount_amt:float
    cgst_prtg:float
    cgst_amt:float
    sgst_prtg:float
    sgst_amt:float
    qty:int
    tprice:float
    tdiscount_amt:float
    # tcgst_amt:float
    # tsgst_amt:float
    amount:float
    round_off:float
    net_amt:int
    pay_mode:str
    received_amt:str
    pay_dtls:str
    cust_name:str
    phone_no:Optional[str] = None
    rcv_cash_flag:str
    gst_flag:str
    gst_type:str
    discount_flag:str
    discount_type:str
    discount_position:str
    created_by:str
    rcpt_type:str
    cust_info_flag:int
    stock_flag:str
    kot_flag:str
    table_no:int
    branch_name:str
    user_name:str

class DashBoard(BaseModel):
    trn_date:date
    comp_id:int
    br_id:int
    user_id:str

class SearchBill(BaseModel):
    from_date:date
    to_date:date
    comp_id:int
    br_id:int
    user_id:str

class SearchByRcpt(BaseModel):
    comp_id:int
    br_id:int
    receipt_no:str

class SearchByName(BaseModel):
    comp_id:int
    br_id:int
    cust_name:str

class SaleReport(BaseModel):
    from_date:date
    to_date:date
    comp_id:int
    br_id:int

class GSTStatement(BaseModel):
    from_date:date
    to_date:date
    comp_id:int
    br_id:int
    user_id:int

class GSTSummary(BaseModel):
    from_date:date
    to_date:date
    comp_id:int
    br_id:int
    user_id:int

class CancelReport(BaseModel):
    from_date:date
    to_date:date
    comp_id:int
    br_id:int
    user_id:str

class DaybookReport(BaseModel):
    from_date:date
    to_date:date
    comp_id:int
    br_id:int

class ItemReport(BaseModel):
    from_date:date
    to_date:date
    comp_id:int
    br_id:int
    user_id:str

class UserwiseReport(BaseModel):
    from_date:date
    to_date:date
    comp_id:int
    br_id:int
    user_id:str

class EditHeaderFooter(BaseModel):
    comp_id:int
    header1:str
    on_off_flag1:str
    header2:str
    on_off_flag2:str
    footer1:str
    on_off_flag3:str
    footer2:str
    on_off_flag4:str
    created_by:str

class EditItem(BaseModel):
    comp_id:int
    item_name:str
    item_id:int
    price:float
    discount:float
    cgst:float
    sgst:float
    unit_id:int
    catg_id:int
    modified_by:str
    
class DiscountSettings(BaseModel):
    comp_id:int
    discount_flag:str
    discount_type:str
    discount_position:str
    modified_by:str

class GSTSettings(BaseModel):
    comp_id:int
    gst_flag:str
    gst_type:str
    modified_by:str

class GeneralSettings(BaseModel):
    comp_id:int
    rcv_cash_flag:str
    rcpt_type:str
    unit_flag:str
    cust_inf:str
    pay_mode:str
    stock_flag:str
    price_type:str
    refund_days:int
    kot_flag:str
    modified_by:str

class AddItem(BaseModel):
    comp_id:int
    br_id:int
    hsn_code:str
    item_name:str
    unit_id:int
    catg_id:int
    # unit_name:str
    created_by:str
    price:float
    discount:float
    cgst:float
    sgst:float

class CancelBill(BaseModel):
    receipt_no:str
    user_id:str

class AddUnit(BaseModel):
    comp_id:int
    unit_name:str
    created_by:str

class EditUnit(BaseModel):
    comp_id:int
    sl_no:int
    unit_name:str
    modified_by:str

class InventorySearch(BaseModel):
    comp_id:int
    br_id:int
    item_id:int
    # user_id:str

class UpdateStock(BaseModel):
    comp_id:int
    br_id:int
    item_id:int
    user_id:str
    added_stock:int
    removed_stock:int
    # flag:int  # 0 = out , 1 = in

class StockReport(BaseModel):
    comp_id:int
    br_id:int

# class CancelBillReport(BaseModel):
#     from_date:date
#     to_date:date

# class CancelItem(BaseModel):
#     user_id:str
#     receipt_no:int
#     item_id:int
#     qty:int

class RefundItem(BaseModel):
    user_id:str
    receipt_no:str
    comp_id:int
    br_id:int
    item_id:int
    price:float
    dis_pertg:float
    discount_amt:float
    cgst_prtg:float
    cgst_amt:float
    sgst_prtg:float
    sgst_amt:float
    qty:int
    tprice:float
    tdiscount_amt:float
    tot_refund_amt:float
    round_off:float
    net_amt:int
    pay_mode:str
    received_amt:str
    cust_name:str
    phone_no:str
    gst_flag:str
    gst_type:str
    discount_flag:str
    discount_type:str
    discount_position:str

class RefundList(BaseModel):
    comp_id:int
    br_id:int
    phone_no:str
    ref_days:int

class RefundBillReport(BaseModel):
    from_date:date
    to_date:date
    comp_id:int
    br_id:int
    user_id:str

# class CustomerDetails(BaseModel):
#     phone_no:str

class CustInfo(BaseModel):
    comp_id:int
    phone_no:str

class UserInfo(BaseModel):
    comp_id:int
    br_id:int

class BillList(BaseModel):
    comp_id:int
    br_id:int
    phone_no:str

class SearchByItem(BaseModel):
    comp_id:int
    br_id:int
    item_id:int
    from_date:str
    to_date:str

class CreditReport(BaseModel):
    from_date:date
    to_date:date
    comp_id:int
    br_id:int
    user_id:str

class RecoverBill(BaseModel):
    comp_id:int
    br_id:int
    phone_no:str

# class RecoveryUpdate(BaseModel):
#     receipt_no:int
#     received_amt:int
#     pay_mode:str
#     user_id:str

class RecoveryUpdate(BaseModel):
    comp_id:int
    br_id:int
    phone_no:str
    received_amt:int
    pay_mode:str
    user_id:str
    customer_mobile:str | None
    pay_txn_id:str | None
    pay_amount:float | None
    pay_amount_original:float | None 
    currency_code:str | None
    payment_mode:str | None
    pay_status:str | None
    receipt_url:str | None

class LoginFlag(BaseModel):
    comp_id:int
    br_id:int
    user_id:str

class SearchByBarcode(BaseModel):
    comp_id:int
    bar_code:str

class SearchByCategory(BaseModel):
    comp_id:int
    catg_id:int
    br_id:int

class EditCategory(BaseModel):
    comp_id:int
    sl_no:int
    category_name:str
    modified_by:str

class AddCategory(BaseModel):
    comp_id:int
    category_name:str
    created_by:str

class CustomerLedger(BaseModel):
    comp_id:int
    br_id:int
    phone_no:str

class RecveryReport(BaseModel):
    comp_id:int
    br_id:int
    from_date:date
    to_date:date

class DueReport(BaseModel):
    comp_id:int
    br_id:int
    date:date
    user_id:str

class DueReportMobileAPI(BaseModel):
    comp_id:int
    br_id:int
    date:date
    user_id:str


class CalReceipt(BaseModel):
    comp_id:int
    br_id:int
    price:float
    qty:int
    tprice:float
    round_off:float
    net_amt:int
    created_by:str

class AddEditTXN(BaseModel):
	receipt_no:str	
	pay_txn_id:str	
	pay_amount:int
	pay_amount_original:int	
	currency_code:str	
	payment_mode:str	
	pay_status:str	
	receipt_url:str	
	created_by:str


class CreditCust(BaseModel):
    comp_id:int
    user_id:str

class BillwiseReport(BaseModel):
    from_date:date
    user_id:str
    