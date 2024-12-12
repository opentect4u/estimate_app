import axios from "axios"
import { ADDRESSES } from "../../config/api_list"
import { SendOtpCredentials, SendOtpResponse } from "../../models/api_types"

/**
 * @deprecated useSendOtp
 * use useSendOtp2() hook instead.
 */
export default function useSendOtp() {
  /**
   * @deprecated @method getOtp
   */
  const getOtp = async (otpCreds: SendOtpCredentials) => {
    return new Promise<PromiseLike<SendOtpResponse>>((resolve, reject) => {
      axios
        .post(`${ADDRESSES.SEND_OTP}`, otpCreds)
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
