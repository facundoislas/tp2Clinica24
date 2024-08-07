import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnosEspecialidadComponent } from './turnos-especialidad.component';

describe('TurnosEspecialidadComponent', () => {
  let component: TurnosEspecialidadComponent;
  let fixture: ComponentFixture<TurnosEspecialidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TurnosEspecialidadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TurnosEspecialidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
