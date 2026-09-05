// Gateways can return HTML, plain text, or an empty body when the API fails.
// Keep the HTTP failure useful without exposing markup or a JSON parser error.
export async function readApiResponse<T>(response: Response): Promise<T> {
  const body = await response.text();
  let data: any;
  try {
    data = JSON.parse(body);
  } catch {
    if (response.ok) {
      throw new Error('The service returned an invalid response. Please try again.');
    }
  }

  if (!response.ok) {
    const detail = data?.error?.detail;
    const message = data?.error?.message;
    if (typeof detail === 'string' && detail.trim()) throw new Error(detail);
    if (typeof message === 'string' && message.trim()) throw new Error(message);

    if (response.status === 429) {
      throw new Error('Too many requests. Please wait a moment and try again.');
    }
    throw new Error(`The request failed (HTTP ${response.status}). Please try again.`);
  }

  return data as T;
}
