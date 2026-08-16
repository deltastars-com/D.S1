import { beforeEach, describe, expect, it, vi } from 'vitest';

const signInWithPassword = vi.fn();
const signOut = vi.fn();
const verifyOTP = vi.fn();
const storageUpload = vi.fn();
const getPublicUrl = vi.fn();
const storageFrom = vi.fn(() => ({ upload: storageUpload, getPublicUrl }));

vi.mock('../client/src/supabaseClient', () => ({
  isSupabaseConfigured: true,
  supabase: {
    auth: { signInWithPassword, signOut },
    storage: { from: storageFrom },
  },
}));

vi.mock('../client/src/firebase', () => ({ auth: {}, sendPasswordResetEmail: vi.fn() }));
vi.mock('../client/src/services/authService', () => ({ authService: { verifyOTP, sendOTP: vi.fn() } }));

const { api } = await import('../client/src/services/api');

describe('security-sensitive API fallbacks', () => {
  beforeEach(() => {
    signInWithPassword.mockReset();
    signOut.mockReset();
    verifyOTP.mockReset();
    storageUpload.mockReset();
    getPublicUrl.mockReset();
    storageFrom.mockClear();
  });

  it('fails closed when OTP verification service is unavailable', async () => {
    verifyOTP.mockRejectedValue(new Error('Authentica unavailable'));

    await expect(api.verifyOtp('0500000000', '123456', 'checkout')).resolves.toEqual({
      verified: false,
    });
  });

  it('does not create an admin session from a username without Auth success', async () => {
    signInWithPassword.mockResolvedValue({
      data: { user: null },
      error: new Error('invalid credentials'),
    });

    await expect(api.loginToAdminDashboard('admin', 'wrong-password')).rejects.toThrow(
      'Invalid Admin credentials',
    );
    expect(signInWithPassword).toHaveBeenCalledWith({
      email: 'admin',
      password: 'wrong-password',
    });
  });

  it('rejects non-image product uploads before touching cloud storage', async () => {
    await expect(api.uploadProductImage(new File(['not an image'], 'notes.txt', { type: 'text/plain' }))).rejects.toThrow(
      'Only image files are allowed',
    );
    expect(storageUpload).not.toHaveBeenCalled();
  });

  it('uploads a valid product image and returns its public URL', async () => {
    storageUpload.mockResolvedValue({ error: null });
    getPublicUrl.mockReturnValue({ data: { publicUrl: 'https://cdn.example.com/products/image.png' } });

    const result = await api.uploadProductImage(new File(['png-bytes'], 'Tomatoes photo.png', { type: 'image/png' }));

    expect(result.url).toBe('https://cdn.example.com/products/image.png');
    expect(storageFrom).toHaveBeenCalledWith('product-images');
    expect(storageUpload).toHaveBeenCalledWith(
      expect.stringMatching(/^products\/\d+-tomatoes-photo\.png$/),
      expect.any(File),
      expect.objectContaining({ contentType: 'image/png', upsert: false }),
    );
  });

  it('rejects an authenticated account that has no dashboard role', async () => {
    signInWithPassword.mockResolvedValue({
      data: {
        user: {
          id: 'customer-1',
          email: 'customer@example.com',
          user_metadata: { role: 'customer' },
        },
      },
      error: null,
    });

    await expect(
      api.loginToAdminDashboard('customer@example.com', 'correct-password'),
    ).rejects.toThrow('Invalid Admin credentials');
    expect(signOut).toHaveBeenCalledTimes(1);
  });
});
