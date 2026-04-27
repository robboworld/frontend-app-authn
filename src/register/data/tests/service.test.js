import { mergeConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

import { registerRequest } from '../service';

jest.mock('@edx/frontend-platform/auth', () => ({
  getAuthenticatedHttpClient: jest.fn(),
  getHttpClient: jest.fn(),
}));

describe('registration service', () => {
  beforeEach(() => {
    mergeConfig({
      LMS_BASE_URL: 'https://lms.test',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('treats a successful response without a success flag as success', async () => {
    const post = jest.fn().mockResolvedValue({
      data: {
        authenticated_user: { user_id: 7, username: 'test2' },
        redirect_url: 'https://lms.test/dashboard',
      },
    });
    getAuthenticatedHttpClient.mockReturnValue({ post });

    const result = await registerRequest({ email: 'test2@mail.ru' });

    expect(post).toHaveBeenCalledWith(
      'https://lms.test/api/user/v2/account/registration/',
      'email=test2%40mail.ru',
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        isPublic: true,
      },
    );
    expect(result).toEqual({
      redirectUrl: 'https://lms.test/dashboard',
      success: true,
      authenticatedUser: { user_id: 7, username: 'test2' },
    });
  });
});
