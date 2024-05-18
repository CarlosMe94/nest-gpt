import * as path from 'path';
import * as fs from 'fs';
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  audioToText,
  imageGenerationUseCase,
  imageVariationUseCase,
  orthographyCheckUseCase,
  prosConsDicusserStreamUseCase,
  textToAudioUseCase,
  translateUseCase,
} from './use-cases';
import {
  AudioToTextDto,
  ImageGenerationDto,
  ImageVariationDto,
  OrthographyDto,
  ProsConsDiscusserDto,
  TextToAudioDto,
  TranslateDto,
} from './dtos';
import OpenAI from 'openai';
import { prosConsDicusserUseCase } from './use-cases/proConsDiscusser.use-case';
import { CohereClient } from 'cohere-ai';
import { translateUseCaseCohere } from './use-cases/translate-cohere.use-case';

@Injectable()
export class GptService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  private cohere = new CohereClient({
    token: 'AVFAU97iyyrqhroATDCMx2oVPBdJUf39lCYbYWki',
  });
  // Llamar casos de uso
  async ortographyCheck(orthographyDto: OrthographyDto) {
    return await orthographyCheckUseCase(this.openai, {
      prompt: orthographyDto.prompt,
    });
  }

  async prosConsDicusser({ prompt }: ProsConsDiscusserDto) {
    return await prosConsDicusserUseCase(this.openai, { prompt });
  }

  async prosConsDicusserStream({ prompt }: ProsConsDiscusserDto) {
    return await prosConsDicusserStreamUseCase(this.openai, { prompt });
  }

  async translate({ prompt, lang }: TranslateDto) {
    return await translateUseCase(this.openai, { prompt, lang });
  }

  async textToAudio({ prompt, voice }: TextToAudioDto) {
    return await textToAudioUseCase(this.openai, { prompt, voice });
  }

  async textToAudioGetter(fileId: string) {
    const filePath = path.resolve(
      __dirname,
      '../../generated/USERID/audios/',
      `${fileId}.mp3`,
    );

    const wasFound = fs.existsSync(filePath);
    if (!wasFound) {
      throw new NotFoundException(`file ${fileId} not found`);
    }

    return filePath;
  }

  async audioToText(
    audioFile: Express.Multer.File,
    audioToTextDto: AudioToTextDto,
  ) {
    const { prompt } = audioToTextDto;
    return await audioToText(this.openai, { audioFile, prompt });
  }

  async imageGeneration(imageGenerationDto: ImageGenerationDto) {
    return await imageGenerationUseCase(this.openai, { ...imageGenerationDto });
  }

  async imageGetter(filename: string) {
    const filePath = path.resolve('./', './generated/images/', filename);

    const wasFound = fs.existsSync(filePath);
    if (!wasFound) {
      throw new NotFoundException(`file ${filename} not found`);
    }

    return filePath;
  }

  async imageVariation({ baseImage }: ImageVariationDto) {
    return await imageVariationUseCase(this.openai, { baseImage });
  }

  async translateCohere({ prompt, lang }: TranslateDto) {
    return await translateUseCaseCohere(this.cohere, { prompt, lang });
  }
}
