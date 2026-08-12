import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const projectRoot = resolve(import.meta.dirname, '..');
const publicDir = resolve(projectRoot, 'client/public');
const androidResDir = resolve(projectRoot, 'android/app/src/main/res');
const expectedOfficialIconSha256 = 'accab75695d7e222f18f13021e5f339af97af18d10920575f813222e6c2f9c57';

function sha256(path: string) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

describe('Delta Stars final release assets', () => {
  it('uses the exact official icon bytes in all web icon aliases', () => {
    const icon = resolve(publicDir, 'official_logo.png');
    expect(sha256(icon)).toBe(expectedOfficialIconSha256);
    expect(readFileSync(resolve(publicDir, 'favicon.png'))).toEqual(readFileSync(icon));
    expect(readFileSync(resolve(publicDir, 'apple-touch-icon.png'))).toEqual(readFileSync(icon));
  });

  it('uses PNG-only PWA references and valid Android launcher resources', () => {
    const manifest = JSON.parse(readFileSync(resolve(publicDir, 'manifest.json'), 'utf8')) as {
      icons?: Array<{ src?: string; type?: string }>;
    };
    expect(manifest.icons?.length).toBeGreaterThan(0);
    expect(manifest.icons?.every((icon) => icon.src?.endsWith('.png') && icon.type === 'image/png')).toBe(true);

    for (const density of ['mdpi', 'hdpi', 'xhdpi', 'xxhdpi', 'xxxhdpi']) {
      expect(existsSync(resolve(androidResDir, `mipmap-${density}/ic_launcher.png`))).toBe(true);
      expect(existsSync(resolve(androidResDir, `mipmap-${density}/ic_launcher_round.png`))).toBe(true);
    }
  });
});
