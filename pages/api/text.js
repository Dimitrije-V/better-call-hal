import { Configuration, OpenAIApi } from "openai";
import { breakIntoSegments, generateFilteringPrompt, generateAdviceListPrompt } from "../../utils";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const contract = req.body.contract || '';
  if (contract.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter your contract.",
      }
    });
    return;
  }

  try {
    const contractSegmentList = await breakIntoSegments(contract);
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
    console.log(completion.data.choices[0].message.content)
    res.status(200).json({ result: completion.data.choices[0].message.content });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}
