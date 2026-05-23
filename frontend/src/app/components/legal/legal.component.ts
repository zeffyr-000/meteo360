import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';

import { MetadataService } from '../../services/metadata.service';

@Component({
  selector: 'app-legal',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    RouterModule,
    TranslocoPipe
  ],
  templateUrl: './legal.component.html',
  styleUrl: './legal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LegalComponent implements OnInit {
  protected readonly authorGithub = 'https://github.com/zeffyr-000/';
  protected readonly projectRepo = 'https://github.com/zeffyr-000/meteo360';
  protected readonly openMeteoUrl = 'https://open-meteo.com/';

  private readonly metadataService = inject(MetadataService);

  ngOnInit(): void {
    this.metadataService.updatePageMetadata({
      titleKey: 'legal.title',
      descriptionKey: 'seo.legal.description'
    });
  }
}
