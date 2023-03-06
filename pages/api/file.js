import { Configuration, OpenAIApi } from "openai";
import { breakIntoSegments, generateFilteringPrompt, generateAdviceListPrompt } from "../../utils";
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
  form.parse(req, async (error, _, files) => {
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
      console.log(cleanedAdviceList);
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: generateFilteringPrompt(cleanedAdviceList),
        temperature: 0
      });
      console.log(completion.data.choices[0].message.content)
      res.status(200).json({ result: completion.data.choices[0].message.content });
    } catch (error) {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        },
      });
    }
  });
}

