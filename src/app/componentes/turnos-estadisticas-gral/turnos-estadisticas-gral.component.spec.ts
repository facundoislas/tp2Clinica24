import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnosEstadisticasGralComponent } from './turnos-estadisticas-gral.component';

describe('TurnosEstadisticasGralComponent', () => {
  let component: TurnosEstadisticasGralComponent;
  let fixture: ComponentFixture<TurnosEstadisticasGralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TurnosEstadisticasGralComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TurnosEstadisticasGralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
