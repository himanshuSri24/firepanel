import { ConsoleWatcher } from "./console-watcher";
import { CopyJsonButton } from "./copy-button";
import { DocumentExpander } from "./document-expander";
import { FieldFilter } from "./field-filter";
import { PanelFilterManager } from "./list-filter";
import { Theme } from "./theme";

const MAX_CONSECUTIVE_FAILURES = 5;

class Firepanel {
  private readonly filters = new PanelFilterManager();
  private readonly copyButton = new CopyJsonButton();
  private readonly fieldFilter = new FieldFilter();
  private theme = Theme.fingerprint();
  private failures = 0;
  private stopped = false;

  start(): void {
    new ConsoleWatcher(() => this.sync()).start();
    this.exposeDebugHelpers();
  }

  // The sync runs on a timer, so an exception here would otherwise repeat for
  // as long as the tab is open.
  private sync(): void {
    if (this.stopped) return;

    try {
      this.applyThemeChange();

      this.filters.sync();
      this.copyButton.sync();
      this.fieldFilter.sync();

      this.failures = 0;
    } catch (error) {
      this.failures++;

      if (this.failures < MAX_CONSECUTIVE_FAILURES) return;

      this.stopped = true;
      console.error(
        `[Firepanel] Stopped after ${MAX_CONSECUTIVE_FAILURES} consecutive failures:`,
        error,
      );
    }
  }

  private applyThemeChange(): void {
    const theme = Theme.fingerprint();
    if (theme === this.theme) return;

    this.theme = theme;

    this.filters.destroyAll();
    this.fieldFilter.refresh();
    this.copyButton.refresh();
  }

  private exposeDebugHelpers(): void {
    Object.defineProperty(window, "__firepanelDebug", {
      value: () => new DocumentExpander().describeCollapsedSample(),
      configurable: true,
    });

    Object.defineProperty(window, "__firepanelTheme", {
      value: () => Theme.describe(),
      configurable: true,
    });
  }
}

// A crash here leaves no UI at all, so it is reported rather than swallowed.
try {
  new Firepanel().start();
} catch (error) {
  console.error("[Firepanel] Startup failed:", error);
}
