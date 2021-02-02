import { Post } from "./Post";
import { StockModel } from "./StockModel";

export interface EsDocument {
  type: string; //post, stock, industry
  id: number;
  code: string;
  title: string;
  desc: string;
  content: string;
  insertTime: number;
  updateTime: number;

  post: Post;
  stock: StockModel;
}
