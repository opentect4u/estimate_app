import axios from "axios"
import { ADDRESSES } from "../../config/api_list"
import { BasicResponse } from "../../models/api_types"

/**
 * @deprecated useCreatePin()
 */
export default function useCreatePin() {
  const createPin = async (pin: string, phoneNumber: string) => {
    return new Promise<BasicResponse>((resolve, reject) => {
      axios
        .post(
          `${ADDRESSES.CREATE_PIN}`,
          {
            PIN: pin,
            phone_no: phoneNumber,
          },
          {},
        )
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  }
  return { createPin }
}
