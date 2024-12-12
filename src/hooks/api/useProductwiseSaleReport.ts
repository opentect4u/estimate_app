import axios from "axios"
import { ADDRESSES } from "../../config/api_list"
import { BasicReportCredentials, ProductwiseSaleReport } from "../../models/api_types"

export default function useProductwiseSaleReport() {
    const fetchProductwiseSaleReport = async (
        saleRptCreds: BasicReportCredentials
    ) => {
        return new Promise<PromiseLike<ProductwiseSaleReport>>((resolve, reject) => {
            axios
                .post(`${ADDRESSES.PRODUCTWISE_SALE_REPORT}`, saleRptCreds)
                .then(res => {
                    resolve(res.data)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }
    return { fetchProductwiseSaleReport }
}
