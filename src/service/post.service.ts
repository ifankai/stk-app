import { PageRoot } from "../model/PageRoot";
import { EsDocument } from "../model/SearchResult";
import { get } from "../util/fetch";

class PostService {
  private static instance: PostService;

  private constructor() {
    // Private constructor, singleton
  }

  static getInstance() {
    if (!PostService.instance) {
      PostService.instance = new PostService();
    }
    return PostService.instance;
  }

  async getPost(type: string = "", keyword: any = undefined, 
                idBefore: number = -1, idAfter: number = -1, 
                pageSize:number = 10) {
    let url = "/text/" + type + "?pageSize="+pageSize
    if(idBefore !== -1){
      url += "&idBefore="+idBefore
    }
    if(idAfter !== -1){
      url += "&idAfter="+idAfter
    }
    url += (keyword?("&keyword="+keyword):"")
    const result = await get<PageRoot<EsDocument>>(url)
    if (result.success) {
      const data = result.data as PageRoot<EsDocument>
      const list = data.list as EsDocument[]
      list.forEach(item => {

      })
    }
    return result
  }

  async setFavorite(textId: number, isFavorite : boolean) {
    return await get("/text/favorite/" + textId + "/" + (isFavorite?1:0));
  }
  
}

const postService = PostService.getInstance();
export default postService;
