import { exit } from 'process';
import { getRatedArticles } from './hackernews';
import { SlackClient } from './slack';
import { VertexAIClient } from './vertex-ai';

const project = process.env.GC_PROJECT_ID ?? '';
const location = process.env.GC_LOCATION ?? 'asia-northeast1';
const textModel = process.env.GC_VERTEX_MODEL ?? 'gemini-1.0-pro';
const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL ?? '';

if (!project || !slackWebhookUrl) {
  console.error(`missing required field. check your .env`);
  exit(1);
}

async function generateContent(client: VertexAIClient, url: string) {
  return client.generate(`以下に指定するURLを読み込んで、サマリーを作成してください。
  URL: ${url}
  
  なお、サマリーは以下の指定した形式で記載してください。
  - 列挙する際は * の代わりに • を使用
  - タイトルの日本語訳、要約の順に記載
  - 要約は箇条書きで記載`);
}

(async () => {
  const client = new VertexAIClient({
    project,
    location,
    textModel,
  });
  const slackClient = new SlackClient(slackWebhookUrl);
  const ratedArticles = await getRatedArticles(3);
  for (const article of ratedArticles) {
    const message = await generateContent(client, article.url);
    await slackClient.sendMessage(
      `🗞️ Title: ${article.title}
🗓️ Date: ${new Date(article.time).toISOString()}
💯 Score: ${article.score}
🔗 URL: ${article.url}`,
      `📰 Hackernews Summary! 📰

\`\`\`
${message}
\`\`\`
`
    );
  }
})();
