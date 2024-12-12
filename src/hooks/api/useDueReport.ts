import axios from "axios"
import { ADDRESSES } from "../../config/api_list"
import {
    DueReportCredentials,
    DueReportResponse,
} from "../../models/api_types"

export default function useDueReport() {
    const fetchDueReport = async (
        dueRepCreds: DueReportCredentials,
    ) => {
        return new Promise<PromiseLike<DueReportResponse>>(
            (resolve, reject) => {
                axios
                    .post(`${ADDRESSES.DUE_REPORT}`, dueRepCreds)
                    .then(res => {
                        resolve(res.data)
                    })
                    .catch(err => {
                        reject(err)
                    })
            },
        )
    }
    return { fetchDueReport }
}
