from fastapi import APIRouter, File, UploadFile, Depends, Form
from config.database import connect
from models.master_model import createResponse
from models.form_model import EditItem,AddItem,SearchByBarcode,SearchByCategory
# from models.otp_model import generateOTP
from datetime import datetime
from typing import Annotated, Union, Optional
import os
# testing git

UPLOAD_FOLDER = "upload_file"

# Ensure the upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

itmRouter = APIRouter()


#Select items
#-------------------------------------------------------------------------------------------------------------
@itmRouter.get('/items/{comp_id}')
async def show_items(comp_id:int):
    conn = connect()
    cursor = conn.cursor()
    query = f"SELECT a.*, b.*, c.unit_name, d.category_name FROM md_items a JOIN md_item_rate b on a.id=b.item_id JOIN md_category d on d.sl_no = a.catg_id LEFT JOIN md_unit c on c.sl_no=a.unit_id WHERE a.comp_id={comp_id}"
    cursor.execute(query)
    records = cursor.fetchall()
    result = createResponse(records, cursor.column_names, 1)
    conn.close()
    cursor.close()
    return result

# Edit item_rate
#-------------------------------------------------------------------------------------------------------------
@itmRouter.post('/edit_item')
async def edit_items(
    comp_id:int = Form(...),
    item_name:str = Form(...),
    item_id:int = Form(...),
    price:float = Form(...),
    discount:float = Form(...),
    cgst:float = Form(...),
    sgst:float = Form(...),
    unit_id:int = Form(...),
    catg_id:int = Form(...),
    modified_by:str = Form(...),
    file: Optional[UploadFile] = File(None)
):
    fileName = None if not file else await uploadfile(file)
    current_datetime = datetime.now()
    formatted_dt = current_datetime.strftime("%Y-%m-%d %H:%M:%S")
    item_img = f", item_img = '/uploads/{fileName}'" if fileName != None else ''
    conn = connect()
    cursor = conn.cursor()
    query = f"UPDATE md_item_rate JOIN md_items ON md_items.id=md_item_rate.item_id SET md_items.item_name = '{item_name}' {item_img}, md_item_rate.price = {price}, md_item_rate.discount = {discount}, md_item_rate.cgst = {cgst}, md_item_rate.sgst = {sgst}, md_items.unit_id={unit_id}, md_items.catg_id={catg_id}, md_item_rate.modified_by = '{modified_by}', md_item_rate.modified_dt = '{formatted_dt}', md_items.modified_by = '{modified_by}', md_items.modified_dt = '{formatted_dt}' WHERE md_item_rate.item_id={item_id} AND md_items.comp_id={comp_id}"
    cursor.execute(query)
    conn.commit()
    conn.close()
    cursor.close()
    print(query,"[[[[[[]]]]]]")
    print(cursor.rowcount)
    # print(query)
    if cursor.rowcount>0:
        resData= {
        "status":1,
        "data":"data edited successfully"
        }
    else:
        resData= {"status":0, "data":"data not edited"}
       
    return resData

# Add items
#----------------------------------------------------------------------------------------------------------------------
@itmRouter.post('/add_item')
async def add_items(
    comp_id:int = Form(...),
    br_id:int = Form(...),
    hsn_code:str = Form(...),
    item_name:str = Form(...),
    unit_id:int = Form(...),
    catg_id:int = Form(...),
    # unit_name:str
    created_by:str = Form(...),
    price:float = Form(...),
    discount:float = Form(...),
    cgst:float = Form(...),
    sgst:float = Form(...),
    file: Optional[UploadFile] = File(None)
):
    fileName = None if not file else await uploadfile(file)
    current_datetime = datetime.now()
    formatted_dt = current_datetime.strftime("%Y-%m-%d %H:%M:%S")
    item_img = f",'/uploads/{fileName}'" if fileName != None else ', ""'
    conn = connect()
    cursor = conn.cursor()
    query = f"INSERT INTO md_items(comp_id, hsn_code, item_name, item_img, unit_id, catg_id, created_by, created_dt) VALUES ({comp_id}, '{hsn_code}', '{item_name}' {item_img}, {unit_id}, {catg_id},'{created_by}', '{formatted_dt}')"
    cursor.execute(query)
    conn.commit()
    conn.close()
    cursor.close()
    print(cursor.rowcount)
    # print(query)
    if cursor.rowcount>0:
        conn1 = connect()
        cursor1 = conn1.cursor()
        query1 = f"INSERT INTO md_item_rate (item_id, price, discount, cgst, sgst, created_by, created_dt) VALUES ({cursor.lastrowid}, {price}, {discount}, {cgst}, {sgst}, '{created_by}', '{formatted_dt}')"
        cursor1.execute(query1)
        conn1.commit()
        conn1.close()
        cursor1.close()
        if cursor1.rowcount>0:
            conn2 = connect()
            cursor2 = conn2.cursor()
            query2 = f"INSERT INTO td_stock (comp_id, br_id, item_id, stock, created_by, created_dt) VALUES ({comp_id}, {br_id}, {cursor.lastrowid}, '0', '{created_by}', '{formatted_dt}')"
            cursor2.execute(query2)
            conn2.commit()
            conn2.close()
            cursor2.close()
            if cursor2.rowcount>0:
                resData={"status":1, "data": "Item and Stock Added Successfully"}
            else:
                resData={"status":0, "data": "No Stock Added"}
        else:
            resData= {"status":0, "data":"Item Rate not Added"}
    else:
        resData={"status":-1, "data":"No Data Added"}
       
    return resData


async def uploadfile(file):
    current_datetime = datetime.now()
    receipt = int(round(current_datetime.timestamp()))
    modified_filename = f"{receipt}_{file.filename}"
    res = ""
    try:
        file_location = os.path.join(UPLOAD_FOLDER, modified_filename)
        print(file_location)
        
        with open(file_location, "wb") as f:
            f.write(await file.read())
        
        res = modified_filename
        print(res)
    except Exception as e:
        # res = e.args
        res = ""
    finally:
        return res

#===============================================================================================
#==================================================================================================
# Search item info by barcode

@itmRouter.post('/search_by_barcode')
async def search_by_barcode(bar:SearchByBarcode):
    conn = connect()
    cursor = conn.cursor()
    query = f"SELECT a.id, a.comp_id, a.hsn_code, a.item_name, a.description, a.unit_id, a.bar_code, a.created_by, a.created_dt, a.modified_by, a.modified_dt, b.item_id, b.price, b.discount, b.cgst, b.sgst, c.unit_name FROM md_items a JOIN md_item_rate b on a.id=b.item_id LEFT JOIN md_unit c on c.sl_no=a.unit_id WHERE a.comp_id={bar.comp_id} and a.bar_code='{bar.bar_code}'"
    cursor.execute(query)
    records = cursor.fetchall()
    result = createResponse(records, cursor.column_names, 1)
    conn.close()
    cursor.close()
    if cursor.rowcount>0:
        res_dt={"status":1, "msg":result}
    else:
        res_dt={"status":0, "msg":[]}
    return res_dt

#===============================================================================================

