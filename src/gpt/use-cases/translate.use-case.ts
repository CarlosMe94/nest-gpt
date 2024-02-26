import OpenAI from 'openai';
interface Options {
  prompt: string;
  lang: string;
}

export const translateUseCase = async (
  openai: OpenAI,
  { prompt, lang }: Options,
) => {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `Traduce el siguiente texto al idioma ${lang}:${prompt}`,
      },
    ],
    model: 'gpt-3.5-turbo-0125',
    temperature: 0.2,
    // max_tokens: 150,
    // response_format: {
    //   type: 'json_object',
    // },
  });

  // console.log(completion);

  return { message: completion.choices[0].message.content };
};
