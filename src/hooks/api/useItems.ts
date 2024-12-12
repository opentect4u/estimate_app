import axios from "axios"
import { ADDRESSES } from "../../config/api_list"
import { ItemsData } from "../../models/api_types"

export default function useItems() {
  const fetchItems = async (compId: number) => {
    return new Promise<ItemsData[]>((resolve, reject) => {
      axios
        .get(`${ADDRESSES.ITEMS}/${compId}`)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  }
  return { fetchItems }
}
