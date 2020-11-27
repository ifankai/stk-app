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
    const result = await fetchJson<Post[]>("/text/" + type);
    if (result.success) {
      const data = result.data as Post[]
      data?.forEach(item => {
        item.isRead = item.readDate !== null;
        item.isFavorite = item.favoriteDate !== null;
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
