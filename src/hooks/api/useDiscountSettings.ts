import axios from "axios"
import { ADDRESSES } from "../../config/api_list"
import {
  BasicResponse,
  DiscountSettingsEditCredentials,
} from "../../models/api_types"

export default function useDiscountSettings() {
  const editDiscountSettings = async (
    editedDcntSettings: DiscountSettingsEditCredentials,
  ) => {
    return new Promise<PromiseLike<BasicResponse>>((resolve, reject) => {
      axios
        .post(`${ADDRESSES.EDIT_DISCOUNT_SETTINGS}`, editedDcntSettings)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  }
  return { editDiscountSettings }
}
