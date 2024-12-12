import axios from "axios"
import { ADDRESSES } from "../../config/api_list"
import {
  SearchBillsByMobileCredentials,
  SearchBillsByMobileResponse,
} from "../../models/api_types"

export default function useSearchBillsByMobile() {
  const fetchSearchedBills = async (
    searchBillCreds: SearchBillsByMobileCredentials,
  ) => {
    return new Promise<PromiseLike<SearchBillsByMobileResponse>>(
      (resolve, reject) => {
        axios
          .post(`${ADDRESSES.SEARCH_BILLS_BY_MOBILE}`, searchBillCreds)
          .then(res => {
            resolve(res.data)
          })
          .catch(err => {
            reject(err)
          })
      },
    )
  }
  return { fetchSearchedBills }
}
