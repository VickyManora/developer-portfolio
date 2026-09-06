import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CONTACT, PROFILE } from '../../content/profile.data';
import { BUILD_INFO } from '../../../environments/build-info';

@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="footer">
      <div class="footer__inner">
        <div class="footer__identity">
          <span class="footer__mark" aria-hidden="true"></span>
          <div>
            <p class="footer__name">{{ profile.name }}</p>
            <p class="meta">{{ profile.role }}</p>
          </div>
        </div>

        <nav class="footer__links" aria-label="Elsewhere">
          <a [href]="contact.github" rel="me noopener" target="_blank">GitHub</a>
          <a [href]="contact.linkedin" rel="me noopener" target="_blank">LinkedIn</a>
          <a [href]="'mailto:' + contact.email">Email</a>
          <a [href]="contact.resumeFile" download>Résumé</a>
        </nav>

        <p class="meta footer__built">Built {{ builtMonth }}</p>
      </div>
    </footer>
  `,
  styleUrl: './footer.scss',
})
export class Footer {
  protected readonly profile = PROFILE;
  protected readonly contact = CONTACT;
  protected readonly builtMonth = BUILD_INFO.builtMonth;
}
