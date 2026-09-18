/**
 * The manifest is generated so that the version, name and description have a
 * single source of truth in package.json, and so the Chrome Web Store's field
 * limits are enforced at build time rather than at submission time.
 */

import { readFileSync, writeFileSync } from "fs";

const NAME_LIMIT = 75;
const DESCRIPTION_LIMIT = 132;

const pkg = JSON.parse(readFileSync("package.json", "utf8"));

const manifest = {
  manifest_version: 3,
  name: pkg.productName,
  version: pkg.version,
  description: pkg.description,
  homepage_url: pkg.homepage,
  minimum_chrome_version: "88",
  icons: {
    16: "icons/icon16.png",
    48: "icons/icon48.png",
    128: "icons/icon128.png",
  },
  permissions: ["clipboardWrite"],
  content_scripts: [
    {
      matches: ["https://console.firebase.google.com/*"],
      js: ["content.js"],
      run_at: "document_idle",
    },
  ],
};

if (manifest.name.length > NAME_LIMIT) {
  throw new Error(
    `name is ${manifest.name.length} characters, limit is ${NAME_LIMIT}`,
  );
}

if (manifest.description.length > DESCRIPTION_LIMIT) {
  throw new Error(
    `description is ${manifest.description.length} characters, limit is ${DESCRIPTION_LIMIT}`,
  );
}

writeFileSync("dist/manifest.json", `${JSON.stringify(manifest, null, 2)}\n`);

console.log(
  `manifest v${manifest.version} — description ${manifest.description.length}/${DESCRIPTION_LIMIT} chars`,
);
