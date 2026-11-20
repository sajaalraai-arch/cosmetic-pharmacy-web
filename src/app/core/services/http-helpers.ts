import { HttpErrorResponse } from '@angular/common/http';


export function extractError(err: unknown, fallback = 'Unexpected error, please try again.'): string {
  if (!(err instanceof HttpErrorResponse)) return fallback;

  const body: any = err.error;
  if (!body) return err.status === 0 ? 'Cannot connect to the server.' : fallback;
  if (typeof body === 'string') return body;
  if (body.message) return body.message;

  if (body.errors) {
    const first = Object.values(body.errors as Record<string, string[]>)[0];
    if (Array.isArray(first) && first.length) return first[0];
  }
  return body.title || fallback;
}
