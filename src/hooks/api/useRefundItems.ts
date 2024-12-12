import axios from "axios"
import { ADDRESSES } from "../../config/api_list"
import {
  RefundItemCredentials,
  RefundItemResponse,
} from "../../models/api_types"

export default function useRefundItems() {
  const sendRefundItemDetails = async (
    productsWithCredentials: RefundItemCredentials[],
  ) => {
    return new Promise<RefundItemResponse>((resolve, reject) => {
      axios
        .post(`${ADDRESSES.REFUND_ITEMS}`, productsWithCredentials)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  return { sendRefundItemDetails }
}
