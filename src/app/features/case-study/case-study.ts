import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PROJECTS } from '../../content/projects.data';
import { caseStudyFor } from '../../content/case-studies.data';
import { OG_IMAGE } from '../../content/seo.data';
import { formatRange } from '../../core/models/date.utils';
import {
  isPending,
  resolveClientName,
  resolveProjectName,
  type CaseStudySection,
  type Metric,
} from '../../core/models/content.models';
import { ContentDraftService } from '../../core/services/content-draft.service';
import { SeoService } from '../../core/services/seo.service';
import { StructuredDataService } from '../../core/services/structured-data.service';
import { TagChip } from '../../shared/ui/tag-chip/tag-chip';
import { StatBlock } from '../../shared/ui/stat-block/stat-block';
import { PendingNote } from '../../shared/ui/pending-note/pending-note';
import { SystemBackdrop } from '../../shared/ui/system-backdrop/system-backdrop';
import { Reveal } from '../../shared/directives/reveal.directive';
import { ConceptMap } from './concept-map/concept-map';

interface SectionView {
  readonly section: CaseStudySection;
  readonly metrics: readonly Metric[];
}

/**
 * Deep case-study route.
 *
 * Content safety is structural, not editorial discipline: sections carry a
 * `confidence` and the template renders each one differently. `verified`
 * sections show verbatim resume bullets and approved metrics; `editorial`
 * sections show prose that interprets that work; `needs-input` sections render
 * an explicit marker and never prose.
 *
 * The page is deliberately WebGL-free. It carries the static system backdrop
 * for visual continuity with the homepage, but loading the 115KB engine for a
 * text page would trade real performance for decoration.
 */
@Component({
  selector: 'app-case-study',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, TagChip, StatBlock, PendingNote, ConceptMap, SystemBackdrop, Reveal],
  templateUrl: './case-study.html',
  styleUrl: './case-study.scss',
})
export class CaseStudy implements OnInit {
  /** Bound from the route parameter via withComponentInputBinding(). */
  readonly slug = input.required<string>();

  private readonly seo = inject(SeoService);
  private readonly structuredData = inject(StructuredDataService);
  private readonly draft = inject(ContentDraftService);

  protected readonly project = computed(() =>
    PROJECTS.find((candidate) => candidate.slug === this.slug()),
  );

  protected readonly study = computed(() => caseStudyFor(this.slug()));

  protected readonly view = computed(() => {
    const project = this.project();
    const study = this.study();
    if (!project || !study) return null;

    return {
      // Every visible name goes through the naming resolver, so an anonymized
      // project never leaks its client anywhere on the page.
      name: resolveProjectName(project),
      client: resolveClientName(project),
      named: project.client.publicNameCleared,
      range: formatRange(project.start, project.end),
      stack: isPending(project.stack) ? null : project.stack,
      hardMetrics: project.metrics.filter((metric) => metric.weight === 'hard'),
      // Unresolved sections are omitted outside draft mode: an empty numbered
      // heading reads as an unfinished page, which is worse than not having
      // the section at all until the content exists.
      sections: study.sections
        .filter((section) => section.confidence !== 'needs-input' || this.draft.enabled())
        .map<SectionView>((section) => ({
        section,
          metrics: (section.metricLabels ?? [])
            .map((label) => project.metrics.find((metric) => metric.label === label))
            .filter((metric) => metric !== undefined),
        })),
      study,
      project,
    };
  });

  ngOnInit(): void {
    const project = this.project();
    const study = this.study();

    if (!project || !study) {
      this.seo.apply({
        title: 'Case study not found',
        description: 'The requested case study does not exist.',
        path: `/work/${this.slug()}`,
        noIndex: true,
      });
      return;
    }

    const name = resolveProjectName(project);
    this.seo.apply({
      title: name,
      description: study.positioning,
      path: `/work/${project.slug}`,
      type: 'article',
      ogImage: OG_IMAGE,
    });
    this.structuredData.applyCaseStudySchema(name, study.positioning, `/work/${project.slug}`);
  }
}
