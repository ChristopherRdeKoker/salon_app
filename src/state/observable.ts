export type ObservableType<ValueType> = {
  get: () => ValueType;
  set: (next: ValueType) => void;
  subscribe: (listener: () => void) => () => void;
};

export function createObservable<ValueType>(initial: ValueType): ObservableType<ValueType> {
  let current = initial;
  const listeners = new Set<() => void>();

  const result = {
    get: () => current,
    set: (next: ValueType) => {
      current = next;
      listeners.forEach((listener) => listener());
    },
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => void listeners.delete(listener);
    },
  };
  return result;
}
