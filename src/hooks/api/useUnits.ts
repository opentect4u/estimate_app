import axios from "axios"
import { ADDRESSES } from "../../config/api_list"
import { UnitData } from "../../models/api_types"

export default function useUnits() {
  const fetchUnits = async (compId: number) => {
    return new Promise<PromiseLike<UnitData[]>>((resolve, reject) => {
      axios
        .get(`${ADDRESSES.UNITS}/${compId}`)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  }
  return { fetchUnits }
}
