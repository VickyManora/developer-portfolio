import { Directive, ElementRef, inject, OnDestroy, OnInit } from '@angular/core';
import { ActiveSectionService } from '../../core/services/active-section.service';

/**
 * Registers a section element with the shared IntersectionObserver.
 * Applied as `<section id="work" appObservedSection>`.
 */
@Directive({
  selector: '[appObservedSection]',
})
export class ObservedSection implements OnInit, OnDestroy {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly activeSection = inject(ActiveSectionService);

  ngOnInit(): void {
    this.activeSection.register(this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.activeSection.unregister(this.elementRef.nativeElement);
  }
}
