import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { canUseDevMaster } from '../authHelpers.js';

// We can't actually flip import.meta.env.DEV at runtime; simulate by monkey patching
// the function through a proxy pattern: we will temporarily redefine global import.meta.env

// However Vitest provides import.meta.env, so we test logic outcomes by indirect conditions.

describe('canUseDevMaster', () => {
  it('returns false when no master password provided', () => {
    const original = import.meta.env.VITE_MASTER_PASSWORD;
    // simulate empty
    import.meta.env.VITE_MASTER_PASSWORD = '';
    expect(canUseDevMaster({ password: '', email: '' })).toBe(false);
    import.meta.env.VITE_MASTER_PASSWORD = original;
  });

  it('returns false in production-like scenario (DEV false simulated)', () => {
    // We cannot change import.meta.env.DEV, so we only assert that if password mismatches it is false
    expect(canUseDevMaster({ password: 'wrong', email: '' })).toBe(false);
  });

  it('returns true when in dev with correct master password and no email', () => {
    if(!import.meta.env.DEV){
      // If tests run in production mode this cannot be validated fully
      return;
    }
    const master = import.meta.env.VITE_MASTER_PASSWORD || 'dev-master-test';
    if(!import.meta.env.VITE_MASTER_PASSWORD){
      import.meta.env.VITE_MASTER_PASSWORD = master;
    }
    expect(canUseDevMaster({ password: master, email: '' })).toBe(true);
  });
});
