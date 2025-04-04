from fastapi import APIRouter
from config.database import connect
from models.master_model import createResponse
from models.form_model import DashBoard,SaleReport,GSTStatement,GSTSummary,ItemReport,RefundBillReport,BillList,SearchByItem,CreditReport,CancelReport,DaybookReport,SearchByRcpt,SearchByName,UserwiseReport,CustomerLedger,RecveryReport,DueReport,CreditCust,BillwiseReport,DueReportMobileAPI
from V2.global_variable.global_var import getGlobal
# testing git
repoRouter = APIRouter()

# Dashboard
#-------------------------------------------------------------------------------------------------------------------------
@repoRouter.post('/billsummary')
async def Bill_sum(bill_sum:DashBoard):
    conn = connect()
    cursor = conn.cursor()

    query = f"SELECT COUNT(a.receipt_no)total_bills, SUM(a.net_amt)amount_collected FROM td_receipt a, md_user b,md_branch c,md_company d WHERE a.created_by=b.user_id and b.br_id=c.id and b.comp_id=d.id and d.id={bill_sum.comp_id} and c.id={bill_sum.br_id} and a.trn_date='{bill_sum.trn_date}' and a.created_by='{bill_sum.user_id}' and a.receipt_no in (select receipt_no from td_item_sale where cancel_flag=0)"

    cursor.execute(query)
    records = cursor.fetchall()
    # print(records)
    result = createResponse(records, cursor.column_names, 1)
    conn.close()
    cursor.close()
    if records==[(0,None)]:
        resData= {"status":0, "data":"no data"}
    else:
        resData= {
        "status":1,
        "data":result
        }
    return resData

# Dashboard - Last 4 bills
#-------------------------------------------------------------------------------------------------------------
@repoRouter.post('/recent_bills')
async def recent_bill(rec_bill:DashBoard):
    conn = connect()
    cursor = conn.cursor()
    query = f"SELECT a.* FROM td_receipt a, md_user b, md_branch c, md_company d WHERE a.created_by=b.user_id and b.br_id=c.id and b.comp_id=d.id and d.id={rec_bill.comp_id} and c.id={rec_bill.br_id} and a.trn_date='{rec_bill.trn_date}' and a.created_by='{rec_bill.user_id}' and a.receipt_no not in (select receipt_no from td_receipt_cancel_new) ORDER BY created_dt DESC LIMIT 10"
    cursor.execute(query)
    records = cursor.fetchall()
    result = createResponse(records, cursor.column_names, 1)
    conn.close()
    cursor.close()
    return result

# Sale Report
#-----------------------------------------------------------------------------------------------------------------------

@repoRouter.post('/sale_report')
async def sale_report(sl_rep:SaleReport):
    conn = connect()
    cursor = conn.cursor()
    # query = f"select a.cust_name, a.phone_no, a.receipt_no, a.trn_date,  count(b.receipt_no)no_of_items, sum(a.price)price, sum(a.discount_amt)discount_amt, sum(a.cgst_amt)cgst_amt, sum(a.sgst_amt)sgst_amt, sum(a.round_off)rount_off, sum(a.amount)net_amt, a.created_by from  td_receipt a,td_item_sale b where a.receipt_no = b.receipt_no  and   a.trn_date between '{sl_rep.from_date}' and '{sl_rep.to_date}' and   b.comp_id = {sl_rep.comp_id} AND   b.br_id = {sl_rep.br_id} group by a.cust_name, a.phone_no, a.receipt_no, a.trn_date, a.created_by"
    query=f"select a.cust_name, a.phone_no, a.receipt_no, a.trn_date,  count(b.receipt_no)no_of_items, a.price, a.discount_amt, a.cgst_amt, a.sgst_amt,a.round_off, a.net_amt, a.pay_mode, a.created_by from  td_receipt a,td_item_sale b where a.receipt_no = b.receipt_no  and   a.trn_date between '{sl_rep.from_date}' and '{sl_rep.to_date}' and   b.comp_id = {sl_rep.comp_id} AND   b.br_id = {sl_rep.br_id} and a.receipt_no not in (select receipt_no from td_receipt_cancel_new where date(cancelled_dt) between '{sl_rep.from_date}' and '{sl_rep.to_date}') group by a.cust_name, a.phone_no, a.receipt_no, a.trn_date,a.price, a.discount_amt, a.cgst_amt, a.sgst_amt, a.round_off, a.net_amt, a.pay_mode, a.created_by Order by a.trn_date,a.receipt_no"
    cursor.execute(query)
    records = cursor.fetchall()
    result = createResponse(records, cursor.column_names, 1)
    conn.close()
    cursor.close()
    if records==[]:
        resData= {"status":0, "data":[]}
    else:
        resData= {
        "status":1,
        "data":result
        }
    return resData

# Collection Report (Sales Summary in app)
#-----------------------------------------------------------------------------------------------------------------------
@repoRouter.post('/collection_report')
async def collection_report(col_rep:SaleReport):
    conn = connect()
    cursor = conn.cursor()
