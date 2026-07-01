// 后台鉴权：SHA-256 哈希后比对，sessionStorage 持久化 8h
import { adminPassword } from './config';

const STORAGE_KEY = 'kz-3rl-portal:admin';
const TTL = 8 * 60 * 60 * 1000;

const sha256 = async (text: string): Promise<string> => {
  const buf = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, '0')).join('');
};

const expectedHash = async () => sha256(adminPassword());

export const adminAuth = {
  isLoggedIn(): boolean {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      const { ts } = JSON.parse(raw);
      return Date.now() - ts < TTL;
    } catch {
      return false;
    }
  },

  async login(password: string): Promise<boolean> {
    const hash = await sha256(password);
    const expected = await expectedHash();
    if (hash === expected) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ts: Date.now() }));
      return true;
    }
    return false;
  },

  logout() {
    sessionStorage.removeItem(STORAGE_KEY);
  },
};
