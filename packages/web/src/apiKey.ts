// API key storage. Two modes:
//   - "remember" → localStorage  (persisted across sessions)
//   - "session"  → in-memory only (cleared on tab close)
// Never written to cookies, URL params, or sent anywhere but warcraftlogs.com.

const STORAGE_KEY = "wcl_api_key_v1";
const REMEMBER_KEY = "wcl_api_key_remember_v1";

let memoryKey: string | null = null;

export function loadApiKey(): { key: string | null; remember: boolean } {
  const remember = localStorage.getItem(REMEMBER_KEY) === "1";
  if (remember) {
    return { key: localStorage.getItem(STORAGE_KEY), remember: true };
  }
  return { key: memoryKey, remember: false };
}

export function saveApiKey(key: string, remember: boolean): void {
  if (remember) {
    localStorage.setItem(STORAGE_KEY, key);
    localStorage.setItem(REMEMBER_KEY, "1");
    memoryKey = null;
  } else {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(REMEMBER_KEY);
    memoryKey = key;
  }
}

export function clearApiKey(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(REMEMBER_KEY);
  memoryKey = null;
}
