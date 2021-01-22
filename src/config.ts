console.log(process.env.REACT_APP_TEST)
// export const isDev: boolean = process.env.NODE_ENV === "development";
// console.log('env:',process.env.NODE_ENV); //这个值不能手动改变

//because there was a trailing space at the end of script. I used set REACT_APP_IS_DEV=true &&  then another command. Maybe it will help someone debugging because the trailing space didnt show in the console.log
// console.log("a"+process.env.REACT_APP_IS_DEV+"a")
export const isDev = process.env.REACT_APP_IS_DEV?.trim() === "true"
console.log('isDev:', isDev);

const common = {};

const development = {
  apiAddress: "http://localhost:8088",
  env: process.env.NODE_ENV || "development",
  ...common,
};

const production = {
  apiAddress: "http://81.68.255.181:8080",
  env: process.env.NODE_ENV || "production",
  ...common,
};


const Config = isDev ? development : production;

export default Config;
