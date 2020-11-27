export default interface RequestResult<T> {
    success : boolean;
    code? : number;
    data? : T;
}