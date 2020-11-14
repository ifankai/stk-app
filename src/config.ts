export const isDev: boolean = process.env.NODE_ENV === "development";

console.log('env:',process.env.NODE_ENV);

const common = {};

const development = {
  apiAddress: "http://localhost:8080/api",
  env: process.env.NODE_ENV || "development",
  ...common,
};

const production = {
  apiAddress: "http://81.68.255.181:8080/api",
  env: process.env.NODE_ENV || "production",
  ...common,
};

const Config = false ? development : production;

export default Config;
