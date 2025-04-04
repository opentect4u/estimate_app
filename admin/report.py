from fastapi import APIRouter
from config.database import connect
from models.master_model import createResponse
from models.masterApiModel import db_select, db_Insert
from models.admin_form_model import UserList,SaleReport,CollectionReport,PayModeReport,UserWiseReport,GSTstatement,RefundReport,CreditReport,ItemReport,ItemReportOutlet,CancelReport,CancelReportOutlet,DaybookReport,CustomerLedger,RecveryReport,DueReport,DueReportOutlet,dashboard,UserwiseReportOutlet
from datetime import date
reportRouter = APIRouter()

#======================================================================================================
# Sale Report

# @reportRouter.post('/sale_report')
# async def sale_report(sale:SaleReport):
#     if ({sale.br_id}.pop())>0:
#         select = "a.cust_name,a.phone_no,a.receipt_no,a.trn_date,count(b.receipt_no)no_of_items, SUM(b.qty) qty,a.price price,a.discount_amt discount_amt,a.cgst_amt cgst_amt,a.sgst_amt sgst_amt,a.round_off rount_off,a.net_amt,IF(a.pay_mode='C', 'Cash', IF(a.pay_mode='U', 'UPI', IF(a.pay_mode='D', 'Card', IF(a.pay_mode='R', 'Credit', '')))) pay_mode,c.user_name created_by"
#         table_name = "td_receipt a,td_item_sale b,md_user c"
#         where = f"a.receipt_no = b.receipt_no AND a.trn_date BETWEEN '{sale.from_date}' AND '{sale.to_date}' AND b.comp_id = {sale.comp_id} AND b.br_id = {sale.br_id} AND a.created_by=c.user_id and a.receipt_no not in (select receipt_no from td_receipt_cancel_new where date(cancelled_dt) between '{sale.from_date}' and '{sale.to_date}')"
#         order = "Group BY a.cust_name,a.phone_no,a.receipt_no,a.trn_date,a.price,a.discount_amt,a.cgst_amt,a.sgst_amt,a.round_off,a.net_amt,a.pay_mode,a.created_by Order by a.trn_date,a.receipt_no"
#         flag = 1
#         res_dt = await db_select(select,table_name,where,order,flag)
    
#     else:
#         select = "a.cust_name,a.phone_no,a.receipt_no,a.trn_date,count(b.receipt_no)no_of_items, SUM(b.qty) qty,a.price price,a.discount_amt discount_amt,a.cgst_amt cgst_amt,a.sgst_amt sgst_amt,a.round_off rount_off,a.net_amt,IF(a.pay_mode='C', 'Cash', IF(a.pay_mode='U', 'UPI', IF(a.pay_mode='D', 'Card', IF(a.pay_mode='R', 'Credit', '')))) pay_mode,c.user_name created_by"
#         table_name = "td_receipt a,td_item_sale b,md_user c"
#         where = f"a.receipt_no = b.receipt_no AND a.trn_date BETWEEN '{sale.from_date}' AND '{sale.to_date}' AND b.comp_id = {sale.comp_id} AND a.created_by=c.user_id and a.receipt_no not in (select receipt_no from td_receipt_cancel_new where date(cancelled_dt) between '{sale.from_date}' and '{sale.to_date}')"
#         order = "Group BY a.cust_name,a.phone_no,a.receipt_no,a.trn_date,a.price,a.discount_amt,a.cgst_amt,a.sgst_amt,a.round_off,a.net_amt,a.pay_mode,a.created_by Order by a.trn_date,a.receipt_no"
#         flag = 1
#         res_dt = await db_select(select,table_name,where,order,flag)

#     return res_dt


@reportRouter.post('/sale_report')
async def sale_report(sale:SaleReport):
    
    select = "a.cust_name,a.phone_no,a.receipt_no,a.trn_date,count(b.receipt_no)no_of_items, SUM(b.qty) qty,a.price price,a.discount_amt discount_amt,a.cgst_amt cgst_amt,a.sgst_amt sgst_amt,a.round_off rount_off,a.net_amt,IF(a.pay_mode='C', 'Cash', IF(a.pay_mode='U', 'UPI', IF(a.pay_mode='D', 'Card', IF(a.pay_mode='R', 'Credit', '')))) pay_mode,c.user_name created_by"
    table_name = "td_receipt a,td_item_sale b,md_user c"
    where = f"a.receipt_no = b.receipt_no AND a.trn_date BETWEEN '{sale.from_date}' AND '{sale.to_date}' AND b.comp_id = {sale.comp_id} AND b.br_id = {sale.br_id} AND a.created_by=c.user_id and a.receipt_no not in (select receipt_no from td_receipt_cancel_new where date(cancelled_dt) between '{sale.from_date}' and '{sale.to_date}')" if sale.br_id > 0 else f"a.receipt_no = b.receipt_no AND a.trn_date BETWEEN '{sale.from_date}' AND '{sale.to_date}' AND b.comp_id = {sale.comp_id} AND a.created_by=c.user_id and a.receipt_no not in (select receipt_no from td_receipt_cancel_new where date(cancelled_dt) between '{sale.from_date}' and '{sale.to_date}')"
    order = "Group BY a.cust_name,a.phone_no,a.receipt_no,a.trn_date,a.price,a.discount_amt,a.cgst_amt,a.sgst_amt,a.round_off,a.net_amt,a.pay_mode,a.created_by Order by a.trn_date,a.receipt_no"
    flag = 1
    res_dt = await db_select(select,table_name,where,order,flag)

    return res_dt

#===================================================================================================
# Bill Report / Collection Report
'''
@reportRouter.post('/collection_report')
async def collection_report(data:CollectionReport):

    select = "a.created_by, IF(a.pay_mode='C', 'Cash', IF(a.pay_mode='U', 'UPI', IF(a.pay_mode='D', 'Card', IF(a.pay_mode='R', 'Credit', '')))) pay_mode ,SUM(a.net_amt)net_amt,user_name, count(a.receipt_no)no_of_bills"
    table_name = f"(Select Distinct a.created_by created_by,a.pay_mode pay_mode,a.net_amt net_amt,c.user_name user_name, a.receipt_no receipt_no from   td_receipt a, td_item_sale b, md_user c where  a.created_by=c.user_id and a.receipt_no = b.receipt_no and a.trn_date BETWEEN '{data.from_date}' AND '{data.to_date}' and b.comp_id = {data.comp_id} AND b.br_id = {data.br_id} AND a.created_by = '{data.user_id}')a" if data.br_id>0 else f"(Select Distinct a.created_by created_by,a.pay_mode pay_mode,a.net_amt net_amt,c.user_name user_name, a.receipt_no receipt_no from   td_receipt a, td_item_sale b, md_user c where  a.created_by=c.user_id and a.receipt_no = b.receipt_no and a.trn_date BETWEEN '{data.from_date}' AND '{data.to_date}' and b.comp_id = {data.comp_id} AND a.created_by = '{data.user_id}')a"
    where = f""
    order = "GROUP BY a.created_by,a.pay_mode"
    flag = 1
    res_dt = await db_select(select,table_name,where,order,flag)
    
    return res_dt 
    '''

# ==================================================================================================
# PayMode Report

# @reportRouter.post('/paymode_report')
# async def paymode_report(data:PayModeReport):

#     select = "count(receipt_no)no_of_rcpt, IF(a.pay_mode='C', 'Cash', IF(a.pay_mode='U', 'UPI', IF(a.pay_mode='D', 'Card', IF(a.pay_mode='R', 'Credit', '')))) pay_mode, Sum(net_amt) net_amt, sum(cancelled_amt)can_amt"

#     table_name = f"(select receipt_no, pay_mode, net_amt, 0 cancelled_amt from td_receipt where trn_date BETWEEN '{data.from_date}' and '{data.to_date}' and comp_id= {data.comp_id} AND br_id = {data.br_id} UNION select a.receipt_no receipt_no, a.pay_mode pay_mode, 0 net_amt, a.net_amt cancelled_amt from td_receipt a,td_receipt_cancel_new b where a.receipt_no = b.receipt_no and date(b.cancelled_dt) BETWEEN '{data.from_date}' and '{data.to_date}' and a.comp_id= {data.comp_id} AND a.br_id = {data.br_id})a" if data.br_id>0 else f"(select receipt_no, pay_mode, net_amt, 0 cancelled_amt from td_receipt where trn_date BETWEEN '{data.from_date}' and '{data.to_date}' and comp_id= {data.comp_id} UNION select a.receipt_no receipt_no, a.pay_mode pay_mode, 0 net_amt, a.net_amt cancelled_amt from td_receipt a,td_receipt_cancel_new b where a.receipt_no = b.receipt_no and date(b.cancelled_dt) BETWEEN '{data.from_date}' and '{data.to_date}' and a.comp_id= {data.comp_id})a"

#     where = f""
#     order = "GROUP BY pay_mode"
#     flag = 1
#     res_dt = await db_select(select,table_name,where,order,flag)
    
#     return res_dt

@reportRouter.post('/paymode_report')
async def paymode_report(data:PayModeReport):

    # select = "count(receipt_no)no_of_rcpt, IF(pay_mode='C', 'Cash', IF(pay_mode='U', 'UPI', IF(pay_mode='D', 'Card', IF(pay_mode='R', 'Credit', '')))) pay_mode, Sum(net_amt) net_amt"

    # table_name = f"td_receipt"

    # where = f"trn_date BETWEEN '{data.from_date}' and '{data.to_date}' and comp_id= {data.comp_id} AND br_id = {data.br_id} and receipt_no in (select distinct receipt_no from td_item_sale where cancel_flag = 0)" if data.br_id>0 else f"trn_date BETWEEN '{data.from_date}' and '{data.to_date}' and comp_id= {data.comp_id} and receipt_no in (select distinct receipt_no from td_item_sale where cancel_flag = 0)" 
    # order = "GROUP BY pay_mode"

    select = f"count(receipt_no)no_of_rcpt, pay_mode,Sum(net_amt) net_amt, sum(due_amt)due_amt,ifnull(sum(recover_amt),0)recover_amt"
    table_name = f"( select receipt_no, pay_mode, net_amt, if(pay_mode = 'R',(net_amt - received_amt),0)due_amt, 0 recover_amt from td_receipt where trn_date BETWEEN '{data.from_date}' and '{data.to_date}' and comp_id= {data.comp_id} AND br_id = {data.br_id} and receipt_no in (select distinct receipt_no from td_item_sale where cancel_flag = 0) UNION select '' receipt_no, 'Z'pay_mode, 0 net_amt, 0 due_amt, sum(paid_amt) recover_amt from td_recovery where recover_dt BETWEEN '{data.from_date}' and '{data.to_date}')a" if data.br_id>0 else f"( select receipt_no, pay_mode, net_amt, if(pay_mode = 'R',(net_amt - received_amt),0)due_amt, 0 recover_amt from td_receipt where trn_date BETWEEN '{data.from_date}' and '{data.to_date}' and comp_id= {data.comp_id} and receipt_no in (select distinct receipt_no from td_item_sale where cancel_flag = 0) UNION select '' receipt_no, 'Z'pay_mode, 0 net_amt, 0 due_amt, sum(paid_amt) recover_amt from td_recovery where recover_dt BETWEEN '{data.from_date}' and '{data.to_date}')a"
    where = ""
    order = f"group by pay_mode"
    flag = 1
    res_dt = await db_select(select,table_name,where,order,flag)
    
    return res_dt

# ==================================================================================================
# Userwise Sale Report Details

@reportRouter.post('/userwise_sale_report')
async def userwise_sale_report(data:UserWiseReport):

    # select = "created_by, sum(net_amt)net_amt, sum(cancelled_amt)cancelled_amt, COUNT(receipt_no)no_of_receipts, user_name"
    # table_name = f"( Select a.created_by created_by, a.net_amt net_amt, 0 cancelled_amt, c.user_name user_name, a.receipt_no receipt_no from td_receipt a, md_user c where a.created_by=c.user_id and a.trn_date BETWEEN '{data.from_date}' and '{data.to_date}' and a.comp_id = {data.comp_id} AND a.br_id = {data.br_id} UNION Select a.created_by created_by, 0 net_amt, a.net_amt cancelled_amt, c.user_name user_name, b.receipt_no receipt_no from td_receipt a, md_user c,td_receipt_cancel_new b where a.receipt_no = b.receipt_no and a.created_by=c.user_id and date(b.cancelled_dt) BETWEEN '{data.from_date}' and '{data.to_date}' and a.comp_id = {data.comp_id} AND a.br_id = {data.br_id})a" if data.br_id>0 else f"( Select a.created_by created_by, a.net_amt net_amt, 0 cancelled_amt, c.user_name user_name, a.receipt_no receipt_no from td_receipt a, md_user c where a.created_by=c.user_id and a.trn_date BETWEEN '{data.from_date}' and '{data.to_date}' and a.comp_id = {data.comp_id} UNION Select a.created_by created_by, 0 net_amt, a.net_amt cancelled_amt, c.user_name user_name, b.receipt_no receipt_no from td_receipt a, md_user c,td_receipt_cancel_new b where a.receipt_no = b.receipt_no and a.created_by=c.user_id and date(b.cancelled_dt) BETWEEN '{data.from_date}' and '{data.to_date}' and a.comp_id = {data.comp_id})a"
    # where = f""
    # order = "GROUP BY created_by,user_name"

    select = f"c.user_name user_name,a.created_by user_id, sum(a.net_amt) net_amt, count(a.receipt_no) receipt_no_count, sum(a.net_amt) cancelled_amount"
    table_name = f"td_receipt a, md_user c,td_item_sale b,td_receipt_cancel_new n"
    where = f"a.receipt_no = b.receipt_no and a.created_by=c.user_id and a.trn_date BETWEEN '{data.from_date}' and '{data.to_date}' and b.cancel_flag = 0 and a.comp_id = {data.comp_id} AND a.br_id = {data.br_id} and n.receipt_no=a.receipt_no group by c.user_name,a.created_by "
    order = f" order by c.user_name,a.created_by" if data.br_id>0 else f" order by a.receipt_no = b.receipt_no and a.created_by=c.user_id and a.trn_date BETWEEN '{data.from_date}' and '{data.to_date}' and b.cancel_flag = 0 and a.comp_id = {data.comp_id} "
    # order = f"c.user_name,a.created_by"
    # order = f""
    flag = 1
    res_dt = await db_select(select,table_name,where,order,flag)
    
    return res_dt



