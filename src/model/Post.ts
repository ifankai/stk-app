export interface Post {
    id: number;    //textId
    postId: number;
    code: string;
    title: string;
    text: string;
    textDesc: string;
    createdAt: number;
    replyCount: number;
    followersCount: number;
    insertTime: number;
    readDate: number;
    favoriteDate: number;
    userId: string;
    userName?: string;
    userAvatar: string;   
    
    isRead: boolean;
    isFavorite: boolean;
}