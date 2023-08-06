export function append<T>(arr: T[], element: T | T[]) {
  if (Array.isArray(element)) {
    arr.push(...element);
  } else {
    arr.push(element);
  }
}