@reportRouter.post('/userwise_report_outlet')
async def userwise_report(item_rep:UserwiseReportOutlet):
    conn = connect()
    cursor = conn.cursor()
    
    query_user = f'''select created_by,user_name,branch_name,
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
    and   a.created_by = '{item_rep.user_id}'
    and   a.br_id = {item_rep.br_id}
    and a.comp_id = {item_rep.comp_id} 
    and a.trn_date BETWEEN '{item_rep.from_date}' and '{item_rep.to_date}' 
    and a.pay_mode in ('C','U')
    and b.receipt_no In (select receipt_no from td_item_sale where cancel_flag = 0) 
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
    and   a.br_id = {item_rep.br_id}
    and   c.user_id='{item_rep.user_id}'
    and a.comp_id = {item_rep.comp_id} 
    and a.trn_date BETWEEN '{item_rep.from_date}' and '{item_rep.to_date}' 
    and a.pay_mode = 'R'
    and b.receipt_no In (select receipt_no from td_item_sale where cancel_flag = 0) 
    group by a.created_by,c.user_name,d.branch_name)a
group by created_by,user_name,branch_name
   ''' if item_rep.br_id==0 else f'''select created_by,user_name,branch_name,
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
    and   a.br_id = d.id
    and   c.user_id='{item_rep.user_id}'
    and a.comp_id = {item_rep.comp_id} 
    and a.trn_date BETWEEN '{item_rep.from_date}' and '{item_rep.to_date}' 
    and a.br_id = {item_rep.br_id}
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
    and   a.br_id = d.id
    and   c.user_id='{item_rep.user_id}'
    and a.comp_id = {item_rep.comp_id} 
    and a.br_id = {item_rep.br_id}
    and a.trn_date BETWEEN '{item_rep.from_date}' and '{item_rep.to_date}' 
    and a.pay_mode = 'R'
    and b.cancel_flag = 0
    group by a.created_by,c.user_name,d.branch_name)a
group by created_by,user_name,branch_name
   '''
    

    query_all_user = f'''select created_by,user_name,branch_name,
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
    and   a.br_id = {item_rep.br_id}
    and a.comp_id = {item_rep.comp_id} 
    and a.trn_date BETWEEN '{item_rep.from_date}' and '{item_rep.to_date}' 
    and a.pay_mode in ('C','U')
    and b.receipt_no In (select receipt_no from td_item_sale where cancel_flag = 0) 
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
    and   a.br_id = {item_rep.br_id}
    and a.comp_id = {item_rep.comp_id} 
    and a.trn_date BETWEEN '{item_rep.from_date}' and '{item_rep.to_date}' 
    and a.pay_mode = 'R'
    and b.receipt_no In (select receipt_no from td_item_sale where cancel_flag = 0) 
    group by a.created_by,c.user_name,d.branch_name)a
group by created_by,user_name,branch_name
   ''' if item_rep.br_id==0 else f'''select created_by,user_name,branch_name,
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
    and   a.br_id = d.id
    and a.comp_id = {item_rep.comp_id} 
    and a.trn_date BETWEEN '{item_rep.from_date}' and '{item_rep.to_date}' 
    and a.br_id = {item_rep.br_id}
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
    and   a.br_id = d.id
    and a.comp_id = {item_rep.comp_id} 
    and a.br_id = {item_rep.br_id}
    and a.trn_date BETWEEN '{item_rep.from_date}' and '{item_rep.to_date}' 
    and a.pay_mode = 'R'
    and b.cancel_flag = 0
    group by a.created_by,c.user_name,d.branch_name)a
    group by created_by,user_name,branch_name
   '''
    query = query_user if item_rep.user_id!='0' else query_all_user
    print(query)
    cursor.execute(query)
    records = cursor.fetchall()
    result = createResponse(records, cursor.column_names, 1)
    conn.close()
    cursor.close()
    if records==[]:
        resData= {"status":0, "msg":[]}
    else:
        resData= {
        "status":1,
        "msg":result
        }
    return resData

# =================================================================================================
# GST Statement

@reportRouter.post('/gst_statement')
async def gst_statement(gst:GSTstatement):
    if ({gst.br_id}.pop())>0:
        select = "Distinct a.receipt_no, a.trn_date, (a.price - a.discount_amt)taxable_amt, a.cgst_amt, a.sgst_amt, (a.cgst_amt + a.sgst_amt)total_tax, a.net_amt"
        table_name = "td_receipt a, td_item_sale b"
        where = f"a.receipt_no = b.receipt_no AND b.comp_id = {gst.comp_id} AND b.br_id = {gst.br_id} AND a.trn_date BETWEEN '{gst.from_date}' AND '{gst.to_date}'"
        order = f""
        flag = 1
        res_dt = await db_select(select,table_name,where,order,flag)
    
    else:
        select = "Distinct a.receipt_no, a.trn_date, (a.price - a.discount_amt)taxable_amt, a.cgst_amt, a.sgst_amt, (a.cgst_amt + a.sgst_amt)total_tax, a.net_amt"
        table_name = "td_receipt a, td_item_sale b"
        where = f"a.receipt_no = b.receipt_no AND b.comp_id = {gst.comp_id} AND a.trn_date BETWEEN '{gst.from_date}' AND '{gst.to_date}'"
        order = f""
        flag = 1
        res_dt = await db_select(select,table_name,where,order,flag)

    return res_dt

# ==================================================================================================
# GST Summary

# @reportRouter.post('/gst_summary')
# async def gst_summary(gst:GSTstatement):
#     if ({gst.br_id}.pop())>0:
#         select = "cgst_prtg, SUM(cgst_amt)cgst_amt, SUM(sgst_amt)sgst_amt, SUM(cgst_amt) + SUM(sgst_amt)total_tax"
#         table_name = "td_item_sale"
#         where = f"comp_id = {gst.comp_id} AND br_id = {gst.br_id} AND trn_date BETWEEN '{gst.from_date}' AND '{gst.to_date}'"
#         order = "GROUP BY cgst_prtg"
#         flag = 1
#         res_dt = await db_select(select,table_name,where,order,flag)
    
#     else:
#         select = "cgst_prtg, SUM(cgst_amt)cgst_amt, SUM(sgst_amt)sgst_amt, SUM(cgst_amt) + SUM(sgst_amt)total_tax"
#         table_name = "td_item_sale"
#         where = f"comp_id = {gst.comp_id} AND trn_date BETWEEN '{gst.from_date}' AND '{gst.to_date}'"
#         order = "GROUP BY cgst_prtg"
#         flag = 1
#         res_dt = await db_select(select,table_name,where,order,flag)

#     return res_dt


@reportRouter.post('/gst_summary')
async def gst_summary(gst:GSTstatement):

    select = "cgst_prtg, SUM(cgst_amt)cgst_amt, SUM(sgst_amt)sgst_amt, SUM(cgst_amt) + SUM(sgst_amt)total_tax"
    table_name = "td_item_sale"
    where = f"comp_id = {gst.comp_id} AND br_id = {gst.br_id} AND trn_date BETWEEN '{gst.from_date}' AND '{gst.to_date}'" if gst.br_id > 0 else f"comp_id = {gst.comp_id} AND trn_date BETWEEN '{gst.from_date}' AND '{gst.to_date}'"
    order = "GROUP BY cgst_prtg"
    flag = 1
    res_dt = await db_select(select,table_name,where,order,flag)

    return res_dt

