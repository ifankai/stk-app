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
    return await fetchJson<Post[]>("/xq/post/" + type);
  }

  async setFavorite(postId: number, isFavorite : boolean) {
    return await fetchJson("/xq/favorite/" + postId + "/" + (isFavorite?1:0));
  }
  
}

const postService = PostService.getInstance();
export default postService;
