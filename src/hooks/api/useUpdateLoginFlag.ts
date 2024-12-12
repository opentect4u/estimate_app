import axios from "axios"
import { ADDRESSES } from "../../config/api_list"
import { UpdateLoginFlagCredentials, UpdateLoginFlagResponse } from "../../models/api_types"

export default function useUpdateLoginFlag() {
    const updateLoginFlag = async (creds: UpdateLoginFlagCredentials) => {
        return new Promise<PromiseLike<UpdateLoginFlagResponse>>((resolve, reject) => {
            axios
                .post(`${ADDRESSES.UPDATE_LOGIN_FLAG}`, creds)
                .then(res => {
                    resolve(res.data)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }
    return { updateLoginFlag }
}
