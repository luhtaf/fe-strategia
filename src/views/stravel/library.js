export const hasNoNullValues=(arr)=> {
    // Use the "some" method to check if any element is null
    return !arr?.some(element => element === null);
}

export const parsingDateToURL=(input)=> input.toISOString().replace('.000', '.000') + 'Z'
