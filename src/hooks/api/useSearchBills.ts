import axios from "axios"
import { ADDRESSES } from "../../config/api_list"
import { SearchBillsData } from "../../models/api_types"

export default function useSearchBills() {
  const fetchSearchedBills = async (
    fromDate: string,
    toDate: string,
    companyId: number,
    branchId: number,
    userId: number,
  ) => {
    return new Promise<PromiseLike<SearchBillsData>>((resolve, reject) => {
      axios
        .post(`${ADDRESSES.SEARCH_BILLS}`, {
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
  return { fetchSearchedBills }
}
