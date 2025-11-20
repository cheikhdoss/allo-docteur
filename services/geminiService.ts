import { GoogleGenAI, Modality } from "@google/genai";

// Initialize the client
// Note: In a real production app, you should proxy this through a backend 
// to avoid exposing the API key, or require the user to input it.
const getAiClient = () => {
  const apiKey = process.env.API_KEY || (window as any).process?.env?.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY is missing. The AI features will act in simulation mode or fail.");
  }
  // If no key is found, the SDK might throw, so we handle that in the calling functions
  return new GoogleGenAI({ apiKey: apiKey || 'dummy-key' });
};

export const sendMessageToChatbot = async (history: { role: string, parts: { text: string }[] }[], message: string): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY || (window as any).process?.env?.API_KEY;
    if (!apiKey) {
        // Simulation fallback if no key provided
        await new Promise(resolve => setTimeout(resolve, 1000));
        return "Je suis en mode simulation (Pas de clé API détectée). Pour me connecter à Gemini, veuillez configurer la clé API. En attendant, je peux vous dire que je suis là pour vous aider !";
    }

    const ai = getAiClient();
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
    return "Une erreur technique est survenue. Veuillez réessayer plus tard.";
  }
};

export const editImageWithGemini = async (base64Image: string, prompt: string): Promise<string | null> => {
  // Image editing feature was removed from UI requirements but keeping service for compatibility
  return null;
};