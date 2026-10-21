import { distance } from 'fastest-levenshtein';

import {
  DEFAULT_TOP_LEVEL_DOMAINS,
  KNOWN_EMAIL_DOMAINS,
  OTHER_SERVICE_PROVIDERS,
  RU_SERVICE_PROVIDER_DOMAINS,
} from './constants';
import { VALID_EMAIL_REGEX } from '../../../data/constants';
import messages from '../../messages';

export const emailRegex = new RegExp(VALID_EMAIL_REGEX, 'i');

export const getLevenshteinSuggestion = (word, knownWords, similarityThreshold = 4) => {
  if (!word) {
    return null;
  }

  let minEditDistance = 100;
  let mostSimilar = word;

  for (let i = 0; i < knownWords.length; i++) {
    const editDistance = distance(knownWords[i].toLowerCase(), word.toLowerCase());
    if (editDistance < minEditDistance) {
      minEditDistance = editDistance;
      mostSimilar = knownWords[i];
    }
  }

  return minEditDistance <= similarityThreshold && word !== mostSimilar ? mostSimilar : null;
};

// Robbo: hints only for Russian providers (RU_SERVICE_PROVIDER_DOMAINS), always in the typed zone.
const PROVIDER_NAMES = [...OTHER_SERVICE_PROVIDERS, ...Object.keys(RU_SERVICE_PROVIDER_DOMAINS)];

// The nearest provider name, if it is Russian. A typo may change at most half of the name
// (and 2 letters), so "bk"/"ok"/"vk" are not "ya"; "gmail" stays gmail and is not taken for "mail".
const getRuProvider = (name) => {
  if (!name) {
    return null;
  }

  let minEditDistance = 100;
  let mostSimilar = null;

  for (let i = 0; i < PROVIDER_NAMES.length; i++) {
    const editDistance = distance(PROVIDER_NAMES[i], name);
    if (editDistance < minEditDistance) {
      minEditDistance = editDistance;
      mostSimilar = PROVIDER_NAMES[i];
    }
  }

  if (!RU_SERVICE_PROVIDER_DOMAINS[mostSimilar]
    || minEditDistance > Math.min(2, Math.floor(mostSimilar.length / 2))) {
    return null;
  }
  return { name: mostSimilar, exact: minEditDistance === 0 };
};

// A zone typo: one letter off ("ry", "rus") or two neighbours swapped ("cmo").
const isZoneTypo = (typed, zone) => {
  if (distance(typed, zone) <= 1) {
    return true;
  }
  const diff = [...zone].map((char, i) => (char !== typed[i] ? i : -1)).filter(i => i >= 0);
  return typed.length === zone.length && diff.length === 2 && diff[1] === diff[0] + 1
    && typed[diff[0]] === zone[diff[1]] && typed[diff[1]] === zone[diff[0]];
};

// The provider's domain in the typed zone (or a typo of it); no zone typed -> the first, Russian one.
const getRuProviderDomain = (provider, zone, allowZoneTypo) => {
  const domains = RU_SERVICE_PROVIDER_DOMAINS[provider];
  if (!zone) {
    return domains[0];
  }
  const exact = domains.find(domain => domain === `${provider}.${zone}`);
  if (exact || !allowZoneTypo) {
    return exact || null;
  }
  return domains.find(domain => isZoneTypo(zone, domain.slice(provider.length + 1))) || null;
};

export const getSuggestionForInvalidEmail = (domain, username) => {
  if (!domain) {
    return '';
  }

  // Robbo: "mail", "mail.r", "mail,ru", "mailru" -> mail.ru; "mailcom", "gmail" -> nothing.
  const parts = domain.toLowerCase().replace(/[^a-z0-9.-]/g, '').split('.').filter(Boolean);
  let [name = '', zone = ''] = [parts[0], parts.slice(1).join('.')];
  if (!zone) {
    const glued = name.match(/^(.+?)(ru|com|by|kz|ua)$/);
    if (glued) {
      [, name, zone] = glued;
    }
  }

  const provider = getRuProvider(name);
  const suggestion = provider && getRuProviderDomain(provider.name, zone, true);
  return suggestion ? `${username}@${suggestion}` : '';
};

export const validateEmailAddress = (value, username, rawDomainName) => {
  const validation = {
    hasError: false,
    suggestion: '',
    type: '',
  };

  // Robbo: domains are case-insensitive (Mail.RU is mail.ru); known real domains get no hint.
  const domainName = rawDomainName.toLowerCase();
  if (KNOWN_EMAIL_DOMAINS.includes(domainName)) {
    return validation;
  }

  // Robbo: count the dots of the domain only, a dot in the name (ivan.petrov@) is not a subdomain.
  const hasMultipleSubdomains = domainName.match(/\./g).length > 1;
  const [serviceLevelDomain, topLevelDomain] = domainName.split('.');
  const tldSuggestion = !DEFAULT_TOP_LEVEL_DOMAINS.includes(topLevelDomain);
  const provider = getRuProvider(serviceLevelDomain);

  if (!hasMultipleSubdomains && tldSuggestion) {
    // Unknown zone: an error, with a hint for a Russian provider and a zone typo (mail.ry -> mail.ru).
    const suggestion = provider && getRuProviderDomain(provider.name, topLevelDomain, true);
    validation.hasError = true;
    validation.type = 'error';
    validation.suggestion = suggestion ? `${username}@${suggestion}` : '';
  } else if (provider && !provider.exact) {
    // Typo in a Russian provider name, the zone stays as typed (mial.ru -> mail.ru, mial.com -> nothing).
    const suggestion = getRuProviderDomain(provider.name, topLevelDomain, false);
    if (suggestion) {
      validation.suggestion = `${username}@${suggestion}`;
      validation.type = 'warning';
    }
  }

  return validation;
};

const validateEmail = (value, confirmEmailValue, formatMessage) => {
  let fieldError = '';
  let confirmEmailError = '';
  let emailSuggestion = { suggestion: '', type: '' };

  if (!value) {
    fieldError = formatMessage(messages['empty.email.field.error']);
  } else if (value.length <= 2) {
    fieldError = formatMessage(messages['email.invalid.format.error']);
  } else {
    const [username, domainName] = value.split('@');
    // Check if email address is invalid. If we have a suggestion for invalid email
    // provide that along with the error message.
    if (!emailRegex.test(value)) {
      fieldError = formatMessage(messages['email.invalid.format.error']);
      emailSuggestion = {
        suggestion: getSuggestionForInvalidEmail(domainName, username),
        type: 'error',
      };
    } else {
      const response = validateEmailAddress(value, username, domainName);
      if (response.hasError) {
        fieldError = formatMessage(messages['email.invalid.format.error']);
        delete response.hasError;
      }
      emailSuggestion = { ...response };

      if (confirmEmailValue && value !== confirmEmailValue) {
        confirmEmailError = formatMessage(messages['email.do.not.match']);
      }
    }
  }
  return { fieldError, confirmEmailError, suggestion: emailSuggestion };
};

export default validateEmail;
