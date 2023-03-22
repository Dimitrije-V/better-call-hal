import {
    generateEmploymentFinalPrompt,
    generateLettingFinalPrompt
} from './prompts';
import { withRetry } from './utils';


const processContract = async (adviceList, openai, contractType) => {
    if (contractType === 'tenancy') return processTenancyContract(adviceList, openai);

    if (contractType === 'employment') return processEmploymentContract(adviceList, openai);

    throw new Error('Contract type not recognized');
}

const processTenancyContract = async (adviceList, openai) => {
    return withRetry(async () => {
        return await openai.createChatCompletion({
            model: 'gpt-4',
            messages: generateLettingFinalPrompt(adviceList),
            temperature: 0,
        });
    });
}

const processEmploymentContract = async (adviceList, openai) => {
    return withRetry(async () => {
        return await openai.createChatCompletion({
            model: 'gpt-4',
            messages: generateEmploymentFinalPrompt(adviceList),
            temperature: 0,
        });
    });
}

export { processContract };