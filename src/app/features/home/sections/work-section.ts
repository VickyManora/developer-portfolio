import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PROJECTS } from '../../../content/projects.data';
import { formatRange } from '../../../core/models/date.utils';
import { isPending, resolveProjectName, type Project } from '../../../core/models/content.models';
import { ObservedSection } from '../../../shared/directives/observed-section.directive';
import { SectionHeader } from '../../../shared/ui/section-header/section-header';
import { TagChip } from '../../../shared/ui/tag-chip/tag-chip';
import { PendingNote } from '../../../shared/ui/pending-note/pending-note';
import { Reveal } from '../../../shared/directives/reveal.directive';
import { RevealGroup } from '../../../shared/directives/reveal-group.directive';
import { ProjectCard } from './project-card/project-card';

interface ProjectView {
  readonly project: Project;
  readonly name: string;
  readonly range: string;
  readonly stack: readonly string[] | null;
  readonly summary: string;
}

/**
 * Two-tier presentation, per the locked plan: Krista and Unitrax get full
 * prerendered case-study routes; the remaining four are rich expandable cards.
 *
 * The expandable cards use native <details>/<summary>. That is a deliberate
 * choice over a signal-driven accordion: it is keyboard and screen-reader
 * correct with no ARIA to get wrong, it works before hydration on a prerendered
 * page, and it costs zero JavaScript.
 */
@Component({
  selector: 'app-work-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    SectionHeader,
    TagChip,
    PendingNote,
    ObservedSection,
    Reveal,
    RevealGroup,
    ProjectCard,
  ],
  templateUrl: './work-section.html',
  styleUrl: './work-section.scss',
})
export class WorkSection {
  private static toView(project: Project): ProjectView {
    return {
      project,
      name: resolveProjectName(project),
      range: formatRange(project.start, project.end),
      stack: isPending(project.stack) ? null : project.stack,
      summary: project.summary,
    };
  }

  protected readonly deepProjects: readonly ProjectView[] = PROJECTS.filter(
    (project) => project.tier === 'deep',
  ).map((project) => WorkSection.toView(project));

  protected readonly cardProjects: readonly ProjectView[] = PROJECTS.filter(
    (project) => project.tier === 'card',
  ).map((project) => WorkSection.toView(project));
}
