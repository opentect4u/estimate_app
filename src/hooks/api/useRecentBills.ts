import axios from "axios"
import { ADDRESSES } from "../../config/api_list"
import { RecentBillsData } from "../../models/api_types"

export default function useRecentBills() {
  const fetchRecentBills = async (
    transactionDate: string,
    companyId: number,
    branchId: number,
    userId: string,
  ) => {
    return new Promise<PromiseLike<RecentBillsData[]>>((resolve, reject) => {
      axios
        .post(`${ADDRESSES.RECENT_BILLS}`, {
          trn_date: transactionDate,
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
  return { fetchRecentBills }
}