# ==================================================================================================
#  Refund Report Details 

# @reportRouter.post('/refund_report')
# async def refund_report(data:RefundReport):
#     if ({data.br_id}.pop())>0:
#         select = "a.cust_name, a.phone_no, a.refund_rcpt_no, a.refund_dt,  count(b.refund_rcpt_no)no_of_items, SUM(b.qty) qty, a.price, a.discount_amt, a.cgst_amt, a.sgst_amt,a.round_off, a.net_amt, a.refund_by"
#         table_name = "td_refund_bill a, td_refund_item b"
#         where = f"a.refund_rcpt_no = b.refund_rcpt_no AND a.refund_dt BETWEEN '{data.from_date}' AND '{data.to_date}' AND b.comp_id = {data.comp_id} AND b.br_id = {data.br_id}"
#         order = "group by a.cust_name, a.phone_no, a.refund_rcpt_no, a.refund_dt, a.refund_by"
#         flag = 1
#         res_dt = await db_select(select,table_name,where,order,flag)
    
#     else:
#         select = "a.cust_name, a.phone_no, a.refund_rcpt_no, a.refund_dt,  count(b.refund_rcpt_no)no_of_items, SUM(b.qty) qty, a.price, a.discount_amt, a.cgst_amt, a.sgst_amt,a.round_off, a.net_amt, a.refund_by"
#         table_name = "td_refund_bill a, td_refund_item b"
#         where = f"a.refund_rcpt_no = b.refund_rcpt_no AND a.refund_dt BETWEEN '{data.from_date}' AND '{data.to_date}' AND b.comp_id = {data.comp_id}"
#         order = "group by a.cust_name, a.phone_no, a.refund_rcpt_no, a.refund_dt, a.refund_by"
#         flag = 1
#         res_dt = await db_select(select,table_name,where,order,flag)

#     return res_dt


@reportRouter.post('/refund_report')
async def refund_report(data:RefundReport):
   
    select = "a.cust_name, a.phone_no, a.refund_rcpt_no, a.refund_dt,  count(b.refund_rcpt_no)no_of_items, SUM(b.qty) qty, a.price, a.discount_amt, a.cgst_amt, a.sgst_amt,a.round_off, a.net_amt, a.refund_by"
    table_name = "td_refund_bill a, td_refund_item b"
    where = f"a.refund_rcpt_no = b.refund_rcpt_no AND a.refund_dt BETWEEN '{data.from_date}' AND '{data.to_date}' AND b.comp_id = {data.comp_id} AND b.br_id = {data.br_id}" if data.br_id>0 else f"a.refund_rcpt_no = b.refund_rcpt_no AND a.refund_dt BETWEEN '{data.from_date}' AND '{data.to_date}' AND b.comp_id = {data.comp_id}"
    order = "group by a.cust_name, a.phone_no, a.refund_rcpt_no, a.refund_dt, a.refund_by"
    flag = 1
    res_dt = await db_select(select,table_name,where,order,flag)

    return res_dt
# ======================================================================================================
#  Credit Report Details 

# @reportRouter.post('/credit_report')
# async def credit_report(data:CreditReport):
#     if ({data.br_id}.pop())>0:
#         select = "trn_date, cust_name, phone_no, receipt_no, net_amt, received_amt as paid_amt, net_amt-received_amt as due_amt, created_by"
#         table_name = "td_receipt"
#         where = f"pay_mode = 'R' and net_amt-received_amt > 0 AND trn_date BETWEEN '{data.from_date}' AND '{data.to_date}' AND comp_id = {data.comp_id} AND br_id = {data.br_id}"
#         order = "group by phone_no,receipt_no,trn_date,created_by"
#         flag = 1
#         res_dt = await db_select(select,table_name,where,order,flag)
    
#     else:
#         select = "trn_date, cust_name, phone_no, receipt_no, net_amt, received_amt as paid_amt, net_amt-received_amt as due_amt, created_by"
#         table_name = "td_receipt"
#         where = f"pay_mode = 'R' and net_amt-received_amt > 0 AND trn_date BETWEEN '{data.from_date}' AND '{data.to_date}' AND comp_id = {data.comp_id}"
#         order = "group by phone_no,receipt_no,trn_date,created_by"
#         flag = 1
#         res_dt = await db_select(select,table_name,where,order,flag)

#     return res_dt


@reportRouter.post('/credit_report')
async def credit_report(data:CreditReport):
    
    select = "trn_date, cust_name, phone_no, receipt_no, net_amt, received_amt as paid_amt, net_amt-received_amt as due_amt, created_by"
    table_name = "td_receipt"
    where = f"pay_mode = 'R' and net_amt-received_amt > 0 AND trn_date BETWEEN '{data.from_date}' AND '{data.to_date}' AND comp_id = {data.comp_id} AND br_id = {data.br_id}" if data.br_id>0 else f"pay_mode = 'R' and net_amt-received_amt > 0 AND trn_date BETWEEN '{data.from_date}' AND '{data.to_date}' AND comp_id = {data.comp_id}"
    order = "group by phone_no,receipt_no,trn_date,created_by"
    flag = 1
    res_dt = await db_select(select,table_name,where,order,flag)

    return res_dt

# ==================================================================================================
# Item Wise Sale Report

@reportRouter.post('/item_report')
async def collection_report(item_rep:ItemReport):
    
    select = f"a.receipt_no,a.item_id,b.item_name,sum(a.qty)qty,sum(a.price*a.qty)price"
    table_name = "td_item_sale a, md_items b"
    where = f"a.item_id = b.id and a.comp_id = {item_rep.comp_id} and a.br_id = {item_rep.br_id} and a.trn_date BETWEEN '{item_rep.from_date}' and '{item_rep.to_date}' and a.receipt_no not in (select receipt_no from td_receipt_cancel_new where date(cancelled_dt)between '{item_rep.from_date}' and '{item_rep.to_date}')" if item_rep.br_id>0 else f"a.item_id = b.id and a.comp_id = {item_rep.comp_id} and a.trn_date BETWEEN '{item_rep.from_date}' and '{item_rep.to_date}' and a.receipt_no not in (select receipt_no from td_receipt_cancel_new where date(cancelled_dt)between '{item_rep.from_date}' and '{item_rep.to_date}')"
    order = "group by a.receipt_no,a.item_id,b.item_name"
    flag = 1
    res_dt = await db_select(select,table_name,where,order,flag)
    
    return res_dt


