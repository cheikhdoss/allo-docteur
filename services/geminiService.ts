
import { GoogleGenAI, Modality } from "@google/genai";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing in process.env");
    throw new Error("API Key missing");
  }
  return new GoogleGenAI({ apiKey });
};

export const sendMessageToChatbot = async (history: { role: string, parts: { text: string }[] }[], message: string): Promise<string> => {
  try {
    const ai = getAiClient();
    // Using Gemini 3 Pro as requested for the chatbot
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      history: history,
      config: {
        systemInstruction: "Tu es un assistant médical virtuel utile et empathique pour la plateforme Allo Docteur au Sénégal. Tu aides les utilisateurs à trouver des médecins à Dakar et dans les régions, à naviguer sur le site de prise de rendez-vous, et à comprendre des termes médicaux simples. Tu ne donnes pas de conseils médicaux critiques ou de diagnostics. Réponds toujours en français.",
      }
    });

    const result = await chat.sendMessage({ message });
    return result.text || "Désolé, je n'ai pas pu générer de réponse.";
  } catch (error) {
    console.error("Error sending message to chatbot:", error);
    return "Une erreur est survenue lors de la communication avec l'IA.";
  }
};

export const editImageWithGemini = async (base64Image: string, prompt: string): Promise<string | null> => {
  try {
    const ai = getAiClient();
    // Using Gemini 2.5 Flash Image (Nano banana) as requested for image editing
    // The model expects a specific modality config for image output
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: 'image/png', // Assuming PNG or standardized before sending, or dynamic
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    // Extract the image from the response
    const parts = response.candidates?.[0]?.content?.parts;
    if (parts && parts.length > 0) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          return part.inlineData.data;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Error editing image:", error);
    throw error;
  }
};
