import axios from "axios"
import { ADDRESSES } from "../../config/api_list"
import { CreditReportResponse } from "../../models/api_types"

export default function useCreditReport() {
    const fetchCreditReport = async (
        fromDate: string,
        toDate: string,
        companyId: number,
        branchId: number,
        userId: string,
    ) => {
        return new Promise<PromiseLike<CreditReportResponse>>((resolve, reject) => {
            axios
                .post(`${ADDRESSES.CREDIT_REPORT}`, {
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
    return { fetchCreditReport }
}
