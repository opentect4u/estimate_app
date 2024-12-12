import axios from "axios"
import { ADDRESSES } from "../../config/api_list"
import { CalculatorShowBillResponse, ShowBillResponseData } from "../../models/api_types"

export default function useCalculatorShowBill() {
    const fetchCalcBill = async (rcptNo: number) => {
        return new Promise<PromiseLike<CalculatorShowBillResponse>>((resolve, reject) => {
            axios
                .get(`${ADDRESSES.CALCULATOR_SHOW_BILL}?recp_no=${rcptNo}`)
                .then(res => {
                    resolve(res.data)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }
    return { fetchCalcBill }
}
