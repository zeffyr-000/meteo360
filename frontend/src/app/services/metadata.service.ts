import { inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Meta, Title } from '@angular/platform-browser';
import { TranslocoService } from '@jsverse/transloco';

export interface PageMetadata {
    title?: string;
    titleKey?: string;
    description?: string;
    descriptionKey?: string;
}

@Injectable({ providedIn: 'root' })
export class MetadataService {
    private readonly titleService = inject(Title);
    private readonly metaService = inject(Meta);
    private readonly transloco = inject(TranslocoService);
    private lastMetadata: PageMetadata = {};

    constructor() {
        this.transloco.langChanges$.pipe(takeUntilDestroyed()).subscribe(() => {
            this.updatePageMetadata(this.lastMetadata);
        });
    }

    updatePageMetadata(metadata: PageMetadata = {}): void {
        this.lastMetadata = metadata;
        const defaultTitle = this.transloco.translate<string>('app.title');
        const defaultDescription = this.transloco.translate<string>('seo.default.description');
        const title = metadata.titleKey
            ? this.transloco.translate<string>(metadata.titleKey)
            : metadata.title;
        const description = metadata.descriptionKey
            ? this.transloco.translate<string>(metadata.descriptionKey)
            : metadata.description;
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
