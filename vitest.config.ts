import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["tests/**/*.test.ts"],
    environmentOptions: {
      jsdom: {
        url: "https://console.firebase.google.com/u/0/project/demo/firestore/databases/-default-/data/~2Forders~2Fabc123",
      },
    },
  },
});
