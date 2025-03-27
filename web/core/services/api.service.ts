export abstract class APIService {
  protected baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      if (response.status === 401) {
        // unauthorized errors
        const currentPath = window.location.pathname;
        window.location.replace(`/${currentPath ? `?next_path=${currentPath}` : ``}`);
      }
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json(); // auto parse json response
  }

  async get(url: string, params: Record<string, any> = {}, config: RequestInit = {}) {
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = `${this.baseURL}${url}${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(fullUrl, {
      ...config,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...config.headers,
      },
      credentials: "include",
    });

    return this.handleResponse(response);
  }

  async post(url: string, data: any = {}, config: RequestInit = {}) {
    const response = await fetch(`${this.baseURL}${url}`, {
      ...config,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...config.headers,
      },
      body: JSON.stringify(data),
      credentials: "include",
    });

    return this.handleResponse(response);
  }

  async put(url: string, data: any = {}, config: RequestInit = {}) {
    const response = await fetch(`${this.baseURL}${url}`, {
      ...config,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...config.headers,
      },
      body: JSON.stringify(data),
      credentials: "include",
    });

    return this.handleResponse(response);
  }

  async patch(url: string, data: any = {}, config: RequestInit = {}) {
    const response = await fetch(`${this.baseURL}${url}`, {
      ...config,
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...config.headers,
      },
      body: JSON.stringify(data),
      credentials: "include",
    });

    return this.handleResponse(response);
  }

  async delete(url: string, data?: any, config: RequestInit = {}) {
    const response = await fetch(`${this.baseURL}${url}`, {
      ...config,
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...config.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });

    return this.handleResponse(response);
  }
}
