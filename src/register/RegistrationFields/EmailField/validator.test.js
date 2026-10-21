import { COMMON_EMAIL_PROVIDERS } from './constants';
import {
  getLevenshteinSuggestion,
  getSuggestionForInvalidEmail,
  validateEmailAddress,
} from './validator';

describe('Email Validators Utils', () => {
  describe('getLevenshteinSuggestion Tests', () => {
    it('test getLevenshteinSuggestion returns null for invalid word', () => {
      const output = getLevenshteinSuggestion('', COMMON_EMAIL_PROVIDERS);
      expect(output).toEqual(null);
    });

    it('test getLevenshteinSuggestion returns output for valid word', () => {
      const output = getLevenshteinSuggestion('gmail', COMMON_EMAIL_PROVIDERS);
      expect(output).toEqual('gmail.com');
    });
  });
  describe('getSuggestionForInvalidEmail Tests', () => {
    it('test getSuggestionForInvalidEmail returns empty string for invalid domain', () => {
      const output = getSuggestionForInvalidEmail('', 'username');
      expect(output).toEqual('');
    });

    it('test getSuggestionForInvalidEmail returns valid suggestion when domain is nearly matched', () => {
      // Robbo: hints only for Russian providers.
      const output = getSuggestionForInvalidEmail('mial', 'username');
      expect(output).toEqual('username@mail.ru');
    });

    it('test getSuggestionForInvalidEmail returns valid suggestion for default domains', () => {
      // Robbo: the default domains are Russian providers, suggested with their own zone.
      const output = getSuggestionForInvalidEmail('yandex', 'username');
      expect(output).toEqual('username@yandex.ru');
      expect(getSuggestionForInvalidEmail('mail', 'username')).toEqual('username@mail.ru');
    });

    it('test getSuggestionForInvalidEmail returns empty for totally different domain', () => {
      const output = getSuggestionForInvalidEmail('invalid-domain', 'username');
      expect(output).toEqual('');
    });

    it.each([
      ['ya', 'ivan@ya.ru'],
      ['mailru', 'ivan@mail.ru'],
      ['mail,ru', 'ivan@mail.ru'],
      ['mail.r', 'ivan@mail.ru'],
      ['yandexcom', 'ivan@yandex.com'],
      ['rambler', 'ivan@rambler.ru'],
      ['gmail', ''],
      ['gmailcom', ''],
      ['mailcom', ''],
      ['hotmail', ''],
    ])('test getSuggestionForInvalidEmail for %s gives "%s"', (domain, suggestion) => {
      expect(getSuggestionForInvalidEmail(domain, 'ivan')).toEqual(suggestion);
    });
  });

  // Robbo: hints only for Russian providers, in the typed zone; real domains get none.
  describe('validateEmailAddress Tests', () => {
    const check = (email) => {
      const [username, domainName] = email.split('@');
      return validateEmailAddress(email, username, domainName);
    };

    it.each([
      'ivan@gmail.com', 'ivan@mail.ru', 'ivan@yandex.ru', 'ivan@yandex.com', 'ivan@ya.ru', 'ivan@bk.ru',
      'ivan@list.ru', 'ivan@inbox.ru', 'ivan@rambler.ru', 'ivan@ok.ru', 'ivan@vk.com', 'ivan@icloud.com',
      'ivan@robbo.ru', 'ivan@school.edu.ru', 'Ivan@Mail.RU', 'ivan@mail.com',
      // no hints for other providers and no move to another zone
      'ivan@gmial.com', 'ivan@gamil.com', 'ivan@gmail.ru', 'ivan@hotmal.com', 'ivan@outlok.com', 'ivan@yopmail.com',
      'ivan@mial.com', 'ivan@ya.com', 'ivan@yz.com', 'ivan@rambler.com',
    ])('gives no hint for %s', (email) => {
      expect(check(email)).toEqual({ hasError: false, suggestion: '', type: '' });
    });

    it.each([
      ['ivan@mial.ru', 'ivan@mail.ru'],
      ['ivan@lsit.ru', 'ivan@list.ru'],
      ['ivan@inbx.ru', 'ivan@inbox.ru'],
      ['ivan@yandx.ru', 'ivan@yandex.ru'],
      ['ivan@yandx.com', 'ivan@yandex.com'],
      ['ivan@yz.ru', 'ivan@ya.ru'],
      ['ivan@rambeler.ru', 'ivan@rambler.ru'],
    ])('warns %s -> %s', (email, suggestion) => {
      expect(check(email)).toEqual({ hasError: false, suggestion, type: 'warning' });
    });

    it.each([
      ['ivan@mail.ry', 'ivan@mail.ru'],
      ['ivan@mail.rus', 'ivan@mail.ru'],
      ['ivan@yandex.ry', 'ivan@yandex.ru'],
      ['ivan@yandex.cmo', 'ivan@yandex.com'],
      ['ivan@ya.ry', 'ivan@ya.ru'],
    ])('rejects %s and suggests %s', (email, suggestion) => {
      expect(check(email)).toEqual({ hasError: true, suggestion, type: 'error' });
    });

    it.each([
      'ivan@gmail.con', 'ivan.petrov@gmail.con', 'ivan@mail.cmo', 'ivan@gmail.mistake',
    ])('rejects %s without a hint', (email) => {
      expect(check(email)).toEqual({ hasError: true, suggestion: '', type: 'error' });
    });
  });
});
