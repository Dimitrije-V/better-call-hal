const fs = require('fs');
const pdf = require('pdf-parse');
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: '',
});
const openai = new OpenAIApi(configuration);

let dataBuffer = fs.readFileSync('./contract.pdf');

const getString = (dataBuffer) => {
  const s = pdf(dataBuffer).then(data => data.text);
  return s;
}

const breakAndReconstruct = (resolvedValue) => {
  const arr = resolvedValue.split('\n');
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

const generateAdviceList = async () => {
  const resolvedValue = await getString(dataBuffer);
  const arr = await breakAndReconstruct(resolvedValue);

  const adviceList = [];
  for (const contractSegment of arr) {
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
    );
  return cleanedAdviceList.join('\n');
};


const filterAdviceList = async (adviceList) => {
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: generateFilteringPrompt(adviceList),
    temperature: 0.2,
    max_tokens: 1400,
    frequency_penalty: 0.4
  });
  console.log(completion.data.choices[0].text)
  return completion.data.choices[0].text
}

function generateAdviceListPrompt(contractSegment) {
  return `Thinking from the perspective of the potential tenant, describe any particularly unusual and adverse points from the following contract segment, and return them in a list, seperated by the symbol "|".
  If nothing in the contract segment is particularly unusual or adverse comapred to a normal letting contract, simply return "Nothing found". 
  Contract segment: ${contractSegment}
  Potential red flags:
  `
}

function generateFilteringPrompt(adviceList) {
  return `The following is meant to be a list of unusual or adverse points in a letting contract for the tenant. Filter out any points which are not coherent or not unusual compared to standard letting agreements, and return the remaining ones in order of how much they deviate from standard let agreements.
  Rewrite any point which appears poorly-written.
  Input:${adviceList}`
}


generateAdviceList().then(adviceList => {
  filterAdviceList(adviceList)
});