# 1st
    # query = f"select count(receipt_no)no_of_rcpt, pay_mode, Sum(net_amt) net_amt, sum(cancelled_amt)can_amt from( select receipt_no, pay_mode, net_amt, 0 cancelled_amt from td_receipt where trn_date BETWEEN '{col_rep.from_date}' and '{col_rep.to_date}' and comp_id= {col_rep.comp_id} AND br_id = {col_rep.br_id} UNION select a.receipt_no receipt_no, a.pay_mode pay_mode, 0 net_amt, a.net_amt cancelled_amt from td_receipt a,td_receipt_cancel_new b where a.receipt_no = b.receipt_no and date(b.cancelled_dt) BETWEEN '{col_rep.from_date}' and '{col_rep.to_date}' and a.comp_id= {col_rep.comp_id} AND a.br_id = {col_rep.br_id})a group by pay_mode"
# 2nd
    # query = f"select count(receipt_no)no_of_rcpt, pay_mode, Sum(net_amt) net_amt from td_receipt where trn_date BETWEEN '{col_rep.from_date}' and '{col_rep.to_date}' and comp_id={col_rep.comp_id} AND br_id = {col_rep.br_id} and receipt_no in (select distinct receipt_no from td_item_sale where cancel_flag = 0) group by pay_mode"

# 3rd
    query = f"select count(receipt_no)no_of_rcpt, pay_mode,Sum(net_amt) net_amt, sum(due_amt)due_amt,ifnull(sum(recover_amt),0)recover_amt from( select receipt_no, pay_mode, net_amt, if(pay_mode = 'R',(net_amt - received_amt),0)due_amt, 0 recover_amt from td_receipt where trn_date BETWEEN '{col_rep.from_date}' and '{col_rep.to_date}' and comp_id= {col_rep.comp_id} AND br_id = {col_rep.br_id} and receipt_no in (select distinct receipt_no from td_item_sale where cancel_flag = 0) UNION select '' receipt_no, 'Z'pay_mode, 0 net_amt, 0 due_amt, sum(paid_amt) recover_amt from td_recovery where recover_dt BETWEEN '{col_rep.from_date}' and '{col_rep.to_date}')a group by pay_mode"

    cursor.execute(query)
    records = cursor.fetchall()
    result = createResponse(records, cursor.column_names, 1)
    conn.close()
    cursor.close()
    if records==[]:
        resData= {"status":0, "data":[]}
    else:
        resData= {
        "status":1,
        "data":result
        }
    return resData

# Item Report
#-------------------------------------------------------------------------------------------------------------
# @repoRouter.post('/item_report')
# async def item_report(item_rep:ItemReport):
#     conn = connect()
#     cursor = conn.cursor()
#     query = f"SELECT a.receipt_no,a.item_id,b.item_name,sum(a.qty)qty,sum(a.price*a.qty)price from td_item_sale a, md_items b where a.item_id = b.id and a.comp_id = {item_rep.comp_id} and a.br_id = {item_rep.br_id} and a.trn_date BETWEEN '{item_rep.from_date}' and '{item_rep.to_date}' and a.receipt_no not in (select receipt_no from td_receipt_cancel_new where date(cancelled_dt)between '{item_rep.from_date}' and '{item_rep.to_date}') group by a.receipt_no,a.item_id,b.item_name"
#     cursor.execute(query)
#     records = cursor.fetchall()
#     result = createResponse(records, cursor.column_names, 1)
#     conn.close()
#     cursor.close()
#     if records==[]:
#         resData= {"status":0, "data":[]}
#     else:
#         resData= {
#         "status":1,
#         "data":result
#         }
#     return resData

# GST Statement
#-------------------------------------------------------------------------------------------------------------

# @repoRouter.post('/gst_statement')
# async def gst_statement(gst_st:GSTStatement):
#     conn = connect()
#     cursor = conn.cursor()
#     query = f"select distinct a.receipt_no, a.trn_date, (a.price - a.discount_amt)taxable_amt, a.cgst_amt, a.sgst_amt, (a.cgst_amt + a.sgst_amt)total_tax, a.net_amt from td_receipt a, td_item_sale b where a.receipt_no = b.receipt_no and b.comp_id = {gst_st.comp_id} and b.br_id = {gst_st.br_id} and a.created_by = {gst_st.user_id} and (a.cgst_amt + a.sgst_amt) > '0' and a.trn_date BETWEEN '{gst_st.from_date}' and '{gst_st.to_date}'"
#     cursor.execute(query)
#     records = cursor.fetchall()
#     result = createResponse(records, cursor.column_names, 1)
#     conn.close()
#     cursor.close()
#     if records==[]:
#         resData= {"status":0, "data":[]}
#     else:
#         resData= {
#         "status":1,
#         "data":result
#         }
#     return resData

# GST  Summary
#-------------------------------------------------------------------------------------------------------------
# @repoRouter.post('/gst_summary')
# async def gst_summary(gst_sm:GSTSummary):
#     conn = connect()
#     cursor = conn.cursor()
#     query = f"SELECT cgst_prtg, SUM(cgst_amt)cgst_amt, SUM(sgst_amt)sgst_amt, SUM(cgst_amt) + SUM(sgst_amt)total_tax FROM td_item_sale WHERE cgst_amt+sgst_amt>0 AND comp_id = {gst_sm.comp_id} AND br_id = {gst_sm.br_id} AND created_by = {gst_sm.user_id} AND trn_date BETWEEN '{gst_sm.from_date}' AND '{gst_sm.to_date}' GROUP BY cgst_prtg"
#     cursor.execute(query)
#     records = cursor.fetchall()
#     result = createResponse(records, cursor.column_names, 1)
#     conn.close()
#     cursor.close()
#     if records==[]:
#         resData= {"status":0, "data":[]}
#     else:
#         resData= {
#         "status":1,
#         "data":result
#         }
#     return resData

