import RequestResult from "../model/RequestResult";
import { get } from "../util/fetch";

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

  async getSearchResult(query: string, other: string = '', page: number = 1): Promise<RequestResult<[] | string>> {
    return await get("/search/" + query + "/"+page + (other===''?'':"?"+other));
  }

}
const searchService = SearchService.getInstance();
export default searchService;
