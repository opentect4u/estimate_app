import axios from "axios"
import { ADDRESSES } from "../../config/api_list"
import { ItemReportCredentials, ItemReportResponse } from "../../models/api_types"

export default function useItemReport() {
  const fetchItemReport = async (creds: ItemReportCredentials) => {
    return new Promise<PromiseLike<ItemReportResponse>>((resolve, reject) => {
      axios
        .post(`${ADDRESSES.ITEM_REPORT}`, creds)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  }
  return { fetchItemReport }
}
