import axios from "axios"
import { ADDRESSES } from "../../config/api_list"
import {
  RefundReportCredentials,
  RefundReportResponse,
} from "../../models/api_types"

export default function useRefundReport() {
  const fetchRefundReport = async (
    refundReportCreds: RefundReportCredentials,
  ) => {
    return new Promise<PromiseLike<RefundReportResponse>>((resolve, reject) => {
      axios
        .post(`${ADDRESSES.REFUND_BILL_REPORT}`, refundReportCreds)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  }
  return { fetchRefundReport }
}
