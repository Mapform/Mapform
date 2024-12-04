/**
 * Wraps promises to return a tuple of [error, data] instead of throwing errors.
 * This is useful so that we don't need to wrap every single promise in a
 * try/catch block.
 */
export async function catchError<T, E extends new (message?: string) => Error>(
  promise: Promise<T>,
  errorsToCatch?: E[],
): Promise<[undefined, T] | [InstanceType<E>]> {
  return promise
    .then((data) => [undefined, data] as [undefined, T])
    .catch((error) => {
      if (errorsToCatch == undefined) {
        return [error];
      }

      if (errorsToCatch.some((e) => error instanceof e)) {
        return [error];
      }

      throw error;
    });
}
