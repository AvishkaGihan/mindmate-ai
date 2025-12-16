export interface AIMessage {
  role: "user" | "model";
  content: string;
}

export interface AIResponse {
  content: string;
  source: "gemini" | "groq";
}
