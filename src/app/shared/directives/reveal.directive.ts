import { Directive, ElementRef, inject, input, numberAttribute, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MotionService, type RevealVariant } from '../../core/motion/motion.service';
import { IS_BROWSER } from '../../core/tokens/platform.tokens';

/**
 * Scroll-triggered entrance for a single element.
 *
 *   <div appReveal>              rise + fade
 *   <div appReveal="fade">       fade only
 *   <div appReveal revealDelay="120">
 *
 * Two rules make this safe on a prerendered page:
 *
 * 1. The element is only hidden if it is BELOW the fold when the directive
 *    initialises. Anything already on screen is never touched, so there is no
 *    flash of hidden content and the LCP element can never be delayed.
 * 2. Hiding happens client-side only. The prerendered HTML always ships in the
 *    final visible state, so a crawler — or a visitor whose JS fails — sees the
 *    complete page.
 */
@Directive({
  selector: '[appReveal]',
})
export class Reveal implements OnInit {
  readonly appReveal = input<RevealVariant | ''>('');
  readonly revealDelay = input(0, { transform: numberAttribute });

  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly motion = inject(MotionService);
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = inject(IS_BROWSER);

  ngOnInit(): void {
    if (!this.isBrowser || !this.motion.enabled) return;

    const element = this.elementRef.nativeElement;
    const viewportHeight = this.document.defaultView?.innerHeight ?? 0;

    // Already visible: leave it exactly as prerendered.
    if (element.getBoundingClientRect().top < viewportHeight * 0.9) return;

    element.classList.add('is-reveal-pending');
    this.motion.register({
      element,
      variant: this.appReveal() === 'fade' ? 'fade' : 'rise',
      delay: this.revealDelay() / 1000,
    });
  }
}
