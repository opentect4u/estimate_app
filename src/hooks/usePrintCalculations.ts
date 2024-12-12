export default function usePrintCalculations() {
  const calculatePercentDiscountPerProduct = (
    price: number,
    qty: number,
    discount: number,
  ) => {
    return parseFloat(
      //@ts-ignore
      (parseFloat(price) * parseFloat(qty) * parseFloat(discount)) / 100,
    ).toFixed(2)
  }

  // const calculateAmountAfterPercentDiscountPerProduct = (price: number, qty: number, discount: number) => {
  //     //@ts-ignore
  //     return parseFloat((parseFloat(price) * parseFloat(qty)) - ((parseFloat(price) * parseFloat(qty) * parseFloat(discount)) / 100)).toFixed(2)
  // }
  const calculateAmountAfterPercentDiscountPerProduct = (
    price: number,
    qty: number,
    discount: number,
  ) => {
    //@ts-ignore
    return parseFloat(parseFloat(price) * parseFloat(qty)).toFixed(2)
  }

  const calculateAmountDiscountPerProduct = (qty: number, discount: number) => {
    //@ts-ignore
    return (parseFloat(qty) * parseFloat(discount)).toFixed(2)
  }

  // const calculateAmountAfterAmountDiscountPerProduct = (price: number, qty: number, discount: number) => {
  //     //@ts-ignore
  //     return parseFloat((parseFloat(price) * parseFloat(qty)) - (parseFloat(qty) * parseFloat(discount))).toFixed(2)
  // }
  const calculateAmountAfterAmountDiscountPerProduct = (
    price: number,
    qty: number,
    discount: number,
  ) => {
    //@ts-ignore
    return parseFloat(parseFloat(price) * parseFloat(qty)).toFixed(2)
  }

  return {
    calculatePercentDiscountPerProduct,
    calculateAmountAfterPercentDiscountPerProduct,
    calculateAmountDiscountPerProduct,
    calculateAmountAfterAmountDiscountPerProduct,
  }
}
