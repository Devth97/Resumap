import { Platform } from 'react-native';

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  (Platform.OS === 'web' ? 'http://localhost:8080/api/v1' : 'http://192.168.1.5:8080/api/v1');

export class ApiClient {
  public static async get<T>(path: string): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${path}`, {
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
    const res = await fetch(`${API_BASE_URL}${path}`, {
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

    const res = await fetch(`${API_BASE_URL}${path}`, {
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
