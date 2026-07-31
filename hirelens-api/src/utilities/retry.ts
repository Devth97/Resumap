export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries: number = 2,
  delayMs: number = 2000
): Promise<T> {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (error) {
      attempt++;
      if (attempt > retries) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs * Math.pow(2, attempt - 1)));
    }
  }
}
