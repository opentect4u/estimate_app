import axios from "axios"
import { ADDRESSES } from "../../config/api_list"
import {
    SearchBillsByReceiptCredentials,
    SearchBillsResponse,
} from "../../models/api_types"

export default function useSearchBillsByReceipt() {
    const fetchSearchedBillsByReceipt = async (
        searchBillCreds: SearchBillsByReceiptCredentials,
    ) => {
        return new Promise<PromiseLike<SearchBillsResponse>>(
            (resolve, reject) => {
                axios
                    .post(`${ADDRESSES.SEARCH_BILLS_BY_RECEIPT}`, searchBillCreds)
                    .then(res => {
                        resolve(res.data)
                    })
                    .catch(err => {
                        reject(err)
                    })
            },
        )
    }
    return { fetchSearchedBillsByReceipt }
}
