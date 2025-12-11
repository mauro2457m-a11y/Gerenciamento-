import { GoogleGenAI, Type, Schema } from "@google/genai";
import { SocialPlatform, PostTone, GeneratedContent } from '../types';

// The API key must be obtained exclusively from the environment variable process.env.API_KEY.
const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  // Assume this variable is pre-configured, valid, and accessible.
  // Using fallback to empty string just to satisfy type checker if environment is not set up in dev.
  return new GoogleGenAI({ apiKey: apiKey || '' });
};

export const generatePostText = async (
  topic: string,
  platform: SocialPlatform,
  tone: PostTone,
  includeEmoji: boolean
): Promise<GeneratedContent> => {
  const modelId = 'gemini-2.5-flash';
  const ai = getAIClient();

  const prompt = `
    Atue como um gerente de mídia social especialista.
    Crie um post para a rede social: ${platform}.
    Tópico: "${topic}".
    Tom de voz: ${tone}.
    ${includeEmoji ? 'Use emojis apropriados.' : 'Não use emojis.'}
    
    A resposta deve ser um objeto JSON com:
    - "text": O conteúdo principal do post.
    - "hashtags": Uma lista de 5-10 hashtags relevantes.
    - "imagePrompt": Uma descrição curta e visualmente rica em inglês para gerar uma imagem que acompanhe este post.
  `;

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      text: { type: Type.STRING },
      hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
      imagePrompt: { type: Type.STRING }
    },
    required: ["text", "hashtags", "imagePrompt"]
  };

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as GeneratedContent;
    }
    throw new Error("Resposta vazia do modelo.");
  } catch (error) {
    console.error("Erro ao gerar texto:", error);
    throw error;
  }
};

export const generatePostImage = async (imagePrompt: string): Promise<string> => {
  const modelId = 'gemini-2.5-flash-image';
  const ai = getAIClient();

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: imagePrompt,
      config: {
        // Nano banana models do not support responseMimeType or schemas
      }
    });

    // Extract image from parts
    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
           return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    throw new Error("Nenhuma imagem gerada encontrada na resposta.");
  } catch (error) {
    console.error("Erro ao gerar imagem:", error);
    throw error;
  }
};

export const analyzeTrends = async (recentPosts: string[]): Promise<string> => {
    const modelId = 'gemini-2.5-flash';
    const ai = getAIClient();
    
    const prompt = `
      Analise os seguintes temas de posts recentes e sugira 3 novas ideias de conteúdo que complementem esta estratégia e aumentem o engajamento.
      Seja conciso. Responda em texto simples formatado com bullet points.
      
      Posts Recentes:
      ${recentPosts.join('\n- ')}
    `;

    try {
        const response = await ai.models.generateContent({
            model: modelId,
            contents: prompt
        });
        return response.text || "Não foi possível analisar as tendências no momento.";
    } catch (error) {
        console.error(error);
        return "Erro ao analisar tendências.";
    }
}