@reportRouter.post('/productwise_report')
async def productwise_report(item_rep:ItemReport):
    
    select = f"b.item_name,a.item_id,d.unit_name as unit_name,SUM(a.qty)as tot_item_qty,c.price as unit_price,sum(a.price*a.qty)as tot_item_price,catg.category_name,brn.brand_name, max(a.trn_date) to_dt,min(a.trn_date) from_dt, concat(min(a.trn_date),' - ',max(a.trn_date)) as range_dt"
    table_name = "td_item_sale a, md_items b, md_item_rate c,md_unit d,md_category catg,md_brand brn"
    where = f"b.brand_id=brn.brand_id and b.catg_id=catg.sl_no and a.item_id = b.id and a.item_id=c.item_id  and b.unit_id = d.sl_no and a.comp_id = {item_rep.comp_id} and a.br_id = {item_rep.br_id} and a.trn_date BETWEEN '{item_rep.from_date}' and '{item_rep.to_date}' and a.cancel_flag = 0" if item_rep.br_id>0 else f"b.brand_id=brn.brand_id and b.catg_id=catg.sl_no and a.item_id = b.id and a.item_id=c.item_id  and b.unit_id = d.sl_no and a.comp_id = {item_rep.comp_id} and a.trn_date BETWEEN '{item_rep.from_date}' and '{item_rep.to_date}' and a.cancel_flag = 0"
    order = "group by b.item_name,a.item_id,d.unit_name,c.price,catg.category_name,brn.brand_name"
    flag = 1
    res_dt = await db_select(select,table_name,where,order,flag)
    
    return res_dt


@reportRouter.post('/productwise_report_outlet')
async def productwise_report(item_rep:ItemReportOutlet):
    
    # select = f"b.item_name,a.item_id,d.unit_name as unit_name,SUM(a.qty)as tot_item_qty,c.price as unit_price,sum(a.price*a.qty)as tot_item_price,catg.category_name,brn.brand_name, max(a.trn_date) to_dt,min(a.trn_date) from_dt, concat(min(a.trn_date),' - ',max(a.trn_date)) as range_dt"
    # table_name = "td_item_sale a, md_items b, md_item_rate c,md_unit d,md_category catg,md_brand brn"
    # where = f"b.brand_id=brn.brand_id and b.catg_id=catg.sl_no and a.item_id = b.id and a.item_id=c.item_id  and b.unit_id = d.sl_no and a.comp_id = {item_rep.comp_id} and a.br_id = {item_rep.br_id} and a.trn_date BETWEEN '{item_rep.from_date}' and '{item_rep.to_date}' and a.created_by='{item_rep.user_id}' and a.cancel_flag = 0" if item_rep.br_id>0 else f"b.brand_id=brn.brand_id and b.catg_id=catg.sl_no and a.item_id = b.id and a.item_id=c.item_id  and b.unit_id = d.sl_no and a.comp_id = {item_rep.comp_id} and a.trn_date BETWEEN '{item_rep.from_date}' and '{item_rep.to_date}' and a.cancel_flag = 0"
    # order = "group by b.item_name,a.item_id,d.unit_name,c.price,catg.category_name,brn.brand_name"
    # flag = 1
    # res_dt = await db_select(select,table_name,where,order,flag)
    
    # return res_dt

    conn = connect()
    cursor = conn.cursor()

    # query = f"SELECT DISTINCT b.item_name,a.item_id,(SELECT unit_name from md_unit where sl_no=b.unit_id) as unit_name,(SELECT SUM(qty) FROM td_item_sale where item_id=a.item_id) as tot_item_qty, (SELECT price FROM md_item_rate WHERE item_id=a.item_id) as unit_price, c.selling_price,(SELECT sum(price*qty) FROM td_item_sale where item_id=a.item_id) as tot_item_price, e.category_name, d.stock, (SELECT SUM(x.price*x.qty) FROM td_item_sale x, td_receipt y WHERE x.receipt_no=y.receipt_no AND y.pay_mode='C' AND x.trn_date BETWEEN '{item_rep.from_date}' AND '{item_rep.to_date}') as tot_received_cash from td_item_sale a, md_items b, md_item_rate c, td_stock d, md_category e where a.item_id = b.id and b.id=c.item_id and d.comp_id=a.comp_id and d.br_id=a.br_id and d.item_id=a.item_id and b.catg_id=e.sl_no and a.comp_id = {item_rep.comp_id} and a.br_id = {item_rep.br_id} and a.trn_date BETWEEN '{item_rep.from_date}' and '{item_rep.to_date}' and a.receipt_no not in (select receipt_no from td_receipt_cancel_new where date(cancelled_dt)between '{item_rep.from_date}' and '{item_rep.to_date}') group by a.receipt_no,a.item_id,b.item_name"

    # query = f"SELECT b.item_name,a.item_id,d.unit_name as unit_name,e.category_name,SUM(a.qty)as tot_item_qty,c.price as unit_price,sum(a.price*a.qty)as tot_item_price from td_item_sale a, md_items b, md_item_rate c,md_unit d,md_category e,md_brand f where a.item_id = b.id and a.item_id=c.item_id  and b.unit_id = d.sl_no and a.comp_id = {item_rep.comp_id} and a.br_id = {item_rep.br_id} and a.trn_date BETWEEN '{item_rep.from_date}' and '{item_rep.to_date}' and b.brand_id=f.brand_id and f.catg_id=e.sl_no and a.cancel_flag = 0 group by b.item_name,a.item_id,d.unit_name,c.price"
    # query = f"SELECT  b.item_name,a.item_id,d.unit_name as unit_name,e.category_name,SUM(a.qty)as tot_item_qty,c.price as unit_price,sum(a.price*a.qty)as tot_item_price from td_item_sale a, md_items b, md_item_rate c,md_unit d,md_category e,md_brand f where a.item_id = b.id and a.item_id=c.item_id  and b.unit_id = d.sl_no and a.comp_id = {item_rep.comp_id} and a.br_id = {item_rep.br_id} and a.trn_date BETWEEN '{item_rep.from_date}' and '{item_rep.to_date}' and b.catg_id=e.sl_no and a.cancel_flag = 0 group by b.item_name,a.item_id,d.unit_name,c.price"



    query = f"SELECT b.item_name,a.item_id,d.unit_name as unit_name,e.category_name,SUM(a.qty)as tot_item_qty,c.price as unit_price,sum(a.price*a.qty)as tot_item_price FROM td_item_sale a JOIN md_items b ON a.item_id = b.id JOIN md_item_rate c ON a.item_id=c.item_id LEFT JOIN md_unit d ON b.unit_id = d.sl_no JOIN md_category e ON b.catg_id=e.sl_no WHERE a.comp_id  = {item_rep.comp_id} and a.br_id = {item_rep.br_id} and a.trn_date BETWEEN  '{item_rep.from_date}' and '{item_rep.to_date}' and a.created_by='{item_rep.user_id}' and a.cancel_flag = 0 group by b.item_name,a.item_id,d.unit_name,c.price,e.category_name" if item_rep.user_id!='0' else f"SELECT b.item_name,a.item_id,d.unit_name as unit_name,e.category_name,SUM(a.qty)as tot_item_qty,c.price as unit_price,sum(a.price*a.qty)as tot_item_price FROM td_item_sale a JOIN md_items b ON a.item_id = b.id JOIN md_item_rate c ON a.item_id=c.item_id LEFT JOIN md_unit d ON b.unit_id = d.sl_no JOIN md_category e ON b.catg_id=e.sl_no WHERE a.comp_id  = {item_rep.comp_id} and a.br_id = {item_rep.br_id} and a.trn_date BETWEEN  '{item_rep.from_date}' and '{item_rep.to_date}' and a.cancel_flag = 0 group by b.item_name,a.item_id,d.unit_name,c.price,e.category_name"
    # query = f"SELECT b.item_name,a.item_id,d.unit_name as unit_name,SUM(a.qty)as tot_item_qty,c.price as unit_price,sum(a.price*a.qty)as tot_item_price from td_item_sale a, md_items b, md_item_rate c,md_unit d where a.item_id = b.id and a.item_id=c.item_id  and b.unit_id = d.sl_no and a.comp_id = {item_rep.comp_id} and a.br_id = {item_rep.br_id} and a.trn_date BETWEEN '{item_rep.from_date}' and '{item_rep.to_date}' and a.cancel_flag = 0 group by b.item_name,a.item_id,d.unit_name,c.price"
    print(query)
    cursor.execute(query)
    records = cursor.fetchall()
    result = createResponse(records, cursor.column_names, 1)
    conn.close()
    cursor.close()
    if records==[]:
        resData= {"status":0, "msg":[]}
    else:
        resData= {
        "status":1,
        "msg":result
        }
    return resData


