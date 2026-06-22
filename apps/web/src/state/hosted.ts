// hs: hosted mode — the public HS deployment manages the API key server-side
// (the proxy injects each user's key). In hosted mode the browser only needs a
// non-empty placeholder to pass the client-side "missing key" gate; the proxy
// overrides it. Off by default → upstream behavior is unchanged.
export const HS_HOSTED = process.env.NEXT_PUBLIC_HS_HOSTED === '1';
export const HS_MANAGED_KEY_PLACEHOLDER = 'hs-managed';
