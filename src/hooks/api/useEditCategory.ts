import axios from "axios"
import { ADDRESSES } from "../../config/api_list"
import { BasicResponse, CategoryEditCredentials } from "../../models/api_types"

export default function useEditCategory() {
    const editCategory = async (catEditCreds: CategoryEditCredentials) => {
        return new Promise<PromiseLike<BasicResponse>>((resolve, reject) => {
            axios
                .post(`${ADDRESSES.EDIT_CATEGORY}`, catEditCreds)
                .then(res => {
                    resolve(res.data)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }
    return { editCategory }
}
