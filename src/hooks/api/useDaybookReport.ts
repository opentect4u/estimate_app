import axios from "axios"
import { ADDRESSES } from "../../config/api_list"
import {
    BasicReportCredentials,
    DaybookReportResponse,
} from "../../models/api_types"

export default function useDaybookReport() {
    const fetchDaybookReport = async (
        daybookReport: BasicReportCredentials,
    ) => {
        return new Promise<PromiseLike<DaybookReportResponse>>(
            (resolve, reject) => {
                axios
                    .post(`${ADDRESSES.DAYBOOK_REPORT}`, daybookReport)
                    .then(res => {
                        resolve(res.data)
                    })
                    .catch(err => {
                        reject(err)
                    })
            },
        )
    }
    return { fetchDaybookReport }
}
