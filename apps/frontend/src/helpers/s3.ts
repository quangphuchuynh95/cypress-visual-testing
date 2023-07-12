export function createUrl(fileKey: string) {
  const url = new URL(import.meta.env.VITE_APP_S3_CDN_ENDPOINT || '');
  const prefix = import.meta.env.VITE_APP_S3_KEY_PREFIX || '';
  url.pathname = `${prefix}${fileKey}`;
  return url;
}