# Refund Report [Bill]

# @repoRouter.post('/refund_bill_report')
# async def sale_report(sl_rep:RefundBillReport):
#     conn = connect()
#     cursor = conn.cursor()

#     query=f"select a.cust_name, a.phone_no, a.refund_rcpt_no, a.refund_dt,  count(b.refund_rcpt_no)no_of_items, a.price, a.discount_amt, a.cgst_amt, a.sgst_amt,a.round_off, a.net_amt, a.refund_by from  td_refund_bill a, td_refund_item b where a.refund_rcpt_no = b.refund_rcpt_no  and   a.refund_dt between '{sl_rep.from_date}' and '{sl_rep.to_date}' and   b.comp_id = {sl_rep.comp_id} AND b.br_id = {sl_rep.br_id} and a.refund_by='{sl_rep.user_id}' group by a.cust_name, a.phone_no, a.refund_rcpt_no, a.refund_dt, a.refund_by"

#     cursor.execute(query)
#     records = cursor.fetchall()
#     result = createResponse(records, cursor.column_names, 1)
#     conn.close()
#     cursor.close()
#     if records==[]:
#         resData= {"status":0, "data":[]}
#     else:
#         resData= {
#         "status":1,
#         "data":result
#         }
#     return resData

# Search Bill by Phone no.
# ------------------------------------------------------------------------------------------------------------

@repoRouter.post('/search_bill_by_phone')
async def search_bill_by_phone(bill:BillList):
    conn = connect()
    cursor = conn.cursor()
    query = f"SELECT DISTINCT a.receipt_no, a.trn_date, a.net_amt, a.phone_no FROM td_receipt a, td_item_sale b WHERE a.receipt_no=b.receipt_no AND b.comp_id = {bill.comp_id} AND b.br_id = {bill.br_id} AND a.phone_no = '{bill.phone_no}'"
    cursor.execute(query)
    records = cursor.fetchall()
    result = createResponse(records, cursor.column_names, 1)
    conn.close()
    cursor.close()
    if cursor.rowcount>0:
        resData = {
            "status":1,
            "data":result
        }
    else:
        resData = {
            "status":0,
            "data":[]
        }

    return resData

#======================================================================================================
# Billwise Report 
@repoRouter.post('/billwise_report')
async def search_bill_by_phone(bill:BillwiseReport):
    conn = connect()
    cursor = conn.cursor()
    query = f" SELECT r.receipt_no,r.net_amt,sum(s.qty) as qty FROM `td_receipt` r join td_item_sale s on s.receipt_no=r.receipt_no where s.created_by='{bill.user_id}' and s.trn_date BETWEEN '{bill.from_date}' and '{bill.from_date}';          "
    cursor.execute(query)
    records = cursor.fetchall()
    result = createResponse(records, cursor.column_names, 1)
    conn.close()
    cursor.close()
    if cursor.rowcount>0:
        resData = {
            "status":1,
            "data":result
        }
    else:
        resData = {
            "status":0,
            "data":[]
        }

    return resData

#--------------------------------------------------------------------------------------------------------
# Search Bills by item name

@repoRouter.post('/billsearch_by_item')
async def billsearch_by_item(item:SearchByItem):
    conn = connect()
    cursor = conn.cursor()
    query = f"SELECT a.receipt_no,a.item_id,a.qty,a.price,b.item_name FROM td_item_sale a, md_items b WHERE a.item_id=b.id AND a.comp_id=b.comp_id AND a.comp_id={item.comp_id} AND a.br_id={item.br_id} AND b.id={item.item_id} AND a.trn_date BETWEEN '{item.from_date}' AND '{item.to_date}'"
    cursor.execute(query)
    records = cursor.fetchall()
    result = createResponse(records, cursor.column_names, 1)
    conn.close()
    cursor.close()
    if cursor.rowcount>0:
        resData= {
        "status":1, 
        "data":result}
    else:
        resData= {
        "status":0,
        "data":[]
        }
    return resData
#==================================================================================================
# Search by Receipt No

@repoRouter.post('/search_bill_by_receipt')
async def search_bill_by_receipt(bill:SearchByRcpt):
    conn = connect()
    cursor = conn.cursor()
    query = f"SELECT DISTINCT receipt_no, trn_date, pay_mode, net_amt FROM td_receipt WHERE comp_id = {bill.comp_id} AND br_id = {bill.br_id} AND receipt_no = '{bill.receipt_no}'"
    cursor.execute(query)
    records = cursor.fetchall()
    result = createResponse(records, cursor.column_names, 1)
    conn.close()
    cursor.close()
    if cursor.rowcount>0:
        resData = {
            "status":1,
            "data":result
        }
    else:
        resData = {
            "status":0,
            "data":[]
        }

    return resData

#==================================================================================================
# Search Bill by Customer Name

@repoRouter.post('/search_bill_by_name')
async def search_bill_by_receipt(bill:SearchByName):
    conn = connect()
    cursor = conn.cursor()
    query = f"SELECT DISTINCT receipt_no, trn_date, pay_mode, net_amt FROM td_receipt WHERE comp_id = {bill.comp_id} AND br_id = {bill.br_id} AND cust_name LIKE '%{bill.cust_name}%'"
    cursor.execute(query)
    records = cursor.fetchall()
    result = createResponse(records, cursor.column_names, 1)
    conn.close()
    cursor.close()
    if cursor.rowcount>0:
        resData = {
            "status":1,
            "data":result
        }
    else:
        resData = {
            "status":0,
            "data":[]
        }

    return resData

