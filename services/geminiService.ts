import { GoogleGenAI } from "@google/genai";

// Ensure the API key is available. In a real app, you might have more robust error handling.
if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const summarizeYouTubeVideoStream = async (url: string, language: string, onStreamUpdate: (chunk: string) => void): Promise<void> => {
  const model = 'gemini-2.5-flash';
  const prompt = `
    You are a world-class video analyst. Your goal is to create a powerful, concise summary of the provided YouTube video.
    The summary must be in ${language}.
    
    Generate a response with the following strict structure, using plain text only:
    1.  **Title:** Start with a single line: "Title: [An engaging and descriptive title for the summary]".
    2.  **Insights Header:** Follow with a single line: "InsightsHeader: [The phrase 'Key Insights' translated into ${language}]".
    3.  **Key Insights List:** Follow with a bulleted list of the most important points. Each bullet point MUST begin with '* '.
    
    Do not use any markdown formatting (bold, italics, etc.).
    Focus on clarity, accuracy, and capturing the video's core message.
  `;

  try {
    const responseStream = await ai.models.generateContentStream({
      model,
      contents: {
        parts: [
          { text: prompt },
          { fileData: { mimeType: 'video/youtube', fileUri: url } }
        ]
      },
    });

    for await (const chunk of responseStream) {
      onStreamUpdate(chunk.text);
    }
    
  } catch (error) {
    console.error("Error summarizing video:", error);
    // Provide a more user-friendly error message
    if (error instanceof Error && error.message.includes('API_KEY')) {
        throw new Error('The API key is invalid or missing. Please check your configuration.');
    }
    throw new Error("Failed to generate summary. The video might be private, unavailable, or the content could not be processed.");
  }
};