@reportRouter.post('/due_report_outlet')
async def due_report(data:DueReportOutlet):
    conn = connect()
    cursor = conn.cursor()
    query = f"select ifnull(b.cust_name,'NA')cust_name, a.phone_no, Sum(due_amt) - Sum(paid_amt)due_amt from td_recovery_new a,md_customer b where a.comp_id = b.comp_id and a.phone_no = b.phone_no and a.comp_id = {data.comp_id} and a.br_id = {data.br_id} and a.recover_dt <= '{data.date}' and a.created_by='{data.user_id}' GROUP BY b.cust_name,a.phone_no having due_amt>0" if data.user_id!='0' else f"select ifnull(b.cust_name,'NA')cust_name, a.phone_no, Sum(due_amt) - Sum(paid_amt)due_amt from td_recovery_new a,md_customer b where a.comp_id = b.comp_id and a.phone_no = b.phone_no and a.comp_id = {data.comp_id} and a.br_id = {data.br_id} and a.recover_dt <= '{data.date}' GROUP BY b.cust_name,a.phone_no having due_amt>0"
    cursor.execute(query)
    records = cursor.fetchall()
    result = createResponse(records, cursor.column_names, 1)
    conn.close()
    cursor.close()
    if records==[]:
        resData= {"status":0, "msg":[]}
    else:
        resData= {
        "status":1,
        "msg":result
        }
    return resData

#=================================================================================================
# Cancel Report

@reportRouter.post('/cancel_report')
async def cancel_report(data:CancelReport):
    
    # select = f"a.cust_name, a.phone_no, a.receipt_no, a.trn_date, count(b.receipt_no)no_of_items, a.price, a.discount_amt, a.cgst_amt, a.sgst_amt, a.round_off, a.net_amt, IF(a.pay_mode='C', 'Cash', IF(a.pay_mode='U', 'UPI', IF(a.pay_mode='D', 'Card', IF(a.pay_mode='R', 'Credit', '')))) pay_mode, a.created_by"
    # table_name = "td_receipt a,td_item_sale b"
    # where = f"a.receipt_no = b.receipt_no and b.comp_id = {data.comp_id} AND b.br_id = {data.br_id} and a.receipt_no In (select receipt_no from td_receipt_cancel_new where date(cancelled_dt) between '{data.from_date}' and '{data.to_date}')" if data.br_id>0 else f"a.receipt_no = b.receipt_no and b.comp_id = {data.comp_id} AND a.receipt_no In (select receipt_no from td_receipt_cancel_new where date(cancelled_dt) between '{data.from_date}' and '{data.to_date}')"
    # order = "group by a.cust_name, a.phone_no, a.receipt_no, a.trn_date, a.price, a.discount_amt, a.cgst_amt, a.sgst_amt, a.round_off, a.net_amt, a.pay_mode, a.created_by Order by a.trn_date,a.receipt_no"

    select = f"a.receipt_no, a.trn_date, count(b.receipt_no)no_of_items, a.price, a.net_amt, IF(a.pay_mode='C', 'Cash', IF(a.pay_mode='U', 'UPI', IF(a.pay_mode='D', 'Card', IF(a.pay_mode='R', 'Credit', '')))) pay_mode, a.created_by"
    table_name = f"td_receipt a,td_item_sale b"
    where = f"a.receipt_no = b.receipt_no and b.comp_id = {data.comp_id} AND b.br_id = {data.br_id} and a.receipt_no In (select receipt_no from td_receipt_cancel_new where date(cancelled_dt) between '{data.from_date}' and '{data.to_date}')" if data.br_id>0 else f"a.receipt_no = b.receipt_no and b.comp_id = {data.comp_id} and a.receipt_no In (select receipt_no from td_receipt_cancel_new where date(cancelled_dt) between '{data.from_date}' and '{data.to_date}')"
    order = f"group by a.receipt_no, a.trn_date,a.price, a.net_amt, a.pay_mode, a.created_by Order by a.trn_date,a.receipt_no"

    flag = 1
    res_dt = await db_select(select,table_name,where,order,flag)
    
    return res_dt




@reportRouter.post('/cancel_report_outlet')
async def cancel_report(data:CancelReportOutlet):
    conn = connect()
    cursor = conn.cursor()
    
    # query=f"select a.cust_name, a.phone_no, a.receipt_no, a.trn_date, count(b.receipt_no)no_of_items, a.price, a.discount_amt, a.cgst_amt, a.sgst_amt, a.round_off, a.net_amt, a.pay_mode, a.created_by from td_receipt a,td_item_sale b where a.receipt_no = b.receipt_no and b.comp_id = {data.comp_id} AND b.br_id = {data.br_id} and a.receipt_no In (select receipt_no from td_receipt_cancel_new where date(cancelled_dt) between '{data.from_date}' and '{data.to_date}') group by a.cust_name, a.phone_no, a.receipt_no, a.trn_date,a.price, a.discount_amt, a.cgst_amt, a.sgst_amt, a.round_off, a.net_amt, a.pay_mode, a.created_by Order by a.trn_date,a.receipt_no"

    query = f"select a.receipt_no, a.trn_date, count(b.receipt_no)no_of_items, a.price, a.net_amt, IF(a.pay_mode='C','Cash', IF(a.pay_mode='R','Credit','UPI')) pay_mode, a.created_by from td_receipt a,td_item_sale b where a.receipt_no = b.receipt_no and b.comp_id = {data.comp_id} AND b.br_id = {data.br_id} and a.receipt_no In (select receipt_no from td_receipt_cancel_new where date(cancelled_dt) between '{data.from_date}' and '{data.to_date}') and a.created_by='{data.user_id}' group by a.receipt_no, a.trn_date,a.price, a.net_amt, a.pay_mode, a.created_by Order by a.trn_date,a.receipt_no" if data.user_id!='0' else  f"select a.receipt_no, a.trn_date, count(b.receipt_no)no_of_items, a.price, a.net_amt, IF(a.pay_mode='C','Cash', IF(a.pay_mode='R','Credit','UPI')) pay_mode, a.created_by from td_receipt a,td_item_sale b where a.receipt_no = b.receipt_no and b.comp_id = {data.comp_id} AND b.br_id = {data.br_id} and a.receipt_no In (select receipt_no from td_receipt_cancel_new where date(cancelled_dt) between '{data.from_date}' and '{data.to_date}') group by a.receipt_no, a.trn_date,a.price, a.net_amt, a.pay_mode, a.created_by Order by a.trn_date,a.receipt_no"

    cursor.execute(query)
    records = cursor.fetchall()
    result = createResponse(records, cursor.column_names, 1)
    conn.close()
    cursor.close()
    if records==[]:
        resData= {"status":0, "msg":[]}
    else:
        resData= {
        "status":1,
        "msg":result
        }
    return resData


