type Success<T> = {
  data: T;
  error: null;
};
type Failure<E> = {
  data: null;
  error: E;
};
type MaybePromise<T> = T | Promise<T>;
type Result<T, E = Error> = Success<T> | Failure<E>;

export async function awaitable<T, E = Error>(
  fun: Promise<T> | (() => MaybePromise<T>),
): Promise<Result<T, E>> {
  if (typeof fun === 'function') {
    try {
      const result = fun();
      return result instanceof Promise
        ? awaitable(result)
        : { data: result, error: null };
    } catch (error) {
      return { data: null, error: error as E };
    }
  }

  return fun
    .then(data => ({ data, error: null }))
    .catch(error => ({ data: null, error: error as E }));
}
