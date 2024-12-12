import axios from "axios"
import { ADDRESSES } from "../../config/api_list"
import { BillSmsCredentials, BillSmsResponse } from "../../models/api_types"

/**
 * @deprecated useBillSms
 */
export default function useBillSms() {
  /**
   * @deprecated sendBillSms
   */
  const sendBillSms = async (sendSmsCreds: BillSmsCredentials) => {
    return new Promise<PromiseLike<BillSmsResponse>>((resolve, reject) => {
      axios
        .post(`${ADDRESSES.BILL_SMS}`, sendSmsCreds)
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
