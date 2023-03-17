import {
    generateEmploymentAdviceListPrompt,
    generateEmploymentFinalPrompt,
    generateLettingAdviceListPrompt,
    generateLettingFinalPrompt,
    generateShortEmploymentContractAdvice,
    generateShortLettingContractAdvice,
    generateAdviceListFilteringPrompt,
    breakIntoSegments,
} from './utils';
import GPT3Encoder from '@syonfox/gpt-3-encoder';

const processContract = async (contract, openai, contractType) => {
    const shortContract = GPT3Encoder.countTokens(contract) <= 1500;

    switch (contractType) {
        case 'tenancy':
            return shortContract
                ? processShortTenancyContract(contract, openai)
                : processTenancyContract(contract, openai);
        case 'employment':
            return shortContract
                ? processShortEmploymentContract(contract, openai)
                : processEmploymentContract(contract, openai);
        default:
            throw new Error('Contract type not recognised');
    }
};

const processContractByType = async (contract, openai, generateAdviceListPrompt, generateFinalPrompt) => {
    const contractSegmentList = breakIntoSegments(contract);
    const adviceListPromises = contractSegmentList.map(async (contractSegment) => {
        const completion = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: generateAdviceListPrompt(contractSegment),
            temperature: 0,
            max_tokens: 1500,
        });
        return completion.data.choices[0].message.content;
    });
    const adviceList = await Promise.all(adviceListPromises);

    const cleanedAdviceList = adviceList
        .flat()
        .map((adviceString) =>
            adviceString.replace(/\n/g, '').replace(/-/g, '').trim(),
        )
        .join('\n');

    const filteringCompletion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: generateAdviceListFilteringPrompt(cleanedAdviceList),
        temperature: 0,
    });
    const filteredAdviceList = filteringCompletion.data.choices[0].message.content;

    const completion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: generateFinalPrompt(filteredAdviceList),
        temperature: 0,
    });
    return completion;
};

const processTenancyContract = (contract, openai) =>
    processContractByType(contract, openai, generateLettingAdviceListPrompt, generateLettingFinalPrompt);

const processEmploymentContract = (contract, openai) =>
    processContractByType(contract, openai, generateEmploymentAdviceListPrompt, generateEmploymentFinalPrompt);

const processShortTenancyContract = async (contract, openai) => {
    const completion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: generateShortLettingContractAdvice(contract),
        temperature: 0,
    });

    return completion;
};

const processShortEmploymentContract = async (contract, openai) => {
    const completion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: generateShortEmploymentContractAdvice(contract),
        temperature: 0,
    });

    return completion;
};

export { processContract };