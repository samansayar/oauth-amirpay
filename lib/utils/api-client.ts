export class ApiClient {
  private static baseUrl = process.env.ZIBAL_API_URL || 'https://api.zibal.ir/v1';
  private static merchant = process.env.ZIBAL_MERCHANT || '';

  static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    console.log('merchant', this.merchant);
    const url = `${this.baseUrl}${endpoint}`;
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer 78bbd83e54534e378dc555605b97c79e`,
    });

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          message: data.message || 'خطای سرور',
          status: response.status,
          code: data.errorCode,
        };
      }
      return data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'status' in error) {
        throw error;
      }
      throw {
        message: error instanceof Error ? error.message : 'خطای شبکه',
        status: 500,
        code: 'NETWORK_ERROR'
      };
    }
  }
} 