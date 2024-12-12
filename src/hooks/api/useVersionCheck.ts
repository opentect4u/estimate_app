import axios from "axios"
import { ADDRESSES } from "../../config/api_list"
import { VersionCheck } from "../../models/api_types"

export default function useVersionCheck() {
  const fetchVersionInfo = async () => {
    return new Promise<VersionCheck>((resolve, reject) => {
      axios
        .get(`${ADDRESSES.APP_VERSION}`)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  }
  return { fetchVersionInfo }
}
