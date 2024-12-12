import axios from "axios"
import { ADDRESSES } from "../../config/api_list"
import { CalculatorSaleInsertCredentials, CalculatorSaleInsertResponse } from "../../models/api_types"

export default function useCalculatorSaleInsert() {
    const calcSendSaleDetails = async (productsWithCredentials: CalculatorSaleInsertCredentials[]) => {
        return new Promise<CalculatorSaleInsertResponse>((resolve, reject) => {
            axios
                .post(`${ADDRESSES.CALCULATOR_SALE_INSERT}`, productsWithCredentials)
                .then(res => {
                    resolve(res.data)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }
    return { calcSendSaleDetails }
}
