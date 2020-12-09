export interface PageRoot<T> {
    about: string;
    count: number;
    key: string;
    list: T[];
    perPage: number;
    maxPage: number;
    page: number;
}