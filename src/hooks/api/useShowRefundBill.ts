import axios from "axios"
import { ADDRESSES } from "../../config/api_list"
import { ShowRefundBillResponse } from "../../models/api_types"

export default function useShowRefundBill() {
    const fetchRefundBill = async (rfRcptNo: number) => {
        return new Promise<PromiseLike<ShowRefundBillResponse>>((resolve, reject) => {
            axios
                .get(`${ADDRESSES.SHOW_REFUND_BILL}/${rfRcptNo}`)
                .then(res => {
                    resolve(res.data)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }
    return { fetchRefundBill }
}
