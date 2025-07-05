
export interface ImageAsset {
  id: string;
  base64: string;
  prompt: string;
}

export interface AnimationAsset {
  id: string;
  frames: string[]; // Array of base64 strings
  prompt: string;
}

export type Asset = ImageAsset | AnimationAsset;
