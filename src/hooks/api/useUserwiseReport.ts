import axios from "axios"
import { ADDRESSES } from "../../config/api_list"
import {
    UserwiseReportCredentials,
    UserwiseReportResponse,
} from "../../models/api_types"

export default function useUserwiseReport() {
    const fetchUseriseReport = async (
        userwiseRpt: UserwiseReportCredentials,
    ) => {
        return new Promise<PromiseLike<UserwiseReportResponse>>(
            (resolve, reject) => {
                axios
                    .post(`${ADDRESSES.USERWISE_REPORT}`, userwiseRpt)
                    .then(res => {
                        resolve(res.data)
                    })
                    .catch(err => {
                        reject(err)
                    })
            },
        )
    }
    return { fetchUseriseReport }
}
