import config from "../config";
import RequestResult from "../model/RequestResult";

export async function fetchJson<T>(
  url: string,
  opts: RequestInit = {}
): Promise<RequestResult<T | string>> {
  try {
    const optsWithAuthHeaders: RequestInit = {
      ...opts,
      headers: {
        "Content-Type": "application/json",
        // "Access-Control-Allow-Origin": ""
        ...opts.headers,
      },
    };
    console.log("fetch url:"+config.apiAddress + url)
    const response = await fetch(config.apiAddress + url, optsWithAuthHeaders)
      .then(function (response) {
        if (response.ok) {
          return (response.json() as unknown) as RequestResult<T>;
        } else {
          return {
            success: false,
            data: "请求失败，状态码为：" + response.status,
          } as RequestResult<string>;
        }
      })
      .catch(function (error) {
        console.error(error);
        return {
          success: false,
          data: error,
        } as RequestResult<T>;
      });

    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
