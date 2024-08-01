import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnosPorMedicoFinalizadosComponent } from './turnos-por-medico-finalizados.component';

describe('TurnosPorMedicoFinalizadosComponent', () => {
  let component: TurnosPorMedicoFinalizadosComponent;
  let fixture: ComponentFixture<TurnosPorMedicoFinalizadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TurnosPorMedicoFinalizadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TurnosPorMedicoFinalizadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
