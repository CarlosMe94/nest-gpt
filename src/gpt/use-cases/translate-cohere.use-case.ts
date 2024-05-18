interface Options {
  prompt: string;
  lang: string;
}

export const translateUseCaseCohere = async (
  cohere,
  { prompt, lang }: Options,
) => {
  const chatStream = await cohere.chatStream({
    chatHistory: [
      {
        role: 'SYSTEM',
        message:
          'Comportate como un traductor, te seran proveidas un texto con el idioma al que lo deberas traducir.',
      },
      {
        role: 'USER',
        message: 'Traduce el siguiente texto al aleman: Hola como estas?',
      },
      { role: 'CHATBOT', message: 'Hallo, wie geht es dir?' },
      {
        role: 'USER',
        message: 'Traduce el siguiente texto al italiano: Hola como estas?',
      },
      { role: 'CHATBOT', message: 'Come sono questi?' },
    ],
    message: `Traduce el siguiente texto al idioma ${lang}: ${prompt}`,
    // message: "Devuelve solo un objecto json que contenga la propiedad nombre y edad",
    // perform web search before answering the question. You can also use your own custom connector.
    connectors: [{ id: 'web-search' }],
    temperature: 0.2,

    // stream: true
  });

  for await (const message of chatStream) {
    // console.log(message);
    if (message.eventType === 'stream-end') {
      return { message: message.response.text };
    }
  }
};
