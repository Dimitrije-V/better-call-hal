const GPT3Encoder = require("@syonfox/gpt-3-encoder");

function generateLettingAdviceListPrompt(contractSegment) {
    return [{
        "role": "system",

        "content": "You are a letting contract analysis tool."
    },
    {
        "role": "user",
        "content": `Your goal is to read through segments of a letting contract and identify any quotes that deviate from a standard letting contract. 
        A standard letting contract is a typical contract that a tenant would encounter, and should not contain clauses or terms that could potentially harm the tenant's rights or financial interests.
        A quote is only the few sentences which demonstrate deviation from a standard letting contract. Return ONLY exact quotes from the contract. Do not summarize or add any of your own text.
        Contract segment: ${contractSegment}
        Identify the quotes that deviate from a standard letting contract:`
    }];
};


function generateLettingFinalPrompt(adviceList) {
    return [{
        "role": "system",

        "content": "You are a letting contract review tool."
    },
    {
        "role": "user",
        "content": `The user will submit a list of quotes from a letting contract. Read through each quote, and judge whether it deviates from a standard letting contract. If it does, summarise it, and include both it and the summary in your response. If it doesn't, ignore it. The format of the end response must be:

        Quote: "[quote from contract segment]",
        Summary: [your summary]
        
        and so on for each quote. Quotes must be separated by one newline from summaries, summaries must be separated by two newlines from quotes.
        
        List of quotes: ${adviceList}
        
        Review and summarize the quotes:`
    }];
};


function generateShortLettingContractAdvice(contract) {
    return [{
        "role": "system",

        "content": "You are a letting contract analysis tool."
    },
    {
        "role": "user",
        "content": `Read through the following contract and, thinking from the perspective of the tenant, return and summarise any particularly unusual and or adverse quotes found within it. The format of the end response must be:

        Quote: "[quote from contract segment]",
        Summary: [your summary]
        
        and so on for each quote. Quotes must be separated by one newline from summaries, summaries must be separated by two newlines from quotes.
        
        Contract: ${contract}
        
        Identify and summarize the unusual or adverse quotes:`
    }];
};

function generateEmploymentAdviceListPrompt(contract) {
    return [{
        "role": "system",

        "content": "You are an employment contract analysis tool."
    },
    {
        "role": "user",
        "content": `Your goal is to read through a contract and identify any quotes that deviate from a standard employment contract.
        A standard employment contract is a typical contract that an employee would encounter, and should not contain clauses or terms that could potentially harm the employee's rights or financial interests.
        A quote is only the few sentences which demonstrate deviation from a standard UK employment contract. 
        Return ONLY exact quotes from the contract. Do not summarize or add any of your own text.

        Contract: ${contract}
        
        Identify the quotes that deviate from a standard UK employment contract:`
    }];
};


function generateEmploymentFinalPrompt(adviceList) {
    return [{
        "role": "system",

        "content": "You are an employment contract review tool."
    },
    {
        "role": "user",
        "content": `The user will submit a list of quotes from an employment contract. Read through it, and judge whether any sections are adverse towards the employee, such as low salary, long hours, etc. If it does, summarise it, and include both it and the summary in your response. If it doesn't, ignore it. The format of the end response must be:

        Quote: "[quote from contract segment]",
        Summary: [your summary]
        
        and so on for each quote. Quotes must be separated by one newline from summaries, summaries must be separated by two newlines from quotes.
        
        List of quotes: ${adviceList}
        
        Review and summarize the quotes:`
    }];
};


const generateShortEmploymentContractAdvice = (contract) => {
    return [
        {
            "role": "system",
            "content": `You are an employment contract analysis tool.
            Read through the following contract and, thinking from the perspective of the employee, return and summarise any particularly unusual and or adverse quotes found within it.
            
            The format of the end response must be:
            'Quote: \"[quote from contract segment]\",
            Summary: [your summary]'

            'Quote: \"[quote from contract segment]\",
            Summary: [your summary]'...
                and so on for each quote.
            Quotes must be seperated by one newline from summaries , summaries must be separated by two newlines from quotes.` },
        {
            "role": "user", "content": `Contract: ${contract}`
        }
    ];
};
const generateAdviceListFilteringPrompt = (adviceList) => {
    return [
        {
            "role": "system",

            "content": "You are a text formatting tool."
        },
        {
            "role": "user",
            "content": `
                Within this list of quotes will be text like "Nothing found", and random characters.
                Remove any such text or characters, but preserve all the quotes from the contract.
                The format of the end response must be:
                Quote: "[quote from contract segment]",
                and so on for each quote.
                List of quotes with extra text: ${adviceList}
                Filter out the extra text and preserve the quotes:`
        }];
};

const breakIntoSegments = (contract) => {
    let arr = contract.split('\n');
    if (arr[0].length === contract.length) arr = contract.split('.')
    const newArr = [""];
    let counter = 0;
    arr.forEach(string => {
        const existingTokenCount = GPT3Encoder.countTokens(newArr[counter]);
        const newTokenCount = GPT3Encoder.countTokens(string);
        if (existingTokenCount + newTokenCount < 2000) {
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
    generateLettingFinalPrompt,
    generateShortLettingContractAdvice,
    generateEmploymentAdviceListPrompt,
    generateEmploymentFinalPrompt,
    generateShortEmploymentContractAdvice,
    generateAdviceListFilteringPrompt,
    breakIntoSegments
}