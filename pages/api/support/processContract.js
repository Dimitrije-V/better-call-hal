import { generateAdviceListPrompt, generateFilteringPrompt, breakIntoSegments } from "./utils";

const processContract = async (contract, openai) => {
    const contractSegmentList = breakIntoSegments(contract);
    const adviceList = [];
    for (const contractSegment of contractSegmentList) {
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: generateAdviceListPrompt(contractSegment),
            temperature: 0
        });
        adviceList.push(completion.data.choices[0].message.content);
    }

    console.log(adviceList)

    const cleanedAdviceList = adviceList
        .flat()
        .map(adviceString =>
            adviceString
                .replace(/\n/g, "")
                .replace(/-/g, "")
                .trim()
        )
        .join('\n');
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: generateFilteringPrompt(cleanedAdviceList),
        temperature: 0.2,
        frequency_penalty: 0.2,
    });

    return completion;
}


module.exports = {
    processContract
}