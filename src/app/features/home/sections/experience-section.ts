import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { ROLES } from '../../../content/experience.data';
import { PROJECTS } from '../../../content/projects.data';
import { formatRange, monthSpan } from '../../../core/models/date.utils';
import { resolveProjectName, type Role } from '../../../core/models/content.models';
import { MotionService } from '../../../core/motion/motion.service';
import { RouterLink } from '@angular/router';
import { ObservedSection } from '../../../shared/directives/observed-section.directive';
import { Reveal } from '../../../shared/directives/reveal.directive';
import { SectionHeader } from '../../../shared/ui/section-header/section-header';

interface RoleView {
  readonly role: Role;
  readonly range: string;
  readonly duration: string;
  readonly projects: readonly { slug: string; name: string; deep: boolean }[];
}

/**
 * Company-level titles only. The resume's per-project job titles are
 * deliberately not rendered: they contradict the company title for the same
 * months and would undercut seniority on a page where both are visible at once.
 *
 * The scrubbed spine is requested through MotionService rather than built here,
 * so this component owns no GSAP import, no ScrollTrigger and no scroll
 * listener of its own.
 */
@Component({
  selector: 'app-experience-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeader, ObservedSection, Reveal, RouterLink],
  templateUrl: './experience-section.html',
  styleUrl: './experience-section.scss',
})
export class ExperienceSection implements AfterViewInit {
  private readonly motion = inject(MotionService);
  private readonly wrap = viewChild.required<ElementRef<HTMLElement>>('timelineWrap');
  private readonly spine = viewChild.required<ElementRef<HTMLElement>>('spine');

  protected readonly roles: readonly RoleView[] = ROLES.map((role) => ({
    role,
    range: formatRange(role.start, role.end),
    duration: monthSpan(role.start, role.end),
    projects: role.projectSlugs
      .map((slug) => PROJECTS.find((project) => project.slug === slug))
      .filter((project) => project !== undefined)
      .map((project) => ({
        slug: project.slug,
        name: resolveProjectName(project),
        // Only deep-tier projects have a route; the rest are plain labels, so
        // the timeline never offers a link that goes nowhere.
        deep: project.tier === 'deep',
      })),
  }));

  /**
   * AfterViewInit, not OnInit: `viewChild.required()` throws if read before the
   * view exists, and that exception lands in the middle of hydration.
   */
  ngAfterViewInit(): void {
    this.motion.registerTimeline({
      container: this.wrap().nativeElement,
      progressBar: this.spine().nativeElement,
      itemSelector: '[data-timeline-item]',
      bodySelector: '[data-timeline-body]',
      activeClass: 'is-active',
    });
  }
}
