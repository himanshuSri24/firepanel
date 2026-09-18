import { describe, expect, it } from "vitest";

import { DocumentParser } from "../src/document-parser";

function field(
  key: string,
  type: string,
  value?: string,
  children: HTMLElement[] = [],
): HTMLElement {
  const tree = document.createElement("f7e-data-tree");

  const node = document.createElement("div");
  node.className = `database-node type-${type}`;

  const target = document.createElement("div");
  target.className = "database-node-click-target";

  const keyElement = document.createElement("span");
  keyElement.className = "database-key";
  keyElement.textContent = key;
  target.append(keyElement);

  if (value !== undefined) {
    const valueElement = document.createElement("span");
    valueElement.className = "database-leaf-value";
    valueElement.textContent = value;
    target.append(valueElement);
  }

  node.append(target);

  if (children.length > 0) {
    const childContainer = document.createElement("div");
    childContainer.className = "database-children";
    childContainer.append(...children);
    node.append(childContainer);
  }

  tree.append(node);

  return tree;
}

function panelWith(...trees: HTMLElement[]): HTMLElement {
  const panel = document.createElement("f7e-fields-subpanel");
  const wrapper = document.createElement("fs-animate-change-classes");
  wrapper.append(...trees);
  panel.append(wrapper);

  return panel;
}

describe("DocumentParser", () => {
  const parser = new DocumentParser();

  it("casts each leaf to the type the console labelled it", () => {
    const panel = panelWith(
      field("name", "string", '"Acme"'),
      field("retries", "number", "3"),
      field("enabled", "boolean", "true"),
      field("deletedAt", "null", "null"),
    );

    expect(parser.parse(panel)).toEqual({
      name: "Acme",
      retries: 3,
      enabled: true,
      deletedAt: null,
    });
  });

  it("keeps timestamps as the string the console displays", () => {
    const panel = panelWith(
      field("createdAt", "timestamp", "August 27, 2026 at 7:15:00 AM UTC+5:30"),
    );

    expect(parser.parse(panel)).toEqual({
      createdAt: "August 27, 2026 at 7:15:00 AM UTC+5:30",
    });
  });

  it("nests a map as an object", () => {
    const panel = panelWith(
      field("config", "map", undefined, [
        field("retries", "number", "3"),
        field("mode", "string", '"fast"'),
      ]),
    );

    expect(parser.parse(panel)).toEqual({
      config: { retries: 3, mode: "fast" },
    });
  });

  it("orders an array by its numeric keys rather than DOM order", () => {
    const panel = panelWith(
      field("targets", "array", undefined, [
        field("1", "string", '"whatsapp"'),
        field("0", "string", '"sms"'),
      ]),
    );

    expect(parser.parse(panel)).toEqual({ targets: ["sms", "whatsapp"] });
  });

  it("distinguishes an empty map from an empty array", () => {
    const panel = panelWith(field("meta", "map"), field("tags", "array"));

    expect(parser.parse(panel)).toEqual({ meta: {}, tags: [] });
  });

  it("unwraps a string field that holds stringified JSON", () => {
    const panel = panelWith(field("payload", "string", '"{"id":7,"ok":true}"'));

    expect(parser.parse(panel)).toEqual({ payload: { id: 7, ok: true } });
  });

  it("leaves a string that merely starts like JSON alone", () => {
    const panel = panelWith(field("note", "string", '"{not json}"'));

    expect(parser.parse(panel)).toEqual({ note: "{not json}" });
  });

  it("returns null when the panel holds no fields", () => {
    expect(parser.parse(panelWith())).toBeNull();
  });
});
