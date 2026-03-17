class RequestQueue {
  private queue: Array<{
    requestFn: () => Promise<unknown>;
    resolve: (value: unknown) => void;
    reject: (error: unknown) => void;
  }> = [];
  private processing = false;
  private readonly maxConcurrent = 1;
  private readonly delayBetweenRequests = 1000;
  private activeRequests = 0;

  async add<T>(requestFn: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push({
        requestFn,
        resolve: resolve as (value: unknown) => void,
        reject,
      });
      void this.processQueue();
    });
  }

  private async processQueue(): Promise<void> {
    if (this.processing) {
      return;
    }

    this.processing = true;

    while (this.queue.length > 0 && this.activeRequests < this.maxConcurrent) {
      const queueItem = this.queue.shift();
      if (queueItem) {
        this.activeRequests++;

        Promise.resolve()
          .then(() => queueItem.requestFn())
          .then((result) => {
            queueItem.resolve(result);
          })
          .catch((error) => {
            queueItem.reject(error);
          })
          .finally(() => {
            this.activeRequests--;
            setTimeout(() => {
              void this.processQueue();
            }, this.delayBetweenRequests);
          });
      }
    }

    this.processing = false;
  }
}

export const etherscanQueue = new RequestQueue();
