import axios from "axios"
import { ADDRESSES } from "../../config/api_list"
import { ShowBillResponseData } from "../../models/api_types"

export default function useShowBill() {
  const fetchBill = async (rcptNo: number) => {
    return new Promise<PromiseLike<ShowBillResponseData>>((resolve, reject) => {
      axios
        .get(`${ADDRESSES.SHOW_BILL}/${rcptNo}`)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  }
  return { fetchBill }
}
