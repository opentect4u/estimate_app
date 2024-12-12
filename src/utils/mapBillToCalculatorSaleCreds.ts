import { CalculatorSaleInsertCredentials } from "../models/api_types"
import { Bill } from "../models/custom_types"

export function mapBillToCalculatorSaleCreds(
    compId: number,
    branchId: number,
    createdBy: string,
    bill: Bill,
    totalPrice: number,
    roundingOff: number,
    netTotal: number,
): CalculatorSaleInsertCredentials {

    return {
        comp_id: compId,
        br_id: branchId,
        price: bill?.price,
        qty: bill?.qty,
        tprice: totalPrice,
        round_off: roundingOff,
        net_amt: netTotal,
        created_by: createdBy
    }
}
