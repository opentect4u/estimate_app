import axios from "axios"
import { ADDRESSES } from "../../config/api_list"
import {
  ReceiptSettingsEditCredentials,
  BasicResponse,
} from "../../models/api_types"

/**
 * @deprecated useEditReceiptSettings
 * Rather use @function useGeneralSettings(), @function useGstSettings() and @function useDiscountSettings() instead.
 */
export default function useEditReceiptSettings() {
  const editReceiptSettings = async (
    editedRcptSettings: ReceiptSettingsEditCredentials,
  ) => {
    return new Promise<PromiseLike<BasicResponse>>((resolve, reject) => {
      axios
        .post(`${ADDRESSES.EDIT_RECEIPT_SETTINGS}`, editedRcptSettings)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  }
  return { editReceiptSettings }
}
