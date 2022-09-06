type cookieOptions = {
  path?: string,
  domain?: string,
  expires?: Date | string,
  "max-age"?: number | string,
  secure?: boolean,
  samesite?: "strict" | "lax",
}

type cookieOptionsToRemove = {
  path?: string,
  domain?: string,
}

export function writeCookie(
  name: string,
  value: string,
  options: cookieOptions = {}
): void {
  if (options.expires && options["max-age"])
    throw new Error("can't use time and max-age at the same time");

  if (options.expires instanceof Date)
    options.expires = options.expires.toUTCString();

  if (!Number.isInteger(options["max-age"]))
    throw new Error("invalid max-age");

  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  for (const key in options) {
    const value = options[key as keyof cookieOptions];

    cookie += `; ${key}`;

    if (value !== undefined && !(value instanceof Date) && value !== true) cookie += `=${encodeURIComponent(value)}`;
  }

  // TODO: Check limitations

  document.cookie = cookie;
}

export function readCookie(name: string): null | string {
  const matches = document.cookie.match(new RegExp(
    "(?:^|; )" +
      name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
      "=([^;]*)"
  ));

  return matches ? decodeURIComponent(matches[1]) : null;
}

export function removeCookie(
  name: string,
  options?: cookieOptionsToRemove
): void {
  writeCookie(name, "", {
    "max-age": 0,
    ...options
  });
}