#=================================================================================================
# Show The Refunded Bills

# @repoRouter.get('/show_refund_bill/{recp_no}')
# async def show_refund_bill(recp_no:int):
#     conn = connect()
#     cursor = conn.cursor()
#     query = f"SELECT a.receipt_no, a.refund_dt, a.refund_rcpt_no, a.comp_id, a.br_id, a.item_id, a.price, a.dis_pertg, a.discount_amt, a.cgst_prtg, a.cgst_amt, a.sgst_prtg, a.sgst_amt, a.qty, a.refund_by, a.refund_at, a.modified_by, a.modified_dt, b.price AS tprice, b.discount_amt AS tdiscount_amt, b.cgst_amt AS tcgst_amt, b.sgst_amt AS tsgst_amt, b.amount, b.round_off, b.net_amt, b.pay_mode, b.received_amt, b.cust_name, b.phone_no, b.gst_flag,b.gst_type,b.discount_flag, b.discount_type,b.discount_position, b.refund_by AS trefund_by, b.refund_at AS trefund_at, b.modified_by AS tmodified_by, b.modified_dt AS tmodified_dt, c.item_name FROM td_refund_item a, td_refund_bill b, md_items c WHERE a.refund_rcpt_no=b.refund_rcpt_no and a.refund_dt=b.refund_dt and a.item_id=c.id and a.refund_rcpt_no={recp_no}"
#     cursor.execute(query)
#     records = cursor.fetchall()
#     result = createResponse(records, cursor.column_names, 1)
#     conn.close()
#     cursor.close()
#     if cursor.rowcount>0:
#         resData= {"status":1, 
#                   "data":result}
#     else:
#         resData= {
#         "status":0,
#         "data":[]
#         }
#     return resData

# Credit Report
#=======================================================================================================

@repoRouter.post('/credit_report')
async def credit_report(cr_rep:CreditReport):
    conn = connect()
    cursor = conn.cursor()

    query=f"select trn_date, phone_no, receipt_no, net_amt, received_amt as paid_amt, net_amt-received_amt as due_amt from  td_receipt  where pay_mode = 'R' and net_amt-received_amt > 0 and trn_date between '{cr_rep.from_date}' and '{cr_rep.to_date}' and comp_id = {cr_rep.comp_id} AND br_id = {cr_rep.br_id} and created_by='{cr_rep.user_id}' group by phone_no,receipt_no,trn_date,created_by"

    cursor.execute(query)
    records = cursor.fetchall()
    result = createResponse(records, cursor.column_names, 1)
    conn.close()
    cursor.close()
    if cursor.rowcount>0:
        resData= {"status":1, "data":result}
    else:
        resData= {
        "status":0,
        "data":[]
        }
    return resData

#===================================================================================================
@repoRouter.post('/cancel_report')
async def cancel_report(data:CancelReport):
    conn = connect()
    cursor = conn.cursor()
    
    # query=f"select a.cust_name, a.phone_no, a.receipt_no, a.trn_date, count(b.receipt_no)no_of_items, a.price, a.discount_amt, a.cgst_amt, a.sgst_amt, a.round_off, a.net_amt, a.pay_mode, a.created_by from td_receipt a,td_item_sale b where a.receipt_no = b.receipt_no and b.comp_id = {data.comp_id} AND b.br_id = {data.br_id} and a.receipt_no In (select receipt_no from td_receipt_cancel_new where date(cancelled_dt) between '{data.from_date}' and '{data.to_date}') group by a.cust_name, a.phone_no, a.receipt_no, a.trn_date,a.price, a.discount_amt, a.cgst_amt, a.sgst_amt, a.round_off, a.net_amt, a.pay_mode, a.created_by Order by a.trn_date,a.receipt_no"

    query = f"select a.receipt_no, a.trn_date, count(b.receipt_no)no_of_items, a.price, a.net_amt, a.pay_mode, a.created_by from td_receipt a,td_item_sale b where a.receipt_no = b.receipt_no and b.comp_id = {data.comp_id} AND b.br_id = {data.br_id} and a.created_by='{data.user_id}' and a.receipt_no In (select receipt_no from td_receipt_cancel_new where date(cancelled_dt) between '{data.from_date}' and '{data.to_date}') group by a.receipt_no, a.trn_date,a.price, a.net_amt, a.pay_mode, a.created_by Order by a.trn_date,a.receipt_no"
    print(query)
    cursor.execute(query)
    
    records = cursor.fetchall()
    result = createResponse(records, cursor.column_names, 1)
    conn.close()
    cursor.close()
    if records==[]:
        resData= {"status":0, "data":[]}
    else:
        resData= {
        "status":1,
        "data":result
        }
    return resData

#===================================================================================================
# Daybook Report

