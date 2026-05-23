// Bounded-concurrency queue. WCL v1 is per-hour quota (subscriber tier is higher),
// but burst >~5 parallel calls can still hiccup. Keep concurrency conservative.

export interface RateLimitedQueueOptions {
  /** Max in-flight requests at any moment. */
  concurrency: number;
  /** Optional minimum spacing between dispatches (ms). */
  minIntervalMs?: number;
}

export class RateLimitedQueue {
  private active = 0;
  private lastDispatchAt = 0;
  private readonly waiters: Array<() => void> = [];

  constructor(private readonly opts: RateLimitedQueueOptions) {
    if (opts.concurrency < 1) throw new Error("concurrency must be >= 1");
  }

  async run<T>(task: () => Promise<T>): Promise<T> {
    await this.acquire();
    try {
      return await task();
    } finally {
      this.release();
    }
  }

  private async acquire(): Promise<void> {
    if (this.active >= this.opts.concurrency) {
      await new Promise<void>((resolve) => this.waiters.push(resolve));
    }
    this.active++;

    const minInterval = this.opts.minIntervalMs;
    if (minInterval && minInterval > 0) {
      const wait = this.lastDispatchAt + minInterval - Date.now();
      if (wait > 0) await sleep(wait);
    }
    this.lastDispatchAt = Date.now();
  }

  private release(): void {
    this.active--;
    const next = this.waiters.shift();
    if (next) next();
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
