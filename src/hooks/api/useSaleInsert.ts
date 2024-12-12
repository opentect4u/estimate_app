import axios from "axios"
import { ADDRESSES } from "../../config/api_list"
import { SaleInsertData } from "../../models/api_types"
import { FilteredItem } from "../../models/custom_types"

export default function useSaleInsert() {
  // const sendSaleDetails = async (
  //     companyId: string,
  //     branchId: string,
  //     itemId: string,
  //     price: string,
  //     discountAmt: string,
  //     quantity: string,
  //     cgstAmt?: string,
  //     sgstAmt?: string
  // ) => {
  //     return new Promise<SaleInsertData>((resolve, reject) => {
  //         axios.post(`${ADDRESSES.SALE_INSERT}`, {
  //             comp_id: companyId,
  //             br_id: branchId,
  //             item_id: itemId,
  //             price: price,
  //             discount_amt: discountAmt,
  //             qty: quantity,
  //             cgst_amt: cgstAmt,
  //             sgst_amt: sgstAmt,
  //         }, {}).then(res => {
  //             resolve(res.data)
  //         }).catch(err => {
  //             reject(err)
  //         })
  //     })
  // }
  const sendSaleDetails = async (productsWithCredentials: FilteredItem[]) => {
    // console.log("===========***********==========", productsWithCredentials)
    return new Promise<SaleInsertData>((resolve, reject) => {
      axios
        .post(`${ADDRESSES.SALE_INSERT}`, productsWithCredentials)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  }
  return { sendSaleDetails }
}
