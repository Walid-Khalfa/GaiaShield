import crypto from 'crypto';

const normalizeValue = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(item => normalizeValue(item));
  }

  if (value && typeof value === 'object') {
    if (value instanceof Date) {
      return value.toISOString();
    }

    const record = value as Record<string, unknown>;
    const normalizedEntries: Record<string, unknown> = {};
    const sortedKeys = Object.keys(record).sort((keyA, keyB) => keyA.localeCompare(keyB));
    for (const key of sortedKeys) {
      normalizedEntries[key] = normalizeValue(record[key]);
    }
    return normalizedEntries;
  }

  return value;
};

export const hashPayload = (payload: unknown): string => {
  const normalized = normalizeValue(payload);
  return crypto.createHash('sha256').update(JSON.stringify(normalized)).digest('hex');
};
