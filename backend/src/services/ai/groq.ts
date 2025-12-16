import Groq from "groq-sdk";
import { env } from "../../config/env";

const groq = new Groq({ apiKey: env.GROQ_API_KEY });

export const generateGroqResponse = async (
  history: { role: "user" | "assistant"; content: string }[],
  message: string
): Promise<string> => {
  const completion = await groq.chat.completions.create({
    messages: [...history, { role: "user", content: message }],
    model: "llama3-8b-8192", // Fast, efficient fallback
    max_tokens: 500,
  });

  return (
    completion.choices[0]?.message?.content ||
    "I'm having trouble thinking right now."
  );
};
