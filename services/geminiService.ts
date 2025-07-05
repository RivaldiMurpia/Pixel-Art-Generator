
import { GoogleGenAI, GenerateImagesResponse } from "@google/genai";
import { ImageAsset, AnimationAsset } from '../types';

const BASE_STYLE_PROMPT = `16-bit retro style, vibrant colors, pixel art sprite for a video game. The object must be on a transparent background. --style pixelart --ar 1:1`;

interface GenerationConfig {
  apiKey: string;
  prompt: string;
  model: string;
  negativePrompt?: string;
  styleLockPrompt?: string;
  frameCount?: number;
}

const buildFullPrompt = (
    basePrompt: string, 
    negativePrompt?: string, 
    styleLockPrompt?: string
): string => {
    let parts: string[] = [];

    if (styleLockPrompt) {
        parts.push(`In the same artistic style as a "${styleLockPrompt}".`);
    }
    
    parts.push(basePrompt);

    if (negativePrompt) {
        parts.push(`AVOID the following elements: ${negativePrompt}.`);
    }

    parts.push(BASE_STYLE_PROMPT);

    return parts.join(' ');
}

const executeGeneration = async (
    apiKey: string,
    fullPrompt: string,
    model: string,
    imageCount: number
): Promise<string[]> => {
    if (!apiKey) {
        throw new Error("API Key is missing. Please provide a valid key.");
    }
    const ai = new GoogleGenAI({ apiKey });

    const response: GenerateImagesResponse = await ai.models.generateImages({
        model: model,
        prompt: fullPrompt,
        config: {
            numberOfImages: imageCount,
            outputMimeType: 'image/png'
        },
    });

    if (!response.generatedImages || response.generatedImages.length === 0) {
        throw new Error("The API did not return any images. Try a different prompt.");
    }

    return response.generatedImages.map((img, index) => {
        if (!img.image.imageBytes) {
            throw new Error(`Image data is missing for generated image #${index + 1}.`);
        }
        return `data:image/png;base64,${img.image.imageBytes}`;
    });
}

const handleApiError = (error: unknown, context: 'images' | 'animation'): Error => {
    console.error(`Error generating ${context}:`, error);
    if (error instanceof Error) {
        // Check for common user-facing errors first
        if (error.message.includes("API key not valid")) {
            return new Error("The provided API Key is not valid. Please check the key and try again.");
        }
        if (error.message.includes("429") || error.message.includes("RESOURCE_EXHAUSTED")) {
             return new Error("Rate limit exceeded. The API is busy. Please wait a moment before trying again.");
        }
        return new Error(`Failed to generate ${context}: ${error.message}`);
    }
    return new Error("An unknown error occurred while communicating with the Gemini API.");
}

export const generateStaticImages = async (config: GenerationConfig): Promise<ImageAsset[]> => {
    try {
        const fullPrompt = buildFullPrompt(`A single, centered object of a ${config.prompt}`, config.negativePrompt, config.styleLockPrompt);
        const base64Images = await executeGeneration(config.apiKey, fullPrompt, config.model, 4);

        return base64Images.map((base64, index) => ({
            id: `${Date.now()}-static-${index}`,
            base64,
            prompt: config.prompt,
        }));

    } catch (error: unknown) {
        throw handleApiError(error, 'images');
    }
};

export const generateAnimationFrames = async (config: GenerationConfig): Promise<AnimationAsset> => {
     try {
        const frameCount = config.frameCount || 4;
        const fullPrompt = buildFullPrompt(`${frameCount}-frame animation sprite sheet for a "${config.prompt}" action`, config.negativePrompt, config.styleLockPrompt);
        
        const allFrames: string[] = [];
        let framesRemaining = frameCount;
        const MAX_IMAGES_PER_REQUEST = 4;
        const REQUEST_DELAY_MS = 10000; // Increased delay to 10 seconds

        while (framesRemaining > 0) {
            const framesToGenerate = Math.min(framesRemaining, MAX_IMAGES_PER_REQUEST);
            
            const framesBatch = await executeGeneration(config.apiKey, fullPrompt, config.model, framesToGenerate);
            
            allFrames.push(...framesBatch);
            framesRemaining -= framesToGenerate;

            if (framesRemaining > 0) {
                await new Promise(resolve => setTimeout(resolve, REQUEST_DELAY_MS));
            }
        }

        return {
            id: `${Date.now()}-anim`,
            frames: allFrames.slice(0, frameCount),
            prompt: config.prompt,
        };

    } catch (error: unknown) {
        throw handleApiError(error, 'animation');
    }
};