@repoRouter.post('/daybook_report')
async def daybook_report(data:DaybookReport):
    conn = connect()
    cursor = conn.cursor()
    
    query=f"select receipt_no, trn_date, pay_mode, net_amt, 0 cancelled_amt, created_by, ''cancelled_by From td_receipt where comp_id = {data.comp_id} and br_id = {data.br_id} and trn_date between '{data.from_date}' and '{data.to_date}' UNION select a.receipt_no receipt_no, a.trn_date trn_date, a.pay_mode, 0 net_amt, a.net_amt cancelled_amt, a.created_by created_by, b.cancelled_by cancelled_by From td_receipt a, td_receipt_cancel_new b where a.receipt_no = b.receipt_no and a.comp_id = {data.comp_id} and a.br_id = {data.br_id} and date(b.cancelled_dt) between '{data.from_date}' and '{data.to_date}'"

    cursor.execute(query)
    records = cursor.fetchall()
    result = createResponse(records, cursor.column_names, 1)
    conn.close()
    cursor.close()
    if records==[]:
        resData= {"status":0, "data":[]}
    else:
        resData= {
        "status":1,
        "data":result
        }
    return resData

#============================================================================================
# Userwise Report

@repoRouter.post('/userwise_report1')
async def userwise_report(data:UserwiseReport):
    conn = connect()
    cursor = conn.cursor()

    # query = f"select created_by, sum(net_amt)net_amt, sum(cancelled_amt)cancelled_amt, COUNT(receipt_no)no_of_receipts, user_name from( Select a.created_by created_by, a.net_amt net_amt, 0 cancelled_amt, c.user_name user_name, a.receipt_no receipt_no from td_receipt a, md_user c where a.created_by=c.user_id and a.trn_date BETWEEN '{data.from_date}' AND '{data.to_date}' and a.created_by='{data.user_id}' and a.comp_id = {data.comp_id} AND a.br_id = {data.br_id} UNION Select a.created_by created_by, 0 net_amt, a.net_amt cancelled_amt, c.user_name user_name, b.receipt_no receipt_no from td_receipt a, md_user c,td_receipt_cancel_new b where a.receipt_no = b.receipt_no and a.created_by=c.user_id and date(b.cancelled_dt) BETWEEN '{data.from_date}' AND '{data.to_date}' and b.cancelled_by = '{data.user_id}' and a.comp_id = {data.comp_id} AND a.br_id = {data.br_id})a group by created_by,user_name"

    # query = f"Select c.user_name user_name,a.created_by user_id, sum(a.net_amt) net_amt, count(a.receipt_no) receipt_no_count from td_receipt a, md_user c,td_item_sale b where a.receipt_no = b.receipt_no and a.created_by=c.user_id and a.trn_date BETWEEN '{data.from_date}' and '{data.to_date}' and b.cancel_flag = 0 and a.comp_id = {data.comp_id} AND a.br_id = {data.br_id} and c.user_id='{data.user_id}'  group by c.user_name,a.created_by"


    query = f"Select c.user_name user_name,a.created_by user_id, sum(a.net_amt) net_amt, count(a.receipt_no) receipt_no_count from td_receipt a, md_user c where a.created_by=c.user_id and a.trn_date BETWEEN '{data.from_date}' and '{data.to_date}' and a.comp_id ={data.comp_id} AND a.br_id = {data.br_id} and c.user_id='{data.user_id}' group by c.user_name,a.created_by"
    print(query)
    cursor.execute(query)
    records = cursor.fetchall()
    result = createResponse(records, cursor.column_names, 1)
    conn.close()
    cursor.close()
    if records==[]:
        resData= {"status":0, "data":[]}
    else:
        resData= {
        "status":1,
        "data":result
        }
    return resData

# ===================================================================================================
# Customer Ledger

@repoRouter.post('/customer_ledger')
async def customer_ledger(data:CustomerLedger):
    conn = connect()
    cursor = conn.cursor()
    query = f"select ifnull(b.cust_name,'NA')cust_name, a.phone_no, a.recover_dt, a.paid_amt, a.due_amt, a.curr_due_amt balance from td_recovery_new a,md_customer b where a.comp_id = b.comp_id and a.phone_no = b.phone_no and a.comp_id = {data.comp_id} and a.br_id = {data.br_id} and a.phone_no = {data.phone_no} order by a.recover_dt,a.recover_id"
    cursor.execute(query)
    records = cursor.fetchall()
    result = createResponse(records, cursor.column_names, 1)
    conn.close()
    cursor.close()
    if records==[]:
        resData= {"status":0, "data":[]}
    else:
        resData= {
        "status":1,
        "data":result
        }
    return resData

# ========================================================================================================
# Recovery report between 2 dates

@repoRouter.post('/recovery_report')
async def recovery_report(data:RecveryReport):
    conn = connect()
    cursor = conn.cursor()
    query = f"select if null(b.cust_name,'NA')cust_name, a.phone_no, a.recover_dt, Sum(a.paid_amt)recovery_amt from td_recovery_new a,md_customer b where a.comp_id = b.comp_id and a.phone_no = b.phone_no and a.comp_id = {data.comp_id} and a.br_id = {data.br_id} and a.recover_dt between '{data.from_date}' and '{data.to_date}' GROUP BY b.cust_name,a.phone_no,a.recover_dt order by a.recover_dt"
    cursor.execute(query)
    records = cursor.fetchall()
    result = createResponse(records, cursor.column_names, 1)
    conn.close()
    cursor.close()
    if records==[]:
        resData= {"status":0, "data":[]}
    else:
        resData= {
        "status":1,
        "data":result
        }
    return resData

# =====================================================================================================
# Due report 

