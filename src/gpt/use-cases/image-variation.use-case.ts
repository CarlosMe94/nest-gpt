import OpenAI from 'openai';
import { downloadImageAsPng } from 'src/helpers';
import * as fs from 'fs';

interface Options {
  baseImage: string;
}

export const imageVariationUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { baseImage } = options;

  const pngImageFullPath = await downloadImageAsPng(baseImage, true);

  const response = await openai.images.createVariation({
    model: 'dall-e-2',
    image: fs.createReadStream(pngImageFullPath),
    n: 1,
    size: '256x256',
    response_format: 'url',
  });

  const filename = await downloadImageAsPng(response.data[0].url);

  const publicUrl = `${process.env.SERVER_URL}/gpt/image-generation/${filename}`;

  return {
    url: publicUrl, // Todo: localhost:3000/gpt...
    openAIUrl: response.data[0].url,
    revised_prompt: response.data[0].revised_prompt,
  };
};
