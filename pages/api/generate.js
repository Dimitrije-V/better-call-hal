import { Configuration, OpenAIApi } from "openai";
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
      const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: generateAdviceListPrompt(contractSegment),
        temperature: 0.3,
        max_tokens: 200,
        frequency_penalty: 0.6
      });
      adviceList.push(completion.data.choices[0].text.split('|'));
    }
    const cleanedAdviceList = adviceList
      .flat()
      .map(adviceString =>
        adviceString
          .replace('\n', "")
          .replace("-", "")
          .trim()
      )
      .join('\n');

    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generateFilteringPrompt(cleanedAdviceList),
      temperature: 0.2,
      max_tokens: 1400,
      frequency_penalty: 0.4
    });
    console.log(completion.data.choices[0].text)
    res.status(200).json({ result: completion.data.choices[0].text.split('\n') });
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

function generateAdviceListPrompt(contractSegment) {
  return `Thinking from the perspective of the potential tenant, describe any particularly unusual and adverse points from the following contract segment, and return them in a list, seperated by the symbol "|".
  Contract segment: ${contractSegment}
  Potential red flags:
  `
}

function generateFilteringPrompt(adviceList) {
  return `The following is meant to be a list of unusual or adverse points in a letting contract for the tenant. Filter out any points which are not coherent or not unusual compared to standard letting agreements, and return the remaining ones in order of how much they deviate from standard let agreements.
  Rewrite any point which appears poorly-written, or, if this is impossible without further context, remove the point.
  Input:${adviceList}`
}

const breakIntoSegments = (contract) => {
  let arr = contract.split('\n');
  if ([...arr].join('\n').length === contract.length) arr = contract.split('.')
  const newArr = [""];
  let counter = 0;
  arr.forEach(string => {
    if ((newArr[counter].length + string.length) < 7500) {
      newArr[counter] = newArr[counter].concat(string)
    } else {
      counter += 1;
      newArr.push(string);
    }
  })
  return newArr
}
