export interface Post {
    id: number;
    userId: string;
    userName?: string;
    text: string;
    createdAt: number;
    isRead?: boolean;
    isFavorite: boolean;
}