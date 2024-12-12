import axios from "axios"
import { ADDRESSES } from "../../config/api_list"
import {
  BasicResponse,
  GeneralSettingsEditCredentials,
} from "../../models/api_types"

export default function useGeneralSettings() {
  const editGeneralSettings = async (
    editedGnrlSettings: GeneralSettingsEditCredentials,
  ) => {
    return new Promise<PromiseLike<BasicResponse>>((resolve, reject) => {
      axios
        .post(`${ADDRESSES.EDIT_GENERAL_SETTINGS}`, editedGnrlSettings)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  }
  return { editGeneralSettings }
}
