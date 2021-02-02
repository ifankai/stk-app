import { StockModel } from "./StockModel";

export interface Post {
    _type: string; //post
    id: number;    //textId
    code: string;
    title: string;
    desc: string;
    content: string;
    insertTime: number;
    updateTime: number;


    postId: number;
    createdAt: number;
    replyCount: number;
    followersCount: number;
    readDate: number;
    favoriteDate: number;
    userId: number;
    userName?: string;
    userAvatar: string;   
    
    isRead: boolean;
    isFavorite: boolean;

    stock: StockModel;
}