function generateLettingAdviceListPrompt(contractSegment) {
    return [
        {
            "role": "system",
            "content": `You are a letting contract analysis tool.
            Your goal is to read through segments of a letting contract and, thinking from the perspective of the tenant, return any particularly unusual and or adverse quotes found within it. 
            Return ONLY unchanged quotes from the contract. Do not summarise or add any of your own text.` },
        {
            "role": "user", "content": `Contract segment: ${contractSegment}`
        },
        {
            "role": "assistant", "content": "Adverse points:"
        }
    ];
};

function generateLettingFilteringPrompt(adviceList) {
    return [
        {
            "role": "system",
            "content": `You are a letting contract review tool.
                The user will submit a list of quotes from a letting contract. Read through each quote, and judge whether it deviates from a standard letting contract.
                If it does, summarise it, and include both it and the summary in your response. If it doesn't, ignore it.
                The format of the end response must be: 
                'Quote: \"[quote from contract segment]\",
                Summary: [your summary]'
        
                'Quote: \"[quote from contract segment]\",
                Summary: [your summary]'...
                 and so on for each quote.
                Quotes must be seperated by one newline from summaries , summaries must be separated by two newlines from quotes.`
        },
        { "role": "user", "content": adviceList }
    ];
};

const generateEmploymentAdviceListPrompt = (contract) => {
    return [
        {
            "role": "system",
            "content": `You are an employment contract analysis tool.
            Your goal is to read through a contract and, thinking from the perspective of the employee, return any particularly unusual and or adverse quotes found within it. 
            Return ONLY unchanged quotes from the contract. Do not summarise or add any of your own text.` },
        {
            "role": "user", "content": `Contract: ${contract}`
        },
        {
            "role": "assistant", "content": "Adverse points:"
        }
    ];
};

const generateEmploymentFilteringPrompt = (adviceList) => {
    return [
        {
            "role": "system",
            "content": `You are an employment contract review tool.
                The user will submit a UK employment contract. Read through it, and judge whether any sections are adverse towards the employee. Low salary, long hours, etc.
                If it does, summarise it, and include both it and the summary in your response. If it doesn't, ignore it.
                The format of the end response must be:
                'Quote: \"[quote from contract segment]\",
                Summary: [your summary]'

                'Quote: \"[quote from contract segment]\",
                Summary: [your summary]'...
                    and so on for each quote.
                Quotes must be seperated by one newline from summaries , summaries must be separated by two newlines from quotes.`
        },
        { "role": "user", "content": adviceList }
    ];
};

const breakIntoSegments = (contract) => {
    let arr = contract.split('\n');
    if (arr[0].length === contract.length) arr = contract.split('.')
    const newArr = [""];
    let counter = 0;
    arr.forEach(string => {
        if ((newArr[counter].length + string.length) < 6000) {
            newArr[counter] = newArr[counter].concat(string)
        } else {
            counter += 1;
            newArr.push(string);
        }
    });
    return newArr;
};


module.exports = {
    generateLettingAdviceListPrompt,
    generateLettingFilteringPrompt,
    generateEmploymentAdviceListPrompt,
    generateEmploymentFilteringPrompt,
    breakIntoSegments,
}