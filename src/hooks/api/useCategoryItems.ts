import axios from "axios"
import { ADDRESSES } from "../../config/api_list"
import { CategoryItemListCredentials, CategoryItemListResponse, SearchBillsData } from "../../models/api_types"

export default function useCategoryItems() {
    const fetchCategoryItems = async (
        creds: CategoryItemListCredentials
    ) => {
        return new Promise<PromiseLike<CategoryItemListResponse>>((resolve, reject) => {
            axios
                .post(`${ADDRESSES.CATEGORY_ITEM_LIST}`, creds)
                .then(res => {
                    resolve(res.data)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }
    return { fetchCategoryItems }
}
