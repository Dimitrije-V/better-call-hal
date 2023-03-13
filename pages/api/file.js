import { Configuration, OpenAIApi } from "openai";
import { processContract } from "./support/processContract";
import fs from "fs";
import formidable from "formidable";
import pdf from "pdf-parse"

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  };

  const form = formidable({ multiples: false });
  form.parse(req, async (error, fields, files) => {
    if (error) {
      console.error(error);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        },
      });
      return;
    };

    const pdfFile = files.pdf;
    if (!pdfFile) {
      res.status(400).json({
        error: {
          message: "Please upload a PDF file.",
        },
      });
      return;
    };

    const { contractType } = fields;
    console.log(contractType)


    try {
      const processedPdf = await pdf(fs.readFileSync(pdfFile.filepath));
      const contract = await processedPdf.text;
      if (contract.length > 100000) {
        res.status(400).json({
          error: {
            message: "PDF file too long",
          },
        });
        return;
      }
      console.log(contractType)
      const completion = await processContract(contract, openai, contractType);
      res.status(200).json({ result: completion.data.choices[0].message.content, contractType: contractType });
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
        },
      });
      return;
    }
  });
}

