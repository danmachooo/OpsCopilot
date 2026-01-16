import type { IncomingHttpHeaders } from "http";

export function toFetchHeaders(h: IncomingHttpHeaders): Headers {
  const out = new Headers();

  for (const [key, value] of Object.entries(h)) {
    if (value == null) continue;

    if (Array.isArray(value)) {
      // multiple headers of same name
      for (const v of value) out.append(key, v);
    } else {
      out.set(key, value);
    }
  }

  return out;
}
