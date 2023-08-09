import crypto from "crypto";

export function append<T>(arr: T[], element: T | T[]) {
  if (Array.isArray(element)) {
    arr.push(...element);
  } else {
    arr.push(element);
  }
  return arr;
}

export function randomUUID() {
  return crypto.randomUUID();
}

export function propertyOf<TObj>(name: keyof TObj) {
  return name;
}

export function getValueByKey(key: string, obj: any) {
  const attr = key as keyof typeof obj;
  const __interceptorId = obj[attr];
  return __interceptorId;
}

export function asArray(obj: any) {
  if (!obj) return [];
  if (Array.isArray(obj)) return obj;
  return [obj];
}
