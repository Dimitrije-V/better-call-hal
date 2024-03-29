import { Configuration, OpenAIApi } from "openai";
import { generateAdviceList } from "./support/generateAdviceList";

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


  if (contract.length > 200000) {
    res.status(400).json({
      error: {
        message: "Your contract is too long.",
      }
    });
    return;
  }

  const contractType = req.body.contractType;
  if (!contractType) {
    res.status(400).json({
      error: {
        message: "Please select a contract type.",
      }
    })
    return;
  }

  try {
    const adviceList = await generateAdviceList(contract, openai, contractType);
    res.status(200).json({ result: adviceList });
    return;
  }

  catch (error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
      return;
    }
    console.error(`Error with OpenAI API request: ${error.message}`);
    res.status(500).json({
      error: {
        message: 'An error occurred during your request.',
      }
    });
    return;
  }
}
