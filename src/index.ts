type Opts = {
  path?: string;
  domain?: string;
  expires?: Date | string;
  "max-age"?: number | string;
  secure?: boolean;
  samesite?: "strict" | "lax";
};

type RemoveOpts = {
  path?: string;
  domain?: string;
};

export function writeCookie(
  name: string,
  value: string,
  options: Opts = {},
): void {
  if (options.expires && options["max-age"]) {
    throw new Error("can't use time and max-age at the same time");
  }

  if (options.expires instanceof Date) {
    options.expires = options.expires.toUTCString();
  } else {
    if (!Number.isInteger(options["max-age"])) {
      throw new Error("invalid max-age");
    }
  }

  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  for (const key in options) {
    const value = options[key as keyof Opts];

    cookie += `; ${key}`;

    if (value !== undefined && !(value instanceof Date) && value !== true) {
      cookie += `=${encodeURIComponent(value)}`;
    }
  }

  // TODO: Check limitations of 4KB and number of cookies already existing

  document.cookie = cookie;
}

export function readCookie(name: string): null | string {
  const matches = document.cookie.match(
    new RegExp(
      "(?:^|; )" +
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
        "=([^;]*)",
    ),
  );

  if (matches === null) {
    return null;
  }

  const value = matches[1];

  if (value === undefined) {
    return null;
  }

  return matches ? decodeURIComponent(value) : null;
}

export function removeCookie(
  name: string,
  options?: RemoveOpts,
): void {
  writeCookie(name, "", {
    "max-age": 0,
    ...options,
  });
}
