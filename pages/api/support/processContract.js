import { generateAdviceListPrompt, generateFilteringPrompt, breakIntoSegments } from "./utils";

const processContract = async (contract, openai) => {
    const contractSegmentList = breakIntoSegments(contract);
    const adviceListPromises = contractSegmentList.map(async (contractSegment, index) => {
        console.log(`Request ${index} sent`)
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: generateAdviceListPrompt(contractSegment),
            temperature: 0,
        });
        console.log(`Request ${index} resolving`)
        return completion.data.choices[0].message.content;
    });
    const adviceList = await Promise.all(adviceListPromises);

    const cleanedAdviceList = adviceList
        .flat()
        .map((adviceString) =>
            adviceString.replace(/\n/g, "").replace(/-/g, "").trim()
        )
        .join("\n");
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: generateFilteringPrompt(cleanedAdviceList),
        temperature: 0,
        frequency_penalty: 0.2,
    });

    return completion;
};

module.exports = {
    processContract,
};