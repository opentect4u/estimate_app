import axios from "axios"
import { ADDRESSES } from "../../config/api_list"
import {
  BasicResponse,
  GstSettingsEditCredentials,
} from "../../models/api_types"

export default function useGstSettings() {
  const editGstSettings = async (
    editedGstSettings: GstSettingsEditCredentials,
  ) => {
    return new Promise<PromiseLike<BasicResponse>>((resolve, reject) => {
      axios
        .post(`${ADDRESSES.EDIT_GST_SETTINGS}`, editedGstSettings)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  }
  return { editGstSettings }
}
