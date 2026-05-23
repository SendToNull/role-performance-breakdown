import { RateLimitedQueue } from "../util/rateLimit.js";

export class WCLApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly url: string,
    public readonly body?: string,
  ) {
    super(message);
    this.name = "WCLApiError";
  }
}

export interface WCLClientOptions {
  /** WCL v1 API key. Per-user; never logged. */
  apiKey: string;
  /** Optional fetch override (for tests / node-only envs without global fetch). */
  fetchFn?: typeof fetch;
  /** Concurrency cap. WCL is generous for subs; 8 is a safe default. */
  concurrency?: number;
  /** Optional progress reporter for the UI. */
  onProgress?: (event: ProgressEvent) => void;
}

export interface ProgressEvent {
  type: "request:start" | "request:done" | "request:error";
  url: string;
  /** Strip the api_key query param before display. */
  displayUrl: string;
  status?: number;
  attempt: number;
  inFlight: number;
  totalCompleted: number;
}

export class WCLClient {
  private readonly queue: RateLimitedQueue;
  private readonly fetchFn: typeof fetch;
  private totalCompleted = 0;
  private inFlight = 0;

  constructor(private readonly opts: WCLClientOptions) {
    if (!opts.apiKey) throw new Error("WCL API key is required");
    this.queue = new RateLimitedQueue({ concurrency: opts.concurrency ?? 8 });
    this.fetchFn = opts.fetchFn ?? globalThis.fetch.bind(globalThis);
  }

  /** GET a v1 JSON endpoint, with retry on 429 / 5xx. */
  async getJson<T>(url: string): Promise<T> {
    return this.queue.run(async () => {
      this.inFlight++;
      let attempt = 0;
      const maxAttempts = 4;
      const displayUrl = redactApiKey(url);
      try {
        while (true) {
          attempt++;
          this.opts.onProgress?.({
            type: "request:start",
            url,
            displayUrl,
            attempt,
            inFlight: this.inFlight,
            totalCompleted: this.totalCompleted,
          });
          let res: Response;
          try {
            res = await this.fetchFn(url, { method: "GET" });
          } catch (err) {
            if (attempt >= maxAttempts) throw err;
            await backoff(attempt);
            continue;
          }
          if (res.ok) {
            const json = (await res.json()) as T;
            this.totalCompleted++;
            this.opts.onProgress?.({
              type: "request:done",
              url,
              displayUrl,
              status: res.status,
              attempt,
              inFlight: this.inFlight,
              totalCompleted: this.totalCompleted,
            });
            return json;
          }
          const transient = res.status === 429 || (res.status >= 500 && res.status < 600);
          if (transient && attempt < maxAttempts) {
            await backoff(attempt, res.headers.get("retry-after"));
            continue;
          }
          const body = await safeText(res);
          this.opts.onProgress?.({
            type: "request:error",
            url,
            displayUrl,
            status: res.status,
            attempt,
            inFlight: this.inFlight,
            totalCompleted: this.totalCompleted,
          });
          throw new WCLApiError(
            `WCL ${res.status} for ${displayUrl}`,
            res.status,
            displayUrl,
            body,
          );
        }
      } finally {
        this.inFlight--;
      }
    });
  }
}

async function safeText(res: Response): Promise<string | undefined> {
  try {
    return await res.text();
  } catch {
    return undefined;
  }
}

async function backoff(attempt: number, retryAfter?: string | null): Promise<void> {
  const headerSeconds = retryAfter ? Number(retryAfter) : NaN;
  const ms =
    Number.isFinite(headerSeconds) && headerSeconds > 0
      ? Math.min(headerSeconds * 1000, 10_000)
      : Math.min(500 * 2 ** (attempt - 1), 8000);
  await new Promise((r) => setTimeout(r, ms));
}

/** Strip the api_key query param so it doesn't leak into logs or UI. */
export function redactApiKey(url: string): string {
  return url.replace(/([?&])api_key=[^&]*/g, "$1api_key=***");
}
