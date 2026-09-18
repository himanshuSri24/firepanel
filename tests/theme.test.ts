import { afterEach, describe, expect, it } from "vitest";

import { Theme } from "../src/theme";

afterEach(() => {
  document.body.replaceChildren();
  document.body.style.backgroundColor = "";
  document.documentElement.style.backgroundColor = "";
});

describe("Theme", () => {
  // Regression: surfaceOf used to fall back to isDark, which called surfaceOf,
  // so a page with nothing painted blew the stack and took the extension down.
  it("does not recurse when nothing in the page is painted", () => {
    expect(() => Theme.isDark()).not.toThrow();
    expect(() => Theme.surfaceOf(document.body)).not.toThrow();
    expect(() => Theme.fingerprint()).not.toThrow();
  });

  it("reads the first painted ancestor rather than the element itself", () => {
    const parent = document.createElement("div");
    parent.style.backgroundColor = "rgb(20, 30, 40)";

    const child = document.createElement("div");
    parent.append(child);
    document.body.append(parent);

    expect(Theme.surfaceOf(child)).toBe("rgb(20, 30, 40)");
  });

  it("treats a fully transparent background as unpainted", () => {
    const element = document.createElement("div");
    element.style.backgroundColor = "rgba(0, 0, 0, 0)";
    document.body.style.backgroundColor = "rgb(255, 255, 255)";
    document.body.append(element);

    expect(Theme.surfaceOf(element)).toBe("rgb(255, 255, 255)");
  });

  it("calls a dark page dark and a light page light", () => {
    document.body.style.backgroundColor = "rgb(31, 36, 48)";
    expect(Theme.isDark()).toBe(true);

    document.body.style.backgroundColor = "rgb(255, 255, 255)";
    expect(Theme.isDark()).toBe(false);
  });

  it("picks the accent that belongs to the resolved theme", () => {
    document.body.style.backgroundColor = "rgb(31, 36, 48)";
    expect(Theme.accent()).toBe("#8ab4f8");

    document.body.style.backgroundColor = "rgb(255, 255, 255)";
    expect(Theme.accent()).toBe("#1a73e8");
  });

  it("changes its fingerprint when the painted surface changes", () => {
    document.body.style.backgroundColor = "rgb(31, 36, 48)";
    const dark = Theme.fingerprint();

    document.body.style.backgroundColor = "rgb(255, 255, 255)";

    expect(Theme.fingerprint()).not.toBe(dark);
  });
});
