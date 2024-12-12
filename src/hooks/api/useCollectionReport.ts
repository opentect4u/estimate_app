import axios from "axios"
import { ADDRESSES } from "../../config/api_list"
import {
  CollectionReportCredentials,
  CollectionReportResponse,
} from "../../models/api_types"

/**
 * Now Sale Summary
 * @returns sale summary
 */
export default function useCollectionReport() {
  const fetchCollectionReport = async (
    collectionReport: CollectionReportCredentials,
  ) => {
    return new Promise<PromiseLike<CollectionReportResponse>>(
      (resolve, reject) => {
        axios
          .post(`${ADDRESSES.COLLECTION_REPORT}`, collectionReport)
          .then(res => {
            resolve(res.data)
          })
          .catch(err => {
            reject(err)
          })
      },
    )
  }
  return { fetchCollectionReport }
}
