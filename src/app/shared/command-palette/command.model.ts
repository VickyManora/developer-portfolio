/** A single palette entry. Plain data so the registry can live outside the UI. */
export interface Command {
  readonly id: string;
  readonly label: string;
  /** Grouping heading in the list. */
  readonly group: string;
  /** Extra words matched by the filter but not displayed. */
  readonly keywords?: string;
  /** Shown on the right, e.g. "↗" for links. */
  readonly hint?: string;
  readonly run: () => void;
}
