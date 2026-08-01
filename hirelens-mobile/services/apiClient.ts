import { Platform } from 'react-native';

const getApiBaseUrl = (): string => {
  if (process.env.EXPO_PUBLIC_API_BASE_URL) {
    return process.env.EXPO_PUBLIC_API_BASE_URL;
  }
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // On Vercel public web deployment, use relative URL (same domain)
    if (hostname.includes('vercel.app')) {
      return '/api/v1';
    }
    return 'http://localhost:8080/api/v1';
  }
  return 'http://192.168.1.5:8080/api/v1';
};

export class ApiClient {
  public static async get<T>(path: string): Promise<T> {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}${path}`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error?.message || 'API request failed.');
    }
    return data as T;
  }

  public static async post<T>(path: string, body: any, headers: Record<string, string> = {}): Promise<T> {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...headers,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error?.message || 'API request failed.');
    }
    return data as T;
  }

  public static async uploadFile<T>(
    path: string,
    fileUri: string,
    fileName: string,
    mimeType: string,
    sessionId?: string,
    fileObj?: any
  ): Promise<T> {
    const formData = new FormData();

    if (Platform.OS === 'web') {
      if (fileObj) {
        formData.append('file', fileObj, fileName);
      } else if (fileUri.startsWith('blob:') || fileUri.startsWith('data:')) {
        const response = await fetch(fileUri);
        const blob = await response.blob();
        formData.append('file', blob, fileName);
      } else {
        formData.append('file', {
          uri: fileUri,
          name: fileName,
          type: mimeType,
        } as any);
      }
    } else {
      formData.append('file', {
        uri: fileUri,
        name: fileName,
        type: mimeType,
      } as any);
    }

    const headers: Record<string, string> = {};
    if (sessionId) {
      headers['x-session-id'] = sessionId;
    }

    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}${path}`, {
      method: 'POST',
      headers,
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error?.message || 'File upload failed.');
    }
    return data as T;
  }
}
