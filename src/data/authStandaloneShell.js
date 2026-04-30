/**
 * Copyright (C) 2024-2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Part of the Robbo Open edX MFE overrides. See NOTICE at repository root.
 */
import {
  LOGIN_PAGE,
  REGISTER_EMBEDDED_PAGE,
  REGISTER_PAGE,
  RESET_PAGE,
} from './constants';

/**
 * Routes where we match standalone Tutor authn MFE: no Robbo header/footer.
 */
export function isAuthStandaloneShellPath(pathname) {
  if (!pathname) {
    return false;
  }
  if (
    pathname === '/'
    || pathname === LOGIN_PAGE
    || pathname === REGISTER_PAGE
    || pathname === REGISTER_EMBEDDED_PAGE
    || pathname === RESET_PAGE
  ) {
    return true;
  }
  if (pathname.startsWith('/password_reset_confirm/')) {
    return true;
  }
  return false;
}
