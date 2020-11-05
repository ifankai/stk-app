
export async function fetchJson(url : string, opts : RequestInit = {}) {
    try {
      const optsWithAuthHeaders : RequestInit = {
        ...opts,
        headers: {
          "Content-Type": "application/json",
          ...opts.headers,
        },
      };
      let response = await fetch(url, optsWithAuthHeaders)
        .then(function(response) {
          return {
            success: true,
            response: response.json()
          };
        })
        .catch(function(error) {
          return {
            success: false,
            error
          };
        });

      return response;
      
    } catch (error) {
      console.error(error);
      throw error
    }
  }
