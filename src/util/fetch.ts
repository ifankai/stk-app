import config from "../config";
import RequestResult from "../model/RequestResult";

export async function fetchJson<T>(
  url: string,
  opts: RequestInit = {}
): Promise<RequestResult<T>> {
  try {
    const optsWithAuthHeaders: RequestInit = {
      ...opts,
      headers: {
        "Content-Type": "application/json",
        // "Access-Control-Allow-Origin": ""
        ...opts.headers,
      },
    };
    console.log("fetch url:"+config.apiAddress)
    const response = await fetch(config.apiAddress + url, optsWithAuthHeaders)
      .then(function (response) {
        if (response.ok) {
          return (response.json() as unknown) as RequestResult<T>;
        } else {
          return {
            success: false,
            msg: "请求失败，状态码为：" + response.status,
          } as RequestResult<T>;
        }
      })
      .catch(function (error) {
        console.error(error);
        return {
          success: false,
          msg: error,
        } as RequestResult<T>;
      });

    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
