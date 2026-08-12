/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Part of the Robbo Open edX distribution. See NOTICE at repository root.
 */

import { isValidPhoneNumber as isValidLibPhoneNumber } from 'libphonenumber-js';

/** Russia: +7 and 10 national digits. */
export const RU_PHONE_PATTERN = /^\+7\d{10}$/;
/** Other countries: E.164, 8–15 digits after '+'. */
export const INTL_PHONE_PATTERN = /^\+(?!7)[1-9]\d{7,14}$/;

export function sanitizePhoneInput(value) {
  const trimmed = String(value ?? '').trim();
  if (!trimmed.startsWith('+')) {
    return trimmed;
  }
  const digits = trimmed.replace(/\D/g, '');
  return digits ? `+${digits}` : '';
}

/**
 * Russian mobile trunk: users type 89… instead of +79….
 * As soon as the digits start with 89, rewrite to +79… so the number is
 * treated as Russian (+7 / national 9…).
 */
export function rewriteRuLeadingEightyNine(value) {
  const raw = String(value ?? '');
  const digits = raw.replace(/\D/g, '');
  if (!digits.startsWith('89')) {
    return raw;
  }
  return `+79${digits.slice(2)}`;
}

/** @deprecated Use rewriteRuLeadingEightyNine */
export const rewriteRuLeadingEight = rewriteRuLeadingEightyNine;

/** Strip formatting from E.164 value (PhoneInput always includes "+"). */
export function normalizeRobboPhoneNumber(value) {
  const rewritten = rewriteRuLeadingEightyNine(String(value ?? '').trim());
  if (!rewritten.startsWith('+')) {
    return '';
  }
  const digits = rewritten.replace(/\D/g, '');
  if (!digits) {
    return '';
  }
  return `+${digits}`;
}

export function isValidRobboPhoneNumber(value) {
  const normalized = normalizeRobboPhoneNumber(value);
  if (!normalized) {
    return true;
  }
  if (normalized.startsWith('+7') && normalized.length !== 12) {
    return false;
  }
  if (RU_PHONE_PATTERN.test(normalized) || INTL_PHONE_PATTERN.test(normalized)) {
    return true;
  }
  if (!normalized.startsWith('+7')) {
    try {
      if (isValidLibPhoneNumber(normalized)) {
        return true;
      }
    } catch {
      // Ignore parse errors for legacy pasted values.
    }
  }
  return false;
}
