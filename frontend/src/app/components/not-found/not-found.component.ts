import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';

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

  ngOnInit(): void {
    this.metadataService.updatePageMetadata({
      titleKey: 'not_found.title',
      descriptionKey: 'seo.not_found.description'
    });
  }
}
