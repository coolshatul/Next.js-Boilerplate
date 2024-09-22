import Groq from "groq-sdk";

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY as string,
});

export const createChatCompletion = async (
  systemContent: string,
  userContent: string
) => {
  try {
    const chatCompletion: any = await client.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemContent,
        },
        {
          role: "user",
          content: userContent,
        },
      ],
      model: process.env.GROQ_MODEL as string,
      temperature: 1,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
      stop: null,
    });

    return chatCompletion.choices[0].message.content;
  } catch (error) {
    throw error;
  }
};
