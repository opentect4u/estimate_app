export default function useCalculations() {
  const netTotalCalculate = (netTotal: number, totalDiscount: number) => {
    return (netTotal - totalDiscount).toFixed(2)
  }

  const roundingOffCalculate = (netTotal: number, totalDiscount: number) => {
    return (
      Math.round(parseFloat((netTotal - totalDiscount).toFixed(2))) -
      parseFloat((netTotal - totalDiscount).toFixed(2))
    ).toFixed(2)
  }

  const grandTotalCalculate = (netTotal: number, totalDiscount: number) => {
    return Math.round(parseFloat((netTotal - totalDiscount).toFixed(2)))
  }

  const netTotalWithGSTCalculate = (
    netTotal: number,
    totalDiscount: number,
    totalGST: number,
  ) => {
    return (netTotal - totalDiscount + totalGST).toFixed(2)
  }

  const roundingOffWithGSTCalculate = (
    netTotal: number,
    totalDiscount: number,
    totalGST: number,
  ) => {
    return (
      Math.round(parseFloat((netTotal - totalDiscount + totalGST).toFixed(2))) -
      parseFloat((netTotal - totalDiscount + totalGST).toFixed(2))
    ).toFixed(2)
  }

  const grandTotalWithGSTCalculate = (
    netTotal: number,
    totalDiscount: number,
    totalGST: number,
  ) => {
    return Math.round(
      parseFloat((netTotal - totalDiscount + totalGST).toFixed(2)),
    ).toFixed(2)
  }

  // GST INCL

  const totalAmountWithGSTInclCalculate = (
    netTotal: number,
    totalGST: number,
  ) => {
    return (netTotal - totalGST).toFixed(2)
    // return (netTotal - totalGST).toFixed(3)
  }

  const netTotalWithGSTInclCalculate = (
    netTotal: number,
    totalDiscount: number,
  ) => {
    return (netTotal - totalDiscount).toFixed(2)
  }

  const roundingOffWithGSTInclCalculate = (
    netTotal: number,
    totalDiscount: number,
  ) => {
    return (
      Math.round(parseFloat((netTotal - totalDiscount).toFixed(2))) -
      parseFloat((netTotal - totalDiscount).toFixed(2))
    ).toFixed(2)
  }

  const grandTotalWithGSTInclCalculate = (
    netTotal: number,
    totalDiscount: number,
  ) => {
    return Math.round(
      parseFloat((netTotal - totalDiscount).toFixed(2)),
    ).toFixed(2)
  }

  // const calculatePriceNum = (numStr: string) => {
  //     var strSplit = numStr != '' ? numStr.split('.') : [], finalNum = numStr
  //     if(strSplit.length > 0){
  //         if(strSplit.length > 1){
  //             var decNum = strSplit[1]
  //             var finalDecNum = decNum.length > 2 ? decNum.substring(2) : decNum;
  //             finalNum = `${strSplit[0]}.${finalDecNum}`;
  //         }
  //     }
  //     return finalNum;
  // }

  return {
    netTotalCalculate,
    roundingOffCalculate,
    grandTotalCalculate,

    netTotalWithGSTCalculate,
    roundingOffWithGSTCalculate,
    grandTotalWithGSTCalculate,

    totalAmountWithGSTInclCalculate,
    netTotalWithGSTInclCalculate,
    roundingOffWithGSTInclCalculate,
    grandTotalWithGSTInclCalculate,
  }
}
