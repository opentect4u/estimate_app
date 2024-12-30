import axios from "axios"
import { ADDRESSES } from "../../config/api_list"
import { BasicReportCredentials, ProductwiseSaleReport } from "../../models/api_types"

export default function useFetchCreditCustomers() {
    const fetchCreditCustomers = async (
        creds: any
    ) => {
        return new Promise<PromiseLike<any>>((resolve, reject) => {
            axios
                .post(`${ADDRESSES.GET_CREDIT_CUST}`, creds)
                .then(res => {
                    resolve(res.data)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }
    return { fetchCreditCustomers }
}
