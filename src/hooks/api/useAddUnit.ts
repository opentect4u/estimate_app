import axios from "axios"
import { ADDRESSES } from "../../config/api_list"
import { AddUnitCredentials, BasicResponse } from "../../models/api_types"

export default function useAddUnit() {
  const sendAddedUnit = async (addedUnit: AddUnitCredentials) => {
    return new Promise<PromiseLike<BasicResponse>>((resolve, reject) => {
      axios
        .post(`${ADDRESSES.ADD_UNIT}`, addedUnit)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  }
  return { sendAddedUnit }
}
