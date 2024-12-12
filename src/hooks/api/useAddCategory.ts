import axios from "axios"
import { ADDRESSES } from "../../config/api_list"
import { AddCategoryCredentials, BasicResponse } from "../../models/api_types"

export default function useAddCategory() {
    const sendAddedCategory = async (addedCat: AddCategoryCredentials) => {
        return new Promise<PromiseLike<BasicResponse>>((resolve, reject) => {
            axios
                .post(`${ADDRESSES.ADD_CATEGORY}`, addedCat)
                .then(res => {
                    resolve(res.data)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }
    return { sendAddedCategory }
}
