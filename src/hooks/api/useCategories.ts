import axios from "axios"
import { ADDRESSES } from "../../config/api_list"
import { CategoryListResponse, ItemsData } from "../../models/api_types"

export default function useCategories() {
  const fetchCategories = async (compId: number) => {
    return new Promise<CategoryListResponse>((resolve, reject) => {
      axios
        .get(`${ADDRESSES.CATEGORY_LIST}/${compId}`)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  }
  return { fetchCategories }
}