#==========================================================================================================
# Daybook Report

@reportRouter.post('/daybook_report')
async def daybook_report(data:DaybookReport):
    
    select = f"receipt_no, trn_date, IF(pay_mode='C', 'Cash', IF(pay_mode='U', 'UPI', IF(pay_mode='D', 'Card', IF(pay_mode='R', 'Credit', '')))) pay_mode, net_amt, 0 cancelled_amt, created_by, ''cancelled_by"
    table_name = "td_receipt"
    where = f"comp_id = {data.comp_id} and br_id = {data.br_id} and trn_date between '{data.from_date}' and '{data.to_date}' UNION select a.receipt_no receipt_no, a.trn_date trn_date, IF(a.pay_mode='C', 'Cash', IF(a.pay_mode='U', 'UPI', IF(a.pay_mode='D', 'Card', IF(a.pay_mode='R', 'Credit', '')))) pay_mode, 0 net_amt, a.net_amt cancelled_amt, a.created_by created_by, b.cancelled_by cancelled_by From td_receipt a, td_receipt_cancel_new b where a.receipt_no = b.receipt_no and a.comp_id = {data.comp_id} and a.br_id = {data.br_id} and date(b.cancelled_dt) between '{data.from_date}' and '{data.to_date}'"if data.br_id>0 else f"comp_id = {data.comp_id} and trn_date between '{data.from_date}' and '{data.to_date}' UNION select a.receipt_no receipt_no, a.trn_date trn_date, IF(a.pay_mode='C', 'Cash', IF(a.pay_mode='U', 'UPI', IF(a.pay_mode='D', 'Card', IF(a.pay_mode='R', 'Credit', '')))) pay_mode, 0 net_amt, a.net_amt cancelled_amt, a.created_by created_by, b.cancelled_by cancelled_by From td_receipt a, td_receipt_cancel_new b where a.receipt_no = b.receipt_no and a.comp_id = {data.comp_id} and date(b.cancelled_dt) between '{data.from_date}' and '{data.to_date}'"
    order = ""
    flag = 1
    res_dt = await db_select(select,table_name,where,order,flag)
    
    return res_dt

# =========================================================================================================
# Customer Ledger (For the Credit and Recovery History of a Customer)

@reportRouter.post('/customer_ledger')
async def customer_ledger(data:CustomerLedger):
    select = f"ifnull(b.cust_name,'NA')cust_name, a.phone_no, a.recover_dt, a.paid_amt, a.due_amt, a.curr_due_amt balance"
    table_name = "td_recovery_new a,md_customer b"
    where = f"a.comp_id = b.comp_id and a.phone_no = b.phone_no and a.comp_id = {data.comp_id} and a.br_id = {data.br_id} and a.phone_no = {data.phone_no} order by a.recover_dt,a.recover_id" if data.br_id>0 else f"a.comp_id = b.comp_id and a.phone_no = b.phone_no and a.comp_id = {data.comp_id} and a.phone_no = {data.phone_no} order by a.recover_dt,a.recover_id"
    order = ""
    flag = 1
    res_dt = await db_select(select,table_name,where,order,flag)
    
    return res_dt

# =============================================================================================================
# Recovery Report

@reportRouter.post('/recovery_report')
async def recovery_report(data:RecveryReport):
    select = f"ifnull(b.cust_name,'NA')cust_name, a.phone_no, a.recover_dt, Sum(a.paid_amt)recovery_amt"
    table_name = "td_recovery_new a,md_customer b"
    where = f"a.comp_id = b.comp_id and a.phone_no = b.phone_no and a.comp_id = {data.comp_id} and a.br_id = {data.br_id} and a.recover_dt between '{data.from_date}' and '{data.to_date}' GROUP BY b.cust_name,a.phone_no,a.recover_dt order by a.recover_dt" if data.br_id>0 else f"a.comp_id = b.comp_id and a.phone_no = b.phone_no and a.comp_id = {data.comp_id} and a.recover_dt between '{data.from_date}' and '{data.to_date}' GROUP BY b.cust_name,a.phone_no,a.recover_dt order by a.recover_dt"
    order = ""
    flag = 1
    res_dt = await db_select(select,table_name,where,order,flag)
    
    return res_dt

# =============================================================================================================
# Due Report

@reportRouter.post('/due_report')
async def due_report(data:DueReport):
    select = f"ifnull(b.cust_name,'NA')cust_name, a.phone_no, Sum(due_amt) - Sum(paid_amt)due_amt"
    table_name = "td_recovery_new a,md_customer b"
    where = f"a.comp_id = b.comp_id and a.phone_no = b.phone_no and a.comp_id = {data.comp_id} and a.br_id = {data.br_id} and a.recover_dt <= '{data.date}' GROUP BY b.cust_name,a.phone_no" if data.br_id>0 else f"a.comp_id = b.comp_id and a.phone_no = b.phone_no and a.comp_id = {data.comp_id} and a.recover_dt <= '{data.date}' GROUP BY b.cust_name,a.phone_no"
    order = ""
    flag = 1
    res_dt = await db_select(select,table_name,where,order,flag)
    
    return res_dt

# =====================================================================================================

# @reportRouter.post('/stock_InOut_report')
# async def due_report(from_date:date, to_date:date):
#     select = f"a.stock, b.qty Stock_Out, c.qty Stock_In"
#     table_name = "td_stock a, td_return b, td_stock_in c"
#     where = f""
#     order = ""
#     flag = 1
#     res_dt = await db_select(select,table_name,where,order,flag)
    
#     return res_dt

# **************
# SELECT a.item_id, a.stock, SUM(b.qty) stock_in, SUM(c.qty) stock_out FROM td_stock a, td_stock_in b, td_return c WHERE a.comp_id=b.comp_id AND b.comp_id=c.comp_id AND a.br_id=b.br_id and b.br_id=c.br_id AND a.item_id=b.item_id AND b.item_id=c.item_id AND a.comp_id=1 AND a.br_id=1 AND c.item_id=1;
# **************


# Stock Report

@reportRouter.post('/stock_report')
async def stock_report(data:UserList):
    select = "a.id item_id,a.item_name,b.stock"
    table_name = "md_items a, td_stock b"
    where = f"a.id=b.item_id and a.comp_id=b.comp_id and a.comp_id = {data.comp_id} and b.br_id = {data.br_id}"
    order = ""
    flag = 1
    res_dt = await db_select(select,table_name,where,order,flag)

    return res_dt

# storewise_report (name can be changed)

