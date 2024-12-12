import { ItemsData } from "../models/api_types"

// export function gstFilterationAndTotals(addedProducts: ItemsData[]) {
//     let productsCGST_5: ItemsData[] = []
//     let productsCGST_12: ItemsData[] = []
//     let productsCGST_18: ItemsData[] = []
//     let productsCGST_28: ItemsData[] = []

//     let productsSGST_5: ItemsData[] = []
//     let productsSGST_12: ItemsData[] = []
//     let productsSGST_18: ItemsData[] = []
//     let productsSGST_28: ItemsData[] = []

//     let totalCGST_5: number = 0
//     let totalCGST_12: number = 0
//     let totalCGST_18: number = 0
//     let totalCGST_28: number = 0

//     let totalSGST_5: number = 0
//     let totalSGST_12: number = 0
//     let totalSGST_18: number = 0
//     let totalSGST_28: number = 0

//     let totalGST: number = 0

//     for (const product of addedProducts ?? []) {
//         if (product.cgst === 5) {
//             productsCGST_5.push(product)
//             totalCGST_5 += (((product.quantity * product.price)) * product.cgst) / 100
//         } else if (product.cgst === 12) {
//             productsCGST_12.push(product)
//             totalCGST_12 += (((product.quantity * product.price)) * product.cgst) / 100
//         } else if (product.cgst === 18) {
//             productsCGST_18.push(product)
//             totalCGST_18 += (((product.quantity * product.price)) * product.cgst) / 100
//         } else if (product.cgst === 28) {
//             productsCGST_28.push(product)
//             totalCGST_28 += (((product.quantity * product.price)) * product.cgst) / 100
//         }

//         if (product.sgst === 5) {
//             productsSGST_5.push(product)
//             totalSGST_5 += (((product.quantity * product.price)) * product.sgst) / 100
//         } else if (product.sgst === 12) {
//             productsSGST_12.push(product)
//             totalSGST_12 += (((product.quantity * product.price)) * product.sgst) / 100
//         } else if (product.sgst === 18) {
//             productsSGST_18.push(product)
//             totalSGST_18 += (((product.quantity * product.price)) * product.sgst) / 100
//         } else if (product.sgst === 28) {
//             productsSGST_28.push(product)
//             totalSGST_28 += (((product.quantity * product.price)) * product.sgst) / 100
//         }
//     }

//     totalGST = totalCGST_5
//         + totalCGST_12
//         + totalCGST_18
//         + totalCGST_28
//         + totalSGST_5
//         + totalSGST_12
//         + totalSGST_18
//         + totalSGST_28

//     return {
//         productsCGST_5,
//         productsCGST_12,
//         productsCGST_18,
//         productsCGST_28,
//         productsSGST_5,
//         productsSGST_12,
//         productsSGST_18,
//         productsSGST_28,
//         totalCGST_5,
//         totalCGST_12,
//         totalCGST_18,
//         totalCGST_28,
//         totalSGST_5,
//         totalSGST_12,
//         totalSGST_18,
//         totalSGST_28,
//         totalGST
//     }
// }

// export function gstFilterationAndTotals(addedProducts: ItemsData[]) {
//     const initialTotals = {
//         CGST: { 5: 0, 12: 0, 18: 0, 28: 0 },
//         SGST: { 5: 0, 12: 0, 18: 0, 28: 0 },
//         totalGST: 0
//     }

//     const totals = addedProducts.reduce((acc, product) => {
//         const { cgst, sgst, quantity, price } = product
//         const cgstAmount = (quantity * price * cgst) / 100
//         const sgstAmount = (quantity * price * sgst) / 100

//         acc.CGST[cgst] += cgstAmount
//         acc.SGST[sgst] += sgstAmount
//         acc.totalGST += cgstAmount + sgstAmount

//         return acc
//     }, initialTotals)

//     const {
//         CGST: { 5: totalCGST_5, 12: totalCGST_12, 18: totalCGST_18, 28: totalCGST_28 },
//         SGST: { 5: totalSGST_5, 12: totalSGST_12, 18: totalSGST_18, 28: totalSGST_28 },
//         totalGST
//     } = totals

//     const filterByCGST = (cgst: number) => addedProducts.filter((product) => product.cgst === cgst)
//     const filterBySGST = (sgst: number) => addedProducts.filter((product) => product.sgst === sgst)

//     const productsCGST_5 = filterByCGST(5)
//     const productsCGST_12 = filterByCGST(12)
//     const productsCGST_18 = filterByCGST(18)
//     const productsCGST_28 = filterByCGST(28)

//     const productsSGST_5 = filterBySGST(5)
//     const productsSGST_12 = filterBySGST(12)
//     const productsSGST_18 = filterBySGST(18)
//     const productsSGST_28 = filterBySGST(28)

//     return {
//         productsCGST_5,
//         productsCGST_12,
//         productsCGST_18,
//         productsCGST_28,
//         productsSGST_5,
//         productsSGST_12,
//         productsSGST_18,
//         productsSGST_28,
//         totalCGST_5,
//         totalCGST_12,
//         totalCGST_18,
//         totalCGST_28,
//         totalSGST_5,
//         totalSGST_12,
//         totalSGST_18,
//         totalSGST_28,
//         totalGST
//     }
// }

