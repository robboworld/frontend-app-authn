import 'core-js/stable';
import 'regenerator-runtime/runtime';

import React, { StrictMode } from 'react';

import {
  APP_INIT_ERROR, APP_READY, getConfig, initialize, mergeConfig, subscribe,
} from '@edx/frontend-platform';
import { ErrorPage } from '@edx/frontend-platform/react';
import { createRoot } from 'react-dom/client';

import configuration from './config';
import messages from './i18n';
import MainApp from './MainApp';

const initYandexMetrika = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }
  const cfg = getConfig();
  if (!cfg.ENABLE_YANDEX_METRIKA || cfg.YANDEX_METRIKA_COUNTER_ID == null || cfg.YANDEX_METRIKA_COUNTER_ID === '') {
    return;
  }
  const counterId = Number(cfg.YANDEX_METRIKA_COUNTER_ID);
  if (!Number.isFinite(counterId) || counterId <= 0) {
    return;
  }
  const src = `https://mc.yandex.ru/metrika/tag.js?id=${counterId}`;
  const alreadyLoaded = Array.from(document.scripts || []).some(
    (scriptEl) => scriptEl.src === src || scriptEl.src.indexOf('https://mc.yandex.ru/metrika/tag.js') === 0,
  );
  if (!alreadyLoaded) {
    const scriptEl = document.createElement('script');
    scriptEl.async = true;
    scriptEl.src = src;
    const firstScript = document.getElementsByTagName('script')[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(scriptEl, firstScript);
    } else {
      document.head.appendChild(scriptEl);
    }
  }
  window.ym = window.ym || function ymShim() { (window.ym.a = window.ym.a || []).push(arguments); };
  window.ym.l = 1 * new Date();
  window.ym(counterId, 'init', {
    ssr: true,
    webvisor: true,
    clickmap: true,
    ecommerce: 'dataLayer',
    referrer: document.referrer,
    url: window.location.href,
    accurateTrackBounce: true,
    trackLinks: true,
  });
};

subscribe(APP_READY, () => {
  initYandexMetrika();
  const root = createRoot(document.getElementById('root'));

  root.render(
    <StrictMode>
      <MainApp />
    </StrictMode>,
  );
});

subscribe(APP_INIT_ERROR, (error) => {
  const root = createRoot(document.getElementById('root'));

  root.render(
    <StrictMode>
      <ErrorPage message={error.message} />
    </StrictMode>,
  );
});

initialize({
  handlers: {
    config: () => {
      mergeConfig(configuration);
    },
  },
  messages,
});
