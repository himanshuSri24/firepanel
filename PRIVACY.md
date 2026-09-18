# Privacy Policy

**Firepanel — tools for the Firestore console**

Last updated: 18 September 2026

## The short version

Firepanel collects nothing, stores nothing, and sends nothing anywhere.

## What the extension accesses

Firepanel runs only on `https://console.firebase.google.com/*`. On those pages it
reads the parts of the page the Firebase console has already rendered — the
names in a collection or document list, and the fields of a document you have
open — so it can filter them and copy them to your clipboard.

That data never leaves your browser. It is held in memory only for as long as
the page is open, and is discarded when you close or navigate away.

## What the extension does not do

- No analytics, telemetry, crash reporting or usage tracking of any kind.
- No network requests of its own. Firepanel contacts no server, including ours —
  there is no "ours" to contact.
- No cookies, no `localStorage`, no `chrome.storage`, no persistence at all.
- No accounts, no sign-in, no identifiers.
- No writing, editing or deleting of your Firestore data. Firepanel only reads
  what is on screen and expands rows you could expand yourself.
- No selling, sharing or transferring of data to anyone, because none is
  collected.

## Permissions and why they exist

| Permission                                   | Why                                                                                                                            |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `clipboardWrite`                             | To place the JSON of a document on your clipboard when you press **Copy JSON**.                                                |
| Host access to `console.firebase.google.com` | To add the search boxes and the copy button to the console's own pages, and to read the rendered document so it can be copied. |

Firepanel requests no other permissions and no access to any other site.

## Changes

Any change to this policy will be published in this file, and its history is
visible in the repository's git log.

## Contact

Questions or concerns: open an issue on the project's GitHub repository.
