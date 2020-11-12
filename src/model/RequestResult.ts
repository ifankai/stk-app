export default interface RequestResult<T> {
    success : boolean;
    msg? : string;
    code? : number;
    data? : T;
}