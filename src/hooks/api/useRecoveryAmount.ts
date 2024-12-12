import axios from "axios"
import { ADDRESSES } from "../../config/api_list"
import {
    RecoveryAmountCredentials,
    RecoveryAmountResponse,
} from "../../models/api_types"

export default function useRecoveryAmount() {
    const fetchRecoveryDetails = async (
        recoveryAmtCreds: RecoveryAmountCredentials,
    ) => {
        return new Promise<PromiseLike<RecoveryAmountResponse>>(
            (resolve, reject) => {
                axios
                    .post(`${ADDRESSES.RECOVERY_AMOUNT}`, recoveryAmtCreds)
                    .then(res => {
                        resolve(res.data)
                    })
                    .catch(err => {
                        reject(err)
                    })
            },
        )
    }
    return { fetchRecoveryDetails }
}
