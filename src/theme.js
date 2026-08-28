import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'midroc.theme.v1';
const VALID = ['light', 'dark'];

function readSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return VALID.includes(raw) ? raw : null;
  } catch {
    return null;
  }
}

function readDOM() {
  if (typeof document === 'undefined') return 'light';
  const v = document.documentElement.getAttribute('data-theme');
  return VALID.includes(v) ? v : 'light';
}

export function getTheme() {
  return readSaved() || readDOM();
}

export function setTheme(value) {
  const v = VALID.includes(value) ? value : 'light';
  try {
    localStorage.setItem(STORAGE_KEY, v);
  } catch {
  }
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', v);
  }
  return v;
}

export function toggleTheme() {
  return setTheme(getTheme() === 'light' ? 'dark' : 'light');
}


export function useTheme() {
  const [theme, setLocal] = useState(readDOM);

  useEffect(() => {
    const sync = () => setLocal(readDOM());
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY) sync();
    });
    const obs = new MutationObserver(sync);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => {
      window.removeEventListener('storage', sync);
      obs.disconnect();
    };
  }, []);

  const update = useCallback((next) => {
    setLocal(setTheme(next));
  }, []);

  const toggle = useCallback(() => {
    setLocal(toggleTheme());
  }, []);

  return [theme, update, toggle];
}
