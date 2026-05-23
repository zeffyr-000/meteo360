import { TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { vi } from 'vitest';

import { getTranslocoTestingModule } from '../testing/transloco-testing.module';
import { MetadataService } from './metadata.service';

describe('MetadataService', () => {
    const titleMock = { setTitle: vi.fn() };
    const metaMock = { updateTag: vi.fn() };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [getTranslocoTestingModule()],
            providers: [
                MetadataService,
                { provide: Title, useValue: titleMock },
                { provide: Meta, useValue: metaMock }
            ]
        });
        vi.clearAllMocks();
    });

    it('sets the app title and default description when called with no args', () => {
        const service = TestBed.inject(MetadataService);

        service.updatePageMetadata();

        expect(titleMock.setTitle).toHaveBeenCalledWith('Meteo360');
        expect(metaMock.updateTag).toHaveBeenCalledWith({
            name: 'description',
            content: 'Prévisions météo en temps réel. Consultez les conditions actuelles et les prévisions horaires pour n\'importe quelle ville.'
        });
    });

    it('prefixes the app title when a custom title is provided', () => {
        const service = TestBed.inject(MetadataService);

        service.updatePageMetadata({ title: 'Météo' });

        expect(titleMock.setTitle).toHaveBeenCalledWith('Météo – Meteo360');
    });

    it('uses the provided description over the default', () => {
        const service = TestBed.inject(MetadataService);

        service.updatePageMetadata({ description: 'Custom description' });

        expect(metaMock.updateTag).toHaveBeenCalledWith({
            name: 'description',
            content: 'Custom description'
        });
    });

    it('sets both custom title and description', () => {
        const service = TestBed.inject(MetadataService);

        service.updatePageMetadata({ title: 'Mentions légales', description: 'Page légale' });

        expect(titleMock.setTitle).toHaveBeenCalledWith('Mentions légales – Meteo360');
        expect(metaMock.updateTag).toHaveBeenCalledWith({
            name: 'description',
            content: 'Page légale'
        });
    });

    it('resets to app title and default description', () => {
        const service = TestBed.inject(MetadataService);

        service.resetToDefaults();

        expect(titleMock.setTitle).toHaveBeenCalledWith('Meteo360');
        expect(metaMock.updateTag).toHaveBeenCalledWith({
            name: 'description',
            content: 'Prévisions météo en temps réel. Consultez les conditions actuelles et les prévisions horaires pour n\'importe quelle ville.'
        });
    });
});