@repoRouter.post('/due_report')
async def due_report(data:DueReportMobileAPI):
    conn = connect()
    cursor = conn.cursor()
    query = f"select ifnull(b.cust_name,'NA')cust_name, a.phone_no, Sum(due_amt) - Sum(paid_amt)due_amt from td_recovery_new a,md_customer b where a.comp_id = b.comp_id and a.phone_no = b.phone_no and a.comp_id = {data.comp_id} and a.br_id = {data.br_id} and a.recover_dt <= '{data.date}' and a.created_by = '{data.user_id}' GROUP BY b.cust_name,a.phone_no having due_amt>0"
    print(query)
    cursor.execute(query)
    records = cursor.fetchall()
    result = createResponse(records, cursor.column_names, 1)
    conn.close()
    cursor.close()
    if records==[]:
        resData= {"status":0, "data":[]}
    else:
        resData= {
        "status":1,
        "data":result
        }
    return resData

########============================================================================#########################

# // Estimate App //

@repoRouter.post('/productwise_report')
async def Productwise_report(item_rep:ItemReport):
    conn = connect()
    cursor = conn.cursor()
    print('g_var',getGlobal())
    created_by = getGlobal()
    # query = f"SELECT DISTINCT b.item_name,a.item_id,(SELECT unit_name from md_unit where sl_no=b.unit_id) as unit_name,(SELECT SUM(qty) FROM td_item_sale where item_id=a.item_id) as tot_item_qty, (SELECT price FROM md_item_rate WHERE item_id=a.item_id) as unit_price, c.selling_price,(SELECT sum(price*qty) FROM td_item_sale where item_id=a.item_id) as tot_item_price, e.category_name, d.stock, (SELECT SUM(x.price*x.qty) FROM td_item_sale x, td_receipt y WHERE x.receipt_no=y.receipt_no AND y.pay_mode='C' AND x.trn_date BETWEEN '{item_rep.from_date}' AND '{item_rep.to_date}') as tot_received_cash from td_item_sale a, md_items b, md_item_rate c, td_stock d, md_category e where a.item_id = b.id and b.id=c.item_id and d.comp_id=a.comp_id and d.br_id=a.br_id and d.item_id=a.item_id and b.catg_id=e.sl_no and a.comp_id = {item_rep.comp_id} and a.br_id = {item_rep.br_id} and a.trn_date BETWEEN '{item_rep.from_date}' and '{item_rep.to_date}' and a.receipt_no not in (select receipt_no from td_receipt_cancel_new where date(cancelled_dt)between '{item_rep.from_date}' and '{item_rep.to_date}') group by a.receipt_no,a.item_id,b.item_name"

    # query = f"SELECT b.item_name,a.item_id,d.unit_name as unit_name,e.category_name,SUM(a.qty)as tot_item_qty,c.price as unit_price,sum(a.price*a.qty)as tot_item_price from td_item_sale a, md_items b, md_item_rate c,md_unit d,md_category e,md_brand f where a.item_id = b.id and a.item_id=c.item_id  and b.unit_id = d.sl_no and a.comp_id = {item_rep.comp_id} and a.br_id = {item_rep.br_id} and a.trn_date BETWEEN '{item_rep.from_date}' and '{item_rep.to_date}' and b.brand_id=f.brand_id and f.catg_id=e.sl_no and a.cancel_flag = 0 group by b.item_name,a.item_id,d.unit_name,c.price"
    # query = f"SELECT  b.item_name,a.item_id,d.unit_name as unit_name,e.category_name,SUM(a.qty)as tot_item_qty,c.price as unit_price,sum(a.price*a.qty)as tot_item_price from td_item_sale a, md_items b, md_item_rate c,md_unit d,md_category e,md_brand f where a.item_id = b.id and a.item_id=c.item_id  and b.unit_id = d.sl_no and a.comp_id = {item_rep.comp_id} and a.br_id = {item_rep.br_id} and a.trn_date BETWEEN '{item_rep.from_date}' and '{item_rep.to_date}' and b.catg_id=e.sl_no and a.cancel_flag = 0 group by b.item_name,a.item_id,d.unit_name,c.price"



    # query = f"SELECT b.item_name,a.item_id,d.unit_name as unit_name,e.category_name,SUM(a.qty)as tot_item_qty,c.price as unit_price,sum(a.price*a.qty)as tot_item_price FROM td_item_sale a JOIN md_items b ON a.item_id = b.id JOIN md_item_rate c ON a.item_id=c.item_id LEFT JOIN md_unit d ON b.unit_id = d.sl_no JOIN md_category e ON b.catg_id=e.sl_no WHERE a.comp_id  = {item_rep.comp_id} and a.br_id = {item_rep.br_id} and a.trn_date BETWEEN  '{item_rep.from_date}' and '{item_rep.to_date}' and
    # a.created_by = '{created_by}' a.cancel_flag = 0 group by b.item_name,a.item_id,d.unit_name,c.price,e.category_name"
    query = f'''SELECT b.item_name,a.item_id,d.unit_name as unit_name,e.category_name,
       SUM(a.qty)as tot_item_qty,
       c.price as unit_price,
       sum(a.price*a.qty)as tot_item_price 
 FROM td_item_sale a,md_items b,md_item_rate c,md_unit d,md_category e
 where a.item_id = b.id 
 and   a.item_id = c.item_id 
 and   b.unit_id = d.sl_no
 and   b.catg_id=e.sl_no
 and   a.comp_id  = {item_rep.comp_id} 
 and   a.br_id ={item_rep.br_id} 
 and   c.br_id = {item_rep.br_id}
 and   a.trn_date BETWEEN  '{item_rep.from_date}' and '{item_rep.to_date}'
 and   a.cancel_flag = 0 
 and   a.created_by = '{item_rep.user_id}'
 group by b.item_name,a.item_id,d.unit_name,e.category_name,c.price;'''
    # query = f"SELECT b.item_name,a.item_id,d.unit_name as unit_name,SUM(a.qty)as tot_item_qty,c.price as unit_price,sum(a.price*a.qty)as tot_item_price from td_item_sale a, md_items b, md_item_rate c,md_unit d where a.item_id = b.id and a.item_id=c.item_id  and b.unit_id = d.sl_no and a.comp_id = {item_rep.comp_id} and a.br_id = {item_rep.br_id} and a.trn_date BETWEEN '{item_rep.from_date}' and '{item_rep.to_date}' and a.cancel_flag = 0 group by b.item_name,a.item_id,d.unit_name,c.price"
    print(query)
    cursor.execute(query)
    records = cursor.fetchall()
    result = createResponse(records, cursor.column_names, 1)
    conn.close()
    cursor.close()
    if records==[]:
        resData= {"status":0, "data":[]}
    else:
        resData= {
        "status":1,
        "data":result
        }
    return resData


