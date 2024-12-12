import axios from "axios"
import { ADDRESSES } from "../../config/api_list"
import {
  RefundListCredentials,
  RefundListResponse,
} from "../../models/api_types"

export default function useRefundList() {
  const fetchRefundList = async (fetchedRefundList: RefundListCredentials) => {
    return new Promise<RefundListResponse[]>((resolve, reject) => {
      axios
        .post(`${ADDRESSES.REFUND_LIST}`, fetchedRefundList)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  }
  return { fetchRefundList }
}
