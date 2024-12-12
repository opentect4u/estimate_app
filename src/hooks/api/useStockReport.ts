import axios from "axios"
import { ADDRESSES } from "../../config/api_list"
import {
  StockReportCredentials,
  StockReportResponse,
} from "../../models/api_types"

export default function useStockReport() {
  const fetchStockReport = async (reportCreds: StockReportCredentials) => {
    return new Promise<PromiseLike<StockReportResponse[]>>(
      (resolve, reject) => {
        axios
          .post(`${ADDRESSES.STOCK_REPORT}`, reportCreds)
          .then(res => {
            resolve(res.data)
          })
          .catch(err => {
            reject(err)
          })
      },
    )
  }
  return { fetchStockReport }
}
