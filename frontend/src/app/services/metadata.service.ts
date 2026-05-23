import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { TranslocoService } from '@jsverse/transloco';

export interface PageMetadata {
    title?: string;
    description?: string;
}

@Injectable({ providedIn: 'root' })
export class MetadataService {
    private readonly titleService = inject(Title);
    private readonly metaService = inject(Meta);
    private readonly transloco = inject(TranslocoService);

    updatePageMetadata({ title, description }: PageMetadata = {}): void {
        const defaultTitle = this.transloco.translate<string>('app.title');
        const defaultDescription = this.transloco.translate<string>('seo.default.description');
        const fullTitle = title ? `${title} – ${defaultTitle}` : defaultTitle;
        this.titleService.setTitle(fullTitle);
        this.metaService.updateTag({
            name: 'description',
            content: description ?? defaultDescription
        });
    }

    resetToDefaults(): void {
        this.updatePageMetadata();
    }
}
