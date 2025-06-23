interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: any;
  cache?: boolean;
  timeout?: number;
  retries?: number;
}

interface CachedResponse {
  data: any;
  timestamp: number;
  ttl: number;
}

class APIClient {
  private baseURL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:4002/api";
  private cache: Map<string, CachedResponse> = new Map();
  private defaultTimeout = 10000; // 10 seconds
  private defaultCacheTTL = 5 * 60 * 1000; // 5 minutes

  constructor() {
    // Clean cache periodically
    setInterval(() => this.cleanCache(), 60000);
  }

  private cleanCache() {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > value.ttl) {
        this.cache.delete(key);
      }
    }
  }

  private getCacheKey(url: string, options: RequestOptions): string {
    return `${options.method || "GET"}_${url}_${JSON.stringify(options.body || {})}`;
  }

  private getFromCache(cacheKey: string): any | null {
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      console.log("📋 API Cache hit:", cacheKey);
      return cached.data;
    }
    return null;
  }

  private setCache(
    cacheKey: string,
    data: any,
    ttl: number = this.defaultCacheTTL
  ) {
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  private async fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeout: number
  ) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  private async retryRequest(
    url: string,
    options: RequestInit,
    retries: number,
    timeout: number
  ): Promise<Response> {
    for (let i = 0; i <= retries; i++) {
      try {
        const response = await this.fetchWithTimeout(url, options, timeout);

        // Don't retry on 4xx errors (client errors)
        if (response.status >= 400 && response.status < 500) {
          return response;
        }

        // Retry on 5xx errors (server errors) or network errors
        if (response.ok || i === retries) {
          return response;
        }

        console.warn(
          `⚠️ API Request failed (attempt ${i + 1}/${retries + 1}):`,
          response.status
        );

        // Exponential backoff
        const delay = Math.min(1000 * Math.pow(2, i), 5000);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } catch (error) {
        if (i === retries) {
          throw error;
        }
        console.warn(
          `⚠️ API Request error (attempt ${i + 1}/${retries + 1}):`,
          error
        );

        // Exponential backoff
        const delay = Math.min(1000 * Math.pow(2, i), 5000);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw new Error("Max retries exceeded");
  }

  async request<T = any>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const {
      method = "GET",
      headers = {},
      body,
      cache = method === "GET",
      timeout = this.defaultTimeout,
      retries = 2,
    } = options;

    const url = `${this.baseURL}${endpoint}`;
    const cacheKey = this.getCacheKey(endpoint, options);

    // Check cache for GET requests
    if (cache && method === "GET") {
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return cached;
      }
    }

    // Get token from auth store
    let token: string | null = null;
    try {
      if (typeof window !== "undefined") {
        const authData = localStorage.getItem("auth-store");
        if (authData) {
          const parsed = JSON.parse(authData);
          token = parsed.state?.token;
        }
      }
    } catch (error) {
      console.warn("⚠️ Failed to get auth token:", error);
    }

    const requestHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...headers,
    };

    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`;
    }

    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
    };

    if (body && method !== "GET") {
      requestOptions.body = JSON.stringify(body);
    }

    console.log(`🌐 API Request: ${method} ${endpoint}`);
    const startTime = Date.now();

    try {
      const response = await this.retryRequest(
        url,
        requestOptions,
        retries,
        timeout
      );
      const duration = Date.now() - startTime;

      console.log(
        `✅ API Response: ${method} ${endpoint} (${response.status}) - ${duration}ms`
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Unknown error" }));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();

      // Cache successful GET responses
      if (cache && method === "GET" && response.ok) {
        this.setCache(cacheKey, data);
      }

      return data;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(
        `❌ API Error: ${method} ${endpoint} - ${duration}ms`,
        error
      );
      throw error;
    }
  }

  // Convenience methods
  get<T = any>(endpoint: string, options?: Omit<RequestOptions, "method">) {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  post<T = any>(
    endpoint: string,
    body?: any,
    options?: Omit<RequestOptions, "method" | "body">
  ) {
    return this.request<T>(endpoint, { ...options, method: "POST", body });
  }

  put<T = any>(
    endpoint: string,
    body?: any,
    options?: Omit<RequestOptions, "method" | "body">
  ) {
    return this.request<T>(endpoint, { ...options, method: "PUT", body });
  }

  delete<T = any>(endpoint: string, options?: Omit<RequestOptions, "method">) {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
    console.log("🧹 API Cache cleared");
  }

  // Get cache stats
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Create singleton instance
const apiClient = new APIClient();

export default apiClient;
