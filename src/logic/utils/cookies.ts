function setCookie(
  name: string,
  value: string,
  expiresInMs: number = 365 * 24 * 60 * 60 * 1000
): void {
  const date = new Date();
  date.setTime(date.getTime() + expiresInMs);
  const expires = 'expires=' + date.toUTCString();
  document.cookie = name + '=' + value + ';' + expires + ';path=/';
}

function getCookie(cname: string): string | undefined {
  const name = cname + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return undefined;
}

export {setCookie, getCookie};
