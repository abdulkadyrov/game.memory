import { en } from '@/localization/en';
import { ru } from '@/localization/ru';

const dictionaries = {
  ru,
  en,
} as const;

type Dictionary = typeof ru;

const defaultLocale = 'ru';

function resolveValue(source: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }

    return undefined;
  }, source);
}

export function t(path: string, params?: Record<string, string | number>): any {
  const raw = resolveValue(dictionaries[defaultLocale], path);

  if (typeof raw === 'string') {
    if (!params) {
      return raw;
    }

    return Object.entries(params).reduce((text, [key, value]) => {
      return text.replaceAll(`{${key}}`, String(value));
    }, raw);
  }

  return raw as Dictionary[keyof Dictionary];
}
