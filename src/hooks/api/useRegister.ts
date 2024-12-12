import axios from "axios"
import { ADDRESSES } from "../../config/api_list"
// import { RegisterData } from "../../models/api_types"

/**
 * @deprecated
 */
export default function useRegister() {
  const register = async (phoneNumber: string) => {
    return new Promise<any>((resolve, reject) => {
      axios
        .post(`${ADDRESSES.REGISTER}/${phoneNumber}`)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  }
  return { register }
}
