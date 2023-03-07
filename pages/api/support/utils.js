function generateAdviceListPrompt(contractSegment) {
    return [
        {
            "role": "system",
            "content": `You are a letting contract review tool.
                Your goal is to read through segments of a letting contract and, thinking from the perspective of the tenant, return any particularly unusual and or adverse/unfair quotes found within it.
                Return only the quotes. Do not add any of your own text.
                If nothing in the contract is particularly unusual or adverse, just return 'Nothing found'.` },
        {
            "role": "user", "content": `Contract segment: ${contractSegment}`
        },
        {
            "role": "assistant", "content": "Adverse points:"
        }
    ];
};

function generateFilteringPrompt(adviceList) {
    return [
        {
            "role": "system",
            "content": `You are a letting contract review tool.
                The user will submit a list of quotes from a letting contract. Read through each quote, and judge whether it deviates from a standard letting contract.
                If it does, summarise it, and include both it and the summary in your response. If it doesn't, remove it.
                The format of the response must be: 
                'Quote: \"[quote from contract segment]\",
                Summary: [your summary]'
        
                'Quote: \"[quote from contract segment]\",
                Summary: [your summary]'...
                 and so on for each quote.
                Quotes must be seperated by one newline from summaries , summaries must be separated by two newlines from quotes.` },
        { "role": "user", "content": adviceList }
    ];
};

const breakIntoSegments = (contract) => {
    let arr = contract.split('\n');
    if (arr[0].length === contract.length) arr = contract.split('.')
    const newArr = [""];
    let counter = 0;
    arr.forEach(string => {
        if ((newArr[counter].length + string.length) < 7500) {
            newArr[counter] = newArr[counter].concat(string)
        } else {
            counter += 1;
            newArr.push(string);
        }
    });
    return newArr;
};


module.exports = {
    generateAdviceListPrompt,
    generateFilteringPrompt,
    breakIntoSegments,
}