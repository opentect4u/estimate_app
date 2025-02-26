from fastapi import APIRouter
from config.database import connect
from models.master_model import createResponse
from models.form_model import CancelBill
# from models.otp_model import generateOTP

from datetime import datetime
import datetime as dt
# testing git
cancelRouter = APIRouter()

# @cancelRouter.post('/cancel_bill_two')
# async def cancel_bill_two(del_bill: CancelBill):
#     current_datetime = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
#     conn = connect()
#     cursor = conn.cursor()

#     query = f"SELECT receipt_no, trn_date, price, discount_amt, cgst_amt, sgst_amt, amount, round_off, net_amt, pay_mode, received_amt, pay_dtls, cust_name, phone_no, gst_flag, discount_type, created_by, created_dt, modified_by, modified_dt FROM td_receipt WHERE receipt_no={del_bill.receipt_no}"

#     cursor.execute(query)
#     record = cursor.fetchone()
#     # conn.close()
#     # cursor.close()
#     # print(record,"yyyyyyyyyyyy")

#     if record:
#         rec = list(record)
#         rec.append(del_bill.user_id)
#         rec.append(current_datetime)
#         # print(rec,"===========", tuple(rec))
#         # conn = connect()
#         # cursor = conn.cursor()

#         query1 = """INSERT INTO td_receipt_cancel_new (receipt_no, trn_date, price, discount_amt, cgst_amt, sgst_amt, amount, round_off, net_amt, pay_mode, received_amt, pay_dtls, cust_name, phone_no, gst_flag, discount_type, created_by, created_dt, modified_by, modified_dt, cancelled_by, cancelled_dt) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""
        
#         cursor.execute(query1,tuple(rec))
#         conn.commit()
#         # print(query1)
#         # cursor.close()
#         # conn.close()
#         print(cursor.rowcount)
#         if cursor.rowcount > 0:
#             query2 = f"SELECT receipt_no, comp_id, br_id, item_id, trn_date, price, dis_pertg, discount_amt, cgst_prtg, cgst_amt, sgst_prtg, sgst_amt, qty, created_by, created_dt, modified_by, modified_dt FROM td_item_sale WHERE receipt_no={del_bill.receipt_no}"
#             cursor.execute(query2)
#             records = cursor.fetchall()
#             # cursor.close()
#             # conn.close()

#             if records:
#                 for rec1 in records:
#                     newRec = list(rec1)
#                     newRec.append(del_bill.user_id)
#                     newRec.append(current_datetime)

#                     print(rec1, newRec)

#                     query3 = """INSERT INTO td_item_sale_cancel (receipt_no, comp_id, br_id, item_id, trn_date, price, dis_pertg, discount_amt, cgst_prtg, cgst_amt, sgst_prtg, sgst_amt, qty, created_by, created_dt, modified_by, modified_dt, cancelled_by, cancelled_dt) 
#                                 VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""
#                     cursor.execute(query3, tuple(newRec))
#                     conn.commit()
#                     # cursor.close()
#                     # conn.close()
#                 query4 = f"""UPDATE td_stock JOIN td_item_sale ON td_stock.comp_id=td_item_sale.comp_id AND td_stock.br_id=td_item_sale.br_id JOIN td_receipt ON td_item_sale.receipt_no=td_receipt.receipt_no 
#                             SET td_stock.stock=td_stock.stock+td_item_sale.qty, td_stock.modified_by='{del_bill.user_id}', td_stock.modified_dt='{current_datetime}' 
#                             WHERE td_stock.item_id=td_item_sale.item_id AND td_receipt.receipt_no={del_bill.receipt_no}"""
#                 cursor.execute(query4)
#                 conn.commit()
#                 # cursor.close()
#                 # conn.close()
#                 resData = {"status": 1, "data": "Bill cancelled and Stock added Successfully"}
#             else:
#                 resData = {"status": -3, "data": "Error while inserting into cancel item table"}
#         else:
#             resData = {"status": -2, "data": "Error while inserting into cancel bill table"}
#     else:
#         resData = {"status": -1, "data": "Error while selecting bills"}

#     # cursor.close()
#     # conn.close()

#     return resData

#=================================================================================================
# Cancel Bill

