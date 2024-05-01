import axios from 'axios';

type ArticleResponse = {
  by: string;
  descendants: number;
  id: number;
  kids: number[];
  score: number;
  title: string;
  time: number;
  type: 'story';
  url: string;
};

const baseUrl = 'https://hacker-news.firebaseio.com/v0';
const instance = axios.create({ baseURL: baseUrl });
export const getRatedArticles = async (count: number) => {
  const ids = await getRatedStoryIds(count);
  const stories = await Promise.all(
    ids.map(async (id) => {
      const url = `${baseUrl}/item/${id}.json?print=pretty`;
      const articleResponse = await instance.get<ArticleResponse>(url);
      return articleResponse.data
    })
  );
  return stories;
};
const getRatedStoryIds = async (count: number) => {
  const url = `${baseUrl}/beststories.json?print=pretty`;
  const bestStoriesResponse = await instance.get<string[]>(url);
  const bestStoryIds = bestStoriesResponse.data;
  console.log(`There is ${bestStoryIds.length} stories.`)
  return bestStoryIds.slice(0, count);
};
