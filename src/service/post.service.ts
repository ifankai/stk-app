import { PageRoot } from "../model/PageRoot";
import { Post } from "../model/Post";
import { fetchJson } from "../util/fetch";

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

  async getPost(type: string = "") {
    const result = await fetchJson<PageRoot<Post>>("/text/" + type + "?createdAtAfter="+ (new Date().getTime() - 1000*60*60*24));
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
    return await fetchJson("/text/favorite/" + textId + "/" + (isFavorite?1:0));
  }
  
}

const postService = PostService.getInstance();
export default postService;
