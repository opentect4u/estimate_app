import axios from "axios"
import { ADDRESSES } from "../../config/api_list"
import { LoginData } from "../../models/api_types"

export default function useLogin() {
  const login = async (phoneNumber: string, password: string) => {
    return new Promise<LoginData>((resolve, reject) => {
      axios
        .post(`${ADDRESSES.LOGIN}`, {
          user_id: phoneNumber,
          password: password
        })
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  }
  return { login }
}
// export default function useLogin() {
//   const login = async (phoneNumber: string) => {
//     return new Promise<LoginData>((resolve, reject) => {
//       axios
//         .post(`${ADDRESSES.LOGIN}`, {
//           user_id: phoneNumber,
//           // PIN: pin
//         })
//         .then(res => {
//           resolve(res.data)
//         })
//         .catch(err => {
//           reject(err)
//         })
//     })
//   }
//   return { login }
// }
