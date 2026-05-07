import { MonoTypeOperatorFunction, retry, timer } from 'rxjs';

export function retryBackoff<T>(options?: {
  maxRetries?: number;
  initialDelayMs?: number;
}): MonoTypeOperatorFunction<T> {
  const maxRetries = options?.maxRetries ?? 2;
  const initialDelayMs = options?.initialDelayMs ?? 400;

  return retry({
    count: maxRetries,
    delay: (_, retryIndex) => timer(initialDelayMs * Math.pow(2, retryIndex))
  });
}

