import axios from "axios"
import { ADDRESSES } from "../../config/api_list"
import { BasicReportCredentials, SaleReportCalculateModeResponse } from "../../models/api_types"

export default function useSaleReportCalculateMode() {
    const fetchSaleReport = async (
        saleRptCreds: BasicReportCredentials
    ) => {
        return new Promise<PromiseLike<SaleReportCalculateModeResponse>>((resolve, reject) => {
            axios
                .post(`${ADDRESSES.CALCULATOR_SALE_REPORT}`, saleRptCreds)
                .then(res => {
                    resolve(res.data)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }
    return { fetchSaleReport }
}
