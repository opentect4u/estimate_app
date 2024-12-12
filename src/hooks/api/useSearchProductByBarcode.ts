import axios from "axios"
import { ADDRESSES } from "../../config/api_list"
import {
    SearchByBarcodeCredentials,
    SearchByBarcodeResponse,
} from "../../models/api_types"

export default function useSearchProductByBarcode() {
    const fetchProductByBarcode = async (
        searchByBarcodeCreds: SearchByBarcodeCredentials,
    ) => {
        return new Promise<PromiseLike<SearchByBarcodeResponse>>(
            (resolve, reject) => {
                axios
                    .post(`${ADDRESSES.SEARCH_BY_BARCODE}`, searchByBarcodeCreds)
                    .then(res => {
                        resolve(res.data)
                    })
                    .catch(err => {
                        reject(err)
                    })
            },
        )
    }
    return { fetchProductByBarcode }
}
