export interface Post {
    id: number;    
    text: string;
    createdAt: number;
    isRead?: boolean;
    isFavorite: boolean;
    userId: string;
    userName?: string;
    userAvatar: string;
}