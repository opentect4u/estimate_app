import axios from "axios"
import { ADDRESSES } from "../../config/api_list"
import { BillSmsCredentials, BillSmsResponse } from "../../models/api_types"

export default function useBillSms2() {
    const sendBillSms = async (sendSmsCreds: BillSmsCredentials) => {
        return new Promise<PromiseLike<BillSmsResponse>>((resolve, reject) => {
            axios
                .get(`${ADDRESSES.BILL_SMS2}`, {
                    params: {
                        comp_id: sendSmsCreds.comp_id,
                        phone: sendSmsCreds.phone,
                        receipt_no: sendSmsCreds.receipt_no
                    }
                })
                .then(res => {
                    resolve(res.data)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }
    return { sendBillSms }
}
