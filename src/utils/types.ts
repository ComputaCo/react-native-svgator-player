export type Optional<T> = T | undefined;
export type OptionalFields<T> = { [K in keyof T]?: T[K] };
