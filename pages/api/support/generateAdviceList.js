import {
    generateEmploymentAdviceListPrompt,
    generateLettingAdviceListPrompt,
    breakIntoSegments,
} from './prompts';
import { withRetry } from './utils';
import GPT3Encoder from '@syonfox/gpt-3-encoder';

const generateAdviceList = async (contract, openai, contractType) => {
    if (contractType === 'tenancy') return generateTenancyAdviceList(contract, openai);

    if (contractType === 'employment') return generateEmploymentAdviceList(contract, openai);

    throw new Error('Contract type not recognized');
};

const generateTenancyAdviceList = (contract, openai) =>
    generateAdviceListGeneric(
        contract,
        openai,
        generateLettingAdviceListPrompt,
    );

const generateEmploymentAdviceList = (contract, openai) =>
    generateAdviceListGeneric(
        contract,
        openai,
        generateEmploymentAdviceListPrompt,
    );

const generateAdviceListGeneric = async (contract, openai, generateAdviceListPrompt) => {
    const contractSegments = breakIntoSegments(contract);
    const adviceListPromises = contractSegments.map(async segment => {
        const tokenCount = Math.floor(GPT3Encoder.countTokens(segment) / 4);
        return withRetry(async () => {
            console.log('Sending advice list request')
            const completion = await openai.createChatCompletion({
                model: 'gpt-4',
                messages: generateAdviceListPrompt(segment),
                temperature: 0,
                max_tokens: tokenCount,
            });
            console.log('Received advice list response.')
            return completion.data.choices[0].message.content;
        });
    });

    const adviceList = await Promise.all(adviceListPromises);
    const cleanedAdviceList = adviceList
        .flat()
        .map(advice => advice.replace(/\n/g, '').replace(/-/g, '').trim())
        .join('\n');
    return cleanedAdviceList;
};

export { generateAdviceList };

