import RequestResult from "../model/RequestResult";
import { StockInfo } from "../model/StockInfo";
import { get } from "../util/fetch";

class StockService {
  private static instance: StockService;

  private constructor() {
    // Private constructor, singleton
  }

  static getInstance() {
    if (!StockService.instance) {
        StockService.instance = new StockService();
    }
    return StockService.instance;
  }

  async getStockInfo(code: string): Promise<RequestResult<[StockInfo] | string>> {
    return await get("/stock/" + code + "/info");
  }
}
const stockService = StockService.getInstance();
export default stockService;