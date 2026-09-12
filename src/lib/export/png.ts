'use client';

import { toPng } from 'html-to-image';
import { Language } from '@/types';
import { t } from '@/lib/i18n';
import { disclaimerLine } from '@/components/common/Disclaimer';

/** The node the capture is taken from — set on the analysis block in SinglePageView. */
export const CAPTURE_ROOT_ID = 'risk-capture-root';

export class NothingToCaptureError extends Error {
  constructor(selector: string) {
    super(`No element matching "${selector}" is on the page to capture`);
    this.name = 'NothingToCaptureError';
  }
}

/**
 * Resolve a CSS custom property against the live document.
 *
 * The capture has to be composited onto a real colour: a transparent PNG dropped
 * into a slide deck picks up whatever is behind it, and a register that renders
 * dark text on a dark slide is worse than no image.
 */
function cssVar(name: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

/**
 * Draw the captured analysis onto a titled, dated, disclaimed canvas.
 *
 * The framing is not decoration. A bare screenshot of a risk matrix travels into
 * slide decks and email with nothing attached saying what produced it, when, or on
 * whose judgement — so the caption and the notice are burned into the pixels rather
 * than left to whoever pastes it.
 */
function frame(
  capture: HTMLImageElement,
  language: Language,
  stamp: string
): HTMLCanvasElement {
  const scale = 2;
  const pad = 28 * scale;
  const headerH = 58 * scale;
  const footerH = 46 * scale;

  const canvas = document.createElement('canvas');
  canvas.width = capture.width + pad * 2;
  canvas.height = capture.height + headerH + footerH + pad;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get a 2D canvas context for the PNG export');

  const surface = cssVar('--background', '#fbfaf8');
  const ink = cssVar('--foreground', '#232019');
  const muted = cssVar('--muted-foreground', '#6b6459');
  const brand = cssVar('--brand', '#b1302a');

  ctx.fillStyle = surface;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Title
  ctx.fillStyle = ink;
  ctx.font = `600 ${17 * scale}px "IBM Plex Sans", "Noto Sans TC", system-ui, sans-serif`;
  ctx.textBaseline = 'middle';
  ctx.fillText(t('appTitle', language), pad, headerH * 0.45);

  // Date, right-aligned
  ctx.fillStyle = muted;
  ctx.font = `${11 * scale}px "IBM Plex Mono", monospace`;
  ctx.textAlign = 'right';
  ctx.fillText(stamp, canvas.width - pad, headerH * 0.45);
  ctx.textAlign = 'left';

  // Brand rule
  ctx.fillStyle = brand;
  ctx.fillRect(pad, headerH * 0.78, 34 * scale, 2 * scale);

  ctx.drawImage(capture, pad, headerH);

  // Disclaimer, wrapped to the canvas width
  ctx.fillStyle = muted;
  ctx.font = `${10 * scale}px "IBM Plex Sans", "Noto Sans TC", system-ui, sans-serif`;
  const maxWidth = canvas.width - pad * 2;
  const lineHeight = 13 * scale;
  let line = '';
  let y = headerH + capture.height + 16 * scale;
  let lines = 0;

  // Chinese does not break on spaces, so fall back to per-character wrapping.
  const text = disclaimerLine(language);
  const tokens = language === 'zh-TW' ? [...text] : text.split(' ');
  const joiner = language === 'zh-TW' ? '' : ' ';

  for (const token of tokens) {
    const candidate = line ? line + joiner + token : token;
    if (ctx.measureText(candidate).width > maxWidth && line) {
      ctx.fillText(line, pad, y);
      y += lineHeight;
      line = token;
      if (++lines >= 2) break;
    } else {
      line = candidate;
    }
  }
  if (lines < 3 && line) ctx.fillText(line, pad, y);

  return canvas;
}

/**
 * Capture the analysis block as a PNG.
 *
 * `stamp` is passed in rather than read from the clock here so the caller owns the
 * timestamp and the function stays testable.
 */
export async function exportToPng(language: Language, stamp: string): Promise<void> {
  const node = document.getElementById(CAPTURE_ROOT_ID);
  if (!node) throw new NothingToCaptureError(`#${CAPTURE_ROOT_ID}`);

  const dataUrl = await toPng(node, {
    pixelRatio: 2,
    cacheBust: true,
    backgroundColor: cssVar('--background', '#fbfaf8'),
    // Controls are interface, not findings; they would only confuse a static image.
    filter: (el) => !(el instanceof HTMLElement && el.classList.contains('no-print')),
  });

  const capture = new Image();
  await new Promise<void>((resolve, reject) => {
    capture.onload = () => resolve();
    capture.onerror = () => reject(new Error('The captured image could not be decoded'));
    capture.src = dataUrl;
  });

  const canvas = frame(capture, language, stamp);
  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png');
  link.download = `risk-register-${stamp}.png`;
  link.click();
}
