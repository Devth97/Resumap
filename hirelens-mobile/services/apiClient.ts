import { Platform } from 'react-native';
import { readApiResponse } from './apiResponse';

const getApiBaseUrl = (): string => {
  if (process.env.EXPO_PUBLIC_API_BASE_URL) {
    return process.env.EXPO_PUBLIC_API_BASE_URL;
  }
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // Only local web development uses the separate development server.
    // Hosted sites, including custom domains, use Vercel's same-origin API route.
    if (['localhost', '127.0.0.1', '[::1]', '::1'].includes(hostname)) {
      return 'http://localhost:8080/api/v1';
    }
    return '/api/v1';
  }
  // Native builds (Android/iOS): default to the live production API. For local
  // native dev against your machine, set EXPO_PUBLIC_API_BASE_URL instead.
  return 'https://resumap-tjv1.vercel.app/api/v1';
};

export class ApiClient {
  public static async get<T>(path: string): Promise<T> {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}${path}`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    return readApiResponse<T>(res);
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

    return readApiResponse<T>(res);
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

    return readApiResponse<T>(res);
  }
}
