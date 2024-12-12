import axios from "axios"
import { ADDRESSES } from "../../config/api_list"
import { BasicResponse, TxnDetailsCreds } from "../../models/api_types"

export default function useSendTxnDetails() {
    const sendTxnDetails = async (txnCreds: TxnDetailsCreds) => {

        return new Promise<BasicResponse>((resolve, reject) => {
            axios
                .post(`${ADDRESSES.SEND_TXN_DETAILS}`, txnCreds)
                .then(res => {
                    resolve(res.data)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }
    return { sendTxnDetails }
}
