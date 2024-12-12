function countOccurrences(arr: string[]): Map<string, number> {
    const occurrences = new Map<string, number>()

    arr.forEach(barcode => {
        if (occurrences.has(barcode)) {
            occurrences.set(barcode, occurrences.get(barcode)! + 1)
        } else {
            occurrences.set(barcode, 1)
        }
    })

    return occurrences
}

export function getUniqueWithMaxCount(arr: string[]): string | undefined {
    const occurrences = countOccurrences(arr)
    let maxCount = 0
    let uniqueWithMaxCount: string | undefined

    occurrences.forEach((count, num) => {
        if (count > maxCount) {
            maxCount = count
            uniqueWithMaxCount = num
        }
    })

    return uniqueWithMaxCount
}