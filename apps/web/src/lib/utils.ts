import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts OKLCH color to hex string
 * @param l - Lightness (0-1 or 0-100)
 * @param c - Chroma (0+)
 * @param h - Hue in degrees (0-360)
 * @returns Hex color string (e.g., "#ff0000")
 */
export function oklchToHex(l: number, c: number, h: number): string {
  // Normalize lightness to 0-1 range if it's 0-100
  const normalizedL = l > 1 ? l / 100 : l;

  // Convert hue to radians
  const hRad = (h * Math.PI) / 180;

  // Convert OKLCH to OKLab
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);

  // Convert OKLab to linear RGB
  const l_ = normalizedL + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = normalizedL - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = normalizedL - 0.0894841775 * a - 1.291485548 * b;

  const lCube = l_ * l_ * l_;
  const mCube = m_ * m_ * m_;
  const sCube = s_ * s_ * s_;

  // Convert to linear RGB
  const r = +4.0767416621 * lCube - 3.3077115913 * mCube + 0.2309699292 * sCube;
  const g = -1.2684380046 * lCube + 2.6097574011 * mCube - 0.3413193965 * sCube;
  const bl = -0.0041960863 * lCube - 0.7034186147 * mCube + 1.707614701 * sCube;

  // Apply gamma correction (linear to sRGB)
  const gammaCorrect = (val: number) => {
    if (val <= 0.0031308) {
      return 12.92 * val;
    }
    return 1.055 * Math.pow(val, 1 / 2.4) - 0.055;
  };

  const rGamma = gammaCorrect(r);
  const gGamma = gammaCorrect(g);
  const bGamma = gammaCorrect(bl);

  // Clamp values to 0-1 range
  const clamp = (val: number) => Math.max(0, Math.min(1, val));

  const rClamped = clamp(rGamma);
  const gClamped = clamp(gGamma);
  const bClamped = clamp(bGamma);

  // Convert to 0-255 range and then to hex
  const toHex = (val: number) => {
    const hex = Math.round(val * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(rClamped)}${toHex(gClamped)}${toHex(bClamped)}`;
}

/**
 * Converts an OKLCH string to hex
 * @param oklchString - OKLCH color string (e.g., "oklch(1 0 0)" or "oklch(0.7, 0.15, 120)")
 * @returns Hex color string (e.g., "#ff0000")
 */
export function oklchStringToHex(oklchString: string): string {
  // Remove whitespace and convert to lowercase
  const normalized = oklchString.trim().toLowerCase();

  // Match oklch(...) pattern
  const match = normalized.match(/oklch\(([^)]+)\)/);
  if (!match) {
    throw new Error(`Invalid OKLCH string format: ${oklchString}`);
  }

  // Extract values - handle both space and comma separators
  const values = match[1]
    .split(/[\s,]+/)
    .map((v) => v.trim())
    .filter((v) => v && v !== "/") // Remove empty strings and alpha separator
    .map((v) => parseFloat(v));

  if (values.length < 3) {
    throw new Error(
      `Invalid OKLCH string: expected 3 values, got ${values.length}`
    );
  }

  const [l, c, h] = values;

  // Handle missing hue (default to 0)
  const hue = isNaN(h) ? 0 : h;

  return oklchToHex(l, c, hue);
}

/**
 * Parses frontmatter from markdown content
 * @param content - The markdown content string
 * @returns Object with title, slug, and summary if valid frontmatter is found, null otherwise
 */
export function isPost(
  content: string
): { title: string; slug: string } | null {
  // Regex to match frontmatter delimited by ---
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return null;
  }

  const frontmatter = match[1];

  // Extract title, slug, and summary
  const titleMatch = frontmatter.match(/title:\s*["'](.+?)["']/);
  const slugMatch = frontmatter.match(/slug:\s*["'](.+?)["']/);

  if (!titleMatch || !slugMatch) {
    return null;
  }

  return {
    title: titleMatch[1],
    slug: slugMatch[1],
  };
}
