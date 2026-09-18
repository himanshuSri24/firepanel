---
name: Something broke
about: A filter box, the copy button or a search stopped working
labels: bug
---

The Firebase console's markup is not a public API, so a change on Google's side
can break this without warning. These details make it quick to pin down.

**What stopped working**

<!-- e.g. "the filter box no longer appears on the documents list" -->

**Where**

- Panel: collections / documents / subcollections / the fields of a document
- Theme: light / dark

**Extension version**

<!-- chrome://extensions/ shows it under the extension's name -->

**Chrome version**

<!-- chrome://version/ , first line -->

**Console output**

<!--
Open DevTools on the console page and paste anything prefixed [Firepanel].
If the fields of a document will not expand, also paste the output of:
    __firepanelDebug()
If colours look wrong, paste:
    __firepanelTheme()
-->
