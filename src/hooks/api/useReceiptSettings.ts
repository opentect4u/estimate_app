import axios from "axios"
import { ADDRESSES } from "../../config/api_list"
import { ReceiptSettingsData } from "../../models/api_types"

export default function useReceiptSettings() {
  const fetchReceiptSettings = async (compId: number) => {
    return new Promise<ReceiptSettingsData[]>((resolve, reject) => {
      axios
        .get(`${ADDRESSES.RECEIPT_SETTINGS}/${compId}`)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  }
  return { fetchReceiptSettings }
}
