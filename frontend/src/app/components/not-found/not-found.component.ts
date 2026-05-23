import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

import { MetadataService } from '../../services/metadata.service';

@Component({
  selector: 'app-not-found',
  imports: [
    RouterModule,
    MatButtonModule,
    MatIconModule,
    TranslocoPipe
  ],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotFoundComponent implements OnInit {
  private readonly metadataService = inject(MetadataService);
  private readonly transloco = inject(TranslocoService);

  ngOnInit(): void {
    this.metadataService.updatePageMetadata({
      title: this.transloco.translate('not_found.title'),
      description: this.transloco.translate('seo.not_found.description')
    });
  }
}
