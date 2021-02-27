import RequestResult from "../model/RequestResult";
import { StockModel } from "../model/StockModel";
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

  async getStockInfo(code: string): Promise<RequestResult<[StockModel] | string>> {
    return await get("/stock/info/" + code);
  }
}
const stockService = StockService.getInstance();
export default stockService;
