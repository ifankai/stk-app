export interface Post {
    id: number;
    userId: string;
    text: string;
    date: number;
    readed?: boolean;
    isFavorite: boolean;
}