// type DynamicTotalsResult = {
//     [key: string]: any; // Allows dynamic keys for totals and product lists
//     totalGST: number; // Ensure totalGST is explicitly part of the type
// };

// export function gstFilterationAndTotals(addedProducts: ItemsData[]): DynamicTotalsResult {
//     // Initialize totals dynamically
//     const initialTotals = addedProducts.reduce((acc, product) => {
//         const { cgst, sgst } = product;
//         if (!acc.CGST.hasOwnProperty(cgst)) acc.CGST[cgst] = 0;
//         if (!acc.SGST.hasOwnProperty(sgst)) acc.SGST[sgst] = 0;
//         return acc;
//     }, { CGST: {}, SGST: {}, totalGST: 0 });

//     const totals = addedProducts.reduce((acc, product) => {
//         const { cgst, sgst, quantity, price } = product;
//         const cgstAmount = (quantity * price * cgst) / 100;
//         const sgstAmount = (quantity * price * sgst) / 100;

//         acc.CGST[cgst] += cgstAmount;
//         acc.SGST[sgst] += sgstAmount;
//         acc.totalGST += cgstAmount + sgstAmount;

//         return acc;
//     }, initialTotals as any); // Casting to any to bypass initial structure typing.

//     // Initialize the result with a clear type definition.
//     const result: DynamicTotalsResult = { totalGST: totals.totalGST };

//     // Dynamically create properties for CGST
//     Object.keys(totals.CGST).forEach((rate) => {
//         result[`productsCGST_${rate}`] = addedProducts.filter((product) => product.cgst === Number(rate));
//         result[`totalCGST_${rate}`] = totals.CGST[rate];
//     });

//     // Dynamically create properties for SGST
//     Object.keys(totals.SGST).forEach((rate) => {
//         result[`productsSGST_${rate}`] = addedProducts.filter((product) => product.sgst === Number(rate));
//         result[`totalSGST_${rate}`] = totals.SGST[rate];
//     });

//     return result;
// }

type DynamicTotalsResult = {
  [key: string]: any // Allows dynamic keys for product lists and totals
  totalGST: number // Ensure totalGST is explicitly part of the type
}

export function gstFilterationAndTotals(
  addedProducts: ItemsData[],
  gstType: "I" | "E",
): DynamicTotalsResult {
  // Initialize totals dynamically
  const initialTotals = addedProducts.reduce(
    (acc, product) => {
      const cgstKey = `CGST_${product.cgst.toString().replace(".", "_")}`
      const sgstKey = `SGST_${product.sgst.toString().replace(".", "_")}`
      if (!acc[cgstKey]) acc[cgstKey] = 0
      if (!acc[sgstKey]) acc[sgstKey] = 0
      return acc
    },
    { totalGST: 0 },
  )

  const totals = addedProducts.reduce((acc, product) => {
    const cgstKey = `CGST_${product.cgst.toString().replace(".", "_")}`
    const sgstKey = `SGST_${product.sgst.toString().replace(".", "_")}`
    const { quantity, price } = product
    // const cgstAmount = (quantity * price * product.cgst) / 100
    // const sgstAmount = (quantity * price * product.sgst) / 100
    let cgstAmount: number = 0
    let sgstAmount: number = 0

    let priceBeforeGst: number = 0

    if (gstType === "E") {
      cgstAmount = (quantity * price * product.cgst) / 100
      sgstAmount = (quantity * price * product.sgst) / 100
    } else {
      priceBeforeGst = price / (1 + (product.cgst + product.sgst) / 100)
      cgstAmount = sgstAmount = ((price - priceBeforeGst) * quantity) / 2
    }

    acc[cgstKey] += cgstAmount
    acc[sgstKey] += sgstAmount
    acc.totalGST += cgstAmount + sgstAmount

    return acc
  }, initialTotals as any) // Using `as any` for simplicity in handling dynamic keys.

  // Initialize the result with a clear type definition.
  const result: DynamicTotalsResult = { totalGST: totals.totalGST }

  // Dynamically create properties for CGST and SGST, adjusting for decimal rates
  Object.keys(totals).forEach(key => {
    if (key.startsWith("CGST_") || key.startsWith("SGST_")) {
      const rateType = key.split("_")[0].toLowerCase() // cgst or sgst
      const rate = key.split("_").slice(1).join(".").replace("_", ".") // Convert back to decimal
      const filteredProducts = addedProducts.filter(product => {
        const productRate = rateType === "cgst" ? product.cgst : product.sgst
        return productRate.toString() === rate
      })
      const formattedKey = `${rateType}s_${key.split("_").slice(1).join("_")}` // Formats the key as productsCGST_2_5 or productsSGST_2_5, etc.
      result[formattedKey] = filteredProducts
      result[`total${key}`] = totals[key]
    }
  })

  return result
}
