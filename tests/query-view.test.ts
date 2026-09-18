import { describe, expect, it } from "vitest";

import { QueryView } from "../src/query-view";

describe("QueryView", () => {
  it("reproduces the query string the console itself produces", () => {
    const url = new URL(QueryView.prefixUrl(["orders"], "p60"));

    expect(url.searchParams.get("query")).toBe(
      "2|LIM|2/50|WH|1|8/__name__|GTE|STR|3/p60",
    );
    expect(url.searchParams.get("view")).toBe("query-view");
    expect(url.searchParams.get("scopeType")).toBe("collection");
    expect(url.searchParams.get("scopeName")).toBe("orders");
  });

  it("prefixes each value with its own length", () => {
    const query = new URL(
      QueryView.prefixUrl(["orders"], "ab"),
    ).searchParams.get("query");

    expect(query).toContain("|2/ab");
  });

  it("joins a nested collection path with slashes", () => {
    const url = new URL(
      QueryView.prefixUrl(["orders", "abc123", "items"], "x"),
    );

    expect(url.searchParams.get("scopeName")).toBe("orders/abc123/items");
  });

  it("keeps the project and database path of the page it was opened from", () => {
    const url = new URL(QueryView.prefixUrl(["orders"], "p60"));

    expect(url.pathname).toBe(new URL(location.href).pathname);
    expect(url.origin).toBe("https://console.firebase.google.com");
  });
});
