import RequestResult from "../model/RequestResult";
import { fetchJson } from "../util/fetch";

class SearchService {
  private static instance: SearchService;

  private constructor() {
    // Private constructor, singleton
  }

  static getInstance() {
    if (!SearchService.instance) {
      SearchService.instance = new SearchService();
    }
    return SearchService.instance;
  }

  async getSearchResult(query: string): Promise<RequestResult<[] | string>> {
    return fetchJson("/search/" + query);
  }
}
const searchService = SearchService.getInstance();
export default searchService;
