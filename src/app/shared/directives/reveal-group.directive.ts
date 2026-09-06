import { Directive, ElementRef, inject, input, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MotionService } from '../../core/motion/motion.service';
import { IS_BROWSER } from '../../core/tokens/platform.tokens';

/**
 * Staggered entrance for a set of siblings, driven by ONE ScrollTrigger for
 * the whole group rather than one per child.
 *
 *   <ul appRevealGroup>...</ul>            staggers direct children
 *   <ul appRevealGroup=".card">...</ul>    staggers matching descendants
 *
 * Same two safety rules as [appReveal]: nothing above the fold is hidden, and
 * the prerendered HTML always ships visible.
 */
@Directive({
  selector: '[appRevealGroup]',
})
export class RevealGroup implements OnInit {
  readonly appRevealGroup = input<string>('');

  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly motion = inject(MotionService);
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = inject(IS_BROWSER);

  ngOnInit(): void {
    if (!this.isBrowser || !this.motion.enabled) return;

    const element = this.elementRef.nativeElement;
    const viewportHeight = this.document.defaultView?.innerHeight ?? 0;
    if (element.getBoundingClientRect().top < viewportHeight * 0.9) return;

    const selector = this.appRevealGroup() || ':scope > *';
    for (const child of Array.from(element.querySelectorAll<HTMLElement>(selector))) {
      child.classList.add('is-reveal-pending');
    }

    this.motion.register({
      element,
      variant: 'rise',
      delay: 0,
      childSelector: selector,
    });
  }
}
