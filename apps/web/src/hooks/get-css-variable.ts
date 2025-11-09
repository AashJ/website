/**
 * Gets the computed value of a CSS variable
 * @param variableName - The name of the CSS variable (e.g., "--primary-color")
 * @param element - Optional element to get the variable from. Defaults to document.documentElement
 * @returns The computed value of the CSS variable, or null if not found
 */
export function getCssVariable(
  variableName: string,
  element?: HTMLElement | null
): string | null {
  if (typeof window === "undefined") return null;

  const targetElement = element || document.documentElement;
  const computedValue =
    getComputedStyle(targetElement).getPropertyValue(variableName);

  return computedValue.trim() || null;
}
