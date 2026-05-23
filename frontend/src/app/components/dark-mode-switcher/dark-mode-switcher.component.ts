import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { TranslocoPipe } from '@jsverse/transloco';

import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-dark-mode-switcher',
  imports: [MatButtonToggleModule, TranslocoPipe],
  templateUrl: './dark-mode-switcher.component.html',
  styleUrl: './dark-mode-switcher.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DarkModeSwitcherComponent {
  private readonly storage = inject(StorageService);

  protected readonly darkMode = signal<boolean>(this.storage.getDarkMode());

  protected toggle(theme: 'light' | 'dark'): void {
    const isDark = theme === 'dark';
    this.storage.setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
    this.darkMode.set(isDark);
  }
}
