import axios from 'axios';

const API_KEY = '50a519dff4234f45ae711671927cb913';
const BASE_URL = 'https://newsapi.org/v2';

export const getTrendingNews = async () => {
  const response = await axios.get(`${BASE_URL}/top-headlines`, {
    params: { country: 'us', apiKey: API_KEY },
  });
  return response.data.articles;
};

export const getNewsByCategory = async (category: string) => {
  const response = await axios.get(`${BASE_URL}/top-headlines`, {
    params: { category, country: 'us', apiKey: API_KEY },
  });
  return response.data.articles;
};
