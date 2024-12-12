import axios from "axios"
import { ADDRESSES } from "../../config/api_list"
import {
    RecoveryUpdateCredentials,
    RecoveryUpdateResponse,
} from "../../models/api_types"

export default function useRecoveryUpdate() {
    const recoveryUpdate = async (
        recoveryUpdateCreds: RecoveryUpdateCredentials,
    ) => {
        return new Promise<PromiseLike<RecoveryUpdateResponse>>(
            (resolve, reject) => {
                axios
                    .post(`${ADDRESSES.RECOVERY_UPDATE}`, recoveryUpdateCreds)
                    .then(res => {
                        resolve(res.data)
                    })
                    .catch(err => {
                        reject(err)
                    })
            },
        )
    }
    return { recoveryUpdate }
}
