import axios from "axios"
import { ADDRESSES } from "../../config/api_list"
import { BasicResponse } from "../../models/api_types"

export default function useEditHeaderFooter() {
  const editHeaderFooter = async (
    companyId: number,
    header1: string,
    header2: string,
    footer1: string,
    footer2: string,
    flag1: string,
    flag2: string,
    flag3: string,
    flag4: string,
    createdBy: string,
  ) => {
    return new Promise<PromiseLike<BasicResponse>>((resolve, reject) => {
      axios
        .post(`${ADDRESSES.EDIT_HEADER_FOOTER}`, {
          comp_id: companyId,
          header1: header1,
          on_off_flag1: flag1,
          header2: header2,
          on_off_flag2: flag2,
          footer1: footer1,
          on_off_flag3: flag3,
          footer2: footer2,
          on_off_flag4: flag4,
          created_by: createdBy,
        })
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  }
  return { editHeaderFooter }
}
