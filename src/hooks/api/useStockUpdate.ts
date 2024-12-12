import axios from "axios"
import { ADDRESSES } from "../../config/api_list"
import { BasicResponse, StockUpdateCredentials } from "../../models/api_types"

export default function useStockUpdate() {
  const updateStock = async (updatedStock: StockUpdateCredentials) => {
    return new Promise<PromiseLike<BasicResponse>>((resolve, reject) => {
      axios
        .post(`${ADDRESSES.STOCK_UPDATE}`, updatedStock)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  }
  return { updateStock }
}
