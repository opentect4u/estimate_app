import axios from "axios"
import { ADDRESSES } from "../../config/api_list"
import { BasicResponse } from "../../models/api_types"

export default function useCancelBill() {
  const cancelBill = async (receiptNo: number, userId: string) => {
    return new Promise<BasicResponse>((resolve, reject) => {
      axios
        .post(`${ADDRESSES.CANCEL_BILL_TWO}`, {
          receipt_no: receiptNo,
          user_id: userId,
        })
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  }
  return { cancelBill }
}
