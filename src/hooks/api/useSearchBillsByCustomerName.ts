import axios from "axios"
import { ADDRESSES } from "../../config/api_list"
import {
    SearchBillsByCustomerNameCredentials,
    SearchBillsResponse,
} from "../../models/api_types"

export default function useSearchBillsByCustomerName() {
    const fetchSearchedBillsByCustomerName = async (
        searchBillCreds: SearchBillsByCustomerNameCredentials,
    ) => {
        return new Promise<PromiseLike<SearchBillsResponse>>(
            (resolve, reject) => {
                axios
                    .post(`${ADDRESSES.SEARCH_BILLS_BY_CUSTOMER_NAME}`, searchBillCreds)
                    .then(res => {
                        resolve(res.data)
                    })
                    .catch(err => {
                        reject(err)
                    })
            },
        )
    }
    return { fetchSearchedBillsByCustomerName }
}
