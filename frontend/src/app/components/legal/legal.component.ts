import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-legal',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    RouterModule,
    TranslocoModule
  ],
  templateUrl: './legal.component.html',
  styleUrl: './legal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LegalComponent {
  protected readonly authorGithub = 'https://github.com/zeffyr-000/';
  protected readonly projectRepo = 'https://github.com/zeffyr-000/meteo360';
  protected readonly openMeteoUrl = 'https://open-meteo.com/';
}
