import RequestResult from "../model/RequestResult";
import { get } from "../util/fetch";

class DictService {
    private static instance: DictService;
  
    private constructor() {
      // Private constructor, singleton
    }
  
    static getInstance() {
      if (!DictService.instance) {
        DictService.instance = new DictService();
      }
      return DictService.instance;
    }

    async getDict(type: number) : Promise<RequestResult<[] | string>> {
      return get("/dict/" + type);
    }

}
const dictService = DictService.getInstance();
export default dictService;