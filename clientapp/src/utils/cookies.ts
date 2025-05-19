// lib/cookies.ts
export function setCookie(name: string, value: string, options: { maxAge?: number } = {}) {
    if (typeof window === 'undefined') return;
  
    const cookieValue = encodeURIComponent(value);
    let cookie = `${name}=${cookieValue}; path=/; samesite=strict;`;
  
    if (options.maxAge) {
      cookie += ` max-age=${options.maxAge};`;
    }
  
    document.cookie = cookie;
  }
  
  export function getCookie(name: string): string | null {
    if (typeof window === 'undefined') return null;
  
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  
    return null;
  }
  