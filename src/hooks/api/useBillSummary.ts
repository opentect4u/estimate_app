import axios from "axios"
import { ADDRESSES } from "../../config/api_list"
import { BillSummaryData } from "../../models/api_types"

export default function useBillSummary() {
  const fetchBillSummary = async (
    transactionDate: string,
    companyId: number,
    branchId: number,
    userId: string,
  ) => {
    return new Promise<BillSummaryData>((resolve, reject) => {
      axios
        .post(`${ADDRESSES.BILL_SUMMARY}`, {
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
  return { fetchBillSummary }
}
