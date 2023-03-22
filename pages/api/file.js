import { Configuration, OpenAIApi } from "openai";
import { generateAdviceList } from "./support/generateAdviceList";
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

    try {
      const processedPdf = await pdf(fs.readFileSync(pdfFile.filepath));
      const contract = await processedPdf.text;
      if (contract.length > 200000) {
        res.status(400).json({
          error: {
            message: "PDF file too long",
          },
        });
        return;
      }
      const adviceList = await generateAdviceList(contract, openai, contractType);
      res.status(200).json({ result: adviceList });
      return;
    }
    catch (error) {
      if (error.response) {
        console.log(`Error response : ${error.response}`);
        console.log(error.response.status, error.response.data);
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
  });
}

