interface GSTAmountExtractorParams {
  qty: number,
  price: number,
  gst: number
}

class GSTAmountExtractor {
  public inclusiveGst = ({ qty, price, gst }: GSTAmountExtractorParams) => {
    return (qty * price * gst) / 100
  }

  public exclusiveGst = ({ qty, price, gst }: GSTAmountExtractorParams) => {
    // priceBeforeGst = price / (1 + (product.cgst + product.sgst) / 100)
    // cgstAmount = sgstAmount = ((price - priceBeforeGst) * quantity) / 2
  }
}

export default new GSTAmountExtractor()
