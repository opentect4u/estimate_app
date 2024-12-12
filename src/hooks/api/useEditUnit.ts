import axios from "axios"
import { ADDRESSES } from "../../config/api_list"
import { UnitEditCredentials, BasicResponse } from "../../models/api_types"

export default function useEditUnit() {
  const editUnit = async (unitEditCreds: UnitEditCredentials) => {
    return new Promise<PromiseLike<BasicResponse>>((resolve, reject) => {
      axios
        .post(`${ADDRESSES.EDIT_UNIT}`, unitEditCreds)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  }
  return { editUnit }
}