# get_credit_cust shows phone number and customer name with credits 

@repoRouter.post('/get_credit_cust')
async def recovery_report(data:CreditCust):
    conn = connect()
    cursor = conn.cursor()
    query = f"select cust_name, phone_no from md_customer where pay_mode='R' and comp_id={data.comp_id} and (created_by='{data.user_id}' or modified_by='{data.user_id}')"
    cursor.execute(query)
    records = cursor.fetchall()
    result = createResponse(records, cursor.column_names, 1)
    conn.close()
    cursor.close()
    if records==[]:
        resData= {"status":0, "data":[]}
    else:
        resData= {
        "status":1,
        "data":result
        }
    return resData

# =====================================================================================================


# // Estimate App //

# @repoRouter.post('/storewise_report')
# async def Productwise_report(item_rep:ItemReport):
#     conn = connect()
#     cursor = conn.cursor()

#     query = f"SELECT b.id,b.branch_name,s.receipt_no,s.item_id,i.item_name,t.net_amt,t.trn_date,s.qty from md_branch b,td_item_sale s,md_items i,td_receipt t where s.br_id=b.id and s.item_id=i.id and s.receipt_no=t.receipt_no and t.comp_id = {item_rep.comp_id} and t.br_id = {item_rep.br_id} and t.trn_date BETWEEN '{item_rep.from_date}' and '{item_rep.to_date}'"
   
#     print(query)
#     cursor.execute(query)
#     records = cursor.fetchall()
#     result = createResponse(records, cursor.column_names, 1)
#     conn.close()
#     cursor.close()
#     if records==[]:
#         resData= {"status":0, "data":[]}
#     else:
#         resData= {
#         "status":1,
#         "data":result
#         }
#     return resData



@repoRouter.post('/userwise_report')
async def userwise_report(item_rep:UserwiseReport):
    conn = connect()
    cursor = conn.cursor()

