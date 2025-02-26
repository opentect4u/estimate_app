from fastapi import APIRouter, File, UploadFile, Depends, Form
from models.master_model import createResponse
from models.masterApiModel import db_select, db_Insert
from models.admin_form_model import CompId,ItemId,AddEditItem,CatgId,UpdateCategory,AddEditBrand,BrandId
from datetime import datetime
from typing import Annotated, Union, Optional
import os

# Define the upload folder
UPLOAD_FOLDER = "upload_file"

# Ensure the upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

itemRouter = APIRouter()

# ==================================================================================================
# All Item List

@itemRouter.post('/item_list')
async def item_list(data:CompId):
    select = "*"
    table_name = "md_items"
    where = f"comp_id = {data.comp_id}"
    order = f''
    flag = 1
    res_dt = await db_select(select,table_name,where,order,flag)
    return res_dt

# ==================================================================================================
# All details of a perticualr Item

@itemRouter.post('/item_details')
async def item_details(data:ItemId):
    select = "a.id,a.comp_id,a.catg_id,a.brand_id,a.item_name,a.item_img,a.unit_id,b.price,b.mrp,b.discount,b.cgst,b.sgst"
    table_name = "md_items a , md_item_rate b"
    where = f"a.id = b.item_id AND a.id = {data.item_id}"
    order = f''
    flag = 1
    res_dt = await db_select(select,table_name,where,order,flag)
    return res_dt

# ==================================================================================================
# Add and Edit Item Details

@itemRouter.post('/add_edit_items')
async def add_edit_items(
    comp_id:int = Form(...),
    item_id:int = Form(...),
    item_name:str = Form(...),
    unit_id:int = Form(...), 
    price:float = Form(...),
    mrp:float = Form(...),  
    catg_id:int = Form(...),
    brand_id:int = Form(...),
    created_by:str = Form(...),
    file: Optional[UploadFile] = File(None)
):
    fileName = None if not file else await uploadfile(file)
    current_datetime = datetime.now()
    formatted_dt = current_datetime.strftime("%Y-%m-%d %H:%M:%S")
    item_img_add = f",'/uploads/{fileName}'" if fileName != None else ', ""'
    item_img_edit = f", item_img = '/uploads/{fileName}'" if fileName != None else ''
    print('SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS')
    if item_id > 0:

        table_name = "md_items"
        fields = f"item_name ='{item_name}' {item_img_edit}, catg_id = {catg_id}, brand_id = {brand_id}, unit_id = {unit_id}, modified_by = '{created_by}', modified_dt = '{formatted_dt}'"
        values = None
        where = f"id = {item_id}"
        flag = 1
        res_dt = await db_Insert(table_name,fields,values,where,flag)
        if res_dt["suc"] > 0:
            table_name2 = "md_item_rate"
            fields2 = f"price = {price}, mrp = {mrp}, modified_by = '{created_by}', modified_dt = '{formatted_dt}'"
            values2 = None
            where2 = f"item_id = {item_id}"
            flag2 = 1
            res_dt2 = await db_Insert(table_name2,fields2,values2,where2,flag2)

    else:

        table_name = "md_items"
        fields = "catg_id, item_name, item_img, brand_id, unit_id, created_by, created_dt"
        values =f"{catg_id},'{item_name}' {item_img_add}, {brand_id},{unit_id},'{created_by}','{formatted_dt}'"
        where = None
        order = f""
        flag = 0
        res_dt = await db_Insert(table_name,fields,values,where,flag)
        # print(res_dt['lastId'],"uuuuuuuuu")
        if res_dt["suc"] > 0:
            table_name1 = "md_item_rate"
            fields1 = "item_id,price,mrp,created_by,created_dt"
            values1 = f"{res_dt['lastId']},{price},{mrp},'{created_by}','{formatted_dt}'"
            where1 = None
            flag1 = 0
            res_dt1= await db_Insert(table_name1,fields1,values1,where1,flag1)
            if res_dt1["suc"] > 0:
                select = "id"
                table_name = "md_branch"
                where = f"comp_id = {comp_id}"
                order = f''
                flag = 1
                res_dt3 = await db_select(select,table_name,where,order,flag)
                if res_dt3["suc"]>0:
                    for i in res_dt3["msg"]:
                        
                        table_name2 = "td_stock"
                        fields2 = "comp_id, br_id, item_id, stock, created_by, created_dt"
                        values2 = f"{comp_id},{i['id']},{res_dt['lastId']},'0','{created_by}','{formatted_dt}'"
                        where2 = None
                        flag2 = 0
                        res_dt2= await db_Insert(table_name2,fields2,values2,where2,flag2)
    
    return res_dt2

