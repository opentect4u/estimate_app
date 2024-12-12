import axios from "axios"
import { ADDRESSES } from "../../config/api_list"
import { BasicResponse } from "../../models/api_types"

/**
 * @deprecated useFetchOtp()
 */
export default function useFetchOtp() {
  const getOtp = async (phoneNumber: string) => {
    return new Promise<BasicResponse>((resolve, reject) => {
      axios
        .post(`${ADDRESSES.OTP}/${phoneNumber}`, {}, {})
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  }
  return { getOtp }
}
