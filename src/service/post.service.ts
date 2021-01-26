import { PageRoot } from "../model/PageRoot";
import { Post } from "../model/Post";
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
                insertTimeBefore: number = -1, insertTimeAfter: number = -1, 
                pageSize:number = 10) {
    let url = "/text/" + type + "?pageSize="+pageSize
    if(insertTimeBefore !== -1){
      url += "&insertTimeBefore="+insertTimeBefore
    }
    if(insertTimeAfter !== -1){
      url += "&insertTimeAfter="+insertTimeAfter
    }
    url += (keyword?("&keyword="+keyword):"")
    const result = await get<PageRoot<Post>>(url)
    if (result.success) {
      const data = result.data as PageRoot<Post>
      const list = data.list as Post[]
      list.forEach(item => {
        item.isRead = item.readDate !== undefined;
        item.isFavorite = item.favoriteDate !== undefined;
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
