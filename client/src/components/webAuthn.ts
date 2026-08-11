/**
 * Delta Stars biometric engine.
 * Uses the browser WebAuthn platform authenticator only.
 * No virtual, local-storage-only, or simulated biometric fallback is allowed.
 */

const STORAGE_KEYS = {
  KEYS: 'delta-sovereign-keys-v22',
};

const getKeys = (): Record<string, string> => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.KEYS);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
};

const toBase64Url = (bytes: Uint8Array): string =>
  btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');

const fromBase64Url = (value: string): Uint8Array => {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((value.length + 3) % 4);
  return Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
};

export const isBiometricAvailable = async (): Promise<boolean> => {
  try {
    if (typeof window === 'undefined' || !window.isSecureContext || !window.PublicKeyCredential) return false;
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch {
    return false;
  }
};

export const registerBiometric = async (id: string): Promise<boolean> => {
  if (!(await isBiometricAvailable())) return false;

  try {
    const challenge = crypto.getRandomValues(new Uint8Array(32));
    const userId = crypto.getRandomValues(new Uint8Array(32));
    const credential = (await navigator.credentials.create({
      publicKey: {
        challenge,
        rp: { name: 'Delta Stars', id: window.location.hostname },
        user: {
          id: userId,
          name: id,
          displayName: `Delta Stars user ${id}`,
        },
        pubKeyCredParams: [
          { alg: -7, type: 'public-key' },
          { alg: -257, type: 'public-key' },
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          residentKey: 'preferred',
          userVerification: 'required',
        },
        timeout: 60_000,
        attestation: 'none',
      },
    })) as PublicKeyCredential | null;

    if (!credential) return false;

    const keys = getKeys();
    keys[id.toLowerCase()] = toBase64Url(new Uint8Array(credential.rawId));
    localStorage.setItem(STORAGE_KEYS.KEYS, JSON.stringify(keys));
    return true;
  } catch (error) {
    console.warn('[WebAuthn] Real platform enrollment failed or was cancelled.', error);
    return false;
  }
};

export const authenticateBiometric = async (id: string): Promise<boolean> => {
  if (!(await isBiometricAvailable())) return false;

  const keyId = getKeys()[id.toLowerCase()];
  if (!keyId) return false;

  try {
    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge: crypto.getRandomValues(new Uint8Array(32)),
        allowCredentials: [{ id: fromBase64Url(keyId), type: 'public-key' }],
        userVerification: 'required',
        timeout: 60_000,
      },
    });
    return Boolean(assertion);
  } catch (error) {
    console.warn('[WebAuthn] Real platform authentication failed or was cancelled.', error);
    return false;
  }
};

export const hasRegisteredKey = (id?: string): boolean =>
  id ? Boolean(getKeys()[id.toLowerCase()]) : Object.keys(getKeys()).length > 0;
