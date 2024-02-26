import OpenAI from 'openai';

interface Options {
  threadId: string;
  assistantId?: string;
}

export const createRunUseCase = async (openai: OpenAI, options: Options) => {
  const { threadId, assistantId = 'asst_Z7ZdVkECjp9LO34Uyx8YkDDQ' } = options;

  const run = await openai.beta.threads.runs.create(threadId, {
    assistant_id: assistantId,
    // instructions: OJO  ESTO SOBREESCRIBE EL ASISTANTE
  });

  console.log({ run });
  return run;
};
