import axios from "axios"
import { ADDRESSES } from "../../config/api_list"
import {
  SearchBillsByItemCredentials,
  SearchBillsByItemResponse,
} from "../../models/api_types"

export default function useSearchBillsByItem() {
  const fetchBillsByItem = async (
    fetchBillsByItemCreds: SearchBillsByItemCredentials,
  ) => {
    return new Promise<PromiseLike<SearchBillsByItemResponse>>(
      (resolve, reject) => {
        axios
          .post(`${ADDRESSES.SEARCH_BILLS_BY_ITEM}`, fetchBillsByItemCreds)
          .then(res => {
            resolve(res.data)
          })
          .catch(err => {
            reject(err)
          })
      },
    )
  }
  return { fetchBillsByItem }
}
