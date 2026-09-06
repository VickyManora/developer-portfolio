import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-not-found',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="container container--narrow not-found">
      <p class="meta">Error 404</p>
      <h1 class="u-h2">Page not found</h1>
      <p class="u-lede">That address does not exist on this site.</p>
      <p><a class="btn btn--primary" routerLink="/">Return to the homepage</a></p>
    </div>
  `,
  styles: `
    .not-found {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
      padding-block: clamp(64px, 14vw, 180px);
    }
  `,
})
export class NotFound implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.apply({
      title: 'Page not found',
      description: 'That address does not exist on this site.',
      path: '/404',
      noIndex: true,
    });
  }
}
