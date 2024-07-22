import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Captcha2Component } from './captcha2.component';

describe('Captcha2Component', () => {
  let component: Captcha2Component;
  let fixture: ComponentFixture<Captcha2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Captcha2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Captcha2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
