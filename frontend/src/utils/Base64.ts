export const base64UrlDecode = (base64Url: string): string | undefined => {
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

  if (base64.length % 4 === 1) {
    return undefined;
  }

  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  return atob(padded);
};
