import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-lang-switcher',
  imports: [MatButtonToggleModule, TranslocoPipe],
  templateUrl: './lang-switcher.component.html',
  styleUrl: './lang-switcher.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LangSwitcherComponent {
  private readonly transloco = inject(TranslocoService);
  private readonly storage = inject(StorageService);

  protected readonly activeLang = signal<'fr' | 'en'>(this.storage.getLang());

  protected switchLang(lang: 'fr' | 'en'): void {
    if (this.activeLang() === lang) {
      return;
    }
    this.storage.setLang(lang);
    this.transloco.setActiveLang(lang);
    document.documentElement.lang = lang;
    this.activeLang.set(lang);
  }
}
