import axios from "axios"
import { ADDRESSES } from "../../config/api_list"
import {
    RecoveryReportCredentials,
    RecoveryReportResponse,
} from "../../models/api_types"

export default function useRecoveryReport() {
    const fetchRecoveryReport = async (
        recRepCreds: RecoveryReportCredentials,
    ) => {
        return new Promise<PromiseLike<RecoveryReportResponse>>(
            (resolve, reject) => {
                axios
                    .post(`${ADDRESSES.RECOVERY_REPORT}`, recRepCreds)
                    .then(res => {
                        resolve(res.data)
                    })
                    .catch(err => {
                        reject(err)
                    })
            },
        )
    }
    return { fetchRecoveryReport }
}
