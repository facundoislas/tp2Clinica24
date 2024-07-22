import { TestBed } from '@angular/core/testing';

import { HorariosEspecialistaService } from './horarios-especialista.service';

describe('HorariosEspecialistaService', () => {
  let service: HorariosEspecialistaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HorariosEspecialistaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
