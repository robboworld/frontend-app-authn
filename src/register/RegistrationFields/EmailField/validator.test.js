import { COMMON_EMAIL_PROVIDERS } from './constants';
import {
  getLevenshteinSuggestion,
  getSuggestionForInvalidEmail,
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
      const output = getSuggestionForInvalidEmail('gmail', 'username');
      expect(output).toEqual('username@gmail.com');
    });

    it('test getSuggestionForInvalidEmail returns valid suggestion for default domains', () => {
      // Robbo: the default domains are Russian and common providers (no aol), suggested with their own zone.
      const output = getSuggestionForInvalidEmail('yandex', 'username');
      expect(output).toEqual('username@yandex.ru');
      expect(getSuggestionForInvalidEmail('mail', 'username')).toEqual('username@mail.ru');
    });
    it('test getSuggestionForInvalidEmail returns empty for totally different domain', () => {
      const output = getSuggestionForInvalidEmail('invalid-domain', 'username');
      expect(output).toEqual('');
    });
  });
});
