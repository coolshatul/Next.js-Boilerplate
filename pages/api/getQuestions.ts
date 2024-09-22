import { createChatCompletion } from "@/lib/groqClient";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { stream, board, course, subject, test } = req.body;
    const systemContent = `tudent will provide u there information \nplease provide only ${test.questions} mockQuestions JSON array only in below format [{\n  \"id\": number;\n  \"text\": string;\n  \"options\": string[];\n  \"correctAnswer\": number;\n}]. only mockQuestions array nothing else`;

    const userContent = `i am student stream : ${stream} boards: ${board} courses: ${course} subject: ${subject}`;

    try {
      const apiResponse = await createChatCompletion(
        systemContent,
        userContent
      );
      const mockQuestions = convertApiResponseToJson(apiResponse);
      return res.status(200).send(mockQuestions);
    } catch (error: any) {
      console.error("Error generating formula:", error);
      return res
        .status(500)
        .json({ message: "Error generating formula", error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

function convertApiResponseToJson(apiResponse: string) {
  try {
    const jsonData = JSON.parse(apiResponse);
    return jsonData;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return error; // or handle the error as needed
  }
}
