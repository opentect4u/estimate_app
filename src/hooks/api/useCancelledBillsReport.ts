import axios from "axios"
import { ADDRESSES } from "../../config/api_list"
import {
  BasicReportCredentials,
  CancelledBillsReportResponse,
} from "../../models/api_types"

export default function useCancelledBillsReport() {
  const fetchCancelledBills = async (
    cancelledBills: BasicReportCredentials,
  ) => {
    return new Promise<PromiseLike<CancelledBillsReportResponse>>(
      (resolve, reject) => {
        axios
          .post(`${ADDRESSES.CANCELLED_BILLS_REPORT}`, cancelledBills)
          .then(res => {
            resolve(res.data)
          })
          .catch(err => {
            reject(err)
          })
      },
    )
  }
  return { fetchCancelledBills }
}
