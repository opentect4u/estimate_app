import axios from "axios"
import { ADDRESSES } from "../../config/api_list"
import { LogoutCredentials, LogoutResponse } from "../../models/api_types"

export default function useLogout() {
    const logout = async (logoutCreds: LogoutCredentials) => {
        return new Promise<PromiseLike<LogoutResponse>>((resolve, reject) => {
            axios
                .post(`${ADDRESSES.LOGOUT}`, logoutCreds)
                .then(res => {
                    resolve(res.data)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }
    return { logout }
}
