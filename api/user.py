from fastapi import APIRouter
from config.database import connect
from models.master_model import createResponse
from models.form_model import LoginFlag, UserLogin,LoginStatus,CreatePIN,Login
# from models.otp_model import generateOTP
from utils import get_hashed_password
from utils import get_hashed_password,verify_password

# testing git
userRouter = APIRouter()


# Verify Phone no and active status
#------------------------------------------------------------------------------------------------------
@userRouter.post('/verify_phone/{phone_no}')
async def verify(phone_no:int):
    conn = connect()
    cursor = conn.cursor()
    query = f"SELECT COUNT(*)phone_no FROM md_user WHERE user_id=phone_no AND user_type in ('U','M') AND phone_no={phone_no}"
    cursor.execute(query)
    records = cursor.fetchall()
    print(records)
    result = createResponse(records, cursor.column_names, 1)
    conn.close()
    cursor.close()
    # return result
    if records==[(0,)]:
       resData= {"status":0, "data":"invalid phone"}
    else:
        resData= {
        "status":1,
        "data":"valid phone no."
        }
    return resData
     
   
@userRouter.post('/verify_active/{phone_no}')
async def verify(phone_no:int):
    conn = connect()
    cursor = conn.cursor()
    query = f"SELECT COUNT(*)active_flag FROM md_user WHERE active_flag='N' AND user_id={phone_no}"
    cursor.execute(query)
    records = cursor.fetchall()
    print(records)
    # result = createResponse(records, cursor.column_names, 1)
    conn.close()
    cursor.close()
    if records==[(0,)]:
        resData= {"status":-1, "data":"Already registered or invalid phone"}
    else:
        resData= {
        "status":1,
        "data":"registered successfully"
        }
    return resData 

# Create PIN
#-------------------------------------------------------------------------------------------------------------
@userRouter.post('/create_pin')
async def register(data:CreatePIN):
    password=data.PIN
    haspass=get_hashed_password(password)
    conn = connect()
    cursor = conn.cursor()
    query = f"UPDATE md_user SET password='{haspass}', active_flag='Y' where user_id='{data.phone_no}'"
    cursor.execute(query)
    conn.commit()
    conn.close()
    cursor.close()
    print(cursor.rowcount)
    if cursor.rowcount==1:
        resData= {"status":1, "data":"Pin inserted"}
    else:
        resData= {
        "status":0,
        "data":"invalid phone"
        }
    return resData 

# Generate OTP
#-------------------------------------------------------------------------------------------------------------
@userRouter.post('/otp/{phone_no}') 
async def OTP(phone_no:int):
    return {"status":1, "data":"1234"}

# USER LOGIN

@userRouter.post('/update_login_status')
async def update_login_status(data:LoginStatus):
    conn = connect()
    cursor = conn.cursor()
    query = f"update md_user set login_flag = 'Y' where user_id = '{data.user_id}'"
    cursor.execute(query)
    conn.commit()
    conn.close()
    cursor.close()
    if cursor.rowcount>0:
        resData={"suc":1, "msg":"User login flag updated"}
    else:
        resData={"suc":0, "msg":"failed to update login_flag"}

    return resData

# ================================================================================================================

@userRouter.post('/user_login')
async def user_login(data_login:Login):
    conn = connect()
    cursor = conn.cursor()
    query = F"SELECT a.id,a.user_name,a.user_type,a.user_id,a.phone_no,a.email_id,a.device_id,a.password,a.active_flag,a.login_flag,a.created_by,a.created_dt,a.modified_by,a.modified_dt,b.id br_id,b.branch_name,b.branch_address,b.location,b.contact_person, c.id comp_id, c.company_name,c.mode,c.address,c.web_portal,c.max_user FROM md_user a, md_branch b, md_company c WHERE a.user_id='{data_login.user_id}' AND b.id=a.br_id AND c.id=a.comp_id AND a.active_flag='Y'"
    cursor.execute(query)
    records = cursor.fetchall()
    result1 = createResponse(records, cursor.column_names, 1)
    conn.close()
    cursor.close()
    # print(result1[0]["password"], "yyyyyy")
    if cursor.rowcount > 0 :

        if(verify_password(data_login.password, result1[0]["password"])):
            res_dt = {"suc": 1, "msg": result1[0], "user" : 1}
        else:
            res_dt = {"suc": 2, "msg": "Please check your userID or password"}
    else:
        res_dt = {"suc": 0, "msg": "No Data Found"}

    return res_dt
    # return result1["password"]

#-----------------------------------------------------------------------------------------------------------  
@userRouter.post('/login')
async def login(data_login:UserLogin):
    conn = connect()
    cursor = conn.cursor()
    query = f"SELECT a.*, b.*, c.* FROM md_user a, md_branch b, md_company c WHERE a.user_id='{data_login.user_id}' AND b.id=a.br_id AND c.id=a.comp_id AND a.active_flag='Y' AND a.user_type in ('U','M')"
    cursor.execute(query)
    records = cursor.fetchone()
    # print(cursor.rowcount)
    
    if cursor.rowcount>0:
        print(len(records),"oooooooooo")
        result = createResponse(records, cursor.column_names, 0)
        conn.close()
        cursor.close()

        conn = connect()
        cursor = conn.cursor()
        query = f"select count(*)no_of_user from md_user where comp_id = {result['comp_id']} AND user_type in ('U','M') and login_flag = 'Y'"
        cursor.execute(query)
        records = cursor.fetchone()
        result1 = createResponse(records, cursor.column_names, 0)
        conn.close()
        cursor.close()
       
        if cursor.rowcount>0:
            if result1['no_of_user'] < result['max_user']:
                res_dt = {"suc": 1, "msg": result, "user": result1['no_of_user']+1}
               
            else:
                 res_dt = {"suc": 0, "msg": "Max user limit reached"}
        
        else:
            res_dt = {"suc": 0, "msg": "error while selecting no_of_user"}
    else:
        res_dt = {"suc": 0, "msg": "No user found"}

    return res_dt

#=================================================================================================
#Logout 
@userRouter.post('/logout')
async def logout(flag:LoginFlag):
    conn = connect()
    cursor = conn.cursor()

    query = f"update md_user set login_flag = 'N' where comp_id={flag.comp_id} and br_id={flag.br_id} and user_id='{flag.user_id}' and user_type in ('U','M')"

    cursor.execute(query)
    conn.commit()
    conn.close()
    cursor.close()
    if cursor.rowcount>0:
        resData = {
            "status":1,
            "data":"logged out successfully"
        }
    else:
        resData = {
            "status":0,
            "data":"No user Found"
        }

    return resData