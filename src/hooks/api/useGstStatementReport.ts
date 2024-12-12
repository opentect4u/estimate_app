import axios from "axios"
import { ADDRESSES } from "../../config/api_list"
import { GstStatementData } from "../../models/api_types"

export default function useGstStatementReport() {
  const fetchGstStatement = async (
    fromDate: string,
    toDate: string,
    companyId: number,
    branchId: number,
    userId: string,
  ) => {
    return new Promise<PromiseLike<GstStatementData>>((resolve, reject) => {
      axios
        .post(`${ADDRESSES.GST_STATEMENT}`, {
          from_date: fromDate,
          to_date: toDate,
          comp_id: companyId,
          br_id: branchId,
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
  return { fetchGstStatement }
}