#     query = f'''select created_by,user_name,branch_name,
#     sum(receipt_no),
# sum(Quantity)Quantity,
# (sum(cash_gross_sale) + sum(credit_gross_sale))gross_sale,
# (sum(cash_round_off)  + sum(credit_round_off))round_off,
# (sum(cash_net_sale)   + sum(credit_net_sale))net_sale,
# sum(cash_net_sale) cash_sale,
# sum(credit_net_sale)credit_sale
# from (
#     SELECT a.created_by,c.user_name,d.branch_name,
#     count(distinct a.receipt_no) receipt_no,
#     sum(distinct a.amount)as cash_gross_sale,
#     sum(a.round_off) as cash_round_off,
#     sum(distinct a.net_amt) cash_net_sale,
#     0 credit_gross_sale,
#     0 credit_round_off,
#     0 credit_net_sale,
#     sum(b.qty)Quantity
#     FROM  td_receipt a,td_item_sale b,md_user c,md_branch d
#     where a.receipt_no = b.receipt_no
#     and   a.created_by = c.user_id
#     and   a.br_id = {item_rep.br_id}
#     and a.comp_id = {item_rep.comp_id} 
#     and a.trn_date BETWEEN '{item_rep.from_date}' and '{item_rep.to_date}' 
#     and a.pay_mode in ('C','U')
#     and b.receipt_no In (select receipt_no from td_item_sale where cancel_flag = 0) 
#     group by a.created_by,c.user_name,d.branch_name
#     UNION
#     SELECT a.created_by,c.user_name,d.branch_name,
#     count(distinct a.receipt_no) receipt_no,
#     0 cash_gross_sale,
#     0 cash_round_off,
#     0 cash_net_sale,
#     sum(distinct a.amount)as credit_gross_sale,
#     sum(a.round_off) as credit_round_off,
#     sum(distinct a.net_amt) credit_net_sale,
#     sum(b.qty)Quantity
#     FROM  td_receipt a,td_item_sale b,md_user c,md_branch d
#     where a.receipt_no = b.receipt_no
#     and   a.br_id = {item_rep.br_id}
#     and   c.user_id='{item_rep.user_id}'
#     and a.comp_id = {item_rep.comp_id} 
#     and a.trn_date BETWEEN '{item_rep.from_date}' and '{item_rep.to_date}' 
#     and a.pay_mode = 'R'
#     and b.receipt_no In (select receipt_no from td_item_sale where cancel_flag = 0) 
#     group by a.created_by,c.user_name,d.branch_name)a
# group by created_by,user_name,branch_name
#    ''' if item_rep.br_id==0 else f'''select created_by,user_name,branch_name,
#     sum(receipt_no),
# sum(Quantity)Quantity,
# (sum(cash_gross_sale) + sum(credit_gross_sale))gross_sale,
# (sum(cash_round_off)  + sum(credit_round_off))round_off,
# (sum(cash_net_sale)   + sum(credit_net_sale))net_sale,
# sum(cash_net_sale) cash_sale,
# sum(credit_net_sale)credit_sale
# from (
#     SELECT a.created_by,c.user_name,d.branch_name,
#     count(distinct a.receipt_no) receipt_no,
#     sum(distinct a.amount)as cash_gross_sale,
#     sum(a.round_off) as cash_round_off,
#     sum(distinct a.net_amt) cash_net_sale,
#     0 credit_gross_sale,
#     0 credit_round_off,
#     0 credit_net_sale,
#     sum(b.qty)Quantity
#     FROM  td_receipt a,td_item_sale b,md_user c,md_branch d
#     where a.receipt_no = b.receipt_no
#     and   a.br_id = d.id
#     and   c.user_id='{item_rep.user_id}'
#     and a.comp_id = {item_rep.comp_id} 
#     and a.trn_date BETWEEN '{item_rep.from_date}' and '{item_rep.to_date}' 
#     and a.br_id = {item_rep.br_id}
#     and a.pay_mode in ('C','U')
#     and b.cancel_flag = 0
#     group by a.created_by,c.user_name,d.branch_name
#     UNION
#     SELECT a.created_by,c.user_name,d.branch_name,
#     count(distinct a.receipt_no) receipt_no,
#     0 cash_gross_sale,
#     0 cash_round_off,
#     0 cash_net_sale,
#     sum(distinct a.amount)as credit_gross_sale,
#     sum(a.round_off) as credit_round_off,
#     sum(distinct a.net_amt) credit_net_sale,
#     sum(b.qty)Quantity
#     FROM  td_receipt a,td_item_sale b,md_user c,md_branch d
#     where a.receipt_no = b.receipt_no
#     and   a.br_id = d.id
#     and   c.user_id='{item_rep.user_id}'
#     and a.comp_id = {item_rep.comp_id} 
#     and a.br_id = {item_rep.br_id}
#     and a.trn_date BETWEEN '{item_rep.from_date}' and '{item_rep.to_date}' 
#     and a.pay_mode = 'R'
#     and b.cancel_flag = 0
#     group by a.created_by,c.user_name,d.branch_name)a
#     group by created_by,user_name,branch_name
#    '''
    query = f'''  
select created_by,user_name,branch_name,
    sum(receipt_no),
sum(Quantity)Quantity,
(sum(cash_gross_sale) + sum(credit_gross_sale))gross_sale,
(sum(cash_round_off)  + sum(credit_round_off))round_off,
(sum(cash_net_sale)   + sum(credit_net_sale))net_sale,
sum(cash_net_sale) cash_sale,
sum(credit_net_sale)credit_sale
from (
    SELECT a.created_by,c.user_name,d.branch_name,
    count(distinct a.receipt_no) receipt_no,
    sum(distinct a.amount)as cash_gross_sale,
    sum(a.round_off) as cash_round_off,
    sum(distinct a.net_amt) cash_net_sale,
    0 credit_gross_sale,
    0 credit_round_off,
    0 credit_net_sale,
    sum(b.qty)Quantity
    FROM  td_receipt a,td_item_sale b,md_user c,md_branch d
    where a.receipt_no = b.receipt_no
    and   a.created_by = c.user_id
    and   a.br_id = d.id
    and   a.created_by= {item_rep.user_id}
    and a.comp_id = {item_rep.comp_id} 
    and a.br_id = {item_rep.br_id}
    and a.trn_date BETWEEN '{item_rep.from_date}' and '{item_rep.to_date}'
    and a.pay_mode in ('C','U')
    and b.cancel_flag = 0
    group by a.created_by,c.user_name,d.branch_name
    UNION
    SELECT a.created_by,c.user_name,d.branch_name,
    count(distinct a.receipt_no) receipt_no,
    0 cash_gross_sale,
    0 cash_round_off,
    0 cash_net_sale,
    sum(distinct a.amount)as credit_gross_sale,
    sum(a.round_off) as credit_round_off,
    sum(distinct a.net_amt) credit_net_sale,
    sum(b.qty)Quantity
    FROM  td_receipt a,td_item_sale b,md_user c,md_branch d
    where a.receipt_no = b.receipt_no
    and   a.created_by = c.user_id
    and   a.br_id = d.id
    and   a.created_by= {item_rep.user_id}
    and a.comp_id = {item_rep.comp_id}
    and a.br_id = {item_rep.br_id}
    and a.trn_date BETWEEN {item_rep.from_date} and {item_rep.to_date} 
    and a.pay_mode = 'R'
    and b.cancel_flag = 0
    group by a.created_by,c.user_name,d.branch_name)a
    group by created_by,user_name,branch_name;
   '''
   
    print(query)
    cursor.execute(query)
    records = cursor.fetchall()
    result = createResponse(records, cursor.column_names, 1)
    conn.close()
    cursor.close()
    if records==[]:
        resData= {"status":0, "data":[]}
    else:
        resData= {
        "status":1,
        "data":result
        }
    return resData