# ==========================================================================================================
# All Category List

@itemRouter.post('/category_list')
async def category_list(data:CompId):
    select = f"sl_no,category_name,catg_picture"
    table_name = "md_category"
    where = f"comp_id = {data.comp_id}"
    order = f''
    flag = 1
    res_dt = await db_select(select,table_name,where,order,flag)
    return res_dt

# ==========================================================================================================
# Category-wise Item List

@itemRouter.post('/categorywise_item_list')
async def categorywise_item_list(data:CatgId):
    select = "a.*, b.*, c.unit_name"
    table_name = "md_items a JOIN md_item_rate b on a.id=b.item_id LEFT JOIN md_unit c on c.sl_no=a.unit_id"
    where = f"a.comp_id={data.comp_id} AND a.catg_id={data.catg_id}"
    order = f''
    flag = 1
    res_dt = await db_select(select,table_name,where,order,flag)

    print('dt=',res_dt)

    return res_dt

# =============================================================================================================
# Add or Edit Category

@itemRouter.post('/add_edit_category')
async def add_edit_category(
    comp_id: str = Form(...),
    catg_id: str = Form(...),
    user_id: str = Form(...),
    category_name: str = Form(...),
    file: Optional[UploadFile] = File(None)
    ):
    print(file)
    fileName = None if not file else await uploadfile(file)
    # return {"body":data,"file":file}
    current_datetime = datetime.now()
    formatted_dt = current_datetime.strftime("%Y-%m-%d %H:%M:%S")
    table_name = "md_category"
    catg_pic = f", catg_picture = '/uploads/{fileName}'" if fileName != None else ''
    catg_pic1 = f",'/uploads/{fileName}'" if fileName != None else ', ""'
    fields = f"category_name ='{category_name}' {catg_pic}, modified_by = '{user_id}', modified_at = '{formatted_dt}'" if int(catg_id)>0 else "comp_id,category_name,catg_picture,created_by,created_at"
    values = f"{comp_id},'{category_name}' {catg_pic1}, '{user_id}','{formatted_dt}'"
    where = f"comp_id={comp_id} and sl_no={catg_id}" if int(catg_id) >0 else None
    flag = 1 if int(catg_id)>0 else 0
    res_dt = await db_Insert(table_name,fields,values,where,flag)
    
    return res_dt

# =========================================< Function To Upload Files >================================================
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
# ================================================================================================================

@itemRouter.post('/category_dtls')
async def category_dtls(data:CatgId):
    select = f"category_name,catg_picture"
    table_name = "md_category"
    where = f"comp_id = {data.comp_id} and sl_no={data.catg_id}"
    order = f''
    flag = 1
    res_dt = await db_select(select,table_name,where,order,flag)
    return res_dt

# ================================================================================================================
# @itemRouter.post("/uploadfile/")
# async def create_upload_file(file: Union[UploadFile, None] = None):
#     if not file:
#         return {"message": "No upload file sent"}
#     else:
#         return {"filename": file.filename}

# @itemRouter.get('/test')
# async def test(comp_id:int):
#     select = "id"
#     table_name = "md_branch"
#     where = f"comp_id = {comp_id}"
#     order = f""
#     flag = 1
#     res_dt = await db_select(select,table_name,where,order,flag)
#     print(res_dt["msg"])
#     for i in res_dt["msg"]:
#         print(i["id"])
        
#     return res_dt
# =================================================================================================================   
        # 10/12/2024

# Add And Edit Brand Details

@itemRouter.post('/add_edit_brand')
async def add_edit_brand(data:AddEditBrand):
    current_datetime = datetime.now()
    formatted_dt = current_datetime.strftime("%Y-%m-%d %H:%M:%S")
    table_name = "md_brand"
   
    fields = f"brand_name ='{data.brand_name}', modified_by = '{data.created_by}', modified_dt = '{formatted_dt}'" if data.brand_id>0 else "brand_name,created_by,created_dt"
    values = f"'{data.brand_name}', '{data.created_by}', '{formatted_dt}'"
    where = f"brand_id={data.brand_id}" if data.brand_id>0 else None
    flag = 1 if data.brand_id>0 else 0
    res_dt = await db_Insert(table_name,fields,values,where,flag)
    
    return res_dt

# Show Brand List By Category

@itemRouter.post('/brand_dtls')
async def brand_dtls(data:BrandId):
    select = f"brand_id, brand_name"
    table_name = "md_brand"
    if data.brand_id==0:
        where = f""
    else:
        where = f"brand_id = {data.brand_id}" if data.brand_id>0  else f""      
    order = f''
    flag = 1
    res_dt = await db_select(select,table_name,where,order,flag)
    return res_dt