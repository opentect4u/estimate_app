import axios from "axios"
import { ADDRESSES } from "../../config/api_list"
import {
  CustomerInfoCredentials,
  CustomerInfoResponse,
} from "../../models/api_types"

export default function useCustomerInfo() {
  const fetchCustomerInfo = async (custInf: CustomerInfoCredentials) => {
    return new Promise<PromiseLike<CustomerInfoResponse>>((resolve, reject) => {
      axios
        .post(`${ADDRESSES.CUSTOMER_INFORMATION}`, custInf)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  }
  return { fetchCustomerInfo }
}
