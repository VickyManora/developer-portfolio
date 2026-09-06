import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CONTACT, PROFILE } from '../../../content/profile.data';
import { yearsOfExperience } from '../../../core/models/date.utils';
import { ObservedSection } from '../../../shared/directives/observed-section.directive';

interface Char {
  readonly value: string;
  readonly delay: string;
}

@Component({
  selector: 'app-hero-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ObservedSection],
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.scss',
})
export class HeroSection {
  protected readonly profile = PROFILE;
  protected readonly contact = CONTACT;

  /**
   * Computed from the career start (Jun 2017) against the frozen build date,
   * per locked decision 10 — so the figure cannot go stale.
   */
  protected readonly years = yearsOfExperience(PROFILE.careerStart).toUpperCase();

  protected readonly proofChips = ['ANGULAR · REACT · NODE', 'AWS · AZURE'];

  /**
   * The name, split for the single approved character-level animation.
   *
   * Split at build/render time rather than by a JS text-splitting library:
   * the characters exist in the prerendered HTML, so the LCP element is real
   * text from the first byte. The full name is also exposed to assistive
   * technology as one string via aria-label, because a screen reader must not
   * hear it letter by letter.
   */
  protected readonly nameChars: readonly Char[] = HeroSection.splitName(PROFILE.name);

  /**
   * Staggers the name with NEGATIVE animation delays.
   *
   * A positive delay would defer the paint of the LCP element: Chrome does not
   * record LCP for an element whose animation has not started yet, and measuring
   * showed exactly that — LCP landed at FCP + the delay of whichever character
   * won the LCP race, costing ~130ms.
   *
   * A negative delay starts every character mid-animation at t=0, so all glyphs
   * are painted in the first frame. The stagger is preserved by giving the
   * leftmost character the largest offset, so the name settles left to right.
   */
  private static splitName(name: string): readonly Char[] {
    const chars = Array.from(name);
    const step = 22;
    return chars.map((value, index) => ({
      value,
      delay: `-${(chars.length - 1 - index) * step}ms`,
    }));
  }
}
