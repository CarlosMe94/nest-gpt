import OpenAI from 'openai';
interface Options {
  prompt: string;
}

export const orthographyCheckUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { prompt } = options;

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `Te seran proveidos textos en español con posibles errores ortograficos y gramatiicales,
        Las palabras usadas deben de existir en el diccionario de la Real Academia Española,
        Debes responder en forma JSON,
        tu tares es corregirlos y retornar informacion soluciones,
        tambien debes de dar un porcentaje de acierto por el usuario,
        
        Si no hay errores, debes de retornar un mensaje de felicitaciones.
        

        Ejemplo de salida: {
          userScore:number,
          errors: string[], // ['error -> solucion'],
          message:string, // Usa emojis y texto para felicitar al usuario
        }
        `,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    model: 'gpt-3.5-turbo-0125',
    temperature: 0.3,
    max_tokens: 150,
    response_format: {
      type: 'json_object',
    },
  });

  // console.log(completion);

  const jsonResp = JSON.parse(completion.choices[0].message.content);

  return jsonResp;
};
