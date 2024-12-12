import axios from "axios"
import { ADDRESSES } from "../../config/api_list"
import {
  StockSearchCredentials,
  StockSearchResponse,
} from "../../models/api_types"

export default function useStockSearch() {
  const fetchStock = async (fetchedStock: StockSearchCredentials) => {
    return new Promise<PromiseLike<StockSearchResponse>>((resolve, reject) => {
      axios
        .post(`${ADDRESSES.STOCK}`, fetchedStock)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  }
  return { fetchStock }
}
