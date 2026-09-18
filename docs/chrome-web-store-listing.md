# Chrome Web Store listing

Everything the submission form asks for, written out so it can be pasted rather
than improvised at the keyboard. Keep this file in step with what is actually
published — a listing that drifts from the code is what gets flagged on a later
review.

## Identity

| Field      | Value                                       |
| ---------- | ------------------------------------------- |
| Name       | Firepanel — tools for the Firestore console |
| Category   | Developer Tools                             |
| Language   | English (United Kingdom)                    |
| Visibility | Public                                      |

## Short description

Limit 132 characters; this is generated into the manifest and validated at build
time, so change it in `package.json` rather than here.

> Search every list, filter fields by key or value, and copy whole documents as JSON. Read-only. Not affiliated with Google.

## Detailed description

> Firepanel adds the three things the Firebase Firestore console is missing, and
> nothing else.
>
> SEARCH EVERY LIST
> A filter box on every list panel — collections, the documents inside a
> collection, and the subcollections of a document. Type to filter, click or
> press Enter to open, Esc to clear. Matches are highlighted.
>
> FIND A DOCUMENT BY ID
> The console stops loading rows into a document list after a few hundred, so a
> document further down is unreachable by scrolling. Type part of an ID to search
> the whole collection by prefix, or paste a full ID to jump straight to it.
>
> FILTER THE FIELDS OF A DOCUMENT
> Filter an open document by field name or by value, nested fields included, so
> you can find which field holds a value instead of reading down the page.
>
> COPY A WHOLE DOCUMENT AS JSON
> One button in the breadcrumb bar. Every collapsed map and array is expanded
> first, so you get the complete document rather than the branches you happened
> to have open.
>
> READ-ONLY BY DESIGN
> Firepanel holds one permission — clipboard write — runs only on
> console.firebase.google.com, and makes no network requests of its own. It
> cannot add, edit or delete your data. It collects nothing and sends nothing
> anywhere.
>
> Firepanel is an independent project. It is not affiliated with, endorsed by, or
> sponsored by Google. Firebase and Firestore are trademarks of Google LLC.
>
> Source code, issues and changelog: https://github.com/himanshuSriv24/firepanel

## Single purpose

The form requires one purpose, stated plainly.

> Firepanel's single purpose is to make the Firebase Firestore console's data
> viewer easier to navigate: searching its lists, filtering the fields of a
> document, and copying a document as JSON.

## Permission justifications

Each one is answered in terms of what the user gets, which is what reviewers
look for.

**`clipboardWrite`**

> Used by the "Copy JSON" button to place the JSON of the document the user is
> viewing onto their clipboard. This is the only write the extension performs
> anywhere, and it happens only in response to the user clicking that button.

**Host permission — `https://console.firebase.google.com/*`**

> The extension's entire function is to add search boxes and a copy button to
> the Firebase console's own data viewer, and to read the document the console
> has already rendered so it can be copied. It runs on no other site, and it
> requests no broad host permissions.

**Remote code**

> None. The extension ships a single bundled content script. It loads no remote
> code, evaluates no strings, and makes no network requests.

## Data usage disclosures

Answer every collection category **No**, and tick all three certifications.

| Question                            | Answer                                                                                                               |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Personally identifiable information | No                                                                                                                   |
| Health information                  | No                                                                                                                   |
| Financial and payment information   | No                                                                                                                   |
| Authentication information          | No                                                                                                                   |
| Personal communications             | No                                                                                                                   |
| Location                            | No                                                                                                                   |
| Web history                         | No                                                                                                                   |
| User activity                       | No                                                                                                                   |
| Website content                     | No — page content is read in memory to render the filter and clipboard output, and is neither stored nor transmitted |

Certifications: not sold to third parties; not used or transferred for purposes
unrelated to the single purpose; not used or transferred to determine
creditworthiness or for lending.

Privacy policy URL: `https://github.com/himanshuSriv24/firepanel/blob/main/PRIVACY.md`

## Screenshots

At least one, up to five, 1280x800. Capture into `store/screenshots/raw/`, then
run `sh scripts/normalize-screenshots.sh`. Shots worth having, in this order:

1. The collections list filtered, with a match highlighted — shows the core idea
   in one glance.
2. A documents list with a partial ID typed, showing the "Search all …" and
   "Open …" action rows.
3. An open document with the field filter in use, showing the `n keys · n values`
   count.
4. A document with **Copy JSON** in the breadcrumb bar, ideally mid-copy so the
   button reads "Copied!".
5. The same view in light theme, to show it is not a dark-mode-only tool.

Use a demo or staging project. Do not publish screenshots containing real
customer data, internal collection names, or a project ID you would not want
public.

## Before submitting

- `npm run package` passes and `dist/manifest.json` shows the version you intend
  to publish.
- The version in `package.json` is higher than the one already live — the store
  rejects a re-upload of the same version.
- `PRIVACY.md` is reachable at the URL above on the default branch.
- Screenshots contain no real data.

## What to expect

Review usually takes a few days and can take longer for a first submission. The
common causes of rejection are a permission justification that describes the
mechanism rather than the user benefit, and a listing that implies affiliation
with the platform it extends — both are addressed above, which is why the
"not affiliated" line appears in the description as well as here.

After approval, publishing an update is the same flow with a higher version
number; users get it automatically within a few hours.
