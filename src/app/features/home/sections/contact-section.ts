import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CONTACT, PROFILE } from '../../../content/profile.data';
import { ObservedSection } from '../../../shared/directives/observed-section.directive';
import { SectionHeader } from '../../../shared/ui/section-header/section-header';
import { Reveal } from '../../../shared/directives/reveal.directive';
import { RevealGroup } from '../../../shared/directives/reveal-group.directive';

/**
 * The phone number is deliberately absent: a personal mobile on an indexed page
 * is scraped permanently and cannot be un-published (locked decision 11).
 */
@Component({
  selector: 'app-contact-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeader, ObservedSection, Reveal, RevealGroup],
  templateUrl: './contact-section.html',
  styleUrl: './contact-section.scss',
})
export class ContactSection {
  protected readonly contact = CONTACT;
  protected readonly profile = PROFILE;


}
