import axios from "axios"
import { ADDRESSES } from "../../config/api_list"
import { BasicReportCredentials, SaleReportData } from "../../models/api_types"

export default function useSaleReport() {
  const fetchSaleReport = async (
    saleRptCreds: BasicReportCredentials
  ) => {
    return new Promise<PromiseLike<SaleReportData>>((resolve, reject) => {
      axios
        .post(`${ADDRESSES.SALE_REPORT}`, saleRptCreds)
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
