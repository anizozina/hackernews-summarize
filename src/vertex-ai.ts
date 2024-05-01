import {
  GenerativeModel,
  HarmBlockThreshold,
  HarmCategory,
  VertexAI,
} from '@google-cloud/vertexai';

export class VertexAIClient {
  private model: GenerativeModel;
  constructor(
    {
      project,
      location,
      textModel,
    }: {
      project: string;
      location: string;
      textModel: string;
    },
    options: {
      maxToken: number;
    } = { maxToken: 512 }
  ) {
    const vertexAI = new VertexAI({ project: project, location: location });

    const generativeModel = vertexAI.getGenerativeModel({
      model: textModel,
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
      generationConfig: { maxOutputTokens: options.maxToken },
    });
    this.model = generativeModel;
  }
  async generate(prompt: string) {
    const request = {
      contents: [
        {
          role: 'user',
          parts: [{text: prompt}],
        },
      ],
    };
    const streamingResult = await this.model.generateContentStream(request);
    for await (const item of streamingResult.stream) {
      console.log('stream chunk: ', JSON.stringify(item));
    }
    const aggregatedResponse = await streamingResult.response;
    const result =
      aggregatedResponse.candidates
        ?.map(({ content }) => content.parts.map((m) => m.text).join())
        .join() || '';
    return result;
  }
}
