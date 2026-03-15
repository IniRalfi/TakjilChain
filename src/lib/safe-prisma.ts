export async function withSafePrisma<T>(
  fn: () => Promise<T>,
  retries: number = 2,
  delayMs: number = 300,
): Promise<T> {
  let lastError: any;

  for (let i = 0; i <= retries; i++) {
    try {
      // Small tactical delay if it's a retry
      if (i > 0) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * i));
        console.log(`🔄 [SAFE-PRISMA] Retry attempt ${i}...`);
      }

      return await fn();
    } catch (error: any) {
      lastError = error;

      // Check if it's a transient connection error
      const isTransient =
        error.message?.includes("ETIMEDOUT") ||
        error.message?.includes("connection") ||
        error.message?.includes("invocation");

      if (!isTransient || i === retries) {
        throw error;
      }
    }
  }

  throw lastError;
}