@cancelRouter.post('/cancel_bill_two')
async def cancel_bill_two(del_bill: CancelBill):
    current_datetime = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    conn = connect()
    cursor = conn.cursor()

 
    query = f"SELECT receipt_no FROM td_receipt WHERE receipt_no='{del_bill.receipt_no}'"

    cursor.execute(query)
    record = cursor.fetchone()
  
    if record:
        try:

            rec = list(record)
            rec.append(del_bill.user_id)
            rec.append(current_datetime)

            query1 = """INSERT INTO td_receipt_cancel_new (receipt_no, cancelled_by, cancelled_dt) VALUES (%s, %s, %s)"""
            
            cursor.execute(query1,tuple(rec))
            conn.commit()
            cursor.close()
            conn.close()
            if cursor.rowcount>0:
                conn = connect()
                cursor = conn.cursor()
                query2 = f"UPDATE td_item_sale SET cancel_flag=1, modified_by='{del_bill.user_id}', modified_dt='{current_datetime}' WHERE receipt_no='{del_bill.receipt_no}'"               
                cursor.execute(query2)
                conn.commit()
                print(query2,"555555555")
                cursor.close()
                conn.close()
                if cursor.rowcount>0:
                    res_dt={"status":1, "data":"Bill Cancelled Successfully"}
                else:
                    res_dt={"status":1, "data":"td_item_sale is not updated"}
            else:
                res_dt={"status":0, "data":"Failed to Cancel Bill"}
        except:
            return "Error While Inserting Cancelled Bill"

    return res_dt



#=================================================================================================
# Cancel Bill New
# @cancelRouter.post('/cancel_bill_two')
# async def cancel_bill_new(del_bill: CancelBill):
#     conn = connect()
#     cursor = conn.cursor()
#     current_datetime = datetime.now()

#     formatted_dt = current_datetime.strftime("%Y-%m-%d %H:%M:%S")
    
#     query = f"INSERT INTO td_receipt_cancel (receipt_no, comp_id, br_id, trn_date, price, discount_amt, cgst_amt, sgst_amt, amount, round_off, net_amt, pay_mode, received_amt, pay_dtls, cust_name, phone_no, rcv_cash_flag, gst_flag, gst_type, discount_flag, discount_type, discount_position, created_by, created_dt, modified_by, modified_dt,cancelled_by,cancelled_at) select receipt_no, comp_id, br_id, trn_date, price, discount_amt, cgst_amt, sgst_amt, amount, round_off, net_amt, pay_mode, received_amt, pay_dtls, cust_name, phone_no, rcv_cash_flag, gst_flag, gst_type, discount_flag, discount_type, discount_position, created_by, created_dt, modified_by, modified_dt,null,null from td_receipt where receipt_no='{del_bill.receipt_no}'"
#     # print('q=',query)
#     cursor.execute(query)
    
#     records = cursor.fetchall()
#     # print(records)
#     result = createResponse(records, cursor.column_names, 1)
#     # print('result1=',result)
#     conn.close()
#     cursor.close()
#     resData= {
#                 "status":1,
#                 "data":result
#           }
#     if records:
#          conn = connect()
#          cursor = conn.cursor()

#          query = f"INSERT INTO td_item_sale_cancel (receipt_no, comp_id, br_id, item_id, trn_date, price, dis_pertg, discount_amt, cgst_prtg, cgst_amt, sgst_prtg, sgst_amt, qty, cancel_flag, created_by, created_dt, modified_by, modified_dt, cancelled_by, cancelled_at) select receipt_no, comp_id, br_id, item_id, trn_date, price, dis_pertg, discount_amt, cgst_prtg, cgst_amt, sgst_prtg, sgst_amt, qty, cancel_flag, created_by, created_dt, modified_by, modified_dt, '{del_bill.user_id}','{formatted_dt}' from td_item_sale where receipt_no = '{del_bill.receipt_no}'"

#          cursor.execute(query)
#          records = cursor.fetchall()
#     # print(records)
#          result = createResponse(records, cursor.column_names, 1)
#         #  print('result2=',result)

#          conn.close()
#          cursor.close()
#          if records==[(0,None)]:
#              resData= {"status":0, "data":"no data"}
#          else:
#              resData= {
#                 "status":1,
#                 "data":result
#           }


#     return resData
#=================================================================================================





    