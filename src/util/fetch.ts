import config from "../config";

export async function fetchJson<T>(url: string, opts: RequestInit = {}) {
  try {
    const optsWithAuthHeaders: RequestInit = {
      ...opts,
      headers: {
        "Content-Type": "application/json",
        // "Access-Control-Allow-Origin": ""
        ...opts.headers,
      },
    };
    const response = await fetch(config.apiAddress + url, optsWithAuthHeaders)
      .then(function (response) {
        // console.log(response.json())
        return {
          success: true,
          data: (response.json() as unknown) as Promise<T>,
        };
      })
      .catch(function (error) {
        console.error(error);
        return {
          success: false,
          data: undefined,
          error,
        };
      });

    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
