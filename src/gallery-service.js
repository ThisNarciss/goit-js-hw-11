import axios from 'axios';

const API_KEY = '32144711-033503d2fc66376fdc1e9e47c';
const FETCH_URL = 'https://pixabay.com/api/';

export default class GalleryApiService {
  constructor() {
    this.query = '';
    this.page = 1;
  }

  async fetchArticles() {
    try {
      const response = await axios.get(FETCH_URL, {
        params: {
          key: API_KEY,
          q: this.query,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: true,
          page: this.page,
          per_page: 40,
        },
      });

      this.page += 1;
      return response;
    } catch (error) {}
  }

  get searchQuery() {
    return this.query;
  }

  set searchQuery(newQuery) {
    this.query = newQuery;
  }
}