@reportRouter.post('/pio_report')
async def Productwise_report(item_rep:ItemReport):
    conn = connect()
    cursor = conn.cursor()

    query = f"SELECT b.id as store_id,b.branch_name as store_name,u.unit_name,t.trn_date,t.created_by as user_id,n.user_name,d.brand_name,rt.price,rt.mrp,c.category_name,s.receipt_no as invoice_no,s.item_id,IF(t.pay_mode='C','Cash',IF(t.pay_mode='U','UPI',IF(t.pay_mode='D','Card','Credit'))) pay_mode,i.item_name,(s.qty * rt.price)net_amt,t.trn_date,s.qty from md_branch b,td_item_sale s,md_items i,md_item_rate rt,td_receipt t,md_unit u,md_category c,md_brand d,md_user n where s.br_id=b.id and s.item_id=i.id and s.receipt_no=t.receipt_no and i.unit_id=u.sl_no and i.catg_id=c.sl_no and d.brand_id=i.brand_id and n.user_id=t.created_by and rt.item_id=i.id and  t.comp_id = {item_rep.comp_id} and t.br_id = {item_rep.br_id} and t.trn_date BETWEEN '{item_rep.from_date}' and '{item_rep.to_date}' and s.receipt_no In (select receipt_no from td_item_sale where cancel_flag = 0) order by t.trn_date,b.id" if item_rep.br_id>0 else  f"SELECT b.id as store_id,b.branch_name as store_name,u.unit_name,t.trn_date,t.created_by as user_id,n.user_name,d.brand_name,rt.price,rt.mrp,c.category_name,s.receipt_no as invoice_no,s.item_id,IF(t.pay_mode='C','Cash',IF(t.pay_mode='U','UPI',IF(t.pay_mode='D','Card','Credit'))) pay_mode,i.item_name,(s.qty * rt.price)net_amt,t.trn_date,s.qty from md_branch b,md_item_rate rt,td_item_sale s,md_items i,td_receipt t,md_unit u,md_category c,md_brand d,md_user n where s.br_id=b.id and s.item_id=i.id and s.receipt_no=t.receipt_no and i.unit_id=u.sl_no and i.catg_id=c.sl_no and d.brand_id=i.brand_id and n.user_id=t.created_by and rt.item_id=i.id and t.comp_id = {item_rep.comp_id} and t.trn_date BETWEEN '{item_rep.from_date}' and '{item_rep.to_date}' and s.receipt_no In (select receipt_no from td_item_sale where cancel_flag = 0) order by t.trn_date,b.id"
   
    print(query)
    cursor.execute(query)
    records = cursor.fetchall()
    result = createResponse(records, cursor.column_names, 1)
    conn.close()
    cursor.close()
    if records==[]:
        resData= {"status":0, "msg":[]}
    else:
        resData= {
        "status":1,
        "msg":result
        }
    return resData

# ===============================================



# @reportRouter.post('/employeewise_report')
# async def Productwise_report(item_rep:ItemReport):
#     conn = connect()
#     cursor = conn.cursor()

#     query = f"SELECT r.created_by as user_id,count(r.receipt_no) as receipt_no_count,sum(s.qty) as item_count,sum(r.round_off) as tot_round_off,sum(r.net_amt) as net_sale,sum(r.net_amt)+sum(r.round_off) as gross_sale,SUM(CASE When r.pay_mode='C' Then r.net_amt Else 0 End ) as tot_cash_amt, SUM(CASE When r.pay_mode='R' Then r.net_amt Else 0 End ) as tot_credit_amt,SUM(CASE When r.pay_mode='U' Then r.net_amt Else 0 End ) as tot_upi_amt,u.user_name,b.branch_name from md_user u,td_receipt r,md_branch b,td_item_sale s where u.phone_no=r.created_by and b.id = r.br_id and s.receipt_no=r.receipt_no and r.comp_id = {item_rep.comp_id} and r.br_id={item_rep.br_id} and s.trn_date BETWEEN '{item_rep.from_date}' and '{item_rep.to_date}'  group by r.created_by,u.user_name,b.branch_name" if item_rep.br_id>0 else f"SELECT r.created_by as user_id,count(r.receipt_no) as receipt_no_count,sum(s.qty) as item_count,sum(r.round_off) as tot_round_off,sum(r.net_amt) as net_sale,sum(r.net_amt)+sum(r.round_off) as gross_sale,SUM(CASE When r.pay_mode='C' Then r.net_amt Else 0 End ) as tot_cash_amt, SUM(CASE When r.pay_mode='R' Then r.net_amt Else 0 End ) as tot_credit_amt,SUM(CASE When r.pay_mode='U' Then r.net_amt Else 0 End ) as tot_upi_amt,u.user_name,b.branch_name from md_user u,td_receipt r,md_branch b,td_item_sale s where u.phone_no=r.created_by and b.id = r.br_id and s.receipt_no=r.receipt_no and r.comp_id = {item_rep.comp_id} and s.trn_date BETWEEN '{item_rep.from_date}' and '{item_rep.to_date}'  group by r.created_by,u.user_name,b.branch_name"

   
#     print(query)
#     cursor.execute(query)
#     records = cursor.fetchall()
#     result = createResponse(records, cursor.column_names, 1)
#     conn.close()
#     cursor.close()
#     if records==[]:
#         resData= {"status":0, "msg":[]}
#     else:
#         resData= {
#         "status":1,
#         "msg":result
#         }
#     return resData

# ===============================================


@reportRouter.post('/employeewise_report')
async def Employeewise_report(item_rep:ItemReport):
    conn = connect()
    cursor = conn.cursor()

    query = f'''select created_by,user_name,branch_name,
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
    and a.comp_id = {item_rep.comp_id} 
    and a.trn_date BETWEEN '{item_rep.from_date}' and '{item_rep.to_date}' 
    and a.pay_mode in ('C','U')
    and b.receipt_no In (select receipt_no from td_item_sale where cancel_flag = 0) 
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
    and a.comp_id = {item_rep.comp_id} 
    and a.trn_date BETWEEN '{item_rep.from_date}' and '{item_rep.to_date}' 
    and a.pay_mode = 'R'
    and b.receipt_no In (select receipt_no from td_item_sale where cancel_flag = 0) 
    group by a.created_by,c.user_name,d.branch_name)a
group by created_by,user_name,branch_name
   ''' if item_rep.br_id==0 else f'''select created_by,user_name,branch_name,
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
    and a.comp_id = {item_rep.comp_id} 
    and a.trn_date BETWEEN '{item_rep.from_date}' and '{item_rep.to_date}' 
    and a.br_id = {item_rep.br_id}
    and a.pay_mode in ('C','U')
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
    and a.comp_id = {item_rep.comp_id} 
    and a.br_id = {item_rep.br_id}
    and a.trn_date BETWEEN '{item_rep.from_date}' and '{item_rep.to_date}' 
    and a.pay_mode = 'R'
    group by a.created_by,c.user_name,d.branch_name)a
group by created_by,user_name,branch_name
   '''
   
    print(query)
    cursor.execute(query)
    records = cursor.fetchall()
    result = createResponse(records, cursor.column_names, 1)
    conn.close()
    cursor.close()
    if records==[]:
        resData= {"status":0, "msg":[]}
    else:
        resData= {
        "status":1,
        "msg":result
        }
    return resData