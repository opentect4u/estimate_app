import axios from "axios"
import { ADDRESSES } from "../../config/api_list"
import {
    CustomerLedgerCredentials,
    CustomerLedgerResponse,
} from "../../models/api_types"

export default function useCustomerLedger() {
    const fetchCustomerLedger = async (
        creds: CustomerLedgerCredentials,
    ) => {
        return new Promise<PromiseLike<CustomerLedgerResponse>>(
            (resolve, reject) => {
                axios
                    .post(`${ADDRESSES.CUSTOMER_LEDGER}`, creds)
                    .then(res => {
                        resolve(res.data)
                    })
                    .catch(err => {
                        reject(err)
                    })
            },
        )
    }
    return { fetchCustomerLedger }
}
