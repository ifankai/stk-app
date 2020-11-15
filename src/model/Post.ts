export interface Post {
    id: number;    
    text: string;
    createdAt: number;
    replyCount: number;
    followersCount: number;
    insertDate: number;
    isRead?: boolean;
    isFavorite: boolean;
    userId: string;
    userName?: string;
    userAvatar: string;    
}