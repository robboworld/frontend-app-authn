/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Part of the Robbo Open edX distribution (frontend-app-authn overrides).
 * See NOTICE at repository root.
 */

import { getConfig } from '@edx/frontend-platform';

/**
 * Sends a Yandex Metrika reachGoal when MFE_CONFIG enables the counter (production).
 *
 * @param {string} goalName Goal id configured in the Metrika UI (e.g. login, register).
 */
export function reachYandexGoal(goalName) {
  if (!goalName || typeof window === 'undefined') {
    return;
  }
  const cfg = getConfig();
  if (!cfg.ENABLE_YANDEX_METRIKA || cfg.YANDEX_METRIKA_COUNTER_ID == null || cfg.YANDEX_METRIKA_COUNTER_ID === '') {
    return;
  }
  const id = Number(cfg.YANDEX_METRIKA_COUNTER_ID);
  if (!Number.isFinite(id) || id <= 0) {
    return;
  }
  if (typeof window.ym !== 'function') {
    return;
  }
  try {
    window.ym(id, 'reachGoal', goalName);
  } catch (e) {
    /* ignore */
  }
}
