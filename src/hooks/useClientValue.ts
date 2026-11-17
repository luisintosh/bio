import { useSyncExternalStore } from 'react'

const subscribeNever = () => () => {}

/**
 * A value only the browser can know (a media query, the device). While hydrating it is
 * `serverValue`, matching the HTML built ahead of time; right after, it is `read()`.
 * `read` must return a primitive, so React can tell when it is unchanged.
 */
export function useClientValue<T extends boolean | number | string>(read: () => T, serverValue: T): T {
  return useSyncExternalStore(subscribeNever, read, () => serverValue)
}

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches
